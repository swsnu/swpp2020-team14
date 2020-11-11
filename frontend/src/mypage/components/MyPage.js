import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import ArticleList from '../../article/components/ArticleList';
import PhotoList from '../../photo/components/PhotoList';


class MyPage extends Component {
	render() {
		return <div className="my-page">

			<button onClick={() => {
				this.props.history.push(`/my-page/photo/`);
			}}>photo</button>
			<div className="articles">
				<ArticleList fetchEndpoint="/api/my-page/article" />
			</div>
			<button className="photo" onClick={
				() => this.props.history.push('/my-page/photo')
			}>Photo</button>
			<div className="photos">
				<PhotoList fetchEndpoint="/api/my-page/photo" isUploadAvailabe={true} isDeleteAvailabe={true}/>
			</div>
		</div>
	}
};

export default withRouter(MyPage);

