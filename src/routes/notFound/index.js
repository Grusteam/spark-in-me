import React from 'react';
import Layout from '../../components/Layout';
import Page from '../../components/Page';
import Link from '../../components/Link';

export default {

	path: '*',

	action() {
		const pageData = {
			title: 'Page Not Found',
			desc: 'Sorry, the page you were trying to view does not exist.',
			bg: '/images/home-bg.jpg',
			content: '<a href="/">Go to Home</a>',
			notFound: true
		};
		
		return {
			component: <Layout data={pageData}><div>Not Found</div></Layout>,
			status: 404,
		};
	},

};
