import React from 'react';
import ReactDOM from 'react-dom'
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import request from '../../core/request';

class Navigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dropMenu: false,
			fixedMenu: false,
			scrollDown: true,
			search: false,
			dropVis: false,
			value: '',
			drop: []
		};
		
		this.handleClick = this.handleClick.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleScroll(event) {
		
		if (window.pageYOffset > 0) {
			this.setState({
				fixedMenu: true,
			});
			
			if (this.state.scrollPos < window.pageYOffset) {
				this.setState({
					scrollDown: true,
					search: false,
					dropVis: false,
					value: ''
				});
			} else {
				this.setState({
					scrollDown: false
				});
			}
			
		} else {
			this.setState({
				fixedMenu: false,
				scrollDown: true
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
	
	handleClick(event) {
		this.setState({dropMenu: !this.state.dropMenu});
		
		event.preventDefault();
	}
	
	handleClickSearch(event) {
		this.setState({
			dropVis: false,
			dropMenu: false,
			value: '',
			search: !this.state.search
		});
	}
	
	handleClickLink(event) {
		this.setState({
			dropVis: false,
			dropMenu: false,
			value: '',
			search: false
		});
	}
	
	async handleChange(event) {
		let queryResponse;

		this.setState({value: event.target.value});
		
		if (event.target.value.length >= 3) {
			queryResponse = await request('getBlogSearch', {'queryString': this.state.value});
			
			if (queryResponse.response.data) {
				queryResponse.response.data.map((item) => {
					if (item.object_type == 'tag') {
						item.icon = 'tag';
						item.localUrl = 'tag';
					} else if (item.object_type == 'author') {
						item.icon = 'user';
						item.localUrl = 'author';
					} else {
						item.icon = 'file-text-o';
						item.localUrl = 'post';
					}
				})
				
				this.setState({
					drop: queryResponse.response.data,
					dropVis: true
				});
			}
		} else {
			this.setState({
				dropVis: false,
				drop: []
			});
		}
	}
	
	render() {
		return (
			<nav className={cx(s.root, 'navbar', 'navbar-default', 'navbar-custom', 'navbar-fixed-top', {'is-fixed': this.state.fixedMenu}, {'is-visible': !this.state.scrollDown}, !this.state.scrollDown ? s.navFixed: '')}>
				<div className="container-fluid">
					<div className="navbar-header page-scroll">
						<button type="button" onClick={this.handleClick} className={cx('navbar-toggle', {'collapsed': this.state.dropMenu})}>
							<span className="sr-only">Toggle navigation</span>
							Menu <i className="fa fa-bars"></i>
						</button>
						<Link className="navbar-brand" to="/">{this.props.data ? this.props.data.logo.value: ''}</Link>
					</div>

					<div className={cx(s.navbarCollapse, 'collapse', 'navbar-collapse', this.state.dropMenu ? s.navbarCollapseActive: '')}>
						<ul className={cx('nav', 'navbar-nav', 'navbar-right', s.navbarNav)}>
							<li><button className={s.searchBtn} onClick={this.handleClickSearch.bind(this)}><i className={cx('fa', 'fa-search')} aria-hidden="true"></i></button></li>
							{this.props.data ? this.props.data.menu.map((item) => {
								return <li key={item.key}><Link className={s.link} to={item.value ? '/' + item.value: '/'} onClick={this.handleClickLink.bind(this)}>{item.title}</Link></li>
							}): false}
						</ul>
						
						<form className={cx('navbar-form', 'navbar-right', s.searchForm, this.state.search ? s.searchFormVisible: '')}>
							<div className={cx('form-group', s.searchWrapInput)}>
								<input type="text" className={cx('form-control', s.searchInput)} value={this.state.value} onChange={this.handleChange} placeholder="Поиск" />
							</div>
							<div className={cx('dropdown', {'open': this.state.dropVis}, s.searchDrop)}>
								<ul className={cx('dropdown-menu', s.searchDropList)}>
									{this.state.drop ? this.state.drop.map((item) => {
										return <li key={item.item_id}>
											<Link onClick={this.handleClickSearch.bind(this)} to={'/' + item.localUrl + '/' + item.item_alias} className={s.searchDropLink}>
												<i className={cx('fa', 'fa-' + item.icon)} aria-hidden="true" ></i>
												{item.item_title}
											</Link>
										</li>
									}): false}
								</ul>
							</div>
						</form>
					</div>
				</div>
			</nav>
		);
	}
}

export default withStyles(s)(Navigation);
