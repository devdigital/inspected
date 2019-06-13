import mergeWithArrays from './merge-with-arrays'

describe('mergeWithArrays', () => {
  it('throws with no first object', () => {
    expect(() => mergeWithArrays()).toThrow('No first object specified.')
  })

  it('throws with no second object', () => {
    expect(() => mergeWithArrays({})).toThrow('No second object specified.')
  })

  it('merges scalar values', () => {
    expect(mergeWithArrays({ foo: 'bar' }, { baz: 'bar' })).toEqual({
      foo: 'bar',
      baz: 'bar',
    })
  })

  it('merges array elements', () => {
    const object1 = {
      foo: [{ name: null, foo: 'bar' }],
    }

    const object2 = {
      foo: [{ name: 'foo' }],
    }

    expect(mergeWithArrays(object1, object2)).toEqual({
      foo: [{ name: 'foo', foo: 'bar' }],
    })
  })

  it('merges mixed arrays', () => {
    const object1 = {
      foo: [{ name: null }, 2, 'foo'],
    }

    const object2 = {
      foo: [{ name: 'foo', bar: 'baz' }, 3, 4],
    }

    expect(mergeWithArrays(object1, object2)).toEqual({
      foo: [{ name: 'foo', bar: 'baz' }, 3, 4],
    })
  })

  it('merges nested objects', () => {
    const object1 = {
      foo: {
        bar: 'bar',
        foo: 'baz',
        baz: {
          foo: 'baz',
        },
      },
    }

    const object2 = {
      foo: {
        bar: 'baz',
        foo: {
          baz: 'bar',
        },
        baz: {
          foo: 'bar',
          baz: 'foo',
        },
      },
    }

    expect(mergeWithArrays(object1, object2)).toEqual({
      foo: {
        bar: 'baz',
        foo: {
          baz: 'bar',
        },
        baz: {
          foo: 'bar',
          baz: 'foo',
        },
      },
    })
  })

  it('merges array with nested objects', () => {
    const object1 = {
      foo: [2, { bar: 'foo', baz: { bar: 'bar' } }],
    }

    const object2 = {
      foo: ['foo', { bar: 'baz', baz: { baz: { baz: 'foo' }, foo: 'bar' } }],
    }

    expect(mergeWithArrays(object1, object2)).toEqual({
      foo: [
        'foo',
        { bar: 'baz', baz: { bar: 'bar', baz: { baz: 'foo' }, foo: 'bar' } },
      ],
    })
  })
})
