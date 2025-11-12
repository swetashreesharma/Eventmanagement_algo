import { useEffect, useState } from "react";
import "../style/profile.css";
import PrimaryCities from "../assests/cities.json";
//import Sidebar from "./sidebar.jsx";
import { userAPI } from "../services/backendservices.js";
import Modal from "../components/modal.jsx"; // import your existing modal
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });
const navigate=useNavigate();
  const baseURL = "http://192.168.1.17:5000";
  const imageURL = profile?.profile_pic
    ? baseURL + profile.profile_pic.replace(/\\/g, "/").replace(/^\/+/, "/")
    : "/default-avatar.png";

  const cities = PrimaryCities.reduce((acc, item) => {
    if (!acc[item.state]) acc[item.state] = [];
    acc[item.state].push(item.name);
    return acc;
  }, {});
  const toggleModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser && token) {
      userAPI
        .getProfile()
        .then((res) => {
          setProfile(res.data.result);
          setFormData(res.data.result);
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
        });
    }
  }, []);

  const handleEditClick = () => setEditMode(true);

  const handleCancel = () => {
    setEditMode(false);
    setFormData(profile);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const selectedDate = new Date(value);
      const today = new Date();
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();

    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.state_name) newErrors.state_name = "Please select a state";
    if (!formData.city_name) newErrors.city_name = "Please select a city";

    if (!formData.mobile_num) {
      newErrors.mobile_num = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile_num)) {
      newErrors.mobile_num = "Enter a valid 10-digit mobile number";
    }

    if (!formData.dob) newErrors.dob = "Please select your date of birth";
    else if (new Date(formData.dob) > currentDate) {
      newErrors.dob = "Enter proper Birthdate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { email, profile_pic, ...dataToSend } = formData;
      await userAPI.updateProfile(dataToSend);

      if (selectedFile) {
        const formDataPic = new FormData();
        formDataPic.append("profile_pic", selectedFile);
        await userAPI.uploadProfilePic(formDataPic);
      }

      const updatedProfile = await userAPI.getProfile();
      setProfile(updatedProfile.data.result);
      setEditMode(false);

      toggleModal("Success", "Profile Updated Successfull", "success");
    } catch (err) {
      console.error("Update failed:", err);
      setModal({
        show: true,
        message: err.response?.data?.msg || "Error updating profile",
        onConfirm: () => setModal({ show: false, message: "" }),
      });
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <h2 className="profile-title">Profile Info</h2>

          <div className="profile-header">
            <div className="profile-image-container">
              <img src={imageURL} alt="Profile" className="profile-image" />
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
              )}
            </div>

            <div className="profile-main-info">
              <h3>{profile?.name}</h3>
              <button className="change-password-btn" onClick={()=>navigate("/forgotpassword")}>Change Password</button>
            </div>
          </div>

          {profile ? (
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    disabled
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  {editMode ? (
                    <>
                      {" "}
                      <label>State:</label>
                      <select
                        name="state_name"
                        value={formData.state_name || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      >
                        <option value="">Select State</option>
                        {Object.keys(cities).map((state, id) => (
                          <option key={id} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state_name && (
                        <p className="error-text">{errors.state_name}</p>
                      )}
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="form-group">
                        <label>State:</label>
                        <input
                          name="state_name"
                          value={formData.state_name || ""}
                          disabled
                        />
                      </div>
                    </>
                  )}
                </div>
                {editMode ? (
                  <>
                    {" "}
                    <div className="form-group">
                      <label>City:</label>
                      <select
                        name="city_name"
                        value={formData.city_name || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      >
                        <option value="">Select City</option>
                        {formData.state_name &&
                          cities[formData.state_name]?.map((city, id) => (
                            <option key={id} value={city}>
                              {city}
                            </option>
                          ))}
                      </select>
                      {errors.city_name && (
                        <p className="error-text">{errors.city_name}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>City:</label>
                      <input
                        name="city_name"
                        value={formData.city_name || ""}
                        disabled
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mobile Number:</label>
                  <input
                    type="number"
                    name="mobile_num"
                    value={formData.mobile_num || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                  {errors.mobile_num && (
                    <p className="error-text">{errors.mobile_num}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Date of Birth:</label>
                  <input
                    type="date"
                    name="dob"
                    value={
                      formData.dob
                        ? new Date(formData.dob).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                  {errors.dob && <p className="error-text">{errors.dob}</p>}
                </div>
              </div>

              {editMode ? (
                <div className="edit-buttons">
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="edit-btn"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </button>
              )}
            </form>
          ) : (
            <p className="loading-text">Loading profile...</p>
          )}
        </div>
      </div>

      {/* Modal Section */}
      {modal.show && (
        <Modal
          show={modal.show}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ ...modal, show: false })}
          onConfirm={modal.onConfirm}
        />
      )}
    </>
  );
}

export default Profile;
