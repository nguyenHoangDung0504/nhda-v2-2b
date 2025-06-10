const data = [
	{
		type: 'audio',
		mediaStreamUrl: 'https://example.com/audio.mp3',
		'@folder': 'MP3',
	},
	{
		type: 'text',
		mediaStreamUrl: 'https://example.com/text1',
		'@folder': 'MP3',
	},
	{
		type: 'image',
		mediaStreamUrl: 'https://example.com/image.jpg',
		'@folder': '正式登记',
	},
	{
		type: 'text',
		mediaStreamUrl: 'https://example.com/text2',
		'@folder': '正式登记',
	},
	{
		type: 'image',
		mediaStreamUrl: 'https://example.com/image2.jpg',
		'@folder': 'MP3',
	},
	{
		type: 'unknown',
		mediaStreamUrl: 'https://example.com/other',
		'@folder': '杂项',
	},
];

const container = document.getElementById('container');
const imageOutput = document.getElementById('imageOutput');
const audioOutput = document.getElementById('audioOutput');
const textOutput = document.getElementById('textOutput');

const selected = {
	image: new Set(),
	audio: new Set(),
	text: new Set(),
};

function updateOutput() {
	imageOutput.value = [...selected.image].join(', ');
	audioOutput.value = [...selected.audio].join(', ');
	textOutput.value = [...selected.text].join(', ');
	autoResize(imageOutput);
	autoResize(audioOutput);
	autoResize(textOutput);
}

function autoResize(textarea) {
	textarea.style.height = 'auto';
	textarea.style.height = textarea.scrollHeight + 'px';
}

function copyOutput(id) {
	const textarea = document.getElementById(id);
	textarea.select();
	document.execCommand('copy');
}

const groups = {};
for (const item of data) {
	const folder = item['@folder'] || 'Uncategorized';
	if (!groups[folder]) groups[folder] = [];
	groups[folder].push(item);
}

for (const [folder, items] of Object.entries(groups)) {
	const details = document.createElement('details');
	const summary = document.createElement('summary');
	summary.textContent = folder;
	details.appendChild(summary);

	for (const [index, item] of items.entries()) {
		const wrapper = document.createElement('div');
		wrapper.className = 'item';

		const id = `${folder}-${index}-${item.type}`;
		const input = document.createElement('input');
		input.type = 'checkbox';
		input.id = id;

		const label = document.createElement('label');
		label.setAttribute('for', id);

		const urlText = document.createElement('div');
		urlText.textContent = item.mediaStreamUrl;
		urlText.style.wordBreak = 'break-word';
		urlText.style.marginBottom = '10px';
		label.appendChild(urlText);

		if (item.type === 'audio') {
			const audio = document.createElement('audio');
			audio.controls = true;
			audio.src = item.mediaStreamUrl;
			label.appendChild(audio);

			input.addEventListener('change', () => {
				wrapper.classList.toggle('checked', input.checked);
				if (input.checked) selected.audio.add(item.mediaStreamUrl);
				else selected.audio.delete(item.mediaStreamUrl);
				updateOutput();
			});
		} else if (item.type === 'image') {
			const imgWrapper = document.createElement('div');
			imgWrapper.style.position = 'relative';

			const img = document.createElement('img');
			img.src = item.mediaStreamUrl;

			const overlay = document.createElement('div');
			overlay.className = 'url-overlay';
			overlay.textContent = item.mediaStreamUrl;

			imgWrapper.appendChild(img);
			imgWrapper.appendChild(overlay);
			label.appendChild(imgWrapper);

			input.addEventListener('change', () => {
				wrapper.classList.toggle('checked', input.checked);
				if (input.checked) selected.image.add(item.mediaStreamUrl);
				else selected.image.delete(item.mediaStreamUrl);
				updateOutput();
			});
		} else if (item.type === 'text') {
			const textarea = document.createElement('textarea');
			textarea.setAttribute('type', 'content');
			textarea.placeholder = 'Nội dung text...';
			label.appendChild(textarea);

			input.addEventListener('change', () => {
				wrapper.classList.toggle('checked', input.checked);
				if (input.checked) selected.text.add(item.mediaStreamUrl);
				else selected.text.delete(item.mediaStreamUrl);
				updateOutput();
			});
		}

		wrapper.appendChild(input);
		wrapper.appendChild(label);
		details.appendChild(wrapper);
	}

	container.appendChild(details);
}

// Gọi resize ban đầu
updateOutput();

document.querySelectorAll('details > summary').forEach((summary) => {
	summary.addEventListener('click', function (e) {
		const currentDetails = this.parentElement;
		const allDetails = document.querySelectorAll('details');

		// Nếu đang đóng => chuẩn bị mở => đóng tất cả cái khác
		if (!currentDetails.open) {
			allDetails.forEach((d) => {
				if (d !== currentDetails) d.removeAttribute('open');
			});
		}
	});
});
