function Trippy( canvasId ){

  // The basic stuff
  this.canvas = document.querySelector( canvasId )
  this.renderer = new THREE.WebGLRenderer({canvas: this.canvas})
  this.renderer.setSize( this.canvas.width, this.canvas.height)

  this._scene = new THREE.Scene();

  // Setup camera to look at the mesh

  var camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
  camera.position.set(0, 0, 1);
  this._scene.add(camera);
  this._camera = camera

  this.targets = []

  this.createBuffer = function() {
    var pixelRatio = this.renderer.getPixelRatio();

    var width  = Math.floor( this.renderer.context.canvas.width  / pixelRatio ) || 1;
    var height = Math.floor( this.renderer.context.canvas.height / pixelRatio ) || 1;
    var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

    return new THREE.WebGLRenderTarget( width, height, parameters );
  }

  this.buffer = this.createBuffer()

}

Trippy.prototype = {

  width: function(){ return this.canvas.width },
  height: function(){ return this.canvas.height },

  render: function() {
    // last arg is clear:bool
    this.renderer.render( this._scene, this._camera, this.buffer )
    this.targets.forEach( target => { target.render( this.buffer ) })
  },

  start: function() {
    var self = this

    // video texture
    var videoImage = document.createElement('canvas');
    videoImage.width = this.canvas.width;
    videoImage.height = this.canvas.height;

    var videoImageContext = videoImage.getContext('2d');

    videoTexture = new THREE.Texture(videoImage)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter

    var videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        overdraw: true
    })
    var videoGeometry = new THREE.PlaneBufferGeometry(4, 3)
    var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial)
    videoMesh.position.set(0, 0, 0)
    this._scene.add(videoMesh)


    var facingMode = "user";
    var constraints = {
      audio: false,
      video: true
    }

    // local video
    var video = document.getElementById('video');

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream

        video.onloadedmetadata = function(e) {
            videoImage.width = this.videoWidth
            videoImage.height = this.videoHeight
            video.play()

            renderFrame()
        }
    })

    function renderFrame() {
        videoImageContext.drawImage(video, 0, 0)
        if (videoTexture) {
            videoTexture.needsUpdate = true
        }

        self.render()
        requestAnimationFrame(renderFrame)
    }
  },

  addTarget: function( target ) {
    this.targets.push( target )
  },

  filter: function( name, options ) {
    options = options || {}
    var filterDef = FilterDefinitions.get(name)

    Object.keys( options ).forEach( key => {

      // Set the extant uniform values if passing in a uniform name/value
      if( filterDef.uniforms[key] ) {
        filterDef.uniforms[key].value = options[key]
      }

      // Else it is a new global def (like framesToDelay)
      else {
        filterDef[key] = options[key]
      }

    })

    return new TrippyNode( this, filterDef )
  },

  camera: function(){
    var camera = this.filter( "PassThrough" )
    this.addTarget( camera )
    return camera
  }

}

function TrippyNode ( parent, filterDef ) {

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

	this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 )
	this.scene  = new THREE.Scene()

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null )
	this.scene.add( this.quad )

  this.parent = parent
  this.outputBuffers = []

  this.framesToDelay = filterDef.framesToDelay
  this.frameCount = 0

  for( var i=0; i<=this.framesToDelay; i++){
    this.outputBuffers.push( parent.createBuffer() )
  }

  this.targets = []

}

TrippyNode.prototype = {

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

    for( uniformName in this.uniforms ){
      let uniform = this.uniforms[uniformName]
      if( uniform.update ) uniform.value = uniform.update( uniform.value )
    }

    this._receivedInputs = []

    this.quad.material = this.material

    const renderer = this.parent.renderer

    if ( this.renderToScreen ){

      renderer.render( this.scene, this.camera )

    }

    else {
      renderer.render( this.scene, this.camera, this.outputBuffers[this.frameCount % this.outputBuffers.length], false ) // clear
      this.targets.forEach( target => { target.render( this.outputBuffers[(this.frameCount-(this.framesToDelay-1)) % this.outputBuffers.length] ) })
      this.frameCount += 1
    }

  },

  addTarget: function( target, options ) {
    if( target == "screen" ){
      var output = this.parent.filter( "PassThrough" )
      output.renderToScreen = true
      target = output
    }
    this.targets.push( target )
  }

}
