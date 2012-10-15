var headers = [document.getElementById('back'), document.getElementById('info-tab')] ;
var headerMouseDown = false;
var headerToggleTimeOut = [];
    
document.addEventListener( 'mousedown', function() {
    headerMouseDown = true;
}, false );
    
document.addEventListener( 'mouseup', function() {
    headerMouseDown = false;
}, false );
    
for (var i = 0; i < headers.length; i++ ) {

    headerToggleTimeOut.push( -1 );
    
    headers[i].addEventListener('mouseover', function() {
    
        if (!headerMouseDown) {
            
            var _this = this;
            
            clearTimeout( headerToggleTimeOut );
            
            headerToggleTimeOut[i] = setTimeout( function() {
                _this.setAttribute( 'class', 'open' )
            }, 100 );
        }
                                                 
    }, false);
            
    headers[i].addEventListener('mouseout', function() {

        var _this = this;                    
        
        clearTimeout( headerToggleTimeOut );
        
        headerToggleTimeOut[i] = setTimeout( function() {
            _this.setAttribute( 'class', '' )
        }, 100 );
            
    }, false);                   

}