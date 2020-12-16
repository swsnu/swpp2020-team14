import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@material-ui/core';

class PhotoEdit extends Component {
  state = {
    is_submitting: false,
    chosen_file: null
  }

  constructor(props) {
    super(props);
    this.imgInput = React.createRef();
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ is_submitting: true });
    const payload = new FormData();
    payload.append('memo', this.state.memo);
    payload.append('image', this.imgInput.current.files[0]);

    (async ()=>{
      await axios.get('/api/token');
      const resp = await axios.post("/api/photo", payload);
      this.setState({ is_submitting: false });
      if (resp.data.success !== true) throw new Error(resp.data.error);
      this.props.history.push(`/photo/${resp.data.id}`);
    })().catch((err) => {
      this.setState({ is_submitting: false });
      alert("Error saving photo: " + err.name + ": " + err.message);
      console.log("Error saving photo: " + err.name + ": " + err.message);
    });
  }

  handleFileChange() {
    this.setState({ chosen_file: ((this.imgInput.current && this.imgInput.current.files[0]) || null) });
  }

  render() {
    if (this.props.originalId !== -1 && this.state.originalPhoto === null) {
      return <p>Loading photo...</p>;
    }

    const image_area = 
      (this.state.chosen_file === null) ? (
        <div className="image-empty">
          <Typography variant="overline">Click here to<br />choose image</Typography>
        </div>
      ) : (
        <img className="image-preview" src={ URL.createObjectURL(this.state.chosen_file) } />
      );

    return (<div className="photo-create">
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="row-file">
          <Grid container className="image-area-wrapper" alignItems="center" justify="center">
            <label className="image-area" htmlFor="file">{ image_area }</label>
          </Grid>
          <Button
            className="btn-reset" variant="contained" size="small"
            disabled={ this.state.originalImage === null && this.state.chosen_file === null }
            onClick={ ()=>{ this.imgInput.current && (this.imgInput.current.value = ''); this.handleFileChange(); } }>
            Reset
          </Button>
          <input hidden id="file" type="file" ref={ this.imgInput } accept="image/jpeg,image/png"
            onChange={ this.handleFileChange.bind(this) }/>
        </div>
        <div className="row-submit">
          <Button
            type="submit" color="primary" variant="contained"
            onClick={ this.onSubmit.bind(this) }>
            Submit
          </Button>
        </div>
      </form>
    </div>);
  }
}

export default withRouter(PhotoEdit);
