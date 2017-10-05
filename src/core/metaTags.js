import React from 'react';

export const updateTag = function({ tagName, keyName, keyValue, attrName, attrValue, extraName, extraValue }) {
	const
		fallbackKeyName = keyName === 'httpEquiv' ? 'http-equiv' : keyName,
		node = document.head.querySelector(`${tagName}[${fallbackKeyName}="${keyValue}"]`);

	const
		nextNode = document.createElement(tagName);

	if (attrValue && typeof attrValue === 'string') {
		nextNode.setAttribute(fallbackKeyName, keyValue);
		nextNode.setAttribute(attrName, attrValue);

		if (extraName && extraValue) {
			nextNode.setAttribute(extraName, extraValue);
		}
	}
	
	if (attrName === 'hrefLang') {
		const 
			hrefNode = document.head.querySelector(`${tagName}[${attrName}="${attrValue}"]`);
			
		document.head.replaceChild(nextNode, hrefNode);
		return;
	}
	
	if (!node) {
		document.head.appendChild(nextNode);
	} else {
		node.parentNode.replaceChild(nextNode, node);
	}
};

export const dataToMetaTags = function(data) {
	const
		result = [];

	if (!data || !data.length) {
		return result;
	}

	data.map((item, i) => {
		if (!item.attrValue) {
			return;
		}

		let
			TagName = `${item.tagName}`,
			tagProps = {};

			tagProps[item.keyName]  = item.keyValue;
			tagProps[item.attrName] = item.attrValue;

			if (item.extraName && item.extraValue) {
				tagProps[item.extraName] = item.extraValue;
			}

			tagProps.key = i;

		result.push(<TagName {...tagProps} />);
	});

	return result;
};
