import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Typography, Paper, Grid } from '@material-ui/core';

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

  _afterUpdateComment(resp) {
    const response = resp.data;
    if (response.success !== true) throw new Error(response.error);
    this.loadComment();
  }

  onDeleteComment(target) {
    axios.delete(`/api/comment/${target}`)
      .then(this._afterUpdateComment.bind(this))
      .catch((err) => { alert("Error deleting comment: " + err); });
  }

  onSubmitComment(target, content) {
    if(!this.props.loginState.logged_in) {
      alert("Please login to write a comment.")
    }
    else {
      const payload = new FormData();
      payload.append("content", content);
      payload.append("article", this.props.article_id);

      const job = (target !== -1 ?
        axios.put(`/api/comment/${target}`, payload) :
        axios.post("/api/comment", payload));
      job.then(this._afterUpdateComment.bind(this))
        .catch((err) => { alert("Error submitting comment: " + err); });  
    }
  }

  onLike() {
    if(!this.props.loginState.logged_in) {
      alert("Please login to like.")
    }
    else {
      this.setState({ is_sending_like: true });
      const a = this.state.article, aid = this.props.article_id;
      (async () => {
        await axios.get('/api/token');
        const resp = await (a.is_liked ?
          axios.delete(`/api/article/${aid}/like`) :
          axios.post(`/api/article/${aid}/like`));
        if (resp.data.success !== true) throw new Error(resp.data.error);
        a.like_count = resp.data.like_count;
        a.is_liked = !a.is_liked;
      })().catch((err) => {
        alert("Error sending like update: " + err.name + ": " + err.message); })
      .finally(() => this.setState({ is_sending_like: false }));
    }
  }

  componentDidMount() {
    this.onInit();
  }

  makeTimeShort(str) {
    let result
    let dictObject = {}
    const pattern = /^20([0-9]{2})\/([0-9]{1,2})\/([0-9]{1,2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
    if((result = pattern.exec(str)) != null) {
      dictObject['year'] = result[1]
      dictObject['month'] = result[2]
      dictObject['date'] = result[3]
      dictObject['hour'] = result[4]
      dictObject['minute'] = result[5]
      dictObject['second'] = result[6]
    }
    const newStr = dictObject.year +'/'+ dictObject.month +'/'+ dictObject.date +' '+ dictObject.hour +':'+ dictObject.minute
    return newStr
  }

  render() {
    if (this.state.loaded === false) {
      return <p>Loading article detail...</p>;
    }

    const a = this.state.article;
    return (<div className="article-detail">
      

      <Grid container className="title" justify="space-between">
        <Typography variant="h4">{a.title}</Typography>
        {a.is_owner && 
          <div className="control-buttons">
            <Button onClick={()=>this.onEdit()} className="edit" variant="outlined">Edit</Button>
            <Button onClick={()=>this.onDelete()} className="delete" disabled={this.state.is_deleting} variant="outlined">Delete</Button>
          </div>}  
      </Grid>

      <Grid container className="meta" justify="space-left">
        <span className="author">Written by {a.author}</span>,&nbsp;
        <span className="create">Created at {this.makeTimeShort(a.created_at)}</span>,&nbsp;
        <span className="last-edit">Last edit at {this.makeTimeShort(a.last_edited_at)}</span>
      </Grid>

      <Paper className="body">
        <Paper className="image">
          <img src={a.image_url} alt="article attachment" />
        </Paper>

        <Grid container className="content" alignContent="flex-start">
          <Typography variant="h6">{a.content}</Typography>
        </Grid>

        <Grid className="likes">
          <Button onClick={()=>this.onLike()} className={a.is_liked ? "liked" : "not-liked"}
            color="primary" variant="contained"
            disabled={this.state.is_sending_like}>{a.is_liked ? "Unlike" : "Like"}</Button>
          <span className="like-cnt">{a.like_count} {a.like_count === 1 ? "Like" : "Likes"}</span>
        </Grid>
      </Paper>

      <Paper className="comments">
        <CommentList comments={this.state.comments}
          onDelete={this.onDeleteComment.bind(this)}
          onSubmit={this.onSubmitComment.bind(this)} />  
      </Paper>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
});

// export default withRouter(ArticleDetail);
export default connect(mapStateToProps, )(ArticleDetail);
