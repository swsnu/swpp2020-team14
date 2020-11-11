import React, {Component} from 'react';
import axios from 'axios';

class PhotoReport extends Component {
    state = {
		image_url: null,
		selected_font: null,
		memo: ''
    }

	onInit() {
		axios.get(`/api/photo/${this.props.photo_id}`)
		.then((resp) => {
			console.log(resp);
			this.setState({ 
				memo: resp.data.photo.memo,
				image_url: resp.data.photo.image_url,
				selected_font: resp.data.photo.selected_font
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
                <img src={this.state.image_url} alt="uploaded"/>
				
				<div className='memo'>
					{this.state.memo}
				</div>
            </div>
        )
    }
}
export default PhotoReport;