/**
 * The custom element reaction queue: what makes a `[CEReactions]` operation
 * run the reactions its own DOM mutations queued after its last step, rather
 * than in the middle of it.
 */
class CustomElementReactions {
  private depth_: number = 0;
  private queue_: (() => void)[] = [];

  /**
   * Runs `steps` as a `[CEReactions]` operation, invoking whatever reactions
   * they queue once they are done.
   *
   * @param steps - The steps of the operation.
   *
   * @returns What the steps return.
   *
   * @typeParam T - What the steps return.
   */
  run<T>(steps: () => T): T {
    this.depth_++;

    try {
      return steps();
    } finally {
      this.depth_--;

      if (this.depth_ === 0) {
        this.invoke_();
      }
    }
  }

  /**
   * Queues `reaction` when a `[CEReactions]` operation is running.
   *
   * @param reaction - The reaction to queue.
   *
   * @returns Whether it was queued. When it was not, there is no operation to
   *   wait for and the caller runs it itself.
   */
  enqueue(reaction: () => void): boolean {
    if (this.depth_ === 0) {
      return false;
    }

    this.queue_.push(reaction);

    return true;
  }

  /**
   * Invokes what is queued, in the order it was queued.
   */
  private invoke_(): void {
    const reactions = this.queue_;
    this.queue_ = [];

    for (const reaction of reactions) {
      try {
        reaction();
      } catch (error) {
        reportError(error);
      }
    }
  }
}

export const customElementReactions: CustomElementReactions =
  new CustomElementReactions();
