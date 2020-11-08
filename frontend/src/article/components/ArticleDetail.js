import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

import CommentList from './CommentList';
import'./ArticleDetail.css';

class ArticleDetail extends Component {
  state = {
    loaded: false,
    is_deleting: false,
    is_sending_like: false,
    article: null,
    comments: null,
  }

  onInit() {
    axios.get(`/api/article/${this.props.article_id}`)
      .then((resp) => {
        this.setState({ article: resp.data.article });
        this.loadComment();
      })
      .catch((err) => {
        alert("Error loading article: " + err);
        this.props.history.goBack();
      });
  }

  loadComment() {
    this.setState({ loaded: false });
    axios.get(`/api/article/${this.props.article_id}/comment`)
      .then((resp) => {
        this.setState({ comments: resp.data.comments, loaded: true });
      })
      .catch((err) => {
        alert("Error loading article comments: " + err);
      });
  }

  onEdit() {
    this.props.history.push(`/article/${this.props.article_id}/edit`);
  }

  onDelete() {
    this.setState({ is_deleting: true });
    axios.delete(`/api/article/${this.props.article_id}`)
    .then((resp) => {
      const response = resp.data;
      if (response.success !== true) throw new Error(response.error);
      this.props.history.goBack();
    })
    .catch((err) => {
      alert("Error deleting article: " + err);
    });
  }

  onDeleteComment(target) {
    axios.delete(`/api/comment/${target}`)
    .then((resp) => {
      const response = resp.data;
      if (response.success !== true) throw new Error(response.error);
      this.loadComment();
    })
    .catch((err) => { alert("Error deleting comment: " + err); });
  }

  onSubmitComment(target, content) {
    const payload = {"content": content, "article": this.props.article_id};
    const job = (target !== -1 ?
      axios.put(`/api/comment/${content}`, payload) :
      axios.post("/api/comment", payload));
    job.then((resp) => {
      const response = resp.data;
      if (response.success !== true) throw new Error(response.error);
      this.loadComment();
    })
    .catch((err) => { alert("Error submitting comment: " + err); });
  }

  onLike() {
    this.setState({ is_sending_like: true });
    const a = this.state.article;
    const job = (a.is_liked ?
      axios.delete(`/api/article/${a.id}/like`) :
      axios.post(`/api/article/${a.id}/like`));
    job.then((resp) => {
      const response = resp.data;
      if (response.success !== true) throw new Error(response.error);
      a.like_count = response.like_count;
      a.is_liked = !a.is_liked;
    })
    .catch((err) => { alert("Error sending like update: " + err); });
  }

  componentDidMount() {
    this.onInit();
  }

  render() {
    if (this.state.loaded === false) {
      return <p>Loading article detail...</p>;
    }

    const a = this.state.article;
    return (<div className="article-detail">
      <div className="title">
        <h3>{a.title}</h3>
      </div>

      <div className="author">
        <p>{a.author}</p>
      </div>

      <div className="dates">
        <span className="create">Created at {a.created_at}</span>;&nbsp;
        <span className="last-edit">Last edit at {a.last_edited_at}</span>
      </div>

      <div className="image">
        <img src={a.image_url} alt="article attachment" />
      </div>

      <div className="content">{a.content}</div>

      <div className="likes">
        <button onClick={()=>this.onLike()} className={a.is_liked ? "liked" : "not-liked"}
          disabled={this.state.is_sending_like}>Like</button>
        <span className="like-cnt">{a.like_count} {a.like_count === 1 ? "Like" : "Likes"}</span>
      </div>

      {a.is_owner && <div className="control-buttons">
        <button onClick={()=>this.onEdit()} className="edit">Edit</button>
        <button onClick={()=>this.onDelete()} className="delete" disabled={this.state.is_deleting}>Delete</button>
      </div>}

      <CommentList comments={this.state.comments}
        onDelete={this.onDeleteComment.bind(this)}
        onSubmit={this.onSubmitComment.bind(this)} />
    </div>
    );
  }
};

export default withRouter(ArticleDetail);
