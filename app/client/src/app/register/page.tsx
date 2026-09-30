'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    schoolName: '',
    executiveName: '',
    email: '',
    location: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Registration failed');
      }

      router.push('/?registered=true');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Register School</h2>
        
        {status === 'error' && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errorMessage}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="schoolName" className="text-sm font-medium text-gray-700">School Name</label>
            <input 
              type="text" 
              id="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="Enter school name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="executiveName" className="text-sm font-medium text-gray-700">Executive Name</label>
            <input 
              type="text" 
              id="executiveName"
              value={formData.executiveName}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="Enter executive name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="Enter email address"
            />
          </div>
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="mt-4 h-12 w-full rounded-full bg-black text-white font-medium transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {status === 'loading' ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
