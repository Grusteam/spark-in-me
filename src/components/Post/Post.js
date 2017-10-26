import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Post.css';
import Link from '../Link';
import Disqus from '../Disqus';

class Post extends React.Component {

	componentDidMount() {
		this.highlightCode();
	}

	componentDidUpdate() {
		this.highlightCode();
	}

	highlightCode() {
		const domNode = ReactDOM.findDOMNode(this);
		const nodes = domNode.querySelectorAll('pre code');
		let i;
		for (i = 0; i < nodes.length; i++) {
			hljs.highlightBlock(nodes[i]);
		}
	}

	render() {
		const 
			html = this.props.content.content,
			tags = this.props.content.tags,
			disqusData = {
				alias: this.props.content.alias,
				disqusUrl: this.props.content.disqusUrl
			},
			re1 = /<pre[^\>]*>/gi,
			re2 = /<\/pre>/gi,
			output = html.replace(re1, '<pre><code>').replace(re2, '</code></pre>');

			// console.log('html', html);
			// console.log('output', output);


		return (
			<article>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
							<div dangerouslySetInnerHTML={{ __html: output }} />
							
							<div className={s.tags}>
								{tags ? tags.map((item) => { 
									return <Link key={item.tag_id} className={s.postTag} to={'/tag/' + item.tag_alias} >
										<i className="fa fa-tag" aria-hidden="true"></i>{item.tag_title}
									</Link>
								}) : false}
							</div>
							
							<Disqus data={disqusData}/>
						</div>
					</div>
				</div>
			</article>
		);
	}
}

export default withStyles(s)(Post);
