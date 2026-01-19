export const API_BASE_URL = "http://localhost:8000/api/v1/";

// User End Points
export const getCurrentUser = API_BASE_URL + "users/getCurrentUser";
export const userLogin = API_BASE_URL + "users/login";
export const userLogout = API_BASE_URL + "users/logout";
export const checkUsernameIfAvailable =
  API_BASE_URL + "users/checkUsernameIfAvailable";
export const userRegistration = API_BASE_URL + "users/register";
export const updateUserProfile = API_BASE_URL + "users/update-profile"


// Public Notes Api End Points
export const getStreams = API_BASE_URL + "notes/get-streams";
export const getCourses = API_BASE_URL + "notes/get-courses";
export const getStreamWiseNotes = API_BASE_URL + "notes/get-stream-wise-notes";
export const getFiltersData = API_BASE_URL + "notes/get_filters";
export const getMyUploads = API_BASE_URL + "notes/get-my-uploads";
export const getNotes = API_BASE_URL + "notes/get-notes";
export const getFeaturesNotes = API_BASE_URL + "notes/get-featured-notes";
export const uploadNotes = API_BASE_URL + "notes/upload-notes";
export const deleteNotes = API_BASE_URL + "notes/delete"
export const incrementNoteDownloadCount = API_BASE_URL + "notes/increment-note-download";


// Private Notes API End Points
export const getPrivateNotes = API_BASE_URL + "private-notes/get";
export const createPrivateNotes = API_BASE_URL + "private-notes/create";
export const updatePrivateNotes = API_BASE_URL + "private-notes/update";
export const deletePrivatNotes = API_BASE_URL + "private-notes/delete";