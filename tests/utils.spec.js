import * as utils from '../src/utils'

test('isNullOrUndefined > returns true for null and undefined', () => {
    expect(utils.isNullOrUndefined(null)).toBeTruthy()
    expect(utils.isNullOrUndefined(undefined)).toBeTruthy()
})

test('isNullOrUndefined > returns false for non null or undefined', () => {
    expect(utils.isNullOrUndefined('')).toBeFalsy()
    expect(utils.isNullOrUndefined(10)).toBeFalsy()
})