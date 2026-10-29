import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react'
import { useParams } from 'react-router'

const CustomerDetails = () => {
    const {id} = useParams();

    // Load saved customers from LocalStorage
    const [customers] = useState(() => {
        const saved = localStorage.getItem("customers");
        return saved ? JSON.parse(saved) : [];
    });

    const customer = customers.find((c) => String(c.id) === String(id));

    if(!customer) {
        return (
            <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Customer Not Found</h2>
                <p className='text-sm text-gray-500 mt-2'>
                    No customer found with ID <span className='font-mono'>
                        {id}
                    </span>.
                </p>
                <Link
                to="/customers"
                className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm"
                >
                    Back to Customers
                </Link>
            </div>
        );
    }
  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
        <div className='max-w-6xl mx-auto'>
            <Link to="/customers"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
            <ArrowLeft size={16} /> Back to Customers
            </Link>

            <div className='mt-4 mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>{customer.name}</h1>
                <p className='mt-1 text-sm text-gray-500'>Customer Profile</p>
            </div>
        </div>
    </div>
  );
};

export default CustomerDetails