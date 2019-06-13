import isBoolean from './is-boolean'

describe('isBoolean', () => {
  it('returns false for undefined', () => {
    expect(isBoolean()).toBe(false)
  })

  it('returns false for null', () => {
    expect(isBoolean(null)).toBe(false)
  })

  it('returns false for number', () => {
    expect(isBoolean(0)).toBe(false)
  })

  it('returns false for object', () => {
    expect(isBoolean({})).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isBoolean('')).toBe(false)
  })

  it('returns false for string', () => {
    expect(isBoolean('foo')).toBe(false)
  })

  it('returns false for function', () => {
    expect(isBoolean(() => {})).toBe(false)
  })

  it('returns false for array', () => {
    expect(isBoolean([])).toBe(false)
  })

  it('returns false for populated array', () => {
    expect(isBoolean([0])).toBe(false)
  })

  it('returns true for boolean false', () => {
    expect(isBoolean(false)).toBe(true)
  })

  it('returns true for boolean true', () => {
    expect(isBoolean(true)).toBe(true)
  })
})
