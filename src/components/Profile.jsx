import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const fullName = useRef(null);
  const profilePictureUrl = useRef(null);

  const saveHandler = async (e) => {
    e.preventDefault();
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
            displayName: fullName.current.value,
            photoUrl: profilePictureUrl.current.value,
            returnSecureToken: true,
          }),
        },
      );
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to save profile");
      }
        const data = await response.json();
        console.log("Profile saved successfully", data);
        alert("Profile saved successfully!");
        navigate("/home");
    } catch (error) {
      alert("Error saving profile: " + error.message);
    }
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="px-96 py-10">
      <h3 className="font-extrabold">User Details</h3>
      <form className="flex flex-col justify-center  border border-black rounded-xl p-5">
        <label htmlFor="fullName" className="font-medium">
          Full Name
        </label>
        <input
          ref={fullName}
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Enter Full Name"
          required
          className="mb-5 border rounded px-2 py-1"
        />

        <label htmlFor="profilePictureUrl" className="font-medium">
          Profile Picture Url
        </label>
        <input
          type="text"
          ref={profilePictureUrl}
          id="profilePictureUrl"
          name="profilePictureUrl"
          placeholder="Enter Profile picture URL"
          className="mb-5 border rounded px-2 py-1"
          required
        />

        <div className="flex justify-center gap-5">
          <button
            className="self-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={saveHandler}
          >
            Save
          </button>
          <button
            className=" self-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
