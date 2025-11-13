import { BASE_URL } from "../utils/constant"
import axios from "axios";

// --- Axios Instances ---
const apiClient = axios.create({ baseURL: `${BASE_URL}/clients` });
const apiProject = axios.create({ baseURL: `${BASE_URL}/projects` });
const apiState = axios.create({ baseURL: `${BASE_URL}/states` });
const apiTask = axios.create({ baseURL: `${BASE_URL}/tasks` });
const apiUser = axios.create({ baseURL: `${BASE_URL}/users` });

// --- Request Interceptor for Token ---
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

apiClient.interceptors.request.use(attachToken);
apiProject.interceptors.request.use(attachToken);
apiState.interceptors.request.use(attachToken);
apiTask.interceptors.request.use(attachToken);
apiUser.interceptors.request.use(attachToken);

//---User APIs----
export const userAPI = {
  register: (data) => apiUser.post("/register", data),
  verifyOtp: (data) => apiUser.post("/verify_otp", data),

  login: (data) => apiUser.post("/login", data),

  getProfile: () => apiUser.get("/getprofile"),
  updateProfile: (data) => apiUser.post("/updateProfile", data),
  uploadProfilePic: (formData) =>
    apiUser.post("/uploadProfilePic", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  takeEmail: (data) => apiUser.post("/takeEmail", data),
  verifyOtpAndResetPassword: (data) =>
    apiUser.post("/verifyOtpAndResetPassword", data),
};

// --- Upload APIs (for profile picture or files) ---
export const uploadAPI = {
  uploadProfilePic: (formData) =>
    apiUser.post("/uploadProfilePic", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

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
  updateProject: (data) => apiProject.post("/updateproject", data),
  deleteProject: (data) => apiProject.post("/deleteproject", data),
};

//---State APIs----
export const stateAPI = {
  addState: (data) => apiState.post("/addstate", data),
  getAllStates: (data) => apiState.post("/getallstates", data),
  getStateById: (data) => apiState.post("getstatebyid", data),
  updateState: (data) => apiState.post("/updatestate", data),
  deleteState: (data) => apiState.post("/deletestate", data),
};

//---Task APIs----

export const taskAPI = {
  getAllTasks: (data) => apiTask.post("/getalltasks",data),
  getTaskById: (data) => apiTask.post("/gettaskbyid", data),
  addTask: (data) => apiTask.post("/addtask", data),
  updateTask: (data) => apiTask.post("/updatetask", data),
  deleteTask: (data) => apiTask.post("/deletetask", data),
  getTaskHistoryById: (data) => apiTask.post("/gettaskhistorybytaskid", data),
};

