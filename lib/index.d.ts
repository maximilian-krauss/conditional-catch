export type Condition = (err: any) => bool;
export type Then<R> = (err: any) => R;

export class ConditionalCatch {
  static createFrom(error: any): ConditionalCatch;
  when<R>(conditionFn: Condition, thenFn: Then<R>): ConditionalCatch;
  handleOrThrow(): R | never;
}
