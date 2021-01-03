import Constants from './constants.js'

const handleMarkdownPreview = function() {
    const textarea = document.querySelector(Constants.NOTE_DATA_ID);
    textarea.addEventListener('input', function(line) {
        const reader = new commonmark.Parser();
        const writer = new commonmark.HtmlRenderer();
        const parsed = reader.parse(this.value);
        const result = writer.render(parsed);

        const preview = document.querySelector('#note-preview');
        preview.innerHTML = '';
        preview.insertAdjacentHTML('beforeend', result);
    });
};

document.addEventListener('DOMContentLoaded', handleMarkdownPreview);
