import React, { Component } from 'react';

import './CommentList.css';

class CommentList extends Component {
  state = {
    comment_body: '',
    edit_target: -1
  }

  onClickEdit(c) {
    this.setState({ comment_body: c.content, edit_target: c.id });
  }

  onClickDelete(c) {
    this.props.onDelete(c.id);
  }

  render() {
    const items = this.props.comments.map(c => {
      return <div className={"cmt-itm " +
        (c.id === this.state.edit_target ? "edit" : "nonedit")} key={c.id}>
        <div className="meta">
          <div className="username"><span>{c.author}</span></div>
          <div className="dates">
            <span>Created at {c.created_at}; Last edited at {c.last_edited_at}</span>
          </div>
          {c.is_owner && <div className="btns">
            <button onClick={()=>this.onClickEdit(c)}>
              {c.id === this.state.edit_target ? "Cancel" : "Edit"}
            </button>
            <button onClick={()=>this.onClickDelete(c)}>Delete</button>
          </div>
          }
        </div>
        <div className="content">{c.content}</div>
      </div>
    });

    return <div className="comment-list">
      {items}
    </div>
  }
}

export default CommentList;
