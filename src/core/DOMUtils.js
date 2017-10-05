export function updateTagDom(tagName, keyName, keyValue, attrName, attrValue) {
	const node = document.head.querySelector(`${tagName}[${keyName}="${keyValue}"]`);
	if (node && node.getAttribute(attrName) === attrValue) return;

	// Remove and create a new tag in order to make it work with bookmarks in Safari
	if (node) {
		node.parentNode.removeChild(node);
	}
	if (typeof attrValue === 'string') {
		const nextNode = document.createElement(tagName);
		nextNode.setAttribute(keyName, keyValue);
		nextNode.setAttribute(attrName, attrValue);
		document.head.appendChild(nextNode);
	}
}

export function updateMeta(name, content) {
	updateTagDom('meta', 'name', name, 'content', content);
}

export function updateCustomMeta(property, content) {
	updateTagDom('meta', 'property', property, 'content', content);
}

export function updateLink(rel, href) {
	updateTagDom('link', 'rel', rel, 'href', href);
}
