import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LeftControl.css';
import cx from 'classnames';
import Link from '../Link';
import Subscribe from '../Subscribe';

class LeftControl extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authors: false,
			similar: false,
			leftMenu: false
		};
		
		this.toggleAuthors = this.toggleAuthors.bind(this);
		this.toggleSimilar = this.toggleSimilar.bind(this);
		this.scrollUp = this.scrollUp.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
	}
	
	scrollUp() {
		window.scrollTo(0, 0);
	}
	
	toggleAuthors(e) {
		this.setState({
			authors: !this.state.authors
		});
		
		e.preventDefault();
	}
	
	toggleSimilar(e) {
		this.setState({
			similar: !this.state.similar
		});
		
		e.preventDefault();
	}
	
	componentWillUpdate() {
		this.state.authors = false;
		this.state.similar = false;
	}
	
	checkAuthors(data) {
		if (data && data.authors && data.authors.length > 0) {
			let popular = data.authors.slice(0,5);
		
			function calcArticles(a, b) {
				if (a.article_count > b.article_count) return -1;
	  			if (a.article_count < b.article_count) return 1;
			}
			
			return popular.sort(calcArticles);
		} else {
			return false;
		}
	}
	
	checkSimilar(data) {
		if (data && data.similar && data.similarList && data.similarList.length > 0) {
			let similar = data.similarList.slice(0,5);
		
			function calcArticles(a, b) {
				if (a.similarity > b.similarity) return -1;
	  			if (a.similarity < b.similarity) return 1;
			}
			
			return similar.sort(calcArticles);
		} else {
			return false;
		}
	}
	
	handleScroll(event) {
		
		if (window.pageYOffset > 0) {
			this.setState({
				leftMenu: true
			});
			
			if (this.state.scrollPos < window.pageYOffset) {
				this.setState({
					leftMenu: false
				});
			} else {
				this.setState({
					leftMenu: true
				});
			}
			
		} else {
			this.setState({
				leftMenu: false
			});
		}
		
		this.setState({
			scrollPos: window.pageYOffset
		});
		
    }
	
	componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
	
	render() {
		const 
			popular = this.checkAuthors(this.props.data),
			similar = this.checkSimilar(this.props.data);
			
		return (
			<ul className={cx(s.root, s.leftControl, {[`${s.leftControlVis}`]: this.state.leftMenu})}>
				<li className={cx(s.leftControlItem)}>
					<button type="button" onClick={this.scrollUp} className={cx(s.leftControlLink, s.leftControlUp)}><i className={cx('fa', 'fa-arrow-up')} aria-hidden="true"></i></button>
				</li>
				<li className={cx(s.leftControlItem)}>
					<a className={cx(s.leftControlLink)} href={this.props.data ? this.props.data.soc.telegram.value: false} target="_blank"><i className={cx('fa', 'fa-telegram')}></i></a>
				</li>
				<li className={cx(s.leftControlItem)}>
					<a className={cx(s.leftControlLink)} href="http://spark-in.me/main.rss" target="_blank"><i className={cx('fa', 'fa-rss')} aria-hidden="true"></i></a>
				</li>				
				<li className={cx(s.leftControlItem)}>
					<a className={cx(s.leftControlLink)} href="https://tinyletter.com/snakers41" target="_blank"><i className={cx('fa', 'fa-envelope')} aria-hidden="true"></i></a>
				</li>
				<li className={cx(s.leftControlItem)}>
					<button type="button" className={cx(s.leftControlLink)} onClick={this.toggleAuthors}><i className={cx('fa', 'fa-user')} aria-hidden="true"></i></button>
					<ul className={cx(s.popularAuthors, {[`${s.popularAuthorsVis}`]: this.state.authors})}>
						{popular ? popular.map((item) => {
							return <li key={item.author_alias} className={cx(s.popularAuthorsItem)}>
								<Link to={'/author/' + item.author_alias} className={cx(s.popularAuthorsLink)}>
									<i className={cx('fa', 'fa-user')} aria-hidden="true"></i>
									<span className={cx(s.popularAuthorsName)}>{item.author_alias}</span>
									<span className={cx(s.popularAuthorsCount)}><i className={cx('fa', 'fa-file-text-o')} aria-hidden="true"></i>{item.article_count}</span>
								</Link>
							</li>}): false}
					</ul>
				</li>
				{similar ? <li className={cx(s.leftControlItem)}>
					<button type="button" className={cx(s.leftControlLink)} onClick={this.toggleSimilar}><i className={cx('fa', 'fa-file-text-o')} aria-hidden="true"></i></button>
					<ul className={cx(s.popularAuthors, {[`${s.popularAuthorsVis}`]: this.state.similar})}>
						
						{similar.map((item) => {
							return <li key={item.article_id} className={cx(s.popularAuthorsItem)}>
								<Link to={'/post/' + item.article_alias} className={cx(s.popularAuthorsLink)}>
									<i className={cx('fa', 'fa-file-text-o')} aria-hidden="true"></i>
									<span className={cx(s.popularAuthorsName, s.popularAuthorsNameSimilar)}>{item.article_title}</span>
								</Link>
							</li>
						})}
					</ul>
				</li>: false}
			</ul>
		);
	}
}

export default withStyles(s)(LeftControl);
