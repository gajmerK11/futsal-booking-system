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
        </div>
      </div>
    </div>
  );
}

export default Login;
