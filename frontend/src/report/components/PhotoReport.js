import React, {Component} from 'react';
import axios from 'axios';
import { CircularProgress, Paper, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

import FindingList from './FindingList';

class PhotoReport extends Component {
    state = {
		loaded: false,
		findings: null,
		error: null
    }

	startReportPoll() {
		const timeout = 1000; // in milliseconds

		this.poll_timer = null;

		const poll = function() {
			console.log("poll");
			this.poll_timer = null;
			axios.get(`/api/photo/${this.props.photo_id}/report`)
			.then((resp) => {
				if (resp.data.findings === null) {
					this.poll_timer = setTimeout(poll, timeout);
					return;
				}
				this.setState({
					loaded: true,
					findings: resp.data.findings.map((finding) => (
						{
							font_id: finding.font.id,
							font_name: finding.font.name,
							probability: finding.probability,
							is_free: finding.font.is_free,
							license_summary: finding.font.license_summary,
						}
					))
				});
			})
			.catch((err) => {
				this.setState({ error: `Error polling reports: ${err}`});
			});
		}.bind(this);

		this.poll_timer = setTimeout(poll, timeout);
	}

	onInit() {
		if (this.props.report) {
			this.setState({ report: this.props.report });
		} else {
			this.startReportPoll();
		}
    }

    componentDidMount() {
        this.onInit();
    }

	componentWillUnmount() {
		if (this.poll_timer) {
			clearTimeout(this.poll_timer);
		}
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

		return (this.state.loaded ? (
			<Paper className="report-list">
				<FindingList findings={ this.state.findings } />
			</Paper>) : (
			<Paper className="report-pending" elevation={4}>
				<CircularProgress /> <br />
				<Typography variant="caption">
					Loading analysis results. Please wait.
				</Typography>
			</Paper>)
		);
    }
}

export default PhotoReport;