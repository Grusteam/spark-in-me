import React from 'react';
import Layout from '../../components/Layout';
import List from '../../components/List';
import request from '../../core/request';
import {sortMetatags} from '../../core/sortMetatags';

export default {

	path: '/',

	async action({dataCache}) {
		let
			responseGlobal,
			responsePosts,
			responseTags,
			responseAuthors; 

		if (!dataCache.responsePosts) {
			dataCache.responseGlobal = await request('getBlogObjects'),
			dataCache.responsePosts = await request('getArticleFeed', {'getFullArticles': 1}),
			dataCache.responseTags = await request('getTagInfo', {'targetId': 2, 'tagId': 0, 'getFullArticles' : 0}),
			dataCache.responseAuthors = await request('getAuthorByAlias', {'authorAlias': 'all-authors', 'getFullArticles': 0});
		}

		// console.log(responseGlobal.response.data);
		// console.log(responsePosts.response.data);
		// console.log(responseTags.response.data);
		// console.log(responseAuthors.response.data);

		// console.log('client dataCache', dataCache);
		
		if (!dataCache.responseGlobal || !dataCache.responsePosts || !dataCache.responseTags || !dataCache.responseAuthors) {
			return { redirect: '/error' };
		}

		const
			glogalData = dataCache.responseGlobal.response.data,
			curPage = glogalData.globals.pages.home,
			
			postsData = {
				posts: dataCache.responsePosts.response.data,
				tags: dataCache.responseTags.response.data.tag_data,
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
					authors: dataCache.responseAuthors.response.data,
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
