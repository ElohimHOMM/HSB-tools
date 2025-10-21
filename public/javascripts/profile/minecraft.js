document.addEventListener('DOMContentLoaded', () => {

  $('#add-mc-form').on('submit', async function (e) {
    e.preventDefault();
    const mcUsername = $('#mc-username').val().trim();
    if (!mcUsername) return showErrorToast('Please enter a username.');

    const res = await fetch('/profile/minecraft/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mcUsername })
    });

    const data = await res.json();
    if (data.success) {
      showSuccessToast("Minecraft account linked!");
      location.reload();
    } else {
      showErrorToast(data.message || "Something went wrong!");
    }
  });

  document.querySelectorAll('.remove-mc-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to remove your Minecraft account?')) return;

      try {
        const accountId = button.dataset.id;
        const res = await fetch(`/api/minecraft/remove/${accountId}`, { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
          showSuccessToast(data.message);
          window.location.reload();
        } else {
          showErrorToast(data.message);
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Server error');
      }
    });
  });

});
