
// @require core/cash.ts
// @require ./toggle_class.ts

interface Cash {
  removeClass ( classes?: string ): this;
}

Cash.prototype.removeClass = function ( this: Cash, cls?: string ) {
  return !arguments.length ? this : this.toggleClass ( cls, false );
};
