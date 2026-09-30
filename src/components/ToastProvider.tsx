'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1a1a2e',
          color: '#f1f1f1',
          border: '1px solid #2a2a3e',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#f1f1f1',
          },
        },
        error: {
          iconTheme: {
            primary: '#E11D48',
            secondary: '#f1f1f1',
          },
        },
      }}
    />
  );
}
