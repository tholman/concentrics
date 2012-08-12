var Concentrics = {

  // Settings
  spacingX: 18,
  spacingY: 18,
  randomSpacingVariance: 4,

  baseRadius: 15,
  randomRadiusVariance: 3,

  outerRingSize: 2,
  innerRingSize: 2,

  innerColor: "#ffffff",
  outerColor: "#9FCFE3",
  alpha: 1,

  drawSquares: false,
  
  // Other Globals
  points: [],

  canvas: null,
  context: null,

  imageInput: null,
  bgImage: null,
  bgCanvas: null,
  bgContext: null,

  init: function() {
    // Set up the visual canvas 
    this.canvas = document.getElementById( 'canvas' );
    this.context = canvas.getContext( '2d' );
    this.canvas.width = window.innerWidth - 100;
    this.canvas.height = window.innerHeight - 100;
    this.canvas.style.marginLeft = -this.canvas.width/2 + 'px';
    this.canvas.style.marginTop = -this.canvas.height/2 + 'px';
    this.canvas.style.display = 'block'

    this.imageInput = document.createElement( 'input' );
    this.imageInput.setAttribute( 'type', 'file' );
    this.imageInput.style.visibility = 'hidden';
    this.imageInput.addEventListener('change', this.upload, false);
    document.body.appendChild( this.imageInput );
    
    this.preparePoints();
		this.createPattern();
  },

  uploadImage: function() {
    this.imageInput.click();
  },

  /*
  *  Resizes the canvas to fit within the screen, based on a given image width/height
  */
  resizeCanvas: function( width, height ) {

    var newWidth, newHeight;

    var availableWidth = window.innerWidth - 100;
    var availableHeight = window.innerHeight - 100;

    // If the image is too big for the screen... scale it down.
    if ( width > availableWidth || height > availableHeight ) {

      var maxRatio = Math.max( width / availableWidth , height / availableHeight );
      newWidth = width / maxRatio;
      newHeight = height / maxRatio;

    } else {
      newWidth = width;
      newHeight = height;
    }

    this.canvas.width = newWidth//window.innerWidth;
    this.canvas.height = newHeight//window.innerHeight;
    this.canvas.style.marginLeft = -this.canvas.width/2 + 'px';
    this.canvas.style.marginTop = -this.canvas.height/2 + 'px';
  },
  
  preparePoints: function() {
    
    var width, height, i, j, k, offsetX, offsetY, offsetR, xPosition, yPosition;
    var maxRadiusVariance = this.randomRadiusVariance * 2;
    var maxSpacingVariance = this.randomSpacingVariance * 2;

    if ( this.bgImage !== null ) {
      var pixelData = this.getPixelData();
      var colors = pixelData.data;
    }

    // Vertical spacing
    for ( i = this.spacingY / 2; i < this.canvas.height; i += this.spacingY ) {
      
      var pointSet = [];
      
      // Horizontal spacing
      for(j = this.spacingX / 2; j < this.canvas.width; j += this.spacingX ) {
        
        offsetR = Math.round((Math.random() * maxRadiusVariance) - this.randomRadiusVariance);
        offsetX = Math.random() * maxSpacingVariance - this.randomSpacingVariance;
        offsetY = Math.random() * maxSpacingVariance - this.randomSpacingVariance;
        
        xPosition = Math.round( j + offsetX );
        yPosition = Math.round( i + offsetY );

        //Get the colors of the data at this point.
        if ( this.bgImage !== null ) {

            var pixelPosition = ( yPosition * pixelData.width + xPosition) * 4

            var color = "rgba( " + colors[pixelPosition-4] +
             ", " + colors[pixelPosition-3] +
             ", " + colors[pixelPosition-2] +
             ", " + colors[pixelPosition-1] + ")";

            var fillColor = "rgba( " + Math.min(colors[pixelPosition-4]+22, 255) +
             ", " + Math.min(colors[pixelPosition-3]+22, 255) +
             ", " + Math.min(colors[pixelPosition-2]+22, 255) + 
             ", " + Math.min(colors[pixelPosition-1]+22, 255) + ")";

            pointSet.push( {x: j + offsetX, y: i + offsetY, radius: this.baseRadius + offsetR, color: color, fillColor: fillColor} )
        } else {

          pointSet.push( {x: j + offsetX, y: i + offsetY, radius: this.baseRadius + offsetR} )  
        }

      }
      
      this.points.push( this.shuffleArray( pointSet ) );
    } 
  },

  // Gets the pixel data for a specific x/y and returns the colors
  getPixelData: function( ){

    var pixels = this.bgContext.getImageData( 0, 0, this.bgCanvas.width, this.bgCanvas.height );
    return pixels;
  },

  createPattern: function() {
    
		var i, j, k, currentPoints, currentPoint;

    this.context.lineJoin = "miter";
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.outerRingSize;
    this.context.fillStyle = this.innerColor;
    this.context.strokeStyle = this.outerColor;
    
    //Deadly loop-in-loop-in-loop.
    for ( i = 0; i < this.points.length; i++ ) {
      
      currentPoints = this.points[i]; 
      
      for ( j = 0; j < currentPoints.length;  j++ ) {
        	
       	currentPoint = currentPoints[j];
        
        if ( currentPoint.color ) {
           this.context.strokeStyle = currentPoint.color;
           this.context.fillStyle = currentPoint.fillColor;
        }

        if ( this.drawSquares ) {

          for ( k = currentPoint.radius; k > 0; k-= ((this.innerRingSize + this.outerRingSize) * 2)) {

            this.context.beginPath();
            this.context.rect(currentPoint.x - k/2, currentPoint.y - k/2, k , k);
            this.context.closePath();
            this.context.fill();
            this.context.stroke();

          }

        } else {

          for ( k = currentPoint.radius; k > 0; k-= (this.innerRingSize + this.outerRingSize)) {
          
            this.context.beginPath();
            this.context.arc(currentPoint.x, currentPoint.y, k ,0 , Math.PI*2, true);
            this.context.closePath();
            this.context.fill();
            this.context.stroke(); 

          }
        }
      }
    }
  },

  draw: function() {
    this.points = [];
    this.preparePoints();
    this.createPattern();
  },

  clear: function() {
    this.canvas.width = this.canvas.width;
  },

  save: function() {
    window.open( this.canvas.toDataURL('image/png'), 'mywindow' );
  },

  // User is uploading an image
  upload: function() {
    
    var fileReader = new FileReader();

    fileReader.onload = function( event ) {

      //this
      Concentrics.loadData( event.target.result );
    }

    fileReader.readAsDataURL( this.files[0] );

  },

  // The filereader has loaded the image... add it to image object to be drawn
  loadData: function( data ) {
    
    this.bgImage = new Image;
    this.bgImage.src = data;

    this.bgImage.onload = function() {

      //this
      Concentrics.drawImageToBackground();
    }
  },

  // Image is loaded... draw to bg canvas
  drawImageToBackground: function () {

    this.resizeCanvas( this.bgImage.width, this.bgImage.height );

    // Set up background canvas
    this.bgCanvas = document.createElement( 'canvas' );
    this.bgCanvas.width = this.canvas.width;//this.bgImage.width;
    this.bgCanvas.height = this.canvas.height//this.bgImage.height;

    // Draw to background canvas
    this.bgContext = this.bgCanvas.getContext( '2d' );
    this.bgContext.drawImage( this.bgImage, 0, 0, this.canvas.width, this.canvas.height );
    
    // Draw the pattern
    this.draw();

  },
 
  // Shuffle algorithm from: http://stackoverflow.com/questions/962802/is-it-correct-to-use-javascript-array-sort-method-for-shuffling
  shuffleArray: function( array ) {
    
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
  }
}