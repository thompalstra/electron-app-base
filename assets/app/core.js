define = function( tag, constr ){
    if( typeof customElements == 'undefined' ){
        document.createElement( tag, constr );
    } else {
        customElements.define( tag, constr );
    }
}

class LayoutsElement extends HTMLElement{
    open( url ){
        var layout = this.appendChild( document.createElement('x-layout') );
        layout.setAttribute('data-eval-js','');
        layout.load( url );
    }
    close( instance ){
        console.log(this);
    }
}

define('x-layouts', LayoutsElement);
