import isString from './is-string'

describe('isString', () => {
  it('returns false for undefined', () => {
    expect(isString()).toBe(false)
  })

  it('returns false for null', () => {
    expect(isString(null)).toBe(false)
  })

  it('returns false for number', () => {
    expect(isString(0)).toBe(false)
  })

  it('returns false for object', () => {
    expect(isString({})).toBe(false)
  })

  it('returns false for boolean', () => {
    expect(isString(false)).toBe(false)
  })

  it('returns false for array', () => {
    expect(isString([])).toBe(false)
  })

  it('returns false for function', () => {
    expect(isString(() => {})).toBe(false)
  })

  it('returns true for empty string', () => {
    expect(isString('')).toBe(true)
  })

  it('returns true for string', () => {
    expect(isString('foo')).toBe(true)
  })
})
