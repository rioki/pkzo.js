
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

attribute vec3 aVertex;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec3 aTangent;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vPosition;
varying vec3 vEye;
varying mat3 vTBN;

void main() {
  vec3 n = normalize(uNormalMatrix * aNormal);
  vec3 t = normalize(uNormalMatrix * aTangent);
  vec3 b = normalize(cross(n, t));
    
  vNormal     = n;
  vTexCoord   = aTexCoord;
  vPosition   = vec3(uModelMatrix * vec4(aVertex, 1.0));
  
  vEye        = mat3(uViewMatrix) * -aVertex;
  vTBN        = mat3(t, b, n);
  
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertex, 1);
}