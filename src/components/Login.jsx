import React, { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSignUpPage, setIsSignUpPage] = useState(true);

  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus();
  }, [isSignUpPage]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isSignUpPage) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
          {
            contentType: "application/json",
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
              returnSecureToken: true,
            }),
          },
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        console.log("signup success", data);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsSignUpPage((pre) => !pre);
      } catch (error) {
        console.error("Error signing up:", error);
        alert("Sign up failed: " + error.message);
      }
    } else {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
          {
            contentType: "application/json",
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
              returnSecureToken: true,
            }),
          },
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        console.log("Login successful", data);
        localStorage.setItem("token", data.idToken);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/home");
      } catch (error) {
        console.error("Error logging in:", error);
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <h1 className="text-xl m-5 border-black border-b">
        {isSignUpPage ? "Sign Up" : "Login"}
      </h1>

      <form
        onSubmit={submitHandler}
        className="flex flex-col border-solid border-black border-2 rounded-2xl p-5 w-96"
      >
        <input
          type="email"
          required
          ref={emailRef}
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b-black border rounded-xl mt-0 p-2 font-medium"
        ></input>

        <input
          type="password"
          required
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b-black border rounded-xl mt-5 p-2 font-medium"
        ></input>

        {isSignUpPage ? (
          <>
            {" "}
            <input
              id="confirmPassword"
              required
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-b-black border rounded-xl mt-5 p-2 font-medium"
            ></input>{" "}
          </>
        ) : (
          <p
            className="self-center mt-2 hover:cursor-pointer hover:scale-105 hover:text-blue-600 active:scale-95"
            onClick={() => navigate("/reset")}
          >
            Forgot Password? Click here to reset.
          </p>
        )}

        <button
          type="submit"
          className=" mt-5 self-center px-3 py-2 border font-bold rounded-xl cursor-pointer active:scale-95  hover:text-white hover:bg-black transition-colors"
        >
          {isSignUpPage ? "Sign Up" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUpPage(!isSignUpPage)}
        className="border-b m-5 cursor-pointer active:scale-95 hover:text-white hover:bg-black transition-colors"
      >
        {isSignUpPage
          ? "Already have an account? Login"
          : "Don't have an account? SignUp"}
      </button>
    </div>
  );
};

export default Login;
