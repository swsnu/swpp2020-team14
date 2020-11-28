import React, { Component } from 'react';

class PageButtonArray extends Component {
  render() {
    const arr = [];
    const H = (i) => ((e) => { this.props.onclick(i); e.preventDefault(); });
    for (let i = this.props.cur - 5; i <= this.props.cur + 5; ++i) {
      if (i < 1 || i > this.props.n) continue;
      arr.push(<button
        key={i}
        className={
        `page-btn ${(i === this.props.cur) ? 'page-btn-cur' : ''}`
}
        onClick={H(i)}
      >
        {i}
      </button>);
    }
    return (
      <div className="page-button-array">
        <button
          className="page-btn page-btn-ends"
          onClick={H(1)}
        >
          First
        </button>
        {arr}
        <button
          className="page-btn page-btn-ends"
          onClick={H(this.props.n)}
        >
          Last
        </button>
      </div>
    );
  }
}

export default PageButtonArray;
