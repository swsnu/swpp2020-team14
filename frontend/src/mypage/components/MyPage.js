import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';


class MyPage extends Component {
	state = {
		articles: null,
		photos: null,
	}

	onInit() {
		this.onBrowsePage(1);
	}

	onBrowsePage(n) {
		this.setState({list: null});
		axios.get(`/api/article?page=${n}`)
			.then((resp) => {
				this.setState({
					articles: resp.data.list,
				});
			})
			.catch((err) => {
				alert(err);
				window.location.reload(false);
			});

		axios.get(`/api/photo`)
			.then((resp) => {
				this.setState({
					photos: resp.data.photos,
				});
			})
			.catch((err) => {
				alert(err);
				window.location.reload(false);
			});
	}

	componentDidMount() {
		this.onInit();
	}

	onPhotoDetailClicked = (photo) => {
        this.props.history.push(`/my-page/photo/${photo.id}`);
    }

	render() {
		if (this.state.articles === null) {
			return <p className="loading">Loading article list...</p>
		}

		if (this.state.photos === null) {
			return <p className="loading">Loading photo list...</p>
		}

		const articles = this.state.articles.map(f => {
			return <tr key={f.id}>
				<td className="name">
					<button onClick={(e)=>
						this.props.history.push(`/article/${f.id}`)}>
						{f.title}</button></td>
			</tr>
		});

		const photos = this.state.photos.map((photo) => {
            return ( 
                <div className='Photo' >
                    <img src={photo.image_url} alt="uploaded photo" onClick={() => this.onPhotoDetailClicked(photo)}/>

                    <input type="checkbox" id="delete-checkbox" 
                        disabled={!this.state.is_delete_clicked}
                        onClick={() => this.onPhotoChecked(photo)} />
                </div>
            )
        })

		return <div className="my-page">

			<button onClick={() => {
				this.props.history.push(`/my-page/photo/`);
			} > photo </button>
			<div className="articles">
				{articles}
			</div>
			<div className="photos">
				{photos}
			</div>
		</div>
	}
};

export default withRouter(MyPage);

