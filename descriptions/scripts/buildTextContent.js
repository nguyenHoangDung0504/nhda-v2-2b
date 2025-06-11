findAndApplyAllContentElement();

function findAndApplyAllContentElement() {
	const contentElements = document.querySelectorAll('.description-html [content]');
	contentElements.forEach(applyInnerHTML);
}

// function applyInnerHTML(element) {
//     element.innerHTML = element
//           .getAttribute('content')
//           .trim()
//           .replaceAll('\n', '<br>') // Thay xuống dòng trước
//           .replace(/(?:https?:\/\/[^\s<]+)/g, (url) => `<a class="series" href="${url}" target="_blank">${url}</a>`);

//     element.removeAttribute('content');
// }

function applyInnerHTML(element) {
	const raw = element.getAttribute('content').trim();

	// Phân tích HTML bằng DOMParser để tránh phá HTML gốc
	const parser = new DOMParser();
	const doc = parser.parseFromString(`<div>${raw}</div>`, 'text/html');
	const root = doc.body.firstChild;

	// Hàm đệ quy: chỉ thay đổi trong text nodes
	function linkifyTextNodes(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			const parts = [];
			const regex = /https?:\/\/[^\s<>'"]+/g;
			let lastIndex = 0;
			let match;

			while ((match = regex.exec(node.textContent)) !== null) {
				const url = match[0];
				const index = match.index;

				// Push phần trước URL
				if (index > lastIndex) {
					parts.push(document.createTextNode(node.textContent.slice(lastIndex, index)));
				}

				// Thêm thẻ <a>
				const a = document.createElement('a');
				a.href = url;
				a.target = '_blank';
				a.className = 'series';
				a.textContent = url;
				parts.push(a);

				lastIndex = index + url.length;
			}

			// Phần còn lại
			if (lastIndex < node.textContent.length) {
				parts.push(document.createTextNode(node.textContent.slice(lastIndex)));
			}

			if (parts.length > 0) {
				// Thay node gốc bằng các phần đã tách
				const parent = node.parentNode;
				parts.forEach((p) => parent.insertBefore(p, node));
				parent.removeChild(node);
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			// Đệ quy cho con
			Array.from(node.childNodes).forEach((child) => linkifyTextNodes(child));
		}
	}

	linkifyTextNodes(root);

	// Thay \n bằng <br>
	root.innerHTML = root.innerHTML.replaceAll('\n', '<br>');

	element.innerHTML = root.innerHTML;
	element.removeAttribute('content');
}
