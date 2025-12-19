import {
  checkUsernameIfAvailable,
  getCourses,
  getCurrentUser,
  getStreams,
  userLogin,
  userLogout,
  userRegistration,
  uploadNotes,
} from "./apiEndPoints";

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