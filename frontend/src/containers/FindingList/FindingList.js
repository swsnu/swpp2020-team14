import React, {Component} from 'react';

import { connect } from 'react-redux';

import { withRouter } from 'react-router';

class FindingList extends Component {
    state = {
        photo_id = this.props.match.params.id,
        findings: [],
        selected_font: 0
    }

    componentDidMount() {
        this.onInit()
    }

    onInit() {
        this.props.onGetReport();
        this.props.storedReport.filter(finding => {
            return finding.photo_id ===  this.state.photo_id
        }).then((finding) => {
            this.state.findings.append({
                font_id: finding.font_id,
                font_name: finding.font_name,
                probability: finding.probability,
                is_free: finding.is_free,
                license_summary: finding.license_summary,
            })
        })
            
            
    }

    onFindingDetailClicked = (finding) => {
        this.props.history.push('/font/' + finding.font_id);
    }

    onRadioClicked = (finding) => {
        this.props.putPhoto(finding.photo_id)
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

const mapStateToProps = state => {
    return {
        selected_font = state.report.selected_font,
        storedReport = state.report.findings
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetReport: () => dispatch(actionCreators.getReport()),
        onPutPhoto: (id) => dispatch(actionCreators.putPhoto(id)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FindingList));