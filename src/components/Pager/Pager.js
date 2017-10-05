import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Pager.css';
import Link from '../Link';

class Pager extends React.Component {
	render() {
		return (
			<ul className={cx('pager', s.pager)}>
				<li className={cx('next', s.pagerNext)}>
					<button type="button" className={cx('btn', s.pagerBtn, this.props.vis ? s.pagerBtnVis: false )} onClick={this.props.handler}>Older Posts &rarr;</button>
				</li>
			</ul>
		);
	}
}

export default withStyles(s)(Pager);
