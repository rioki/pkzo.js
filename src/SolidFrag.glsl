precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;
uniform bool uHasTexture;

varying vec3 vNormal;
varying vec2 vTexCoord;

void main()
{
    if (uHasTexture) {
        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(uColor, 1);
    }
    else {
        gl_FragColor = vec4(uColor, 1);
    }
}