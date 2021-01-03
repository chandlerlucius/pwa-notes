
import Constants from './constants.js'
import Transaction from './transaction.js'

async function getAndDisplayNotes() {
    const notes = await getNotes();
    displayNotes(notes);
}

async function getNotes() {
    const transaction = new Transaction(Constants.PWA_NOTES_DB);
    const notes = await transaction.getAllFromDb(Constants.NOTE_OBJECT_STORE);
    return notes;
}

const displayNotes = function(notes) {
    notes.forEach(function(note) {
        const noteTemplate = document.querySelector('#note-template');
        const noteClone = noteTemplate.content.cloneNode(true);
        noteClone.querySelector(Constants.NOTE_TITLE_ID).innerHTML = note.title;
        noteClone.querySelector(Constants.NOTE_DATA_ID).innerHTML = note.data;
        document.querySelector('#note-container').appendChild(noteClone);
    })
}

document.addEventListener('DOMContentLoaded', getAndDisplayNotes)