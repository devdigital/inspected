import validation from './validation'
import isNil from './schema/is-nil'
import isObject from './schema/is-object'

const configure = options => {
  if (isNil(options)) {
    throw new Error('Options not specified.')
  }

  if (!isObject(options)) {
    throw new Error('Options is not a valid object.')
  }

  return validation(options)
}

export default configure
