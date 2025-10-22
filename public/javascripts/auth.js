$(document).ready(function () {

  setupPasswordToggle('toggle-login-password', 'login-password');
  setupPasswordToggle('toggle-signup-password', 'signup-password');


  $('#login-form').on('submit', function (e) {
    e.preventDefault();

    const username = $('#login-username').val().trim();
    const password = $('#login-password').val();

    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ username, password }),
      success: function (data) {
        console.log('Login successful:', data);
        $('#modal-login-signup').modal('hide');
        showSuccessToast(data.message || 'Login successful!');
        setTimeout(() => window.location.reload(), 1500);
      },
      error: function (err) {
        console.log('Login error:', err);
        const msg = err.responseJSON?.message || 'Login failed. Please check your credentials.';
        showErrorToast(msg);
      },
    });
  });

  $('#signup-form').on('submit', async function (e) {
    e.preventDefault();

    const username = $('#signup-username').val().trim();
    const password = $('#signup-password').val();
    const email = $('#signup-email').val().trim();

    $.ajax({
      url: '/api/auth/signup',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ username, password, email }),
      success: function (data) {
        console.log('Signup successful:', data);
        $('#modal-login-signup').modal('hide');
        showSuccessToast(data.message || 'Signup successful!');

        $.ajax({
          url: '/api/auth/login',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ username, password })
        });
        setTimeout(() => window.location.reload(), 1500);
      },
      error: function (err) {
        console.log('Signup error:', err);
        const msg = err.responseJSON?.message || 'Login failed. Please check your credentials.';
        showErrorToast(msg);
      },
    });
  });

  $('#logout-btn').on('click', async function (e) {
    e.preventDefault();

    $.ajax({
      url: '/api/auth/logout',
      method: 'POST',
      contentType: 'application/json',
      success: function (data) {
        console.log('Logout successful:', data);
        showSuccessToast(data.message || 'Logout successful!');
        setTimeout(() => window.location.reload(), 1500);
      },
      error: function (err) {
        console.log('Logout error:', err);
        const msg = err.responseJSON?.message || 'Logout failed. Please try again.';
        showErrorToast(msg);
      },
    });
  });
});

$.get('/api/auth/session', function (data) {
  console.log('Session state:', data);
});

function setupPasswordToggle(toggleBtnId, inputId) {
  const toggleBtn = document.getElementById(toggleBtnId);
  const inputField = document.getElementById(inputId);
  const icon = toggleBtn.querySelector('i');

  toggleBtn.addEventListener('click', () => {
    const isPassword = inputField.type === 'password';
    inputField.type = isPassword ? 'text' : 'password';
    icon.classList.toggle('bi-eye');
    icon.classList.toggle('bi-eye-slash');
  });
}