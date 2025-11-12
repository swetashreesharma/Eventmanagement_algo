import { useNavigate } from "react-router-dom";
import { useState ,useImperativeHandle,forwardRef} from "react";
import "../style/Login.css";
import Modal from "./modal.jsx";
    
const Logout = forwardRef((props,ref)=>{
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowModal(true);
  };
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    setShowModal(false);
  };

  useImperativeHandle(ref, () => ({
    triggerLogout: handleLogoutClick,
  }));

  return (<>

        {props.inline ?(<> <div className="layout-section" onClick={handleLogoutClick}>
        
      <span className="logout-text"> Logout</span>{" "}
    </div></>):null}

   
      {showModal &&  (
        <Modal
        show={showModal}
        title="Confirm Logout"
        message="Are You Sure you want ot Logout?"
        type="warning"
        onClose={()=>setShowModal(false)}
        onConfirm={confirmLogout}
        />


      )}

</>

  );
}
);
export default Logout;
