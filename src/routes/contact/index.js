import React from 'react';
import Layout from '../../components/Layout';
import Page from '../../components/Page';
import request from '../../core/request';
import {sortMetatags} from '../../core/sortMetatags';

export default {

	path: '/contact',

	async action() {
		const 
			responseGlobal = await request('getBlogObjects'),
			responseAuthors = await request('getAuthorByAlias', {'authorAlias': 'all-authors', 'getFullArticles': 0});
			
		if (!responseGlobal || !responseAuthors) {
			return { redirect: '/error' };
		}
		
		const 
			glogalData = responseGlobal.response.data,
			curPage = glogalData.globals.pages.contact,
			
			pageData = {
				title: curPage.headline.value,
				desc: curPage.subheadline.value,
				bg: curPage.hero.imgix_url,
				footer: {
					footerText: glogalData.globals.footer_text,
					soc: glogalData.social
				},
				nav: {
					menu: glogalData.globals.nav_items,
					logo: glogalData.globals.site_title
				},
				leftNav: {
					soc: glogalData.social,
					authors: responseAuthors.response.data,
					similar: false
				}
			};
		
		return {
			meta: sortMetatags(curPage.meta),
			title: curPage.title,
			component: <Layout data={pageData} ><Page content={curPage.content}/></Layout>,
		};
	},
};
