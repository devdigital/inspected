import isNil from './is-nil'

const isOptional = predicate => value => {
  if (!predicate) {
    throw new Error(`No predicate provided.`)
  }

  if (isNil(value)) {
    return true
  }

  return predicate(value)
}

export default isOptional
