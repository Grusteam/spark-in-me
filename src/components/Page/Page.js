import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Page.css';

class Page extends React.Component {
	render() {
		const html = this.props.content;

		return (
			<div className={s.root}>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
							<div dangerouslySetInnerHTML={{ __html: html }} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(s)(Page);
