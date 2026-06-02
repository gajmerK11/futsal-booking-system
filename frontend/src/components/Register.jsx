import leftSideImage from "../assets/register.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  // Declaring/initializing state variables
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const navigate = useNavigate();

  // 'Submit' handler function
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, phone_number, role }),
    });

    const data = await response.json();

    if (response.ok) {
      setRegisterMessage(data.message);
      navigate("/dashboard", {
        state: {
          username: data.user.username,
          from: "register",
        },
      });
    } else {
      console.log("There is something wrong in your logic");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="flex flex-col md:flex-row md:rounded-2xl shadow-2xl overflow-hidden md:w-[900px] w-full md:h-[540px] md:mx-5">
        {/* Left side image */}
        <div className="w-full md:w-1/2">
          <img
            src={leftSideImage}
            alt="registerImage"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right side form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl md:text-3xl font-bold">JOIN THE LEAGUE</h2>
          <p className="mt-2">Create an account</p>
          {/* Register form */}
          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="input-animated">
              <input
                type="text"
                // Connecting state variables
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // ------------------------------------------
                placeholder="Username"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="input-animated">
              <input
                type="email"
                // Connecting state variables
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // ---------------------------------------
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
            <div className="input-animated">
              <input
                type="tel"
                // Connecting state variables
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                // ---------------------------------------------
                placeholder="Phone Number"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <select
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors pr-8"
              // Connecting state variables
              value={role}
              onChange={(e) => setRole(e.target.value)}
              // --------------------------------------
            >
              <option value="" disabled hidden>
                Select role
              </option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>
            <button
              type="submit"
              className="btn-fill w-full  text-white py-2 font-medium cursor-pointer"
            >
              <span>Create Account</span>
            </button>
            {/* 'Already have an account?' part */}
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold cursor-pointer"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
