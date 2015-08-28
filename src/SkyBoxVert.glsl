precision highp float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

attribute vec3 aVertex;

varying vec3 vDirection;

void main()
{
    vec4 vertex            = vec4(aVertex, 1);
    mat4 inverseProjection = inverse(uProjectionMatrix);
    mat3 inverseView       = inverse(mat3(uViewMatrix));
    vec3 unprojected       = (inverseProjection * vertex).xyz;
    
    vDirection  = inverseView * unprojected;
    gl_Position = vertex;
}