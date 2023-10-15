'use client'
import React, { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import Link from "next/link"
const Page = () => {
    const [employees, setEmployees] = useState([])
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
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:9095/api/v1/users/all', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [token, router]);
    return (
        <div>
            this is home
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">First Name</th>
                        <th className="px-4 py-2">Last Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees?.map((employee) => (
                        <tr key={employee.id} className="bg-white">
                            <td className="border px-4 py-2">{employee.firstname}</td>
                            <td className="border px-4 py-2">{employee.lastname}</td>
                            <td className="border px-4 py-2">{employee.email}</td>
                            <td className="border px-4 py-2 text-center flex justify-center">
                                <div className='gap-2 flex'>
                                    <Link href={`/home/${employee.id}`}>
                                        <button className='bg-blue-400 text-white px-2 py-1 rounded-md'>Edit</button>
                                    </Link>

                                    <Link href={`/home/${employee.id}/upload`}>
                                        <button className='bg-blue-400 text-white px-2 py-1 rounded-md'>Upload</button>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Page
