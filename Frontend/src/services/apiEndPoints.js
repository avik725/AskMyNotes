export const API_BASE_URL = "http://localhost:8000/api/v1/";

// User End Points
export const getCurrentUser = API_BASE_URL + "users/getCurrentUser";
export const userLogin = API_BASE_URL + "users/login";
export const userLogout = API_BASE_URL + "users/logout";
export const checkUsernameIfAvailable =
  API_BASE_URL + "users/checkUsernameIfAvailable";
export const userRegistration = API_BASE_URL + "users/register";


// Notes Api End Points
export const getStreams = API_BASE_URL + "notes/get-streams";
export const getCourses = API_BASE_URL + "notes/get-courses";
export const getStreamWiseNotes = API_BASE_URL + "notes/get-stream-wise-notes";
export const getFiltersData = API_BASE_URL + "notes/get_filters";
export const getMyUploads = API_BASE_URL + "notes/get-my-uploads";
export const getNotes = API_BASE_URL + "notes/get-notes";
export const getFeaturesNotes = API_BASE_URL + "notes/get-featured-notes";


export const uploadNotes = API_BASE_URL + "notes/upload-notes";
