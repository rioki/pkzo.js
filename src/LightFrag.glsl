precision mediump float;

uniform vec3      uColor;
uniform sampler2D uTexture;
uniform bool      uHasTexture;

uniform int  uLightType; // 1: directional, 2: point, 3: spot
uniform vec3 uLightColor;
// this may need to multiplied by the view matrix?
uniform vec3 uLightDirection;

varying vec3 vNormal;
varying vec2 vTexCoord;

void main()
{
    vec3 color = uColor;    
    if (uHasTexture) {
        color = color * texture2D(uTexture, vTexCoord).rgb;
    }
    
    vec3 result = vec3(0);
    vec3 n = normalize(vNormal);
    //vec3 e = normalize(-vPosition);
    vec3 l = normalize(-uLightDirection);
    float atten = 1.0;
    
    float nDotL = dot(n, l);
    if (nDotL > 0.0) {    
        result += nDotL * color * uLightColor * atten;
    }
    
    //result += color * uLightColor;
    
    gl_FragColor = vec4(result, 1);
}                           
