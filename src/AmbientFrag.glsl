precision highp float;

uniform vec3      uColor;
uniform sampler2D uTexture;
uniform bool      uHasTexture;

uniform vec3 uAmbientLight;

varying vec3 vNormal;
varying vec2 vTexCoord;

void main()
{
    vec3 color = uColor;
    
    if (uHasTexture) {
        color = color * texture2D(uTexture, vTexCoord).rgb;
    }
    
    gl_FragColor = vec4(color * uAmbientLight, 1);
}
