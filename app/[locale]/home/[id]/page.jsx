'use client'
import React, { useState, useEffect } from 'react'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
const Page = ({ params }) => {
    const id = params.id
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const token = getCookie('token')
    const router = useRouter()
    if (!token) {
        router.push('/jp')
    }
    const parseTokenExpiration = (token) => {
        // Extract the expiration time from the token (you need to implement this logic)

        // For example, if the token is a JWT:
        const jwt = token.split('.');
        const payload = JSON.parse(atob(jwt[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds

        return exp;
    }
    console.log(parseTokenExpiration(token))
    useEffect(() => {
        const isTokenExpired = (token) => {
            // Get the expiration timestamp of the token
            const exp = parseTokenExpiration(token);

            // Compare with the current timestamp
            return exp < Date.now();
        }
        const checkTokenExpiration = (token) => {

            // Check if the token exists and if it is expired
            if (token && isTokenExpired(token)) {
                router.push('/'); // Redirect to the login page
            }
        }
        checkTokenExpiration(token);

    }, [token, router]);
    useEffect(() => {
        const fetchUser = async (id) => {
            try {
                const response = await fetch(`http://localhost:9095/api/v1/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setFirstName(data.firstname)
                setLastName(data.lastname)
                setEmail(data.email)
                console.log(data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchUser(id)
    }, [id, token])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:9095/api/v1/users/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email
                }),
            });
            console.log(response)
            if (!response.ok) {
                const { message } = await response.json();

            } else {
                router.push('/home')
            }
        } catch (error) {
            console.error('Error occurred while logging in:', error);

        }

        // Reset the form fields
        setFirstName('');
        setLastName('');
        setEmail('');

    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Create User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-600 font-medium mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your first name"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-600 font-medium mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your last name"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Update User
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Page
