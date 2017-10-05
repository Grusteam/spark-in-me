import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';
import cx from 'classnames';
import Link from '../Link';
import Subscribe from '../Subscribe';

class Footer extends React.Component {
	render() {
		return (
			<footer className={s.root}>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
							<ul className="list-inline text-center">
								{this.props.data ? Object.keys(this.props.data.soc).map((key) => {
  									let item = this.props.data.soc[key];
  									return <li key={item.key}>
											<a href={item.value} target="_blank">
												<span className="fa-stack fa-lg">
													<i className="fa fa-circle fa-stack-2x"></i>
													<i className={cx('fa', 'fa-' + item.key, 'fa-stack-1x', 'fa-inverse')}></i>
												</span>
											</a>
										</li>
  								}): false}
							</ul>
							
							<Subscribe />
							 
							<p className="copyright text-muted">{this.props.data ? this.props.data.footerText.value: false}</p>
						</div>
					</div>
				</div>
			</footer>
		);
	}
}

export default withStyles(s)(Footer);
