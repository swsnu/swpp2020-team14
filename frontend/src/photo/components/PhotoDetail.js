import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class PhotoDetail extends Component {
	state = {
		image_url: null,
		memo: '', 
		selected_font: null,
		memo_changed: false
	}

	onInit() {
		axios.get(`/api/photo/${this.props.photo_id}`)
			.then((resp) => {
				this.setState({ 
					memo: resp.data.photo.memo,
					image_url: resp.data.photo.image_url,
					selected_font: resp.data.photo.selected_font
				});
			})
			.catch((err) => {
				alert(err);
			});
	}

	componentDidMount() {
		this.onInit();
	}

	onMemoChanged = (event) => {
		this.setState({ memo_changed: true, memo: event.target.value})
	}

	onUpdateMemoChanged = () => {
		const payload = new FormData();
		payload.append("memo", this.state.memo);

		axios.patch(`/api/photo/${this.props.photo_id}`, payload)
			.then((resp) => {
				this.setState({ memo_changed: false });
			})
			.catch((err) => {
				alert(err);
			});
	}

	onAnalysisButtonClicked = () => {
		this.props.history.push(`/my-page/photo/${this.props.photo_id}/report`);
		
	}
	

	render() {
		if (this.state.selected_font === null) {
			return <p>Loading photo detail...</p>;
		}

		return (
			<div className="photo-detail">
				<img src={this.state.image_url} alt="uploaded"/>

				<input className="memo" 
					type="text" 
					value={this.state.memo}
					onChange={this.onMemoChanged} />

				<button 
					className="update-memo-button" 
					onClick={() => this.onUpdateMemoChanged()}
					disabled={!this.state.memo_changed}>
					Update Memo
				</button>

				<div className="selected-font">
					<p>{this.state.selected_font.name}</p>
				</div>

				<button 
					className="analysis-button" 
					onClick={() => this.onAnalysisButtonClicked()} >
					Analysis!
				</button>
			</div>
		);
	}
};

export default withRouter(PhotoDetail);
