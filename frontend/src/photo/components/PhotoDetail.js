import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class PhotoDetail extends Component {
	state = {
		image_file: null,
		memo: '', 
		selected_font: null,
		memo_changed: false
	}

	onInit() {
		axios.get(`/api/my-page/photo/${this.props.photo_id}`)
			.then((resp) => {
				console.log(resp);
				this.setState({ 
					...this.state, 
					memo: resp.data.memo,
					selected_font: resp.data.selected_font
				});
			})
			.catch((err) => {
				console.log(err);
				alert(err);
				window.location.reload(false);
			});
	}

	componentDidMount() {
		this.onInit();
	}

	onMemoChanged = (event) => {
		this.setState({ ...this.state, memo_changed: true, memo: event.target.value})
	}

	onUpdateMemoChanged = () => {
		const photo = {
		}
		axios.put(`/api/my-page/photo/${this.props.photo_id}`, photo)
			.then((resp) => {
				console.log(resp);
				this.setState({ 
					...this.state, memo: resp.data.memo, memo_changed: false
				});
			})
			.catch((err) => {
				console.log(err);
				alert(err);
				window.location.reload(false);
			});
	}

	onAnalysisButtonClicked = () => {
		console.log('hi')
		this.props.history.push(`/my-page/photo/${this.props.photo_id}/report`);
		
	}
	

	render() {
		if (this.state.selected_font === null) {
			return <p>Loading photo detail...</p>;
		}

		return (
			<div className="photo-detail">
				<div className="image">
					<p>{this.state.image_file}</p>
				</div>

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
