import leftSideImage from "../assets/login.jpg";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="flex rounded-2xl shadow-2xl overflow-hidden w-[900px]">
        {/* Left side image */}
        <div className="w-1/2">
          <img
            src={leftSideImage}
            alt="loginImage"
            className="w-full h-auto object-cover"
          />
        </div>
        {/* Right side form */}
        <div className="w-1/2 p-10">
          <h2 className="text-3xl font-bold">JOIN THE LEAGUE</h2>
          <p className="mt-2">Sign in to your account</p>
          {/* OAuth buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2 w-full text-sm font-medium hover:bg-gray-50 hover:border-indigo-500 transition-colors cursor-pointer relative group">
              <FcGoogle />
              Google
              <span className="absolute -top-6  left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Coming Soon
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2 w-full text-sm font-medium hover:bg-gray-50 hover:border-indigo-500 transition-colors cursor-pointer relative group">
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
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              className="border px-4 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </form>
          {/* 'Don't have account' part */}
          <p className="text-sm text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <span className="text-indigo-600 font-semibold cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
