import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.css';
import Link from '../Link';
import Pager from '../Pager';
import { groupBy } from '../../core/groupBy';
import _ from 'lodash';

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
		const
			{item, position} = this.props;

		return (
			<div className={s.post} data-position={position} data-bulk={item.posInBulk} data-id={item.article_id}>
				<a href={item.main_picture} target="_blank"><span className={s.postImg}><img src={item.feed_picture} alt="" /></span></a>
				<Link to={'/post/' + item.slug}>
					<h2 className={s.postTitle} >{1 + +item.posInBulk/*item.title*/}</h2>
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

		this.sliderHeight = 200;
		this.articles = this.props.data.posts;
		this.articlesCount = this.articles.length;

		_.forEach(this.articles, function(o, i) {
			o.posInBulk = i;
		});

		this.state = {
			chunkStep: 10,
			chunkLength: 10,
			pager: true,
			pagerExpressValue: 0,
			feedStartPosition: 0,
			feedEndPosition: 10,
		};

		this.updateChunkLength = this.updateChunkLength.bind(this);
		this.handlePagerInputChange = this.handlePagerInputChange.bind(this);
		this.handlePagerInputRelease = this.handlePagerInputRelease.bind(this);
		this.scrollAction = this.scrollAction.bind(this);
	}

	componentWillMount() {
 		this.checkPager();
 		this.createChunk();
	}

	componentWillReceiveProps() {
		this.setState({
			chunkStep: 10,
			chunkLength: 10
		});

		this.checkPager();
	}

	componentDidMount() {
		window.addEventListener('scroll', this.scrollAction);
	}

	checkPager() {
		if (this.state.chunkLength >= this.articlesCount) {
			this.setState({
				pager: false
			});
		} else {
			this.setState({
				pager: true
			});
		}
	}

	updateChunkLength() {
		this.setState({
			chunkLength: this.state.chunkLength + this.state.chunkStep
		});

		if (this.state.chunkLength + this.state.chunkStep >= this.articlesCount) {
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

		this.articles.map((item) => {
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

	createChunk() {
		// chunk = this.articles.slice(this.state.chunkLength - 10, this.state.chunkLength);
		const {feedStartPosition, feedEndPosition} = this.state;
		chunk = this.articles.slice(feedStartPosition, feedEndPosition);
	}

	handlePagerInputChange(e) {
		const
			domEl = e.target,
			val = domEl.value,
			bank = val % 10;

		this.setState({
			pagerExpressValue: val,
		});

	}

	handlePagerInputRelease(e) {
		const
			domEl = e.target,
			val = +domEl.value,
			feedStartPosition = val - 4 >= 0 ? val - 4 : 0,
			feedEndPosition = feedStartPosition + 9 <= this.articlesCount ? feedStartPosition + 9 : this.articlesCount;

		chunk = this.articles.slice(feedStartPosition, feedEndPosition);
	
		this.setState({
			feedStartPosition,
			feedEndPosition,
		});

		setTimeout(() => {
			const
				{ articlesContainer } = this.refs,
				allArticles = articlesContainer.childNodes,
				target = allArticles[4],
				size = target.getBoundingClientRect();


			window.scrollTo(0, window.pageYOffset + size.top);
		}, 0);
	}

	scrollAction(e) {
		const
			{ articlesContainer } = this.refs,
			sizes = articlesContainer.getBoundingClientRect(),
			allArticles = articlesContainer.childNodes,
			nearBoundry = 300,
			screenSize = window.innerHeight,
			nearToTop = sizes.top < 0 && -sizes.top < nearBoundry,
			nearToEnd = sizes.top < 0 && -sizes.top > sizes.height - screenSize - nearBoundry;

		// console.log('sizes', sizes);

		let indexOnTopArticle;
		for (var i = 0; i < allArticles.length; i++) {

			const
				elSize = allArticles[i].getBoundingClientRect();

			if (elSize.top + elSize.height > 0) {
				indexOnTopArticle = i;
				break;
			}
		}

		const
			articleOnTop = allArticles[indexOnTopArticle] || bottomArticle,
			bulkPos = +articleOnTop.dataset.bulk,
			topArticle = allArticles[0],
			bottomArticle = allArticles[allArticles.length - 1];

		// nearToTop && console.log('nearToTop');
		nearToTop && this.upScroll(bulkPos);
		nearToEnd && this.downScroll();
		// console.log('articleOnTop', articleOnTop);
		// console.log('indexOnTopArticle', indexOnTopArticle);
		// console.log('bulkPos', bulkPos);

		this.setState({
			pagerExpressValue: bulkPos
		});
	}

	upScroll(bulkPos) {
		const
			{feedStartPosition, feedEndPosition} = this.state,
			newFeedStartPosition = feedStartPosition - 10 >= 0 ? feedStartPosition - 10 : 0;

		if (feedStartPosition > 0) {
			chunk = this.articles.slice(newFeedStartPosition, feedEndPosition);

			this.setState({
				feedStartPosition: newFeedStartPosition,
			});

			setTimeout(() => {
				const
					{ articlesContainer } = this.refs,
					allArticles = articlesContainer.childNodes,
					target = _.find(allArticles, function(o) { return o.dataset.bulk == bulkPos; }),
					size = target.getBoundingClientRect();

				console.log('target', target, size.top);
				console.log('bulkPos', bulkPos);
				console.log('window.offsetTop, size.top', window.pageYOffset, size.top);

				window.scrollTo(0, window.pageYOffset + size.top - size.height);
			}, 0);
		}
	}

	downScroll() {
		const
			{feedStartPosition, feedEndPosition} = this.state,
			newFeedEndPosition = feedEndPosition + 10 < this.articlesCount ? feedEndPosition + 10 : this.articlesCount;
		
		if (feedEndPosition < this.articlesCount) {
			chunk = this.articles.slice(feedStartPosition, newFeedEndPosition);
		}

		this.setState({
			feedEndPosition: newFeedEndPosition,
		});
	}

	render() {

		if (this.state.chunkLength >= this.articlesCount) {
				this.state.pager = false;
		} else {
				this.state.pager = true;
		}

		const
			{ pagerExpressValue, chunkLength } = this.state,
			tags = groupBy(this.props.data.tags || [], 'att_title'),
			shiftValue = 10;

		const
			grouped_tags = Object.keys(tags).map((key) => {
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


							<div className={s.slider} style={{height: this.sliderHeight}}>
								<input
									type="range"
									min="0"
									max={this.articlesCount - 1}
									value={pagerExpressValue}
									onChange={this.handlePagerInputChange}
									onMouseUp={this.handlePagerInputRelease}
								/>
								<div className={s.slider__container}>
									<div className={s.slider__value} style={{top: ((this.sliderHeight - shiftValue) * pagerExpressValue / this.articlesCount)}}>
										{(+pagerExpressValue + 1) + '/' + this.articlesCount}
									</div>
								</div>
							</div>

							<div ref="articlesContainer" className={s.articles}>
								{chunk.map((item, i) => {
									if (item.article_id )
									return <Announcement position={i} item={item} key={i} />
								})}
							</div>

							{/*<Pager vis={this.state.pager} handler={this.updateChunkLength}/>*/}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(s)(List);
