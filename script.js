const API_URL = "/api/subjects";
const AUTH_URL = "/api/auth";
const TOKEN_KEY = "attendance-auth-token";

const authShell = document.querySelector("#authShell");
const appShell = document.querySelector("#appShell");
const authForm = document.querySelector("#authForm");
const authError = document.querySelector("#authError");
const authName = document.querySelector("#authName");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const authSubmit = document.querySelector("#authSubmit");
const nameField = document.querySelector("#nameField");
const loginTab = document.querySelector("#loginTab");
const registerTab = document.querySelector("#registerTab");
const authPanel = document.querySelector("#authForm");
const currentUserName = document.querySelector("#currentUserName");
const logoutBtn = document.querySelector("#logoutBtn");

const form = document.querySelector("#subjectForm");
const formError = document.querySelector("#formError");
const subjectsList = document.querySelector("#subjectsList");
const template = document.querySelector("#subjectTemplate");
const clearAllBtn = document.querySelector("#clearAllBtn");

const subjectCount = document.querySelector("#subjectCount");
const totalClassesEl = document.querySelector("#totalClasses");
const totalAttendedEl = document.querySelector("#totalAttended");
const overallPercentEl = document.querySelector("#overallPercent");

let subjects = [];
let currentUser = null;
let authMode = "login";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiRequest(url, options = {}) {
  const token = getToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      showAuth();
    }

    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === "register";

  loginTab.classList.toggle("active", !isRegister);
  registerTab.classList.toggle("active", isRegister);
  loginTab.setAttribute("aria-selected", String(!isRegister));
  registerTab.setAttribute("aria-selected", String(isRegister));
  loginTab.tabIndex = isRegister ? -1 : 0;
  registerTab.tabIndex = isRegister ? 0 : -1;
  authPanel.setAttribute("aria-labelledby", isRegister ? "registerTab" : "loginTab");
  nameField.classList.toggle("hidden", !isRegister);
  authName.required = isRegister;
  authPassword.autocomplete = isRegister ? "new-password" : "current-password";
  authSubmit.textContent = isRegister ? "Create Account" : "Login";
  authError.textContent = "";
}

function showAuth() {
  clearToken();
  currentUser = null;
  subjects = [];
  authShell.classList.remove("hidden");
  appShell.classList.add("hidden");
  renderSubjects();
}

function showApp(user) {
  currentUser = user;
  currentUserName.textContent = user.name;
  authShell.classList.add("hidden");
  appShell.classList.remove("hidden");
}

async function loadSubjects() {
  subjects = await apiRequest(API_URL);
  renderSubjects();
}

async function restoreSession() {
  const token = getToken();

  if (!token) {
    showAuth();
    return;
  }

  try {
    const data = await apiRequest(`${AUTH_URL}/me`);
    showApp(data.user);
    await loadSubjects();
  } catch {
    showAuth();
  }
}

function getPercentage(attended, total) {
  if (total === 0) return 0;
  return (attended / total) * 100;
}

function getClassesNeeded(subject) {
  const { attended, total, minimum } = subject;
  const current = getPercentage(attended, total);

  if (current >= minimum) return 0;
  if (minimum >= 100) return "All";

  return Math.ceil(((minimum * total) - (100 * attended)) / (100 - minimum));
}

function getClassesCanMiss(subject) {
  const { attended, total, minimum } = subject;
  const current = getPercentage(attended, total);

  if (current < minimum || minimum <= 0) return 0;

  return Math.floor(((100 * attended) - (minimum * total)) / minimum);
}

function getStatus(subject) {
  const percentage = getPercentage(subject.attended, subject.total);

  if (percentage < subject.minimum) {
    return { text: "Below criteria", className: "status-low" };
  }

  if (percentage - subject.minimum < 5) {
    return { text: "Close", className: "status-close" };
  }

  return { text: "Safe", className: "status-safe" };
}

function renderSummary() {
  const totalClasses = subjects.reduce((sum, subject) => sum + subject.total, 0);
  const totalAttended = subjects.reduce((sum, subject) => sum + subject.attended, 0);
  const overall = getPercentage(totalAttended, totalClasses);

  subjectCount.textContent = subjects.length;
  totalClassesEl.textContent = totalClasses;
  totalAttendedEl.textContent = totalAttended;
  overallPercentEl.textContent = `${overall.toFixed(1)}%`;
}

function renderSubjects() {
  subjectsList.innerHTML = "";

  if (subjects.length === 0) {
    subjectsList.innerHTML = '<div class="empty-state">No subjects yet. Add your first subject above.</div>';
    renderSummary();
    return;
  }

  subjects.forEach((subject) => {
    const card = template.content.cloneNode(true);
    const percentage = getPercentage(subject.attended, subject.total);
    const status = getStatus(subject);

    card.querySelector(".subject-title").textContent = subject.name;
    card.querySelector(".subject-meta").textContent =
      `${subject.attended} attended out of ${subject.total} classes | Minimum ${subject.minimum}%`;
    card.querySelector(".percentage").textContent = `${percentage.toFixed(1)}%`;
    card.querySelector(".need-count").textContent = getClassesNeeded(subject);
    card.querySelector(".miss-count").textContent = getClassesCanMiss(subject);

    const pill = card.querySelector(".status-pill");
    pill.textContent = status.text;
    pill.classList.add(status.className);

    const progressBar = card.querySelector(".progress-bar");
    progressBar.style.width = `${Math.min(percentage, 100)}%`;

    card.querySelector(".attend-btn").addEventListener("click", () => updateAttendance(subject.id, true));
    card.querySelector(".miss-btn").addEventListener("click", () => updateAttendance(subject.id, false));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteSubject(subject.id));

    subjectsList.appendChild(card);
  });

  renderSummary();
}

async function updateAttendance(id, didAttend) {
  await apiRequest(`${API_URL}/${id}/attendance`, {
    method: "PATCH",
    body: JSON.stringify({ didAttend }),
  });
  await loadSubjects();
}

async function deleteSubject(id) {
  await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
  await loadSubjects();
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authError.textContent = "";

  const endpoint = authMode === "register" ? "register" : "login";
  const payload = {
    email: authEmail.value.trim(),
    password: authPassword.value,
  };

  if (authMode === "register") {
    payload.name = authName.value.trim();
  }

  try {
    const data = await apiRequest(`${AUTH_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setToken(data.token);
    authForm.reset();
    showApp(data.user);
    await loadSubjects();
  } catch (error) {
    authError.textContent = error.message;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";

  const name = document.querySelector("#subjectName").value.trim();
  const total = Number(document.querySelector("#heldClasses").value);
  const attended = Number(document.querySelector("#attendedClasses").value);
  const minimum = Number(document.querySelector("#minimumPercent").value);

  if (attended > total) {
    formError.textContent = "Attended classes cannot be more than total classes.";
    return;
  }

  try {
    await apiRequest(API_URL, {
      method: "POST",
      body: JSON.stringify({ name, total, attended, minimum }),
    });

    form.reset();
    document.querySelector("#heldClasses").value = 0;
    document.querySelector("#attendedClasses").value = 0;
    document.querySelector("#minimumPercent").value = 75;
    await loadSubjects();
  } catch (error) {
    formError.textContent = error.message;
  }
});

clearAllBtn.addEventListener("click", async () => {
  if (!subjects.length) return;

  const shouldClear = confirm("Delete all subjects and attendance data for this account?");
  if (!shouldClear) return;

  await apiRequest(API_URL, { method: "DELETE" });
  await loadSubjects();
});

logoutBtn.addEventListener("click", showAuth);
loginTab.addEventListener("click", () => setAuthMode("login"));
registerTab.addEventListener("click", () => setAuthMode("register"));

setAuthMode("login");
restoreSession();
