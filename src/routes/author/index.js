import React from 'react';
import Layout from '../../components/Layout';
import List from '../../components/List';
import request from '../../core/request';
import {sortMetatags} from '../../core/sortMetatags';

export default {

	path: '/author/:alias',

	async action(args) {
		const 
			responseGlobal = await request('getBlogObjects'),
			responsePosts = await request('getAuthorByAlias', {'authorAlias': args.params.alias, 'getFullArticles': 1}, args.params.alias),
			responseAuthors = await request('getAuthorByAlias', {'authorAlias': 'all-authors', 'getFullArticles': 0}, 'all-authors');
		
		if (!responseGlobal || !responsePosts || !responseAuthors) {
			return { redirect: '/error' };
		}
		
		const 
			glogalData = responseGlobal.response.data,
			curAuthor = responsePosts.response.data[0],
			
			postsData = {
				posts: curAuthor.author_articles,
				pager: false
			},
			
			pageData = {
				title: curAuthor.author_alias,
				desc: curAuthor.author_description,
				contacts: curAuthor.contact_json,
				bg: curAuthor.header_picture,
				footer: {
					footerText: glogalData.globals.footer_text,
					soc: glogalData.social
				},
				nav: {
					menu: glogalData.globals.nav_items,
					logo: glogalData.globals.site_title
				},
				back: true,
				leftNav: {
					soc: glogalData.social,
					authors: responseAuthors.response.data,
					similar: false
				}
			};

		return {
			meta: sortMetatags(curAuthor.author_meta),
			title: curAuthor.author_alias,
			component: <Layout data={pageData} ><List data={postsData} /></Layout>,
		};
	},

};
