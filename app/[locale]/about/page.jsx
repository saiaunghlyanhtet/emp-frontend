'use client'
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

async function getData() {
    const res = await fetch('https://64f05a238a8b66ecf7798255.mockapi.io/products');

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export default function About() {
    const t = useTranslations("Index");
    const [data, setData] = useState(null);

    useEffect(() => {
        getData().then(data => setData(data)).catch(err => console.error(err));
    }, []);

    return (
        <div>
            {t("about")}
            <div className='flex flex-row gap-4'>
                {data && data.map(product => (
                    <div key={product.id}>
                        <p>{product.product}</p>
                        <p>{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
