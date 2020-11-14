import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import PhotoReport from './PhotoReport';

jest.mock('axios')
jest.spyOn(window, 'alert');

describe('PhotoReport', () => {
	const pid = 3;
	const PhotoReportInner = PhotoReport;
	const mock_data = {
		photo: {
			memo: "TEST_MEMO",
			image_url: "TEST_URL",
			selected_font: {
				name: "TEST_NAME"
			}
		},
	}

	it('should attempt to fetch photo report', (done) => {
		axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
			expect(url).toEqual(`/api/photo/${pid}`);
			rej(); done();
		}));

		const comp = shallow(<PhotoReportInner photo_id={pid} />, 
			{ disableLifecycleMethods: false })

	})

	it('should display all required items', () => {
		axios.get.mockResolvedValueOnce({ data: mock_data })
		const comp = shallow(<PhotoReportInner photo_id={pid} />, 
			{ disableLifecycleMethods: false })
		expect(comp.find(".PhotoReport img").length).toBe(1);
		expect(comp.find(".PhotoReport .memo").length).toBe(1);
	})


})