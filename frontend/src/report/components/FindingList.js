import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import '../../font/components/FontItem';

import './FindingList.css';
import FontItem from '../../font/components/FontItem';
import { Divider } from '@material-ui/core';

class FindingList extends Component {
    // onFindingDetailClicked = (finding) => {
    //     this.props.history.push('/font/' + finding.font_id);
    // }

    render() {
        const items = this.props.findings.map(finding => {
            return <div key={finding.font.id} className="finding-item">
                <FontItem
                    font={ finding.font } probability={ finding.probability }
                />
                <Divider />
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