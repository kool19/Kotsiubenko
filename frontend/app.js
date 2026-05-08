"use strict";

/*  STORAGE  */

const STORAGE_KEY = "lr1_items";

function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function computeNextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map(i => i.id)) + 1;
}

/*  XSS SAFE  */

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

/*  STATE  */

let items = loadFromStorage();
let nextId = computeNextId(items);

/*  ELEMENTS  */

const createForm = document.getElementById("create-section");
const tbody = document.getElementById("itemsTableBody");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
let sortDirection = 1;

const modalOverlay = document.getElementById("modalOverlay");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

const userInput = document.getElementById("userInput");
const severitySelect = document.getElementById("severitySelect");
const statusSelect = document.getElementById("statusSelect");
const textInput = document.getElementById("textInput");

const field1Error = document.getElementById("field1Error");
const field2Error = document.getElementById("field2Error");
const field3Error = document.getElementById("field3Error");
const field4Error = document.getElementById("field4Error");

/* BUTTON BLOCK */

const COOLDOWN_SECONDS = 3; 
const submitBtn = createForm ? createForm.querySelector('button[type="submit"]') : null;
 
function startSubmitCooldown() {
  if (!submitBtn) return; 
 
  const originalText = submitBtn.textContent; 
  let secondsLeft = COOLDOWN_SECONDS;
 
  submitBtn.disabled = true;
  submitBtn.classList.add("btn-cooldown");
  submitBtn.textContent = `Зачекайте... ${secondsLeft}с`;
 
  const interval = setInterval(() => {
    secondsLeft--;
 
    if (secondsLeft > 0) {
      submitBtn.textContent = `Зачекайте... ${secondsLeft}с`;
    } else {
      clearInterval(interval);
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-cooldown");
      submitBtn.textContent = originalText;
    }
  }, 1000);
}

/*  MODAL VIEW  */

function showModal(text) {
  modalText.textContent = text;
  modalText.style.whiteSpace = "pre-wrap";
  modalText.style.wordBreak = "break-word";
  modalOverlay.style.display = "flex";
}

closeModal.onclick = () => (modalOverlay.style.display = "none");
modalOverlay.onclick = e => {
  if (e.target === modalOverlay) modalOverlay.style.display = "none";
};

/*  VALIDATION + UX HELPERS  */

function showFieldError(el, message) {
  if (!el) return;
  el.classList.add("invalid");
  let err = el.nextElementSibling;
  if (!err || !err.classList.contains("error-text")) {
    err = document.createElement("p");
    err.className = "error-text";
    el.after(err);
  }
  err.textContent = message;
}

function clearFieldError(el) {
  if (!el) return;
  el.classList.remove("invalid");
  const err = el.nextElementSibling;
  if (err && err.classList.contains("error-text")) err.textContent = "";
}

function clearAllCreateErrors() {
  [userInput, severitySelect, statusSelect, textInput].forEach(clearFieldError);
  if (field1Error) field1Error.textContent = "";
  if (field2Error) field2Error.textContent = "";
  if (field3Error) field3Error.textContent = "";
  if (field4Error) field4Error.textContent = "";
}

function validateFormValues(values) {
  const errors = {};
  const user = String(values.user || "");
  const text = String(values.text || "");
  if (!user.trim()) errors.user = "Введіть нік";
  else if (user.length > 10) errors.user = "Нік до 10 символів";

  if (!text.trim()) errors.text = "Введіть текст";
  else if (text.length > 4000) errors.text = "Текст до 4000 символів";

  if (!values.severity) errors.severity = "Оберіть пріоритет";

  return { ok: Object.keys(errors).length === 0, errors };
}

/*  CREATE  */

createForm.addEventListener("submit", e => {
  e.preventDefault();
  clearAllCreateErrors();

  const values = {
    user: userInput.value.trim(),
    severity: severitySelect.value,
    status: statusSelect.value,
    text: textInput.value.trim()
  };

  const { ok, errors } = validateFormValues(values);
  if (!ok) {
    if (errors.user) showFieldError(userInput, errors.user);
    if (errors.severity) showFieldError(severitySelect, errors.severity);
    if (errors.status) showFieldError(statusSelect, errors.status);
    if (errors.text) showFieldError(textInput, errors.text);
    return;
  }

  const newItem = { id: nextId++, user: values.user, severity: values.severity, status: values.status, text: values.text };
  items.push(newItem);

  saveToStorage(items);
  render();

  createForm.reset();
  userInput.focus();
});

/*  DELETE (no renumbering)  */

function deleteItem(id) {
  if (!confirm("Видалити запис?")) return;
  items = items.filter(i => i.id !== id);
  saveToStorage(items);
  render();
}

/* EDIT FRAME */
function ensureEditFrameElements() {
  let overlay = document.getElementById("editFrameOverlay");
  if (overlay) {
    return { overlay, frame: document.getElementById("editFrame") };
  }

  overlay = document.createElement("div");
  overlay.id = "editFrameOverlay";

  const frame = document.createElement("div");
  frame.id = "editFrame";

  const header = document.createElement("div");
  header.id = "editFrameHeader";
  header.innerHTML = `<strong>Редагувати запис</strong>`;

  const closeBtn = document.createElement("button");
  closeBtn.id = "closeEditFrame";
  closeBtn.className = "frame-btn cancel";
  closeBtn.textContent = "✕";
  header.appendChild(closeBtn);

  const body = document.createElement("div");
  body.id = "editFrameBody";

  const footer = document.createElement("div");
  footer.id = "editFrameFooter";

  const saveBtn = document.createElement("button");
  saveBtn.id = "saveEditFrame";
  saveBtn.className = "frame-btn save";
  saveBtn.textContent = "Зберегти";

  const cancelBtn = document.createElement("button");
  cancelBtn.id = "cancelEditFrame";
  cancelBtn.className = "frame-btn cancel";
  cancelBtn.textContent = "Скасувати";

  footer.appendChild(saveBtn);
  footer.appendChild(cancelBtn);

  frame.appendChild(header);
  frame.appendChild(body);
  frame.appendChild(footer);
  overlay.appendChild(frame);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeEditFrame();
  });

  closeBtn.onclick = closeEditFrame;
  cancelBtn.onclick = closeEditFrame;

  return { overlay, frame };
}

function openEditFrameForItem(item) {
  if (!item) return showModal("Запис не знайдено");

  const { overlay, frame } = ensureEditFrameElements();
  const body = frame.querySelector("#editFrameBody");

  body.innerHTML = "";

  const template = document.getElementById("editFormTemplate");
  let formEl = null;

  if (template) {
    const frag = template.content.cloneNode(true);
    body.appendChild(frag);
    formEl = body.querySelector(".editForm") || body.querySelector("form");
  }

  if (!formEl) {
    formEl = document.createElement("form");
    formEl.className = "editForm";
    formEl.innerHTML = `
      <div class="field"><label>Користувач</label><input type="text" class="editUser" required></div>
      <div class="field"><label>Пріоритет</label>
        <select class="editSeverity" required>
          <option value="">Оберіть пріоритет</option>
          <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
        </select>
      </div>
      <div class="field"><label>Статус</label>
        <select class="editStatus">
          <option value="Open">Open</option><option value="InProgress">InProgress</option><option value="Done">Done</option>
        </select>
      </div>
      <div class="field"><label>Опис</label><textarea class="editText"></textarea></div>
    `;
    body.appendChild(formEl);
  }

  function ensureErrorPlaceholder(inputEl) {
    if (!inputEl) return;
    const next = inputEl.nextElementSibling;
    if (!next || !next.classList.contains("error-text")) {
      const p = document.createElement("p");
      p.className = "error-text";
      inputEl.after(p);
    }
  }

  const editUser = formEl.querySelector(".editUser");
  const editSeverity = formEl.querySelector(".editSeverity");
  const editStatus = formEl.querySelector(".editStatus");
  const editText = formEl.querySelector(".editText");

  if (!editUser || !editSeverity || !editStatus || !editText) {
    console.error("У формі редагування бракує полів");
    showModal("Неможливо відкрити форму редагування (неповний шаблон)");
    return;
  }

  [editUser, editSeverity, editStatus, editText].forEach(ensureErrorPlaceholder);

  editText.classList.add("editText");
  editText.style.width = "100%";
  editText.style.minHeight = "260px";
  editText.style.maxHeight = "60vh";
  editText.style.resize = "vertical";
  editText.style.padding = "10px";
  editText.style.boxSizing = "border-box";

  const fields = formEl.querySelectorAll(".field");
  fields.forEach(f => {
    f.style.width = "100%";
    f.style.marginBottom = "12px";
  });

  editUser.value = item.user || "";
  editSeverity.value = item.severity || "";
  editStatus.value = item.status || "";
  editText.value = item.text || "";

  overlay.style.display = "flex";

  [editUser, editSeverity, editStatus, editText].forEach(el => {
    el.addEventListener("focus", () => clearFieldError(el));
  });

  const saveBtn = document.getElementById("saveEditFrame");
  const onSave = () => {
    const values = {
      user: editUser.value.trim(),
      severity: editSeverity.value,
      status: editStatus.value,
      text: editText.value.trim()
    };
    const { ok, errors } = validateFormValues(values);
    [editUser, editSeverity, editStatus, editText].forEach(clearFieldError);

    if (!ok) {
      if (errors.user) showFieldError(editUser, errors.user);
      if (errors.severity) showFieldError(editSeverity, errors.severity);
      if (errors.status) showFieldError(editStatus, errors.status);
      if (errors.text) showFieldError(editText, errors.text);
      return;
    }

    item.user = values.user;
    item.severity = values.severity;
    item.status = values.status;
    item.text = values.text;

    saveToStorage(items);
    closeEditFrame();
    render();
  };

  saveBtn.onclick = onSave;
  formEl.onsubmit = e => {
    e.preventDefault();
    onSave();
  };
}

function closeEditFrame() {
  const overlay = document.getElementById("editFrameOverlay");
  if (overlay) overlay.style.display = "none";
}

/*  FILTER + SORT + SEARCH  */

function getProcessedItems() {
  let result = [...items];

  const search = (searchInput.value || "").toLowerCase();
  if (search) result = result.filter(i => (i.user || "").toLowerCase().includes(search));

  const sortDirBtn = document.getElementById("sortDirBtn");

  sortDirBtn.onclick = () => {
  sortDirection *= -1;
  sortDirBtn.textContent = sortDirection === 1 ? "⬆" : "⬇";
  render();
};

  const filterSelect = document.getElementById("filterSelect"); 
  if (filterSelect && filterSelect.value && filterSelect.value !== "all") {
    const val = filterSelect.value;
    result = result.filter(i => i.status === val || i.severity === val);
  }

  switch (sortSelect.value) {
  case "user":
    result.sort((a, b) => sortDirection * a.user.localeCompare(b.user));
    break;
  case "severity":
    result.sort((a, b) => sortDirection * a.severity.localeCompare(b.severity));
    break;
  case "status":
    result.sort((a, b) => sortDirection * a.status.localeCompare(b.status));
    break;
}

  return result;
}

/*  RENDER (uses index+1 for visible numbering)  */

function render() {
  tbody.innerHTML = "";

  const processed = getProcessedItems();
  processed.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.dataset.id = item.id;

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(item.user)}</td>
      <td>${escapeHtml(item.severity)}</td>
      <td>${escapeHtml(item.status)}</td>
      <td><button class="showBtn" type="button">Показати</button></td>
      <td>
        <button class="editBtn" type="button">Редагувати</button>
        <button class="deleteBtn" type="button">Видалити</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/*  DELEGATED EVENTS FOR TBODY  */

tbody.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = Number(tr.dataset.id);
  if (!id) return;

  if (btn.classList.contains("deleteBtn")) {
    deleteItem(id);
  } else if (btn.classList.contains("editBtn")) {
    const it = items.find(x => x.id === id);
    if (it) openEditFrameForItem(it);
  } else if (btn.classList.contains("showBtn")) {
    const it = items.find(x => x.id === id);
    if (it) showModal(it.text);
  }
});

/*  EVENTS  */

searchInput.oninput = render;
sortSelect.onchange = render;

/* If you added a filter select in HTML with id="filterSelect", bind it */
const filterSelect = document.getElementById("filterSelect");
if (filterSelect) filterSelect.onchange = render;

/*  START  */

render();
