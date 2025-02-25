
// @require core/cash.ts
// @require ./helpers/get_default_display.ts

interface Cash {
  toggle ( force?: boolean ): this;
}

Cash.prototype.toggle = function ( this: Cash, force?: boolean ) {

  return this.each ( ( i, ele ) => {

    const show = force !== undefined ? force : isHidden ( ele );

    if ( show ) {

      ele.style.display = '';

      if ( isHidden ( ele ) ) {

        ele.style.display = getDefaultDisplay ( ele.tagName );

      }

    } else {

      ele.style.display = 'none';

    }

  });

};
