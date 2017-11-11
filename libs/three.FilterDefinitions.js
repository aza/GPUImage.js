function FilterDefinitionsSingleton( ){
  this.filters = {}
}

FilterDefinitionsSingleton.prototype = {

  _baseUniforms: function( numberOfInputs, otherUniforms ){
    var uniforms = otherUniforms || {}

    for( var i=0; i<numberOfInputs; i++ ){
      uniforms[ ("input" + i) ] = { type: "t", value: null }
    }

    return uniforms
  },

  _baseVertexShader: function(){
    return [
      "varying vec2 inputCoord;",
      "void main() {",
        "inputCoord = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
    ].join("\n")
  },

  add: function( shaderInfo ){
    shaderInfo.framesToDelay = shaderInfo.framesToDelay || 0
    this.filters[ shaderInfo.name ] = shaderInfo
  },

  get: function( shaderName ){
    // check to see if exists
    var info = this.filters[ shaderName ]
    return info
  }
}

var FilterDefinitions = new FilterDefinitionsSingleton()
