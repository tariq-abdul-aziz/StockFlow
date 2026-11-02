import React, {useState} from 'react'
import {Search, UserPlus, ChevronDown} from 'lucide-react'

const CustomerDetails = ({customer, setCustomer, savedCustomers = []}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // When picking a customer from the filtered list
  const handlePickCustomer = (selected) => {
    setCustomer({
      customerId: selected.id,
      customerName: selected.name || "",
      phone: selected.phone || "",
      email: selected.email || "",
      gstin: selected.gstin || "",
      billingAddress: selected.billingAddress || "",
    });
    setSearchTerm("");
    setIsOpen(false);
  };

  // Reset to empty/walk-in customer
  const handleNewCustomer = () => {
    setCustomer({
      customerId: null,
      customerName: "",
      phone: "",
      email: "",
      gstin: "",
      billingAddress: "",
    });
    setSearchTerm("");
    setIsOpen(false);
  };

  // Filter customers by name, phone, or GSTIN
  const filteredCustomers = savedCustomers.filter((c) => {
    const query = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) || c.phone?.includes(query) || c.gstin?.toLowerCase().includes(query)
    );
  });

  // keep customer state updated when any input field changes
  const handleChange = (e) => {
    const {name, value} = e.target;
    setCustomer((prev) => ({...prev, [name]: value}));
  };
  return (
    <section className='bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
        <div>
          <h2 className='text-base font-semibold text-gray-900'>Customer Details</h2>
          <p className='text-xs text-gray-500 mt-0.5'>
            Select an existing customer or enter details manually
          </p>
        </div>

        {/* Searchable Customer Dropdown */}
        <div className='relative w-full sm:w-72'>
          <button
          type='button'
          onClick={() => setIsOpen((prev) => !prev)}
          className='w-full flex items-center justify-between border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-left hover:border-gray-400 focus:outline-none'
          >
            <span className='truncate text-gray-700'>
              {customer.customerName ? customer.customerName : "-- Choose Saved Customer --"}
            </span>
            <ChevronDown size={15} className='text-gray-400 shrink-0 ml-1' />
          </button>

          {isOpen && (
            <div className='absolute right-0 top-full mt-1.5 w-full sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2'>
              {/* Search Input */}
              <div className='relative mb-2'>
                <Search size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400' />
                <input 
                type="text" 
                autoFocus
                placeholder='Search name, phone, or GST...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-gray-400'
                />
              </div>

              {/* Options list */}
              <div className='max-h-52 overflow-y-auto divide-y divide-gray-50'>
                <button
                type='button'
                onClick={handleNewCustomer}
                className='w-full flex items-centergap-2 px-2.5 py-2 text-left text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                >
                  <UserPlus size={13} />
                  <span>+ New / Walk-in Customer</span>
                </button>

                {filteredCustomers.length === 0 ? (
                  <p className='text-[11px] text-gray-400 py-3 text-center'>
                    No matching customers found
                  </p>
                ) : (
                  filteredCustomers.map((c) => (
                    <button
                    key={c.id}
                    type='button'
                    onClick={() => handlePickCustomer(c)}
                    className='w-full px-2.5 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors'
                    >
                      <div className='font-medium text-xs text-gray-900'>{c.name}</div>
                      <div className='text-[10px] text-gray-400 flex items-center gap-2 mt-0.5'>
                        {c.phone && <span>{c.phone}</span> }
                        {c.gstin && <span className='font-mono'>{c.gstin}</span> }
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
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