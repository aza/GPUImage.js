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


(function(){

  const options = {
    name: 'Hue',
    numberOfInputs: 1
  }

  var shader = {
    name: options.name,
    numberOfInputs: options.numberOfInputs,
    uniforms: FilterDefinitions._baseUniforms( options.numberOfInputs, {
        hueAdjust: {value: 0}
    }),
    vertexShader: FilterDefinitions._baseVertexShader(),
    fragmentShader: `
    varying vec2 inputCoord;

    uniform sampler2D input0;
    uniform float hueAdjust;
    const vec4  kRGBToYPrime = vec4 (0.299, 0.587, 0.114, 0.0);
    const vec4  kRGBToI     = vec4 (0.595716, -0.274453, -0.321263, 0.0);
    const vec4  kRGBToQ     = vec4 (0.211456, -0.522591, 0.31135, 0.0);

    const vec4  kYIQToR   = vec4 (1.0, 0.9563, 0.6210, 0.0);
    const vec4  kYIQToG   = vec4 (1.0, -0.2721, -0.6474, 0.0);
    const vec4  kYIQToB   = vec4 (1.0, -1.1070, 1.7046, 0.0);

    void main ()
    {
        // Sample the input pixel
        vec4 color   = texture2D(input0, inputCoord);

        // Convert to YIQ
        float   YPrime  = dot (color, kRGBToYPrime);
        float   I      = dot (color, kRGBToI);
        float   Q      = dot (color, kRGBToQ);

        // Calculate the hue and chroma
        float   hue     = atan (Q, I);
        float   chroma  = sqrt (I * I + Q * Q);

        // Make the user's adjustments
        hue += (-hueAdjust); //why negative rotation?

        // Convert back to YIQ
        Q = chroma * sin (hue);
        I = chroma * cos (hue);

        // Convert back to RGB
        vec4    yIQ   = vec4 (YPrime, I, Q, 0.0);
        color.r = dot (yIQ, kYIQToR);
        color.g = dot (yIQ, kYIQToG);
        color.b = dot (yIQ, kYIQToB);

        // Save the result
        gl_FragColor = color;
    }
  	`
  }

  FilterDefinitions.add(shader)

})();
