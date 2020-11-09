import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class PhotoEdit extends Component {
  state = {
    originalPhoto: null,
    memo: '',
    is_submitting: false
  }

  constructor(props) {
    super(props);
    this.imgInput = React.createRef();
  }

  onInit() {
    if (this.props.originalId === -1) return;
    axios.get(`/api/photo/${this.props.originalId}`)
    .then((resp) => {
      const p = resp.data.photo;
      this.setState({ originalPhoto: p, memo: p.memo });
    }).catch((err) => {
      alert("Error loading photo: " + err);
      this.props.history.goBack();
    })
  }

  componentDidMount() {
    this.onInit();
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.state.memo === "") {
      alert("Empty memo; please fill in.");
      return;
    }
    this.setState({ is_submitting: true });
    const payload = new FormData();
    payload.append('memo', this.state.memo);
    payload.append('image', this.imgInput.current.files[0]);

    (async ()=>{
      await axios.get('/api/token');
      const resp = await (this.props.originalId === -1 ?
        axios.post("/api/photo", payload) :
        axios.put(`/api/photo/${this.props.originalId}`, payload));
      this.setState({ is_submitting: false });
      if (resp.data.success !== true) throw new Error(resp.data.error);
      if (this.props.originalId !== -1)
        this.props.history.goBack();
      this.props.history.replace(`my-page/photo/`);
    })().catch((err) => {
      this.setState({ is_submitting: false });
      alert("Error saving photo: " + err.name + ": " + err.message);
      console.log("Error saving photo: " + err.name + ": " + err.message);
    });
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  render() {
    if (this.props.originalId !== -1 && this.state.originalPhoto === null) {
      return <p>Loading photo...</p>;
    }
    return (<div className="photo-edit">
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="row-title">
        </div>
        <div className="row-file">
          <input type="file" ref={this.imgInput} accept="image/jpeg,image/png" />
        </div>
        <div className="row-content">
          <textarea className="memo" value={this.state.memo}
            name="memo" onChange={this.handleChange.bind(this)} />
        </div>
        <div className="row-submit">
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>);
  }
}

export default withRouter(PhotoEdit);
