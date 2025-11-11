import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import MainPage from "../main_pages/sidebar";
import Profile from "../main_pages/profile";
import Client from "../main_pages/clients";
import Project from "../main_pages/projects";
import DashBoard from "../main_pages/dashboard";
import State from "../main_pages/state/state1";
import Layout from "../components/layout";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
         <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/client" element={<Client />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/state" element={<State />} />
      </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;
