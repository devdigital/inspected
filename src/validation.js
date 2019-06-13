import isNil from './schema/is-nil'
import isObject from './schema/is-object'
import isFunction from './schema/is-function'
import isEmpty from './schema/is-empty'
import setProps from './set-props'
import equateProps from './equate-props'
import diffProps from './diff-props'
import filterProps from './filter-props'
import engine from './engine'
import deepmerge from 'deepmerge'
import objectFromSchema from './object-from-schema'
import mergeWithArrays from './merge-with-arrays'

const validateObject = (logger, schema, obj) => {
  const objToValidate = mergeWithArrays(objectFromSchema(schema, obj), obj)
  const validation = engine(logger, schema, objToValidate)

  return filterProps(p => p !== true)(validation)
}

const getDiffProperties = message => (schema, obj) => {
  const diff = diffProps(schema)(obj)
  if (isEmpty(diff)) {
    return {}
  }

  return setProps([message])(diff)
}

const getPropertyErrors = (schema, obj, errors, additionalPropsOptions) => {
  if (additionalPropsOptions.ignore) {
    return errors
  }

  const diffProperties = getDiffProperties(additionalPropsOptions.message)(
    schema,
    obj
  )

  return deepmerge(errors, diffProperties)
}

const getRuleErrors = (logger, rules, obj) => {
  const objectRulesObj = {}

  Object.keys(rules).forEach(key => {
    objectRulesObj[key] = obj
  })

  return validateObject(logger, rules, objectRulesObj)
}

const validateOptions = options => {
  if (isNil(options)) {
    throw new Error('No options specified.')
  }

  if (!isObject(options)) {
    throw new Error('Options is not a valid object.')
  }

  // TODO: validate merged options against schema
  if (!isFunction(options.logger)) {
    throw new Error('Specified logger is not a function.')
  }
}

// returns { isValid: boolean, errors: {} }
const validation = options => (schema, rules) => obj => {
  if (!isNil(options) && !isObject(options)) {
    throw new Error('Options is not a valid object.')
  }

  if (isNil(schema)) {
    throw new Error(`No schema specified.`)
  }

  if (!isObject(schema)) {
    throw new Error('Schema is not a valid object.')
  }

  const defaultOptions = {
    additionalProps: {
      ignore: false,
      message: 'Unexpected property.',
    },
    invalidObject: {
      property: 'validObject',
      message: 'Invalid object.',
    },
    logger: () => {},
  }

  const mergedOptions = Object.assign({}, defaultOptions, options)
  validateOptions(mergedOptions)

  if (isNil(obj) || !isObject(obj)) {
    return {
      isValid: false,
      errors: {
        property: {},
        object: {
          [mergedOptions.invalidObject.property]:
            mergedOptions.invalidObject.message,
        },
      },
    }
  }

  const validationErrors = validateObject(mergedOptions.logger, schema, obj)

  const errors = {
    property: getPropertyErrors(
      schema,
      obj,
      validationErrors,
      mergedOptions.additionalProps
    ),
    object: rules ? getRuleErrors(mergedOptions.logger, rules, obj) : {},
  }

  const valid = equateProps(true)(errors)

  return {
    isValid: valid,
    errors,
  }
}

export default validation
