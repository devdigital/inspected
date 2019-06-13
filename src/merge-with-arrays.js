import deepmerge from 'deepmerge'
import isArray from './schema/is-array'
import isObject from './schema/is-object'
import isNil from './schema/is-nil'

// for arrays, deepmerge each object element
const mergeWithArrays = (obj1, obj2) => {
  if (isNil(obj1)) {
    throw new Error('No first object specified.')
  }

  if (isNil(obj2)) {
    throw new Error('No second object specified.')
  }

  const options = {
    customMerge: key => {
      if (isArray(obj1[key])) {
        return (obj1Value, obj2Value) =>
          obj1Value.map((e, i) => {
            if (isObject(e)) {
              return deepmerge(e, obj2Value[i])
            }

            return obj2Value[i]
          })
      }
    },
  }

  return deepmerge(obj1, obj2, options)
}

export default mergeWithArrays
