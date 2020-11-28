import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ArticleList from '../../article/components/ArticleList';
import PhotoList from '../../photo/components/PhotoList';

class MyPage extends Component {
    render() {
        return (
        <div className="my-page">
            <button
            className="photo-button"
            onClick={() => {
                this.props.history.push('/my-page/photo/');
            }}
            >
            photo
            </button>
            <div className="articles">
            <ArticleList fetchEndpoint="/api/my-page/article" />
            </div>
            <div className="photos">
            <PhotoList fetchEndpoint="/api/my-page/photo" isUploadAvailabe isDeleteAvailabe />
            </div>
        </div>
        );
    }
}

export default withRouter(MyPage);
