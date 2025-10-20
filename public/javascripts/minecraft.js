document.addEventListener('DOMContentLoaded', () => {
  const addForm = document.getElementById('add-mc-form');
  const removeBtn = document.getElementById('remove-mc-btn');

  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mcUsername = document.getElementById('mc-username').value.trim();

      try {
        const res = await fetch('/api/minecraft/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mcUsername })
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          window.location.reload();
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert('Server error');
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to remove your Minecraft account?')) return;

      try {
        const res = await fetch('/api/minecraft/remove', { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          window.location.reload();
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert('Server error');
      }
    });
  }
});
