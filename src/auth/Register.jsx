import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
//import "../Login.css";
import "../style/Login.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../assests/cities.json";
import PrimaryCities from "../assests/cities.json";
import { userAPI } from "../services/backendservices.js";
function Register() {
  const [inputs, setInputs] = useState({});
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpShown, setIsOtpShown] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const navigate = useNavigate();

  const passwordVisiblitiy = () => {
    setShowPassword(!showPassword);
  };
  const passwordVisiblitiy1 = () => {
    setShowPassword1(!showPassword1);
  };

  const cities = PrimaryCities.reduce((acc, item) => {
    if (!acc[item.state]) {
      acc[item.state] = [];
    }
    acc[item.state].push(item.name);
    return acc;
  }, {});

  /*const cities = {
   Gujarat: ["Ahmedabad", "Surat", "Rajkot", "Vadodara"],
   Delhi: ["New Delhi", "Dwarka", "Karolbagh"],
   Punjab: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  Mumbai: ["Andheri", "Bandra", "Dadar", "Borivali"]
 };*/

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length > 0) return;
    try {
      const payload = {
        name: inputs.name,
        email: inputs.email,
        password_hash: inputs.password,
        state_name: inputs.state,
        city_name: inputs.city,
        mobile_num: inputs.number,
        dob: new Date(inputs.date).toISOString(),
      };

      const res = await userAPI.register(payload);
      setMessage(res.data.message || "Registration successfull. verify OTP");
      setIsOtpShown(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration Failed");
    }
  }

  async function handleVerifyOtp() {
    try {
      const res = await userAPI.verifyOtp( {
        email: inputs.email,
        otp: Number(inputs.otp),
      });
      setMessage(res.data.message || "OTP verified ");
      alert("OTP verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "OTP verification failed");
    }
  }

  function validate() {
    const errors = {};
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //const numberPattern = /^[0-9]{10}$/;
    const cureentDate = new Date();
    if (!inputs.name) {
      errors.name = "First name is required";
    }
    if (!inputs.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      errors.email = "Invalid email format";
    }

    if (!inputs.password) {
      errors.password = "Password is required";
    } else if (inputs.password.length < 8) {
      errors.password = "Password must be at least  characters";
    }
    if (inputs.password !== inputs.password1) {
      errors.password1 = "password didn't match";
    }
    if (!inputs.date) {
      errors.date = "Date of birth is required";
    } else if (inputs.data > cureentDate) {
      errors.date = "Enter proper Birthdate";
    }
    if (!inputs.state) {
      errors.state = "Please select a state";
    }
    if (!inputs.city) {
      errors.city = "Please select a city";
    }

    if (!inputs.number) {
      errors.number = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(inputs.number)) {
      errors.number = "Enter valid 10-digit number";
    }

    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      alert("Registration successfull! OTP sent");

      setIsOtpShown(true);
    } else {
      alert("Registration not successfull!");
    }
  }

  return (
    <>
    <div className="divcard">
      <div className="card">
        <label id="head">REGISTRATION</label>
        <br />
        <label>FirstName: </label>
        <input
          type="text"
          name="name"
          value={inputs.name || ""}
          onChange={handleChange}
          placeholder="Enter FirstName"
          disabled={isOtpShown}
        />
        <br />
        {errors.name && <p>{errors.name}</p>}
        <label>Email: </label>
        <input
          type="text"
          name="email"
          value={inputs.email || ""}
          onChange={handleChange}
          placeholder="Enter Email"
          disabled={isOtpShown}
        />
        <br />
        {errors.email && <p>{errors.email}</p>}
        <label>Password: </label>
        <div className="password">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
            placeholder="Enter Password"
            disabled={isOtpShown}
          />
          <button id="eye" type="button" onClick={passwordVisiblitiy}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>{" "}
        <br />
        {errors.password && <p>{errors.password}</p>}
        <label>Re-Enter Password: </label>
        <div className="password">
          <input
            type={showPassword1 ? "text" : "password"}
            name="password1"
            value={inputs.password1 || ""}
            onChange={handleChange}
            placeholder="Re-Enter Password"
            disabled={isOtpShown}
          />
          <button id="eye" type="button" onClick={passwordVisiblitiy1}>
            {showPassword1 ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <br />
        {errors.password1 && <p>{errors.password1}</p>}
        <label>Date Of Birth: </label>
        <input
          type="date"
          name="date"
          value={inputs.date || ""}
          onChange={handleChange}
          placeholder="Enter DOB"
          disabled={isOtpShown}
        />
        <br />
        {errors.date && <p>{errors.date}</p>}
        <label>State: </label>
        <select
          name="state"
          value={inputs.state || ""}
          onChange={handleChange}
          disabled={isOtpShown}
        >
          <option value="">Select State</option>
          {Object.keys(cities).map((state, id) => (
            <option key={id} value={state}>
              {state}
            </option>
          ))}
        </select>
        <br />
        {errors.state && <p>{errors.state}</p>}
        {inputs.state && (
          <>
            <label>City: </label>
            <select
              name="city"
              value={inputs.city || ""}
              onChange={handleChange}
              disabled={isOtpShown}
            >
              <option>Select City</option>
              {cities[inputs.state].map((city, id) => (
                <option key={id} value={city}>
                  {city}
                </option>
              ))}{" "}
            </select>
            <br />
            {errors.city && <p>{errors.city}</p>}
          </>
        )}
        <label>Number: </label>
        <input
          type="text"
          name="number"
          value={inputs.number || ""}
          onChange={handleChange}
          placeholder="Enter Number"
          disabled={isOtpShown}
        />
        <br />
        {errors.number && <p>{errors.number}</p>}
        {isOtpShown ? (
          <>
            <label>OTP: </label>
            <input
              type="text"
              name="otp"
              value={inputs.otp || ""}
              onChange={handleChange}
              placeholder="Enter OTP"
            />
            <br />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        ) : (
          <></>
        )}
        <Link to="/"> Already have an account?</Link>
        <br />
        {!isOtpShown ? (
          <>
            <button onClick={handleRegister}> Submit </button>{" "}
          </>
        ) : (
          <></>
        )}
      </div>
      </div>
    </>
  );
}

export default Register;
