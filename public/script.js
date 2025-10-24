const API_URL = "http://localhost:3000/tasks";
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  render(tasks);
}

addBtn.onclick = async () => {
  const text = taskInput.value.trim();
  if (!text) return;
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  taskInput.value = "";
  loadTasks();
};

async function toggleTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "PUT" });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

function render(tasks) {
  taskList.innerHTML = "";
  tasks.forEach((t) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = t.text;
    if (t.completed) span.classList.add("completed");
    span.onclick = () => toggleTask(t.id);

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "✖";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => deleteTask(t.id);

    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

loadTasks();
