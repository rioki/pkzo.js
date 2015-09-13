precision highp float;

uniform vec3      uEmissiveColor;
uniform sampler2D uEmissiveMap;
uniform bool      uHasEmissiveMap;

varying vec2 vTexCoord;

void main()
{
    vec3 color = uEmissiveColor;
    
    if (uHasEmissiveMap) {
        color = color * texture2D(uEmissiveMap, vTexCoord).rgb;
    }
    
    gl_FragColor = vec4(color, 1.0);
}
