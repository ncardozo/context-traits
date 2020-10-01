// [Context Traits](https://github.com/ncardozo/context-traits).
// Copyright © 2012—2015 UCLouvain.
//             2016- Uniandes

// Extend `Context` with methods related to activation.

us.extend(Context.prototype, {

    activate() {
      if (++this.activationCount === 1) {
        this.activationStamp = ++this.manager.totalActivations;
        this.activateAdaptations();
      }
      return this;
    },

    deactivate() {
      if (this.activationCount > 0) {
        if (--this.activationCount === 0) {
          this.deactivateAdaptations();
          delete this.activationStamp;
        }
      } else {
        throw new Error('Cannot deactivate inactive context');
      }
      return this;
    },

    isActive() {
      return this.activationCount > 0;
    }
  }
);
