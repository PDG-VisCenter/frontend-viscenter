const getAdminToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
    params.append('grant_type', 'password');
    params.append('username', process.env.ADMIN_USERNAME);
    params.append('password', process.env.ADMIN_PASSWORD);
    params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);

    const response = await fetch(process.env.KEYCLOAK_REFRESH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Failed to fetch admin token: ${response.status} ${response.statusText}`);
    }

    const tokenData = await response.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error fetching admin token:', error);
    throw new Error('Unable to fetch admin token');
  }
};

const getUserEmail = async (userId) => {
  try {
    const token = await getAdminToken();
    const response = await fetch(`${process.env.KEYCLOAK_USER_DATA_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching email for userID ${userId}: ${errorText}`);
      throw new Error(`Unable to fetch email for userID ${userId}: ${response.status} ${response.statusText}`);
    }

    const userData = await response.json();
    return userData.email;
  } catch (error) {
    console.error(`Error fetching email for userID ${userId}:`, error);
    throw new Error(`Unable to fetch email for userID ${userId}`);
  }
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
  }

  try {
    const email = await getUserEmail(userId);
    return new Response(JSON.stringify({ email }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
