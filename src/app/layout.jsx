import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Inter } from 'next/font/google';
import StoreProvider from './StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VisCenter',
  description: 'Centro Optico Viscarra',
};

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang='en'>
        <body>
          <AntdRegistry className={inter.className}>{children}</AntdRegistry>
        </body>
      </html>
    </StoreProvider>
  );
}
