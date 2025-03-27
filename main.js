// DOM Elements
const dayElement = document.querySelector('.Day');
const dateElement = document.querySelector('.Date');
const timeElement = document.createElement('div');
timeElement.className = 'Time-display';
document.querySelector('.Time').appendChild(timeElement);

// Form Elements
const addTaskBtn = document.querySelector('.Addtasks');
const taskForm = document.querySelector('.task-form');
const cancelTaskBtn = document.querySelector('.cancel-task');
const submitTaskBtn = document.querySelector('.submit-task');
const titleInput = document.querySelector('.task-title-input');
const descriptionInput = document.querySelector('.task-description-input');
const taskContainer = document.querySelector('.boxes');

// Array to store tasks - load from localStorage if available
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to create a task element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-details">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
            </div>
        </div>
        <button class="delete-task">×</button>
    `;

    // Add event listeners
    const checkbox = taskElement.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => {
        taskElement.classList.toggle('completed');
        task.completed = checkbox.checked;
        saveTasks();
    });

    const deleteBtn = taskElement.querySelector('.delete-task');
    deleteBtn.addEventListener('click', () => {
        taskElement.remove();
        // Remove task from array
        const index = tasks.findIndex(t => t.title === task.title && t.description === task.description);
        if (index > -1) {
            tasks.splice(index, 1);
            saveTasks();
        }
    });

    // Add completed class if task is completed
    if (task.completed) {
        taskElement.classList.add('completed');
    }

    return taskElement;
}

// Function to render all tasks
function renderTasks() {
    taskContainer.innerHTML = '';
    tasks.forEach(task => {
        taskContainer.appendChild(createTaskElement(task));
    });
}

// Show form when clicking New Task button
addTaskBtn.addEventListener('click', () => {
    taskForm.classList.add('active');
});

// Hide form when clicking Cancel button
cancelTaskBtn.addEventListener('click', () => {
    taskForm.classList.remove('active');
    titleInput.value = '';
    descriptionInput.value = '';
});

// Handle form submission
submitTaskBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    if (title) {
        // Create new task
        const newTask = {
            title: title,
            description: descriptionInput.value.trim(),
            completed: false
        };
        
        // Add to tasks array
        tasks.push(newTask);
        
        // Save to localStorage
        saveTasks();
        
        // Render the new task
        renderTasks();
        
        // Clear form and hide it
        titleInput.value = '';
        descriptionInput.value = '';
        taskForm.classList.remove('active');
    }
});

// Initial render of tasks
renderTasks();

// Function to update date and time
function updateDateTime() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    // Update day
    dayElement.textContent = days[now.getDay()];
    
    // Update date
    const day = now.getDate();
    const month = months[now.getMonth()];
    dateElement.textContent = `${month} ${day}`;

    // Update time with hours, minutes, and seconds
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    // Format time with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    timeElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
}

// Update immediately and then every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Add styles for time display and tasks
const style = document.createElement('style');
style.textContent = `
    .Time-display {
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
        color: #666;
        margin-top: 5px;
        font-weight: 500;
    }

    .boxes {
        margin-top: 100px;
        padding: 0 24px;
    }

    .task-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        margin: 15px 0;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .task-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .task-details {
        flex: 1;
    }

    .task-details h3 {
        margin: 0;
        font-family: "Montserrat", sans-serif;
        font-size: 16px;
        color: #333;
    }

    .task-details p {
        margin: 5px 0 0;
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
        color: #666;
    }

    .task-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .delete-task {
        background: none;
        border: none;
        font-size: 20px;
        color: #ff4444;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .delete-task:hover {
        background-color: #ffebee;
    }

    .task-item.completed .task-details h3,
    .task-item.completed .task-details p {
        text-decoration: line-through;
        color: #999;
    }
`;
document.head.appendChild(style);
