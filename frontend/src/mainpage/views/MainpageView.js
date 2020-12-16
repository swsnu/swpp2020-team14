import { React, Component } from 'react';
import PhotoCreateView from '../../photo/views/PhotoCreateView';
import ArticleListView from '../../article/views/ArticleListView';

import './MainpageView.css';

class MainpageView extends Component {
    render() {
        return (<div className="mainpage">
            <PhotoCreateView />
            <ArticleListView />
        </div>);
    }
}

export default MainpageView;