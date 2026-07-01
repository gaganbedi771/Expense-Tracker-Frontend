import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null); //???

  const categories = [
    "Food",
    "Petrol",
    "Salary",
    "Entertainment",
    "Transport",
    "Other",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    async function getExpensesFromDB() {
      try {
        const expenses = await fetch(
          `${import.meta.env.VITE_DB_URL}expenses.json?auth=${localStorage.getItem("token")}`,
        );

        if (!expenses.ok) {
          throw new Error("Failed to fetch expenses from database", expenses);
        }
        const data = await expenses.json();

        console.log(data);
        if (!data) {
          return;
        }
        console.log(data);
        setExpenseData(
          Object.entries(data).map(([id, expense]) => ({
            id,
            ...expense,
          })),
        );
      } catch (error) {
        console.log(error.message);
        alert("Error fetching expenses from database");
      }
    }

    getExpensesFromDB();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!amount || !description || !category) {
      alert("Please fill all fields");
      return;
    }
    const newExpense = { amount, description, category };
    
    if (editMode) {
      async function updateExpenseInDB() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_DB_URL}expenses/${editingId}.json?auth=${localStorage.getItem("token")}`,
            {
              method: "PUT",
              body: JSON.stringify(newExpense),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to update expense");
          }
        } catch (error) {
          console.log(error);
          alert("Error updating expense");
        }
      }
      updateExpenseInDB();
      setExpenseData((prev) =>
        prev.map((exp) => (exp.id === editingId ? { ...exp, ...newExpense } : exp))
      );
      setEditMode(false);
      setEditingId(null);
    } else {
      async function addExpenseToDB() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_DB_URL}expenses.json?auth=${localStorage.getItem("token")}`,
            {
              method: "POST",
              body: JSON.stringify(newExpense),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.log(error);
          alert("Error adding expense to database");
        }
      }
      addExpenseToDB();
      setExpenseData((prev) => [...prev, newExpense]);
    }
    setAmount("");
    setDescription("");
    setCategory("Food");
  };

  const editExpenseHandler = (id) => {
    const expense = expenseData.find((exp) => exp.id === id);
    
      setAmount(expense.amount);
      setDescription(expense.description);
      setCategory(expense.category);
      setEditingId(id);
      setEditMode(true);
    
  };

  const deleteExpenseHandler = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DB_URL}expenses/${id}.json?auth=${localStorage.getItem("token")}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      setExpenseData((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      console.log(error);
      alert("Error deleting expense");
    }
  };

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
          {editMode ? "Edit Expense" : "Add Expense"}
        </button>
      </form>

      <div className="mt-8 w-96">
        <h2 className="text-lg font-bold border-b border-black mb-4">
          Expenses
        </h2>
        {expenseData.length === 0 ? (
          <p className="text-gray-600">No expenses yet</p>
        ) : (
          <ul className="space-y-3">
            {expenseData.map((expense) => (
              <li
                key={expense.id}
                className="border border-gray-300 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <span className="font-bold">Rs {expense.amount}</span> -{" "}
                  {expense.description} ({expense.category}){" "}
                  {console.log(expense)}
                </div>
                <div>
                  <button
                    className=" mr-2 border rounded-xl px-1 font-medium hover:bg-black hover:text-white transition-colors active:scale-95"
                    onClick={() => editExpenseHandler(expense.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="border rounded-xl px-1 font-medium hover:bg-black hover:text-white transition-colors active:scale-95"
                    onClick={() => deleteExpenseHandler(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
