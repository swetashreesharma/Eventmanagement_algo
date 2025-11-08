import React from 'react';
import "../style/Modal.css"
function Modal({show,onClose,title,message,type="info"}){
    if(!show) return null;
    return(
        <div className="modal-overlay">
            <div className={`modal-content ${type}`}>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className='modal-body'>
                    <button onClick={onClose}className='modal-btn'>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
export default Modal;