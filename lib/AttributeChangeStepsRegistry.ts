import type { AttributeChangeSteps } from "./types";

/**
 * Staging area for the attribute change steps a class's reflected members
 * register while the class is being decorated, drained by the class decorator
 * (`@Interface` → `CustomElement`) to wire `observedAttributes` and
 * `attributeChangedCallback`.
 *
 * @remarks
 * Class definitions are synchronous and never interleave, so at most one class
 * registers steps at a time. If a class definition aborts after a member
 * registered steps but before the class decorator drained them (for example, a
 * reflect trigger applied to an unsupported member kind), the leftover steps
 * belong to a class that will never finalize. Rather than letting them poison
 * the next class, both `add` and `drain` discard any steps held under a
 * different metadata than the one they are called with.
 */
class AttributeChangeStepsRegistry {
  private metadata_: object | null = null;
  private steps_: Map<string, AttributeChangeSteps> = new Map();

  add(metadata: object, name: string, steps: AttributeChangeSteps): void {
    if (this.metadata_ !== metadata) {
      // A different class started registering steps; drop any left over from a
      // class whose definition aborted before it was drained.
      this.metadata_ = metadata;
      this.steps_ = new Map();
    }

    this.steps_.set(name, steps);
  }

  drain(metadata: object): Map<string, AttributeChangeSteps> {
    if (this.metadata_ !== metadata) {
      // This class registered no steps (or a stale batch remained); clear any
      // leftover state and return nothing.
      this.metadata_ = null;
      this.steps_ = new Map();
      return new Map();
    }

    const steps = this.steps_;

    this.metadata_ = null;
    this.steps_ = new Map();

    return steps;
  }
}

export const attributeChangeStepsRegistry: AttributeChangeStepsRegistry =
  new AttributeChangeStepsRegistry();
