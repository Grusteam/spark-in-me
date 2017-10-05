import React from 'react';
import Layout from '../../components/Layout';
import List from '../../components/List';
import request from '../../core/request';

export default {

	path: '/posts',

	async action() {
		const
			responseGlobal = await request('getBlogObjects'),
			responsePosts = await request('getArticleFeed', {'getFullArticles': 1});
			
		if (!responseGlobal || !responsePosts) {
			return { redirect: '/error' };
		}
		
		const 
			glogalData = responseGlobal.response.data,
			curPage = glogalData.globals.pages.home,
			
			postsData = {
				posts: responsePosts.response.data,
				pager: false
			},
			
			pageData = {
				title: 'Все статьи',
				desc: 'Архив статей',
				bg: curPage.hero.imgix_url,
				footer: {
					footerText: glogalData.globals.footer_text,
					soc: glogalData.social
				},
				nav: {
					menu: glogalData.globals.nav_items,
					logo: glogalData.globals.site_title
				}
			};
		
		return {
			title: 'Все статьи',
			component: <Layout data={pageData} ><List data={postsData}/></Layout>,
		};
	},

};
