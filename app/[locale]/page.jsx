'use client'
import { useTranslations } from 'next-intl'
import { useState } from "react"
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
export default function Home() {
  const t = useTranslations("Index")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();



    try {
      const response = await fetch('http://localhost:9095/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const { message } = await response.json();

      } else {
        const data = await response.json();
        setCookie('token', data.token, { maxAge: 1000 * 60 * 24 })
        router.push('/jp/home')
      }
    } catch (error) {
      console.error('Error occurred while logging in:', error);

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don &apos; t have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
