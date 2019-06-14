import isRequired from './is-required'
import isBoolean from './is-boolean'
import isString from './is-string'
import isArray from './is-array'
import isObject from './is-object'

describe('isRequired', () => {
  it('throws exception when no predicate', () => {
    expect(isRequired()).toThrow('No predicate provided.')
  })

  it('returns false for undefined', () => {
    expect(isRequired(isBoolean)()).toBe(false)
  })

  it('returns false for null', () => {
    expect(isRequired(isBoolean)(null)).toBe(false)
  })

  it('returns true for boolean false', () => {
    expect(isRequired(isBoolean)(false)).toBe(true)
  })

  it('returns true for boolean true', () => {
    expect(isRequired(isBoolean)(true)).toBe(true)
  })

  it('returns false for non boolean', () => {
    expect(isRequired(isBoolean)('')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isRequired(isString)('')).toBe(false)
  })

  it('returns true for string', () => {
    expect(isRequired(isString)('foo')).toBe(true)
  })

  it('returns false for boolean', () => {
    expect(isRequired(isString)(false)).toBe(false)
  })

  it('returns true for empty array', () => {
    expect(isRequired(isArray)([])).toBe(true)
  })

  it('returns true for populated array', () => {
    expect(isRequired(isArray)([0])).toBe(true)
  })

  it('returns true for empty object', () => {
    expect(isRequired(isObject)({})).toBe(true)
  })

  it('returns true for populated object', () => {
    expect(isRequired(isObject)({ foo: 'bar' })).toBe(true)
  })
})
