import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Grid, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import './FontItem.css';

class FontItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: !!this.props.expanded
        };
    }

    handleChange(e, status) { this.setState({ isExpanded: status }); }

    render() {
        const font = this.props.font;
        const has_prob = (this.props.probability !== undefined);
        const prob_actual = (has_prob ? this.props.probability : 0.0);

        const prob_str = (prob_actual * 100).toFixed(2) + '%';

        const r = 0.01;
        const prob_revised = r + (1-r) * prob_actual;
        const prob_revised_str = (prob_revised * 100).toFixed(2) + '%';

        return (<Accordion className="font-item"
            expanded={ this.state.isExpanded }
            onChange={ this.handleChange.bind(this) }>
            <AccordionSummary>
                <Container>
                    { has_prob && <div className="bar-bg" style={ {
                        width: prob_revised_str
                    } }/> }
                    <Grid container className="bar-fg">
                        <Grid item xs={8} className="col-name">
                            <Typography variant="h5">
                                { font.name }
                            </Typography>
                        </Grid>
                        { this.props.probability !== undefined && 
                        <Grid item xs={3} className="col-prob">
                            <Typography variant="h5">
                                { prob_str }
                            </Typography>
                        </Grid> }
                        <Grid item xs={1} className="col-fold">
                            { this.state.isExpanded ?
                                <KeyboardArrowUpIcon /> :
                                <KeyboardArrowDownIcon /> }
                        </Grid>
                    </Grid>
                </Container>
            </AccordionSummary>
            <AccordionDetails>
                <div className="detail">
                    <Typography variant="h6" align="left">Sample</Typography>
                    <img
                        className="sample"
                        src={`/static/font-samples/${font.name}.png`} />
                    <div style={ { textAlign: 'right' }}>
                        <Button
                            onClick={() => this.props.history.push(`/font/${font.id}`)}
                            variant="contained"
                            color="secondary"
                            >
                            Details <ArrowForwardIcon />
                        </Button>
                    </div>
                </div>
            </AccordionDetails>
            </Accordion>
        )
    }
}

export default withRouter(FontItem);