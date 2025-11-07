import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import Register from "./Register";
import Profile from "./main_pages/profile";
import MainPage from "./main_pages/mainpage";
import Client from "./main_pages/clients";
import Project from "./main_pages/projects";
import DashBoard from "./main_pages/dashboard";
import State from "./main_pages/state";
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login/>} />
    <Route path="/register" element={<Register/>} />
    <Route path="/forgotpassword" element={<ForgotPassword/>} />
    <Route path="/profile" element={<Profile/>} />
    <Route path="/mainpage" element={<MainPage/>} />
    <Route path="/client" element={<Client/>} />
    <Route path="/projects" element={<Project/>} />
    <Route path="/dashboard" element={<DashBoard/>} />
    <Route path="/state" element={<State/>} />

    </Routes>
    </BrowserRouter>
  
  )
}

export default App
