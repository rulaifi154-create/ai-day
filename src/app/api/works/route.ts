import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// 获取所有作品
export async function GET() {
  try {
    const { data: works, error } = await supabase
      .from('works')
      .select(`
        *,
        users!works_author_id_fkey (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 获取每个作品的票数
    const worksWithVotes = await Promise.all(
      (works || []).map(async (work) => {
        const { count } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('work_id', work.id);

        return {
          ...work,
          voteCount: count || 0,
        };
      })
    );

    return NextResponse.json(worksWithVotes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 提交新作品
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json({ error: '作品名称和简介不能为空' }, { status: 400 });
    }

    if (title.length > 100) {
      return NextResponse.json({ error: '作品名称不能超过 100 字' }, { status: 400 });
    }

    if (description.length < 20 || description.length > 300) {
      return NextResponse.json({ error: '作品简介应在 20-300 字之间' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('works')
      .insert({
        title: title.trim(),
        description: description.trim(),
        author_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

