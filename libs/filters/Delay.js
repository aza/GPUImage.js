(function(){

  const options = {
    name: 'Delay',
    numberOfInputs: 1,
    framesToDelay: 5
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs ),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: [
      "uniform sampler2D input0;",
  		"varying vec2 inputCoord;",
  		"void main(void)",
  		"{",
  			"gl_FragColor = texture2D(input0, inputCoord );",
  		"}",
  	].join("\n")
  }

  FilterDefinitions.add(shader)

})()
