import isObject from './schema/is-object'
import isEmpty from './schema/is-empty'
import isFunction from './schema/is-function'

const filterProps = predicate => obj => {
  if (!predicate) {
    throw new Error('No predicate specified.')
  }

  if (!isFunction(predicate)) {
    throw new Error('Predicate is not a function.')
  }

  if (!obj) {
    throw new Error('No object specified.')
  }

  const result = {}

  Object.keys(obj).forEach(p => {
    if (isObject(obj[p])) {
      const filter = filterProps(predicate)(obj[p], result[p])
      if (!isEmpty(filter)) {
        result[p] = filter
      }
      return
    }

    if (predicate(obj[p])) {
      result[p] = obj[p]
    }
  })

  return result
}

export default filterProps
