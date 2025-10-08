'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // ✅ ensures client-side only

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }
  }, [pathname, isMounted]);

  const handleSignout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  if (!isMounted) return null;

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold hover:cursor-pointer"
        onClick={() => router.push('/')}
      >
        Notes App
      </h1>

      {isLoggedIn && (
        <button
          onClick={handleSignout}
          className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      )}
    </header>
  );
}
