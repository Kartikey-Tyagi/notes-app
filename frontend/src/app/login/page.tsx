'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/auth';
import Header from '@/components/Header';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate password length
        if (password.length > 128) {
            setError('Password must not exceed 128 characters');
            return;
        }
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            const errorMessage =
                (err as any)?.response?.data?.detail || 'Invalid credentials';
            setError(errorMessage);
        }

    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-gray-700 p-8 rounded shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6">Login</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mb-4 border rounded"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mb-4 border rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Login
                        </button>
                    </form>
                    <p className="mt-4">
                        Don&apos;t have an account?{' '}
                        <a href="/signup" className="text-blue-500">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}