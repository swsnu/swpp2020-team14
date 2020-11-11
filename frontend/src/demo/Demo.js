import React, { Component } from 'react';
import axios from 'axios';

import './Demo.css';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
    this.imageFile = React.createRef();
  }

  onImageChange() {
    (async () => {
      await axios.get('/api/token');
      const fd = new FormData();
      fd.append('image', this.imageFile.current.files[0]);
      const resp = await axios.post('/api/demo', fd);
      this.setState({ result: resp.data.result });
    })();
  }

  render() {
    const results = (this.state.result !== null && <table className="table-result"><tbody>
      { this.state.result.map((x, i) => {
        return (<tr key={ i }>
          <td className="font">{ x.font }</td>
          <td className="prob"
          style={{ background: `rgba(0, 255, 0, ${5+x.prob*50}%)`}}
          >{ (x.prob*100).toFixed(2) }%</td>
        </tr>);
      }) }</tbody></table>
    );
    return (
      <div className="demo-wrapper">
        <div className="demo">
          <div className="file-in">
            <input onChange={() => this.onImageChange()} type="file" accept="image/jpeg,image/png" ref={this.imageFile} />
          </div>
          <div className="preview">
            { this.imageFile.current && this.imageFile.current.files.length &&
            <img src={ URL.createObjectURL(this.imageFile.current.files[0]) } alt="uploading" /> }
          </div>
          <div className="results">
            { results }
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;