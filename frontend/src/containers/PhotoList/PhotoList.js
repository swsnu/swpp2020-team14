import React, {Component} from 'react';

import { connect } from 'react-redux';

import { withRouter } from 'react-router';

class PhotoList extends Component {
    state = {
        image_file: null,
        is_delete_clicked: false,
        list: []
    }

    componentDidMount() {
        this.onInit()
    }

    onInit() {
        this.props.onGetPhotos();
        this.props.storedPhotos.map((photo) => {
            this.state.list.append[
                {
                    id: photo.id,
                    uploaded_datetime: photo.uploaded_datetime,
                    image_file: photo.image_file,
                    is_checked: false,
                } 
            ]
        })
    }

    onPhotoDetailClicked = (photo) => {
        this.props.history.push('/my-page/photo/' + photo.id);
    }

    onPhotoChecked = (photo) => {
        photo.is_delete_clicked = !photo.is_delete_clicked
    }

    onUploadClicked() {
        alert('hi')
    }

    onDeleteClicked = () => {
        if (!is_delete_clicked) {
            is_delete_clicked = !is_delete_clicked
        }
        else {
            this.state.list.map((photo) => {
                if (photo.is_checked) {
                    this.props.onDeletePhoto(photo.id)
                    this.list.remove(photo)
                }
            })
            is_delete_clicked = !is_delete_clicked
        }
    }


    render() {

        const photos = this.state.list.map((photo) => {
            return ( 
                <div className='Photo' onClick={() => this.onPhotoDetailClicked(photo)}>
                    {photo.image_file}
                    <input type="checkbox" id="delete-checkbox" 
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

const mapStateToProps = state => {
    return {
        storedPhotos: state.photo.photos,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetPhotos: () => dispatch(actionCreators.getPhotos()),
        onDeletePhoto: (id) => dispatch(actionCreators.deletePhoto(id)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PhotoList));