'use strict';

const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
let patchNoteToDelete = null;

function toggleEditMode(row, isEdit) {
    row.querySelectorAll('.display-field').forEach(el => el.classList.toggle('d-none', isEdit));
    row.querySelectorAll('.edit-field').forEach(el => el.classList.toggle('d-none', !isEdit));

    row.querySelector('.edit-patchnote-button').classList.toggle('d-none', isEdit);
    row.querySelector('.save-patchnote-button').classList.toggle('d-none', !isEdit);
    row.querySelector('.cancel-patchnote-button').classList.toggle('d-none', !isEdit);
    row.querySelector('.delete-patchnote-button').classList.toggle('d-none', isEdit);
}

// === Helper: Attach row listeners (reusable for new/dynamic rows) ===
function attachRowListeners(row) {
    const id = row.dataset.id;

    const editBtn = row.querySelector('.edit-patchnote-button');
    const cancelBtn = row.querySelector('.cancel-patchnote-button');
    const saveBtn = row.querySelector('.save-patchnote-button');
    const deleteBtn = row.querySelector('.delete-patchnote-button');

    // Edit
    editBtn?.addEventListener('click', () => toggleEditMode(row, true));

    // Cancel
    cancelBtn?.addEventListener('click', () => {
        row.querySelector('.version-input').value = row.querySelector('.version-display').textContent;
        row.querySelector('.type-input').value = row.querySelector('.type-display').textContent;
        row.querySelector('.note-input').value = row.querySelector('.note-display').textContent;
        toggleEditMode(row, false);
    });

    // Save
    saveBtn?.addEventListener('click', async () => {
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
                row.querySelector('.version-display').textContent = version;
                row.querySelector('.type-display').textContent = type;
                row.querySelector('.note-display').textContent = note;
                toggleEditMode(row, false);
                window.location.reload();
            } else {
                showErrorToast(data.message);
            }
        } catch (err) {
            console.error(err);
            showErrorToast('Server error');
        }
    });

    // Delete
    deleteBtn?.addEventListener('click', () => {
        patchNoteToDelete = id;
        document.getElementById('deleteModalMessage').textContent =
            `Are you sure you want to delete patch note #${id}?`;
        deleteModal.show();
    });
}

// === Handle Adding a New Patchnote ===
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
            e.target.reset();
            window.location.reload();
        } else {
            showErrorToast(data.message);
        }
    } catch (err) {
        console.error(err);
        showErrorToast('Server error');
    }
});

// === Confirm Delete ===
document.getElementById('confirmDeleteBtn')?.addEventListener('click', async () => {
    if (!patchNoteToDelete) return;

    try {
        const res = await fetch(`/api/patchnotes/${patchNoteToDelete}`, {
            method: 'DELETE'
        });
        const data = await res.json();

        if (res.ok) {
            showSuccessToast(data.message);
            document.querySelector(`tr[data-id="${patchNoteToDelete}"]`)?.remove();
        } else {
            showErrorToast(data.message);
        }
    } catch (err) {
        console.error(err);
        showErrorToast('Server error');
    } finally {
        patchNoteToDelete = null;
        window.location.reload();
        deleteModal.hide();
    }
});

// === Init on Page Load ===
$(function() {
    document.querySelectorAll('tr[data-id]').forEach(attachRowListeners);
});