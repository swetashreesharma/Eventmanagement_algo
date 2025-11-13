// components/Auth/RememberMe.jsx
import React from "react";
import "../../style/Login.css";

function RememberMe({ checked, onChange }) {
  return (
    <div >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="remember-me"
        />
              <label >
Remember Me
      </label>
    </div>
  );
}

export default RememberMe;
