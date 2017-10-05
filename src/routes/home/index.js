import React from 'react';
import Layout from '../../components/Layout';
import List from '../../components/List';
import request from '../../core/request';
import {sortMetatags} from '../../core/sortMetatags';

export default {

	path: '/',

	async action() {
		const 
			responseGlobal = await request('getBlogObjects'),
			responsePosts = await request('getArticleFeed', {'getFullArticles': 1}),
			responseTags = await request('getTagInfo', {'targetId': 2, 'tagId': 0, 'getFullArticles' : 0}),
			responseAuthors = await request('getAuthorByAlias', {'authorAlias': 'all-authors', 'getFullArticles': 0});
		
		if (!responseGlobal || !responsePosts || !responseTags || !responseAuthors) {
			return { redirect: '/error' };
		}

		const
			glogalData = responseGlobal.response.data,
			curPage = glogalData.globals.pages.home,
			
			postsData = {
				posts: responsePosts.response.data,
				tags: responseTags.response.data.tag_data,
				tagsList: true,
				pager: true
			},
			
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
			component: <Layout data={pageData} ><List data={postsData} /></Layout>
		};
	},

};
