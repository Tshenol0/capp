import { Link, json, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Logo from "../assets/form-logo.png";

const LOGIN_URL = "/api/users/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accesstoken = response?.data?.accesstoken;
      setAuth({ email, accesstoken });
      setErr("");
      navigate("/loggedin");
    } catch (error) {
      if (!err?.response) {
        setErr(error.response.data);
      } else if (error.response?.status === 500) {
        setErr(error.response.data);
      } else {
        setErr(error.response.data);
      }
    }
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col justify-start pt-24 sm:pt-0 sm:justify-center ">
      <form
        className="max-w-[480px] w-full bg-white mx-auto px-4 py-1 sm:shadow shadow-none h-[500px] mb-2"
        onSubmit={handleSubmit}
      >
        <div className=" flex justify-center py-6">
          <img src={Logo} className="w-20 h-20 rounded-[100%] " />
        </div>
        <div className="flex flex-col py-3">
          <label>Email</label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="flex flex-col py-3">
          <label>Password</label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <button className="border w-full my-5 py-2 bg-[#25d366] text-white transition-all hover:bg-[#0D4A24] rounded-md text-bold tracking-widest text-md">
          Login
        </button>
        <div className="flex items-center w-full px-1 py-3 justify-center">
          <div className="flex items-center ">
            <p className="pr-2 text-gray-800">{"Don't have an account yet?"}</p>
            <Link
              to="/register"
              className="text-[#04150A] hover:text-[#25d366]"
            >
              Sign Up
            </Link>
          </div>
        </div>
        {err && (
          <div className="bg-red-800 text-white w-full mx-auto text-center py-2 text-md">
            {err}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
