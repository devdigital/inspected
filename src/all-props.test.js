import allProps from './all-props'

describe('allProps', () => {
  it('throws exception given undefined predicate', () => {
    expect(allProps()).toThrow('No predicate specified.')
  })

  it('throws exception given undefined object', () => {
    expect(() => allProps(p => true)()).toThrow('No object specified.')
  })

  it('throws exception given null object', () => {
    expect(() => allProps(p => true)(null)).toThrow('No object specified.')
  })

  it('returns true for empty object', () => {
    expect(allProps(p => true)({})).toBe(true)
  })

  it('returns false for non matching predicate', () => {
    expect(allProps(p => p === 'foo')({ foo: 'bar' })).toBe(false)
  })

  it('returns true for all matching predicate and empty object', () => {
    expect(allProps(p => true)({})).toBe(true)
  })

  it('returns true for null predicate value and empty object', () => {
    expect(allProps(p => !p)({})).toBe(true)
  })

  it('returns false for value not matched by one prop', () => {
    expect(allProps(p => p === 0)({ foo: 0, bar: 1 })).toBe(false)
  })

  it('returns true for object with matching prop', () => {
    expect(allProps(p => p === 0)({ foo: 0 })).toBe(true)
  })

  it('returns true for object with multiple props', () => {
    expect(allProps(p => p === 0)({ foo: 0, bar: 0 })).toBe(true)
  })

  it('returns false for nested prop not matching value', () => {
    expect(allProps(p => p === 0)({ foo: 0, bar: { baz: 1 } })).toBe(false)
  })

  it('returns true for nested props matching value', () => {
    expect(
      allProps(p => p === 0)({
        foo: 0,
        bar: { baz: 0 },
        baz: { foo: { baz: 0 } },
      })
    ).toBe(true)
  })
})
