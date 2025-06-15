// Bug-ridden JavaScript with intentional issues

let todos = [];
let currentFilter = 'all';
let nextId = 1;

// BUG: No error handling for DOM elements
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');
const notification = document.getElementById('notification');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    loadTodos();
    renderTodos();
    updateStats();

    // BUG: Event listener added but never removed
    todoInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

function addTodo() {
    const text = todoInput.value.trim();

    // BUG: No validation for empty or very long text
    if (!text) {
        showNotification('Please enter a task!', 'error');
        return;
    }

    // BUG: No check for duplicate todos
    const todo = {
        id: nextId++,
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        // BUG: Missing updatedAt field
    };

    todos.push(todo);
    todoInput.value = ''; // Clear input

    saveTodos();
    renderTodos();
    updateStats();
    showNotification('Task added successfully!');
}

function toggleTodo(id) {
    // BUG: No validation if id exists
    const todo = todos.find(t => t.id === id);
    todo.completed = !todo.completed;

    saveTodos();
    renderTodos();
    updateStats();

    // BUG: Notification message is misleading
    showNotification(todo.completed ? 'Task completed!' : 'Task uncompleted!');
}

function deleteTodo(id) {
    // BUG: No confirmation dialog
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);

        saveTodos();
        renderTodos();
        updateStats();
        showNotification('Task deleted!');
    }
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    // BUG: Using prompt instead of inline editing
    const newText = prompt('Edit task:', todo.text);

    if (newText !== null && newText.trim() !== '') {
        todo.text = newText.trim();
        saveTodos();
        renderTodos();
        showNotification('Task updated!');
    }
}

function filterTodos(filter) {
    currentFilter = filter;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active'); // BUG: Using global event object

    renderTodos();
}

function renderTodos() {
    // BUG: No loading state or performance optimization
    todoList.innerHTML = '';

    let filteredTodos = todos;
    if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filteredTodos = todos.filter(t => !t.completed);
    }

    // BUG: No handling for empty state
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        // BUG: Using innerHTML with user input (XSS vulnerability)
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo(${todo.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;

        todoList.appendChild(li);
    });
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    // BUG: Direct text manipulation without null checks
    totalTasksSpan.textContent = `Total: ${total}`;
    completedTasksSpan.textContent = `Completed: ${completed}`;
    pendingTasksSpan.textContent = `Pending: ${pending}`;
}

function markAllComplete() {
    // BUG: No check if there are any todos
    todos.forEach(todo => {
        todo.completed = true;
    });

    saveTodos();
    renderTodos();
    updateStats();
    showNotification('All tasks marked as complete!');
}

function deleteCompleted() {
    const completedCount = todos.filter(t => t.completed).length;

    // BUG: No confirmation for bulk delete
    if (completedCount > 0) {
        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            todos = todos.filter(t => !t.completed);

            saveTodos();
            renderTodos();
            updateStats();
            showNotification(`${completedCount} completed tasks deleted!`);
        }
    } else {
        showNotification('No completed tasks to delete.', 'info');
    }
}

function clearAll() {
    // BUG: No confirmation for destructive action
    if (todos.length > 0) {
        if (confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
            todos = [];
            nextId = 1;

            saveTodos();
            renderTodos();
            updateStats();
            showNotification('All tasks cleared!');
        }
    } else {
        showNotification('No tasks to clear.', 'info');
    }
}

function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.setItem('nextId', nextId.toString());
    } catch (error) {
        // BUG: Error handling doesn't inform user
        console.error('Failed to save todos:', error);
    }
}

function loadTodos() {
    try {
        const savedTodos = localStorage.getItem('todos');
        const savedNextId = localStorage.getItem('nextId');

        if (savedTodos) {
            todos = JSON.parse(savedTodos);
        }

        if (savedNextId) {
            nextId = parseInt(savedNextId);
        }
    } catch (error) {
        // BUG: Silently fails on parse errors
        console.error('Failed to load todos:', error);
        todos = [];
        nextId = 1;
    }
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    // BUG: Timeout not cleared if new notification comes quickly
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// BUG: No cleanup on page unload
// BUG: No keyboard navigation support
// BUG: No drag and drop functionality
// BUG: No undo/redo functionality
// BUG: Memory leaks from event listeners
