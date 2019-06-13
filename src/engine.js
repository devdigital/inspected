import all from 'ramda/src/all'
import curry from 'ramda/src/curry'
import equals from 'ramda/src/equals'
import filter from 'ramda/src/filter'
import identity from 'ramda/src/identity'
import map from 'ramda/src/map'
import reduce from 'ramda/src/reduce'

/**
 *
 * @param {Function} successFn callback function in case of valid input
 * @param {Function} failFn callback function in case of invalid input
 * @param {Array} input
 * @returns {*}
 */
const transform = (successFn, failFn, input) => {
  const valid = all(equals(true), input)
  return valid ? successFn() : failFn(filter(a => a !== true, input))
}

/**
 *
 * @param {Function} predicate validation function to apply inputs on
 * @param {String|Function} errorMsg error message to return in case of fail
 * @param {*} value the actual value
 * @param {Object} inputs the input object - in case the predicate function needs access to dependent values
 * @returns {Boolean}
 */
const runPredicate = ([predicate, errorMsg], value, inputs, key, log) => {
  log({
    type: 'predicate-tuple',
    stage: 'processing',
    message: `Invoking tuple predicate for property '${key}'.`,
    data: { property: key, predicate: predicate.toString(), value },
  })

  const predicateResult = predicate(value, inputs)

  const keyValue = predicateResult
    ? true
    : typeof errorMsg === 'function'
    ? errorMsg(value, key)
    : errorMsg

  log({
    type: 'predicate-tuple',
    stage: 'processed',
    message: `Validation result for object property '${key}' is '${keyValue}'.`,
    data: {
      property: key,
      predicate: predicate.toString(),
      value,
      result: keyValue,
    },
  })

  return keyValue
}

/**
 *
 * @param {Function} successFn callback function in case of valid input
 * @param {Function} failFn callback function in case of invalid input
 * @param {Object} spec the rule object
 * @param {Object|Function} input the validation input data
 * @returns {{}}
 */
export const validate = curry((successFn, failFn, logger, spec, input) => {
  const log = logger || (() => {})

  // input can be an object or a function that returns
  // an object given the current key being processed
  const inputFn = typeof input === 'function' ? input : () => input

  let inputObj = inputFn()
  const keys = Object.keys(inputObj || {})

  return reduce(
    (result, key) => {
      const inputObj = inputFn(key)
      const value = inputObj[key]
      const predicates = spec[key]

      log({
        type: 'property',
        stage: 'processing',
        message: `Checking object property '${key}' against schema predicate.`,
        data: { key, result, inputObj, value, predicates },
      })

      if (Array.isArray(predicates)) {
        const keyValue = transform(
          () => successFn(value),
          failFn,
          map(
            tuple => runPredicate(tuple, value, inputObj, key, log),
            predicates
          )
        )

        return {
          ...result,
          [key]: keyValue,
        }
      }

      if (typeof predicates === 'object') {
        log({
          type: 'predicate-object',
          stage: 'processing',
          message: `Schema predicate object found for property '${key}'.`,
          data: { predicates },
        })

        const keyValue = validate(successFn, failFn, logger, predicates, value)

        log({
          type: 'predicate-object',
          stage: 'processed',
          message: `Validation result for object property '${key}' is '${keyValue}'.`,
          data: { property: key, result: keyValue },
        })

        return {
          ...result,
          [key]: keyValue,
        }
      }

      if (typeof predicates === 'function') {
        log({
          type: 'predicate-function',
          stage: 'processing',
          message: `Schema predicate function found for property '${key}'.`,
          data: { predicates: predicates.toString() },
        })

        const rules = predicates(value)
        const keyValue = validate(successFn, failFn, logger, rules, value)

        log({
          type: 'predicate-function',
          stage: 'processed',
          message: `Validation result for object property '${key}' is '${keyValue}'.`,
          data: { property: key, result: keyValue, rules },
        })

        return {
          ...result,
          [key]: keyValue,
        }
      }

      log({
        type: 'predicate-missing',
        stage: 'processing',
        message: `No schema predicate found for property '${key}'.`,
        data: { property: key },
      })

      const keyValue = successFn([])

      log({
        type: 'predicate-missing',
        stage: 'processed',
        message: `Validation result for object property '${key}' is '${keyValue}'.`,
        data: { property: key, result: keyValue },
      })

      return { ...result, [key]: keyValue }
    },
    {},
    keys
  )
})

/**
 *
 * @param {Object} spec the rule object
 * @param {Object} input the validation input data
 * @returns {{}}
 */
const engine = validate(() => true, identity)

export default engine
