import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

class FindingList extends Component {
    state = {
        photo_id = this.props.match.params.id,
        findings: null,
		selected_font: null
    }

	onInit() {

		axios.get(`api/report/${this.state.photo_id}`)
		.then((resp) => {
			console.log(resp);
			const newFindings = resp.map((finding) => {
				return {
					font_id: finding.font.font_id,
					font_name: finding.font.font_name,
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
    }

    componentDidMount() {
        this.onInit()
    }

    onFindingDetailClicked = (finding) => {
        this.props.history.push('/font/' + finding.font_id);
    }

    onRadioClicked = (finding) => {
		const newPhoto = {}
		axios.put(`/api/photo/${this.state.photo_id}`, newPhoto)
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
        const findings = this.state.findings.map((finding) => {
            return ( 
                <div className='Finding' onClick={() => this.onFindingDetailClicked(finding)}>
                    {finding.font_name}
                    <input type="radio" id="selected-finding" 
                        onClick={() => this.onRadioClicked(finding)} />
                </div>
            )
        })

        return (
            <div className='FindingList'>
                {photo.image_file}
                <div className="findings">{findings}</div>
            </div>
        )
    }
}
export default withRouter(FindingList);