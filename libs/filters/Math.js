(function(){

  function createBlend( name, expression, defaults ){
    const options = {
      name: name,
      numberOfInputs: 1
    }

    var shader = {
      name: options.name,
      numberOfInputs: options.numberOfInputs,
      uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
        a: {type: 'float', value: 1.0},
        b: {type: 'float', value: 1.0},
      }),
      vertexShader: FilterDefinitions._baseVertexShader(),
      fragmentShader: `

        uniform float a;
        uniform float b;
    		uniform sampler2D input0;
    		varying vec2 inputCoord;


    		void main(void)
    		{
    		    vec4 color = texture2D(input0, inputCoord);
    		    gl_FragColor = ${expression};
    		}
        `
    }

    Object.keys( defaults ).forEach( key => {shader.uniforms[key].value = defaults[key] })

    FilterDefinitions.add(shader)
  }

  createBlend("Mod", "mod(a*color, b)/b", {a: 10000, b: 1000})
  createBlend("Floor", "floor(a*color)/b", {a: 5, b: 5})

})()
