import leftSideImage from "../assets/register.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// Shape of one suggestion returned by the backend's location-search proxy
interface LocationSuggestion {
  lat: string;
  lon: string;
  display_name: string;
}

function Register() {
  // Declaring/initializing state variables
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [registerFailed, setRegisterFailed] = useState(false);

  // for debounce
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // state for location implementaion
  // This one is for 'what user typed'
  const [location, setLocation] = useState("");
  /*
  This one is for 'suggestions list from API'.
  Since this one will hold array of places from API so its initial value should be an empty array.
  */
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  /**
   * This one is for 'selected place from dropdown suggestions with coords'
   * no place selected yet (at beginning) - that's why 'null' as it means 'nothing selected' (no " " - because it means empty string )
   */
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);

  const navigate = useNavigate();

  // Auto-dismiss the toast after a few seconds instead of leaving it on screen forever.
  // Re-runs every time a new message comes in; cleanup cancels a stale timer if the
  // component unmounts (e.g. we already navigated away) before it fires.
  useEffect(() => {
    if (!registerMessage) return;
    const timer = setTimeout(() => setRegisterMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [registerMessage]);

  // 'Location input' handler function - This is for displaying location suggestion as user types
  async function handleLocationInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    // Step-1: update location state - it means set the 'location' variable to 'e.target.value' which is the current input field value
    setLocation(e.target.value);

    // min-length check - don't call API if input is too short
    if (e.target.value.length < 3) {
      setLocationSuggestions([]); // clear any existing suggestions
      return; // stop here
    }

    // Step-2: call the API after 300ms of no typing
    debounceTimer.current = setTimeout(async () => {
      const response = await fetch(
        `http://localhost:3000/location/search?q=${e.target.value}`,
        {
          method: "GET",
        },
      );
      const data: LocationSuggestion[] = await response.json();
      // Storing the 'data' in state so the dropdown can render it.
      setLocationSuggestions(data);
    }, 300);
  }

  // 'Location select' handler function - runs when user clicks a suggestion from dropdown ('place' will be passed by JSX that calls this function)
  function handleLocationSelect(place: LocationSuggestion) {
    // Step-1: When user selects the place name from dropdown, update the input field value to that ('setLocation' is responsible for that so we are passing to it)
    setLocation(place.display_name);
    // Step-2: Store full place object with lat/lon
    setSelectedLocation(place);
    // Step-3: Clear drop-down
    setLocationSuggestions([]);
  }

  // 'Submit' handler function
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        phone_number,
        role,
        location: selectedLocation?.display_name,
        lat: selectedLocation?.lat,
        lon: selectedLocation?.lon,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setRegisterFailed(false);
      setRegisterMessage(data.message);
      // Clear the form — matters if navigation ever changes (e.g. user comes back)
      setUsername("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      setRole("");
      setLocation("");
      setSelectedLocation(null);
      navigate("/dashboard", {
        state: {
          username: data.user.username,
          from: "register",
        },
      });
    } else {
      setRegisterFailed(true);
      setRegisterMessage(data.message ?? "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      {/* Toast — floats above everything, doesn't affect card layout/size at all */}
      {registerMessage && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 py-2 text-sm font-medium shadow-lg ${
            registerFailed
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {registerMessage}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:rounded-2xl shadow-2xl overflow-hidden md:w-225 w-full md:h-150 md:mx-5">
        {/* Left side image */}
        <div className="relative w-full md:w-1/2 h-48 md:h-auto">
          <img
            src={leftSideImage}
            alt="registerImage"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* Right side form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold">JOIN THE LEAGUE</h2>
          <p className="mt-2">Create an account</p>
          {/* Register form */}
          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
            {/* Username field */}
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
            {/* Email field */}
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
            {/* Password field */}
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
            {/* Phone Number field */}
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
            {/* Location field */}
            <div className="input-animated relative">
              <input
                type="text"
                value={location}
                onChange={handleLocationInput}
                placeholder="Your address"
                className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors "
              />
              {/*
              1. show dropdown only if suggestions exist i.e. if 'data' array is not empty ('data' is what holds array of object containing lat/long/display_name). Since 'data' is a local variable inside 'handleLocationInput' - it doesn't exist in JSX so we can't do something like 'data.length > 0'. JSX only sees state variables. Therefore, 'locationSuggestions' is the state variable that holds the suggestions array.
              2. and yes, you might get confused what is this pattern? this is using condition in JSX i.e. if condition match, render this component.
              */}
              {locationSuggestions.length > 0 && (
                <ul className="absolute w-full bg-gray-100 border border-t-0 border-indigo-500 z-10">
                  {locationSuggestions.map((place) => (
                    <li
                      key={place.display_name}
                      onClick={() => handleLocationSelect(place)}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50"
                    >
                      {place.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* User role field */}
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
