import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../style/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PrimaryCities from "../assests/cities.json";
import { userAPI } from "../services/backendservices.js";
import Modal from "../components/modal.jsx";

function Register() {
  const [inputs, setInputs] = useState({});
  const [message, setMessage] = useState("");
  const [isOtpShown, setIsOtpShown] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "", type: "" });

  const navigate = useNavigate();

  //  Modal function
  const toggleModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };

  const passwordVisiblitiy = () => setShowPassword(!showPassword);
  const passwordVisiblitiy1 = () => setShowPassword1(!showPassword1);

  // Create a state→city structure
  const cities = PrimaryCities.reduce((acc, item) => {
    if (!acc[item.state]) acc[item.state] = [];
    acc[item.state].push(item.name);
    return acc;
  }, {});

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  //  Register user
  async function handleRegister(e) {
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
      toggleModal("Success", res.data.message || "Registration successful! Verify OTP.", "success");
      setIsOtpShown(true);
    } catch (err) {
      toggleModal("Error", err.response?.data?.error || "Registration Failed", "error");
    }
  }

  // Verify OTP
  async function handleVerifyOtp() {
    try {
      const res = await userAPI.verifyOtp({
        email: inputs.email,
        otp: Number(inputs.otp),
      });
      toggleModal("Success", "OTP Verified! Redirecting to Login...", "success");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toggleModal("Error", err.response?.data?.error || "OTP verification failed", "error");
    }
  }

  //  Validation
  function validate() {
    const errors = {};
    const currentDate = new Date();

    if (!inputs.name) errors.name = "First name is required";
    if (!inputs.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      errors.email = "Invalid email format";
    }

    if (!inputs.password) errors.password = "Password is required";
    else if (inputs.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (inputs.password !== inputs.password1)
      errors.password1 = "Passwords do not match";

    if (!inputs.date) errors.date = "Date of birth is required";
    else if (new Date(inputs.date) > currentDate)
      errors.date = "Date of birth cannot be in the future";

    if (!inputs.state) errors.state = "Please select a state";
    if (!inputs.city) errors.city = "Please select a city";

    if (!inputs.number) errors.number = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(inputs.number))
      errors.number = "Enter valid 10-digit number";

    return errors;
  }

  return (
    <>
      <div className="divcard">
        <div className="card">
          <label id="head">REGISTRATION</label>
          <br />
          <label>First Name:</label>
          <input
            type="text"
            name="name"
            value={inputs.name || ""}
            onChange={handleChange}
            placeholder="Enter First Name"
            disabled={isOtpShown}
          />
          <br />
          {errors.name && <p>{errors.name}</p>}

          <label>Email:</label>
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

          <label>Password:</label>
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
          </div>
          <br />
          {errors.password && <p>{errors.password}</p>}

          <label>Re-Enter Password:</label>
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

          <label>Date Of Birth:</label>
          <input
            type="date"
            name="date"
            value={inputs.date || ""}
            onChange={handleChange}
            disabled={isOtpShown}
          />
          <br />
          {errors.date && <p>{errors.date}</p>}

          <label>State:</label>
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
              <label>City:</label>
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
                ))}
              </select>
              <br />
              {errors.city && <p>{errors.city}</p>}
            </>
          )}

          <label>Number:</label>
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
              <label>OTP:</label>
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
            <>
              <button onClick={handleRegister}>Submit</button>
            </>
          )}

          <Link to="/">Already have an account?</Link>
        </div>
      </div>

      {/*Modal Section */}
      <Modal
        show={modal.show}
        onClose={() => setModal({ ...modal, show: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </>
  );
}

export default Register;
