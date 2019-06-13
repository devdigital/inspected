import isFunction from './schema/is-function'
import isArray from './schema/is-array'
import isNil from './schema/is-nil'
import isObject from './schema/is-object'
import setProps from './set-props'
import deepmerge from 'deepmerge'

// for each schema property that is a function,
// invoke the function with the corresponding object value
// and assign to the schema property
const objectFromSchema = (schema, obj) => {
  if (isNil(schema)) {
    throw new Error('No schema specified.')
  }

  return setProps(key => {
    const schemaValue = schema[key]

    if (isFunction(schemaValue)) {
      if (isNil(obj)) {
        throw new Error(
          'Schema contains function, but no source object specified.'
        )
      }

      const rules = schemaValue(obj[key])

      // result of schema function will be an array of tuple rules
      if (!isNil(rules) && isArray(rules)) {
        return rules.map(e => setProps(null)(e))
      }

      return deepmerge(rules, obj)
    }

    if (isArray(schemaValue)) {
      if (schemaValue.length === 0) {
        return null
      }

      // if all elements of array are objects,
      // then return mapped null objects, otherwise return null
      if (schemaValue.every(e => isObject(e))) {
        return schemaValue.map(e => setProps(null)(e))
      }

      return null
    }

    return null
  })(schema)
}

export default objectFromSchema
