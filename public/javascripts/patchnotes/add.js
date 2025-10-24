const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));

document.getElementById('add-patchnote-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const version = document.getElementById('version').value.trim();
    const type = document.getElementById('type').value.trim();
    const note = document.getElementById('note').value.trim();

    try {
        const res = await fetch('/api/patchnotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ version, type, note })
        });

        const data = await res.json();

        if (res.ok) {
            showSuccessToast(data.message);
            document.getElementById('add-patchnote-form').reset();

            // Dynamically add a new row to the table
            const tableBody = document.querySelector('table tbody');
            if (tableBody) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td scope="row">${data.id || ''}</td>
                    <td>${version}</td>
                    <td>${type}</td>
                    <td>${note}</td>
                    <td>${new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                </td>
                    <td>—</td>
                    <td>
                        <button class="btn btn-sm btn-secondary bi bi-pen delete-patchnote-button" data-id="${data.id}"></button>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger bi bi-trash3 delete-patchnote-button" data-id="${data.id}"></button>
                    </td>
                `;
                tableBody.prepend(newRow);

                // Re-attach listeners to the new buttons
                attachDeleteAndEditListeners(newRow);
            }

        } else {
            showErrorToast(data.message);
        }
    } catch (err) {
        console.error(err);
        showErrorToast('Server error');
    }
});

function toggleEditMode(row, isEdit) {
    row.querySelectorAll('span').forEach(el => el.classList.toggle('d-none', isEdit));
    row.querySelectorAll('input').forEach(el => el.classList.toggle('d-none', !isEdit));
    row.querySelector('.edit-patchnote-button').classList.toggle('d-none', isEdit);
    row.querySelector('.save-patchnote-button').classList.toggle('d-none', !isEdit);
    row.querySelector('.cancel-patchnote-button').classList.toggle('d-none', !isEdit);
    row.querySelector('.delete-patchnote-button').classList.toggle('d-none', isEdit);
}


function editPatchNote(id) {
    // TODO: Swap to intline edit mode
    console.log('Edit patch note ID:', id);
    // TODO: Implement editing logic here
}

function deletePatchNote(id) {
    document.getElementById('deleteModalMessage').textContent =
        `Are you sure you want to delete patch note #${id}?`;
    deleteModal.show();
    return id;
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach listeners
    document.querySelectorAll('tr[data-id]').forEach(row => {
        const id = row.dataset.id;

        // Edit
        row.querySelector('.edit-patchnote-button').addEventListener('click', () => {
            toggleEditMode(row, true);
        });

        // Cancel
        row.querySelector('.cancel-patchnote-button').addEventListener('click', () => {
            // Reset inputs to original values
            row.querySelector('.version-input').value = row.querySelector('.version-display').textContent;
            row.querySelector('.type-input').value = row.querySelector('.type-display').textContent;
            row.querySelector('.note-input').value = row.querySelector('.note-display').textContent;
            toggleEditMode(row, false);
        });

        // Save
        row.querySelector('.save-patchnote-button').addEventListener('click', async () => {
            const version = row.querySelector('.version-input').value.trim();
            const type = row.querySelector('.type-input').value.trim();
            const note = row.querySelector('.note-input').value.trim();

            if (!version || !type) {
                showErrorToast('Version and Type are required.');
                return;
            }

            try {
                const res = await fetch(`/api/patchnotes/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ version, type, note })
                });
                const data = await res.json();

                if (res.ok) {
                    showSuccessToast(data.message);
                    // Update display spans
                    row.querySelector('.version-display').textContent = version;
                    row.querySelector('.type-display').textContent = type;
                    row.querySelector('.note-display').textContent = note;
                    toggleEditMode(row, false);
                } else {
                    showErrorToast(data.message);
                }
            } catch (err) {
                console.error(err);
                showErrorToast('Server error');
            }
        });

        // Delete (existing modal logic)
        row.querySelector('.delete-patchnote-button').addEventListener('click', () => {
            patchNoteToDelete = row.dataset.id;
            document.getElementById('deleteModalMessage').textContent =
                `Are you sure you want to delete patch note #${id}?`;
            deleteModal.show();
        });
    });

    document.querySelectorAll('.edit-patchnote-button').forEach((btn) => {
        btn.addEventListener('click', async () => editPatchNote(btn.dataset.id));
    });

    let patchNoteToDelete = null;

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    document.querySelectorAll('.delete-patchnote-button').forEach((btn) => {
        btn.addEventListener('click', () => {
            patchNoteToDelete = deletePatchNote(btn.dataset.id);
        });
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!patchNoteToDelete) return;

        try {
            const res = await fetch(`/api/patchnotes/${patchNoteToDelete}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok) {
                showSuccessToast(data.message);
                // Remove row from table
                const row = document.querySelector(`button[data-id="${patchNoteToDelete}"]`).closest('tr');
                if (row) row.remove();
            } else {
                showErrorToast(data.message);
            }
        } catch (err) {
            console.error(err);
            showErrorToast('Server error');
        } finally {
            patchNoteToDelete = null;
            deleteModal.hide();
        }
    });
});
