# Conditional Catch

> Catch me if you can

## API

This module exports a class `ConditionalCatch` which should only be created via the static function `ConditionalCatch.createFrom(error: Error)`.

The returned object contains the following methods:

* `handle(conditionFn, thenFn)`: registers an condition check
* `handleOrThrow()`: Executes all registered handlers and if none matches throws the error

## Installation

```bash
npm install conditional-catch
```

## Example

```javascript

const { ConditionalCatch } = require('conditional-catch')

// ...

try {
  // some action that throws errors
} catch (error) {
  ConditionalCatch.createFrom(error)
    .when(e => e instanceof SomeError, e => { log.error('Cought that nasty bug again which can be ignored', e); })
    .handleOrThrow();
}

```
