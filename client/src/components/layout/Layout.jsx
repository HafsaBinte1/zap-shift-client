import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </div>
  );
}
