import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup
    ,createUserWithEmailAndPassword
    , sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {

    const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();
const [message, setMessage] = useState("");

const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");

const [showLoginPassword, setShowLoginPassword] = useState(false);
const [showRegisterPassword, setShowRegisterPassword] = useState(false);

const handleLogin = async () => {
  try {

    await signInWithEmailAndPassword(auth, email, password);

    const { data } = await API.post("/users/login", {
      email,
      password,
    });

    console.log("Backend Response:", data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("Saved Token:", localStorage.getItem("token"));

    setMessage("Login Successful ✅");

  } catch (error) {
    console.log("LOGIN ERROR:", error.response?.data || error.message);
  }
};


const handleRegister = async () => {
  try {

    await createUserWithEmailAndPassword(
      auth,
      registerEmail,
      registerPassword
    );

    const { data } = await API.post("/users/register", {
      name: registerEmail.split("@")[0],
      email: registerEmail,
      password: registerPassword,
    });

    console.log(data);

    setMessage("Account Created Successfully ✅");

  } catch (error) {
    console.log(error);

    setMessage(error.response?.data?.message || error.message);
  }
};


const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const { data } = await API.post("/users/google", {
      name: result.user.displayName,
      email: result.user.email,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("Backend Login:", data);

    setMessage("Google Login Successful ✅");

  } catch (error) {
    console.log(error);
    setMessage(error.response?.data?.message || error.message);
  }
};

const handleForgotPassword = async () => {
  if (!email) {
    setMessage("Please enter your email address first.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    setMessage("Password reset link has been sent to your email ✅");

  } catch (error) {
    setMessage(error.message);
  }
};




  return (
    <div className="max-w-5xl mx-auto px-5 py-16">

       {message && (
  <div className="fixed top-5 right-5 bg-white shadow-xl border rounded-xl p-5 w-80 z-50">

    <button
      onClick={() => {
        setMessage("");
        navigate("/");
      }}
      className="absolute top-2 right-3 text-red-500 text-xl font-bold"
    >
      ×
    </button>

    <h3 className="text-xl font-bold text-green-600">
      Success ✅
    </h3>

    <p className="mt-2 text-gray-700">
      {message}
    </p>

  </div>
)}



      <h1 className="text-4xl font-bold text-center mb-12">
        Login / Register
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Login */}
        <div className="bg-white shadow-lg rounded-xl p-8">

          <h2 className="text-3xl font-bold mb-6">
            Login
          </h2>



             <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 hover:bg-gray-100 transition mb-6"
            >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
           </button>


          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Username or Email Address
            </label>

            
            <input
          type="email"
          placeholder="Enter Email"
              value={email}
           onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                />

          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Password
            </label>

            
             <div className="relative">

  <input
    type={showLoginPassword ? "text" : "password"}
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border rounded-lg px-4 py-3 pr-12 outline-none focus:border-yellow-500"
  />

  <button
    type="button"
    onClick={() => setShowLoginPassword(!showLoginPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
  >
    {showLoginPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
  </button>

</div>

          </div>

          <div className="flex items-center gap-2 mb-6">
            <input type="checkbox" />
            <span>Remember Me</span>
          </div>

          <button 
            onClick={handleLogin}
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition">
            Login
          </button>
          
          <p 
          onClick={handleForgotPassword}
          className="text-center mt-5 text-sm text-gray-600 hover:text-black cursor-pointer">
            Lost your password?
          </p>

        </div>

        {/* Register */}
        <div className="bg-white shadow-lg rounded-xl p-8">
           
           
          <h2 className="text-3xl font-bold mb-6">
            Register
          </h2>

                
                <button
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 hover:bg-gray-100 transition mb-6"
>
  <FcGoogle size={24} />
  <span>Continue with Google</span>
</button>
          
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Email Address
            </label>

           
           <input
          type="email"
         placeholder="Enter Email Address"
         value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
         className="w-full border rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
            />


          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Password
            </label>

           
              <div className="relative">

  <input
    type={showRegisterPassword ? "text" : "password"}
    placeholder="Create Password"
    value={registerPassword}
    onChange={(e) => setRegisterPassword(e.target.value)}
    className="w-full border rounded-lg px-4 py-3 pr-12 outline-none focus:border-yellow-500"
  />

  <button
    type="button"
    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
  >
    {showRegisterPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
  </button>

</div>


          </div>

          <p className="text-gray-600 text-sm leading-6 mb-6">
            Your personal data will be used to support your experience
            throughout this website. Please choose a strong password to
            keep your account secure.
          </p>

          <button 
            onClick={handleRegister}
          className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition">
            Register
          </button>

        </div>

      </div>

    </div>
  );
};

export default Login;