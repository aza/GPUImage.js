(function(){

  const options = {
    name: 'SphereRefraction',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
        center: {type: 'v2', value: new THREE.Vector2(0.5, 0.5)},
        radius: {type: 'float', value: 0.3},
        aspectRatio: {type: 'float', value: 1.0},
        refractiveIndex: {type: 'float', value: 0.6}
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: `
      varying vec2 inputCoord;

      uniform sampler2D input0;

      uniform vec2 center;
      uniform float radius;
      uniform float aspectRatio;
      uniform float refractiveIndex;

      void main()
      {
          vec2 inputCoordToUse = vec2(inputCoord.x, (inputCoord.y * aspectRatio + 0.5 - 0.5 * aspectRatio));
          float distanceFromCenter = distance(center, inputCoordToUse);
          float checkForPresenceWithinSphere = step(distanceFromCenter, radius);

          distanceFromCenter = distanceFromCenter / radius;

          float normalizedDepth = radius * sqrt(1.0 - distanceFromCenter * distanceFromCenter);
          vec3 sphereNormal = normalize(vec3(inputCoordToUse - center, normalizedDepth));

          vec3 refractedVector = refract(vec3(0.0, 0.0, -1.0), sphereNormal, refractiveIndex);

          gl_FragColor = texture2D(input0, (refractedVector.xy + 1.0) * 0.5) * checkForPresenceWithinSphere + texture2D(input0, inputCoord) * (1.0 - checkForPresenceWithinSphere);
      }
    `
  }

  FilterDefinitions.add(shader)

})()
