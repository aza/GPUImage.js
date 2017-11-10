function CameraNode ( renderer, scene, camera ) {

	this.scene = scene
	this.camera = camera

	this.enabled = true
	this.clear = true

  this.targets = []

  var pixelRatio = renderer.getPixelRatio();

  var width  = Math.floor( renderer.context.canvas.width  / pixelRatio ) || 1;
  var height = Math.floor( renderer.context.canvas.height / pixelRatio ) || 1;
  var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

  renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

  this.buffer = renderTarget

}

CameraNode.prototype = {

	render: function ( renderer ) {
		renderer.render( this.scene, this.camera, this.buffer, this.clear )
    this.targets.forEach( target => { target.render( renderer, this.buffer ) })
	},

  addTarget: function( target ) {
    this.targets.push( target )
  }

}
