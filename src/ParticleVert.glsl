precision highp float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform float uSize;

attribute vec3 aVertex;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  mat4 modelView = uViewMatrix * uModelMatrix ;
  modelView[0] = vec4(uSize, 0, 0, 0);
  modelView[1] = vec4(0, uSize, 0, 0);
  modelView[2] = vec4(0, 0, uSize, 0);
  
  vTexCoord = aTexCoord;
    
  gl_Position = uProjectionMatrix * modelView * vec4(aVertex, 1);
}