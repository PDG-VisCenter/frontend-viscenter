import '../sass/main.scss';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Inter } from 'next/font/google';
import Providers from './Providers';
import SessionGuard from './components/SessionGuard';
import StoreProvider from './StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VisCenter',
  description: 'Centro Óptico y Oftalmológico Viscarra',
};

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang='en'>
        <body>
          <Providers>
            <SessionGuard>
              <AntdRegistry className={inter.className}>{children}</AntdRegistry>
            </SessionGuard>
          </Providers>
        </body>
      </html>
    </StoreProvider>
  );
}
