document.addEventListener('DOMContentLoaded', () => {
  const noteList = document.querySelector(".list-container .list-group");
  const noteTitle = document.querySelector(".note-title");
  const noteText = document.querySelector(".note-text");
  const saveNoteBtn = document.querySelector(".save-note");
  const newNoteBtn = document.querySelector(".new-note");
  const noteId = document.querySelector("#note-id");

  let editingNote = false;

  const renderNotes = (notes) => {
      noteList.innerHTML = '';
      notes.forEach(note => {
          const noteEl = document.createElement('button');
          noteEl.classList.add('list-group-item', 'list-group-item-action');
          noteEl.id = note.id;
          noteEl.innerText = note.title;
          noteEl.addEventListener('click', () => loadNote(note));
          noteList.appendChild(noteEl);
      });
  };

  const loadNote = (note) => {
      noteTitle.value = note.title;
      noteText.value = note.text;
      noteId.value = note.id;
      editingNote = true;
  };

  const saveOrUpdateNote = () => {
      const note = {
          title: noteTitle.value,
          text: noteText.value,
      };

      let fetchOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(note),
      };

      if (editingNote) {
          fetchOptions.method = 'PUT';
          note.id = noteId.value;
      }

      fetch('/api/notes', fetchOptions)
          .then(response => response.json())
          .then(data => {
              getNotes();
              clearForm();
          })
          .catch(err => console.error('Error:', err));
  };

  const getNotes = () => {
      fetch('/api/notes')
          .then(response => response.json())
          .then(data => renderNotes(data))
          .catch(err => console.error('Error:', err));
  };

  const clearForm = () => {
      noteTitle.value = '';
      noteText.value = '';
      noteId.value = '';
      editingNote = false;
  };

  saveNoteBtn.addEventListener('click', saveOrUpdateNote);
  newNoteBtn.addEventListener('click', clearForm);

  getNotes();
});