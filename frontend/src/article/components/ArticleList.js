import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import PageButtonArray from '../../common/pagination';

import './ArticleList.css';
import { Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';

class ArticleList extends Component {
  state = {
    list: null,
    pages: -1,  // number of pages
    cur: -1,    // current page
  }

  onInit() { this.onBrowsePage(1); }

  onBrowsePage(n) {
    this.setState({list: null});
    axios.get(`${this.props.fetchEndpoint}?page=${n}`)
      .then((resp) => {
        this.setState({
          list: resp.data.list,
          pages: resp.data.pages,
          cur: resp.data.cur
        });
      })
      .catch((err) => {
        alert("Error loading article list: " + err);
      });
  }

  componentDidMount() { this.onInit(); }

  render() {
    if (this.state.list === null) {
      return <p className="loading">Loading article list...</p>
    }

    const items = this.state.list.map(a => {
      const title_btn = (a.comment_count > 0 ?
        (<Typography variant="h5"><b>{a.title}</b> [{a.comment_count}]</Typography>) :
        (<Typography variant="h5">{a.title}</Typography>));

      return (<ListItem key={a.id} button onClick={(e)=>this.props.history.push(`/article/${a.id}`)}>
        <Grid className="row" container direction="row" alignItems="center" spacing={3}>
          <Grid item container xs={1} justify="flex-end" className="td id">
            <Typography>#{a.id}</Typography>
          </Grid>
          <Grid item xs={8} className="td title">
            <ListItemText primary={ title_btn } secondary={ a.preview + '...' } />
          </Grid>
          <Grid item container xs={3} justify="flex-end" className="td author">
            <Typography>{a.author_name}</Typography>
          </Grid>
        </Grid>
      </ListItem>);
    });

    return <div className="article-list">
      <List>{items}</List>
      <PageButtonArray n={this.state.pages}
        cur={this.state.cur} onclick={(i)=>this.onBrowsePage(i)} />
    </div>
  }
}

export default withRouter(ArticleList);

