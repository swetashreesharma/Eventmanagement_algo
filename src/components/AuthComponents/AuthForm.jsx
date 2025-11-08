// src/components/AuthForm.jsx
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../style/Login.css";

function AuthForm({
  title,
  fields,         // [{ label, name, type, placeholder, value, onChange, error }]
  onSubmit,
  buttonLabel,
  footerLinks = [],
}) {
  return (
    <div className="divcard">
      <form onSubmit={onSubmit}>
        <div className="card">
          <label id="head">{title}</label>
          <br />

          {fields.map((field, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <label>{field.label}</label>
              {field.isPassword ? (
                <div className="password">
                  <input
                    type={field.showPassword ? "text" : "password"}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                  />
                  <button id="eye" type="button" onClick={field.togglePassword}>
                    {field.showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
              )}
              {field.error && <p>{field.error}</p>}
            </div>
          ))}

          <button type="submit">{buttonLabel}</button>

          {footerLinks.map((link, index) => (
            <div key={index}>
              <link.Component to={link.to}>{link.text}</link.Component>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
