import React, { Component } from 'react';
import { Button, TextField, Typography, Grid } from '@material-ui/core';

import './CommentList.css';

class CommentList extends Component {
  state = {
    comment_body: '',
    edit_target: -1
  }

  handleCreateInput(event) {
    const value = event.target.value;
    this.setState({ comment_body: value, edit_target: -1 });
  }

  handleEditInput(event) {
    const value = event.target.value;
    this.setState({ comment_body: value });
  }

  onClickEdit(c) {
    if(c.id === this.state.edit_target) {
      this.setState({ comment_body: '', edit_target: -1 });
    }
    else {
      this.setState({ comment_body: c.content, edit_target: c.id });
    }
  }

  onClickSubmit() {
    this.props.onSubmit(this.state.edit_target, this.state.comment_body)
  }

  

  onClickDelete(c) {
    this.props.onDelete(c.id);
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
    const items = this.props.comments.map(c => {
      return <div className={"cmt-itm " +
        (c.id === this.state.edit_target ? "edit" : "nonedit")} key={c.id}>
        {(c.id === this.state.edit_target ? 
          <div className="edit-comment">
            <TextField multiline fullWidth margin="normal" className="comment-edit-input" value={this.state.comment_body} rows={1} rowsMax={10}
              onChange={this.handleEditInput.bind(this)} />
            <Button classname={"submit-button"} onClick={()=>this.onClickSubmit()} disabled={this.state.comment_body === c.value}>Submit</Button>  
          </div>
          : <Grid container className="content" justify="space-between">
              <Typography variant="h6">{c.content}</Typography>
              {c.is_owner && <div className="btns">
              <Button classname={"edit-button"} onClick={()=>this.onClickEdit(c)}>
                {c.id === this.state.edit_target ? "Cancel" : "Edit"}
              </Button>
              <Button classname={"delete-button"} onClick={()=>this.onClickDelete(c)}>Delete</Button>
              </div>
          }
            </Grid>
        )}
        <Grid container className="meta">
          <span className="author">Written by {c.author}</span>,&nbsp;
          <span className="create">Created at {this.makeTimeShort(c.created_at)}</span>,&nbsp;
          <span className="last-edit">Last edit at {this.makeTimeShort(c.last_edited_at)}</span>
          
        </Grid>
        
      </div>
    });

    return <div className="comment-list">
      <TextField multiline fullWidth margin="normal" className="comment-input" rows={1} rowsMax={10}
          onChange={this.handleCreateInput.bind(this)} />
      <Button classname={"submit-button"} onClick={()=>this.onClickSubmit()} disabled={this.state.comment_body === ''}>Submit</Button>
      
      <div className="comment-items">
        {items} 
      </div>
    </div>
  }
}

export default CommentList;
