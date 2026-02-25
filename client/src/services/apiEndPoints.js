export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1/";

// User End Points
export const getCurrentUser = API_BASE_URL + "users/getCurrentUser";
export const userLogin = API_BASE_URL + "users/login";
export const userLogout = API_BASE_URL + "users/logout";
export const checkUsernameIfAvailable =
  API_BASE_URL + "users/checkUsernameIfAvailable";
export const userRegistration = API_BASE_URL + "users/register";
export const updateUserProfile = API_BASE_URL + "users/update-profile";
export const forgotUserPassword = API_BASE_URL + "users/forgot-password";

// Public Notes Api End Points
export const getStreams = API_BASE_URL + "notes/get-streams";
export const getCourses = API_BASE_URL + "notes/get-courses";
export const getStreamWiseNotes = API_BASE_URL + "notes/get-stream-wise-notes";
export const getFiltersData = API_BASE_URL + "notes/get_filters";
export const getMyUploads = API_BASE_URL + "notes/get-my-uploads";
export const getNotes = API_BASE_URL + "notes/get-notes";
export const getNonPaginatedNotes =
  API_BASE_URL + "notes/get-non-paginated-notes";
export const getFeaturesNotes = API_BASE_URL + "notes/get-featured-notes";
export const uploadNotes = API_BASE_URL + "notes/upload-notes";
export const deleteNotes = API_BASE_URL + "notes/delete";
export const incrementNoteDownloadCount =
  API_BASE_URL + "notes/increment-note-download";

// Private Notes API End Points
export const getPrivateNotes = API_BASE_URL + "private-notes/get";
export const createPrivateNotes = API_BASE_URL + "private-notes/create";
export const updatePrivateNotes = API_BASE_URL + "private-notes/update";
export const deletePrivatNotes = API_BASE_URL + "private-notes/delete";

//RAG AI API End Points
export const createConversation = API_BASE_URL + "ai/conversation/create";
export const connectConversation = (id) => {
  return `${API_BASE_URL}ai/conversation/${id}/connect`;
};

export const getConversationMessages = (id) => {
  return `${API_BASE_URL}ai/conversation/${id}/get-messages`;
};
export const checkConversationConnection = (id) => {
  return `${API_BASE_URL}ai/conversation/${id}/checkConnection`;
};
export const disconnectConversation = (id) => {
  return `${API_BASE_URL}ai/conversation/${id}/disconnect`;
};
export const getUserConversations = API_BASE_URL + "ai/conversation/get";
export const updateConversationSources = (id) => {
  return `${API_BASE_URL}ai/conversation/${id}/update-sources`;
};
export const updateConversationTitle = (id) => {
  return `${API_BASE_URL}ai/conversation/${id}/update-title`;
};
export const deleteConversation = API_BASE_URL + "ai/conversation/delete";

export const chatToRAG = (id) => {
  return `${API_BASE_URL}ai/conversation/${id}/chat`;
};
