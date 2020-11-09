import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

class FindingList extends Component {
    state = {
		findings: null,
		image_file: null,
		selected_font: null,
		memo: ''
    }

	onInit() {

		axios.get(`/api/my-page/photo/${this.props.photo_id}/report`)
		.then((resp) => {
			console.log(resp);
			const newFindings = resp.data.list.map((finding) => {
				return {
					font_id: finding.font.id,
					font_name: finding.font.name,
					probability: finding.probability,
					is_free: finding.font.is_free,
					license_summary: finding.font.license_summary,
				}
			})
			this.setState({ ...this.state, findings: newFindings})
		})
		.catch((err) => {
			console.log(err);
			alert(err);
			window.location.reload(false);
		})

		axios.get(`/api/my-page/photo/${this.props.photo_id}`)
		.then((resp) => {
			console.log(resp);
			const photo = resp.data;
			this.setState({ ...this.state, selected_font: photo.selected_font})

		})
		.catch((err) => {
			console.log(err);
		  	alert(err);
		  	window.location.reload(false);
		});
    }

    componentDidMount() {
        this.onInit()
    }

    onFindingDetailClicked = (finding) => {
        this.props.history.push('/font/' + finding.font_id);
    }

    onRadioClicked = (finding) => {
		const newPhoto = {}
		axios.put(`/api/my-page/photo/${this.props.photo_id}`, newPhoto)
		.then((resp) => {
			console.log(resp);
			this.setState({
				...this.state, selected_font: resp.selected_font
			})
		})
		.catch((err) => {
			console.log(err);
		  	alert(err);
		  	window.location.reload(false);
		});

    }

    render() {
		if (this.state.findings === null) {
			return <p className="loading">Loading report...</p>
		}
		if (this.state.selected_font === null) {
			return <p className="loading">Loading photo...</p>
		}

        const findings = this.state.findings.map((finding) => {
            return ( 
                <div className='Finding' onClick={() => this.onFindingDetailClicked(finding)}>
                    <h4>{finding.font_name}</h4>
					<h4>{finding.probability}</h4>
					<input type="radio" 
						id="selected-finding" 
						name="finding"
						checked={this.state.selected_font.id === finding.font_id}
                        onClick={() => this.onRadioClicked(finding)} />
                </div>
            )
        })

        return (
            <div className='FindingList'>
                {findings}
            </div>
        )
    }
}
export default FindingList;