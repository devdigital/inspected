import setProps from './set-props'

describe('setProps', () => {
  it('throws exception given undefined object', () => {
    expect(setProps()).toThrow('No object specified.')
  })

  it('throws exception given null object', () => {
    expect(() => setProps()(null)).toThrow('No object specified.')
  })

  it('returns empty object given empty object', () => {
    expect(setProps()({})).toEqual({})
  })

  it('returns props set to undefined when value is undefined', () => {
    expect(setProps()({ foo: 'bar' })).toEqual({ foo: undefined })
  })

  it('returns props set to null when value is null', () => {
    expect(setProps(null)({ foo: 'bar' })).toEqual({ foo: null })
  })

  it('returns props set to value', () => {
    expect(setProps(0)({ foo: 'bar', baz: 'foo' })).toEqual({ foo: 0, baz: 0 })
  })

  it('returns nested props set to value', () => {
    expect(setProps(0)({ foo: 'bar', baz: { foo: { bar: 'foo' } } })).toEqual({
      foo: 0,
      baz: { foo: { bar: 0 } },
    })
  })

  it('does not modify the object', () => {
    const value = {
      foo: 'bar',
    }

    setProps(0)(value)
    expect(value).toEqual({ foo: 'bar' })
  })
})
