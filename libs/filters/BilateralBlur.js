(function(){

  const options = {
    name: 'BilateralBlur',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
      distanceNormalizationFactor: {value: 3.5},
      texelWidth: {value: 0.005},
      texelHeight: {value: 0.005}
    }),
    vertexShader: `
      const int GAUSSIAN_SAMPLES = 9;

      uniform float texelWidth;
      uniform float texelHeight;

      varying vec2 textureCoordinate;
      varying vec2 blurCoordinates[GAUSSIAN_SAMPLES];

      void main()
      {
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          textureCoordinate = uv.xy;

          // Calculate the positions for the blur
          int multiplier = 0;
          vec2 blurStep;
          vec2 singleStepOffset = vec2(texelWidth, texelHeight);

          for (int i = 0; i < GAUSSIAN_SAMPLES; i++)
          {
              multiplier = (i - ((GAUSSIAN_SAMPLES - 1) / 2));
              // Blur in x (horizontal)
              blurStep = float(multiplier) * singleStepOffset;
              blurCoordinates[i] = uv.xy + blurStep;
          }
      }
    `,
    fragmentShader: `
      uniform sampler2D input0;

      const int GAUSSIAN_SAMPLES = 9;

      varying vec2 textureCoordinate;
      varying vec2 blurCoordinates[GAUSSIAN_SAMPLES];

      uniform float distanceNormalizationFactor;

      void main()
      {
          vec4 centralColor;
          float gaussianWeightTotal;
          vec4 sum;
          vec4 sampleColor;
          float distanceFromCentralColor;
          float gaussianWeight;

          centralColor = texture2D(input0, blurCoordinates[4]);
          gaussianWeightTotal = 0.18;
          sum = centralColor * 0.18;

          sampleColor = texture2D(input0, blurCoordinates[0]);
          distanceFromCentralColor = min(distance(centralColor, sampleColor) * distanceNormalizationFactor, 1.0);
          gaussianWeight = 0.05 * (1.0 - distanceFromCentralColor);
          gaussianWeightTotal += gaussianWeight;
          sum += sampleColor * gaussianWeight;

          sampleColor = texture2D(input0, blurCoordinates[1]);
          distanceFromCentralColor = min(distance(centralColor, sampleColor) * distanceNormalizationFactor, 1.0);
          gaussianWeight = 0.09 * (1.0 - distanceFromCentralColor);
          gaussianWeightTotal += gaussianWeight;
          sum += sampleColor * gaussianWeight;

          sampleColor = texture2D(input0, blurCoordinates[2]);
          distanceFromCentralColor = min(distance(centralColor, sampleColor) * distanceNormalizationFactor, 1.0);
          gaussianWeight = 0.12 * (1.0 - distanceFromCentralColor);
          gaussianWeightTotal += gaussianWeight;
          sum += sampleColor * gaussianWeight;

          sampleColor = texture2D(input0, blurCoordinates[3]);
          distanceFromCentralColor = min(distance(centralColor, sampleColor) * distanceNormalizationFactor, 1.0);
          gaussianWeight = 0.15 * (1.0 - distanceFromCentralColor);
          gaussianWeightTotal += gaussianWeight;
          sum += sampleColor * gaussianWeight;

          sampleColor = texture2D(input0, blurCoordinates[5]);
          distanceFromCentralColor = min(distance(centralColor, sampleColor) * distanceNormalizationFactor, 1.0);
          gaussianWeight = 0.15 * (1.0 - distanceFromCentralColor);
          gaussianWeightTotal += gaussianWeight;
          sum += sampleColor * gaussianWeight;

          sampleColor = texture2D(input0, blurCoordinates[6]);
          distanceFromCentralColor = min(distance(centralColor, sampleColor) * distanceNormalizationFactor, 1.0);
          gaussianWeight = 0.12 * (1.0 - distanceFromCentralColor);
          gaussianWeightTotal += gaussianWeight;
          sum += sampleColor * gaussianWeight;

          sampleColor = texture2D(input0, blurCoordinates[7]);
          distanceFromCentralColor = min(distance(centralColor, sampleColor) * distanceNormalizationFactor, 1.0);
          gaussianWeight = 0.09 * (1.0 - distanceFromCentralColor);
          gaussianWeightTotal += gaussianWeight;
          sum += sampleColor * gaussianWeight;

          sampleColor = texture2D(input0, blurCoordinates[8]);
          distanceFromCentralColor = min(distance(centralColor, sampleColor) * distanceNormalizationFactor, 1.0);
          gaussianWeight = 0.05 * (1.0 - distanceFromCentralColor);
          gaussianWeightTotal += gaussianWeight;
          sum += sampleColor * gaussianWeight;

          // gl_FragColor = ( texture2D(input0, blurCoordinates[0]) + texture2D(input0, blurCoordinates[1]) );
          gl_FragColor = sum / gaussianWeightTotal;
      }
    `
  }

  FilterDefinitions.add(shader)

})()
