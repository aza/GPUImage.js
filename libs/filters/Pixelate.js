(function(){

  const options = {
    name: 'Pixelate',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
        fractionalWidthOfPixel: {type: 'float', value: 0.02},
        aspectRatio: {type: 'float', value: 1.0}
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: `
      varying vec2 inputCoord;

      uniform sampler2D input0;

      uniform float fractionalWidthOfPixel;
      uniform float aspectRatio;

      void main()
      {
          vec2 sampleDivisor = vec2(fractionalWidthOfPixel, fractionalWidthOfPixel / aspectRatio);

          vec2 samplePos = inputCoord - mod(inputCoord, sampleDivisor) + 0.5 * sampleDivisor;
          gl_FragColor = texture2D(input0, samplePos );
      }
    `
  }

  FilterDefinitions.add(shader)

})()
