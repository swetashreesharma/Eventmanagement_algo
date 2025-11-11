import React from "react";
import "../../style/Login.css";
import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

function PopupForm({
  title,
  formMode,
  inputs,
  errors,
  handleChange,
  handleSubmit,
  setShowForm,  
  fields,
}) {
   const navigate = useNavigate();

  const popUpRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popUpRef.current &&
        !popUpRef.current.contains(event.target)
      ) {
        setShowForm(false);
      }
    }

      document.addEventListener("mousedown", handleClickOutside);
   

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowForm]);
  return (
    <div 
     className="popup-overlay" >
      <div className="popup-card"  ref={popUpRef}>
        <button className="close-btn" onClick={() => setShowForm(false)}>
          ×
        </button>
        <h4>{formMode === "update" ? `Update ${title}` : `Add New ${title}`}</h4>

        <form onSubmit={handleSubmit}>
          {fields.map((field, i) => {
            if (field.type === "textarea") {
              return (
                <div key={i}>
                  <label>{field.label}</label>
                  <textarea
                    name={field.name}
                    value={inputs[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    rows={field.rows || 3}
                    disabled={field.disabled || false}
                  ></textarea>
                  {errors[field.name] && <p className="error">{errors[field.name]}</p>}
                </div>
              );
            }

            if (field.type === "select") {
              return (
                <div key={i}>
                  <label>{field.label}</label><br/>
                  <select
                    name={field.name}
                    value={inputs[field.name] || ""}
                    onChange={handleChange}
                    disabled={field.disabled || false}
                    className="client-project-form"

                  >
                    <option value="">{field.placeholder || "Select"}</option>
                    {field.options?.map((opt, idx) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && <p className="error">{errors[field.name]}</p>}
                </div>
              );
            }

            if (field.type === "radio") {
              return (
                <div key={i}>
                  <label>{field.label}</label>
                  <div className="gender-options">
                    {field.options.map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="radio"
                          name={field.name}
                          value={opt.value}
                          checked={inputs[field.name] === opt.value}
                          onChange={handleChange}

                        />{" "}
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {errors[field.name] && <p className="error">{errors[field.name]}</p>}
                </div>
              );
            }

            // Default: input field
            return (
              <div key={i}>
                <label>{field.label}</label><br/>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={inputs[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder || ""}
                  disabled={field.disabled || false}
                  className="client-project-form"
                />
                {errors[field.name] && <p className="error">{errors[field.name]}</p>}
              </div>
            );
          })}

          <button className="submit-btn" type="submit">
            {formMode === "update" ? `Update ${title}` : `Add ${title}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;
