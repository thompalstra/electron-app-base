var extend = function(){
    return ex = {
        args: arguments,
        with: function( obj ){
            for(let i in this.args){
                var arg = this.args[i];

                if( typeof arg.prototype === 'object' ){
                    for(let i in obj){
                        arg.prototype[i] = obj[i]
                    }
                } else {
                    arg[i] = obj[i];
                }
            }
        }
    };
}

var send = function( obj ){
    var obj = send.validate( obj );

    var xhr = new XMLHttpRequest();
    xhr.open( obj.method, obj.url );
    xhr.responseType = obj.responseType;
    xhr.onreadystatechange = function( event ){
        if( this.readyState == 4 ){
            this.onsuccess.call( this, this );
        }
    }.bind( xhr );
    xhr.onerror = obj.onerror;
    xhr.onsuccess = obj.onsuccess;
    xhr.send( obj.data );
}
send.validate = function( obj ){
    if( typeof obj === 'string' ){
        obj = {
            url: obj
        };
    }
    if( typeof obj.method === 'undefined' ){
        obj.method = 'get';
    }
    if( typeof obj.url === 'undefined' ){
        obj.url = location.href;
    }
    if( typeof obj.responseType === 'undefined' ){
        obj.responseType = '';
    }
    if( typeof obj.onsuccess === 'undefined' ){
        obj.onsuccess = function(){};
    }
    if( typeof obj.onerror === 'undefined' ){
        obj.onerror = function(){};
    }
    if( typeof obj.headers === 'undefined' ){
        obj.headers = [];
    }
    if( typeof obj.data === 'undefined' ){
        obj.data = {};
    }
    return obj;
}

var doc = document;
var body = document.body;
var head = document.head;


extend( HTMLElement, Document ).with({
    on: function( eventTypes, b, c, d ){

        // element.on(eventType, callback, bool);
        // element.on(eventType, query, callback, bool);

        eventTypes.split(' ').forEach(function(eventType){
            if( typeof b === 'function' ){
                if( typeof c === 'undefined' ){
                    c = true;
                }
                this.addEventListener( eventType, b, c );
            } else if( typeof b === 'string' ){
                if( typeof d === 'undefined' ){
                    d = true;
                }
                this.addEventListener( eventType, function( originalEvent ){
                    if( originalEvent.target.matches( b ) ){
                        c.call( originalEvent.target, originalEvent );
                    } else if( d === true && ( closest = originalEvent.target.closest( b ) ) ){
                        c.call( closest, originalEvent );
                    }
                } );
            } else {
                console.error('Invalid argument. Expecting string or callable');
            }
        }.bind(this));
    },
    do: function( eventType ){
        var customEvent = new CustomEvent( eventType );
        this.dispatchEvent( customEvent );
        return customEvent;
    }
})
extend( HTMLElement ).with({
    load: function( obj ){
        var obj = send.validate( obj );
        obj.responseType = 'document';
        obj.onsuccess = function( xhr ){
            this.innerHTML = xhr.response.head.innerHTML + xhr.response.body.innerHTML;
            console.log(this);
            if( typeof this.dataset.evalJs === 'string' ){
                this.querySelectorAll('script').forEach(function(script){
                    eval(script.innerHTML);
                }.bind(this))
            }
        }.bind(this)
        obj.onerror = function( error ){
            console.log('error');
        }
        send( obj );
    }
})

doc.on('DOMContentLoaded', function(event){
    doc.do('ready');
})
