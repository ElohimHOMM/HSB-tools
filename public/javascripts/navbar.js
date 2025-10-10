$(document).ready(function() {
  // Check if user is logged in
  $.get('/auth/session', function(data) {
    if (data.loggedIn) {
      // Optional: could replace DOM dynamically instead of full reload
      location.reload();
    }
  });

  $('#loginForm').on('submit', function(e) {
    e.preventDefault();
    const payload = {
      username: $('#login-username').val(),
      password: $('#login-password').val(),
    };
    $.ajax({
      url: '/auth/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function() {
        $('#loginModal').modal('hide');
        location.reload();
      },
      error: function(err) {
        alert('Login failed: ' + err.responseJSON?.error || 'Unknown error');
      },
    });
  });
  
  
  // -- Event Listener for Signup Form --
  document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value;
    const email = document.getElementById("signup-email").value.trim();

    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully! Please log in.");
        // Optionally auto-switch to login tab
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    }
  });
});
});
