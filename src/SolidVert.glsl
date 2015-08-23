
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

attribute vec3 aVertex;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

varying vec3 vNormal;
varying vec2 vTexCoord;

void main() {
  vNormal     = uNormalMatrix * aNormal;
  vTexCoord   = aTexCoord;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertex, 1);
}