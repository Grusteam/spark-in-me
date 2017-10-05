import React from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Disqus.css';
import ReactDisqusComments from '../../../node_modules/react-disqus-comments';

class Disqus extends React.Component {
	handleNewComment(comment) {
		console.log(comment.text);
	}
	
	render() {
		const 
			alias = this.props.data.alias,
			disqusUrl = this.props.data.disqusUrl,
			disqus = `<div id="disqus_thread"></div>
				<script>
				/**
				*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
				*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
				/*
				var disqus_config = function () {
				this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
				this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
				};
				*/
				(function() { // DON'T EDIT BELOW THIS LINE
				var d = document, s = d.createElement('script');
				s.src = 'https://http-spark-in-me.disqus.com/embed.js';
				s.setAttribute('data-timestamp', +new Date());
				(d.head || d.body).appendChild(s);
				})();
				</script>
				<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>`;
		const props = {
			shortname: 'http-spark-in-me',
            identifier: alias,
            url: disqusUrl,
            onNewComment: this.handleNewComment
		}

		return (
			<ReactDisqusComments {...props} className={s.disqus}/>
		);
	}
}

export default withStyles(s)(Disqus);
