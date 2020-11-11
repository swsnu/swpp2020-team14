import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import ArticleList from '../../article/components/ArticleList';
import PhotoList from '../../photo/components/PhotoList';


class MyPage extends Component {
	render() {
		return <div className="my-page">

			<button className="Photo" onClick={() => {
				this.props.history.push(`/my-page/photo/`);
			}}>photo</button>
			<div className="articles">
				<ArticleList fetchEndpoint="/api/my-page/article" />
			</div>
			<div className="photos">
				<PhotoList fetchEndpoint="/api/my-page/photo" isUploadAvailabe={true} isDeleteAvailabe={true}/>
			</div>
		</div>
	}
};

export default withRouter(MyPage);

