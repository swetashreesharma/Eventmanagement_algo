/*import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userAPI } from "../services/backendservices.js";
import AuthForm from "../components/AuthComponents/AuthForm.jsx"; 
import RememberMe from "../components/AuthComponents/RememberMe";

function Login() {
  const navigate = useNavigate();
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Validation logic
  const validate = (inputs) => {
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
  };

  // Handle form submit
  const handleLogin = async ({ inputs, setErrors, toggleModal }) => {
    const validateErrors = validate(inputs);
    setErrors(validateErrors);

    if (Object.keys(validateErrors).length === 0) {
      try {
        const res = await userAPI.login({
          email: inputs.email,
          password: inputs.password,
        });

        if (res.data.status && res.data.user?.token) {
          toggleModal("Success", "Login Successful", "success");

          setTimeout(() => {
                const token = res.data.user.token;
            const user = res.data.user;

                  localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify(user));
       
            if (rememberMe) {
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify(user));
            } else {
              sessionStorage.setItem("token", token);
              sessionStorage.setItem("user", JSON.stringify(user));
            }

            navigate("/dashboard");
          }, 1500);
        } else {
          toggleModal("Error", res.data.error || "Login failed", "error");
        }
      } catch (err) {
        console.error("Login Error:", err);
        toggleModal("Error", "Invalid Email or Password", "error");
      }
    } else {
      toggleModal("Error", "Invalid Data", "error");
    }
  };

  // Define login fields
  const fields = [
    {
      label: "Email",
      name: "email",
      type: "text",
      placeholder: "Enter Email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter Password",
    },
  ];

  const linkList = [
    { label: "Forgot Password?", to: "/forgotpassword" },
    { label: "Don't have an account? Register", to: "/register" },
  ];

  return (
    <AuthForm
      title="LOGIN"
      fields={fields}
      onSubmit={handleLogin}
      linkList={linkList}
      extraContent={   <RememberMe checked={rememberMe} onChange={setRememberMe} />
}
    />
  );
}

export default Login;
*/import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/backendservices.js";
import AuthForm from "../components/AuthComponents/AuthForm.jsx"; // adjust path if needed

function Login() {
  const navigate = useNavigate();

  // Validation logic
  const validate = (inputs) => {
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
  };

  // Handle form submit
  const handleLogin = async ({ inputs, setErrors, toggleModal }) => {
    const validateErrors = validate(inputs);
    setErrors(validateErrors);

    if (Object.keys(validateErrors).length === 0) {
      try {
        const res = await userAPI.login({
          email: inputs.email,
          password: inputs.password,
        });

        if (res.data.status) {
          toggleModal("Success", "Login Successful", "success");

          setTimeout(() => {
            localStorage.setItem("token", res.data.user.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
          }, 1500);
        } else {
          toggleModal("Error", res.data.error || "Login failed", "error");
        }
      } catch (err) {
        console.error("Login Error:", err);
        toggleModal("Error", "Invalid Email or Password", "error");
      }
    } else {
      toggleModal("Error", "Invalid Data", "error");
    }
  };

  // Define login fields
  const fields = [
    {
      label: "Email",
      name: "email",
      type: "text",
      placeholder: "Enter Email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter Password",
    },
  ];

  const linkList = [
    { label: "Forgot Password?", to: "/forgotpassword" },
    { label: "Don't have an account? Register", to: "/register" },
  ];

  return (
    <AuthForm
      title="LOGIN"
      fields={fields}
      onSubmit={handleLogin}
      linkList={linkList}
    />
  );
}

export default Login;