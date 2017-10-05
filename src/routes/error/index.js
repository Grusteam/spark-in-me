import React from 'react';
import ErrorPage from './ErrorPage';
import Layout from '../../components/Layout';

export default {

	path: '/error',

	action(error) {
		
		const pageDataError = {
			title: 'Error',
			desc: 'Sorry, a critical error occurred on this page.',
			bg: '/images/home-bg.jpg',
			error: true
		};
		
		return {
			component: <Layout data={pageDataError} ></Layout>
		};
	}
};
