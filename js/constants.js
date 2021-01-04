
export default class Constants {
    static PWA_NOTES_DB = 'PWANotes';
    static NOTE_OBJECT_STORE = 'note';
    static CREATED_INDEX = 'created';

    static NOTE_KEY_SESSION_STORAGE = 'note-key';
    static NOTE_DATA_ID = '#note-data';
    static NOTE_TITLE_ID = '#note-title';
}

export const convertToMarkdown = function(data) {
    const reader = new commonmark.Parser();
    const writer = new commonmark.HtmlRenderer();
    const parsed = reader.parse(data);
    return writer.render(parsed);
}