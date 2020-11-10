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

		axios.get(`/api/photo/${this.props.photo_id}/report`)
		.then((resp) => {
			console.log(resp);
			const newFindings = resp.data.findings.map((finding) => {
				return {
					font_id: finding.font.id,
					font_name: finding.font.name,
					probability: finding.probability,
					is_free: finding.font.is_free,
					license_summary: finding.font.license_summary,
				}
			})
			this.setState({ findings: newFindings })
		})
		.catch((err) => {
			console.log(err);
			alert(err);
		})

		axios.get(`/api/photo/${this.props.photo_id}`)
		.then((resp) => {
			console.log(resp);
			const photo = resp.data.photo;
			this.setState({ selected_font: photo.selected_font.id })

		})
		.catch((err) => {
			console.log(err);
		  	alert(err);
		});
    }

    componentDidMount() {
        this.onInit()
    }

    onFindingDetailClicked = (finding) => {
        this.props.history.push('/font/' + finding.font_id);
    }

    onRadioClicked = (finding) => {
		const payload = new FormData();
		payload.append("selected_font", finding.font_id)
		
		axios.patch(`/api/photo/${this.props.photo_id}`, payload)
		.then((resp) => {
			console.log(resp);
			this.setState({
				selected_font: finding.font_id
			})
		})
		.catch((err) => {
			console.log(err);
		  	alert(err);
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
                <div className='Finding' >
                    <h4 onClick={() => this.onFindingDetailClicked(finding)}>
						{finding.font_name} </h4>
					<h4>{finding.probability}</h4>
					<input type="radio" 
						id="selected-finding" 
						name="finding"
						checked={this.state.selected_font === finding.font_id}
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
export default withRouter(FindingList);