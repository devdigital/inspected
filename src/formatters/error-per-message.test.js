import errorPerMessage from './error-per-message'

describe('error per message', () => {
  const errors = {
    property: {
      surname: ['surname must begin with a capital', 'surname is too long'],
    },
    object: {
      id: ['ids must be unique'],
    },
  }

  it('throws exception when given undefined errors', () => {
    expect(() => errorPerMessage()).toThrow('Errors not specified.')
  })

  it('throws exception when given null errors', () => {
    expect(() => errorPerMessage(null)).toThrow('Errors not specified.')
  })

  it('throws exception when given non object errors', () => {
    expect(() => errorPerMessage(false)).toThrow('Errors not a valid object.')
  })

  it('returns expected error per message when given errors', () => {
    expect(errorPerMessage(errors)).toEqual({
      property: [
        { name: 'surname', message: 'surname must begin with a capital' },
        { name: 'surname', message: 'surname is too long' },
      ],
      object: [{ name: 'id', message: 'ids must be unique' }],
    })
  })
})
