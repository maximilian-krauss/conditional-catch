const { test } = require('ava');
const { ConditionalCatch } = require('../');

class TestError extends Error {
  constructor() {
    super('Testie Mc Testface');
  }
}

class SecondTestError extends Error {
  constructor() {
    super('Don\'t hassle the Hoff!');
  }
}

test('catches all errors and does not throw', t => {
  t.plan(1);
  try {
    throw new Error('destroy all the things');
  } catch (error) {
    ConditionalCatch.createFrom(error)
      .when(e => e instanceof Error, () => t.pass())
      .handleOrThrow();
  }
});

test('throws errors which are not handled', t => {
  t.throws(() => {
    try {
      throw new Error('Catch me if you can');
    } catch (error) {
      ConditionalCatch.createFrom(error)
        .when(e => e instanceof TestError, () => t.fail('Should not happen'))
        .handleOrThrow();
    }
  }, 'Catch me if you can');
});

test('it supports throwing of different errors inside the handler function', t => {
  t.throws(() => {
    try {
      throw new TestError('Catch me if you can');
    } catch (error) {
      ConditionalCatch.createFrom(error)
        .when(() => true, () => { throw new SecondTestError(); })
        .handleOrThrow();
    }
  }, SecondTestError);
});

test('multiple error cases', t => {
  t.plan(1);
  try {
    throw new TestError();
  } catch (error) {
    ConditionalCatch.createFrom(error)
      .when(e => e instanceof SecondTestError, () => t.fail('Should not happen'))
      .when(e => e instanceof TestError, () => t.pass())
      .handleOrThrow();
  }
});

test('throws an error if no valid conditionFn is passed', t => {
  t.throws(() => {
    ConditionalCatch.createFrom(new Error())
      .when(null, () => {})
      .handleOrThrow();
  }, 'Invalid argument "conditionFn", expected a function');
});

test('throws an error if no valid thenFn is passed', t => {
  t.throws(() => {
    ConditionalCatch.createFrom(new Error())
      .when(() => true, null)
      .handleOrThrow();
  }, 'Invalid argument "thenFn", expected a function');
});
