import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthComponents/AuthForm.jsx";
import { userAPI } from "../services/backendservices.js";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleEmailVerify = async ({ inputs, toggleModal, setInputs }) => {
    if (!inputs.email) {
      toggleModal("Error", "Email is required", "error");
      return;
    }
    try {
      const res = await userAPI.takeEmail({ email: inputs.email });
      toggleModal("Success", "Email Verified", "success");
      if (res.data.token) localStorage.setItem("token", res.data.token);
      setInputs((prev) => ({ ...prev, isEmailSent: true }));
    } catch (err) {
      toggleModal("Error", err.response?.data?.error || "Invalid email", "error");
    }
  };

  const handlePasswordReset = async ({ inputs, toggleModal }) => {
    if (!inputs.password || inputs.password !== inputs.password1) {
      toggleModal("Error", "Passwords do not match", "error");
      return;
    }
    if (inputs.otp != 123456) {
      toggleModal("Error", "Invalid OTP", "error");
      return;
    }
    try {
      await userAPI.verifyOtpAndResetPassword({
        email: inputs.email,
        otp: inputs.otp,
        newPassword: inputs.password,
      });
      toggleModal("Success", "Password Updated", "success");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toggleModal("Error", "Invalid OTP or Email!", "error");
    }
  };

  return (
    <AuthForm
      title="FORGOT PASSWORD"
      onSubmit={({ inputs, setErrors, setInputs, toggleModal }) =>
        inputs.isEmailSent ? handlePasswordReset({ inputs,toggleModal,setInputs,setErrors }) : handleEmailVerify({ inputs,toggleModal,setInputs,setErrors })
      }
      fields={[
        { label: "Email:", name: "email", type: "text", placeholder: "Enter Email" },
        {
          label: "Password:",
          name: "password",
          type: "password",
          placeholder: "Enter Password",
          condition: (inputs) => inputs.isEmailSent,
        },
        {
          label: "Re-Enter Password:",
          name: "password1",
          type: "password",
          placeholder: "Re-Enter Password",
          condition: (inputs) => inputs.isEmailSent,
        },
        {
          label: "OTP:",
          name: "otp",
          type: "text",
          placeholder: "Enter OTP",
          condition: (inputs) => inputs.isEmailSent,
        },
      ]}
      linkList={[{ label: "Remember password?", to: "/" }]}
    />
  );
}

export default ForgotPassword;
