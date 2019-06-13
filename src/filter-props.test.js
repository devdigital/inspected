import filterProps from './filter-props'

describe('filterProps', () => {
  it('throws exception given undefined predicate', () => {
    expect(filterProps()).toThrow('No predicate specified.')
  })

  it('throws exception given null predicate', () => {
    expect(filterProps(null)).toThrow('No predicate specified.')
  })

  it('throws exception given non function predicate', () => {
    expect(filterProps({})).toThrow('Predicate is not a function.')
  })

  it('throws exception given undefined object', () => {
    expect(() => filterProps(() => true)()).toThrow('No object specified.')
  })

  it('throws exception given null object', () => {
    expect(() => filterProps(() => true)(null)).toThrow('No object specified.')
  })

  it('returns all props given a inclusive predicate', () => {
    expect(filterProps(() => true)({ foo: 'bar' })).toEqual({ foo: 'bar' })
  })

  it('returns filtered props given filtering predicate', () => {
    expect(
      filterProps(prop => prop === 'bar')({ foo: 'bar', baz: 'foo' })
    ).toEqual({ foo: 'bar' })
  })

  it('returns filtered nested props given filtering predicate', () => {
    expect(
      filterProps(prop => prop === 'bar')({
        foo: 'bar',
        baz: { bar: { foo: 'bar', baz: 'foo' } },
      })
    ).toEqual({
      foo: 'bar',
      baz: { bar: { foo: 'bar' } },
    })
  })

  it('does not modify object', () => {
    const value = {
      foo: 'bar',
      baz: 'foo',
    }

    filterProps(prop => prop === 'bar')(value)
    expect(value).toEqual({ foo: 'bar', baz: 'foo' })
  })
})
