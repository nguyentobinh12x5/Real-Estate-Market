import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
  };
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handleValication
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = formData;
    if (!email.includes("@")) {
      toast.error("Invalid Email, should add @", toastOptions);
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be atleast 3 characters long", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be atleast 8 characters long", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          toast.error(data.message, toastOptions);
          return;
        }
        setLoading(false);
        navigate("/sign-in");
      } catch (error) {
        setLoading(false);
        toast.error(error.message, toastOptions);
      }
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          type="Password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 hover:opacity-95 uppercase disabled:opacity-85 rounded-lg"
          type="submit"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 my-4">
        <p className=" font-semibold">Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700 font-semibold">Sign in</span>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
