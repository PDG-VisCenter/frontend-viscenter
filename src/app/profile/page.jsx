'use client';

import { Button } from 'antd';
import federatedLogout from '../../utils/federatedLogout';

function Profile() {
  return (
    <div>
      Profile
      <Button onClick={() => federatedLogout()}>Sign out</Button>
    </div>
  );
}

export default Profile;
