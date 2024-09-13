import { authOptions } from '../[...nextauth]/route';
import { getIdToken } from '../../../../utils/sessionTokenAccessor';
import { getServerSession } from 'next-auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    const idToken = await getIdToken();

    // this will log out the user on Keycloak side
    var url = `http://localhost:8181/realms/paws-and-claws-realm/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent('http://localhost:3000')}`;

    try {
      const resp = await fetch(url, { method: 'GET' });
    } catch (err) {
      console.error(err);
      return new Response({ status: 500 });
    }
  }
  return new Response({ status: 200 });
}
