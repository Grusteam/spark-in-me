import fetch from '../fetch';

let respObj = {};

export default function request(name, params, alias) {

	if (name == 'getTagByAlias') {
		console.log('params, alias', params, alias);
	}

	
	let request = {
		'key': 'aveysov_37db73bb0ce8f672618770b1956f8798',
		'method': {
			'name': name,
			'version':1
		},
		'params': params ? params : []
	}, response;

	if ((alias && !respObj[alias]) || !respObj[name] || name == 'getSimilarArticlesByArticleAlias') {
		const response = fetch('https://api.spark-in.me/apiHandler.php', {
				method: 'POST',
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: 'query=' + encodeURIComponent(JSON.stringify(request))
		}).then(function(respData) {
			return respData.json();hljs
		}).then(function(respBody) {
			return respBody;
		});
		
		if (alias) {
			// console.info('Request new data', alias);
			respObj[alias] = respObj[name] = response;
		} else {
			// console.info('Request new data', name);
			respObj[name] = response;
		}
	}
	
	// console.log('alias', alias);
	// console.log('respObj', respObj);

	if (alias) {
		return respObj[alias];
	} else {
		return respObj[name];
	}
}