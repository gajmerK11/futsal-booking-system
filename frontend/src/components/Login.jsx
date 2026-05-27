import leftSideImage from "../assets/login.jpg";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
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
          <p>Sign in to your account</p>
          {/* OAuth buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2 w-full text-sm font-medium hover:bg-gray-50 hover:border-indigo-500 transition-colors cursor-pointer relative group">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2 w-full text-sm font-medium hover:bg-gray-50 hover:border-indigo-500 transition-colors cursor-pointer relative group">
              Apple ID
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
              className="border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
