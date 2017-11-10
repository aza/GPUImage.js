/**
 * @author zz85 / https://github.com/zz85 | https://www.lab4games.net/zz85/blog
 *
 * Edge Detection Shader using Frei-Chen filter
 * Based on http://rastergrid.com/blog/2011/01/frei-chen-edge-detector
 *
 * aspect: vec2 of (1/width, 1/height)
 */

THREE.FunShader = {

	uniforms: {
		"tDiffuse1": { type: "t", value: null }
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
		"varying vec2 vUv;",

		"void main(void)",
		"{",

			"vec3 sample = texture2D(tDiffuse1, vUv ).rgb;",
			"gl_FragColor = vec4(vec3(sample.g, sample.b, sample.r), 1.0);",

		"}",

	].join("\n")
};
