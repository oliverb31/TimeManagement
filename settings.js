document.addEventListener('DOMContentLoaded', initializeSettingsPage);

function initializeSettingsPage() {
  var changeUsernameForm = document.getElementById("changeUsernameForm");
  changeUsernameForm.addEventListener('submit', handleUsernameChange);

  var changePasswordForm = document.getElementById("changePasswordForm");
  changePasswordForm.addEventListener('submit', handlePasswordChange);

  var deleteAccountForm = document.getElementById("deleteAccountForm");
  deleteAccountForm.addEventListener('submit', handleDeleteAccount);

  var homeLink = document.getElementById("home-link");
  homeLink.addEventListener('click', goToTimeManagement);
}

function goToTimeManagement(event) {
  event.preventDefault();
  window.location.href = "index.html#time-management-section";
}

function handleUsernameChange(event) {
  event.preventDefault(); 

  var newUsernameInput = document.getElementById('new-username');
  var confirmUsernameInput = document.getElementById('confirm-username');

  var newUsername = newUsernameInput.value;
  var confirmUsername = confirmUsernameInput.value;

  if (newUsername === confirmUsername) {
    // Change username stored in localStorage, both for current username and registered users array
    var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Find the index of the current user in the registered users array
    var currentUserIndex = registeredUsers.findIndex(function (user) {
      return user.username === localStorage.getItem("currentUsername");
    });

    if (currentUserIndex !== -1) {
      // Update the username for the current user
      registeredUsers[currentUserIndex].username = newUsername;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      localStorage.setItem('currentUsername', newUsername);
      alert("Username changed successfully");

      // Update username in tasks array
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(function (task) {

        task.username = localStorage.getItem("currentUsername")
        }
      );
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } 
  } 

  // Reset the form inputs
  newUsernameInput.value = '';
  confirmUsernameInput.value = '';
}

function handlePasswordChange(event) {
    event.preventDefault(); 
  
    var newPasswordInput = document.getElementById('new-password');
    var confirmPasswordInput = document.getElementById('confirm-password');
    var currentPasswordInput = document.getElementById('current-password');
  
    var newPassword = newPasswordInput.value;
    var confirmPassword = confirmPasswordInput.value;
    var currentPassword = currentPasswordInput.value;
  
    // Decrypt the current password stored in localStorage
    var encryptedCurrentPassword = localStorage.getItem('currentPassword');
    var decryptedCurrentPassword = CryptoJS.AES.decrypt(encryptedCurrentPassword, 'hehe').toString(CryptoJS.enc.Utf8);
  
    if (newPassword === confirmPassword){
      if (currentPassword === decryptedCurrentPassword) {
      // Encrypt the new password
      var encryptedPassword = CryptoJS.AES.encrypt(newPassword, 'hehe').toString();
  
      // Change password stored in localStorage, both for the current user and registered users array
      var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  
      // Find the index of the current user in the registered users array
      var currentUserIndex = registeredUsers.findIndex(function (user) {
        return user.username === localStorage.getItem("currentUsername");
      });
  
      if (currentUserIndex !== -1) {
        // Update the encrypted password for the current user
        registeredUsers[currentUserIndex].password = encryptedPassword;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        localStorage.setItem('currentPassword', encryptedPassword);
        alert('Password changed successfully');
      } 
      }else {
        alert("Incorrect current password")
      }
    } else {
      alert("New password and confirm password do not match")
    }
  
    // Reset the form inputs
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    currentPasswordInput.value = '';
}

function handleDeleteAccount(event) {
    event.preventDefault(); 
  
    var confirmDeleteInput = document.getElementById('confirm-delete');
    var confirmDeleteValue = confirmDeleteInput.value;
  
    if (confirmDeleteValue === 'DELETE') {
  
      // Get the current username from localStorage
      var currentUsername = localStorage.getItem('currentUsername');
  
      // Remove the current user from the registered users array
      var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      var filteredUsers = registeredUsers.filter(function (user) {
        return user.username !== currentUsername;
      });
      localStorage.setItem('registeredUsers', JSON.stringify(filteredUsers));
  
      // Clear the localStorage for the current user
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('currentPassword');
        localStorage.removeItem('rememberMe');

      // Delete tasks associated with the account
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      var filteredTasks = tasks.filter(function (task) {
        return task.username !== currentUsername;
      });
      localStorage.setItem('tasks', JSON.stringify(filteredTasks));
  
      // Redirect to the login page or any other appropriate page
      window.location.href = 'index.html';

    } else {
      alert('Confirmation text is incorrect. Account deletion canceled.');
    }
  
    // Reset the form input
    confirmDeleteInput.value = '';
  }

