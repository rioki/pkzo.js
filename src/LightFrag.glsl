precision mediump float;

uniform vec3      uColor;
uniform sampler2D uTexture;
uniform bool      uHasTexture;

uniform int   uLightType; // 1: directional, 2: point, 3: spot
uniform vec3  uLightColor;
uniform vec3  uLightDirection;
uniform vec3  uLightPosition;
uniform float uLightRange;
uniform float uLightCutoff;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vPosition;

void main() {
    vec3 color = uColor;    
    if (uHasTexture) {
        color = color * texture2D(uTexture, vTexCoord).rgb;
    }
    
    vec3 normal = normalize(vNormal);
    
    vec3 lightDirection;
    float atten;
    if (uLightType == 1) {
        lightDirection = normalize(-uLightDirection);
        atten = 1.0;
    }
    if (uLightType == 2) {
        lightDirection = uLightPosition - vPosition;
        float dist = length(lightDirection);
        if (dist > uLightRange) {
            discard;
        }
        lightDirection = normalize(lightDirection);
        atten = 1.0 - (dist / uLightRange);    
    }
    if (uLightType == 3) {
        lightDirection = uLightPosition - vPosition;
        float dist = length(lightDirection);
        if (dist > uLightRange) {
            discard;
        }
        lightDirection = normalize(lightDirection);
        atten = 1.0 - (dist / uLightRange);    
        
        if (dot(lightDirection, -uLightDirection) < uLightCutoff) {
            discard;
        }  
    }
    
    vec3 result = vec3(0);    
    float nDotL = dot(normal, lightDirection);
    if (nDotL > 0.0) {    
        result += nDotL * color * uLightColor * atten;
    }
        
    gl_FragColor = vec4(result, 1);
}                           
