import errorPerProperty from './error-per-property'

describe('error per property', () => {
  const errors = {
    property: {
      surname: ['surname must begin with a capital', 'surname is too long'],
    },
    object: {
      id: ['ids must be unique'],
    },
  }

  it('throws exception when given undefined errors', () => {
    expect(() => errorPerProperty()).toThrow('Errors not specified.')
  })

  it('throws exception when given null errors', () => {
    expect(() => errorPerProperty(null)).toThrow('Errors not specified.')
  })

  it('throws exception when given non object errors', () => {
    expect(() => errorPerProperty(false)).toThrow('Errors not a valid object.')
  })

  it('returns expected error per message when given errors', () => {
    expect(errorPerProperty(errors)).toEqual({
      property: [
        {
          name: 'surname',
          messages: [
            'surname must begin with a capital',
            'surname is too long',
          ],
        },
      ],
      object: [{ name: 'id', messages: ['ids must be unique'] }],
    })
  })
})
