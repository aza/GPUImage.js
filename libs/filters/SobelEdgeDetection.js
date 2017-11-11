(function(){

  const options = {
    name: 'SobelEdgeDetection',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
      edgeStrength: {value: 3.0},
      texelWidth: {value: 0.001},
      texelHeight: {value: 0.001}
    }),
    vertexShader: `
      // attribute vec4 position;
      // attribute vec4 inputTextureCoordinate;

      uniform float texelWidth;
      uniform float texelHeight;

      varying vec2 textureCoordinate;
      varying vec2 leftTextureCoordinate;
      varying vec2 rightTextureCoordinate;

      varying vec2 topTextureCoordinate;
      varying vec2 topLeftTextureCoordinate;
      varying vec2 topRightTextureCoordinate;

      varying vec2 bottomTextureCoordinate;
      varying vec2 bottomLeftTextureCoordinate;
      varying vec2 bottomRightTextureCoordinate;

      void main()
      {
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

          vec2 widthStep = vec2(texelWidth, 0.0);
          vec2 heightStep = vec2(0.0, texelHeight);
          vec2 widthHeightStep = vec2(texelWidth, texelHeight);
          vec2 widthNegativeHeightStep = vec2(texelWidth, -texelHeight);

          textureCoordinate = uv.xy;
          leftTextureCoordinate = uv.xy - widthStep;
          rightTextureCoordinate = uv.xy + widthStep;

          topTextureCoordinate = uv.xy - heightStep;
          topLeftTextureCoordinate = uv.xy - widthHeightStep;
          topRightTextureCoordinate = uv.xy + widthNegativeHeightStep;

          bottomTextureCoordinate = uv.xy + heightStep;
          bottomLeftTextureCoordinate = uv.xy - widthNegativeHeightStep;
          bottomRightTextureCoordinate = uv.xy + widthHeightStep;
      }
    `,
    fragmentShader: `
      //   Code from "Graphics Shaders: Theory and Practice" by M. Bailey and S. Cunningham

      precision mediump float;

      varying vec2 textureCoordinate;
      varying vec2 leftTextureCoordinate;
      varying vec2 rightTextureCoordinate;

      varying vec2 topTextureCoordinate;
      varying vec2 topLeftTextureCoordinate;
      varying vec2 topRightTextureCoordinate;

      varying vec2 bottomTextureCoordinate;
      varying vec2 bottomLeftTextureCoordinate;
      varying vec2 bottomRightTextureCoordinate;

      uniform sampler2D input0;
      uniform float edgeStrength;

      void main()
      {
         float bottomLeftIntensity = texture2D(input0, bottomLeftTextureCoordinate).r;
         float topRightIntensity = texture2D(input0, topRightTextureCoordinate).r;
         float topLeftIntensity = texture2D(input0, topLeftTextureCoordinate).r;
         float bottomRightIntensity = texture2D(input0, bottomRightTextureCoordinate).r;
         float leftIntensity = texture2D(input0, leftTextureCoordinate).r;
         float rightIntensity = texture2D(input0, rightTextureCoordinate).r;
         float bottomIntensity = texture2D(input0, bottomTextureCoordinate).r;
         float topIntensity = texture2D(input0, topTextureCoordinate).r;
         float h = -topLeftIntensity - 2.0 * topIntensity - topRightIntensity + bottomLeftIntensity + 2.0 * bottomIntensity + bottomRightIntensity;
         float v = -bottomLeftIntensity - 2.0 * leftIntensity - topLeftIntensity + bottomRightIntensity + 2.0 * rightIntensity + topRightIntensity;

         float mag = length(vec2(h, v)) * edgeStrength;

         gl_FragColor = vec4(vec3(mag), 1.0);
      }
    `
  }

  FilterDefinitions.add(shader)

})()
