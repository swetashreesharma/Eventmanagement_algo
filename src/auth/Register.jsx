import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthComponents/AuthForm.jsx";
import { userAPI } from "../services/backendservices.js";
import PrimaryCities from "../assests/cities.json";

function Register() {
  const navigate = useNavigate();

  const cities = PrimaryCities.reduce((acc, item) => {
    if (!acc[item.state]) acc[item.state] = [];
    acc[item.state].push(item.name);
    return acc;
  }, {});

  const handleRegister = async ({
    inputs,
    toggleModal,
    setErrors,
    setInputs,
  }) => {
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

    setErrors(errors);
    if (Object.keys(errors).length > 0) return;

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

      await userAPI.register(payload);
      toggleModal("Success", "Registration successful! Verify OTP.", "success");
      setInputs((prev) => ({ ...prev, isOtpShown: true }));
    } catch (err) {
      toggleModal(
        "Error",
        err.response?.data?.error || "Registration failed",
        "error"
      );
    }
  };

  const handleVerifyOtp = async ({ inputs, toggleModal }) => {
    try {
      await userAPI.verifyOtp({ email: inputs.email, otp: Number(inputs.otp) });
      toggleModal(
        "Success",
        "OTP Verified! Redirecting to Login...",
        "success"
      );
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toggleModal(
        "Error",
        err.response?.data?.error || "OTP verification failed",
        "error"
      );
    }
  };

  return (
    <AuthForm
      title="REGISTRATION"
      onSubmit={({ inputs, setErrors, setInputs, toggleModal }) =>
        inputs.isOtpShown
          ? handleVerifyOtp({ inputs, toggleModal })
          : handleRegister({ inputs, setErrors, setInputs, toggleModal })
      }
      extraProps={{ cities, inputsStateKey: "state" }}
      fields={[
        {
          label: "First Name:",
          name: "name",
          type: "text",
          placeholder: "Enter First Name",
        },
        {
          label: "Email:",
          name: "email",
          type: "text",
          placeholder: "Enter Email",
          disabled: false,
        },
        {
          label: "Password:",
          name: "password",
          type: "password",
          placeholder: "Enter Password",
        },
        {
          label: "Re-Enter Password:",
          name: "password1",
          type: "password",
          placeholder: "Re-Enter Password",
        },
        { label: "Date Of Birth:", name: "date", type: "date" },
        {
          label: "State:",
          name: "state",
          type: "select",
          options: Object.keys(cities),
        },
        {
          label: "City:",
          name: "city",
          type: "select",
          condition: (inputs) => !!inputs.state, // show only after state selected
        },
        {
          label: "Number:",
          name: "number",
          type: "text",
          placeholder: "Enter Number",
        },
        {
          label: "OTP:",
          name: "otp",
          type: "text",
          placeholder: "Enter OTP",
          condition: (inputs) => inputs.isOtpShown, // show only after registration
        },
      ]}
      linkList={[{ label: "Already have an account?", to: "/" }]}
    />
  );
}

export default Register;
