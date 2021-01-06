
export const PWA_NOTES_DB = 'PWANotes';
export const NOTE_OBJECT_STORE = 'note';
export const CREATED_INDEX = 'created';

export const NOTE_KEY_SESSION_STORAGE = 'note-key';
export const NOTE_DATA_ID = '#note-data';
export const NOTE_TITLE_ID = '#note-title';

export const convertToMarkdown = function(data) {
    const reader = new commonmark.Parser();
    const writer = new commonmark.HtmlRenderer();
    const parsed = reader.parse(data);
    return writer.render(parsed);
}