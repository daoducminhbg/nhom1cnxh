import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import ToastProvider from '@/components/ToastProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'nhom1cnxh - Cổng điều hành Nhóm 1 CNXHKH',
  description: 'Cổng thông tin điều hành & Bỏ phiếu vai trò thời gian thực dành cho Nhóm 1 môn Chủ nghĩa Xã hội Khoa học.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-background text-text min-h-screen antialiased bg-grid">
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
