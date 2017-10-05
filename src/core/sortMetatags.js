import React from 'react';

export const sortMetatags = function(array) {
	let newArr = [];

	array.map((item) => {
		let obj = {};
		if (item.type == 'name') {
			obj.tagName = 'meta';
			obj.keyName = 'name';
			obj.keyValue = item.key;
			obj.attrName = 'content';
			obj.attrValue = item.content;
		}  else if (item.type == 'rel') {
			obj.tagName = 'link';
			obj.keyName = 'rel';
			obj.keyValue = item.key;
			obj.attrName = 'href';
			obj.attrValue = item.content;
		} else {
			obj.tagName = 'meta';
			obj.keyName = 'property';
			obj.keyValue = item.key;
			obj.attrName = 'content';
			obj.attrValue = item.content;
		}
		newArr.push(obj);
	});
	
	return newArr;
};