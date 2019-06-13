import isNil from './schema/is-nil'
import isObject from './schema/is-object'
import isEmpty from './schema/is-empty'

// return all properties in obj2, not in obj1
const diffProps = obj1 => obj2 => {
  if (isNil(obj1)) {
    throw new Error('No first object specified.')
  }

  if (!isObject(obj1)) {
    throw new Error('First value is not a valid object.')
  }

  if (isNil(obj2)) {
    throw new Error('No second object specified.')
  }

  if (!isObject(obj2)) {
    throw new Error('Second value is not a valid object.')
  }

  const properties = {}

  Object.keys(obj2).forEach(p => {
    // Object 1 does not have property
    if (!obj1.hasOwnProperty(p)) {
      properties[p] = obj2[p]
      return
    }

    // Object 1 does have property,
    // if both properties are objects then recurse
    if (isObject(obj1[p]) && isObject(obj2[p])) {
      const diff = diffProps(obj1[p])(obj2[p])
      if (!isEmpty(diff)) {
        properties[p] = diff
      }
      return
    }
  })

  return properties
}

export default diffProps
