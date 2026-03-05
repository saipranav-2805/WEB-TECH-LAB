// Display message function
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}

// Show loading state
function showLoading() {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '<p>Loading notes...</p>';
}

// Load all notes
async function loadNotes() {
    showLoading();

    try {
        const response = await fetch('/notes');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
        showMessage('Error loading notes. Make sure the server is running.', 'error');

        const container = document.getElementById('notesContainer');
        container.innerHTML = '<p>Error loading notes. Please refresh the page.</p>';
    }
}

// Display notes in the container
function displayNotes(notes) {
    const container = document.getElementById('notesContainer');

    if (!notes || notes.length === 0) {
        container.innerHTML = '<p>No notes found. Add your first note using the form above!</p>';
        return;
    }

    container.innerHTML = notes.map(note => {
        // Escape special characters for safe HTML insertion
        const safeTitle = escapeHtml(note.title || '');
        const safeSubject = escapeHtml(note.subject || '');
        const safeDescription = escapeHtml(note.description || '');
        const safeDate = escapeHtml(note.created_date || '');

        return `
        <div class="note-card" data-id="${note._id}">
            <h3>${safeTitle}</h3>
            <div class="subject">Subject: ${safeSubject}</div>
            <div class="date">Created: ${safeDate}</div>
            <div class="description">${safeDescription}</div>
            <div class="note-actions">
                <button onclick="showEditForm('${note._id}')">Edit</button>
                <button onclick="deleteNote('${note._id}')">Delete</button>
            </div>
            <div id="edit-${note._id}" class="edit-form" style="display: none;">
                <h4>Edit Note</h4>
                <div class="form-group">
                    <label>Title:</label>
                    <input type="text" id="edit-title-${note._id}" value="${safeTitle}">
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <textarea id="edit-desc-${note._id}">${safeDescription}</textarea>
                </div>
                <button onclick="updateNote('${note._id}')">Update</button>
                <button onclick="hideEditForm('${note._id}')">Cancel</button>
            </div>
        </div>
    `}).join('');
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show edit form for a specific note
function showEditForm(noteId) {
    // Hide any other open edit forms
    document.querySelectorAll('.edit-form').forEach(form => {
        form.style.display = 'none';
    });

    const editForm = document.getElementById(`edit-${noteId}`);
    if (editForm) {
        editForm.style.display = 'block';
    }
}

// Hide edit form
function hideEditForm(noteId) {
    const editForm = document.getElementById(`edit-${noteId}`);
    if (editForm) {
        editForm.style.display = 'none';
    }
}

// Add new note
document.getElementById('addNoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('title');
    const subjectInput = document.getElementById('subject');
    const descriptionInput = document.getElementById('description');

    const noteData = {
        title: titleInput.value.trim(),
        subject: subjectInput.value.trim(),
        description: descriptionInput.value.trim()
    };

    // Validate inputs
    if (!noteData.title || !noteData.subject || !noteData.description) {
        showMessage('All fields are required!', 'error');
        return;
    }

    try {
        const response = await fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Note added successfully!');
            // Clear form
            titleInput.value = '';
            subjectInput.value = '';
            descriptionInput.value = '';
            // Refresh notes list
            loadNotes();
        } else {
            showMessage(data.error || 'Error adding note', 'error');
        }
    } catch (error) {
        console.error('Error adding note:', error);
        showMessage('Error adding note. Check server connection.', 'error');
    }
});

// Update note
async function updateNote(noteId) {
    const titleInput = document.getElementById(`edit-title-${noteId}`);
    const descInput = document.getElementById(`edit-desc-${noteId}`);

    if (!titleInput || !descInput) {
        showMessage('Error: Edit form not found', 'error');
        return;
    }

    const updatedTitle = titleInput.value.trim();
    const updatedDesc = descInput.value.trim();

    if (!updatedTitle || !updatedDesc) {
        showMessage('Title and description cannot be empty!', 'error');
        return;
    }

    const updateData = {
        title: updatedTitle,
        description: updatedDesc
    };

    try {
        const response = await fetch(`/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Note updated successfully!');
            hideEditForm(noteId);
            loadNotes();
        } else {
            showMessage(data.error || 'Error updating note', 'error');
        }
    } catch (error) {
        console.error('Error updating note:', error);
        showMessage('Error updating note. Check server connection.', 'error');
    }
}

// Delete note
async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`/notes/${noteId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Note deleted successfully!');
            loadNotes();
        } else {
            showMessage(data.error || 'Error deleting note', 'error');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showMessage('Error deleting note. Check server connection.', 'error');
    }
}

// Load notes when page loads
document.addEventListener('DOMContentLoaded', loadNotes);