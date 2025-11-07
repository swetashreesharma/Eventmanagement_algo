import "./Login.css";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import API from "./api/api.jsx";

function ForgotPassword() {
  const [inputs, setInputs] = useState({});

  const [isOtpShown, setIsOtpShown] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const passwordVisiblitiy = () => {
    setShowPassword(!showPassword);
  };
  const passwordVisiblitiy1 = () => {
    setShowPassword1(!showPassword1);
  };

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  function validateEmail() {
    let emailErrors = {};
    if (!inputs.email) {
      emailErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      emailErrors.email = "Enter avalid Email";
    }

    return emailErrors;
  }
  function validatePassword() {
    let passwordErrors = {};
    if (!inputs.password) {
      passwordErrors.password = "Password is required";
    } else if (inputs.password.length < 8) {
      passwordErrors.password = "Password must be of atleast 8 characters";
    }

    if (inputs.password1 !== inputs.password) {
      passwordErrors.password1 = "Password do not match";
    }
    return passwordErrors;
  }
  async function handleEmailSubmit(e) {
    e.preventDefault();
    const validateErrors = validateEmail();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      try {
        const res = await API.post("/takeEmail", {
          email: inputs.email,
        });
        console.log("Got Email", res.data);
        setMessage("Email Verified");
        alert("Enter Password");
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        setIsEmailSent(true);
      } catch (err) {
        console.error("email error", err);
        alert("Invalid Email");
        setMessage(err.response?.data?.error || "Invslid Email.");
      }
    } else {
      alert("Network error");
      setIsEmailSent(false);
    }
  }
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    const validateErrors = validatePassword();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0 && inputs.otp == 123456) {
      try {
        const res = API.post("/verifyOtpAndResetPassword", {
          email: inputs.email,
          otp: inputs.otp,
          newPassword: inputs.password,
        });
        alert("Password Updated Successful");
        alert("Password upadted");
        setIsOtpShown(true);
        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        alert("Invalid OTP or Email!");
        console.log(err);
      }
    } else {
      alert("Password didn't match");
      setIsOtpShown(false);
    }
  }
  /*
  function handleOTP(e){
      e.preventDefault();
      if(inputs.otp ==112233){
      alert("password updated ! ")

      }
      else{
              alert("Wrong OTP! ")

      }


  }
*/
  return (
    <>
    <div className="divcard">
      <div className="card">
        <label id="head">Forgot Password</label>
        <br />
        <label>Email: </label>
        <input
          type="text"
          name="email"
          value={inputs.email || ""}
          onChange={handleChange}
          disabled={isEmailSent}
          placeholder="Enter Email"
        />
        <br />
        {errors.email && <p>{errors.email}</p>}

        {isEmailSent ? (
          <>
            <label>Password: </label>
            <div className="password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputs.password || ""}
                onChange={handleChange}
                disabled={isOtpShown}
                placeholder="Enter Password"
              />
              <button id="eye" type="button" onClick={passwordVisiblitiy}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <br />
            {errors.password && <p>{errors.password}</p>}

            <label>Re-Enter Password: </label>
            <div className="password">
              <input
                type={showPassword1 ? "text" : "password"}
                name="password1"
                value={inputs.password1 || ""}
                onChange={handleChange}
                disabled={isOtpShown}
                placeholder="Re-Enter Password"
              />
              <button id="eye" type="button" onClick={passwordVisiblitiy1}>
                {showPassword1 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <br />
            {errors.password1 && <p>{errors.password1}</p>}
            <label>OTP: </label>
            <input
              type="text"
              name="otp"
              value={inputs.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              disabled={isOtpShown}
            />
            <br />
            <button onClick={handlePasswordSubmit} disabled={isOtpShown}>
              Update Password
            </button>
          </>
        ) : (
          <></>
        )}

        <Link to="/">Remember password ?</Link>
        <br />
        {!isEmailSent && (
          <button onClick={handleEmailSubmit} disabled={isOtpShown}>
            Verify Email
          </button>
        )}

        {/*isOtpShown ? (
        <>
        
        <label>OTP: </label><input type="text" name="otp" value={inputs.otp} onChange={handleChange} placeholder="Enter OTP" disabled={!isOtpShown}/><br/>
        <button onClick={handleOTP} disabled={!isOtpShown}>Update password</button>
</>
      ) : (<></>)*/}
      </div>
      </div>
    </>
  );
}
export default ForgotPassword;
