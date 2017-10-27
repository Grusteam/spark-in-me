import React from 'react';
import Layout from '../../components/Layout';
import List from '../../components/List';
import request from '../../core/request';
import {sortMetatags} from '../../core/sortMetatags';

export default {

	path: '/tag/:alias',

	async action({params, dataCache}) {

		if (dataCache.requests != 1) {
			dataCache.responseGlobal = await request('getBlogObjects'),
			dataCache.responsePosts = await request('getTagByAlias', {'targetId': 2, 'tagAlias': params.alias, 'getFullArticles': 1}, params.alias),
			dataCache.responseAuthors = await request('getAuthorByAlias', {'authorAlias': 'all-authors', 'getFullArticles': 0}),
			dataCache.responseTags = await request('getTagInfo', {'targetId': 2, 'tagId': 0, 'getFullArticles' : 1});
		}

		dataCache.requests++;

		if (!dataCache.responseGlobal || !dataCache.responsePosts || !dataCache.responseTags || !dataCache.responsePosts.response.data.tag_data) {

			return { redirect: '/error' };
		}
		
		const
			glogalData = dataCache.responseGlobal.response.data,
			tagData = dataCache.responsePosts.response.data.tag_data[0];

		const
			posts = tagData.article_list;

		posts.sort((a, b) => {
				let a_date = Date.parse(a['published']);
				let b_date = Date.parse(b['published']);
				if (a_date > b_date) return -1;
				if (b_date > a_date) return 1;
				return 0;
		});

		const
			postsData = {
				posts: posts,
				tagsList: true,
				tags: dataCache.responseTags.response.data.tag_data,
				pager: false
			},

			pageData = {
				title: tagData.tag_title,
				desc: tagData.tag_description,
				bg: tagData.main_picture,
				footer: {
					footerText: glogalData.globals.footer_text,
					soc: glogalData.social
				},
				nav: {
					menu: glogalData.globals.nav_items,
					logo: glogalData.globals.site_title
				},
				back: true,
				og: true,
				meta: tagData.tag_meta,
				leftNav: {
					soc: glogalData.social,
					authors: dataCache.responseAuthors.response.data,
					similar: false
				}
			};

		return {
			meta: sortMetatags(tagData.tag_meta),
			title: tagData.tag_title,
			component: <Layout data={pageData} ><List data={postsData} doScroll={true}/></Layout>,
		};
	}

};
