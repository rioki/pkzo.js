precision highp float;

uniform samplerCube uCubemap;

varying vec3 vDirection;

void main()
{
    gl_FragColor = textureCube(uCubemap, vDirection);
}
