'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '../../lib/auth';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate password length
        if (new TextEncoder().encode(password).length > 72) {
            setError('Password must not exceed 72 characters');
            return;
        }
        try {
            await signup(name, email, password, role);
            router.push('/login');
        } catch (err) {
            const errorMessage =
                (err as any)?.response?.data?.detail || 'Signup failed';
            setError(errorMessage);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-gray-700 p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
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
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Sign Up
                    </button>
                </div>
                <p className="mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}