import leftSideImage from "../assets/sign-in.jpg";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  // Declaring state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const navigate = useNavigate();

  // 'Submit' handler function
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setLoginMessage(data.message);
      navigate("/dashboard");
    } else {
      setLoginMessage("Something went wrong");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      {/* Card div */}
      <div className="flex flex-col md:flex-row md:rounded-2xl shadow-2xl overflow-hidden md:w-[900px] w-full md:h-full md:mx-5">
        {/* Left side image */}
        <div className="w-full md:w-1/2">
          <img
            src={leftSideImage}
            alt="signInImage"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right side form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl md:text-3xl font-bold">JOIN THE LEAGUE</h2>
          <p className="mt-2">Sign in to your account</p>
          {/* OAuth buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2 w-full text-sm font-medium hover:bg-gray-50 hover:border-indigo-500 transition-colors cursor-not-allowed relative group">
              <FcGoogle />
              Google
              <span className="absolute -top-6  left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Coming Soon
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2 w-full text-sm font-medium hover:bg-gray-50 hover:border-indigo-500 transition-colors cursor-not-allowed relative group">
              <FaApple />
              Apple ID
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Coming Soon
              </span>
            </button>
          </div>
          {/* 'Or continue with email' part */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">
              Or continue with email
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          {/* Login form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="input-animated">
              <input
                type="email"
                // Connecting state variables
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // --------------------------------------
                placeholder="Email"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="input-animated">
              <input
                type="password"
                // Connecting state variables
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // ------------------------------------------
                placeholder="Password"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="btn-fill w-full  text-white py-2 font-medium cursor-pointer"
            >
              <span>Sign in</span>
            </button>
          </form>
          {/* 'Don't have account' part */}
          <p className="text-sm text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
