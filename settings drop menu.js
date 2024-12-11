// Dropdown for the menu on index.html
function SettingsDropdown() {
    var settingsContainer = document.getElementById('settings-container');
    var dropdownMenu = document.getElementById('dropdown-menu');

    dropdownMenu.style.display = 'none';

    // Add a click event listener to the settings container and username label
    var clickHandler = function (event) {
      event.stopPropagation();

      // Toggle the visibility of the dropdown menu
      if (dropdownMenu.style.display === 'none') {
        dropdownMenu.style.display = 'block';
      } else {
        dropdownMenu.style.display = 'none';
      }
    };

    settingsContainer.addEventListener('click', clickHandler);

    // Close the dropdown menu if user clicks outside of it
    window.addEventListener('click', function () {
      dropdownMenu.style.display = 'none';
    });

    dropdownMenu.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
  
  // Function to handle clicks on the menu items
  function handleMenuItemClicks() {
    // Handle "Account Settings" click
    var accountSettingsItem = document.getElementById('account-settings');
    accountSettingsItem.addEventListener('click', function () {
    });
  
    // Handle "Logout" click
    var logoutItem = document.getElementById('logout');
    logoutItem.addEventListener('click',logout)
    };

  
  // Call the initialization function when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', function () {
    SettingsDropdown();
    handleMenuItemClicks();
  });

 function openSettings() {
  window.location.href = "settings.html";
 }

 function logout() {
  var currentUsername = localStorage.getItem('currentUsername');
  var currentPassword = localStorage.getItem('currentPassword')
  var rememberMe = localStorage.getItem('rememberMe')
  currentUsername = ""
  currentPassword = ""
  rememberMe = "false"

  localStorage.setItem('currentUsername', currentUsername)
  localStorage.setItem('currentPassword', currentPassword)
  localStorage.setItem('rememberMe', rememberMe)
  localStorage.setItem('validUser', 'false')
  window.location.href="index.html"


 }