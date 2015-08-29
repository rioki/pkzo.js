precision highp float;

uniform vec3  uColor;
uniform float uTransparency;
uniform sampler2D uTexture;
uniform bool uHasTexture;

varying vec2 vTexCoord;

void main()
{
    if (uHasTexture) {
        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(uColor, 1.0 - uTransparency);
    }
    else {
        gl_FragColor = vec4(uColor, 1.0 - uTransparency);
    }
}