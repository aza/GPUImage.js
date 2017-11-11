(function(){

  const options = {
    name: 'Swirl',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
        center: {type: 'v2', value: new THREE.Vector2(0.5, 0.5)},
        radius: {type: 'float', value: 0.5},
        angle: {type: 'float', value: 0.3},
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: `
      varying vec2 inputCoord;
      uniform sampler2D input0;

      uniform vec2 center;
      uniform float radius;
      uniform float angle;

      void main()
      {
          vec2 textureCoordinateToUse = inputCoord;
          float dist = distance(center, inputCoord);
          if (dist < radius)
          {
              textureCoordinateToUse -= center;
              float percent = (radius - dist) / radius;
              float theta = percent * percent * angle * 8.0;
              float s = sin(theta);
              float c = cos(theta);
              textureCoordinateToUse = vec2(dot(textureCoordinateToUse, vec2(c, -s)), dot(textureCoordinateToUse, vec2(s, c)));
              textureCoordinateToUse += center;
          }

          gl_FragColor = texture2D(input0, textureCoordinateToUse );
      }
    `
  }

  FilterDefinitions.add(shader)

})()
