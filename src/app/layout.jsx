import '../sass/main.scss';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Inter } from 'next/font/google';
import SessionProviderWrapper from '../utils/sessionProviderWrapper';
import StoreProvider from './StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VisCenter',
  description: 'Centro Óptico y Oftalmológico Viscarra',
};

export default function RootLayout({ children }) {
  return (
    <SessionProviderWrapper>
      <html lang='en'>
        <body>
          <StoreProvider>
            <AntdRegistry className={inter.className}>{children}</AntdRegistry>
          </StoreProvider>
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
