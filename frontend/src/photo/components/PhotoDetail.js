import React, { Component } from 'react';

import axios from 'axios';

class FontDetail extends Component {
	state = {
		image_file: null,
		memo: '', 
		selected_font: null,
		memo_changed: false
	}

	onInit() {
		axios.get(`/api/photo/${this.props.photo_id}`)
			.then((resp) => {
				console.log(resp);
				this.setState({ 
					...this.state, 
					image_file: resp.image_file,
					memo: resp.memo,
					selected_font: resp.selected_font
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
		axios.put(`api/photo/${this.props.photo_id}`, photo)
			.then((resp) => {
				console.log(resp);
				this.setState({ 
					...this.state, memo: resp.memo, memo_changed: false
				});
			})
			.catch((err) => {
				console.log(err);
				alert(err);
				window.location.reload(false);
			});
	}
	

	render() {
		if (this.state.data === null) {
			return <p>Loading font detail...</p>;
		}

		return (
			<div className="photo-detail">
				<div className="image">
					<p>{this.state.image_file}</p>
				</div>

				<div className="memo" onChanged={this.onMemoChanged}>
					<p>{this.state.memo}</p>
				</div>

				<button 
					className="update_memo" 
					onClicked={this.onUpdateMemoChanged}
					disabled={!this.state.memo_changed}>
					Update Memo
				</button>

				<div className="license">
					<h3>License</h3>
					<div className={f.license.is_free ?
						"license-free" : "license-nonfree"}>
						<p>{f.license.is_free ?
							"Free" : "Non-free"}</p>
						<FontLicenseDetail license={f.license} />
					</div>
				</div>
			</div>
		);
	}
};

export default FontDetail;
