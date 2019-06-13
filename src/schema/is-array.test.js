import isArray from './is-array'

describe('isArray', () => {
  it('returns false for undefined', () => {
    expect(isArray()).toBe(false)
  })

  it('returns false for null', () => {
    expect(isArray(null)).toBe(false)
  })

  it('returns false for number', () => {
    expect(isArray(0)).toBe(false)
  })

  it('returns false for object', () => {
    expect(isArray({})).toBe(false)
  })

  it('returns false for boolean', () => {
    expect(isArray(false)).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isArray('')).toBe(false)
  })

  it('returns false for string', () => {
    expect(isArray('foo')).toBe(false)
  })

  it('returns false for function', () => {
    expect(isArray(() => {})).toBe(false)
  })

  it('returns true for array', () => {
    expect(isArray([])).toBe(true)
  })

  it('returns true for populated array', () => {
    expect(isArray([0])).toBe(true)
  })
})
