import equateProps from './equate-props'

describe('equateProps', () => {
  it('throws exception given undefined object', () => {
    expect(equateProps()).toThrow('No object specified.')
  })

  it('throws exception given null object', () => {
    expect(() => equateProps()(null)).toThrow('No object specified.')
  })

  it('returns true for undefined value, empty object', () => {
    expect(equateProps()({})).toBe(true)
  })

  it('returns true for null value, empty object', () => {
    expect(equateProps(null)({})).toBe(true)
  })

  it('returns false for undefined value, object with prop', () => {
    expect(equateProps()({ foo: 'bar' })).toBe(false)
  })

  it('returns false for null value, object with prop', () => {
    expect(equateProps(null)({ foo: 'bar' })).toBe(false)
  })

  it('returns true for non nil value and empty object', () => {
    expect(equateProps(0)({})).toBe(true)
  })

  it('returns true for undefined value and empty object', () => {
    expect(equateProps()({})).toBe(true)
  })

  it('returns true for null value and empty object', () => {
    expect(equateProps(null)({})).toBe(true)
  })

  it('returns false for value not matched by one prop', () => {
    expect(equateProps(0)({ foo: 0, bar: 1 })).toBe(false)
  })

  it('returns true for object with matching prop', () => {
    expect(equateProps(0)({ foo: 0 })).toBe(true)
  })

  it('returns true for object with multiple props', () => {
    expect(equateProps(0)({ foo: 0, bar: 0 })).toBe(true)
  })

  it('returns false for nested prop not matching value', () => {
    expect(equateProps(0)({ foo: 0, bar: { baz: 1 } })).toBe(false)
  })

  it('returns true for nested props matching value', () => {
    expect(
      equateProps(0)({ foo: 0, bar: { baz: 0 }, baz: { foo: { baz: 0 } } })
    ).toBe(true)
  })
})
