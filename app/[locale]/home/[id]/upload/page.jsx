'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { Toaster, toast } from 'react-hot-toast';

export default function FileUploadForm() {
    const [selectedFile, setSelectedFile] = useState(null);
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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:9095/api/v1/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData, // Use the formData object as the request body
            });

            if (response.ok) {
                console.log('File uploaded successfully!');
                toast.success('File uploaded successfully!');
                router.push('/home');

                // Perform any necessary actions upon successful upload
            } else {
                console.log('Failed to upload file');

                // Handle the error scenario
            }
        } catch (error) {
            console.error('Error occurred while uploading file:', error);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <Toaster />
                <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="file" className="block text-gray-600 font-medium mb-2">
                            Select File
                        </label>
                        <input
                            type="file"
                            id="file"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Upload File
                    </button>
                </form>
            </div>
        </div>
    );
}