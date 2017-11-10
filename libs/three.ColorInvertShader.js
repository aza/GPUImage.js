/**
 * @author zz85 / https://github.com/zz85 | https://www.lab4games.net/zz85/blog
 *
 * Edge Detection Shader using Frei-Chen filter
 * Based on http://rastergrid.com/blog/2011/01/frei-chen-edge-detector
 *
 * aspect: vec2 of (1/width, 1/height)
 */

THREE.ColorInvertShader = {

	uniforms: {
		"tDiffuse": { type: "t", value: null }
	},

	vertexShader: [

		"varying vec2 textureCoordinate;",

		"void main() {",

			"textureCoordinate = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"varying vec2 textureCoordinate;",

		"void main(void)",
		"{",

			"vec4 sample = texture2D(tDiffuse, textureCoordinate );",
			"gl_FragColor = vec4((1.0 - sample.rbg), sample.w);",

		"}",

	].join("\n")
};
