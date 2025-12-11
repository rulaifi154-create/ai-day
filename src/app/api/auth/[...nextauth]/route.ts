import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/lib/supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // 检查用户是否已存在，不存在则创建
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          if (!existingUser) {
            // 创建新用户
            await supabase.from('users').insert({
              email: user.email,
              name: user.name || null,
              avatar_url: user.image || null,
            });
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          // 获取用户 ID
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single();

          if (userData) {
            (session as any).userId = userData.id;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

