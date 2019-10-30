
// @require core/cash.ts
// @require ./before.ts

interface Cash {
  replaceWith ( selector: Selector ): this;
}

Cash.prototype.replaceWith = function ( this: Cash, selector: Selector ) {
  return this.before ( selector ).detach().off();
};
