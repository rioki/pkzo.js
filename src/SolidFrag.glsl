precision mediump float;

//uniform sampler2D uTexture;

varying vec3 vNormal;
varying vec2 vTexCoord;

void main()
{
    //gl_FragColor = texture2D(uTexture, vTexCoord);
    gl_FragColor = vec4(1, 1, 1, 1);
}