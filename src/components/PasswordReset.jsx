import React, { useRef, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
const PasswordReset = () => {
  const [resetLinkSend, setResetLinkSend] = useState(false);
  const emailref = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    emailref.current.focus();
  }, []);

  const sendLinkHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: emailref.current.value,
          }),
        },
      );
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      } else {
        console.log(data);
        emailref.current.value = "";
        setResetLinkSend(true);
        setTimeout(() => {
            navigate("/");
        }, 5000);
      }
    } catch (error) {
      alert("Error sending password reset email: " + error.message);
    }
  };
  return (
    <div>
      <div className="px-96 py-10">
        <h3 className="font-extrabold p-3">
          Enter Email below to reset password.
        </h3>

        <form className="flex flex-col justify-center  border border-black rounded-xl p-5">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            ref={emailref}
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email"
            required
            className="mb-5 border rounded px-2 py-1"
          />

          {!resetLinkSend ? (
            <button
              className="self-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={sendLinkHandler}
            >
              Reset
            </button>
          ) : (
            <p>Reset link has been sent to your email.Redirecting to login page in 5 seconds....</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
