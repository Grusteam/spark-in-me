import React from 'react';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import request from '../../core/request';
import {sortMetatags} from '../../core/sortMetatags';

export default {

	path: '/post/:alias',
	
	async action(args) {
		const 
			responseGlobal = await request('getBlogObjects'),
			responsePosts = await request('getArticleByAlias', {'articleAlias': args.params.alias}, args.params.alias),
			responseAuthors = await request('getAuthorByAlias', {'authorAlias': 'all-authors', 'getFullArticles': 0}),
			responseSimilar = await request('getSimilarArticlesByArticleAlias', {'articleAlias': args.params.alias});
			
		if (!responseGlobal || !responsePosts || !responsePosts.response.data || !responseAuthors || !responseSimilar) {
			return { redirect: '/error' };
		}
		
		const 
			glogalData = responseGlobal.response.data,
			curPage = glogalData.globals.pages.home,
			postContent = responsePosts.response.data[0],
			
			pageData = {
				title: postContent.title,
				subtitle: postContent.subtitle,
				bg: postContent.main_picture,
				footer: {
					footerText: glogalData.globals.footer_text,
					soc: glogalData.social
				},
				nav: {
					menu: glogalData.globals.nav_items,
					logo: glogalData.globals.site_title
				},
				authors: postContent.author_info,
				dateP: postContent.published,
				back: true,
				post: true,
				leftNav: {
					soc: glogalData.social,
					authors: responseAuthors.response.data,
					similar: true,
					similarList: responseSimilar.response.data
				},
				ldjson: JSON.stringify(postContent.ld_json),
				breadcrumbs: JSON.stringify(postContent.bread_crumbs)				
			},
			postContentInfo = {
				content: postContent.content, 
				tags: postContent.article_tags,
				alias: postContent.slug,
				disqusUrl: postContent.disqus_article_url
			};
		
		return {
			meta: sortMetatags(postContent.article_meta),
			title: postContent.title,
			component: <Layout data={pageData} ><Post content={postContentInfo}/></Layout>,
		};
	},

};
