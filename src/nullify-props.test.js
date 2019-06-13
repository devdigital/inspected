import nullifyProps from './nullify-props'

describe('nullifyProps', () => {
  it('throws exception given undefined', () => {
    expect(nullifyProps).toThrow('No object specified.')
  })

  it('throws exception given null', () => {
    expect(() => nullifyProps(null)).toThrow('No object specified.')
  })

  it('throws exception given non object', () => {
    expect(() => nullifyProps(0)).toThrow('Value is not a valid object.')
  })

  it('returns {} for empty object', () => {
    expect(nullifyProps({})).toEqual({})
  })

  it('returns null properties for object', () => {
    const value = {
      foo: 'bar',
      baz: {
        bar: 'foo',
      },
    }

    expect(nullifyProps(value)).toEqual({
      foo: null,
      baz: {
        bar: null,
      },
    })
  })

  it('does not modify the object', () => {
    const value = {
      foo: 'bar',
    }

    nullifyProps(value)
    expect(value).toEqual({
      foo: 'bar',
    })
  })
})
