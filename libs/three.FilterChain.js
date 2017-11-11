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

  filter: function( name, shader, numInputs ) {
    return new FilterChainNode( this, name, shader, numInputs )
  },

  createFilter: function( name ) {
    var filterDef = FilterDefinitions.get(name)
    return new FilterChainNode( this, filterDef )
  }

}

function FilterChainNode ( parentFilterChain, filterDef ) {

  this.name = filterDef.name

  this.numInputs = filterDef.numberOfInputs
  this._receivedInputs = []

  this.textureID = "input"

	this.uniforms = THREE.UniformsUtils.clone( filterDef.uniforms )

	this.material = new THREE.ShaderMaterial({
    defines: filterDef.defines || {},
		uniforms: this.uniforms,
		vertexShader: filterDef.vertexShader,
		fragmentShader: filterDef.fragmentShader
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

    // Add the buffer to the buffer queue, wait until we have all of the
    // inputs to continue
    this._receivedInputs.push( buffer )
    if( this._receivedInputs.length < this.numInputs ) return

    for( var i=0; i<this.numInputs; i++){
      var id = this.textureID + i
      if( !this.uniforms[id] ){ console.log( "ERROR", this.name, this.uniforms, this.uniforms[id] )}
      this.uniforms[id].value = this._receivedInputs[i]
    }

    this._receivedInputs = []

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
