
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

attribute vec3 aVertex;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vPosition;
varying vec3 vEye;

void main() {
  vNormal     = uNormalMatrix * aNormal;
  vTexCoord   = aTexCoord;
  vPosition   = vec3(uModelMatrix * vec4(aVertex, 1.0));
  vEye        = uNormalMatrix * -aVertex;
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertex, 1);
}