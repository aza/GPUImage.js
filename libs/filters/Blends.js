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
      fragmentShader: `
    		uniform sampler2D input0;
        uniform sampler2D input1;

    		varying vec2 inputCoord;

    		void main(void)
    		{
    		    vec4 color1 = texture2D(input0, inputCoord);
            vec4 color2 = texture2D(input1, inputCoord);
    		    gl_FragColor = ${expression};
    		}
    	`
    }

    FilterDefinitions.add(shader)
  }

  createBlend("AddBlend", "color1 + color2")
  createBlend("SubtractBlend", "color1 - color2")
  createBlend("DifferenceBlend", "abs(color1 - color2)")
  createBlend("MultiplyBlend", "color1 * color2")
  createBlend("DivideBlend", "color1 / color2")
  createBlend("SqrtBlend", "sqrt(color1*color1 + color2*color2)")
  createBlend("AverageBlend", "(color1 + color2)/2.0")
  createBlend("ModBlend", "mod(50000.0*(color1 / color2), 5000.0)/5000.0")

})();


(function(){

  function createBlend( name, expression ){
    const options = {
      name: name,
      numberOfInputs: 3
    }

    var shader = {
      name: options.name,
      numberOfInputs: options.numberOfInputs,
      uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs ),
      vertexShader: FilterDefinitions._baseVertexShader(),
      fragmentShader: `
    		uniform sampler2D input0;
        uniform sampler2D input1;
        uniform sampler2D input2;
    		varying vec2 inputCoord;

        // Values from "Graphics Shaders: Theory and Practice" by Bailey and Cunningham
        const vec3 W = vec3(0.2125, 0.7154, 0.0721);

    		void main(void)
    		{
    		    vec4 color1 = texture2D(input0, inputCoord);
            vec4 color2 = texture2D(input1, inputCoord);
            vec4 color3 = texture2D(input2, inputCoord);

    		    gl_FragColor = ${expression};
    		}
    	`
    }

    FilterDefinitions.add(shader)
  }

  createBlend("MixByThirdLuminance", "mix( color1, color2, dot(color3.rgb, W))")
  createBlend("MixByThirdColor", "mix( color1, color2, color3)")
  createBlend("ShowLuminance", "vec3(dot(color3.rgb, W), dot(color3.rgb, W), dot(color3.rgb, W))")
  // createBlend("MixByThird", "vec3(color1.r, color2.g, color3.b) ")


})()
