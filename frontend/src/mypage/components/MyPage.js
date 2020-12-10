import { Box, Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ArticleList from '../../article/components/ArticleList';
import PhotoList from '../../photo/components/PhotoList';

import './MyPage.css';

class MyPage extends Component {
    render() {
        return (
        <div className="my-page">
            <Paper className="my-photo">
                <Grid container className="section-title" justify="space-between">
                    <Typography variant="h4">My Photos</Typography>
                    <Button variant="contained" color="primary" onClick={ () => this.props.history.push('/my-page/photo/') }>
                        Manage
                    </Button>
                </Grid>
                <PhotoList trunc={6} fetchEndpoint="/api/my-page/photo" isUploadAvailabe isDeleteAvailabe />
            </Paper>

            <Paper className="my-article">
                <Grid container className="section-title" justify="flex-start">
                    <Typography variant="h4">My Articles</Typography>
                </Grid>
                <ArticleList fetchEndpoint="/api/my-page/article" />
            </Paper>
        </div>
        );
    }
}

export default withRouter(MyPage);
