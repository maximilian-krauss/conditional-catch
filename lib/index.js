class ConditionalCatch {
  constructor(error) {
    this.noop = () => {};
    this.error = error;
    this.conditions = [];
  }

  when(conditionFn, thenFn) {
    if (typeof conditionFn !== typeof this.noop) throw new Error('Invalid argument "conditionFn", expected a function');
    if (typeof thenFn !== typeof this.noop) throw new Error('Invalid argument "thenFn", expected a function');

    this.conditions.push({ when: conditionFn, then: thenFn });
    return this;
  }

  handleOrThrow() {
    for (const condition of this.conditions) {
      if (condition.when(this.error)) {
        return condition.then(this.error);
      }
    }
    throw this.error;
  }

  static createFrom(error) {
    return new ConditionalCatch(error);
  }
}

module.exports = {
  ConditionalCatch,
};
