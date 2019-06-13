import configure from './configure'

describe('configure', () => {
  it('throws exception when given undefined options', () => {
    expect(() => configure()).toThrow('Options not specified.')
  })

  it('throws exception when given null options', () => {
    expect(() => configure()).toThrow('Options not specified.')
  })

  it('throws exception when given non object options', () => {
    expect(() => configure(false)).toThrow('Options is not a valid object.')
  })

  it('returns is valid if ignore additional props specified', () => {
    const validate = configure({ additionalProps: { ignore: true } })
    expect(validate({})({ name: 'foo' })).toEqual({
      isValid: true,
      errors: { property: {}, object: {} },
    })
  })

  it('returns specified additional property error message', () => {
    const validate = configure({ additionalProps: { message: 'bar' } })
    expect(validate({})({ name: 'foo' })).toEqual({
      isValid: false,
      errors: {
        property: {
          name: ['bar'],
        },
        object: {},
      },
    })
  })

  it('returns specified object error property and message', () => {
    const validate = configure({
      invalidObject: { property: 'foo', message: 'bar' },
    })

    expect(validate({})(false)).toEqual({
      isValid: false,
      errors: {
        property: {},
        object: {
          foo: 'bar',
        },
      },
    })
  })
})
