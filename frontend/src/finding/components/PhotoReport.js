import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

class PhotoReport extends Component {
    state = {
		image_file: null,
		selected_font: null,
		memo: ''
    }

	onInit() {
		axios.get(`/api/my-page/photo/${this.props.photo_id}`)
		.then((resp) => {
			console.log(resp);
			this.setState({ 
				...this.state, 
				selected_font: resp.data.selected_font, 
				memo: resp.data.memo,
			})
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

    render() {
        return (
            <div className='PhotoReport'>
                {this.state.image_file}
				{this.state.memo}
            </div>
        )
    }
}
export default PhotoReport;