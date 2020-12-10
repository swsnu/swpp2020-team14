import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import './FindingList.css';

class FindingList extends Component {
    state = {
        findings: null,
        image_file: null,
        selected_font: null,
        memo: '',
        loaded_report: false,
        loaded_image: false
    }

    onInit() {

        axios.get(`/api/photo/${this.props.photo_id}/report`)
        .then((resp) => {
            const newFindings = resp.data.findings.map((finding) => {
                return {
                    font_id: finding.font.id,
                    font_name: finding.font.name,
                    probability: finding.probability,
                    is_free: finding.font.is_free,
                    license_summary: finding.font.license_summary,
                }
            })
            this.setState({ loaded_report: true, findings: newFindings })
        })
        .catch((err) => {
            alert(err);
        })

        axios.get(`/api/photo/${this.props.photo_id}`)
        .then((resp) => {
            const photo = resp.data.photo;
            this.setState({ loaded_image: true, selected_font: photo.selected_font && photo.selected_font.id })

        })
        .catch((err) => {
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
            this.setState({
                selected_font: finding.font_id
            })
        })
        .catch((err) => {
              alert(err);
        });

    }

    render() {
        if (!this.state.loaded_report) {
            return <p className="loading">Loading report...</p>
        }
        if (!this.state.loaded_image) {
            return <p className="loading">Loading photo...</p>
        }
        
        const items = this.state.findings.map(finding => {
            return <tr key={finding.font_id}>
                <td className="font-name" onClick={() => this.onFindingDetailClicked(finding)}>
                    {finding.font_name}
                </td>
                <td className="probability" style={{
                    background: `rgba(0, 100, 0, ${0.05 + 0.95*finding.probability})`
                }}>
                    {(finding.probability*100).toFixed(2)}%
                </td>
                <td className="license">
                    {(finding.is_free ?
                        <span className="license-free">Free</span> : 
                        <span className="license-nonfree">Proprietary ({finding.license_summary})</span>)}
                </td>
                <td className="is-selected">
                    <input type="radio"
                        id="selected-finding" 
                        name="finding"
                        checked={this.state.selected_font === finding.font_id}
                        onClick={() => this.onRadioClicked(finding)} />
                </td>
            </tr>
        })

        return (
            <div className='finding-list' >
                    <table className="font-list-table">
                        <thead>
                        <tr>
                            <th className="font-name">Name</th>
                            <th className="probability">probability</th>
                            <th className="license">License</th>
                            <th className="is-selected">Select</th>
                        </tr>
                        </thead>
                        <tbody>{items}</tbody>
                    </table>
                </div>
        )
    }
}
export default withRouter(FindingList);