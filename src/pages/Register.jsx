import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Logo from "../assets/form-logo.png";

const REGISTER_URL = "/api/users/register";

const Register = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ firstname: fname, lastname: lname, email, password }),
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
    <div className="bg-white w-full h-screen flex flex-col justify-center ">
      <form
        className="max-w-[550px] w-full mx-auto px-4 py-1 h-[600px]"
        onSubmit={handleSubmit}
      >
        {" "}
        <div className=" flex justify-center py-3">
          <img src={Logo} className="w-20 h-20 rounded-[100%] " />
        </div>
        <div className="flex flex-col py-2">
          <label>First Name</label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            type="text"
            autoComplete="off"
            onChange={(e) => {
              setFname(e.target.value);
            }}
            value={fname}
          />
        </div>
        <div className="flex flex-col py-2">
          <label>Last Name</label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            type="text"
            autoComplete="off"
            onChange={(e) => {
              setLname(e.target.value);
            }}
            value={lname}
          />
        </div>
        <div className="flex flex-col py-2">
          <label>Email</label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            type="text"
            autoComplete="off"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
        </div>
        <div className="flex flex-col py-2">
          <label>Password</label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
        </div>
        <button className="border w-full my-5 py-2 hover:bg-[#0D4A24] bg-[#25d366] text-white rounded-md text-bold tracking-widest text-md">
          Create Account
        </button>
        <div className="justify-center flex items-center w-full mb-2">
          <p className="mr-1 text-gray-800">Already have an account?</p>
          <Link className="text-[#04150A] hover:text-[#25d366]" to="/login">
            Click here to Log in
          </Link>
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

export default Register;
