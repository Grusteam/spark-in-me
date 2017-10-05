import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';

class Header extends React.Component {
	formatDate(date) {
		const monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];
		
		let d = new Date(date);
		return monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
	}
	
	getHeader(url) {
		
		const 
			date = this.props.data.dateP ? this.formatDate(this.props.data.dateP) : false;
		
		
		const
			type = this.props.data.post,
			{title, desc, subtitle, authors, bg, contacts, dateP, dateM, dateE} = this.props.data;
		
		const
			post = <div className="post-heading">
						<h1>{title}</h1>
						<h2 className="subheading">{subtitle}</h2>
						<span className="meta">Posted by&nbsp;
						{authors ? authors.map((author) => {
							return <Link to={'/author/' + author.author_alias} key={author.author_id} >{author.author_alias}</Link>
						}): false}
						&nbsp;on {date}</span>
					</div>,
					
			site = <div className="site-heading">
						<h1>{title}</h1>
						{desc ? <hr className="small"></hr> : false}
						<span className="subheading">
							{desc ? desc : false}
							
							<ul className={cx('list-inline', 'text-center', s.socAuthor)}>
								{contacts ? Object.keys(contacts).map((key,val) => {
  									return <li key={key}>
											<a href={contacts[key]} target="_blank">
												<span className="fa-stack fa-lg">
													<i className="fa fa-circle fa-stack-2x"></i>
													<i className={cx('fa', 'fa-' + key, 'fa-stack-1x', 'fa-inverse')}></i>
												</span>
											</a>
										</li>
  								}): false}
							</ul>
						</span>
					</div>;
					
		return (
			<header className={cx(s.root, 'intro-header', this.props.data.error ? s.headError: '')}>
				<div className="container">
					<div className={type ? s.headPostImg : s.headSiteImg} style={{backgroundImage: 'url(' + bg + ')'}}></div>
					<div className="row">
						<div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
							{type ? post : site}
						</div>
					</div>
				</div>
			</header>
		);
	}
	
	render() {
		
		return this.getHeader('url');
	}
}

export default withStyles(s)(Header);
