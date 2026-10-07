import React from 'react'

const CustomerDetails = ({customer, setCustomer, savedCustomers = []}) => {
  // When a user pick a customer from the dropdown, autofill all their details
  const handleSelectCustomer = (e) => {
    const selectedId = Number(e.target.value);
    const selected = savedCustomers.find((c) => c.id === selectedId);

    if (selected) {
      setCustomer({
        customerName: selected.name || "",
        phone: selected.phone || "",
        email: selected.email || "",
        gstin: selected.gstin || "",
        billingAddress: selected.billingAddress || "",
      });
    } else {
      // Clear fields if the user picks "New / Walk-in Customer"
      setCustomer({
        customerName: "",
        phone: "",
        email: "",
        gstin: "",
        billingAddress: "",
      });
    }
  };

  // keep customer state updated when any input field changes
  const handleChange = (e) => {
    const {name, value} = e.target;
    setCustomer((prev) => ({...prev, [name]: value}));
  };
  return (
    <section className='bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
      <h2 className='text-base font-semibold text-gray-900 mb-4'>Customer Details</h2>

      {/* Dropdown to pick an existing saved customer */}
      <select
      onChange={handleSelectCustomer}
      className='border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white'>
        <option value="">-- Choose Saved Customer --</option>
        {savedCustomers.map((cust) => (
          <option key={cust.id} value={cust.id}>
            {cust.name} {cust.phone ? `(${cust.phone})` : ""}
          </option>
        ))}
      </select>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Customer Name */}
        <input 
        type="text" 
        name='customerName'
        placeholder='Customer Name'
        value={customer.customerName}
        onChange={handleChange}
        className='border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400'
        />

        {/* Phone */}
        <input 
        type="tel" 
        name='phone'
        placeholder='Phone Number'
        value={customer.phone}
        onChange={handleChange}
        className='border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400'
        />

        {/* Email */}
        <input 
        type="email" 
        name='email'
        placeholder='Email Address'
        value={customer.email}
        onChange={handleChange}
        className='border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400'
        />

        {/* GSTIN */}
        <input 
        type="text" 
        name='gstin'
        placeholder='GSTIN'
        value={customer.gstin}
        onChange={handleChange}
        className='border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400'
        />

        {/* Billing Address */}
        <input 
        type="text" 
        name='billingAddress'
        placeholder='Billing Address'
        value={customer.billingAddress}
        onChange={handleChange}
        className='border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400'
        />
      </div>
    </section>
  )
}

export default CustomerDetails