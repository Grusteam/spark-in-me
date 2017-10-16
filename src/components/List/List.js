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
	// shouldComponentUpdate (nextProps, nextState) {
	// 	return false;
	// }

	render() {
		const
			{item, position} = this.props;

		return (
			<div className={s.post} data-position={position} data-bulk={item.posInBulk} data-id={item.article_id}>
				<span className={s.postImg}>
					<a href={item.main_picture} target="_blank"><img height="300" width="auto" src={item.feed_picture} alt="" /></a>
				</span>
				<Link to={'/post/' + item.slug}>
					<h2 className={s.postTitle} >{/*1 + +item.posInBulk*/item.title}</h2>
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

		// console.log('this.props.data.posts', this.props.data.posts);

		this.sliderHeight = 250;
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

		window.addEventListener('mousedown', () => {
			this.preventor = true;
		});

		window.addEventListener('mouseup', () => {
			this.preventor = false;
		});
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.scrollAction);
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
			weOnBegin = val < 4,
			feedStartPosition = weOnBegin ? 0 : val - 4,
			feedEndPosition = feedStartPosition + 9 <= this.articlesCount ? feedStartPosition + 9 : this.articlesCount;

		chunk = this.articles.slice(feedStartPosition, feedEndPosition);
	
		this.setState({
			feedStartPosition,
			feedEndPosition,
		});

		const
			{ articlesContainer } = this.refs,
			allArticles = articlesContainer.childNodes;

		if (allArticles.length > 0) {
			const
				target = weOnBegin ? allArticles[val] : allArticles[4],
				size = target.getBoundingClientRect();
	
			window.scrollTo(0, window.pageYOffset + size.top);
		}
	}

	scrollAction(e) {
		const
			{ articlesContainer } = this.refs,
			sizes = articlesContainer.getBoundingClientRect(),
			allArticles = articlesContainer.childNodes;

		if (allArticles.length > 0) {
			const
				oldShift = window.pageYOffset,
				nearBoundry = 500,
				screenSize = window.innerHeight,
				nearToTop = sizes.top > -nearBoundry,
				nearToEnd = sizes.top < 0 && -sizes.top > sizes.height - screenSize - nearBoundry;

			let indexOnTopArticle;

			for (var i = 0; i < allArticles.length; i++) {

				const
					elSize = allArticles[i].getBoundingClientRect();

				if (elSize.top + elSize.height > 0 ) {
					indexOnTopArticle = i;
					break;
				}

				if (i == allArticles.length - 1) {
					indexOnTopArticle = allArticles.length - 1;
				}
			}

			const
				articleOnTop = allArticles[indexOnTopArticle] || bottomArticle,
				bulkPos = +articleOnTop.dataset.bulk,
				topArticle = allArticles[0],
				bottomArticle = allArticles[allArticles.length - 1],
				{range} = this.refs;

			nearToTop && !this.preventor && this.upScroll(sizes.height, oldShift);
			nearToEnd && !this.preventor && this.downScroll();

			if (range.value != bulkPos) {
				this.setState({
					pagerExpressValue: bulkPos
				})
			}

			range.value =  bulkPos;
		}
	}

	upScroll(oldHeight, oldShift) {
		const
			{feedStartPosition, feedEndPosition} = this.state,
			newFeedStartPosition = feedStartPosition - 10 >= 0 ? feedStartPosition - 10 : 0;

		if (feedStartPosition > 0) {
			this.preventor = true;

			chunk = this.articles.slice(newFeedStartPosition, feedEndPosition);

			if (feedStartPosition != newFeedStartPosition) {
				this.setState({
					feedStartPosition: newFeedStartPosition,
				}, () => {
					const
						{ articlesContainer } = this.refs,
						sizes = articlesContainer.getBoundingClientRect(),
						diff = sizes.height - oldHeight;
						
					window.scrollTo(0, oldShift  + diff);
				})
			}

			setTimeout(() => {
				this.preventor = false;
			}, 1000);
		}
	}

	downScroll() {
		const
			{feedStartPosition, feedEndPosition} = this.state,
			newFeedEndPosition = feedEndPosition + 10 < this.articlesCount ? feedEndPosition + 10 : this.articlesCount;
		
		if (feedEndPosition < this.articlesCount) {
			chunk = this.articles.slice(feedStartPosition, newFeedEndPosition);
		}

		if (feedEndPosition != newFeedEndPosition) {
			this.setState({
				feedEndPosition: newFeedEndPosition,
			})
		}
	}

	getArticleDate(pos) {
		const
			months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			{pagerExpressValue} = this.state,
			str = this.articles[pos].published,
			dateObj = new Date(str),
			month = months[dateObj.getMonth()],
			date = dateObj.getDate(),
			answer = month + ' ' + date;

		return answer;
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
			shiftValue = 40;

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

		// console.log('render');

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
									ref="range"
									type="range"
									min="0"
									style={{width: this.sliderHeight}}
									max={this.articlesCount - 1}
									value={pagerExpressValue}
									onChange={this.handlePagerInputChange}
									onMouseUp={this.handlePagerInputRelease}
								/>
								
								<div className={s.slider__container} style={{top: ((this.sliderHeight - shiftValue) * pagerExpressValue / this.articlesCount)}}>
									<div className={s.slider__info}>
										<div className={s.slider__value} >{(+pagerExpressValue + 1) + ' / ' + this.articlesCount}</div>
										<div className={s['slider__date-text']} >{this.getArticleDate(+pagerExpressValue)}</div>
									</div>
								</div>
								
								<div className={cx(s['slider__date'], s['slider__date--top'])}>{this.getArticleDate(0)}</div>
								<div className={cx(s['slider__date'], s['slider__date--bottom'])}>{this.getArticleDate(this.articlesCount - 1)}</div>
							</div>

							<div ref="articlesContainer" className={s.articles}>
								{chunk.map((item, i) => {
									if (item.article_id )
									return <Announcement position={i} item={item} key={i} />
								})}
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(s)(List);