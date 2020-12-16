import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import '../../font/components/FontItem';

import './FindingList.css';
import FontItem from '../../font/components/FontItem';

class FindingList extends Component {
    onFindingDetailClicked = (finding) => {
        this.props.history.push('/font/' + finding.font_id);
    }

    render() {
        const items = this.props.findings.map(finding => {
            return <div key={finding.font.id}>
                <FontItem expanded
                    font={ finding.font } probability={ finding.probability }
                    className="finding-item"
                />
            </div>
        })

        return (
            <div className='finding-list'>
                {items}
            </div>
        )
    }
}
export default withRouter(FindingList);