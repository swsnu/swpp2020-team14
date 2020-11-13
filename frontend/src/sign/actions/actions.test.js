import { UPDATE_LOGIN } from './actionTypes';
import { updateLogin } from './actions'

const stubData = "TEST_DATA"

describe("updateLogin", () => {
	it('should return proper action', () => {
		const newAction = updateLogin(stubData)
		expect(newAction).toEqual({
			type: UPDATE_LOGIN,
			data: stubData
		})
	})
})