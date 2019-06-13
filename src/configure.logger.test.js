import configure from './configure'

let messages = []
const capturingLogger = () => {
  messages = []
  return message => messages.push(message)
}

describe('configure logger', () => {
  it('throws exception when logger is not a function', () => {
    const validate = configure({ logger: false })
    const schema = {
      name: () => true,
    }

    expect(() => validate(schema)({ name: 'foo' })).toThrow(
      'Specified logger is not a function.'
    )
  })

  it('throws exception when logger is not a function', () => {
    const validate = configure({ logger: false })
    const schema = {
      name: () => true,
    }

    expect(() => validate(schema)({ name: 'foo' })).toThrow(
      'Specified logger is not a function.'
    )
  })

  it('captures valid messages with logger specified', () => {
    const logger = capturingLogger()
    const validate = configure({ logger })
    const schema = {
      name: [[() => true, 'name is required']],
    }

    validate(schema)({ name: 'foo' })
    expect(messages.map(m => m.message)).toEqual([
      `Checking object property 'name' against schema predicate.`,
      `Invoking tuple predicate for property 'name'.`,
      `Validation result for object property 'name' is 'true'.`,
    ])
  })
})
