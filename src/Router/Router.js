import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Expenses from "../Pages/Expenses/Expenses";
import Setting from "../Pages/Setting/Setting";
import Accounts from "../Pages/Accounts/Accounts";
import Contact from "../Pages/Contact/Contact";
import Incomes from "../Pages/Income/Incomes";
import Loan from "../Pages/Loan/Loan";
import Portfolio from "../Pages/Portfolio/Portfolio";
import Login from "../Pages/UserCredentials/Login";
import SignUp from "../Pages/UserCredentials/SignUp";
import EmailVerify from "../Pages/UserCredentials/EmailVerify";
import ForgotPassword from "../Pages/UserCredentials/ForgotPassword";
import ResetPassword from "../Pages/UserCredentials/ResetPassword";
import MainPage from "../Pages/MainPage/MainPage";
import About from "../Pages/About/About"

const Router = () => {
  const userData = localStorage.getItem("UserCredentials");
  const [auth, setAuth] = useState(false);

  // useEffect(() => {
  //   if (userData.username) {
  //     setAuth(true);
  //   }
  // }, []);

  return (
    <Routes>
      <Route
        index
        path="/"
        element={<MainPage />}
      />
      <Route
        index
        path="/dashboard"
        element={!userData ? <Navigate to="/login" /> : <Dashboard />}
      />
      <Route
        path="/contact"
        element={!userData ? <Navigate to="/login" /> : <Contact />}
      />
      <Route
        path="/accounts"
        element={!userData ? <Navigate to="/login" /> : <Accounts />}
      />
      <Route
        path="/expenses"
        element={!userData ? <Navigate to="/login" /> : <Expenses />}
      />
      <Route path="/incomes" element={<Incomes />} />
      <Route
        path="/loan"
        element={!userData ? <Navigate to="/login" /> : <Loan />}
      />
      <Route
        path="/portfolio"
        element={!userData ? <Navigate to="/login" /> : <Portfolio />}
      />
      <Route
        path="/setting"
        element={!userData ? <Navigate to="/login" /> : <Setting />}
      />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/emailverify" element={<EmailVerify />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
    </Routes>
  );
};

export default Router;

// rounded-[15px] border-[1px] border-[#E7E7E7] bg-white
// text-[10px] font-[400]
