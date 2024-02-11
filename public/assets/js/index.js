const noteForm = document.querySelector('.note-form');
const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const clearBtn = document.querySelector('.clear-btn');
const noteList = document.querySelector('#list-group');

const show = (elem) => {
  elem.style.display = 'block';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

const renderNote = (note) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  li.innerHTML = `
    <span>${note.title}</span>
    <button class="btn btn-sm btn-danger delete-note" data-id="${note.id}"><i class="fas fa-trash"></i></button>
  `;
  noteList.appendChild(li);
};

const renderNotes = (notes) => {
  noteList.innerHTML = '';
  notes.forEach((note) => {
    renderNote(note);
  });
};

const fetchNotes = () => {
  fetch('/api/notes')
    .then((res) => res.json())
    .then((data) => renderNotes(data))
    .catch((err) => console.error('Error fetching notes:', err));
};

const saveNote = (note) => {
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    .then((res) => res.json())
    .then((data) => {
      renderNote(data);
      noteTitle.value = '';
      noteText.value = '';
    })
    .catch((err) => console.error('Error saving note:', err));
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const newNote = {
    title: noteTitle.value.trim(),
    text: noteText.value.trim(),
  };
  if (!newNote.title || !newNote.text) {
    alert('Please fill out both fields');
    return;
  }
  saveNote(newNote);
};

const handleNoteDelete = (e) => {
  if (!e.target.matches('.delete-note')) return;
  const id = e.target.dataset.id;
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  })
    .then(() => e.target.parentNode.remove())
    .catch((err) => console.error('Error deleting note:', err));
};

saveNoteBtn.addEventListener('click', handleFormSubmit);

noteList.addEventListener('click', handleNoteDelete);

newNoteBtn.addEventListener('click', () => {
  noteTitle.value = '';
  noteText.value = '';
});

clearBtn.addEventListener('click', () => {
  noteTitle.value = '';
  noteText.value = '';
});

fetchNotes();