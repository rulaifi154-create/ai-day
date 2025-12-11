import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// 获取当前用户的投票记录
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ votes: [], remainingVotes: 3 });
    }

    const { data: votes, error } = await supabase
      .from('votes')
      .select('work_id')
      .eq('voter_id', userId);

    if (error) throw error;

    const votedWorkIds = (votes || []).map((v) => v.work_id);
    const remainingVotes = 3 - votedWorkIds.length;

    return NextResponse.json({
      votes: votedWorkIds,
      remainingVotes: Math.max(0, remainingVotes),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 投票
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const body = await request.json();
    const { workId } = body;

    if (!workId) {
      return NextResponse.json({ error: '作品 ID 不能为空' }, { status: 400 });
    }

    // 检查用户已投票数
    const { count: voteCount, error: countError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('voter_id', userId);

    if (countError) throw countError;

    if ((voteCount || 0) >= 3) {
      return NextResponse.json({ error: '你已经用完 3 票了' }, { status: 400 });
    }

    // 检查是否已经投过这个作品
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('voter_id', userId)
      .eq('work_id', workId)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: '你已经投过这个作品了' }, { status: 400 });
    }

    // 检查作品是否存在
    const { data: work } = await supabase
      .from('works')
      .select('id')
      .eq('id', workId)
      .single();

    if (!work) {
      return NextResponse.json({ error: '作品不存在' }, { status: 404 });
    }

    // 创建投票
    const { data, error } = await supabase
      .from('votes')
      .insert({
        voter_id: userId,
        work_id: workId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

