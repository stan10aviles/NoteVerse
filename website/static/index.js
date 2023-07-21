
function deleteNote(noteId) {
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteId: noteId }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function toggleEdit(noteId) {
  const noteTitle = document.getElementById(`noteTitle${noteId}`);
  const noteContent = document.getElementById(`noteContent${noteId}`);
  const editButton = document.getElementById(`editButton${noteId}`);
  const saveButton = document.getElementById(`saveButton${noteId}`);
  const cancelButton = document.getElementById(`cancelButton${noteId}`);

  noteTitle.contentEditable = true;
  noteContent.contentEditable = true;

  editButton.style.display = 'none';
  saveButton.style.display = 'inline-block';
  cancelButton.style.display = 'inline-block';
}

function saveChanges(noteId) {
  const noteTitle = document.getElementById(`noteTitle${noteId}`);
  const noteContent = document.getElementById(`noteContent${noteId}`);
  const editButton = document.getElementById(`editButton${noteId}`);
  const saveButton = document.getElementById(`saveButton${noteId}`);
  const cancelButton = document.getElementById(`cancelButton${noteId}`);

  noteTitle.contentEditable = false;
  noteContent.contentEditable = false;

  editButton.style.display = 'inline-block';
  saveButton.style.display = 'none';
  cancelButton.style.display = 'none';

  let newNoteTitle = noteTitle.textContent;
  let newNoteContent = noteContent.textContent

  // Send the updated data to the backend using AJAX (Fetch API)
  fetch("/edit-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      noteId: noteId,
      noteTitle: newNoteTitle,
      noteContent: newNoteContent
    })

  }).then(() => {
    
  }).catch(error => {
    // Optional
    console.error("Error updating note:", error);
  });

}

function cancelEdit(noteId) {
  const noteTitle = document.getElementById(`noteTitle${noteId}`);
  const noteContent = document.getElementById(`noteContent${noteId}`);
  const editButton = document.getElementById(`editButton${noteId}`);
  const saveButton = document.getElementById(`saveButton${noteId}`);
  const cancelButton = document.getElementById(`cancelButton${noteId}`);

  noteTitle.contentEditable = false;
  noteContent.contentEditable = false;

  editButton.style.display = 'inline-block';
  saveButton.style.display = 'none';
  cancelButton.style.display = 'none';
}

function copyNote(noteId) {
  const noteContent = document.getElementById(`noteContent${noteId}`);
  const copyButton = document.getElementById(`copyButton${noteId}`);
  const tooltip = document.getElementById(`myToolTip${noteId}`);


  navigator.clipboard.writeText(noteContent.textContent)
    .then(() => {
      tooltip.innerHTML = "Copied!";
      setTimeout(() => {
        tooltip.innerHTML = "Clip";
      }, 1500); // Reset tooltip text after 1.5 seconds
    })
    .catch((error) => {
      console.error("Error copying note:", error);
    });
}

function searchNote(user_id) {
  let userInput = document.getElementById("filterInput").value.toLowerCase();

  fetch(`/search-note?noteContent=${userInput}&userId=${user_id}`)
    .then(response => response.json())
    .then(data => {
      // Handle the data returned from the backend (data will contain the search results)
      console.log(data);
      const noteItems = document.querySelectorAll(".note-item");

      // Loop through each note item and hide/show based on the search results
      noteItems.forEach(noteItem => {
        const noteContent = noteItem.querySelector(".note-content").textContent;
        const noteTitle = noteItem.querySelector(".note-title").textContent;

        if (noteContent.includes(userInput) || noteTitle.includes(userInput)) {
          noteItem.style.display = "block"; // Show the note item if it matches the search criteria
        } else {
          noteItem.style.display = "none"; // Hide the note item if it doesn't match the search criteria
        }
      });
      
    })
    .catch(error => {
      console.error("Error searching notes:", error);
    });
}