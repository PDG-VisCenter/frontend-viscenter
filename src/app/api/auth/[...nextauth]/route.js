import { encrypt } from '../../../../utils/encryption';
import { jwtDecode } from 'jwt-decode';
import KeycloakProvider from 'next-auth/providers/keycloak';
import NextAuth from 'next-auth';

async function refreshAccessToken(token) {
  const resp = await fetch(`${process.env.KEYCLOAK_REFRESH_TOKEN_URL}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
    }),
    method: 'POST',
  });
  const refreshToken = await resp.json();
  if (!resp.ok) throw refreshToken;

  return {
    ...token,
    access_token: refreshToken.access_token,
    decoded: jwtDecode(refreshToken.access_token),
    id_token: refreshToken.id_token,
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
  };
}

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: `${process.env.KEYCLOAK_ISSUER}`,
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);

      // account is only available the first time this callback is called on a new session (after the user signs in)
      if (account) {
        token.decoded = jwtDecode(account.access_token);
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        return token;
      }

      // token has not expired yet, return it
      if (nowTimeStamp < token.expires_at) {
        return token;
      }

      // token is expired, refresh it
      try {
        const refreshedToken = await refreshAccessToken(token);
        return refreshedToken;
      } catch (error) {
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }
    },

    async session({ session, token }) {
      // Send properties to the client
      session.access_token = encrypt(token.access_token);
      session.id_token = encrypt(token.id_token);
      session.roles = token.decoded.realm_access.roles;
      session.error = token.error;
      session.userId = token.decoded.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
