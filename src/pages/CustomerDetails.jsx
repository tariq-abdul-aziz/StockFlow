import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useParams } from 'react-router'

const CustomerDetails = () => {
    const { id } = useParams();

    // Load saved customers from localStorage
    const [customers] = useState(() => {
        const saved = localStorage.getItem("customers");
        return saved ? JSON.parse(saved) : [];
    });

    const customer = customers.find((c) => String(c.id) === String(id));

    if (!customer) {
        return (
            <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Customer Not Found</h2>
                <p className='text-sm text-gray-500 mt-2'>
                    No customer found with ID <span className='font-mono'>
                        {id}
                    </span>
                    <Link className='mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm'
                    to="/customers"
                    >
                    Back to Customers</Link>
                </p>
            </div>
        );
    }
  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
        <div className='max-w-6xl mx-auto'>
            <Link className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900'>
            <ArrowLeft size={16} /> Back to Customers
            </Link>

            <div className='mt-4 mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>{customer.name}</h1>
                <p className='mt-1 text-sm text-gray-500'>Customer Profile</p>
            </div>

            {/* Contact & Billing Information */}
            <section className='bg-white border border-gray-200 rounded-xl p-5 mb-6'>
                <h2 className='text-base font-semibold text-gray-900 mb-4'>
                    Contact & Billing Details
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm'>
                    <div>
                        <span className='text-xs text-gray-500 block mb-1'>Phone Number</span>
                        <div className='flex items-center gap-1.5 font-medium text-gray-800'>
                            <Phone size={14} className='text-gray-400' />
                            {customer.phone || "-"}
                        </div>
                    </div>

                    <div>
                        <span className='text-xs text-gray-500 block mb-1'>Email Address</span>
                        <div className='flex items-center gap-1.5 font-medium text-gray-800'>
                            <Mail size={14} className='text-gray-400' />
                            {customer.email || "-"}
                        </div>
                    </div>

                    <div>
                        <span className='tetx-xs text-gray-500 block mb-1'>GSTIN</span>
                        <span className='font-mono font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block'>
                            {customer.gstin || "Unregistered"}
                        </span>
                    </div>

                    <div>
                        <span className='text-xs texct-gray-500 block mb-1'>Billing Address</span>
                        <div className='flex item-start gap-1.5 text-gray-700'>
                            <MapPin size={14} className='text-gray-400 shrink-0 mt-0.5' />
                            <span>{customer.billingAddress || "-"}</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
};

export default CustomerDetails