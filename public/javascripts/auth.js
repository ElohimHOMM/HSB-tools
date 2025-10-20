$(document).ready(function () {

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

function showSuccessToast(message) {
  showToast(message, 'success');
}

function showErrorToast(message) {
  showToast(message, 'danger');
}

function showToast(message, type) {
  // Create toast container if it doesn’t exist
  if ($('#toast-container').length === 0) {
    $('body').append('<div id="toast-container" class="toast-container position-fixed top-0 end-0 p-3"></div>');
  }

  const toastId = 'toast-' + Date.now();
  const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;

  $('#toast-container').append(toastHtml);
  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => $(toastEl).remove());
};
