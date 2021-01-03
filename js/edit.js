
import Constants from './constants.js'
import Transaction from './transaction.js'

async function displayValidOrBlankNote() {
    const note = await getNote();
    displayNote(note);
}

async function getNote() {
    const noteKey = parseInt(sessionStorage.getItem(Constants.NOTE_KEY_SESSION_STORAGE));
    if (Number.isInteger(noteKey)) {
        let note = await getNoteFromDb(noteKey);
        note.key = noteKey;
        return note;
    }
}

async function getNoteFromDb(noteKey) {
    const transaction = new Transaction(Constants.PWA_NOTES_DB);
    const note = await transaction.getOneFromDb(Constants.NOTE_OBJECT_STORE, noteKey);
    return note;
}

const displayNote = function (note) {
    if (note) {
        document.querySelector(Constants.NOTE_DATA_ID).value = note.data;
        document.querySelector(Constants.NOTE_TITLE_ID).value = note.title;
    }
}

async function updateOrAddNoteToDb(key, value) {
    const transaction = new Transaction(Constants.PWA_NOTES_DB);
    const notes = await transaction.updateOrAddToDb(Constants.NOTE_OBJECT_STORE, key, value);
    return notes;
}

const addSaveNoteEventListeners = function () {
    document.querySelector(Constants.NOTE_DATA_ID).addEventListener('input', saveNoteOnce, false);
    document.querySelector(Constants.NOTE_TITLE_ID).addEventListener('input', saveNoteOnce, false);
    window.addEventListener('blur', saveNote);
}

const saveNoteOnce = function () {
    saveNote();
    document.querySelector(Constants.NOTE_DATA_ID).removeEventListener('input', saveNoteOnce, false);
    document.querySelector(Constants.NOTE_TITLE_ID).removeEventListener('input', saveNoteOnce, false);
}

async function saveNote() {
    const noteData = document.querySelector(Constants.NOTE_DATA_ID).value;
    const noteTitle = document.querySelector(Constants.NOTE_TITLE_ID).value;
    const note = await getNote();
    let value = {
        title: noteTitle,
        data: noteData,
        edited: new Date()
    };
    let noteKey;
    if (note && (noteData !== note.data || noteTitle !== note.title)) {
        value.created = note.created;
        noteKey = await updateOrAddNoteToDb(note.key, value);
    } else if (!note && (noteData !== '' || noteTitle !== '')) {
        value.created = new Date();
        noteKey = await updateOrAddNoteToDb(null, value);
    }
    if(noteKey) {
        sessionStorage.setItem(Constants.NOTE_KEY_SESSION_STORAGE, noteKey)
    }
}

document.addEventListener('DOMContentLoaded', addSaveNoteEventListeners);
document.addEventListener('DOMContentLoaded', displayValidOrBlankNote);