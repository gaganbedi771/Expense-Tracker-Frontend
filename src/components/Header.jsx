import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const [verificationMailSent, setVerificationMailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const checkIsVerified = async () => {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: localStorage.getItem("token"),
            }),
          },
        );
        const data = await response.json();
        setEmailVerified(data.emailVerified || false);
      } catch (error) {
        console.error("Error checking email verification status:", error);
      }
    };

    checkIsVerified();
  }, []);

  const sendEmailHandler = async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: localStorage.getItem("token"),
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to send verification email");
      }
      const data = await response.json();
      console.log(data);
      setVerificationMailSent(true);
    } catch (error) {
      alert("Error sending verification email: " + error.message);
    }
  };

  return (
    <div className="bg-gray-200 border-b-2 border-gray-400 flex justify-between items-center">
      <h2 className="p-5 text-black text-2xl font-bold">Expense Tracker</h2>

      <div className="flex gap-3">
        {emailVerified ? (
          <p className="bg-gray-300 px-4 py-2 rounded-full inline-block  hover:bg-gray-400 hover:text-white transition-colors">
            Email Verified
          </p>
        ) : verificationMailSent ? (
          <p className="bg-gray-300 px-4 py-2 rounded-full inline-block  hover:bg-gray-400 hover:text-white transition-colors">
            Email send, Check your email to verify.
          </p>
        ) : (
          <p className="bg-gray-300 px-4 py-2 rounded-full inline-block  hover:bg-gray-400 hover:text-white transition-colors">
            Your Email is not verified.{" "}
            <span
              className="underline text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={sendEmailHandler}
            >
              Verify Now.
            </span>
          </p>
        )}

        <p className="bg-gray-300 text-black px-4 py-2 rounded-full mr-3 inline-block  hover:bg-gray-400 hover:text-white transition-colors">
          Your Profile is incomplete.{" "}
          <span
            className="underline text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => navigate("/profile")}
          >
            Complete Now.
          </span>
        </p>
      </div>
    </div>
  );
};

export default Header;
