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

})();

(function(){

  const options = {
    name: "Grow",
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
      a: {type: 'float', value: 0.01}
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: `

      uniform float a;
  		uniform sampler2D input0;
  		varying vec2 inputCoord;

  		void main(void)
  		{
  		    vec4 color = texture2D(input0, inputCoord);
          vec4 u = texture2D(input0, inputCoord + vec2( 0.0, a ) );
          vec4 d = texture2D(input0, inputCoord + vec2( 0.0, -a ) );
          vec4 l = texture2D(input0, inputCoord + vec2( a, 0.0 ) );
          vec4 r = texture2D(input0, inputCoord + vec2( -a, 0.0 ) );

  		    gl_FragColor = u+d+l+r/4.0 - 0.2*color;
  		}
      `
  }

  FilterDefinitions.add(shader)

})();


(function(){

  const options = {
    name: "Double",
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
      a: {type: 'float', value: 0.01}
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: `

      uniform float a;
  		uniform sampler2D input0;
  		varying vec2 inputCoord;

  		void main(void)
  		{
  		    vec4 color = texture2D(input0, inputCoord * vec2( 2.0, 1.0) );
          if( inputCoord.x > 0.5 ){
            color = texture2D(input0, inputCoord * vec2( 2.0, 1.0) - vec2(1.0, 0.0) );
          }

  		    gl_FragColor = color;
  		}
      `
  }

  FilterDefinitions.add(shader)

})();
