
// @require core/cash.ts
// @require core/filtered.ts
// @require core/pluck.ts
// @require core/unique.ts

interface Cash {
  parent ( comparator?: Comparator ): Cash;
}

Cash.prototype.parent = function ( this: Cash, comparator?: Comparator, all?: boolean = false ) {

  return filtered ( cash ( unique ( pluck ( this, 'parentNode', all ) ) ), comparator );

};
