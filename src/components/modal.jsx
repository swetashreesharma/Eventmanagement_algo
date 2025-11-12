// modal.jsx
import React from "react";
import "../style/modal.css";
import { createPortal } from "react-dom";

function Modal({ show, onClose, title, message, type, onConfirm }) {
  if (!show) return null;

  const isConfirm = typeof onConfirm === "function";

  const modalContent= (
    <div className="modal-overlay">
      <div className={`modal-card ${type}`}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-buttons">
          {isConfirm ? (
            <>
              <button className="confirm-btn" onClick={() => onConfirm()}>
                Yes
              </button>
              <button className="cancel-btn" onClick={onClose}>
                No
              </button>
            </>
          ) : (
            <button className="ok-btn" onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
  return createPortal(modalContent,document.body)
}

export default Modal;
