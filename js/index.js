
import {
    PWA_NOTES_DB,
    NOTE_OBJECT_STORE,
    NOTE_KEY_SESSION_STORAGE, 
    NOTE_DATA_ID, 
    NOTE_TITLE_ID, 
    convertToMarkdown
} from './constants.js'
import Transaction from './transaction.js'

async function setupNotesAndEvents() {
    await getAndDisplayNotes();
    setupNoteClickEvents();
}

async function getAndDisplayNotes() {
    const notes = await getNotes();
    displayNotes(notes);
}

async function getNotes() {
    const transaction = new Transaction(PWA_NOTES_DB);
    const notes = await transaction.getAllFromDb(NOTE_OBJECT_STORE);
    return notes;
}

const displayNotes = function(notes) {
    notes.forEach(function(note) {
        const noteTemplate = document.querySelector('#note-template');
        const noteClone = noteTemplate.content.cloneNode(true);
        noteClone.querySelector(NOTE_TITLE_ID).key = note.key;
        noteClone.querySelector(NOTE_TITLE_ID).innerHTML = note.value.title;
        const markdown = convertToMarkdown(note.value.data);
        noteClone.querySelector(NOTE_DATA_ID).innerHTML = markdown;
        document.querySelector('#note-container').appendChild(noteClone);
    });
    if(notes.length === 0) {
        document.querySelector('#welcome-message').classList.add('center');
    }
}

const setupNoteClickEvents = function() {
    document.querySelectorAll('.note-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const key = card.querySelector(NOTE_TITLE_ID).key;
            sessionStorage.setItem(NOTE_KEY_SESSION_STORAGE, key);
            window.location.href = './edit';
        });
    });
    document.querySelectorAll('.add-note-button').forEach(function(button) {
        button.addEventListener('click', function() {
            sessionStorage.removeItem(NOTE_KEY_SESSION_STORAGE);
            window.location.href = './edit';
        });
    });
}

document.addEventListener('DOMContentLoaded', setupNotesAndEvents);