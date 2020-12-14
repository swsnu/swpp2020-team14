import React, { Component } from 'react';
import { Button, TextField} from '@material-ui/core';

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
          : <div className="content">{c.content}</div>
        )}
        <div className="meta">
          <div className="username"><span>{c.author}</span></div>
          <div className="dates">
            <span>Created at {c.created_at}; Last edited at {c.last_edited_at}</span>
          </div>
          {c.is_owner && <div className="btns">
            <Button classname={"edit-button"} onClick={()=>this.onClickEdit(c)}>
              {c.id === this.state.edit_target ? "Cancel" : "Edit"}
            </Button>
            <Button classname={"delete-button"} onClick={()=>this.onClickDelete(c)}>Delete</Button>
          </div>
          }
        </div>
        
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
