THREE.FilterChain = function( renderer, scene, camera ){

  this.scene = scene
  this.camera = camera
  this.renderer = renderer

  this.targets = []

  this.createBuffer = function() {
    var pixelRatio = renderer.getPixelRatio();

    var width  = Math.floor( renderer.context.canvas.width  / pixelRatio ) || 1;
    var height = Math.floor( renderer.context.canvas.height / pixelRatio ) || 1;
    var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

    return new THREE.WebGLRenderTarget( width, height, parameters );
  }

  this.buffer = this.createBuffer()

}

THREE.FilterChain.prototype = {

  render: function() {
    // last arg is clear:bool
    this.renderer.render( this.scene, this.camera, this.buffer, true )
    this.targets.forEach( target => { target.render( this.buffer ) })
  },

  addTarget: function( target ) {
    this.targets.push( target )
  },

  Filter: function( shader, textureID ) {
    return new FilterChainNode( this, shader, textureID )
  }

}

function FilterChainNode ( parentFilterChain, shader, textureID ) {

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

	this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 )
	this.scene  = new THREE.Scene()

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null )
	this.scene.add( this.quad )

  this.parentFilterChain = parentFilterChain
  this.outputBuffer = parentFilterChain.createBuffer()

  this.targets = []

}

FilterChainNode.prototype = {

  render: function( buffer ) {

    if ( this.uniforms[this.textureID] ) {
      this.uniforms[this.textureID].value = buffer
    }

    this.quad.material = this.material

    const renderer = this.parentFilterChain.renderer

    if ( this.renderToScreen ) renderer.render( this.scene, this.camera )
    else {
      renderer.render( this.scene, this.camera, this.outputBuffer, false ) // clear
      this.targets.forEach( target => { target.render( this.outputBuffer ) })
    }

  },

  addTarget: function( target ) {
    if( target == "screen" ) this.renderToScreen = true
    this.targets.push( target )
  }

}
