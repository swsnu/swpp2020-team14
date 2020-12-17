import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios';

import './PhotoDetail.css';
import PhotoReport from '../../report/components/PhotoReport';

class PhotoDetail extends Component {
	state = {
		loaded_photo: false,
		photo: null,
		memo: '',
		memo_changed: null,
		error: null
	}

	onInit() {
		axios.get(`/api/photo/${this.props.photo_id}`)
		.then((resp) => {
			this.setState({
				loaded_photo: true,
				photo: resp.data.photo,
			});
			if (this.props.login.logged_in) {
				this.setState({
					memo: resp.data.photo.memo,
					memo_changed: false,
				});
			}
		})
		.catch((err) => {
			this.setState({ error: `Error loading photo: ${err}`});
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
				alert("Memo Updated!");
			})
			.catch((err) => {
				alert(err);
			});
	}

	render() {
		if (this.state.error !== null) {
			return (
				<div className="error-wrapper">
					<ErrorIcon />
					<Typography>{ this.state.error }</Typography>
				</div>
			);
		}

		const pane_image = (this.state.loaded_photo) ? (
			<Grid item xs={5} className="pane-image">
				<img src={this.state.photo.image_url} alt="uploaded"/>
				{ this.props.login.logged_in &&
					<div>
						<TextField multiline fullWidth margin="normal" className="memo"
							value={this.state.memo} rows={1} rowsMax={10}
							onChange={this.onMemoChanged.bind(this)} />

						<Button
							className="update-memo-button" 
							onClick={() => this.onUpdateMemoChanged()}
							disabled={!this.state.memo_changed}>
							Update Memo
						</Button>
					</div>}
			</Grid>) : (
			<Grid item xs={5} className="pane-image">
				<CircularProgress /> <br />
				<Typography className="loading" variant="caption">
					The photo is not loaded yet.
				</Typography>
			</Grid>);

		const pane_report = (<Grid item xs={7} className="pane-report">
			<PhotoReport
				photo_id={ this.props.photo_id }
				report={ this.state.photo === null ? null : this.state.photo.report } />
		</Grid>);

		return (
			<Paper className="photo-detail-wrapper">
				<Typography variant="h4">Analysis Result</Typography>
				<Grid container className="pane-wrapper">
					{ pane_image }
					{ pane_report }
				</Grid>
			</Paper>
		);
	}
}

const mapStateToProps = state => ({
	login: state.login
});

export default withRouter(connect(mapStateToProps, null)(PhotoDetail));
