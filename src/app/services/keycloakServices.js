export const fetchUserEmail = async (userId) => {
  try {
    const response = await fetch(`/api/keycloak?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Error fetching user email');
    }
    const data = await response.json();
    return data.email;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
