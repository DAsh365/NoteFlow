const apiPaths = {
  read: '/api/notes',
  create: '/api/notes',
  delete: '/api/notes'
};

const noteList = document.querySelector('.list-container .list-group');
const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');

let activeNote = {};

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

const fetchData = (url, options) => {
  return fetch(url, options)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .catch(error => {
          console.error('Fetch Error:', error);
      });
};

const saveNote = (note) => {
  fetchData(apiPaths.create, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
  })
  .then((data) => {
      getAndRenderNotes();
      renderActiveNote();
  });
};

const deleteNote = (id) => {
  fetchData(`${apiPaths.delete}/${id}`, {
      method: 'DELETE',
  })
  .then(() => {
      getAndRenderNotes();
      renderActiveNote();
  });
};

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
  } else {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
      title: noteTitle.value,
      text: noteText.value,
  };
  saveNote(newNote);
  activeNote = {};
};

const handleNoteDelete = (e) => {
  e.stopPropagation();
  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
      activeNote = {};
  }

  deleteNote(noteId);
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const getAndRenderNotes = () => {
  fetchData(apiPaths.read)
  .then((data) => {
      const noteItems = data.map((note) => createNoteListItem(note));
      noteList.innerHTML = '';
      noteItems.forEach((note) => noteList.appendChild(note));
  });
};

const createNoteListItem = (note) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  const span = document.createElement('span');
  span.textContent = note.title;

  li.appendChild(span);
  li.setAttribute('data-note', JSON.stringify(note));
  li.addEventListener('click', handleNoteView);

  const delBtn = document.createElement('i');
  delBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
  delBtn.addEventListener('click', handleNoteDelete);

  li.appendChild(delBtn);

  return li;
};

saveNoteBtn.addEventListener('click', handleNoteSave);
newNoteBtn.addEventListener('click', handleNewNoteView);
document.addEventListener('DOMContentLoaded', getAndRenderNotes);