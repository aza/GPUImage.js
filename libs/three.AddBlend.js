/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.AddBlend = {

	uniforms: {
		"tDiffuse1": { type: "t", value: null },
    "tDiffuse2": { type: "t", value: null }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse1;",
    "uniform sampler2D tDiffuse2;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse1, vUv );",
      "vec4 texel2 = texture2D( tDiffuse2, vUv );",
			"gl_FragColor = texel + texel2;",

		"}"

	].join("\n")

};


THREE.MultiplyBlend = {

	uniforms: {

		"tDiffuse1": { type: "t", value: null },
    "tDiffuse2": { type: "t", value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse1;",
    "uniform sampler2D tDiffuse2;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse1, vUv );",
      "vec4 texel2 = texture2D( tDiffuse2, vUv );",
			"gl_FragColor = texel * texel2;",

		"}"

	].join("\n")

};
