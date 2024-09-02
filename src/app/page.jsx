import { authOptions } from './api/auth/[...nextauth]/route';
import ClientHome from './home/page';
import { getServerSession } from 'next-auth';
import Login from './login/page';

async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <>
        <div>Your name is {session.user?.name}</div>
        <ClientHome />
      </>
    );
  }
  return <Login />;
}

export default Home;
