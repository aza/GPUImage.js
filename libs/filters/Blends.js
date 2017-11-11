(function(){

  function createBlend( name, expression ){
    const options = {
      name: name,
      numberOfInputs: 2
    }

    var shader = {
      name: options.name,
      numberOfInputs: options.numberOfInputs,
      uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs ),
      vertexShader: FilterDefinitions._baseVertexShader(),
      fragmentShader: [

    		"uniform sampler2D input0;",
        "uniform sampler2D input1;",
    		"varying vec2 inputCoord;",

    		"void main(void)",
    		"{",

    		    "vec4 color1 = texture2D(input0, inputCoord);",
            "vec4 color2 = texture2D(input1, inputCoord);",

    		    "gl_FragColor = " + expression + ";",
    		"}"

    	].join("\n")
    }

    FilterDefinitions.add(shader)
  }

  createBlend("AddBlend", "color1 + color2")
  createBlend("SubtractBlend", "color1 - color2")
  createBlend("AbsSubtractBlend", "abs(color1 - color2)")
  createBlend("MultiplyBlend", "color1 * color2")
  createBlend("DivideBlend", "color1 / color2")
  createBlend("SqrtBlend", "sqrt(color1*color1 + color2*color2)")
  createBlend("AverageBlend", "(color1 + color2)/2.0")
  createBlend("ModBlend", "mod(50000.0*(color1 / color2), 5000.0)/5000.0")

})()
