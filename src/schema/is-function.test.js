import isFunction from './is-function'

describe('isFunction', () => {
  it('returns false for undefined', () => {
    expect(isFunction()).toBe(false)
  })

  it('returns false for null', () => {
    expect(isFunction(null)).toBe(false)
  })

  it('returns false for number', () => {
    expect(isFunction(0)).toBe(false)
  })

  it('returns false for object', () => {
    expect(isFunction({})).toBe(false)
  })

  it('returns false for boolean', () => {
    expect(isFunction(false)).toBe(false)
  })

  it('returns false for array', () => {
    expect(isFunction([])).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isFunction('')).toBe(false)
  })

  it('returns false for string', () => {
    expect(isFunction('foo')).toBe(false)
  })

  it('returns true for function', () => {
    expect(isFunction(() => {})).toBe(true)
  })
})
