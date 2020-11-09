import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';


class MyPage extends Component {
	state = {
		article_list: null,
		photo_list: null,
	}

	onInit() {
		this.onBrowsePage(1);
	}

	onBrowsePage(n) {
		this.setState({list: null});
		axios.get(`/api/article?page=${n}`)
			.then((resp) => {
				this.setState({
					list: resp.data.list,
				});
			})
			.catch((err) => {
				alert(err);
				window.location.reload(false);
			});

		axios.get(`/api/my-page/photo`)
			.then((resp) => {
				this.setState({
					list: resp.data.list,
				});
			})
			.catch((err) => {
				alert(err);
				window.location.reload(false);
			});
	}

	componentDidMount() {
		this.onInit();
	}

	render() {
		if (this.state.article_list === null) {
			return <p className="loading">Loading article list...</p>
		}

		if (this.state.photo_list === null) {
			return <p className="loading">Loading photo list...</p>
		}

		const articles = this.state.article_list.map(f => {
			return <tr key={f.id}>
				<td className="name">
					<button onClick={(e)=>
						this.props.history.push(`/article/${f.id}`)}>
						{f.title}</button></td>
			</tr>
		});

		const photos = this.state.photo_list.map(f => {
			return <tr key={f.id}>
				<td className="name">
					<button onClick={(e)=>
						this.props.history.push(`/my-page/photo/${f.id}`)}>
						{f.image_file}</button></td>
			</tr>
		});

		return <div className="my-page">
			<div className="articles">
				{articles}
			</div>
			<div className="photos">
				{photos}
			</div>
		</div>
	}
};

export default withRouter(MyPage);

