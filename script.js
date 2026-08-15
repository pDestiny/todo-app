const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#todo-count");
const clearDoneButton = document.querySelector("#clear-done");
const filterButtons = document.querySelectorAll(".filter-button");
const template = document.querySelector("#todo-item-template");

const storageKey = "cicd-todo-practice-items";

let todos = loadTodos();
let currentFilter = "all";

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  todos = [
    {
      id: crypto.randomUUID(),
      text,
      done: false,
    },
    ...todos,
  ];

  input.value = "";
  saveAndRender();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    render();
  });
});

clearDoneButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.done);
  saveAndRender();
});

function render() {
  list.innerHTML = "";

  getVisibleTodos().forEach((todo) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector(".todo-check");
    const text = item.querySelector(".todo-text");
    const deleteButton = item.querySelector(".delete-button");

    item.classList.toggle("is-done", todo.done);
    checkbox.checked = todo.done;
    text.textContent = todo.text;

    checkbox.addEventListener("change", () => {
      todos = todos.map((itemTodo) =>
        itemTodo.id === todo.id ? { ...itemTodo, done: checkbox.checked } : itemTodo
      );
      saveAndRender();
    });

    deleteButton.addEventListener("click", () => {
      todos = todos.filter((itemTodo) => itemTodo.id !== todo.id);
      saveAndRender();
    });

    list.append(item);
  });

  const activeCount = todos.filter((todo) => !todo.done).length;
  count.textContent = `${activeCount}개 남음`;
}

function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.done);
  }

  if (currentFilter === "done") {
    return todos.filter((todo) => todo.done);
  }

  return todos;
}

function saveAndRender() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
  render();
}

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? [];
  } catch {
    return [];
  }
}
