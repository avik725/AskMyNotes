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

// Private Notes Handlers
export async function getPrivateNotesHandler() {
  const response = await fetch(getPrivateNotes, {
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
