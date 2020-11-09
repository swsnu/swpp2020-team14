import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

class PhotoList extends Component {
    state = {
        image_file: null,
        is_delete_clicked: false,
        list: null
    }

    onInit() {
		this.setState({
			image_file: null,
			is_delete_clicked: false,
			list: null
		})

		axios.get(`/api/my-page/photo`)
		.then((resp) => {
			console.log(resp);
			const newPhotos = resp.data.list.map((photo) => {
				return {
					id: photo.id,
					uploaded_datetime: photo.uploaded_datetime,
					image_file: photo.image_file,
					is_checked: false,
				};
			})
			this.setState({ ...this.state, list: newPhotos})
		})
		.catch((err) => {
			console.log(err);
		  	alert(err);
		  	window.location.reload(false);
		});
    }

    componentDidMount() {
        this.onInit()
    }

    onPhotoDetailClicked = (photo) => {
        this.props.history.push('/my-page/photo/' + photo.id);
    }

    onPhotoChecked = (photo) => {
        photo.is_checked = !(photo.is_checked)
    }

    onUploadClicked() {
        alert('hi')
    }

    onDeleteClicked = () => {
        if (!this.state.is_delete_clicked) {
			this.setState({ ...this.state, is_delete_clicked: true})
        }
        else {
            this.state.list.map((photo) => {
                if (photo.is_checked) {

					axios.delete(`/api/my-page/photo/${photo.id}`)
					.then((resp) => {
						console.log(resp);
					})
					.catch((err) => {
						console.log(err);
						alert(err);
        				window.location.reload(false);
					})
                }
			})
			const deleted = this.state.list.filter((photo) => {
				return !(photo.is_checked)
			})
			this.setState({ ...this.state, list: deleted, is_delete_clicked: false})
		}
    }


    render() {
		if (this.state.list === null) {
			return <p className="loading">Loading photo list...</p>
		}

        const photos = this.state.list.map((photo) => {
            return ( 
                <div className='Photo' >
                    <div className='image_file' onClick={() => this.onPhotoDetailClicked(photo)}>
                        {photo.image_file}
                    </div>
                    <input type="checkbox" id="delete-checkbox" 
                        disabled={!this.state.is_delete_clicked}
                        onClick={() => this.onPhotoChecked(photo)} />
                </div>
            )
        })

        return (
            <div className='PhotoList'>
                <button id="upload-button" onClick={this.onUploadClicked}>Upload New</button>
                <button id="delete-button" onClick={this.onDeleteClicked}>Delete</button>
                <div className="photos">{photos}</div>
            </div>

        )


    }

}
export default withRouter(PhotoList);