/* [Context Traits](https://github.com/ncardozo/context-traits).
// Copyright © 2012—2015 UCLouvain.
//             2016- Uniandes
*/
// Strategies for composition of adaptations.

 strategies = {
  compose(adaptation, trait) {
    const resultingTrait = Trait.compose(adaptation.trait, trait);
    for (let name of Object.keys(resultingTrait)) {
      const propdesc = resultingTrait[name];
      if (propdesc.conflict) {
        throw new Error(`Property ${name} already adapted for ${adaptation.object} in ${adaptation.context}`);
      }
    }
    return resultingTrait;
  },

  preserve(adaptation, trait) {
    return Trait.override(adaptation.trait, trait);
  },

  override(adaptation, trait) {
    return Trait.override(trait, adaptation.trait);
  },

  prevent(adaptation, trait) {
    throw new Error(`${adaptation.object} already adapted in ${adaptation.context}`);
  }
};

// Extend `Context` with methods related to adaptation.

us.extend(Context.prototype, {

  adapt(object, trait) {
    if (!(object instanceof Object)) {
      throw new Error(`Values of type ${typeof object} cannot be adapted.`);
    }
    contexts.Default.addAdaptation(object, Trait(object), strategies.preserve);
    return this.addAdaptation(object, trait, strategies.compose);
  },

  addAdaptation(object, trait, strategy) {
    trait = traceableTrait(trait, object);
    let adaptation = this.adaptationFor(object);
    if (adaptation) {
      adaptation.trait = strategy(adaptation, trait);
      if (this.isActive()) {
        this.manager.updateBehaviorOf(object);
      }
    } else {
      trait = Trait.compose(trait, traits.Extensible);
      adaptation = new Adaptation(this, object, trait);
      this.adaptations.push(adaptation);
      if (this.isActive()) {
        this.manager.deployAdaptation(adaptation);
      }
    }
    return this;
  },

  adaptationFor(object) {
    return us.find(this.adaptations, adaptation => adaptation.object === object);
  },

  activateAdaptations() {
    return Array.from(this.adaptations).map((adaptation) =>
      this.manager.deployAdaptation(adaptation));
  },

  deactivateAdaptations() {
    return Array.from(this.adaptations).map((adaptation) =>
      this.manager.withdrawAdaptation(adaptation));
  }
}
);

// Extend `Manager` with methods related to adaptation.

us.extend(Manager.prototype, {

  deployAdaptation(adaptation) {
    this.adaptations.push(adaptation);
    return this.updateBehaviorOf(adaptation.object);
  },

  withdrawAdaptation(adaptation) {
    const i = this.adaptations.indexOf(adaptation);
    if (i === -1) {
      throw new Error("Attempt to withdraw unmanaged adaptation");
    }
    this.adaptations.splice(i, 1);
    return this.updateBehaviorOf(adaptation.object);
  },

  updateBehaviorOf(object) {
    this.adaptationChainFor(object)[0].deploy();
    return this;
  },

  adaptationChainFor(object) {
    const relevantAdaptations = us.filter(this.adaptations, adaptation => adaptation.object === object);
    if (relevantAdaptations.length === 0) {
      throw new Error(`No adaptations found for ${object}`);
    }
    return this.policy.order(relevantAdaptations);
  }
}
);

// Define main behaviour of `Adaptation`.

us.extend(Adaptation.prototype, {

  deploy() {
    // Overwrite current object properties with adaptation properties.
    return us.extend(this.object, Object.create({}, this.trait));
  },

  toString() {
    return `Adaptation for ${this.object} in ${this.context}`;
  },

  equivalent(other) {
    return (this.context === other.context) &&
      (this.object === other.object) &&
        Trait.eqv(this.trait, other.trait);
  }
}
);
