findAndApplyAllContentElement();

function findAndApplyAllContentElement() {
    const contentElements = document.querySelectorAll('.description-html [content]');
    contentElements.forEach(applyInnerHTML);
}

function applyInnerHTML(element) {
    element.innerHTML = element
          .getAttribute('content')
          .trim()
          .replaceAll('\n', '<br>') // Thay xuống dòng trước
          .replace(/(?:https?:\/\/[^\s<]+)/g, (url) => `<a class="series" href="${url}" target="_blank">${url}</a>`);

    element.removeAttribute('content');
}