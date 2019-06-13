import isOptional from './is-optional'
import isBoolean from './is-boolean'
import isString from './is-string'
import isObject from './is-object'
import isArray from './is-array'

describe('isOptional', () => {
  it('throws exception when no predicate', () => {
    expect(isOptional()).toThrow('No predicate provided.')
  })

  it('returns true for undefined', () => {
    expect(isOptional(isBoolean)()).toBe(true)
  })

  it('returns true for null', () => {
    expect(isOptional(isBoolean)(null)).toBe(true)
  })

  it('returns true for boolean false', () => {
    expect(isOptional(isBoolean)(false)).toBe(true)
  })

  it('returns true for boolean true', () => {
    expect(isOptional(isBoolean)(true)).toBe(true)
  })

  it('returns false for non boolean', () => {
    expect(isOptional(isBoolean)('')).toBe(false)
  })

  it('returns true for empty string', () => {
    expect(isOptional(isString)('')).toBe(true)
  })

  it('returns true for empty object', () => {
    expect(isOptional(isObject)({})).toBe(true)
  })

  it('returns true for empty array', () => {
    expect(isOptional(isArray)([])).toBe(true)
  })

  it('returns true for string', () => {
    expect(isOptional(isString)('foo')).toBe(true)
  })

  it('returns false for boolean', () => {
    expect(isOptional(isString)(false)).toBe(false)
  })
})
