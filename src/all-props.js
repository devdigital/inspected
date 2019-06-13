import filter from 'ramda/src/filter'
import isEmpty from './schema/is-empty'
import isObject from './schema/is-object'

const allProps = predicate => obj => {
  if (!predicate) {
    throw new Error('No predicate specified.')
  }

  if (!obj) {
    throw new Error('No object specified.')
  }

  const propertiesNotMatchingPredicate = filter(
    p => (isObject(p) ? !allProps(predicate)(p) : !predicate(p)),
    obj
  )

  return isEmpty(propertiesNotMatchingPredicate)
}

export default allProps
