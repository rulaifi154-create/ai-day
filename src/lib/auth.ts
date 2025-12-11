import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).userId) {
    return null;
  }
  return (session as any).userId;
}

