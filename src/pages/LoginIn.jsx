import React from "react";

const LoginIn = () => {
  return (
    <div className="flex w-screen h-screen">
      <div className="bg-[#045DC9] w-200 text-white font-semibold tracking-wide italic text-4xl flex justify-center items-center">
        <h1>StockFlow</h1>
      </div>
      <div className="w-96 h-full flex flex-col gap-3 justify-center p-15">
        <h1 className="font-bold text-2xl">Hello!</h1>
        <input type="email" placeholder="Email Address" className="border-gray-400 inset-shadow-sm inset-shadow-gray-300 rounded-full px-2 py-1 focus:outline-2 focus:outline-blue-400" />
        <input type="password" placeholder="Password" className="border-gray-400 inset-shadow-sm inset-shadow-gray-300 rounded-full px-2 py-1 focus:outline-2 focus:outline-blue-400" />
        <div className="btns flex gap-2">
          <button className="rounded-2xl px-2 bg-blue-400 text-white w-30 cursor-pointer hover:bg-blue-600 active:scale-95">Login</button>
          <button className="rounded-2xl px-2 bg-blue-400 text-white w-30 cursor-pointer hover:bg-blue-600 active:scale-95">Sign Up</button>
        </div>
        <button className="cursor-pointer hover:text-blue-400">Forgot Password</button>
      </div>
    </div>
  );
};

export default LoginIn;
