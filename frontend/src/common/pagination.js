import { Button, ButtonGroup } from '@material-ui/core';
import React, { Component } from 'react';

class PageButtonArray extends Component {
  render() {
    const arr = [];
    const H = (i) => ((e) => { this.props.onclick(i); e.preventDefault(); });
    for (let i = this.props.cur - 5; i <= this.props.cur + 5; ++i) {
      if (i < 1 || i > this.props.n) continue;
      arr.push(
        <Button
          key={i}
          className={`page-btn ${(i === this.props.cur) ? 'page-btn-cur' : ''}`}
          variant={ (i === this.props.cur) ? "contained" : "outlined" }
          onClick={H(i)}
        >
          {i}
        </Button>);
    }
    return (
      <div className="page-button-array">
        <ButtonGroup color="primary">
          <Button
            className="page-btn page-btn-ends"
            onClick={H(1)}
          >
            First
          </Button>
          {arr}
          <Button
            className="page-btn page-btn-ends"
            onClick={H(this.props.n)}
          >
            Last
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default PageButtonArray;
