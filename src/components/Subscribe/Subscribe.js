import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Subscribe.css';

class Subscribe extends React.Component {
	render() {
		return (
			<div className={s.subscribe} dangerouslySetInnerHTML={{ __html: `
				<form style="border:0px solid #ccc;padding:3px;text-align:center;" action="https://tinyletter.com/snakers41" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/snakers41', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true"><p><label for="tlemail">Enter your email address</label></p><p><input type="text" style="width:240px" name="email" id="tlemail" /></p><input type="hidden" value="1" name="embed"/><input type="submit" value="Subscribe"/></form>	
			` }} />
		);
	}
}

export default withStyles(s)(Subscribe);
