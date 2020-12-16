import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import './FindingList.css';

class FindingList extends Component {
    onFindingDetailClicked = (finding) => {
        this.props.history.push('/font/' + finding.font_id);
    }

    render() {
        const items = this.props.findings.map(finding => {
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
                    </tr>
                    </thead>
                    <tbody>{items}</tbody>
                </table>
            </div>
        )
    }
}
export default withRouter(FindingList);