import React from "react";
import "../../style/Login.css"; // assuming popup-card and popup-overlay are here

function StateForm({ show, isEditing, inputs, setInputs, onSubmit, onClose }) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button
          className="close-btn"
          onClick={onClose}
        >
          ×
        </button>
        <h4>{isEditing ? "Edit State" : "Add New State"}</h4>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={inputs.state_name}
            onChange={(e) =>
              setInputs({ ...inputs, state_name: e.target.value })
            }
            placeholder="Enter State Name"
          />
          <button type="submit">{isEditing ? "Update" : "Add"}</button>
        </form>
      </div>
    </div>
  );
}

export default StateForm;
