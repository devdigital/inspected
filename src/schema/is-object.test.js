import isObject from './is-object'

describe('isObject', () => {
  it('returns false for undefined', () => {
    expect(isObject()).toBe(false)
  })

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('returns false for number', () => {
    expect(isObject(0)).toBe(false)
  })

  it('returns false for boolean', () => {
    expect(isObject(false)).toBe(false)
  })

  it('returns false for array', () => {
    expect(isObject([])).toBe(false)
  })

  it('returns false for function', () => {
    expect(isObject(() => {})).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isObject('')).toBe(false)
  })

  it('returns false for string', () => {
    expect(isObject('foo')).toBe(false)
  })

  it('returns true for empty object', () => {
    expect(isObject({})).toBe(true)
  })

  it('returns true for object', () => {
    expect(isObject({ foo: 'bar' })).toBe(true)
  })
})
