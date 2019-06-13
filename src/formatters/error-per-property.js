import flattenProps from '../flatten-props'
import isNil from '../schema/is-nil'
import isObject from '../schema/is-object'

// converts { { } } to [{ name: '', messages: [''] }]
const toErrors = errors =>
  flattenProps(errors).map(e => ({
    name: e.path,
    messages: e.value,
  }))

const errorPerProperty = errors => {
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

export default errorPerProperty
