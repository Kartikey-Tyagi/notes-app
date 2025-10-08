'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSignout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Notes App</h1>
      {isLoggedIn && (
        <button
          onClick={handleSignout}
          className="bg-gray-700 hover:bg-gray-900 hover:cursor-pointer text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      )}
    </header>
  );
}
