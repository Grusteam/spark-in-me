import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.css';
import Link from '../Link';
import Pager from '../Pager';
import { groupBy } from '../../core/groupBy';

class Tag extends React.Component {
	render() {
		const item = this.props.item;

		return (
			<div className={s.tagsItem}>
				<Link to={'/tag/' + item.tag_alias} className={s.tagsLink}>{item.tag_title}</Link>
				<span className={s.tagsCount}>{item.article_count}</span>
			</div>
		);
	}
}

class TagPanel extends React.Component {
	render() {
		const tags = this.props.tags;
		const color = this.props.color;
		const header = this.props.header;

		tags.sort((a, b) => {
			if (a['article_count'] < b['article_count']) return 1;
			if (a['article_count'] > b['article_count']) return -1;
			return 0;
		});

		return (
			<div className={s.bsCallout} style={{'color': color, 'borderLeftColor': color}}>
				<h4>{header}</h4>
				<div className="tags">
					{tags.map((item) => {
						return <Tag key={item.tag_id} item={item} />
					})}
				</div>
			</div>
		);
	}
}

class Announcement extends React.Component {
	render() {
		const item = this.props.item;

		return (
			<div className={s.post} data-id={item.article_id}>
				<a href={item.main_picture} target="_blank"><span className={s.postImg}><img src={item.feed_picture} alt="" /></span></a>
				<Link to={'/post/' + item.slug}>
					<h2 className={s.postTitle} >{item.title}</h2>
					<h3 className={s.postSubtitle}  >{item.subtitle}</h3>
				</Link>
				<p className={s.postMeta} >Posted&nbsp;by&nbsp;
				{item.author_info ? item.author_info.map((author) => {
					return <Link to={'/author/' + author.author_alias} key={author.author_id} >{author.author_alias}&nbsp;</Link>
				}): false}
				on {item.published}</p>
				<div className={s.postTags} >
					{item.article_tags ? item.article_tags.map((tag) => {
						return <Link key={tag.tag_id} className={s.postTag} to={'/tag/' + tag.tag_alias} >
							<i className="fa fa-tag" aria-hidden="true"></i>{tag.tag_title}
						</Link>
					}) : false}
				</div>
			</div>
		);
	}
}

let chunk = [];

class List extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			chunkStep: 10,
			chunkLength: 10,
			pager: true
		};

		this.updateChunkLength = this.updateChunkLength.bind(this);
	}

	componentWillMount() {
 		this.checkPager();
	}

	componentWillReceiveProps() {
		this.setState({
			chunkStep: 10,
			chunkLength: 10
		});

		this.checkPager();
	}

	checkPager() {
		if (this.state.chunkLength >= this.props.data.posts.length) {
			this.setState({
				pager: false
			});
		} else {
			this.setState({
				pager: true
			});
		}
	}

	createChunk() {
		chunk = this.props.data.posts.slice(0, this.state.chunkLength);
	}

	updateChunkLength() {
		this.setState({
			chunkLength: this.state.chunkLength + this.state.chunkStep
		});

		if (this.state.chunkLength + this.state.chunkStep >= this.props.data.posts.length) {
			this.setState({
				pager: false
			});
		}
	}

	formatDate() {
		const monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		this.props.data.posts.map((item) => {
			let d = new Date(item.published ? item.published : item.publish_time);
			item.published = monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
		});
	}

	checkTags() {
		if (this.props.data.tagsList && this.props.data.tags.length > 0) {
			this.props.data.tagsList = true;
		} else {
			this.props.data.tagsList = false;
		}
	}

	render() {
		this.createChunk();

		if (this.state.chunkLength >= this.props.data.posts.length) {
				this.state.pager = false;
		} else {
				this.state.pager = true;
		}

		const tags = groupBy(this.props.data.tags || [], 'att_title');
		const grouped_tags = Object.keys(tags).map((key) => {
			return {
				title: key,
				tags: tags[key],
				key: Math.random(),
				color: tags[key][0]['att_colour'] || '#777'
			};
		}).sort((a, b) => {
			if (!a['tags'] && !b['tags']) return 0;
			if (!a['tags'] || a['tags'].length === 0) return 1;
			if (!b['tags'] || b['tags'].length === 0) return -1;
			if (a['tags'][0]['att_sort_order'] < b['tags'][0]['att_sort_order']) return 1;
			if (a['tags'][0]['att_sort_order'] > b['tags'][0]['att_sort_order']) return -1;
			return 0;
		});

		this.formatDate();
		this.checkTags();

		return (
			<div className={s.root}>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">

							<div className={s.tags}>
								{grouped_tags.map((gg) => {
									return <TagPanel key={gg.key} color={gg.color} header={gg.title} tags={gg.tags} />
								})}
							</div>

							{chunk.map((item) => {
								if (item.article_id )
								return <Announcement item={item} key={item.article_id + Math.random()} />
							})}

							<Pager vis={this.state.pager} handler={this.updateChunkLength}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(s)(List);
