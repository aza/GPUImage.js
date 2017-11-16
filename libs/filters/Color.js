(function(){

  const options = {
    name: 'RotateColor',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
        frame: {value: 0, update: (v) => { return v+1 }}
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: `
      uniform sampler2D input0;
      uniform float frame;

  		varying vec2 inputCoord;

  		void main(void)
  		{
        vec4 color = texture2D(input0, inputCoord );
        gl_FragColor = vec4( abs(color.r*sin(0.3+frame/50.0))*1.1, abs(color.g*sin(-frame/80.0))*1.5, abs(color.b*cos(frame/30.0)), 1.0 );
  		}
  	`
  }

  FilterDefinitions.add(shader)

})();
