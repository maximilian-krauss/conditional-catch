const { ConditionalCatch } = require('..')

class TestError extends Error {
  constructor () {
    super('Testie Mc Testface')
  }
}

class SecondTestError extends Error {
  constructor () {
    super('Don\'t hassle the Hoff!')
  }
}

describe('ConditionalCatch', () => {
  test('catches all errors and does not throw', () => {
    expect.assertions(1)
    try {
      throw new Error('destroy all the things')
    } catch (error) {
      ConditionalCatch.createFrom(error)
        .when(e => e instanceof Error, (e) => expect(e.message).toBe('destroy all the things'))
        .handleOrThrow()
    }
  })

  test('throws errors which are not handled', () => {
    const t = () => {
      try {
        throw new Error('Catch me if you can')
      } catch (error) {
        ConditionalCatch.createFrom(error)
          .when(e => e instanceof TestError, () => { throw new Error('Should not happen') })
          .handleOrThrow()
      }
    }
    expect(t).toThrow('Catch me if you can')
  })

  test('it supports throwing of different errors inside the handler function', () => {
    const t = () => {
      try {
        throw new TestError('Catch me if you can')
      } catch (error) {
        ConditionalCatch.createFrom(error)
          .when(() => true, () => { throw new SecondTestError() })
          .handleOrThrow()
      }
    }
    expect(t).toThrow(SecondTestError)
  })

  test('multiple error cases', () => {
    expect.assertions(1)
    try {
      throw new TestError()
    } catch (error) {
      ConditionalCatch.createFrom(error)
        .when(e => e instanceof SecondTestError, () => { throw new SecondTestError('Should not happen') })
        .when(e => e instanceof TestError, e => expect(e.message).toEqual('Testie Mc Testface'))
        .handleOrThrow()
    }
  })

  test('throws an error if no valid conditionFn is passed', () => {
    const t = () => {
      ConditionalCatch.createFrom(new Error())
        .when(null, () => {})
        .handleOrThrow()
    }
    expect(t).toThrow('Invalid argument "conditionFn", expected a function')
  })

  test('throws an error if no valid thenFn is passed', () => {
    const t = () => {
      ConditionalCatch.createFrom(new Error())
        .when(() => true, null)
        .handleOrThrow()
    }
    expect(t).toThrow('Invalid argument "thenFn", expected a function')
  })
})
