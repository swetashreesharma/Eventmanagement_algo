import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "../modal.jsx";
import "../../style/auth/authForm.css";

function AuthForm({ title, fields, onSubmit, linkList = [], extraProps = {} ,extraContent}) {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState({});
  const [modal, setModal] = useState({
    show: false,  
    title: "",
    message: "",
    type: "",
  });

  const toggleModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (name) => {
    setShowPasswordFields((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inputs, setInputs, setErrors, toggleModal });
  };

  const [citiesOptions, setCitiesOptions] = useState([]);
  useEffect(() => {
    if (extraProps.cities && inputs[extraProps.inputsStateKey]) {
      setCitiesOptions(
        extraProps.cities[inputs[extraProps.inputsStateKey]] || []
      );
    }
  }, [inputs, extraProps]);

  return (
    <>
      <div className="divcard">
        <form onSubmit={handleSubmit}>
          <div className="card">
            <label id="head">{title}</label>

            {fields.map((field, idx) => {
              const {
                label,
                name,
                type = "text",
                placeholder,
                disabled = false,
                condition, // function returning true/false to render
                options, // for select
              } = field;

              if (condition && !condition(inputs)) return null; // skip field if condition false

              const isPassword = type === "password";
              const showPassword = showPasswordFields[name];

              return (
                <div key={idx}>
                  <label>{label}</label>
                  <br />
                  {type === "select" ? (
                    <select
                      name={name}
                      value={inputs[name] || ""}
                      onChange={handleChange}
                      disabled={disabled}
                      className="auth"
                    >
                      <option value="">Select {label}</option>
                      {(options || (name === "city" ? citiesOptions : []))?.map(
                        (opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        )
                      )}
                    </select>
                  ) : isPassword ? (
                    <div className="password">
                      <input
                        type={showPassword ? "text" : "password"}
                        name={name}
                        value={inputs[name] || ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="auth"
                      />
                      <button
                        type="button"
                        id="eye"
                        onClick={() => togglePasswordVisibility(name)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={inputs[name] || ""}
                      onChange={handleChange}
                      placeholder={placeholder}
                      disabled={disabled}
                                              className="auth"

                    />
                  )}

                  {errors[name] && <p>{errors[name]}</p>}
                </div>
              );
            })}
             {extraContent && <div >{extraContent}</div>}

            
            
            {linkList.map((link, idx) => (
              <div key={idx} id="link">
                <a href={link.to}>{link.label}</a>
                <br />
              </div>
            ))}
            <br />
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>

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

export default AuthForm;
