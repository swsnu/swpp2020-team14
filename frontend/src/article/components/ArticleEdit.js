import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class ArticleEdit extends Component {
  state = {
    originalArticle: null,
    title: '',
    content: '',
    is_submitting: false
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
      console.log("Error saving article: " + err.name + ": " + err.message);
    });
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  render() {
    if (this.props.originalId !== -1 && this.state.originalArticle === null) {
      return <p>Loading article...</p>;
    }
    return (<div className="article-edit">
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="row-title">
          <input className="title" value={this.state.title}
            name="title" onChange={this.handleChange.bind(this)} />
        </div>
        <div className="row-file">
          <input type="file" ref={this.imgInput} accept="image/jpeg,image/png" />
        </div>
        <div className="row-content">
          <textarea className="content" value={this.state.content}
            name="content" onChange={this.handleChange.bind(this)} />
        </div>
        <div className="row-submit">
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>);
  }
}

export default withRouter(ArticleEdit);
