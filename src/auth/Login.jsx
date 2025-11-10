/*import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./api/api.jsx";
import AuthForm from "./components/AuthComponents/AuthForm.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputs.email) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(inputs.email)) {
      errors.email = "Invalid email format";
    }
    if (!inputs.password) {
      errors.password = "Password is required";
    } else if (inputs.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      try {
        const res = await API.post("/login", {
          email: inputs.email,
          password: inputs.password,
        });
        console.log("login successful", res.data);
        setMessage("login successful!");
        if (res.data.status) {
          localStorage.setItem("token", res.data.user.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/mainpage");
        } else {
          alert(res.data.error || "Login failed");
        }
      } catch (err) {
        console.error("Login Error:", err);
        alert("Invalid Email or Password!");
        setMessage(err.response?.data?.error || "Invalid email or password");
      }
    } else {
      setMessage("Login Unsuccessfull");
    }
  }

  const fields = [
    {
      label: "Email:",
      name: "email",
      type: "text",
      placeholder: "Enter Email",
      value: inputs.email || "",
      onChange: handleChange,
      error: errors.email,
    },
    {
      label: "Password:",
      name: "password",
      type: "password",
      isPassword: true,
      showPassword,
      togglePassword: () => setShowPassword(!showPassword),
      placeholder: "Enter Password",
      value: inputs.password || "",
      onChange: handleChange,
      error: errors.password,
    },
  ];

  const footerLinks = [
    { Component: Link, to: "/forgotpassword", text: "Forgot Password?" },
    { Component: Link, to: "/register", text: "Don't have an account?" },
  ];

  return (
    <AuthForm
      title="LOGIN"
      fields={fields}
      onSubmit={handleSubmit}
      buttonLabel="Login"
      footerLinks={footerLinks}
    />
  );
}

export default Login;


git add .
git commit -m "Updated project files"
git push



*/

import "../style/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../App.jsx";
import { userAPI } from "../services/backendservices.js";
import Modal from "../components/modal.jsx";
function Login() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [modal,setModal]=useState({show:false,title:"",message:"",type:""});
  const navigate = useNavigate();
  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleModal=(title,message,type="info")=>{
    setModal({show:true,title,message,type});
  }
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }
  function validate() {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputs.email) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(inputs.email)) {
      errors.email = "Invalid email format";
    }
    if (!inputs.password) {
      errors.password = "Password is required";
    } else if (inputs.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      try {
        const res = await userAPI.login({
          email: inputs.email,
          password: inputs.password,
        });

        console.log("login successful", res.data);
                if (res.data.status) {

        toggleModal("Success","Login Successfull","sucess");
        setMessage("login successful!");
        setTimeout(() => {
          
            localStorage.setItem("token", res.data.user.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/mainpage");
        }, 1500);
        
        } else {
          alert(res.data.error || "Login failed");
        }
      } catch (err) {
        console.error("Login Error:", err);
        toggleModal("Error","Invalid Email or Password","error");
        setMessage(err.response?.data?.error || "Invalid email or password");
      }
    } else {
      setMessage("Login Unsuccessfull");
    }
  }
  return (
    <>
      <div className="divcard">
        <form>
          <div className="card">
            <label id="head">LOGIN</label> <br /> <label>Email: </label>{" "}
            <input
              type="text"
              name="email"
              value={inputs.email || ""}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
            <br /> {errors.email && <p>{errors.email}</p>}{" "}
            <label>Password: </label>{" "}
            <div className="password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputs.password || ""}
                onChange={handleChange}
                placeholder="Enter Password"
              />
              <button id="eye" type="button" onClick={passwordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <br /> {errors.password && <p>{errors.password}</p>}
            <Link to="/forgotpassword"> Forgot Password</Link>
            <Link to="/register"> Don't have an account?</Link> <br />
            <button onClick={handleSubmit}>Login</button>
          </div>
        </form>
      </div>
      <div>
        <Modal
        show={modal.show}
        onClose={()=>setModal({...modal,show:false})}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        />

      </div>
    </>
  );
}
export default Login;
