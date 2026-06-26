import React, { use } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-200 border-b-2 border-gray-400 flex justify-between items-center">
      <h2 className="p-5 text-black text-2xl font-bold">Expense Tracker</h2>

      <button
        className="cursor- pointer active:scale-95 bg-gray-300 text-l text-black px-4 mr-3 py-2 rounded-full hover:bg-gray-600 hover:text-white transition-colors"
        onClick={() => {
          navigate("/profile");
        }}
      >
        Your Profile is incomplete.{" "}
        <span className="underline hover:text-blue-500">Complete Now.</span>
      </button>
    </div>
  );
};

export default Header;
