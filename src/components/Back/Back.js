import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Back.css';
import Link from '../Link';
import history from '../../core/history';

class Back extends React.Component {
	handleClick() {
        history.goBack();
    }
	
	render() {
		return (
			<div className={s.root}>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
							<ul className={cx(s.pagerBack, 'pager')}>
								<li className="prev">
									<Link to="/" onClick={this.handleClick}>&larr; Back</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(s)(Back);
