import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  const categories = ["Food", "Petrol", "Salary", "Entertainment", "Transport", "Other"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!amount || !description || !category) {
      alert("Please fill all fields");
      return;
    }
    const newExpense = { amount, description, category };
    setExpenseData((prev) => [...prev, newExpense]);
    setAmount("");
    setDescription("");
    setCategory("Food");
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <h1 className="text-xl m-5 border-black border-b">Add Expense</h1>

      <form
        onSubmit={submitHandler}
        className="flex flex-col border-solid border-black border-2 rounded-2xl p-5 w-96"
      >
        <input
          type="number"
          placeholder="Amount spent"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border-b-black border rounded-xl mt-0 p-2 font-medium"
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-b-black border rounded-xl mt-5 p-2 font-medium"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-b-black border rounded-xl mt-5 p-2 font-medium"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="mt-5 self-center px-3 py-2 border font-bold rounded-xl cursor-pointer active:scale-95 hover:text-white hover:bg-black transition-colors"
        >
          Add Expense
        </button>
      </form>

      <div className="mt-8 w-96">
        <h2 className="text-lg font-bold border-b border-black mb-4">Expenses</h2>
        {expenseData.length === 0 ? (
          <p className="text-gray-600">No expenses yet</p>
        ) : (
          <ul className="space-y-3">
            {expenseData.map((expense, ind) => (
              <li key={ind} className="border border-gray-300 rounded p-3">
                <span className="font-bold">Rs {expense.amount}</span> - {expense.description} ({expense.category})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
