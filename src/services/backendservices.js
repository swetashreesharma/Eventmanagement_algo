// import { API_URL } from "../utils/constant"
// export const GetApiRequest = ()=>(path){
//     const token = localStorage.getItem("toke")
//     try{
//        co 
//     }
// }

import axios from "axios";

// --- Base URLs ---
const BASE_URL = "http://192.168.1.17:5000/api";

// --- Axios Instances ---
const apiClient = axios.create({ baseURL: `${BASE_URL}/clients` });
const apiProject = axios.create({ baseURL: `${BASE_URL}/projects` });
const apiState = axios.create ({baseURL: `${BASE_URL}/states`});

// --- Request Interceptor for Token ---
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

apiClient.interceptors.request.use(attachToken);
apiProject.interceptors.request.use(attachToken);
apiState.interceptors.request.use(attachToken);

// --- Client APIs ---
export const clientAPI = {
  getClientById: () => apiClient.get("/getclientbyid"),
  getAllClients: () => apiClient.get("/getallclients"),
  addClient: (data) => apiClient.post("/addclient", data),
  updateClient: (data) => apiClient.post("/updateclient", data),
  deleteClient: (data) => apiClient.post("/deleteclient", data),
};

// --- Project APIs ---
export const projectAPI = {
  getAllProjects: () => apiProject.get("/getallprojects"),
  addProject: (data) => apiProject.post("/addproject", data),
  updateProject:(data)=>apiProject.post("/updateproject",data),
  deleteProject:(data)=>apiProject.post("/deleteproject",data),
};

export const stateAPI={
  addState:(data)=>apiState.post("/addstate",data),
  getAllStates:(data)=>apiState.post("/getallstates",data),
  getStateById:(data)=>apiState.post("getstatebyid",data),
  updateState:(data)=>apiState.post("/updatestate",data),
  deleteState:(data)=>apiState.post("/deletestate",data),
}
/*
//clients api
const API = axios.create({
  baseURL: "http://192.168.1.17:5000/api/clients",
});

//projects api
const PROJECT_API= axios.create({
  baseURL:"http://192.168.1.17:5000/api/projects"
});


export const getClientById = () => {
  const token = localStorage.getItem("token"); // make sure token exists
  return API.get("/getclientbyid", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const addClient = (data) => {
  const token = localStorage.getItem("token"); // get token
  return API.post("/addclient", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const addProject =(data)=>{
  const token = localStorage.getItem("token");
  return PROJECT_API.post("/addproject" , data,{
    headers:{
      Authorization: `Bearer ${token}`
    },
  });
};
export const getAllClients = () => {
  const token = localStorage.getItem("token"); // make sure token exists
  return API.get("/getallclients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllProjects=()=>{
  const token=localStorage.getItem("token");
  return PROJECT_API.get("/getallprojects",{
    headers:{
      Authorization:`Bearer ${token}`,
    },
  });

};
export const updateClient = (data) => {
  const token = localStorage.getItem("token");
  return API.post("/updateclient", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteClient = (data) => {
  const token = localStorage.getItem("token");
  return API.post("/deleteclient", data, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
*/
