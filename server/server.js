const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "tasks.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const readTasks = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return data ? JSON.parse(data) : [];
};

const saveTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

app.get("/tasks", (req, res) => res.json(readTasks()));

app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = { id: Date.now(), text: req.body.text, completed: false };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const tasks = readTasks().map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks(tasks);
  res.json({ success: true });
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const tasks = readTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`✅ Сервер запущено: http://localhost:${PORT}`)
);
