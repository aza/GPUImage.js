(function(){

  const options = {
    name: 'Transform',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
        scale: {type: 'v2', value: new THREE.Vector2(0.5, 0.5)},
        translate: {type: 'v2', value: new THREE.Vector2(0, 0)},
        backgroundColor: {type: 'v3', value: new THREE.Vector2(0, 1, 0)},
        angle: {type: 'float', value: 0}
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: `
      varying vec2 inputCoord;
      uniform sampler2D input0;

      uniform vec3 backgroundColor;
      uniform vec2 scale;
      uniform vec2 translate;
      uniform float angle;

      void main()
      {
        vec3 coordinates;
             coordinates.x = inputCoord.x;
             coordinates.y = inputCoord.y;
             coordinates.z = 1.0;

        float radAngle = radians( angle );

        mat3 transform;
             transform = mat3(   1.0/scale.x * cos( radAngle ), 1.0/scale.x * sin( radAngle ), 0.0,
                               - 1.0/scale.y * sin( radAngle ), 1.0/scale.y * cos( radAngle ), 0.0,

                              - 0.5 * 1.0/scale.x * cos( radAngle ) + 0.5 * 1.0/scale.y * sin( radAngle ) - 0.5 * translate.x + 0.5,  - 0.5 * 1.0/scale.x * sin( radAngle ) - 0.5 * 1.0/scale.y * cos( radAngle ) - 0.5 * translate.y + 0.5, 1.0);

        vec3 tCoord = transform * coordinates;
        gl_FragColor = texture2D( input0, tCoord.xy );

        if( tCoord.x < 0.0 || tCoord.x > 1.0 || tCoord.y < 0.0 || tCoord.y > 1.0) {
          gl_FragColor = vec4(backgroundColor, 1.0);
        }

      }
    `
  }

  FilterDefinitions.add(shader)

})()
