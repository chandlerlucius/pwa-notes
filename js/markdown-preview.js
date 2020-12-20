const convertLineToMarkdown = function(line) {
    const reader = new commonmark.Parser();
    const writer = new commonmark.HtmlRenderer();
    const parsed = reader.parse(this.value);
    const result = writer.render(parsed);
    
    const preview = document.querySelector('#add-note-preview');
    preview.insertAdjacentHTML('beforeend', result);
};

const updatePreview = function() {
    const preview = document.querySelector('#add-note-preview');
    const lines = this.value.split('\n');
    lines.forEach(function(line) {
        convertLineToMarkdown(line);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('#add-note-textarea');
    textarea.addEventListener('input', updatePreview);
});
