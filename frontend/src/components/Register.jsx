import leftSideImage from "../assets/register.jpg";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="flex rounded-2xl shadow-2xl overflow-hidden w-[900px] h-[540px]">
        {/* Left side image */}
        <div className="w-1/2">
          <img
            src={leftSideImage}
            alt="registerImage"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right side form */}
        <div className="w-1/2 p-10">
          <h2 className="text-3xl font-bold">JOIN THE LEAGUE</h2>
          <p className="mt-2">Create an account</p>
          {/* Register form */}
          <form className="flex flex-col gap-4 mt-4">
            <div className="input-animated">
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="input-animated">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="input-animated">
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="input-animated">
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <select
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors pr-8"
              defaultValue=""
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
              <span className="text-indigo-600 font-semibold cursor-pointer">
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
