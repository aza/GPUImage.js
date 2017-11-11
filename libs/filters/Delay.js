(function(){

  const options = {
    name: 'ColorInvert',
    numberOfInputs: 1
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
  			"vec4 sample = texture2D(input0, inputCoord );",
  			"gl_FragColor = vec4((1.0 - sample.rbg), sample.w);",
  		"}",
  	].join("\n")
  }

  FilterDefinitions.add(shader)

})()
