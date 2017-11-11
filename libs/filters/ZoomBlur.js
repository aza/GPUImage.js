(function(){

  const options = {
    name: 'ZoomBlur',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
      "blurCenter": {type: "vec2", value: new THREE.Vector2(0.5, 0.5)},
  		"blurSize": {type: "float", value: 3.0}
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: [

  		"uniform sampler2D input0;",
  		"varying vec2 inputCoord;",
  		"uniform vec2 blurCenter;",
  		"uniform float blurSize;",

  		"void main(void)",
  		"{",

  				"// TODO: Do a more intelligent scaling based on resolution here",
  		    "vec2 samplingOffset = 1.0/100.0 * (blurCenter - inputCoord) * blurSize;",

  		    "vec4 fragmentColor = texture2D(input0, inputCoord) * 0.18;",
  		    "fragmentColor += texture2D(input0, inputCoord + samplingOffset) * 0.15;",
  		    "fragmentColor += texture2D(input0, inputCoord + (2.0 * samplingOffset)) *  0.12;",
  		    "fragmentColor += texture2D(input0, inputCoord + (3.0 * samplingOffset)) * 0.09;",
  		    "fragmentColor += texture2D(input0, inputCoord + (4.0 * samplingOffset)) * 0.05;",
  		    "fragmentColor += texture2D(input0, inputCoord - samplingOffset) * 0.15;",
  		    "fragmentColor += texture2D(input0, inputCoord - (2.0 * samplingOffset)) *  0.12;",
  		    "fragmentColor += texture2D(input0, inputCoord - (3.0 * samplingOffset)) * 0.09;",
  		    "fragmentColor += texture2D(input0, inputCoord - (4.0 * samplingOffset)) * 0.05;",
  		    "gl_FragColor = fragmentColor;",
  		"}"

  	].join("\n")
  }

  FilterDefinitions.add(shader)

})()
