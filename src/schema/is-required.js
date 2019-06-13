import isNil from './is-nil'
import isEmpty from './is-empty'

const isRequired = predicate => value => {
  if (!predicate) {
    throw new Error(`No predicate provided.`)
  }

  if (isNil(value)) {
    return false
  }

  if (isEmpty(value)) {
    return false
  }

  return predicate(value)
}

export default isRequired
