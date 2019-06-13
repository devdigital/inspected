const isFunction = v =>
  Object.prototype.toString.call(v) === '[object Function]'

export default isFunction
