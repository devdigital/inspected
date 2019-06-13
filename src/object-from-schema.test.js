import objectFromSchema from './object-from-schema'
import isRequired from './schema/is-required'
import isString from './schema/is-string'
import map from 'ramda/src/map'
import always from 'ramda/src/always'

describe('objectFromSchema', () => {
  it('throws exception given undefined schema', () => {
    expect(() => objectFromSchema()).toThrow('No schema specified.')
  })

  it('expands simple schema', () => {
    const schema = {
      foo: 4,
      bar: 'baz',
    }

    expect(objectFromSchema(schema)).toEqual({
      foo: null,
      bar: null,
    })
  })

  it('expands empty array to null', () => {
    const schema = {
      foo: [],
    }

    expect(objectFromSchema(schema)).toEqual({
      foo: null,
    })
  })

  it('expands array of objects', () => {
    const schema = {
      foo: [{ name: 'foo', bar: 'baz' }, { baz: 'foo' }],
    }

    expect(objectFromSchema(schema)).toEqual({
      foo: [{ name: null, bar: null }, { baz: null }],
    })
  })

  it('expands array of tuples', () => {
    const schema = {
      name: [[() => false, 'foo'], [() => false, 'bar']],
    }

    expect(objectFromSchema(schema)).toEqual({
      name: null,
    })
  })

  it('throws if schema contains function and no source object provided', () => {
    const itemSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    const optionsSchema = {
      specs: map(always(itemSchema)),
    }

    expect(() => objectFromSchema(optionsSchema)).toThrow(
      'Schema contains function, but no source object specified.'
    )
  })

  it('expands schema containing function when source object provided', () => {
    const itemSchema = {
      name: [[isRequired(isString), 'name is a required string']],
    }

    const optionsSchema = {
      specs: map(always(itemSchema)),
    }

    expect(objectFromSchema(optionsSchema, { specs: [{}] })).toEqual({
      specs: [{ name: null }],
    })
  })
})
