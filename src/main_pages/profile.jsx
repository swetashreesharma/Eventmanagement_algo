import { useEffect, useState } from "react";
import API from "../api/api.jsx";
import "../Login.css";
import "../assests/cities.json";
import PrimaryCities from '../assests/cities.json';
import { UploadAPI } from "../api/api.jsx"; 
import MainPage from "./mainpage.jsx";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const cities = PrimaryCities.reduce((acc, item) => {
  if (!acc[item.state]) {
    acc[item.state] = [];
  }
  acc[item.state].push(item.name);
  return acc;
}, {});
  const baseURL = "http://192.168.1.17:5001/api/users"; 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser && token) {
      const user = JSON.parse(storedUser);

      API.get(`/getprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setProfile(res.data.result);
          setFormData(res.data.result); // prefill data
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
        });
    }
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Update text fields
      await API.post(`/updateProfile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Upload profile picture (if selected)
      if (selectedFile) {
        const formDataPic = new FormData();
        formDataPic.append("profile_pic", selectedFile);
await UploadAPI.post(`/uploadProfilePic`, formDataPic, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

      }

      // Refetch updated profile
      const updatedProfile = await API.get(`/getprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(updatedProfile.data.result);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating profile");
    }
  };

 

  return (
    <>
    <MainPage/>
    <div className="profile-container">
      <h5 className="profile-heading">Profile Page</h5>

      {profile ? (
        <div className="profile-card">
          <div className="profile-image-container">
           <img
  src={""}
  alt="Profile"
  className="profile-image"
/>


            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            )}
          </div>

          <div className="profile-details">
            {editMode ? (
              <form onSubmit={handleSave} className="edit-form">
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </label>

            

                <label>
                  State:
               
                  <select 
                    name="state_name" 
                    value={formData.state_name || ""} 
                    onChange={handleChange} >
                      <option value="">Select State</option>
                       {Object.keys(cities).map((state,id)=>(
                     <option key={id} value={state}>{state}</option>))}
                 </select>
                </label>

                            <label>
                City:
                <select
                  name="city_name"
                  value={formData.city_name || ""}
                  onChange={handleChange}
                >
                  <option value="">Select City</option>
                  {formData.state_name &&
                    cities[formData.state_name]?.map((city, id) => (
                      <option key={id} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </label>


                <label>
                  Mobile Number:
                  <input
                    type="number"
                    name="mobile_num"
                    value={formData.mobile_num || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  DOB:
                  <input
                    type="date"
                    name="dob"
                    value={
                      formData.dob
                        ? new Date(formData.dob).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </label>

                <div className="edit-buttons">
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>State:</strong> {profile.state_name}</p>
                <p><strong>City:</strong> {profile.city_name}</p>
                <p><strong>DOB:</strong> {new Date(profile.dob).toLocaleDateString()}</p>
                <p><strong>Mobile:</strong> {profile.mobile_num}</p>

                <button onClick={handleEditClick} className="edit-btn">
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading profile...</p>
      )}
    </div></>
  );
}

export default Profile;
