import fetch from '../fetch';

export default function request(name, params, alias) {
	
	let request = {
		'key': 'aveysov_37db73bb0ce8f672618770b1956f8798',
		'method': {
			'name': name,
			'version':1
		},
		'params': params ? params : []
	};

	const response = fetch('https://api.spark-in.me/apiHandler.php', {
			method: 'POST',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: 'query=' + encodeURIComponent(JSON.stringify(request))
	}).then(function(respData) {
		return respData.json();
	}).then(function(respBody) {
		return respBody;
	});
	
	return response;
}