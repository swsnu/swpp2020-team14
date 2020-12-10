import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import { Button, Checkbox, GridList, GridListTile, GridListTileBar, Paper, Typography } from '@material-ui/core';

import './PhotoList.css';

class PhotoList extends Component {
    state = {
        is_delete_clicked: false,
        photos: null,
        loaded: false
    }

    onInit() {
        axios.get(`/api/my-page/photo` + (this.props.trunc ? `?trunc=${this.props.trunc}` : ''))
        .then((resp) => {
            const newPhotos = resp.data.photos.map((photo) => {
                return {
                    id: photo.id,
                    image_url: photo.image_url,
                    uploaded_datetime: photo.uploaded_datetime,
                    is_checked: false,
                };
            })
            this.setState({ loaded: true, photos: newPhotos })
        })
        .catch((err) => {
              alert(err);
        });
    }

    componentDidMount() {
        this.onInit()
    }

    onPhotoDetailClicked = (photo) => {
        this.props.history.push(`/photo/${photo.id}`);
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
                    })
                    .catch((err) => {
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
                <GridListTile className="tile-wrapper" key={photo.id} cols={1}>
                    <img
                        className="tile-img"
                        src={photo.image_url}
                        alt="uploaded"
                        onClick={() => this.onPhotoDetailClicked(photo)}
                    />
                    {
                        this.props.isDeleteAvailable && this.state.is_delete_clicked &&
                        <GridListTileBar actionIcon={
                            <Checkbox color="primary.light" id="delete-checkbox" 
                                onClick={() => this.onPhotoChecked(photo)} />
                        } />
                    }
                </GridListTile>
            )
        })

        return (
            <Paper elevation={2} className="photo-list">
                {this.props.isUploadAvailable ?
                <Button id="upload-button" onClick={() => this.onUploadClicked()}>Upload New</Button> : null}

                {this.props.isUploadAvailable && this.props.isDeleteAvailable &&
                <Typography component="span">&middot;</Typography>}

                {this.props.isDeleteAvailable ?
                <Button id="delete-button" onClick={() => this.onDeleteClicked()}>Delete</Button> : null}
                <GridList cellHeight={160} cols={3} className="photo-grid">
                    {photos}
                </GridList>
            </Paper>
        )
    }
}

export default withRouter(PhotoList);