import {
  checkUsernameIfAvailable,
  getCourses,
  getCurrentUser,
  getStreams,
  userLogin,
  userLogout,
  userRegistration,
  uploadNotes,
  updateUserProfile,
  getFeaturesNotes,
  getStreamWiseNotes,
  getPrivateNotes,
  createPrivateNotes,
  deletePrivatNotes,
  updatePrivateNotes,
  incrementNoteDownloadCount,
  deleteNotes,
  getNonPaginatedNotes,
  createConversation,
  getUserConversations,
  deleteConversation,
  updateConversationSources,
  updateConversationTitle,
  connectConversation,
  checkConversationConnection,
  disconnectConversation,
  chatToRAG,
  getConversationMessages,
} from "./apiEndPoints";

// User Handlers
export async function getCurrentUserHandler() {
  const response = await fetch(getCurrentUser, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function userLoginHandler(payload) {
  const response = await fetch(userLogin, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  return result;
}

export async function userLogoutHandler() {
  const response = await fetch(userLogout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function checkUsernameIfAvailableHandler(username) {
  const response = await fetch(`${checkUsernameIfAvailable}/${username}`, {
    method: "GET",
  });

  const result = await response.json();
  return result;
}

export async function userRegistrationHandler(formData) {
  const response = await fetch(userRegistration, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  return result;
}

export async function userProfileUpdateHandler(formData) {
  const response = await fetch(updateUserProfile, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await response.json();
  return result;
}

// Public Notes Handlers
export async function getNonPaginatedNotesHandler(search = "") {
  const response = await fetch(`${getNonPaginatedNotes}?search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
}

export async function getStreamsHandler() {
  const response = await fetch(getStreams, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
}

export async function getCoursesHandler(stream_id) {
  const response = await fetch(`${getCourses}?stream=${stream_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
}

export async function uploadNotesHandler(formData) {
  const response = await fetch(uploadNotes, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await response.json();
  return result;
}

export async function deleteNotesHandler(id) {
  const response = await fetch(`${deleteNotes}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function getFeaturedNotesHandler() {
  const response = await fetch(getFeaturesNotes, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
}

export async function getStreamWiseNotesHandler() {
  const response = await fetch(getStreamWiseNotes, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
}

export async function incrementNotesDownloadCountHandler(id) {
  await fetch(`${incrementNoteDownloadCount}?noteId=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return;
}

// Private Notes Handlers
export async function getPrivateNotesHandler(search = "") {
  const response = await fetch(`${getPrivateNotes}?search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function createPrivateNotesHandler(formData) {
  const response = await fetch(createPrivateNotes, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  return result;
}

export async function updatePrivateNotesHandler(formData) {
  const response = await fetch(updatePrivateNotes, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  return result;
}

export async function deletePrivateNotesHandler(id) {
  const response = await fetch(`${deletePrivatNotes}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

// RAG AI Handlers

export async function createConversationHandler(data = []) {
  const response = await fetch(createConversation, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await response.json();

  return result;
}

export async function connectConversationHandler(id = "") {
  const response = await fetch(connectConversation(id), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function getConversationMessagesHandler(id = "") {
  const response = await fetch(getConversationMessages(id), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function checkConversationConnectionHandler(id = "") {
  const response = await fetch(checkConversationConnection(id), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function disconnectConversationHandler(id = "") {
  const response = await fetch(disconnectConversation(id), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function getUserConversationsHandler() {
  const response = await fetch(getUserConversations, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function getConversationByIdHandler(id = "") {
  const response = await fetch(`${getUserConversations}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function updateConversationSourcesHandler(id, sources = []) {
  const response = await fetch(updateConversationSources(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sources }),
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function deleteConversationHandler(id = "") {
  const response = await fetch(`${deleteConversation}/${id}`, {
    method: "Delete",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function updateConversationTitleHandler(id, title) {
  const response = await fetch(updateConversationTitle(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
    credentials: "include",
  });

  const result = await response.json();
  return result;
}

export async function chatToRAGHandler({
  conversation_id = "",
  user_query = "",
}) {
  const response = await fetch(chatToRAG(conversation_id), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      query: user_query,
    }),
  });

  const result = await response.json();
  return result;
}
