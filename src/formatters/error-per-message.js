import flattenProps from '../flatten-props'
import isNil from '../schema/is-nil'
import isObject from '../schema/is-object'

// converts { { } } to [{ name: '', message: '' }]
const toErrors = errors => {
  const results = []

  const flat = flattenProps(errors)
  flat.forEach(f => {
    f.value.forEach(v => {
      results.push({
        name: f.path,
        message: v,
      })
    })
  })

  return results
}

const errorPerMessage = errors => {
  if (isNil(errors)) {
    throw new Error('Errors not specified.')
  }

  if (!isObject(errors)) {
    throw new Error('Errors not a valid object.')
  }

  return {
    property: toErrors(errors.property),
    object: toErrors(errors.object),
  }
}

export default errorPerMessage
