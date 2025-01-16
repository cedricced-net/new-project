function createTaskView(task) {
  const li = document.createElement("li");
  li.setAttribute("id", task.id);

  const span = document.createElement("span");
  span.textContent = `${task.label}`;
  li.appendChild(span);

  const performButton = document.createElement("button");
  performButton.classList.add('perform-btn');
  li.appendChild(performButton);
  performButton.addEventListener("click", () => toggleDone(+li.getAttribute("id")));
  
  const editButton = document.createElement("button");
  editButton.classList.add('edit-btn')
  li.appendChild(editButton);
  editButton.addEventListener("click", ()=> editingTask(+li.getAttribute("id")))
  
  const delButton = document.createElement("button");
  delButton.classList.add('del-btn')
  li.appendChild(delButton);
  delButton.addEventListener("click", () => delTask(+li.getAttribute("id")));

  return li;
}

function renderTask(task) {
  const taskView = document.getElementById(task.id);
  const span = taskView.querySelector("span");
  span.textContent = `${task.label}`;
  if (span.classList.contains("done") !== task.isDone) span.classList.toggle("done");
}

function renderTaskList(data) {
  const taskListView = document.getElementById("task-list");
  const viewIdList = new Set([...taskListView.children].map((e) => +e.getAttribute("id")));
  const dataIdList = new Set(data.map((e) => e.id));

  const forDelete = viewIdList.difference(dataIdList);
  const forAdd = dataIdList.difference(viewIdList);

  [...forDelete].forEach((e) => document.getElementById(e).remove());

  for (id of [...forAdd]) {
    const task = data.find((e) => e.id === id);
    const taskView = createTaskView(task, taskListView);
    taskListView.appendChild(taskView);
    renderTask(task);
  }
}

function renderPage() {
  const button = document.getElementById("btn-add");
  const input = document.getElementById("input-task");
  button.addEventListener("click", () => {
    const value = input.value.trim();
    if (value){
      addTask(value);
      input.value = ""
    }
    else{
      alert("Поле вввода задачи пустое.")
    }
  });
}



const data = [
  { id: 1, label: "Изучить JS", isDone: false },
  { id: 2, label: "Почистить клавиатуру", isDone: true },
  { id: 3, label: "Купить батарейки", isDone: false },
];

function addTask(value) {
  const newId = data.reduce((a, c) => (c.id > a ? c.id : a), 0) + 1;
  const newTask = { id: newId, label: value, isDone: false };
  data.push(newTask);
  renderTaskList(data);
}

function delTask(id) {
  const index = data.findIndex((e) => e.id === id);
  data.splice(index, 1);
  renderTaskList(data);
}

function toggleDone(id) {
  const task = data.find((e) => e.id == id);
  task.isDone = !task.isDone;
  renderTask(task);
}

function editingTask(id){
  const task = data.find((e) => e.id === id);
  if (!task) return;
  const taskView = document.getElementById(id);
  const span = taskView.querySelector("span");
  span.style.display = "none";
  
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.label;
  taskView.insertBefore(input, span.nextSibling);

  const saveButton = document.createElement("button")
  saveButton.innerText = "Сохранить";
  saveButton.classList.add('editSaveButton')
  taskView.appendChild(saveButton);

  saveButton.addEventListener("click", () => applyEditingTask(id, input.value));

  const editButton = taskView.querySelector('.edit-btn');
  editButton.style.display = "none"
  
}

function applyEditingTask(id, newLabel){
  const task = data.find((e) => e.id === id);
  if (!task) return;
  task.label = newLabel;
  renderTask(task);

  const taskView = document.getElementById(id);
  const input = taskView.querySelector('input');
  const saveButton =taskView.querySelector('.editSaveButton')

  taskView.removeChild(input);
  taskView.removeChild(saveButton);

  const span =taskView.querySelector("span");
  span.style.display = "inline-block";
 
  const editButton = taskView.querySelector('.edit-btn');
  editButton.style.display = "block"
}



renderPage();
renderTaskList(data);
