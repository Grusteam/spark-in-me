import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import Navigation from '../Navigation';
import LeftControl from '../LeftControl';
import Header from '../Header';
import Footer from '../Footer';
import Back from '../Back';
import Plugins from '../Plugins';


class Layout extends React.Component {
	
	
	render() {
		console.log('Layout render');
		// console.log('Layout data', this.props.data);
		return (<div>
				{this.props.data.ldjson ? <script type="application/ld+json"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{ __html: this.props.data.ldjson }}
				/>: false}
				{this.props.data.breadcrumbs ? <script type="application/ld+json"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{ __html: this.props.data.breadcrumbs }}
				/>: false}				
				<LeftControl data={this.props.data.leftNav}/>
				<Navigation data={this.props.data.nav}/>
				<Header data={this.props.data} />
				{this.props.data.back ? <Back /> : false}
				{this.props.children}
				<Footer data={this.props.data.footer}/>
				<Plugins />
			</div>);
	}
}

export default withStyles(s)(Layout);
