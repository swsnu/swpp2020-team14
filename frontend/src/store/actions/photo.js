import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getPhotos_ = (photos) => {
  return { type: actionTypes.GET_PHOTOS, photos: photos };
};

export const getPhotos = () => {
  return dispatch => {
    return axios.get('/api/photos/')
      .then(res => dispatch(getPhotos_(res.data)));
  };
};

export const postPhoto_ = (photo) => {
  return {
    type: actionTypes.POST_PHOTO,
    id: photo.id,
    author_id: photo.author_id,
    title: photo.title,
    content: photo.content,
  };
};

export const postPhoto = (photo) => {
  return (dispatch) => {
    return axios.post('/api/photos/', photo)
      .then(res => {
        dispatch(postPhoto_(res.data));
      });
  };
};

export const getPhoto_ = (photo) => {
  return { type: actionTypes.GET_PHOTO, target: photo };
};

export const getPhoto = (id) => {
  return dispatch => {
    return axios.get('/api/photos/' + id)
      .then(res => {
        dispatch(getPhoto_(res.data))
      });
  };
};

export const putPhoto_ = (photo) => {
  return {
    type: actionTypes.PUT_PHOTO,
    id: photo.id,
    author_id: photo.author_id,
    title: photo.title,
    content: photo.content,
  };
};

export const putPhoto = (photo) => {
  return dispatch => {
    return axios.put('/api/photos/'+ photo.id, photo)
      .then(res => {
        dispatch(putPhoto_(photo));
      })
  };
};

export const deletePhoto_ = (id) => {
  return {
    type: actionTypes.DELETE_PHOTO,
    targetID: id
  };
};

export const deletePhoto = (id) => {
  return dispatch => {
    return axios.delete('/api/photos/' + id)
      .then(res => dispatch(deletePhoto_(id)));
  };
};
