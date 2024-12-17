import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { decrypt } from '../../../utils/encryption';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const accessToken = session.access_token;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    return new Response(JSON.stringify({ access_token: decrypt(accessToken) }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching user access token:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch access token' }), { status: 500 });
  }
}
