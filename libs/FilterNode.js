function FilterNode ( renderer, shader, textureID ) {

  this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse"

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms )

	this.material = new THREE.ShaderMaterial({
    defines: shader.defines || {},
		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader
	})

	this.renderToScreen = false

	this.enabled = true
	this.needsSwap = true
	this.clear = false

  this.renderer = renderer;

	this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 )
	this.scene  = new THREE.Scene()

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null )
	this.scene.add( this.quad )

  var pixelRatio = renderer.getPixelRatio();

  var width  = Math.floor( renderer.context.canvas.width  / pixelRatio ) || 1;
  var height = Math.floor( renderer.context.canvas.height / pixelRatio ) || 1;
  var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

  renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

  this.outputBuffer = renderTarget

  this.targets = []

}

FilterNode.prototype = {

  render: function( renderer, buffer ) {

    if ( this.uniforms[this.textureID] ) {
      this.uniforms[this.textureID].value = buffer
    }

    this.quad.material = this.material

    if ( this.renderToScreen ) renderer.render( this.scene, this.camera )
    else {
      renderer.render( this.scene, this.camera, this.outputBuffer, this.clear )
      this.targets.forEach( target => { target.render( renderer, this.outputBuffer ) })
    }

  },

  addTarget: function( target ) {
    if( target == "screen" ) this.renderToScreen = true
    this.targets.push( target )
  }

}



// var filter = new Filter()
// camera.addTarget( filter )
// filter.addTarget( output )
