import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import './PhotoList.css';

class PhotoList extends Component {
    state = {
        is_delete_clicked: false,
        photos: null
    }

    onInit() {
        axios.get(`${this.props.fetchEndpoint}`)
		.then((resp) => {
			console.log(resp);
			const newPhotos = resp.data.photos.map((photo) => {
				return {
                    id: photo.id,
                    image_url: photo.image_url,
					uploaded_datetime: photo.uploaded_datetime,
					is_checked: false,
				};
			})
			this.setState({ photos: newPhotos })
		})
		.catch((err) => {
			console.log(err);
		  	alert(err);
		});
    }

    componentDidMount() {
        this.onInit()
    }

    onPhotoDetailClicked = (photo) => {
        this.props.history.push(`/my-page/photo/${photo.id}`);
    }

    onPhotoChecked = (photo) => {
        photo.is_checked = !(photo.is_checked)
    }

    onUploadClicked() {
        this.props.history.push('/photo/create');
    }

    onDeleteClicked = () => {
        if (!this.state.is_delete_clicked) {
			this.setState({ is_delete_clicked: true })
        }
        else {
            this.state.photos
                .filter(photo => photo.is_checked)
                .forEach((photo) => {
					axios.delete(`/api/photo/${photo.id}`)
					.then((resp) => {
						console.log(resp);
					})
					.catch((err) => {
						console.log(err);
						alert(err);
                    })
			    });
			const deleted = this.state.photos.filter((photo) => {
				return !(photo.is_checked)
			})
			this.setState({ photos: deleted, is_delete_clicked: false })
		}
    }


    render() {
		if (this.state.photos === null) {
			return <p className="loading">Loading photos...</p>
		}

        const photos = this.state.photos.map((photo) => {
            return ( 
                <div className='Photo' >
                    <img src={photo.image_url} alt="uploaded" onClick={() => this.onPhotoDetailClicked(photo)}/>
                    {this.props.isDeleteAvailable && this.state.is_delete_clicked &&
                    <input type="checkbox" id="delete-checkbox" 
                        disabled={!this.state.is_delete_clicked}
                        onClick={() => this.onPhotoChecked(photo)} />}
                </div>
            )
        })


        return (
            <div className='PhotoList'>
                {this.props.isUploadAvailable ?
                <button id="upload-button" onClick={() => this.onUploadClicked()}>Upload New</button> : null}

                {this.props.isDeleteAvailable ?
                <button id="delete-button" onClick={() => this.onDeleteClicked()}>Delete</button> : null}
                <div className="photos">{photos}</div>
            </div>
        )
    }
}
export default withRouter(PhotoList);