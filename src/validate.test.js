import validate from './validate'
import configure from './configure'
import isEmpty from 'ramda/src/isEmpty'
import compose from 'ramda/src/compose'
import all from 'ramda/src/all'
import not from 'ramda/src/not'
import curry from 'ramda/src/curry'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import always from 'ramda/src/always'
import isArray from './schema/is-array'
import isString from './schema/is-string'
import isRequired from './schema/is-required'

const logger = message => console.log(message)

describe('validate', () => {
  it('throws exception when given undefined schema', () => {
    expect(validate()).toThrow('No schema specified.')
  })

  it('throws exception when given null schema', () => {
    expect(validate(null)).toThrow('No schema specified.')
  })

  it('throws exception when given non object schema', () => {
    expect(validate(0)).toThrow('Schema is not a valid object.')
  })

  it('returns is valid when given valid object', () => {
    const schema = {
      name: [[isString, 'name must be a string']],
    }

    expect(validate(schema)({ name: 'foo' }).isValid).toEqual(true)
  })

  it('returns invalid when given empty object', () => {
    const schema = {
      name: [[isString, 'name must be a string']],
    }

    expect(validate(schema)({}).isValid).toBe(false)
  })

  it('returns object error when given undefined object', () => {
    expect(validate({})()).toEqual({
      isValid: false,
      errors: {
        property: {},
        object: {
          validObject: 'Invalid object.',
        },
      },
    })
  })

  it('returns object error when given null object', () => {
    expect(validate({})(null)).toEqual({
      isValid: false,
      errors: {
        property: {},
        object: {
          validObject: 'Invalid object.',
        },
      },
    })
  })

  it('returns object error when given non object', () => {
    expect(validate({})(false)).toEqual({
      isValid: false,
      errors: {
        property: {},
        object: {
          validObject: 'Invalid object.',
        },
      },
    })
  })

  it('returns invalid prop when given invalid object', () => {
    const schema = {
      name: [[isString, 'name must be a string']],
    }

    expect(validate(schema)({})).toEqual({
      isValid: false,
      errors: {
        property: {
          name: ['name must be a string'],
        },
        object: {},
      },
    })
  })

  it('returns additional prop as error by default', () => {
    expect(validate({})({ name: 'foo' })).toEqual({
      isValid: false,
      errors: {
        property: {
          name: ['Unexpected property.'],
        },
        object: {},
      },
    })
  })

  it('returns valid result for nested schemas', () => {
    const addressSchema = {
      street: [[isRequired(isString), 'street is required']],
    }

    const userSchema = {
      name: [[isRequired(isString), 'name is required']],
      address: addressSchema,
    }

    expect(
      validate(userSchema)({ name: 'foo', address: { street: 'bar' } })
    ).toEqual({
      isValid: true,
      errors: {
        property: {},
        object: {},
      },
    })
  })

  it('returns object errors when object rules applied', () => {
    const userSchema = {
      forename: [[isRequired(isString), 'forename is required']],
      surname: [[isRequired(isString), 'surname is required']],
    }

    const userRules = {
      forenameCannotEqualSurname: [
        [obj => obj.forename !== obj.surname, 'forename cannot equal surname'],
      ],
    }

    expect(
      validate(userSchema, userRules)({ forename: 'foo', surname: 'foo' })
    ).toEqual({
      isValid: false,
      errors: {
        property: {},
        object: {
          forenameCannotEqualSurname: ['forename cannot equal surname'],
        },
      },
    })
  })

  it('returns no object errors when object rules satisfied', () => {
    const userSchema = {
      forename: [[isRequired(isString), 'forename is required']],
      surname: [[isRequired(isString), 'surname is required']],
    }

    const userRules = {
      forenameCannotEqualSurname: [
        [obj => obj.forename !== obj.surname, 'forename cannot equal surname'],
      ],
    }

    expect(
      validate(userSchema, userRules)({ forename: 'foo', surname: 'bar' })
    ).toEqual({
      isValid: true,
      errors: {
        property: {},
        object: {},
      },
    })
  })

  it('returns invalid for missing required property', () => {
    const userSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    expect(validate(userSchema)({})).toEqual({
      errors: {
        object: {},
        property: {
          name: ['name is a required string'],
        },
      },
      isValid: false,
    })
  })

  it('returns valid for a collection of valid strings', () => {
    const notEmpty = compose(
      not,
      isEmpty
    )

    const isGreaterThan = curry((len, a) => a > len)
    const isLengthGreaterThan = len =>
      compose(
        isGreaterThan(len),
        prop('length')
      )

    const userSpec = [
      [
        items => all(isLengthGreaterThan(5), items),
        'Every item must have have at least 6 characters!',
      ],
    ]

    const validationRules = {
      id: [[notEmpty, 'id can not be empty']],
      users: userSpec,
    }

    const input = {
      id: 4,
      users: ['foobar', 'foobarbaz'],
    }

    expect(validate(validationRules)(input)).toEqual({
      errors: { object: {}, property: {} },
      isValid: true,
    })
  })

  it('returns invalid property errors on missing required array', () => {
    const optionsSchema = {
      specs: [[isRequired(isArray), 'specs is a required array']],
    }

    expect(validate(optionsSchema)({})).toEqual({
      errors: {
        object: {},
        property: { specs: ['specs is a required array'] },
      },
      isValid: false,
    })
  })

  it('returns valid for optional array of required name items when array is empty', () => {
    const itemSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    const optionsSchema = {
      specs: map(always(itemSchema)),
    }

    expect(validate(optionsSchema)({ specs: [] })).toEqual({
      errors: {
        object: {},
        property: {},
      },
      isValid: true,
    })
  })

  it('returns valid for optional array of required name items when array contains element with string name', () => {
    const itemSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    const optionsSchema = {
      specs: map(always(itemSchema)),
    }

    expect(validate(optionsSchema)({ specs: [{ name: 'foo' }] })).toEqual({
      errors: {
        object: {},
        property: {},
      },
      isValid: true,
    })
  })

  it('returns invalid for optional array of required name items when array contains element with integer name', () => {
    const itemSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    const optionsSchema = {
      specs: map(always(itemSchema)),
    }

    expect(validate(optionsSchema)({ specs: [{ name: 2 }] })).toEqual({
      errors: {
        object: {},
        property: {
          specs: {
            0: {
              name: ['name is a required string'],
            },
          },
        },
      },
      isValid: false,
    })
  })

  it('returns invalid for optional array of required name items when name property is missing', () => {
    const itemSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    const optionsSchema = {
      specs: map(always(itemSchema)),
    }

    const expected = {
      errors: {
        object: {},
        property: {
          specs: {
            0: {
              name: ['name is a required string'],
            },
          },
        },
      },
      isValid: false,
    }

    expect(validate(optionsSchema)({ specs: [{}] })).toEqual(expected)
  })

  it('returns valid for optional array of required name items when collection is missing', () => {
    const itemSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    const optionsSchema = {
      specs: v => (v ? map(always(itemSchema), v) : () => true),
    }

    const expected = {
      errors: {
        object: {},
        property: {},
      },
      isValid: true,
    }

    expect(validate(optionsSchema)({ specs: null })).toEqual(expected)
  })

  it('returns invalid for required array when collection is missing', () => {
    const itemSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    const optionsSchema = {
      specs: [
        [isRequired(isArray), 'specs is a required array'],
        [
          v => (v ? map(always(itemSchema), v) : () => true),
          'every spec must match the item schema',
        ],
      ],
    }

    const expected = {
      errors: {
        object: {},
        property: {
          specs: ['specs is a required array'],
        },
      },
      isValid: false,
    }

    expect(validate(optionsSchema)({ specs: null })).toEqual(expected)
  })
})
