import React, { PropTypes } from 'react';
import serialize from 'serialize-javascript';
import { analytics } from '../config';

let flagJSON = true;

class Html extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		meta: PropTypes.array.isRequired,
		styles: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			cssText: PropTypes.string.isRequired,
		}).isRequired),
		scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
		// eslint-disable-next-line react/forbid-prop-types
		state: PropTypes.object,
		children: PropTypes.string.isRequired
	};

	static defaultProps = {
		styles: [],
		scripts: [],
		state: null,
	};
	
	render() {
		const { title, styles, scripts, meta = false, state, children, dataCache} = this.props;

		// console.log('html dataCache', dataCache);
		
		return (
			<html className="no-js" lang="ru" prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#" xmlLang="ru">
				<head>
					<title>{title}</title>
					<meta charSet="utf-8" />
					<meta httpEquiv="x-ua-compatible" content="ie=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					{meta}
					<meta name="google-site-verification" content="kyVvfikILQYoZizHrpyB6nExG8uWrO-ZdUOew1QVh28"/>

					{
					    <script
					        type="application/ld+json"
					        // eslint-disable-next-line react/no-danger
					        dangerouslySetInnerHTML={{ __html:
					            "{" +
					            `"@context": "http://schema.org",` +
					            `"@type": "Organization",` +
					            `"url": "http://spark-in.me",` +
					            `"logo": "http://spark-in.me/apple-touch-icon.png"` +
					            "}" }}
					    />
					}

					{
					    <script
					        type="application/ld+json"
					        // eslint-disable-next-line react/no-danger
					        dangerouslySetInnerHTML={{ __html:
					            "{" +
					            `"@context": "http://schema.org",` +
					            `"@type": "WebSite",` +
					            `"name": "Spark in me",` +
					            `"alternateName": "All these things will be lost like tears in rain",` +					            
					            `"url": "http://spark-in.me"` +
					            "}" }}
					    />

					}


					<link rel="apple-touch-icon" href="apple-touch-icon.png" />
					<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic"/>
					<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800"/>
					
					<link rel="stylesheet" href="/styles/bootstrap.min.css" />
					<link rel="stylesheet" href="/styles/font-awesome.css" />
					<link rel="stylesheet" href="/styles/fa-viber.css" />
					<link rel="stylesheet" href="/styles/clean-blog.css" />
					<link rel="stylesheet" href="/highlight.css" /> 
					
					{styles.map(style =>
						<style
							key={style.id}
							id={style.id}
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{ __html: style.cssText }}
						/>,
					)}
				</head>
				<body>
					<div
						id="app"
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{ __html: children }}
					/>
					{state && (
						<script
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{ __html:
							`window.APP_STATE=${serialize(state, { isJSON: true })}` }}
						/>
					)}
					<script
						dangerouslySetInnerHTML={{ __html:
						`window.APP_CACHE=${serialize(dataCache)}` }}
					/>
					{scripts.map(script => <script key={script} src={script} />)}
					{analytics.google.trackingId &&
						<script
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{ __html:
							'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
							`ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
						/>
					}
					{analytics.google.trackingId &&
						<script src="https://www.google-analytics.com/analytics.js" async defer />
					}
				</body>
			</html>
		);
	}
}

export default Html;
