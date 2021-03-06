
export const PWA_NOTES_DB = 'PWANotes';
export const NOTE_OBJECT_STORE = 'note';
export const CREATED_INDEX = 'created';

export const NOTE_KEY_SESSION_STORAGE = 'note-key';
export const NOTE_DATA_ID = '#note-data';
export const NOTE_TITLE_ID = '#note-title';

export const EDIT_PANE_ID = '#edit-pane';
export const VIEW_PANE_ID = '#view-pane';

export const convertToMarkdown = function(data) {
    var lexed = marked.lexer(data);
    var parsed = marked.parser(lexed);
    return parsed;
}