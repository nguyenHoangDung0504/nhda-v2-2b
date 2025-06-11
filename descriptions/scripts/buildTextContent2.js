findAndApplyAllContentElement();

function findAndApplyAllContentElement() {
	const contentElements = document.querySelectorAll('.description-html [content]');
	contentElements.forEach(applyInnerHTML);
}

function applyInnerHTML(element) {
	element.innerHTML = element.getAttribute('content').trim().replaceAll('\n', '<br>');

	element.removeAttribute('content');
}
