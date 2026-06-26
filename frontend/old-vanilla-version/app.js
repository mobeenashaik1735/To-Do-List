const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoDateInput = document.getElementById('todo-date');
const todoListUL = document.getElementById('todo-list');
const todoStats = document.getElementById('todo-stats');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

let allTodos = JSON.parse(localStorage.getItem('todos')) || [];
let currentTheme = localStorage.getItem('theme') || 'dark';

const today = new Date().toISOString().split('T')[0];
todoDateInput.value = today;

function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    if (currentTheme === 'light') {
        themeIcon.innerHTML = `<path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-56 96 100-52 53Zm492 496-97-101 53-52 101 97-57 56Zm-99-496 52-53 100 96-56 57-96-100Zm-493 496 56-57-100-96 57-53 87 106Z"/>`;
    } else {
        themeIcon.innerHTML = `<path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T441-664q0 70 41.5 124.5T588-466q6 1 12.5 1t12.5-1q-19 55-1.5 107.5T673-268q-39 31-87.5 49.5T480-120Z"/>`;
    }
}

themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
});

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
});

function addTodo(){
    const todoText = todoInput.value.trim();
    const todoDate = todoDateInput.value;
    
    if(todoText.length > 0){
        allTodos.push({
            text: todoText,
            date: todoDate,
            completed: false
        });
        saveAndRender();
        todoInput.value = "";
        todoDateInput.value = today;
    }
}

window.toggleTodo = function(index) {
    allTodos[index].completed = !allTodos[index].completed;
    saveAndRender();
};

window.deleteTodo = function(index) {
    allTodos.splice(index, 1);
    saveAndRender();
};

function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(allTodos));
    updateTodoList();
}

function updateTodoList(){
    todoListUL.innerHTML = "";
    
    if (allTodos.length === 0) {
        todoListUL.innerHTML = `<li class="empty-state">All caught up! Add a task above.</li>`;
        todoStats.style.display = "none";
        return;
    }

    allTodos.forEach((todo, todoIndex)=>{
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });

    todoStats.style.display = "block";
    const completedCount = allTodos.filter(t => t.completed).length;
    todoStats.textContent = `${completedCount} of ${allTodos.length} tasks completed`;
}

function createTodoItem(todo, todoIndex){
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    todoLI.className = "todo";
    
    let formattedDate = "";
    if (todo.date) {
        const dateObj = new Date(todo.date);
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    }

    todoLI.innerHTML = `
         <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''} onclick="toggleTodo(${todoIndex})">
         <label class="custom-checkbox" for="${todoId}">
             <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" 
             viewBox="0 -960 960 960" width="24px" fill="currentColor">
             <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
         </label>
         <div class="todo-content">
             <label for="${todoId}" class="todo-text">${todo.text}</label>
             ${formattedDate ? `<span class="todo-date-badge">${formattedDate}</span>` : ''}
         </div>
         <button class="delete-button" onclick="deleteTodo(${todoIndex})">
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" 
           viewBox="0 -960 960 960" width="24px" fill="currentColor">
           <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
         </svg> 
         </button> 
    `;     
    return todoLI;
}
initTheme();
updateTodoList();