import { StrictMode } from 'react'

import ReactDOM from "react-dom/client";
import App from './App.jsx'

import Login from './Login.jsx';
import Client from './main_pages/clients.jsx';
import Project from './main_pages/projects.jsx';
import State from './main_pages/state.jsx';
import Register from './Register.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
<StrictMode>
      <App/>
  </StrictMode>,
)
