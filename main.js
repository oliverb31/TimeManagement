// Perform check on page load
document.addEventListener('DOMContentLoaded', checkRememberMe);

document.addEventListener('DOMContentLoaded', function() {
  var registerButton = document.getElementById('register_btn');
  if (registerButton) {
    registerButton.addEventListener('click', register);
  }

  // Add event listener to the login form
  var loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', login);

  var loginButton = document.getElementById('login_btn');
  if (loginButton) {
    loginButton.addEventListener('click', login);
  }

  // Add an event listener to the register button
  var registerBtn = document.getElementById('register_btn');
  registerBtn.addEventListener('click', register);
});

// Load any previously saved tasks from localStorage on page load
window.onload = function() {
  var username = document.getElementById('username').value;
  checkRememberMe()
  if (username) {
    loadTasks(username);
  }
};

// Add a new task to the table and to localStorage
function addTask() {
  var taskName = document.getElementById('taskName').value;
  var taskDuration = document.getElementById('taskDuration').value;
  var taskDate = document.getElementById('taskDate').value;

  // If no duration is given, set it to "N/A"
  if (!taskDuration) {
    taskDuration = "N/A";
  }

  if (!taskName) {
    taskName = "N/A";
  }

  if (!taskDate) {
    taskDate = "N/A";
  }

  // Generate unique ID for the task 
  var id = Date.now().toString(); 

  var username = document.getElementById('username').value;

  addTaskToTable(taskName, taskDuration, taskDate, id);
  saveTaskToLocalStorage(taskName, taskDuration, taskDate, id, username);
  loadTasks(username); 

  // Clear the form fields
  document.getElementById('taskName').value = '';
  document.getElementById('taskDuration').value = '';
  document.getElementById('taskDate').value = '';
}

// Add new task row to table
function addTaskToTable(taskName, taskDuration, taskDate, id) {
  var table = document.getElementById('time-entries-list');
  var row = table.insertRow(-1);
  row.id = id; 
  var nameCell = row.insertCell(0);
  var durationCell = row.insertCell(1);
  var dateCell = row.insertCell(2);
  var actionsCell = row.insertCell(3); 
  nameCell.innerHTML = taskName;
  durationCell.innerHTML = taskDuration;
  dateCell.innerHTML = formatDate(taskDate);
  actionsCell.innerHTML = `
    <button onclick="editTask('${id}')" class="actionButton"><p>Edit</p></button>
    <button onclick="deleteTask('${id}')" class="actionButton"><p>Delete</p></button>
  `;
  // Hide the login form
  document.getElementById('login-section').classList.add('hide');
}

// Save task to localStorage
function saveTaskToLocalStorage(taskName, taskDuration, taskDate, id, username) {
  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({
    id: id,
    taskName: taskName,
    taskDuration: taskDuration,
    taskDate: taskDate,
    username: username, 
    deleted: false 
  });

  tasks = sortTasksByDate(tasks); 

  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Hide the login form
  document.getElementById('login-section').classList.add('hide');
}

function findTaskById(id) {
  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks.find(function(task) {
    return task.id === id;
  });
}

function updateTask(event) {
  event.preventDefault();
  var taskId = document.getElementById('taskEditForm').getAttribute('data-task-id');

  // Update the task information with the form values
  var taskName = document.getElementById('editTaskName').value;
  var taskDuration = document.getElementById('editTaskDuration').value;
  if (taskDuration === "") {
    taskDuration = "N/A"
  }
  var taskDate = document.getElementById('editTaskDate').value;
  var username = localStorage.getItem("currentUsername");
  var id = taskId;

  // Delete the original task from the task string in local storage
  deleteTask(id);

  // Save the updated task to localStorage
  saveTaskToLocalStorage(taskName, taskDuration, taskDate, id, username);

  // Update the table with the updated task information
  addTaskToTable(taskName, taskDuration, taskDate, id)

  // Hide the task editing form
  document.getElementById('taskEditForm').style.display = 'none';

  // Hide the login form
  document.getElementById('login-form').classList.add('hide');
  document.getElementById('login-section').classList.add('hide');

  // Show the time management container
  document.getElementById('time-form').style.display = 'block'
  document.getElementById('time-table').style.visibility = 'visible'

}

function editTask(id) {
  var task = findTaskById(id);
  if (task) {
    // Populate the form fields with the task information
    document.getElementById('editTaskName').value = task.taskName;
    document.getElementById('editTaskDuration').value = task.taskDuration;
    document.getElementById('editTaskDate').value = task.taskDate;

    // Display the task editing form
    document.getElementById('taskEditForm').style.display = 'block';

    // Hide the time management container
    document.getElementById('time-form').classList.add('hide');
    document.getElementById('time-table').classList.add('invisible');

    // Set the current task ID as a data attribute on the form
    document.getElementById('taskEditForm').setAttribute('data-task-id', id);

    var editTaskForm = document.getElementById("editTaskForm");
    editTaskForm.addEventListener('submit', updateTask);
  }
}

// Load tasks specific to the authenticated user
function loadTasks(username) {
  // Clear existing tasks from the table
  clearTasks();

  // Load tasks from localStorage for the specific username
  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(function(task) {
    return task.username === username;
  });
  tasks = sortTasksByDate(tasks);
  tasks.forEach(function(task) {
    addTaskToTable(task.taskName, task.taskDuration, task.taskDate, task.id);
  });
}

// Clear existing tasks from the table
function clearTasks() {
  var table = document.getElementById('time-entries-list');
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }
}

// Sort tasks by date
function sortTasksByDate(tasks) {
  tasks.sort(function(a, b) {
    return new Date(a.taskDate) - new Date(b.taskDate);
  });

  return tasks;
}

// Format date as "dd/mm/yyyy"
function formatDate(dateString) {
  var date = new Date(dateString);
  var day = date.getDate().toString().padStart(2, '0');
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

// Delete a task
function deleteTask(id) {
  var table = document.getElementById('time-entries-list');
  var row = document.getElementById(id);
  table.deleteRow(row.rowIndex - 1);

  // Remove task from localStorage
  var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Login function
function login(event) {
  event.preventDefault(); // Prevent form submission

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var rememberMeFlag = document.getElementById('remember-me').checked;

  // Perform login validation
  var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  var matchedUser = registeredUsers.find(function(user) {
    return user.username === username;
  });

  if (matchedUser) {
    // Verify the password using encryption
    var encryptedPassword = CryptoJS.AES.encrypt(password, 'hehe').toString();

    var decryptedBytes1 = CryptoJS.AES.decrypt(encryptedPassword, 'hehe');
    var decryptedPassword1 = decryptedBytes1.toString(CryptoJS.enc.Utf8);

    var decryptedBytes2 = CryptoJS.AES.decrypt(matchedUser.password, 'hehe');
    var decryptedPassword2 = decryptedBytes2.toString(CryptoJS.enc.Utf8);

    if (decryptedPassword2 === decryptedPassword1) {
      // Password matches, perform login operations

      // Show the time management section
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('time-management-section').style.display = 'block';

      // Add the authenticated user info to localStorage
      localStorage.setItem('currentUsername', username);
      localStorage.setItem('currentPassword', encryptedPassword);
      
      // Set as valid user
      localStorage.setItem('validUser','true')

      // Remember me functionality
      if (rememberMeFlag) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.setItem('rememberMe', 'false');
      }

      // Show the app container
      document.getElementById('app-container').style.display = 'block';

      // Load tasks specific to the authenticated user
      loadTasks(username);

    } else {
      alert('Invalid password. Please try again.');
    }
  } else {
    alert('Invalid username. Please try again.');
  }
}

// Authenticate user against localStorage
function authenticateUser(username, password) {
  // Retrieve registered users from localStorage
  var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

  // Find user with matching credentials
  var authenticatedUser = registeredUsers.find(function(user) {
    return user.username === username && user.password === password;
  });

  // Return true if user is found, false otherwise
  return authenticatedUser !== undefined;
}

// Register function
function register(event) {
  event.preventDefault(); 

  var username = document.getElementById('registerUsername').value;
  var password = document.getElementById('registerPassword').value;
  var confirmPassword = document.getElementById('confirmPassword').value;

  // Perform registration validation
  if (username.length === 0 || password.length === 0 || confirmPassword.length === 0) {
    alert('Please fill in all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Password and Confirm Password do not match.');
    return;
  }

  // Check if the username already exists
  var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  var existingUser = registeredUsers.find(function(user) {
    return user.username === username;
  });

  if (existingUser) {
    alert('Username already exists. Please choose a different username.');
    return;
  }

  // Encrypt the user's password
  var encryptedPassword = CryptoJS.AES.encrypt(password, 'hehe').toString();

  // Store the registered user
  registeredUsers.push({ username: username, password: encryptedPassword});
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

  alert('Registration successful. You can now log in with your credentials.');

  // Clear the register form
  document.getElementById('registerUsername').value = '';
  document.getElementById('registerPassword').value = '';
  document.getElementById('confirmPassword').value = '';

  // Switch back to the login form
  switchForm();
}

function switchForm() {
  var loginForm = document.getElementById('login-form');
  var registerForm = document.getElementById('register-form');
  var switchBtn = document.getElementById('switchBtn');

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    switchBtn.textContent = 'Register';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    switchBtn.textContent = 'Back to Login';
  }
}

// Remember me functionality
var rememberMeCheckbox = document.getElementById('remember-me');
var storedCheckboxValue = localStorage.getItem('rememberMe');

if (storedCheckboxValue === 'true') {
  rememberMeCheckbox.checked = true;
} else {
  rememberMeCheckbox.checked = false; 
}

rememberMeCheckbox.addEventListener('change', function () {
  localStorage.setItem('rememberMe', this.checked);
});

// Check if remember me is enabled and auto-login if true
function checkRememberMe() {
  var validUser = localStorage.getItem('validUser')
  var rememberMe = localStorage.getItem('rememberMe');

  if (rememberMe === 'true' && validUser === 'true') {

    // Perform auto-login
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    document.getElementById('time-management-section').style.display = 'block';

    var currentUsername = localStorage.getItem('currentUsername');
    var currentPassword = localStorage.getItem('currentPassword')

    // Decrypt the password
    var decryptedBytes = CryptoJS.AES.decrypt(currentPassword, 'hehe');
    var decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (currentUsername) {
      // Perform auto-login
      document.getElementById('username').value = currentUsername;
      document.getElementById('password').value = decryptedPassword;
    }
  }
}