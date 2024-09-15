'use client';

import { Flex } from 'antd';
import NavBarSticky from './NavBarSticky';

function HeaderSimple() {
  return (
    <Flex
      style={{
        position: 'relative',
        paddingBlock: 43,
      }}
    >
      <NavBarSticky />
    </Flex>
  );
}

export default HeaderSimple;
