import React from 'react';
class Plugins extends React.Component {
	
	render() {
		const 
        	script = `<script>
						/* Insert code here */
						function test() {
							console.info('External scripts starting');
						}
						
						test();
					</script>`;
		
		return (
			<div dangerouslySetInnerHTML={{ __html: script}} />
		);
	}
}

export default Plugins;
