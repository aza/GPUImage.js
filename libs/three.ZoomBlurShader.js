THREE.ZoomBlurShader = {

	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"blurCenter": {type: "vec2", value: new THREE.Vector2(0.5, 0.5)},
		"blurSize": {type: "float", value: 3.0}
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",
		"uniform vec2 blurCenter;",
		"uniform float blurSize;",

		"void main(void)",
		"{",

				"// TODO: Do a more intelligent scaling based on resolution here",
		    "vec2 samplingOffset = 1.0/100.0 * (blurCenter - vUv) * blurSize;",

		    "vec4 fragmentColor = texture2D(tDiffuse, vUv) * 0.18;",
		    "fragmentColor += texture2D(tDiffuse, vUv + samplingOffset) * 0.15;",
		    "fragmentColor += texture2D(tDiffuse, vUv + (2.0 * samplingOffset)) *  0.12;",
		    "fragmentColor += texture2D(tDiffuse, vUv + (3.0 * samplingOffset)) * 0.09;",
		    "fragmentColor += texture2D(tDiffuse, vUv + (4.0 * samplingOffset)) * 0.05;",
		    "fragmentColor += texture2D(tDiffuse, vUv - samplingOffset) * 0.15;",
		    "fragmentColor += texture2D(tDiffuse, vUv - (2.0 * samplingOffset)) *  0.12;",
		    "fragmentColor += texture2D(tDiffuse, vUv - (3.0 * samplingOffset)) * 0.09;",
		    "fragmentColor += texture2D(tDiffuse, vUv - (4.0 * samplingOffset)) * 0.05;",
		    "gl_FragColor = fragmentColor;",
		"}"

	].join("\n")
};
