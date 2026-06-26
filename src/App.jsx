import React from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";
import Profile from "./components/Profile";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
