import { authOptions } from '../[...nextauth]/route';
import { getIdToken } from '../../../../utils/sessionTokenAccessor';
import { getServerSession } from 'next-auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  // Log out the user on Keycloak side
  if (session) {
    const idToken = await getIdToken();

    // eslint-disable-next-line max-len
    const url = `${process.env.KEYCLOAK_END_SESSION_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL)}`;

    try {
      await fetch(url, { method: 'GET' });
    } catch (error) {
      return new Response(null, { status: 500 });
    }
  }
  return new Response(null, { status: 200 });
}
