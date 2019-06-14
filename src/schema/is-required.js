import isNil from './is-nil'
import isEmpty from './is-empty'
import isString from './is-string'

const isRequired = predicate => value => {
  if (!predicate) {
    throw new Error(`No predicate provided.`)
  }

  if (isNil(value)) {
    return false
  }

  if (isString(value) && isEmpty(value)) {
    return false
  }

  return predicate(value)
}

export default isRequired
