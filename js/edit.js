
import {
    PWA_NOTES_DB,
    NOTE_OBJECT_STORE,
    NOTE_KEY_SESSION_STORAGE, 
    NOTE_DATA_ID, 
    NOTE_TITLE_ID, 
    convertToMarkdown
} from './constants.js'
import Transaction from './transaction.js'

async function displayNoteAndPreview() {
    const note = await getNote();
    displayNote(note);
    displayPreview();
}

async function getNote() {
    const noteKey = parseInt(sessionStorage.getItem(NOTE_KEY_SESSION_STORAGE));
    if (Number.isInteger(noteKey)) {
        let note = await getNoteFromDb(noteKey);
        note.key = noteKey;
        return note;
    }
}

async function getNoteFromDb(noteKey) {
    const transaction = new Transaction(PWA_NOTES_DB);
    const note = await transaction.getOneFromDb(NOTE_OBJECT_STORE, noteKey);
    return note;
}

const displayNote = function (note) {
    if (note) {
        document.querySelector(NOTE_DATA_ID).value = note.data;
        document.querySelector(NOTE_TITLE_ID).value = note.title;
    }
}

const displayPreview = function () {
    const textarea = document.querySelector(NOTE_DATA_ID);
    const markdown = convertToMarkdown(textarea.value);

    const preview = document.querySelector('#note-preview');
    preview.innerHTML = '';
    preview.insertAdjacentHTML('beforeend', markdown);
};

const setupPreviewEventListeners = function () {
    const textarea = document.querySelector(NOTE_DATA_ID);
    textarea.addEventListener('input', displayPreview);
};

const addSaveNoteEventListeners = function () {
    document.querySelector(NOTE_DATA_ID).addEventListener('input', saveNoteOnce, false);
    document.querySelector(NOTE_TITLE_ID).addEventListener('input', saveNoteOnce, false);
    window.addEventListener('focusout', saveNote);
    window.addEventListener('beforeunload', saveNote);
}

const saveNoteOnce = function () {
    saveNote();
    document.querySelector(NOTE_DATA_ID).removeEventListener('input', saveNoteOnce, false);
    document.querySelector(NOTE_TITLE_ID).removeEventListener('input', saveNoteOnce, false);
}

async function saveNote() {
    const noteData = document.querySelector(NOTE_DATA_ID).value;
    const noteTitle = document.querySelector(NOTE_TITLE_ID).value;
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
    if (noteKey) {
        sessionStorage.setItem(NOTE_KEY_SESSION_STORAGE, noteKey);
    }
}

async function updateOrAddNoteToDb(key, value) {
    const transaction = new Transaction(PWA_NOTES_DB);
    const notes = await transaction.updateOrAddToDb(NOTE_OBJECT_STORE, key, value);
    return notes;
}

document.addEventListener('DOMContentLoaded', displayNoteAndPreview);
document.addEventListener('DOMContentLoaded', setupPreviewEventListeners);
document.addEventListener('DOMContentLoaded', addSaveNoteEventListeners);