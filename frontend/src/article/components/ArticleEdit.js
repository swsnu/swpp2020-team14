import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@material-ui/core';

import './ArticleEdit.css';

class ArticleEdit extends Component {
  state = {
    originalArticle: null,
    title: '',
    content: '',
    is_submitting: false,
    chosen_file: null
  }

  constructor(props) {
    super(props);
    this.imgInput = React.createRef();
  }

  onInit() {
    if (this.props.originalId === -1) return;
    axios.get(`/api/article/${this.props.originalId}`)
    .then((resp) => {
      const a = resp.data.article;
      this.setState({ originalArticle: a, title: a.title, content: a.content });
    }).catch((err) => {
      alert("Error loading article: " + err);
      this.props.history.goBack();
    })
  }

  componentDidMount() {
    this.onInit();
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.state.title === "" || this.state.content === "") {
      alert("Empty title or content; please fill in both.");
      return;
    }
    this.setState({ is_submitting: true });
    const payload = new FormData();
    payload.append('title', this.state.title);
    payload.append('content', this.state.content);
    payload.append('image', this.imgInput.current.files[0]);

    (async ()=>{
      await axios.get('/api/token');
      const resp = await (this.props.originalId === -1 ?
        axios.post("/api/article", payload) :
        axios.put(`/api/article/${this.props.originalId}`, payload));
      this.setState({ is_submitting: false });
      if (resp.data.success !== true) throw new Error(resp.data.error);
      if (this.props.originalId !== -1)
        this.props.history.goBack();
      this.props.history.replace(`/article/${resp.data.id}`);
    })().catch((err) => {
      this.setState({ is_submitting: false });
      alert("Error saving article: " + err.name + ": " + err.message);
    });
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleFileChange() {
    this.setState({ chosen_file: ((this.imgInput.current && this.imgInput.current.files[0]) || null) });
  }

  render() {
    if (this.props.originalId !== -1 && this.state.originalArticle === null) {
      return <p>Loading article...</p>;
    }

    const image_area = (this.state.chosen_file === null) ? (
      <div className="image-empty">
        <Typography variant="overline">Click here to<br />choose image</Typography>
      </div>
    ) : (
      <img className="image-preview" src={ URL.createObjectURL(this.state.chosen_file) } />
    );

    return (<div className="article-edit">
      <form onSubmit={this.onSubmit.bind(this)}>
        <TextField fullWidth margin="normal" className="title" value={this.state.title}
          name="title" placeholder="Title" onChange={this.handleChange.bind(this)} />
        <div className="row-file">
          <Grid container className="image-area-wrapper" alignItems="center" justify="center">
            <label className="image-area" htmlFor="file">{ image_area }</label>
          </Grid>
          <Button
            className="btn-reset" variant="contained" size="small"
            disabled={ this.state.chosen_file === null }
            onClick={ ()=>{ this.imgInput.current && (this.imgInput.current.value = ''); this.handleFileChange(); } }>
            Reset image?
          </Button>
          <input hidden id="file" type="file" ref={ this.imgInput } accept="image/jpeg,image/png"
            onChange={ this.handleFileChange.bind(this) }/>
        </div>
        <TextField multiline fullWidth margin="normal" className="content" value={this.state.content} rows={10} rowsMax={100}
          label="Content" name="content" onChange={this.handleChange.bind(this)} />
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

export default withRouter(ArticleEdit);
