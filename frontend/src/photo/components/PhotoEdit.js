import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@material-ui/core';

class PhotoEdit extends Component {
  state = {
    originalPhoto: null,
    originalImage: null,
    memo: '',
    is_submitting: false,
    chosen_file: null
  }

  constructor(props) {
    super(props);
    this.imgInput = React.createRef();
  }

  onInit() {
    if (this.props.originalId === -1) return;
    axios.get(`/api/photo/${this.props.originalId}`)
    .then((resp) => {
      const p = resp.data.photo;
      this.setState({ originalPhoto: p, memo: p.memo, originalImage: p.image_url });
    }).catch((err) => {
      alert("Error loading photo: " + err);
      this.props.history.goBack();
    })
  }

  componentDidMount() {
    this.onInit();
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.state.memo === "") {
      alert("Empty memo; please fill in.");
      return;
    }
    this.setState({ is_submitting: true });
    const payload = new FormData();
    payload.append('memo', this.state.memo);
    payload.append('image', this.imgInput.current.files[0]);

    (async ()=>{
      await axios.get('/api/token');
      const resp = await (this.props.originalId === -1 ?
        axios.post("/api/photo", payload) :
        axios.put(`/api/photo/${this.props.originalId}`, payload));
      this.setState({ is_submitting: false });
      if (resp.data.success !== true) throw new Error(resp.data.error);
      if (this.props.originalId !== -1)
        this.props.history.goBack();
      this.props.history.replace(`/my-page/photo/`);
    })().catch((err) => {
      this.setState({ is_submitting: false });
      alert("Error saving photo: " + err.name + ": " + err.message);
      console.log("Error saving photo: " + err.name + ": " + err.message);
    });
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleFileChange() {
    this.setState({ chosen_file: ((this.imgInput.current && this.imgInput.current.files[0]) || null), originalImage: null});
  }

  render() {
    if (this.props.originalId !== -1 && this.state.originalPhoto === null) {
      return <p>Loading photo...</p>;
    }

    const image_area = (this.state.originalImage === null) ? (
      (this.state.chosen_file === null) ? (
        <div className="image-empty">
          <Typography variant="overline">Click here to<br />choose image</Typography>
        </div>
      ) : (
        <img className="image-preview" src={ URL.createObjectURL(this.state.chosen_file) } />
      )
    ) : (
      <img className="image-preview" src={ this.state.originalImage } alt="photo attachment"/>
    );


    return (<div className="photo-edit">
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="row-file">
          <Grid container className="image-area-wrapper" alignItems="center" justify="center">
            <label className="image-area" htmlFor="file">{ image_area }</label>
          </Grid>
          <Button
            className="btn-reset" variant="contained" size="small"
            disabled={ this.state.originalImage === null && this.state.chosen_file === null }
            onClick={ ()=>{ this.imgInput.current && (this.imgInput.current.value = ''); this.handleFileChange(); } }>
            Reset image?
          </Button>
          <input hidden id="file" type="file" ref={ this.imgInput } accept="image/jpeg,image/png"
            onChange={ this.handleFileChange.bind(this) }/>
        </div>
        <div className="row-content">
          <TextField multiline fullWidth margin="normal" className="memo" value={this.state.memo} rows={1} rowsMax={10}
            label="Memo" name="memo" onChange={this.handleChange.bind(this)} />
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
