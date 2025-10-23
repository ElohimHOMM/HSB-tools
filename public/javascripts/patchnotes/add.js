document.getElementById('add-patchnote-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const version = document.getElementById('version').value.trim();
  const type = document.getElementById('type').value.trim();
  const note = document.getElementById('note').value.trim();

  try {
    const res = await fetch('/patchnotes/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version, type, note })
    });

    const data = await res.json();

    if (res.ok) {
      showSuccessToast(data.message);
      document.getElementById('add-patchnote-form').reset();
    } else {
      showErrorToast(data.message);
    }
  } catch (err) {
    console.error(err);
    showErrorToast('Server error');
  }
});