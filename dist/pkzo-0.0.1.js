
var http = {};

http.send = function (type, url, data, cb) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (xmlhttp.readyState == 4)
    {
      cb(xmlhttp.status, xmlhttp.responseText);
    }
  }    
  xmlhttp.open(type, url, true);
  xmlhttp.send(data);
}

http.get = function (url, cb) {
  http.send("GET", url, null, cb);
}

http.post = function (url, data, cb) {
  http.send("GET", url, data, cb);
}


var pkzo = {version: '0.0.1'};

pkzo.AmbientFrag = "precision highp float;\n\n\n\nuniform vec3      uAlbedo;\n\nuniform sampler2D uTexture;\n\nuniform bool      uHasTexture;\n\n\n\nuniform vec3 uAmbientLight;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    vec3 color = uAlbedo;\n\n    \n\n    if (uHasTexture) {\n\n        color = color * texture2D(uTexture, vTexCoord).rgb;\n\n    }\n\n    \n\n    gl_FragColor = vec4(color * uAmbientLight, 1);\n\n}\n\n";
pkzo.EmissiveFrag = "precision highp float;\n\n\n\nuniform vec3      uEmissiveColor;\n\nuniform sampler2D uEmissiveMap;\n\nuniform bool      uHasEmissiveMap;\n\n\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    vec3 color = uEmissiveColor;\n\n    \n\n    if (uHasEmissiveMap) {\n\n        color = color * texture2D(uEmissiveMap, vTexCoord).rgb;\n\n    }\n\n    \n\n    gl_FragColor = vec4(color, 1.0);\n\n}\n\n";
pkzo.Inverse = "/*\n\nThe MIT License (MIT)\n\n\n\nCopyright (c) 2014 Mikola Lysenko\n\n\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\n\nof this software and associated documentation files (the \"Software\"), to deal\n\nin the Software without restriction, including without limitation the rights\n\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n\ncopies of the Software, and to permit persons to whom the Software is\n\nfurnished to do so, subject to the following conditions:\n\n\n\nThe above copyright notice and this permission notice shall be included in\n\nall copies or substantial portions of the Software.\n\n\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n\nTHE SOFTWARE.\n\n*/\n\n\n\nmat2 inverse(mat2 m) {\n\n  return mat2(m[1][1],-m[0][1],\n\n             -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);\n\n}\n\n\n\nmat3 inverse(mat3 m) {\n\n  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n\n  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n\n  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n\n\n\n  float b01 = a22 * a11 - a12 * a21;\n\n  float b11 = -a22 * a10 + a12 * a20;\n\n  float b21 = a21 * a10 - a11 * a20;\n\n\n\n  float det = a00 * b01 + a01 * b11 + a02 * b21;\n\n\n\n  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n\n              b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n\n              b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n\n}\n\n\n\nmat4 inverse(mat4 m) {\n\n  float\n\n      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n\n      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n\n      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n\n      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n\n\n\n      b00 = a00 * a11 - a01 * a10,\n\n      b01 = a00 * a12 - a02 * a10,\n\n      b02 = a00 * a13 - a03 * a10,\n\n      b03 = a01 * a12 - a02 * a11,\n\n      b04 = a01 * a13 - a03 * a11,\n\n      b05 = a02 * a13 - a03 * a12,\n\n      b06 = a20 * a31 - a21 * a30,\n\n      b07 = a20 * a32 - a22 * a30,\n\n      b08 = a20 * a33 - a23 * a30,\n\n      b09 = a21 * a32 - a22 * a31,\n\n      b10 = a21 * a33 - a23 * a31,\n\n      b11 = a22 * a33 - a23 * a32,\n\n\n\n      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\n\n\n  return mat4(\n\n      a11 * b11 - a12 * b10 + a13 * b09,\n\n      a02 * b10 - a01 * b11 - a03 * b09,\n\n      a31 * b05 - a32 * b04 + a33 * b03,\n\n      a22 * b04 - a21 * b05 - a23 * b03,\n\n      a12 * b08 - a10 * b11 - a13 * b07,\n\n      a00 * b11 - a02 * b08 + a03 * b07,\n\n      a32 * b02 - a30 * b05 - a33 * b01,\n\n      a20 * b05 - a22 * b02 + a23 * b01,\n\n      a10 * b10 - a11 * b08 + a13 * b06,\n\n      a01 * b08 - a00 * b10 - a03 * b06,\n\n      a30 * b04 - a31 * b02 + a33 * b00,\n\n      a21 * b02 - a20 * b04 - a23 * b00,\n\n      a11 * b07 - a10 * b09 - a12 * b06,\n\n      a00 * b09 - a01 * b07 + a02 * b06,\n\n      a31 * b01 - a30 * b03 - a32 * b00,\n\n      a20 * b03 - a21 * b01 + a22 * b00) / det;\n\n}\n\n";
pkzo.LightFrag = "precision highp float;\n\n\n\nuniform vec3      uAlbedo;\n\nuniform bool      uHasTexture;\n\nuniform sampler2D uTexture;\n\nuniform float     uRoughness;\n\nuniform bool      uHasRoughnessMap;\n\nuniform sampler2D uRoughnessMap;\n\nuniform bool      uHasNormalMap;\n\nuniform sampler2D uNormalMap;\n\n\n\nuniform int   uLightType; // 1: directional, 2: point, 3: spot\n\nuniform vec3  uLightColor;\n\nuniform vec3  uLightDirection;\n\nuniform vec3  uLightPosition;\n\nuniform float uLightRange;\n\nuniform float uLightCutoff;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\nvarying vec3 vPosition;\n\nvarying vec3 vEye;\n\nvarying mat3 vTBN;\n\n\n\nvoid main() {\n\n    vec3 color = uAlbedo;    \n\n    if (uHasTexture) {\n\n        color = color * texture2D(uTexture, vTexCoord).rgb;\n\n    }\n\n    \n\n    vec3 normal;\n\n    if (uHasNormalMap) {\n\n        normal = normalize(vTBN * texture2D(uNormalMap, vTexCoord).rgb);\n\n    }\n\n    else {\n\n        normal = normalize(vNormal);        \n\n    }\n\n    \n\n    vec3 lightDirection;\n\n    float atten;\n\n    if (uLightType == 1) {\n\n        lightDirection = normalize(-uLightDirection);\n\n        atten = 1.0;\n\n    }\n\n    if (uLightType == 2) {\n\n        lightDirection = uLightPosition - vPosition;\n\n        float dist = length(lightDirection);\n\n        if (dist > uLightRange) {\n\n            discard;\n\n        }\n\n        lightDirection = normalize(lightDirection);\n\n        atten = 1.0 - (dist / uLightRange);    \n\n    }\n\n    if (uLightType == 3) {\n\n        lightDirection = uLightPosition - vPosition;\n\n        float dist = length(lightDirection);\n\n        if (dist > uLightRange) {\n\n            discard;\n\n        }\n\n        lightDirection = normalize(lightDirection);\n\n        atten = 1.0 - (dist / uLightRange);    \n\n        \n\n        if (dot(lightDirection, -uLightDirection) < uLightCutoff) {\n\n            discard;\n\n        }  \n\n    }\n\n    \n\n    vec3 result = vec3(0);    \n\n    float nDotL = dot(normal, lightDirection);\n\n    if (nDotL > 0.0) {    \n\n        result += nDotL * color * uLightColor * atten;\n\n        \n\n        vec3 eye = normalize(vEye);\n\n        vec3 reflection = reflect(normal, lightDirection);\n\n        float shininess = 1.0 - uRoughness;\n\n        if (uHasRoughnessMap) {\n\n            shininess = shininess * (1.0 - texture2D(uRoughnessMap, vTexCoord).r);\n\n        }        \n\n\n\n        float eDotR = dot(eye, reflection);	\n\n        if (eDotR > 0.0)\n\n        {\n\n            // 0-1 -> 0-128\n\n            float si = pow(eDotR, shininess * 128.0);\n\n            result += uLightColor * vec3(shininess)  * si;\n\n        }\n\n    }\n\n            \n\n    gl_FragColor = vec4(result, 1.0);\n\n}                           \n\n";
pkzo.ParticleFrag = "precision highp float;\n\n\n\nuniform vec3  uColor;\n\nuniform float uTransparency;\n\nuniform sampler2D uTexture;\n\nuniform bool uHasTexture;\n\n\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    if (uHasTexture) {\n\n        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(uColor, 1.0 - uTransparency);\n\n    }\n\n    else {\n\n        gl_FragColor = vec4(uColor, 1.0 - uTransparency);\n\n    }\n\n}";
pkzo.ParticleVert = "precision highp float;\n\n\n\nuniform mat4 uProjectionMatrix;\n\nuniform mat4 uViewMatrix;\n\nuniform mat4 uModelMatrix;\n\nuniform float uSize;\n\n\n\nattribute vec3 aVertex;\n\nattribute vec2 aTexCoord;\n\n\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main() {\n\n  mat4 modelView = uViewMatrix * uModelMatrix ;\n\n  modelView[0] = vec4(uSize, 0, 0, 0);\n\n  modelView[1] = vec4(0, uSize, 0, 0);\n\n  modelView[2] = vec4(0, 0, uSize, 0);\n\n  \n\n  vTexCoord = aTexCoord;\n\n    \n\n  gl_Position = uProjectionMatrix * modelView * vec4(aVertex, 1);\n\n}";
pkzo.SkyBoxFrag = "precision highp float;\n\n\n\nuniform samplerCube uCubemap;\n\n\n\nvarying vec3 vDirection;\n\n\n\nvoid main()\n\n{\n\n    gl_FragColor = textureCube(uCubemap, vDirection);\n\n}\n\n";
pkzo.SkyBoxVert = "precision highp float;\n\n\n\nuniform mat4 uProjectionMatrix;\n\nuniform mat4 uViewMatrix;\n\n\n\nattribute vec3 aVertex;\n\n\n\nvarying vec3 vDirection;\n\n\n\nvoid main()\n\n{\n\n    vec4 vertex            = vec4(aVertex, 1);\n\n    mat4 inverseProjection = inverse(uProjectionMatrix);\n\n    mat3 inverseView       = inverse(mat3(uViewMatrix));\n\n    vec3 unprojected       = (inverseProjection * vertex).xyz;\n\n    \n\n    vDirection  = inverseView * unprojected;\n\n    gl_Position = vertex;\n\n}";
pkzo.SolidFrag = "precision highp float;\n\n\n\nuniform vec3 uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool uHasTexture;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    if (uHasTexture) {\n\n        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(uAlbedo, 1);\n\n    }\n\n    else {\n\n        gl_FragColor = vec4(uAlbedo, 1);\n\n    }\n\n}";
pkzo.SolidVert = "precision highp float;\n\n\n\nuniform mat4 uProjectionMatrix;\n\nuniform mat4 uViewMatrix;\n\nuniform mat4 uModelMatrix;\n\nuniform mat3 uNormalMatrix;\n\n\n\nattribute vec3 aVertex;\n\nattribute vec3 aNormal;\n\nattribute vec2 aTexCoord;\n\nattribute vec3 aTangent;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\nvarying vec3 vPosition;\n\nvarying vec3 vEye;\n\nvarying mat3 vTBN;\n\n\n\nvoid main() {\n\n  vec3 n = normalize(uNormalMatrix * aNormal);\n\n  vec3 t = normalize(uNormalMatrix * aTangent);\n\n  vec3 b = normalize(cross(n, t));\n\n    \n\n  vNormal     = n;\n\n  vTexCoord   = aTexCoord;\n\n  vPosition   = vec3(uModelMatrix * vec4(aVertex, 1.0));\n\n  \n\n  vEye        = mat3(uViewMatrix) * -aVertex;\n\n  vTBN        = mat3(t, b, n);\n\n  \n\n  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertex, 1);\n\n}";
pkzo.Transpose = "\n\nmat2 tanspose(mat2 m) {\n\n  mat2 r;\n\n  for (int i = 0; i < 2; i++) {\n\n    for (int j = 0; j < 2; j++) {\n\n       r[i][j] = m[j][i];\n\n    }\n\n  }\n\n  return r;\n\n}\n\n\n\nmat3 tanspose(mat3 m) {\n\n  mat3 r;\n\n  for (int i = 0; i < 3; i++) {\n\n    for (int j = 0; j < 3; j++) {\n\n       r[i][j] = m[j][i];\n\n    }\n\n  }\n\n  return r;\n\n}\n\n\n\nmat4 tanspose(mat4 m) {\n\n  mat4 r;\n\n  for (int i = 0; i < 4; i++) {\n\n    for (int j = 0; j < 4; j++) {\n\n       r[i][j] = m[j][i];\n\n    }\n\n  }\n\n  return r;\n\n}\n\n";


pkzo.Canvas = function (element) {
  if (typeof element === 'string') {
    this.canvas = document.getElementById(element);
  }
  else {
    this.canvas = element;
  }  
  
  this.canvas.width  = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;  
  
  this.gl = this.canvas.getContext("webgl", {antialias: true, depth: true});
  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
  // these values are for the programmer of the draw function, 
  // we pass the gl object, not the canvas.
  this.gl.width  = this.canvas.width;
  this.gl.height = this.canvas.height;
}

pkzo.Canvas.prototype.init = function (cb) {
  if (cb) {
    cb.call(this, this.gl);
  }
}

pkzo.Canvas.prototype.draw = function (cb) {  
  if (this.canvas.width != this.canvas.clientWidth || this.canvas.height != this.canvas.clientHeight) {
    this.canvas.width  = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;  
    this.gl.width  = this.canvas.width;
    this.gl.height = this.canvas.height;
  }
  
  this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  
  if (cb) {
    cb.call(this, this.gl);
  }
}




pkzo.Texture = function (url) {
  this.url    = url;
  this.image  = null;
  this.loaded = false;
  
  // we don't upload the image to VRAM, but try to load it
  this.load();
}

pkzo.Texture.load = function (url) {
  // TODO make the aply cleaner
  return new pkzo.Texture(url);
}

pkzo.Texture.prototype.load = function () {	
  this.image = new Image();
  var texture = this;
  this.image.onload = function () {
    texture.loaded = true;    
  };
  this.image.src = this.url;
}

pkzo.Texture.prototype.upload = function () {
  if (! this.loaded) {
    throw Error('Can not upload texture that is not loaded yet.');
  }
  
  this.id = this.gl.createTexture();
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
  
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);  
  this.gl.generateMipmap(this.gl.TEXTURE_2D);
  
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
}

pkzo.Texture.prototype.release = function () {
  this.gl.deleteTexture(this.id);
  this.id = null;
}

pkzo.Texture.prototype.bind = function (gl, channel) {
	this.gl = gl;  
    
  this.gl.activeTexture(gl.TEXTURE0 + channel);
  
  if (this.loaded) {  
    if (! this.id) {
      this.upload();
    }
    else 
    {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    }
  }
  else {
    this.gl.bindTexture(this.gl.TEXTURE_2D, 0);
  }
}


pkzo.CubeMap = function () {  
  this.loaded = false;  
}

pkzo.CubeMap.load = function (textures) {
  var cm = new pkzo.CubeMap();
  cm.load(textures);
  return cm;
}

pkzo.CubeMap.prototype.load = function (textures) {
  var cubemap = this;
  this.loadCount = 0;
  
  var onload = function () {
    cubemap.loadCount++;
    if (cubemap.loadCount == 6) {
      cubemap.loaded = true;      
    }
  };
  
  this.xposImage = new Image();  
  this.xposImage.onload = onload;
  this.xposImage.src    = textures.xpos;
  
  this.xnegImage = new Image();  
  this.xnegImage.onload = onload;
  this.xnegImage.src    = textures.xneg;
  
  this.yposImage = new Image();  
  this.yposImage.onload = onload;
  this.yposImage.src    = textures.ypos;
  
  this.ynegImage = new Image();  
  this.ynegImage.onload = onload;
  this.ynegImage.src    = textures.yneg;
  
  this.zposImage = new Image();  
  this.zposImage.onload = onload;
  this.zposImage.src    = textures.zpos;
  
  this.znegImage = new Image();  
  this.znegImage.onload = onload;
  this.znegImage.src    = textures.zneg;
}

pkzo.CubeMap.prototype.upload = function () {
  if (! this.loaded) {
    throw Error('Can not upload texture that is not loaded yet.');
  }
  
  this.id = this.gl.createTexture();
  this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.id);
  
  this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.xposImage);
  this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.xnegImage);
  this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.yposImage);
  this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.ynegImage);
  this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.zposImage);
  this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.znegImage);
  
  this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
  this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
}

pkzo.CubeMap.prototype.release = function () {
  this.gl.deleteTexture(this.id);
  this.id = null;
}

pkzo.CubeMap.prototype.bind = function (gl, channel) {
  this.gl = gl;  
    
  this.gl.activeTexture(gl.TEXTURE0 + channel);
  
  if (this.loaded) {  
    if (! this.id) {
      this.upload();
    }
    else 
    {
      this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.id);
    }
  }
  else {
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, 0);
  }
}



pkzo.Shader = function (vertexCode, fragmentCode) {
  this.vertexCode   = vertexCode;
  this.fragmentCode = fragmentCode;
}

pkzo.Shader.prototype.compile = function (gl) {
  this.gl = gl;
  var vertexShader   = this.compileShader(this.gl.VERTEX_SHADER,   this.vertexCode);
  var fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, this.fragmentCode);
  
  var program = this.gl.createProgram();
  
  this.gl.attachShader(program, vertexShader);
  this.gl.attachShader(program, fragmentShader);
  
  this.gl.linkProgram(program);
  
  var infoLog = this.gl.getProgramInfoLog(program);
  if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS) === false) {
    throw new Error(infoLog);
  }
  else if (infoLog !== '') {
    console.log(infoLog);
  }
  
  this.gl.deleteShader(vertexShader);
  this.gl.deleteShader(fragmentShader);
  
  this.id = program;
}

pkzo.Shader.prototype.compileShader = function (type, code) {
  var id = this.gl.createShader(type);  
  
  this.gl.shaderSource(id, code);
  this.gl.compileShader(id);
  
  var infoLog = this.gl.getShaderInfoLog(id);
  if (this.gl.getShaderParameter(id, this.gl.COMPILE_STATUS) === false) {
    throw new Error(infoLog);
  }
  else if (infoLog !== '') {
    console.log(infoLog);
  }
  
  return id;
}

pkzo.Shader.prototype.release = function () {
  this.gl.deleteProgram(id);
}

pkzo.Shader.prototype.bind = function (gl) {
  if (!this.id) {
    this.compile(gl);
  }
  this.gl.useProgram(this.id);
}

pkzo.Shader.prototype.setArrtibute = function (name, buffer, elementSize) {  
  buffer.bind();  
  
  if (elementSize === undefined) {
    var elementSize = buffer.elementSize;
  }
  
  var pos = this.gl.getAttribLocation(this.id, name);  
  if (pos != -1) {
    this.gl.enableVertexAttribArray(pos);
    this.gl.vertexAttribPointer(pos, elementSize, buffer.elementType, this.gl.FALSE, 0, 0);  
  }
}

pkzo.Shader.prototype.setUniform1i = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  if (loc != -1) {
    this.gl.uniform1i(loc, value);
  }
}

pkzo.Shader.prototype.setUniform1f = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  if (loc != -1) {
    this.gl.uniform1f(loc, value);
  }
}

pkzo.Shader.prototype.setUniform2fv = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  if (loc != -1) {
    this.gl.uniform2f(loc, value[0], value[1]);
  }
}

pkzo.Shader.prototype.setUniform3fv = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  if (loc != -1) {
    this.gl.uniform3f(loc, value[0], value[1], value[2]);
  }
}

pkzo.Shader.prototype.setUniform4fv = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  if (loc != -1) {
    this.gl.uniform4f(loc, value[0], value[1], value[2], value[4]);
  }
}

pkzo.Shader.prototype.setUniformMatrix3fv = function (name, value, transpose) {
  if (transpose === undefined ||transpose === null) {
    var transpose = false;
  }
  var loc = this.gl.getUniformLocation(this.id, name);
  if (loc != -1) {
    this.gl.uniformMatrix3fv(loc, transpose, value);
  }
}

pkzo.Shader.prototype.setUniformMatrix4fv = function (name, value, transpose) {
  if (transpose === undefined ||transpose === null) {
    var transpose = false;
  }
  var loc = this.gl.getUniformLocation(this.id, name);
  if (loc != -1) {
    this.gl.uniformMatrix4fv(loc, transpose, value);
  }
}




pkzo.Scene = function () {
	this.ambientLight = rgm.vec3(0.2, 0.2, 0.2);	
}

pkzo.Scene.prototype.enqueue = function (renderer) {
	if (this.entities) {
		this.entities.forEach(function (entity) {
			entity.enqueue(renderer);
		});
	}
}

pkzo.Scene.prototype.add = function (entity) {
  if (! this.entities) {
    this.entities = [entity];
  }
  else {
    this.entities.push(entity);
  }
}

pkzo.Buffer = function (gl, data, btype, etype) {
  this.gl = gl;
  
  if (btype === undefined) {
    this.type = gl.ARRAY_BUFFER;
  }
  else {
    this.type = btype;
  }
  
  if (etype === undefined) {
    if (this.type == gl.ARRAY_BUFFER) {
      this.elementType = gl.FLOAT;
    }
    else {
      this.elementType = gl.UNSIGNED_SHORT;
    }
  }
  else {
    this.elementType = etype;
  }
  
  this.load(data);
}

pkzo.wrapArray = function (gl, type, data) {
  switch (type) {
    case gl.FLOAT:
      return new Float32Array(data);
    case gl.DOUBLE:
      return new Float64Array(data);
    case gl.UNSIGNED_BYTE:
      return new Uint8Array(data);
    case gl.UNSIGNED_SHORT:
      return new Uint16Array(data);
    case gl.UNSIGNED_INT:
      return new Uint32Array(data);
    case gl.BYTE:
      return new Int8Array(data);
    case gl.SHORT:
      return new Int16Array(data);
    case gl.INT:
      return new Int32Array(data);
  }
}

pkzo.Buffer.prototype.load = function (data) {  
  if (data[0].length === undefined) {
    this.elementSize = 1;
    this.data = pkzo.wrapArray(this.gl, this.elementType, data);
  }
  else {    
    this.elementSize = data[0].length;
    this.data = pkzo.wrapArray(this.gl, this.elementType, data.length * this.elemSize);
    var i = 0;
    var buffer = this;
    data.forEach(function (elem) {
      elem.forEach(function (v) {
        buffer.data[i] = v;
        i++;
      });
    });
  }
}

pkzo.Buffer.prototype.upload = function () {
  this.id = this.gl.createBuffer();
  this.gl.bindBuffer(this.type, this.id);
  this.gl.bufferData(this.type, this.data, this.gl.STATIC_DRAW);
}

pkzo.Buffer.prototype.release = function () {
  if (this.id) {
    this.gl.deleteBuffer(this.id);
    this.id = null;
  }
}

pkzo.Buffer.prototype.bind = function(primitive) {
  if (! this.id) {
    this.upload();
  }
  this.gl.bindBuffer(this.type, this.id);
}

pkzo.Buffer.prototype.draw = function(primitive) {
  this.bind();
  this.gl.drawElements(primitive, this.data.length, this.elementType, 0);
}



pkzo.PlyParser = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { ply: peg$parseply },
        peg$startRuleFunction  = peg$parseply,

        peg$c0 = peg$FAILED,
        peg$c1 = "ply",
        peg$c2 = { type: "literal", value: "ply", description: "\"ply\"" },
        peg$c3 = [],
        peg$c4 = "end_header",
        peg$c5 = { type: "literal", value: "end_header", description: "\"end_header\"" },
        peg$c6 = "format",
        peg$c7 = { type: "literal", value: "format", description: "\"format\"" },
        peg$c8 = "ascii",
        peg$c9 = { type: "literal", value: "ascii", description: "\"ascii\"" },
        peg$c10 = "1.0",
        peg$c11 = { type: "literal", value: "1.0", description: "\"1.0\"" },
        peg$c12 = "comment",
        peg$c13 = { type: "literal", value: "comment", description: "\"comment\"" },
        peg$c14 = /^[^\n\r]/,
        peg$c15 = { type: "class", value: "[^\\n\\r]", description: "[^\\n\\r]" },
        peg$c16 = function(a, b) {a.properties = b; elements.push(a);},
        peg$c17 = "element",
        peg$c18 = { type: "literal", value: "element", description: "\"element\"" },
        peg$c19 = function(a, b) {return {type: a, count: b};},
        peg$c20 = "vertex",
        peg$c21 = { type: "literal", value: "vertex", description: "\"vertex\"" },
        peg$c22 = "face",
        peg$c23 = { type: "literal", value: "face", description: "\"face\"" },
        peg$c24 = "property",
        peg$c25 = { type: "literal", value: "property", description: "\"property\"" },
        peg$c26 = function(a) {return a;},
        peg$c27 = "float",
        peg$c28 = { type: "literal", value: "float", description: "\"float\"" },
        peg$c29 = "uint",
        peg$c30 = { type: "literal", value: "uint", description: "\"uint\"" },
        peg$c31 = "int",
        peg$c32 = { type: "literal", value: "int", description: "\"int\"" },
        peg$c33 = "uchar",
        peg$c34 = { type: "literal", value: "uchar", description: "\"uchar\"" },
        peg$c35 = "char",
        peg$c36 = { type: "literal", value: "char", description: "\"char\"" },
        peg$c37 = "list",
        peg$c38 = { type: "literal", value: "list", description: "\"list\"" },
        peg$c39 = "x",
        peg$c40 = { type: "literal", value: "x", description: "\"x\"" },
        peg$c41 = "y",
        peg$c42 = { type: "literal", value: "y", description: "\"y\"" },
        peg$c43 = "z",
        peg$c44 = { type: "literal", value: "z", description: "\"z\"" },
        peg$c45 = "nx",
        peg$c46 = { type: "literal", value: "nx", description: "\"nx\"" },
        peg$c47 = "ny",
        peg$c48 = { type: "literal", value: "ny", description: "\"ny\"" },
        peg$c49 = "nz",
        peg$c50 = { type: "literal", value: "nz", description: "\"nz\"" },
        peg$c51 = "s",
        peg$c52 = { type: "literal", value: "s", description: "\"s\"" },
        peg$c53 = "t",
        peg$c54 = { type: "literal", value: "t", description: "\"t\"" },
        peg$c55 = "vertex_indices",
        peg$c56 = { type: "literal", value: "vertex_indices", description: "\"vertex_indices\"" },
        peg$c57 = function(a) {decodeLine(a);},
        peg$c58 = null,
        peg$c59 = "-",
        peg$c60 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c61 = /^[0-9]/,
        peg$c62 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c63 = ".",
        peg$c64 = { type: "literal", value: ".", description: "\".\"" },
        peg$c65 = function(a) {return parseFloat(strJoin(a));},
        peg$c66 = /^[ \t\x0B]/,
        peg$c67 = { type: "class", value: "[ \\t\\x0B]", description: "[ \\t\\x0B]" },
        peg$c68 = "\r\n",
        peg$c69 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
        peg$c70 = "\n",
        peg$c71 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c72 = "\r",
        peg$c73 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c74 = function() {lines++},

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parseply() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsemagic();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseheader();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsebody();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsemagic() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c1) {
        s1 = peg$c1;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsenl();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseheader() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseformat();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsecomment();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsecomment();
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseelement();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseelement();
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 10) === peg$c4) {
              s4 = peg$c4;
              peg$currPos += 10;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c5); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsenl();
              if (s5 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4, s5];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseformat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c6) {
        s1 = peg$c6;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c8) {
            s3 = peg$c8;
            peg$currPos += 5;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c9); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 3) === peg$c10) {
                s5 = peg$c10;
                peg$currPos += 3;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsenl();
                if (s6 !== peg$FAILED) {
                  s1 = [s1, s2, s3, s4, s5, s6];
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsecomment() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c12) {
        s1 = peg$c12;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c14.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c14.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c15); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenl();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseelement() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseehader();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseproperty();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseproperty();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c16(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseehader() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c17) {
        s1 = peg$c17;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseeltype();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsenumber();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsenl();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c19(s3, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseeltype() {
      var s0;

      if (input.substr(peg$currPos, 6) === peg$c20) {
        s0 = peg$c20;
        peg$currPos += 6;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c22) {
          s0 = peg$c22;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c23); }
        }
      }

      return s0;
    }

    function peg$parseproperty() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c24) {
        s1 = peg$c24;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c25); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseptype();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepvalue();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsenl();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c26(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseptype() {
      var s0;

      if (input.substr(peg$currPos, 5) === peg$c27) {
        s0 = peg$c27;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c29) {
          s0 = peg$c29;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c31) {
            s0 = peg$c31;
            peg$currPos += 3;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c33) {
              s0 = peg$c33;
              peg$currPos += 5;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c34); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c35) {
                s0 = peg$c35;
                peg$currPos += 4;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c36); }
              }
              if (s0 === peg$FAILED) {
                s0 = peg$parselist();
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parselist() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c37) {
        s1 = peg$c37;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseptype();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsews();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseptype();
              if (s5 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4, s5];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsepvalue() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 120) {
        s0 = peg$c39;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 121) {
          s0 = peg$c41;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c42); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 122) {
            s0 = peg$c43;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c44); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c45) {
              s0 = peg$c45;
              peg$currPos += 2;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c46); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c47) {
                s0 = peg$c47;
                peg$currPos += 2;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c48); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c49) {
                  s0 = peg$c49;
                  peg$currPos += 2;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c50); }
                }
                if (s0 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 115) {
                    s0 = peg$c51;
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c52); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 116) {
                      s0 = peg$c53;
                      peg$currPos++;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c54); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 14) === peg$c55) {
                        s0 = peg$c55;
                        peg$currPos += 14;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c56); }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsebody() {
      var s0, s1;

      s0 = [];
      s1 = peg$parsebline();
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parsebline();
        }
      } else {
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsebline() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsebvalue();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsebvalue();
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsenl();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c57(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsebvalue() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsenumber();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 === peg$FAILED) {
          s2 = peg$c58;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s2 = peg$c59;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }
      if (s2 === peg$FAILED) {
        s2 = peg$c58;
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        if (peg$c61.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c62); }
        }
        if (s4 !== peg$FAILED) {
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            if (peg$c61.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c62); }
            }
          }
        } else {
          s3 = peg$c0;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 46) {
            s5 = peg$c63;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c64); }
          }
          if (s5 !== peg$FAILED) {
            s6 = [];
            if (peg$c61.test(input.charAt(peg$currPos))) {
              s7 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c62); }
            }
            while (s7 !== peg$FAILED) {
              s6.push(s7);
              if (peg$c61.test(input.charAt(peg$currPos))) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c62); }
              }
            }
            if (s6 !== peg$FAILED) {
              s5 = [s5, s6];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$c0;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 === peg$FAILED) {
            s4 = peg$c58;
          }
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c65(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      s0 = [];
      if (peg$c66.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c67); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c66.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c67); }
          }
        }
      } else {
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsenl() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c68) {
        s1 = peg$c68;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c69); }
      }
      if (s1 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 10) {
          s1 = peg$c70;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c71); }
        }
        if (s1 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 13) {
            s1 = peg$c72;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c73); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c74();
      }
      s0 = s1;

      return s0;
    }


      var lines      = 0;
      var mesh       = options.mesh;
      var elements   = [];
      var elementIds = 0; // currently active element
      var valueCount = 0; // which value was read last, within this element
      
      function strJoin(values) {
        var r = '';
        values.forEach(function (value) {
          if (value != null) {
            if (typeof value === 'string') {       
              r = r.concat(value);
            }
            else {          
              r = r.concat(strJoin(value));
            }
          }
        });
        return r;
      }
      
      function decodeLine(values) {
        var props = elements[elementIds].properties;
        
        if (props[0] == 'vertex_indices') {
          var count = values[0];
          // anything larger than a triangle is basically  
          // implemented as a triangle fan
          for (var i = 2; i < count; i++) {
            // actual usable values start with 1
            var a = values[1];        
            var b = values[i];
            var c = values[i + 1];
            mesh.addTriangle(a, b, c);
          }      
        }
        else {    
          var vertex   = rgm.vec3(0);
          var normal   = rgm.vec3(0);
          var texCoord = rgm.vec2(0);
          props.forEach(function (prop, i) {
            switch (prop) {
              case 'x':
                vertex[0] = values[i];
                break;
              case 'y':
                vertex[1] = values[i];
                break;
              case 'z':
                vertex[2] = values[i];
                break;
              case 'nx':
                normal[0] = values[i];
                break;
              case 'ny':
                normal[1] = values[i];
                break;
              case 'nz':
                normal[2] = values[i];
                break;  
              case 't':
                texCoord[0] = values[i];
                break;
              case 's':
                texCoord[1] = values[i];
                break;
            }        
          });
          mesh.addVertex(vertex, normal, texCoord);
        };
        
        valueCount++;
        if (valueCount == elements[elementIds].count) {
          elementIds++;
          valueCount = 0;
        }
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();

pkzo.Mesh = function () {
  this.loaded = false;  
}

pkzo.Mesh.load = function (url) {
    var mesh = new pkzo.Mesh();
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      {
        var parser = pkzo.PlyParser;
        parser.parse(xmlhttp.responseText, {mesh: mesh});
        mesh.loaded = true;
      }
    }    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
    return mesh;
}

pkzo.Mesh.plane = function (width, height, wres, hres) {
  var mesh = new pkzo.Mesh();
  
  if (wres === undefined) {
    var wres = 1;
  }
  
  if (hres === undefined) {
    var hres = 1;
  }
  
  var w2 = width / 2.0;
  var h2 = height / 2.0;
  var ws = width / wres;
  var hs = height / hres;
  
  for (var i = 0; i <= wres; i++) {
    for (var j = 0; j <= hres; j++) {
      var x = -w2 + i * ws; 
      var y = -h2 + j * hs;
      var t = i;
      var s = j;
      mesh.addVertex(rgm.vec3(x, y, 0), rgm.vec3(0, 0, 1), rgm.vec2(t, s), rgm.vec3(0, 1, 0));            
    }
  }
  
  var span = wres + 1;
  for (var i = 0; i < wres; i++) {
    for (var j = 0; j < hres; j++) {
      var a = (i + 0) * span + (j + 0);
      var b = (i + 0) * span + (j + 1);
      var c = (i + 1) * span + (j + 1);
      var d = (i + 1) * span + (j + 0);
      mesh.addTriangle(a, b, c);
      mesh.addTriangle(c, d, a);
    }
  }
  
  mesh.loaded = true;
  return mesh;
}

pkzo.Mesh.box = function (s) {
  
  var mesh = new pkzo.Mesh();
  
  mesh.vertices = 
      [  s[0], s[1], s[2],  -s[0], s[1], s[2],  -s[0],-s[1], s[2],   s[0],-s[1], s[2],    
         s[0], s[1], s[2],   s[0],-s[1], s[2],   s[0],-s[1],-s[2],   s[0], s[1],-s[2],    
         s[0], s[1], s[2],   s[0], s[1],-s[2],  -s[0], s[1],-s[2],  -s[0], s[1], s[2],    
        -s[0], s[1], s[2],  -s[0], s[1],-s[2],  -s[0],-s[1],-s[2],  -s[0],-s[1], s[2],    
        -s[0],-s[1],-s[2],   s[0],-s[1],-s[2],   s[0],-s[1], s[2],  -s[0],-s[1], s[2],    
         s[0],-s[1],-s[2],  -s[0],-s[1],-s[2],  -s[0], s[1],-s[2],   s[0], s[1],-s[2] ];  
         
  mesh.normals = 
      [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     
         1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     
         0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     
         0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     
         0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ];   

  mesh.texCoords = 
      [  1, 1,   0, 1,   0, 0,   1, 0,    
         0, 1,   0, 0,   1, 0,   1, 1,    
         1, 0,   1, 1,   0, 1,   0, 0,    
         1, 1,   0, 1,   0, 0,   1, 0,    
         0, 0,   1, 0,   1, 1,   0, 1,    
         0, 0,   1, 0,   1, 1,   0, 1 ];  

  mesh.indices = 
      [  0, 1, 2,   0, 2, 3,   
         4, 5, 6,   4, 6, 7,   
         8, 9,10,   8,10,11,   
        12,13,14,  12,14,15,   
        16,17,18,  16,18,19,   
        20,21,22,  20,22,23 ]; 

  mesh.loaded = true;
  return mesh;
}

pkzo.Mesh.sphere = function (radius, nLatitude, nLongitude) {
  
  var mesh = new pkzo.Mesh();
  
  var nPitch = nLongitude + 1;
  
  var pitchInc = rgm.radians(180.0 / nPitch);
  var rotInc   = rgm.radians(360.0 / nLatitude);
 
  // poles
  mesh.addVertex(rgm.vec3(0, 0, radius), rgm.vec3(0, 0, 1), rgm.vec2(0.5, 0), rgm.vec3(0, 1, 0)); // top vertex
  mesh.addVertex(rgm.vec3(0, 0, -radius), rgm.vec3(0, 0, -1), rgm.vec2(0.5, 1), rgm.vec3(0, 1, 0)); // bottom vertex
   
  // body vertices
  var twoPi = Math.PI * 2.0;
  for (var p = 1; p < nPitch; p++) {    
    var out = Math.abs(radius * Math.sin(p * pitchInc));    
    var z   = radius * Math.cos(p * pitchInc);
    
    for(var s = 0; s <= nLatitude; s++) {
      var x = out * Math.cos(s * rotInc);
      var y = out * Math.sin(s * rotInc);
      
      var vec  = rgm.vec3(x, y, z);
      var norm = rgm.normalize(vec);
      var tc   = rgm.vec2(s / nLatitude, p / nPitch);      
      var tang = rgm.cross(norm, rgm.vec3(0, 0, 1));
      mesh.addVertex(vec, norm, tc, tang);
    }
  }
  
  // polar caps
  var offLastVerts = 2 + ((nLatitude + 1) * (nPitch - 2));
  for(var s = 0; s < nLatitude; s++)
  {
    mesh.addTriangle(0, 2 + s, 2 + s + 1);
    mesh.addTriangle(1, offLastVerts + s, offLastVerts + s + 1);
  }
 
  // body
  for(var p = 1; p < nPitch-1; p++) {
    for(var s = 0; s < nLatitude; s++) {
      var a = 2 + (p-1) * (nLatitude + 1) + s;
      var b = a + 1;
      var d = 2 + p * (nLatitude + 1) + s;
      var c = d + 1;
      
      mesh.addTriangle(a, b, c);
      mesh.addTriangle(c, d, a);
    }
  }
  
  mesh.loaded = true;
  return mesh;
}

pkzo.Mesh.icoSphere = function (radius, recursionLevel) {
  var t = (1.0 + Math.sqrt(5.0)) / 2.0;
  
  var verts = [
    rgm.vec3(-1,  t,  0),
    rgm.vec3( 1,  t,  0),
    rgm.vec3(-1, -t,  0),
    rgm.vec3( 1, -t,  0),

    rgm.vec3( 0, -1,  t),
    rgm.vec3( 0,  1,  t),
    rgm.vec3( 0, -1, -t),
    rgm.vec3( 0,  1, -t),

    rgm.vec3( t,  0, -1),
    rgm.vec3( t,  0,  1),
    rgm.vec3(-t,  0, -1),
    rgm.vec3(-t,  0,  1),
  ];
  for (var i = 0; i < verts.length; i++) {
    verts[i] = pkzo.normalize(verts[i]);
  }
  
  var faces = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],

    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],

    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],

    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],  
  ];
  
  var midpointCache = [];  
  
  var addMidpointCache = function (p1, p2, i) {
    midpointCache.push({p1: p1, p2: p2, i: i});
  }
  var getMidpointCache = function (p1, p2) {
    for (var i = 0; i < midpointCache.length; i++) {
      if (midpointCache.p1 == p1 && midpointCache.p2 == p2) {
        return midpointCache.i;
      }
    }
    return null;
  }
  
  var midpoint = function (p1, p2) {
    var si = p1 < p2 ? p1 : p2;
    var gi = p1 < p2 ? p2 : p1;
    
    var ci = getMidpointCache(si, gi);
    if (ci != null)
    {
      return ci;
    }

    var point1 = verts[p1];
    var point2 = verts[p2];
    var middle = pkzo.normalize(pkzo.add(point1, point2));
    
    verts.push(middle);
    var i = verts.length - 1; 
    
    addMidpointCache(si, gi, i);
    return i;
  }
  
  for (var i = 0; i < recursionLevel; i++)
  {
    var faces2 = [];
    faces.forEach(function (face) {
      var a = midpoint(face[0], face[1]);
      var b = midpoint(face[1], face[2]);
      var c = midpoint(face[2], face[0]);

      faces2.push([face[0], a, c]);
      faces2.push([face[1], b, a]);
      faces2.push([face[2], c, b]);
      faces2.push([a, b, c]);
    });
    faces = faces2;
  }
  
  var mesh = new pkzo.Mesh();
  
  var twoPi = Math.PI * 2.0;
  verts.forEach(function (v) {
    var vertex   = pkzo.svmult(v, radius);
    var normal   = v;     
    var texCoord = rgm.vec2(Math.atan(v[1]/v[0]) / twoPi, Math.acos(v[2]) / twoPi);
    var tangent  = pkzo.cross(normal, rgm.vec3(0, 0, 1));
    mesh.addVertex(vertex, normal, texCoord, tangent);
  });
  
  faces.forEach(function (face) {
    mesh.addTriangle(face[0], face[1], face[2]);
  });
  
  mesh.loaded = true;
  return mesh;
}

pkzo.Mesh.prototype.addVertex = function (vertex, normal, texCoord, tangent) {
  if (this.vertices) {
    this.vertices.push(vertex[0], vertex[1], vertex[2]);
  }
  else {
    this.vertices = [vertex[0], vertex[1], vertex[2]];
  }
  
  if (this.normals) {
    this.normals.push(normal[0], normal[1], normal[2]);
  }
  else {
    this.normals = [normal[0], normal[1], normal[2]];
  }
  
  if (this.texCoords) {
    this.texCoords.push(texCoord[0], texCoord[1]);
  }
  else {
    this.texCoords = [texCoord[0], texCoord[1]];
  }
  
  if (tangent !== undefined) {
    if (this.tangents) {
      this.tangents.push(tangent[0], tangent[1], tangent[2]);
    }
    else {
      this.tangents = [tangent[0], tangent[1], tangent[2]];
    }
  }
}

pkzo.Mesh.prototype.getVertex = function (i) {
  return rgm.vec3(this.vertices[i * 3], this.vertices[i * 3 + 1], this.vertices[i * 3 + 2]);
}

pkzo.Mesh.prototype.getNormal = function (i) {
  return rgm.vec3(this.normals[i * 3], this.normals[i * 3 + 1], this.normals[i * 3 + 2]);
}

pkzo.Mesh.prototype.getTexCoord = function (i) {
  return rgm.vec2(this.texCoords[i * 2], this.texCoords[i * 2 + 1]);
}

pkzo.Mesh.prototype.addTriangle = function (a, b, c) {
  if (this.indices) {
    this.indices.push(a, b, c);
  }
  else {
    this.indices = [a, b, c];
  }
}

pkzo.Mesh.prototype.upload = function (gl) {
  
  if (!this.tangents) {
    this.computeTangents();
  }
  
  this.vertexBuffer   = new pkzo.Buffer(gl, this.vertices,  gl.ARRAY_BUFFER, gl.FLOAT);
  this.normalBuffer   = new pkzo.Buffer(gl, this.normals,   gl.ARRAY_BUFFER, gl.FLOAT);      
  this.texCoordBuffer = new pkzo.Buffer(gl, this.texCoords, gl.ARRAY_BUFFER, gl.FLOAT);
  this.tangentsBuffer = new pkzo.Buffer(gl, this.tangents,  gl.ARRAY_BUFFER, gl.FLOAT);
  this.indexBuffer    = new pkzo.Buffer(gl, this.indices,   gl.ELEMENT_ARRAY_BUFFER, gl.UNSIGNED_SHORT);
}

pkzo.Mesh.prototype.draw = function(gl, shader) {
  if (this.loaded) {  
    if (!this.vertexBuffer) {
      this.upload(gl);
    }
    
    shader.setArrtibute("aVertex",   this.vertexBuffer,   3);
    shader.setArrtibute("aNormal",   this.normalBuffer,   3);
    shader.setArrtibute("aTexCoord", this.texCoordBuffer, 2);
    shader.setArrtibute("aTangent",  this.tangentsBuffer, 3);
        
    this.indexBuffer.draw(gl.TRIANGLES);
  }
}

pkzo.Mesh.prototype.release = function () {
  this.vertexBuffer.release();   
  delete this.vertexBuffer;
  
  this.normalBuffer.release();   
  delete this.normalBuffer;  
  
  this.texCoordBuffer.release(); 
  delete this.texCoordBuffer;
  
  this.indexBuffer.release();
  delete this.indexBuffer;
}

pkzo.Mesh.prototype.computeTangents = function () {    
  var vertexCount = this.vertices.length / 3;
  var faceCount   = this.indices.length / 3;
  
  var tan1 = new Array(vertexCount);    
  var tan2 = new Array(vertexCount);
  for (var i = 0; i < vertexCount; i++) {
    tan1[i] = rgm.vec3(0);
    tan2[i] = rgm.vec3(0);
  }
  
  for (var i = 0; i < faceCount; i++) {
    var a = this.indices[i * 3];
    var b = this.indices[i * 3 + 1];
    var c = this.indices[i * 3 + 2];
    
    var v1 = this.getVertex(a);
    var v2 = this.getVertex(b);
    var v3 = this.getVertex(c);
    
    var w1 = this.getTexCoord(a);
    var w2 = this.getTexCoord(b);
    var w3 = this.getTexCoord(c);
    
    var x1 = v2[0] - v1[0];
    var x2 = v3[0] - v1[0];
    var y1 = v2[1] - v1[1];
    var y2 = v3[1] - v1[1];
    var z1 = v2[2] - v1[2];
    var z2 = v3[2] - v1[2];

    var s1 = w2[0] - w1[0];
    var s2 = w3[0] - w1[0];
    var t1 = w2[1] - w1[1];
    var t2 = w3[1] - w1[1];

    var r = 1.0 / (s1 * t2 - s2 * t1);
    var sdir = rgm.vec3((t2 * x1 - t1 * x2) * r,  (t2 * y1 - t1 * y2) * r,(t2 * z1 - t1 * z2) * r);
    var tdir = rgm.vec3((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r);

    tan1[a] = rgm.add(tan1[a], sdir);
    tan1[b] = rgm.add(tan1[b], sdir);
    tan1[c] = rgm.add(tan1[c], sdir);

    tan2[a] = rgm.add(tan2[a], tdir);
    tan2[b] = rgm.add(tan2[b], tdir);
    tan2[c] = rgm.add(tan2[c], tdir);
  }
    
  this.tangents = [];
  for (var j = 0; j < vertexCount; j++) {
    var n = this.getNormal(j);
    var t = tan1[j];
    
    var tn = rgm.normalize(rgm.vsmult(rgm.sub(t, n), rgm.dot(n, t)));
    
    if (rgm.dot(rgm.cross(n, t), tan2[j]) < 0.0) {
      this.tangents.push(-tn[0], -tn[1], -tn[2]);
    }
    else {
      this.tangents.push(tn[0], tn[1], tn[2]);
    }
  }
}


pkzo.Material = function (opts) {	
  this.albedo        = rgm.vec3(1, 1, 1);
  this.roughness     = 1;
  this.metal         = 0;
  this.emissiveColor = rgm.vec3(0, 0, 0);
  
  if (opts) {
    this.read(opts);
  }	
}

pkzo.Material.load = function (url) {
  var material = new pkzo.Material();
  http.get(url, function (status, data) {
    if (status == 200) {
      material.read(JSON.parse(data));
    }
    else {
      console.error('Failed to load material %s.', url);
    }
  });
  return material;
}

pkzo.Material.prototype.read = function (data) {
  if (data.albedo) {
    this.albedo = data.albedo;
  }
  
  if (data.texture) {
    // REVIEW: should the textures not be relative to the current file?
    // -> Use something like "base path" to fix that, then the load function
    // will extract it and pass it allong.
    this.texture = pkzo.Texture.load(data.texture);
  }
  
  if (data.roughness) {
    this.roughness = data.roughness;
  }  
  if (data.roughnessMap) {
    this.roughnessMap = pkzo.Texture.load(data.roughnessMap);
  }
  
  if (data.metal) {
    this.metal = data.metal;
  }  
  if (data.metalMap) {
    this.metalMap = pkzo.Texture.load(data.metalMap);
  }
  
  if (data.normalMap) {
    this.normalMap = pkzo.Texture.load(data.normalMap);
  }
  
  if (data.emissiveColor) {
    this.emissiveColor = data.emissiveColor;
  }
  if (data.emissiveMap) {
    this.emissiveMap = pkzo.Texture.load(data.emissiveMap);
  }
}

pkzo.Material.prototype.setup = function (gl, shader) {
	
	shader.setUniform3fv('uAlbedo', this.albedo);
	
	if (this.texture && this.texture.loaded) {
		shader.setUniform1i('uHasTexture', 1);
		this.texture.bind(gl, 0)
		shader.setUniform1i('uTexture', 0);
	}
	else {
		shader.setUniform1i('uHasTexture', 0);
	}	
  
  shader.setUniform1f('uRoughness', this.roughness);
  if (this.roughnessMap && this.roughnessMap.loaded) {
    shader.setUniform1i('uHasRoughnessMap', 1);
		this.roughnessMap.bind(gl, 1);
		shader.setUniform1i('uRoughnessMap', 1);
  }
  else {
    shader.setUniform1i('uHasRoughnessMap', 0);
  }
  
  shader.setUniform1f('uMetal', this.metal);
  if (this.roughnessMap && this.metalMap.loaded) {
    shader.setUniform1i('uHasMetalMap', 1);
		this.metalMap.bind(gl, 2);
		shader.setUniform1i('uMetalMap', 2);
  }
  else {
    shader.setUniform1i('uHasMetalMap', 0);
  }
  
  if (this.normalMap && this.normalMap.loaded) {
		shader.setUniform1i('uHasNormalMap', 1);
		this.normalMap.bind(gl, 3);
		shader.setUniform1i('uNormalMap', 3);
	}
	else {
		shader.setUniform1i('uHasNormalMap', 0);
	}	
  
  shader.setUniform3fv('uEmissiveColor', this.emissiveColor);
  
  if (this.emissiveMap && this.emissiveMap.loaded) {
		shader.setUniform1i('uHasEmissiveMap', 1);
		this.emissiveMap.bind(gl, 4);
		shader.setUniform1i('uEmissiveMap', 4);
	}
	else {
		shader.setUniform1i('uHasEmissiveMap', 0);
	}	
}




pkzo.Entity = function () {
  this.transform = rgm.mat4(1);
}

pkzo.Entity.prototype.translate = function (x, y, z) {
	this.transform = rgm.translate(this.transform, x, y, z);
}

pkzo.Entity.prototype.rotate = function (angle, x, y, z) {
	this.transform = rgm.rotate(this.transform, angle, x, y, z);
}

pkzo.Entity.prototype.getXVector = function () {
	return rgm.vec3(this.transform[0], this.transform[1], this.transform[2]);
}

pkzo.Entity.prototype.getYVector = function () {
	return rgm.vec3(this.transform[4], this.transform[5], this.transform[6]);
}

pkzo.Entity.prototype.getZVector = function () {
	return rgm.vec3(this.transform[8], this.transform[9], this.transform[10]);
}

pkzo.Entity.prototype.getPosition = function () {
  return rgm.vec3(this.transform[12], this.transform[13], this.transform[14]);
}

pkzo.Entity.prototype.getWorldPosition = function () {
  if (this.parent) {
    // TODO parent rotation
    return rgm.add(this.parent.getWorldPosition(), this.getPosition());
  }
  else {
    return this.getPosition();
  }  
}

pkzo.Entity.prototype.setPosition = function (value) {
  this.transform[12] = value[0];
  this.transform[13] = value[1];
  this.transform[14] = value[2];
}

pkzo.Entity.prototype.lookAt = function (target, up) {
  var position = this.getPosition();
  var forward  = rgm.normalize(rgm.sub(target, position));
  var right    = rgm.normalize(rgm.cross(forward, up));
  var upn      = rgm.normalize(rgm.cross(right, forward));
  
  // TODO scaling
  this.transform[0] = right[0];
  this.transform[1] = right[1];
  this.transform[2] = right[2];
  
  this.transform[4] = upn[0];
  this.transform[5] = upn[1];
  this.transform[6] = upn[2];
  
  this.transform[8] = forward[0];
  this.transform[9] = forward[1];
  this.transform[10] = forward[2];
}


pkzo.Camera = function (opt) {
  pkzo.Entity.call(this);
  
  var o = opt ? opt : {};
  
  this.yfov  = o.yfov  ? o.yfov  :  45.0;
  this.znear = o.znear ? o.znear :   0.1;
  this.zfar  = o.zfar  ? o.zfar  : 100.0;
}

pkzo.Camera.prototype = Object.create(pkzo.Entity.prototype);
pkzo.Camera.prototype.constructor = pkzo.Camera;

pkzo.Camera.prototype.enqueue = function (renderer) {
  var aspect = renderer.canvas.gl.width / renderer.canvas.gl.height;
  
  var projectionMatrix = rgm.perspective(this.yfov, aspect, this.znear, this.zfar);
  
  var p = this.getPosition();
  var x = this.getXVector();
  var y = this.getYVector();
  var z = this.getZVector();
  
  var viewMatrix = rgm.mat4([x[0], x[1], x[2], 0,
                             y[0], y[1], y[2], 0,
                             z[0], z[1], z[2], 0,
                                0,    0,    0, 1]);
  viewMatrix = rgm.transpose(viewMatrix); // use inverse
  viewMatrix = rgm.translate(viewMatrix, -p[0], -p[1], -p[2]);  
  
  renderer.setCamera(projectionMatrix, viewMatrix);
}


pkzo.Object = function (mesh, material) {
  pkzo.Entity.call(this);
  
  this.mesh     = mesh;
  this.material = material;
}

pkzo.Object.prototype = Object.create(pkzo.Entity.prototype);
pkzo.Object.prototype.constructor = pkzo.Object;

pkzo.Object.prototype.enqueue = function (renderer) {
	// todo respect parent transform
	renderer.addMesh(this.transform, this.material, this.mesh);
}

pkzo.Object.prototype.draw = function (gl, shader, parentModelViewMatrix) { 
  
  var modelViewMatrix = pkzo.multMatrix(parentModelViewMatrix, this.transform);
  shader.setUniformMatrix4fv('uModelViewMatrix', modelViewMatrix);
	shader.setUniformMatrix4fv('uModelMatrix', this.transform);
  
  this.material.setup(gl, shader);
  this.mesh.draw(gl, shader);
}



pkzo.DirectionalLight = function () {
  pkzo.Entity.call(this);
	
	this.color = rgm.vec3(0.5, 0.5, 0.5);
}

pkzo.DirectionalLight.prototype = Object.create(pkzo.Entity.prototype);
pkzo.DirectionalLight.prototype.constructor = pkzo.DirectionalLight;

pkzo.DirectionalLight.prototype.enqueue = function (renderer) {
	var dir = rgm.neg(this.getZVector());
	renderer.addDirectionalLight(dir, this.color);
}


pkzo.PointLight = function () {
  pkzo.Entity.call(this);
	
	this.color = rgm.vec3(0.5, 0.5, 0.5);
  this.range = 10.0;
}

pkzo.PointLight.prototype = Object.create(pkzo.Entity.prototype);
pkzo.PointLight.prototype.constructor = pkzo.PointLight;

pkzo.PointLight.prototype.enqueue = function (renderer) {
	renderer.addPointLight(this.getPosition(), this.color, this.range);
}


pkzo.SpotLight = function () {
  pkzo.Entity.call(this);
	
	this.color  = rgm.vec3(0.5, 0.5, 0.5);
  this.range  = 10.0;
  this.cutoff = 25.0;
}

pkzo.SpotLight.prototype = Object.create(pkzo.Entity.prototype);
pkzo.SpotLight.prototype.constructor = pkzo.SpotLight;

pkzo.SpotLight.prototype.enqueue = function (renderer) {
  var dir = rgm.neg(this.getZVector());
	renderer.addSpotLight(this.getPosition(), dir, this.color, this.range, this.cutoff);
}


pkzo.SkyBox = function (cubeMap) {
  pkzo.Entity.call(this);
  
  this.cubeMap = cubeMap;
}

pkzo.SkyBox.prototype = Object.create(pkzo.Entity.prototype);
pkzo.SkyBox.prototype.constructor = pkzo.SkyBox;

pkzo.SkyBox.prototype.enqueue = function (renderer) {
  if (this.cubeMap.loaded) {
    renderer.addSkyBox(this.cubeMap);
  }
}



pkzo.EntityGroup = function () {
  pkzo.Entity.call(this);    
}

pkzo.EntityGroup.prototype = Object.create(pkzo.Entity.prototype);
pkzo.EntityGroup.prototype.constructor = pkzo.EntityGroup;

pkzo.EntityGroup.add = function (child) {
  if (this.children) {
    child.parent = this;
    this.children.push(child);
  }
  else {
    this.children = [child];
  }
}

pkzo.EntityGroup.prototype.enqueue = function (renderer) {
  if (this.children) {
    this.childrean.forEach(function (child) {
      child.enqueue(renderer);
    });
  }
}



pkzo.Particle = function (opts) {
  pkzo.Entity.call(this);    
  
  for (var a in opts) { 
    this[a] = opts[a]; 
  }
}

pkzo.Particle.prototype = Object.create(pkzo.Entity.prototype);
pkzo.Particle.prototype.constructor = pkzo.Particle;

pkzo.Particle.prototype.enqueue = function (renderer) {
  if (this.texture.loaded) {
    renderer.addParticle(this.getWorldPosition(), this.size, this.texture, this.color, this.transparency);
  }
}




pkzo.ParticleSystem = function (opts) {
  pkzo.Entity.call(this); 

  for (var a in opts) { 
    this[a] = opts[a]; 
  }
  
  this.lastSpawn = Date.now();
  this.spawnTime = (this.lifetime * 1000.0) / this.count;
  
  this.particles = [];
}

pkzo.ParticleSystem.prototype = Object.create(pkzo.Entity.prototype);
pkzo.ParticleSystem.prototype.constructor = pkzo.ParticleSystem;

pkzo.ParticleSystem.prototype.animate = function () {
  var now = Date.now();
  
  if (now > this.lastSpawn + this.spawnTime) {
    var particle = new pkzo.Particle({
      created:      now,
      texture:      this.texture,      
      color:        this.color,
      transparency: this.transparency,
      size:         this.size,
      lifetime:     this.lifetime
    });
    particle.parent = this;
    if (this.onSpawn) {
      this.onSpawn(particle);
    }
    this.particles.push(particle);
    this.lastSpawn = now;
  }
  
  var i = 0;
  while (i < this.particles.length) {
    var particle = this.particles[i];
    if (now > particle.created + (particle.lifetime * 1000.0)) {
      this.particles.splice(i, 1);
    }
    else {
      i++;
    }
  }
  
  if (this.onUpdate) {
    this.particles.forEach(function (particle) {    
      this.onUpdate(particle);
    }, this);
  }
}

pkzo.ParticleSystem.prototype.enqueue = function (renderer) {
  // TODO actuall implement animate in the renderer
  this.animate();
  
  this.particles.forEach(function (particle) {
    particle.enqueue(renderer);
  });
}


pkzo.Renderer = function (canvas) {
  this.canvas = new pkzo.Canvas(canvas);
  
  var renderer = this;
  
  this.canvas.init(function (gl) {
    renderer.sykBoxShader   = new pkzo.Shader(pkzo.Inverse + pkzo.Transpose + pkzo.SkyBoxVert, pkzo.SkyBoxFrag);
    renderer.ambientShader  = new pkzo.Shader(pkzo.SolidVert, pkzo.AmbientFrag);
    renderer.lightShader    = new pkzo.Shader(pkzo.SolidVert, pkzo.LightFrag);   
    renderer.emissiveShader = new pkzo.Shader(pkzo.SolidVert, pkzo.EmissiveFrag);
    renderer.particleShader = new pkzo.Shader(pkzo.ParticleVert, pkzo.ParticleFrag);    

    renderer.screenPlane   = pkzo.Mesh.plane(2, 2);
  });
}

pkzo.Renderer.prototype.setCamera = function (projectionMatrix, viewMatrix) {
  this.projectionMatrix = projectionMatrix;
  this.viewMatrix       = viewMatrix;
}

pkzo.Renderer.prototype.addMesh = function (transform, material, mesh) {
  this.solids.push({
    transform: transform,
    material: material, 
    mesh: mesh
  });
}

pkzo.Renderer.prototype.addSkyBox = function (cubeMap) {
  this.skyBox = cubeMap;
}

pkzo.DIRECTIONAL_LIGHT = 1;
pkzo.POINT_LIGHT       = 2;
pkzo.SPOT_LIGHT        = 3;

pkzo.Renderer.prototype.addDirectionalLight = function (direction, color) {
  this.lights.push({
    type: pkzo.DIRECTIONAL_LIGHT,
    direction: direction,
    color: color
  });
}

pkzo.Renderer.prototype.addPointLight = function (position, color, range) {
  this.lights.push({
    type: pkzo.POINT_LIGHT,
    position: position,
    color: color,
    range: range
  });
}

pkzo.Renderer.prototype.addSpotLight = function (position, direction, color, range, cutoff) {
  this.lights.push({
    type: pkzo.SPOT_LIGHT,
    position: position,
    direction: direction,
    color: color,
    range: range,
    cutoff: cutoff
  });
}

pkzo.Renderer.prototype.addParticle = function (position, size, texture, color, transparency) {
  this.particles.push({
    position:     position,
    size:         size,
    texture:      texture,
    color:        color,
    transparency: transparency
  });
}

pkzo.Renderer.prototype.drawSkyBox = function (gl) {
  if (this.skyBox) {
    var shader = this.sykBoxShader;
    
    shader.bind(gl);
    shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
    shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);
    
    this.skyBox.bind(gl, 0);
    shader.setUniform1i('uCubemap', 0);
    
    this.screenPlane.draw(gl, shader);
  }
}

pkzo.Renderer.prototype.drawSolids = function (gl, shader) {
  this.solids.forEach(function (solid) {
    var norm = rgm.mmult(rgm.mat3(this.viewMatrix), rgm.mat3(solid.transform));
        
    shader.setUniformMatrix4fv('uModelMatrix', solid.transform);
    shader.setUniformMatrix3fv('uNormalMatrix', norm);
    
    solid.material.setup(gl, shader);     
    solid.mesh.draw(gl, shader);
  }, this);
}

pkzo.Renderer.prototype.ambientPass = function (gl, ambientLight) {
  var shader = this.ambientShader;    
  shader.bind(gl);
  
  shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
  shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);   
  
  shader.setUniform3fv('uAmbientLight', ambientLight);    
    
  this.drawSolids(gl, shader);  
}

pkzo.Renderer.prototype.lightPass = function (gl, light) {
  var shader = this.lightShader;    
  shader.bind(gl);
  
  shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
  shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);   
  
  shader.setUniform1i('uLightType', light.type);
  if (light.direction) {
    shader.setUniform3fv('uLightDirection', light.direction);
  }  
  if (light.position) {
    shader.setUniform3fv('uLightPosition', light.position);
  }
  if (light.range) {
    shader.setUniform1f('uLightRange', light.range);
  }
  if (light.cutoff) {
    shader.setUniform1f('uLightCutoff', light.cutoff);
  }
  shader.setUniform3fv('uLightColor', light.color);
  
  this.drawSolids(gl, shader);    
}

pkzo.Renderer.prototype.emissivePass = function (gl) {
  var shader = this.emissiveShader;    
  shader.bind(gl);
  
  shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
  shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);   
    
  this.drawSolids(gl, shader);  
}


pkzo.Renderer.prototype.drawParticles = function (gl) {
  
  var shader = this.particleShader;
  shader.bind(gl);
  shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
  shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);
  
  // size!
  this.particles.forEach(function (particle) {
    
    var modelMatrix = rgm.mat4();
    modelMatrix = rgm.translate(modelMatrix, particle.position[0], particle.position[1], particle.position[2]);
    shader.setUniformMatrix4fv('uModelMatrix', modelMatrix);
    
    // TODO material?
    shader.setUniform3fv('uColor', particle.color);
    shader.setUniform1f('uSize', particle.size * 0.5);
    shader.setUniform1f('uTransparency', particle.transparency);
    
    if (particle.texture && particle.texture.loaded) {
      shader.setUniform1i('uHasTexture', 1);
      particle.texture.bind(gl, 0)
      shader.setUniform1i('uTexture', 0);
    }
    else {
      shader.setUniform1i('uHasTexture', 0);
    }
    
    this.screenPlane.draw(gl, shader);
  }, this);
}

pkzo.Renderer.prototype.render = function (scene) {
  var renderer = this;
  
  this.solids    = [];
  this.lights    = [];
  this.skyBox    = null;
  this.particles = [];
  scene.enqueue(this);
  
  this.canvas.draw(function (gl) {
    
    /*gl.disable(gl.BLEND);
    gl.depthMask(false);
    gl.disable(gl.DEPTH_TEST);
    renderer.drawSkyBox(gl);*/
    
    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    renderer.ambientPass(gl, scene.ambientLight);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    
    renderer.lights.forEach(function (light) {
      renderer.lightPass(gl, light);
    });
    
    /*renderer.emissivePass(gl);
    
    //gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    renderer.drawParticles(gl);*/
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuanMiLCJwa3pvLmpzIiwic2hhZGVycy5qcyIsIkNhbnZhcy5qcyIsIlRleHR1cmUuanMiLCJDdWJlTWFwLmpzIiwiU2hhZGVyLmpzIiwiU2NlbmUuanMiLCJCdWZmZXIuanMiLCJQbHlQYXJzZXIuanMiLCJNZXNoLmpzIiwiTWF0ZXJpYWwuanMiLCJFbnRpdHkuanMiLCJDYW1lcmEuanMiLCJPYmplY3QuanMiLCJEaXJlY3Rpb25hbExpZ2h0LmpzIiwiUG9pbnRMaWdodC5qcyIsIlNwb3RMaWdodC5qcyIsIlNreUJveC5qcyIsIkVudGl0eUdyb3VwLmpzIiwiUGFydGljbGUuanMiLCJQYXJ0aWNsZVN5c3RlbS5qcyIsIlJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeGJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InBrem8tMC4wLjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIGh0dHAgPSB7fTtcclxuXHJcbmh0dHAuc2VuZCA9IGZ1bmN0aW9uICh0eXBlLCB1cmwsIGRhdGEsIGNiKSB7XHJcbiAgdmFyIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKClcclxuICB7XHJcbiAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpXHJcbiAgICB7XHJcbiAgICAgIGNiKHhtbGh0dHAuc3RhdHVzLCB4bWxodHRwLnJlc3BvbnNlVGV4dCk7XHJcbiAgICB9XHJcbiAgfSAgICBcclxuICB4bWxodHRwLm9wZW4odHlwZSwgdXJsLCB0cnVlKTtcclxuICB4bWxodHRwLnNlbmQoZGF0YSk7XHJcbn1cclxuXHJcbmh0dHAuZ2V0ID0gZnVuY3Rpb24gKHVybCwgY2IpIHtcclxuICBodHRwLnNlbmQoXCJHRVRcIiwgdXJsLCBudWxsLCBjYik7XHJcbn1cclxuXHJcbmh0dHAucG9zdCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGNiKSB7XHJcbiAgaHR0cC5zZW5kKFwiR0VUXCIsIHVybCwgZGF0YSwgY2IpO1xyXG59XHJcbiIsIlxyXG52YXIgcGt6byA9IHt2ZXJzaW9uOiAnMC4wLjEnfTtcclxuIiwicGt6by5BbWJpZW50RnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyAgICAgIHVBbGJlZG87XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmU7XFxuXFxudW5pZm9ybSBib29sICAgICAgdUhhc1RleHR1cmU7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzIHVBbWJpZW50TGlnaHQ7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgdmVjMyBjb2xvciA9IHVBbGJlZG87XFxuXFxuICAgIFxcblxcbiAgICBpZiAodUhhc1RleHR1cmUpIHtcXG5cXG4gICAgICAgIGNvbG9yID0gY29sb3IgKiB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkucmdiO1xcblxcbiAgICB9XFxuXFxuICAgIFxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yICogdUFtYmllbnRMaWdodCwgMSk7XFxuXFxufVxcblxcblwiO1xucGt6by5FbWlzc2l2ZUZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIHZlYzMgICAgICB1RW1pc3NpdmVDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1RW1pc3NpdmVNYXA7XFxuXFxudW5pZm9ybSBib29sICAgICAgdUhhc0VtaXNzaXZlTWFwO1xcblxcblxcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxuXFxuXFxudm9pZCBtYWluKClcXG5cXG57XFxuXFxuICAgIHZlYzMgY29sb3IgPSB1RW1pc3NpdmVDb2xvcjtcXG5cXG4gICAgXFxuXFxuICAgIGlmICh1SGFzRW1pc3NpdmVNYXApIHtcXG5cXG4gICAgICAgIGNvbG9yID0gY29sb3IgKiB0ZXh0dXJlMkQodUVtaXNzaXZlTWFwLCB2VGV4Q29vcmQpLnJnYjtcXG5cXG4gICAgfVxcblxcbiAgICBcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvciwgMS4wKTtcXG5cXG59XFxuXFxuXCI7XG5wa3pvLkludmVyc2UgPSBcIi8qXFxuXFxuVGhlIE1JVCBMaWNlbnNlIChNSVQpXFxuXFxuXFxuXFxuQ29weXJpZ2h0IChjKSAyMDE0IE1pa29sYSBMeXNlbmtvXFxuXFxuXFxuXFxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxcblxcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFxcXCJTb2Z0d2FyZVxcXCIpLCB0byBkZWFsXFxuXFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xcblxcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcXG5cXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcXG5cXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxcblxcblxcblxcblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXFxuXFxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXFxuXFxuXFxuXFxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFxcXCJBUyBJU1xcXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcXG5cXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcXG5cXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcXG5cXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXFxuXFxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcXG5cXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXFxuXFxuVEhFIFNPRlRXQVJFLlxcblxcbiovXFxuXFxuXFxuXFxubWF0MiBpbnZlcnNlKG1hdDIgbSkge1xcblxcbiAgcmV0dXJuIG1hdDIobVsxXVsxXSwtbVswXVsxXSxcXG5cXG4gICAgICAgICAgICAgLW1bMV1bMF0sIG1bMF1bMF0pIC8gKG1bMF1bMF0qbVsxXVsxXSAtIG1bMF1bMV0qbVsxXVswXSk7XFxuXFxufVxcblxcblxcblxcbm1hdDMgaW52ZXJzZShtYXQzIG0pIHtcXG5cXG4gIGZsb2F0IGEwMCA9IG1bMF1bMF0sIGEwMSA9IG1bMF1bMV0sIGEwMiA9IG1bMF1bMl07XFxuXFxuICBmbG9hdCBhMTAgPSBtWzFdWzBdLCBhMTEgPSBtWzFdWzFdLCBhMTIgPSBtWzFdWzJdO1xcblxcbiAgZmxvYXQgYTIwID0gbVsyXVswXSwgYTIxID0gbVsyXVsxXSwgYTIyID0gbVsyXVsyXTtcXG5cXG5cXG5cXG4gIGZsb2F0IGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMTtcXG5cXG4gIGZsb2F0IGIxMSA9IC1hMjIgKiBhMTAgKyBhMTIgKiBhMjA7XFxuXFxuICBmbG9hdCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XFxuXFxuXFxuXFxuICBmbG9hdCBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XFxuXFxuXFxuXFxuICByZXR1cm4gbWF0MyhiMDEsICgtYTIyICogYTAxICsgYTAyICogYTIxKSwgKGExMiAqIGEwMSAtIGEwMiAqIGExMSksXFxuXFxuICAgICAgICAgICAgICBiMTEsIChhMjIgKiBhMDAgLSBhMDIgKiBhMjApLCAoLWExMiAqIGEwMCArIGEwMiAqIGExMCksXFxuXFxuICAgICAgICAgICAgICBiMjEsICgtYTIxICogYTAwICsgYTAxICogYTIwKSwgKGExMSAqIGEwMCAtIGEwMSAqIGExMCkpIC8gZGV0O1xcblxcbn1cXG5cXG5cXG5cXG5tYXQ0IGludmVyc2UobWF0NCBtKSB7XFxuXFxuICBmbG9hdFxcblxcbiAgICAgIGEwMCA9IG1bMF1bMF0sIGEwMSA9IG1bMF1bMV0sIGEwMiA9IG1bMF1bMl0sIGEwMyA9IG1bMF1bM10sXFxuXFxuICAgICAgYTEwID0gbVsxXVswXSwgYTExID0gbVsxXVsxXSwgYTEyID0gbVsxXVsyXSwgYTEzID0gbVsxXVszXSxcXG5cXG4gICAgICBhMjAgPSBtWzJdWzBdLCBhMjEgPSBtWzJdWzFdLCBhMjIgPSBtWzJdWzJdLCBhMjMgPSBtWzJdWzNdLFxcblxcbiAgICAgIGEzMCA9IG1bM11bMF0sIGEzMSA9IG1bM11bMV0sIGEzMiA9IG1bM11bMl0sIGEzMyA9IG1bM11bM10sXFxuXFxuXFxuXFxuICAgICAgYjAwID0gYTAwICogYTExIC0gYTAxICogYTEwLFxcblxcbiAgICAgIGIwMSA9IGEwMCAqIGExMiAtIGEwMiAqIGExMCxcXG5cXG4gICAgICBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTAsXFxuXFxuICAgICAgYjAzID0gYTAxICogYTEyIC0gYTAyICogYTExLFxcblxcbiAgICAgIGIwNCA9IGEwMSAqIGExMyAtIGEwMyAqIGExMSxcXG5cXG4gICAgICBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTIsXFxuXFxuICAgICAgYjA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwLFxcblxcbiAgICAgIGIwNyA9IGEyMCAqIGEzMiAtIGEyMiAqIGEzMCxcXG5cXG4gICAgICBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzAsXFxuXFxuICAgICAgYjA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxLFxcblxcbiAgICAgIGIxMCA9IGEyMSAqIGEzMyAtIGEyMyAqIGEzMSxcXG5cXG4gICAgICBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzIsXFxuXFxuXFxuXFxuICAgICAgZGV0ID0gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xcblxcblxcblxcbiAgcmV0dXJuIG1hdDQoXFxuXFxuICAgICAgYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5LFxcblxcbiAgICAgIGEwMiAqIGIxMCAtIGEwMSAqIGIxMSAtIGEwMyAqIGIwOSxcXG5cXG4gICAgICBhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMsXFxuXFxuICAgICAgYTIyICogYjA0IC0gYTIxICogYjA1IC0gYTIzICogYjAzLFxcblxcbiAgICAgIGExMiAqIGIwOCAtIGExMCAqIGIxMSAtIGExMyAqIGIwNyxcXG5cXG4gICAgICBhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcsXFxuXFxuICAgICAgYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxLFxcblxcbiAgICAgIGEyMCAqIGIwNSAtIGEyMiAqIGIwMiArIGEyMyAqIGIwMSxcXG5cXG4gICAgICBhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYsXFxuXFxuICAgICAgYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2LFxcblxcbiAgICAgIGEzMCAqIGIwNCAtIGEzMSAqIGIwMiArIGEzMyAqIGIwMCxcXG5cXG4gICAgICBhMjEgKiBiMDIgLSBhMjAgKiBiMDQgLSBhMjMgKiBiMDAsXFxuXFxuICAgICAgYTExICogYjA3IC0gYTEwICogYjA5IC0gYTEyICogYjA2LFxcblxcbiAgICAgIGEwMCAqIGIwOSAtIGEwMSAqIGIwNyArIGEwMiAqIGIwNixcXG5cXG4gICAgICBhMzEgKiBiMDEgLSBhMzAgKiBiMDMgLSBhMzIgKiBiMDAsXFxuXFxuICAgICAgYTIwICogYjAzIC0gYTIxICogYjAxICsgYTIyICogYjAwKSAvIGRldDtcXG5cXG59XFxuXFxuXCI7XG5wa3pvLkxpZ2h0RnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyAgICAgIHVBbGJlZG87XFxuXFxudW5pZm9ybSBib29sICAgICAgdUhhc1RleHR1cmU7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmU7XFxuXFxudW5pZm9ybSBmbG9hdCAgICAgdVJvdWdobmVzcztcXG5cXG51bmlmb3JtIGJvb2wgICAgICB1SGFzUm91Z2huZXNzTWFwO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVSb3VnaG5lc3NNYXA7XFxuXFxudW5pZm9ybSBib29sICAgICAgdUhhc05vcm1hbE1hcDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1Tm9ybWFsTWFwO1xcblxcblxcblxcbnVuaWZvcm0gaW50ICAgdUxpZ2h0VHlwZTsgLy8gMTogZGlyZWN0aW9uYWwsIDI6IHBvaW50LCAzOiBzcG90XFxuXFxudW5pZm9ybSB2ZWMzICB1TGlnaHRDb2xvcjtcXG5cXG51bmlmb3JtIHZlYzMgIHVMaWdodERpcmVjdGlvbjtcXG5cXG51bmlmb3JtIHZlYzMgIHVMaWdodFBvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdUxpZ2h0UmFuZ2U7XFxuXFxudW5pZm9ybSBmbG9hdCB1TGlnaHRDdXRvZmY7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG52YXJ5aW5nIHZlYzMgdlBvc2l0aW9uO1xcblxcbnZhcnlpbmcgdmVjMyB2RXllO1xcblxcbnZhcnlpbmcgbWF0MyB2VEJOO1xcblxcblxcblxcbnZvaWQgbWFpbigpIHtcXG5cXG4gICAgdmVjMyBjb2xvciA9IHVBbGJlZG87ICAgIFxcblxcbiAgICBpZiAodUhhc1RleHR1cmUpIHtcXG5cXG4gICAgICAgIGNvbG9yID0gY29sb3IgKiB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkucmdiO1xcblxcbiAgICB9XFxuXFxuICAgIFxcblxcbiAgICB2ZWMzIG5vcm1hbDtcXG5cXG4gICAgaWYgKHVIYXNOb3JtYWxNYXApIHtcXG5cXG4gICAgICAgIG5vcm1hbCA9IG5vcm1hbGl6ZSh2VEJOICogdGV4dHVyZTJEKHVOb3JtYWxNYXAsIHZUZXhDb29yZCkucmdiKTtcXG5cXG4gICAgfVxcblxcbiAgICBlbHNlIHtcXG5cXG4gICAgICAgIG5vcm1hbCA9IG5vcm1hbGl6ZSh2Tm9ybWFsKTsgICAgICAgIFxcblxcbiAgICB9XFxuXFxuICAgIFxcblxcbiAgICB2ZWMzIGxpZ2h0RGlyZWN0aW9uO1xcblxcbiAgICBmbG9hdCBhdHRlbjtcXG5cXG4gICAgaWYgKHVMaWdodFR5cGUgPT0gMSkge1xcblxcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSBub3JtYWxpemUoLXVMaWdodERpcmVjdGlvbik7XFxuXFxuICAgICAgICBhdHRlbiA9IDEuMDtcXG5cXG4gICAgfVxcblxcbiAgICBpZiAodUxpZ2h0VHlwZSA9PSAyKSB7XFxuXFxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IHVMaWdodFBvc2l0aW9uIC0gdlBvc2l0aW9uO1xcblxcbiAgICAgICAgZmxvYXQgZGlzdCA9IGxlbmd0aChsaWdodERpcmVjdGlvbik7XFxuXFxuICAgICAgICBpZiAoZGlzdCA+IHVMaWdodFJhbmdlKSB7XFxuXFxuICAgICAgICAgICAgZGlzY2FyZDtcXG5cXG4gICAgICAgIH1cXG5cXG4gICAgICAgIGxpZ2h0RGlyZWN0aW9uID0gbm9ybWFsaXplKGxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgICAgIGF0dGVuID0gMS4wIC0gKGRpc3QgLyB1TGlnaHRSYW5nZSk7ICAgIFxcblxcbiAgICB9XFxuXFxuICAgIGlmICh1TGlnaHRUeXBlID09IDMpIHtcXG5cXG4gICAgICAgIGxpZ2h0RGlyZWN0aW9uID0gdUxpZ2h0UG9zaXRpb24gLSB2UG9zaXRpb247XFxuXFxuICAgICAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgICAgIGlmIChkaXN0ID4gdUxpZ2h0UmFuZ2UpIHtcXG5cXG4gICAgICAgICAgICBkaXNjYXJkO1xcblxcbiAgICAgICAgfVxcblxcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSBub3JtYWxpemUobGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgYXR0ZW4gPSAxLjAgLSAoZGlzdCAvIHVMaWdodFJhbmdlKTsgICAgXFxuXFxuICAgICAgICBcXG5cXG4gICAgICAgIGlmIChkb3QobGlnaHREaXJlY3Rpb24sIC11TGlnaHREaXJlY3Rpb24pIDwgdUxpZ2h0Q3V0b2ZmKSB7XFxuXFxuICAgICAgICAgICAgZGlzY2FyZDtcXG5cXG4gICAgICAgIH0gIFxcblxcbiAgICB9XFxuXFxuICAgIFxcblxcbiAgICB2ZWMzIHJlc3VsdCA9IHZlYzMoMCk7ICAgIFxcblxcbiAgICBmbG9hdCBuRG90TCA9IGRvdChub3JtYWwsIGxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgaWYgKG5Eb3RMID4gMC4wKSB7ICAgIFxcblxcbiAgICAgICAgcmVzdWx0ICs9IG5Eb3RMICogY29sb3IgKiB1TGlnaHRDb2xvciAqIGF0dGVuO1xcblxcbiAgICAgICAgXFxuXFxuICAgICAgICB2ZWMzIGV5ZSA9IG5vcm1hbGl6ZSh2RXllKTtcXG5cXG4gICAgICAgIHZlYzMgcmVmbGVjdGlvbiA9IHJlZmxlY3Qobm9ybWFsLCBsaWdodERpcmVjdGlvbik7XFxuXFxuICAgICAgICBmbG9hdCBzaGluaW5lc3MgPSAxLjAgLSB1Um91Z2huZXNzO1xcblxcbiAgICAgICAgaWYgKHVIYXNSb3VnaG5lc3NNYXApIHtcXG5cXG4gICAgICAgICAgICBzaGluaW5lc3MgPSBzaGluaW5lc3MgKiAoMS4wIC0gdGV4dHVyZTJEKHVSb3VnaG5lc3NNYXAsIHZUZXhDb29yZCkucik7XFxuXFxuICAgICAgICB9ICAgICAgICBcXG5cXG5cXG5cXG4gICAgICAgIGZsb2F0IGVEb3RSID0gZG90KGV5ZSwgcmVmbGVjdGlvbik7XHRcXG5cXG4gICAgICAgIGlmIChlRG90UiA+IDAuMClcXG5cXG4gICAgICAgIHtcXG5cXG4gICAgICAgICAgICAvLyAwLTEgLT4gMC0xMjhcXG5cXG4gICAgICAgICAgICBmbG9hdCBzaSA9IHBvdyhlRG90Uiwgc2hpbmluZXNzICogMTI4LjApO1xcblxcbiAgICAgICAgICAgIHJlc3VsdCArPSB1TGlnaHRDb2xvciAqIHZlYzMoc2hpbmluZXNzKSAgKiBzaTtcXG5cXG4gICAgICAgIH1cXG5cXG4gICAgfVxcblxcbiAgICAgICAgICAgIFxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHJlc3VsdCwgMS4wKTtcXG5cXG59ICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXFxuXCI7XG5wa3pvLlBhcnRpY2xlRnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyAgdUNvbG9yO1xcblxcbnVuaWZvcm0gZmxvYXQgdVRyYW5zcGFyZW5jeTtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZTtcXG5cXG51bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgaWYgKHVIYXNUZXh0dXJlKSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkgKiB2ZWM0KHVDb2xvciwgMS4wIC0gdVRyYW5zcGFyZW5jeSk7XFxuXFxuICAgIH1cXG5cXG4gICAgZWxzZSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHVDb2xvciwgMS4wIC0gdVRyYW5zcGFyZW5jeSk7XFxuXFxuICAgIH1cXG5cXG59XCI7XG5wa3pvLlBhcnRpY2xlVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gbWF0NCB1UHJvamVjdGlvbk1hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDQgdVZpZXdNYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQ0IHVNb2RlbE1hdHJpeDtcXG5cXG51bmlmb3JtIGZsb2F0IHVTaXplO1xcblxcblxcblxcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXg7XFxuXFxuYXR0cmlidXRlIHZlYzIgYVRleENvb3JkO1xcblxcblxcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxuXFxuXFxudm9pZCBtYWluKCkge1xcblxcbiAgbWF0NCBtb2RlbFZpZXcgPSB1Vmlld01hdHJpeCAqIHVNb2RlbE1hdHJpeCA7XFxuXFxuICBtb2RlbFZpZXdbMF0gPSB2ZWM0KHVTaXplLCAwLCAwLCAwKTtcXG5cXG4gIG1vZGVsVmlld1sxXSA9IHZlYzQoMCwgdVNpemUsIDAsIDApO1xcblxcbiAgbW9kZWxWaWV3WzJdID0gdmVjNCgwLCAwLCB1U2l6ZSwgMCk7XFxuXFxuICBcXG5cXG4gIHZUZXhDb29yZCA9IGFUZXhDb29yZDtcXG5cXG4gICAgXFxuXFxuICBnbF9Qb3NpdGlvbiA9IHVQcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3ICogdmVjNChhVmVydGV4LCAxKTtcXG5cXG59XCI7XG5wa3pvLlNreUJveEZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIHNhbXBsZXJDdWJlIHVDdWJlbWFwO1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2RGlyZWN0aW9uO1xcblxcblxcblxcbnZvaWQgbWFpbigpXFxuXFxue1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlQ3ViZSh1Q3ViZW1hcCwgdkRpcmVjdGlvbik7XFxuXFxufVxcblxcblwiO1xucGt6by5Ta3lCb3hWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xcblxcbnVuaWZvcm0gbWF0NCB1Vmlld01hdHJpeDtcXG5cXG5cXG5cXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4O1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2RGlyZWN0aW9uO1xcblxcblxcblxcbnZvaWQgbWFpbigpXFxuXFxue1xcblxcbiAgICB2ZWM0IHZlcnRleCAgICAgICAgICAgID0gdmVjNChhVmVydGV4LCAxKTtcXG5cXG4gICAgbWF0NCBpbnZlcnNlUHJvamVjdGlvbiA9IGludmVyc2UodVByb2plY3Rpb25NYXRyaXgpO1xcblxcbiAgICBtYXQzIGludmVyc2VWaWV3ICAgICAgID0gaW52ZXJzZShtYXQzKHVWaWV3TWF0cml4KSk7XFxuXFxuICAgIHZlYzMgdW5wcm9qZWN0ZWQgICAgICAgPSAoaW52ZXJzZVByb2plY3Rpb24gKiB2ZXJ0ZXgpLnh5ejtcXG5cXG4gICAgXFxuXFxuICAgIHZEaXJlY3Rpb24gID0gaW52ZXJzZVZpZXcgKiB1bnByb2plY3RlZDtcXG5cXG4gICAgZ2xfUG9zaXRpb24gPSB2ZXJ0ZXg7XFxuXFxufVwiO1xucGt6by5Tb2xpZEZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIHZlYzMgdUNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlO1xcblxcbnVuaWZvcm0gYm9vbCB1SGFzVGV4dHVyZTtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzMgdk5vcm1hbDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleENvb3JkO1xcblxcblxcblxcbnZvaWQgbWFpbigpXFxuXFxue1xcblxcbiAgICBpZiAodUhhc1RleHR1cmUpIHtcXG5cXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZSwgdlRleENvb3JkKSAqIHZlYzQodUFsYmVkbywgMSk7XFxuXFxuICAgIH1cXG5cXG4gICAgZWxzZSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHVBbGJlZG8sIDEpO1xcblxcbiAgICB9XFxuXFxufVwiO1xucGt6by5Tb2xpZFZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIG1hdDQgdVByb2plY3Rpb25NYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQ0IHVWaWV3TWF0cml4O1xcblxcbnVuaWZvcm0gbWF0NCB1TW9kZWxNYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQzIHVOb3JtYWxNYXRyaXg7XFxuXFxuXFxuXFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleDtcXG5cXG5hdHRyaWJ1dGUgdmVjMyBhTm9ybWFsO1xcblxcbmF0dHJpYnV0ZSB2ZWMyIGFUZXhDb29yZDtcXG5cXG5hdHRyaWJ1dGUgdmVjMyBhVGFuZ2VudDtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzMgdk5vcm1hbDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleENvb3JkO1xcblxcbnZhcnlpbmcgdmVjMyB2UG9zaXRpb247XFxuXFxudmFyeWluZyB2ZWMzIHZFeWU7XFxuXFxudmFyeWluZyBtYXQzIHZUQk47XFxuXFxuXFxuXFxudm9pZCBtYWluKCkge1xcblxcbiAgdmVjMyBuID0gbm9ybWFsaXplKHVOb3JtYWxNYXRyaXggKiBhTm9ybWFsKTtcXG5cXG4gIHZlYzMgdCA9IG5vcm1hbGl6ZSh1Tm9ybWFsTWF0cml4ICogYVRhbmdlbnQpO1xcblxcbiAgdmVjMyBiID0gbm9ybWFsaXplKGNyb3NzKG4sIHQpKTtcXG5cXG4gICAgXFxuXFxuICB2Tm9ybWFsICAgICA9IG47XFxuXFxuICB2VGV4Q29vcmQgICA9IGFUZXhDb29yZDtcXG5cXG4gIHZQb3NpdGlvbiAgID0gdmVjMyh1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXgsIDEuMCkpO1xcblxcbiAgXFxuXFxuICB2RXllICAgICAgICA9IG1hdDModVZpZXdNYXRyaXgpICogLWFWZXJ0ZXg7XFxuXFxuICB2VEJOICAgICAgICA9IG1hdDModCwgYiwgbik7XFxuXFxuICBcXG5cXG4gIGdsX1Bvc2l0aW9uID0gdVByb2plY3Rpb25NYXRyaXggKiB1Vmlld01hdHJpeCAqIHVNb2RlbE1hdHJpeCAqIHZlYzQoYVZlcnRleCwgMSk7XFxuXFxufVwiO1xucGt6by5UcmFuc3Bvc2UgPSBcIlxcblxcbm1hdDIgdGFuc3Bvc2UobWF0MiBtKSB7XFxuXFxuICBtYXQyIHI7XFxuXFxuICBmb3IgKGludCBpID0gMDsgaSA8IDI7IGkrKykge1xcblxcbiAgICBmb3IgKGludCBqID0gMDsgaiA8IDI7IGorKykge1xcblxcbiAgICAgICByW2ldW2pdID0gbVtqXVtpXTtcXG5cXG4gICAgfVxcblxcbiAgfVxcblxcbiAgcmV0dXJuIHI7XFxuXFxufVxcblxcblxcblxcbm1hdDMgdGFuc3Bvc2UobWF0MyBtKSB7XFxuXFxuICBtYXQzIHI7XFxuXFxuICBmb3IgKGludCBpID0gMDsgaSA8IDM7IGkrKykge1xcblxcbiAgICBmb3IgKGludCBqID0gMDsgaiA8IDM7IGorKykge1xcblxcbiAgICAgICByW2ldW2pdID0gbVtqXVtpXTtcXG5cXG4gICAgfVxcblxcbiAgfVxcblxcbiAgcmV0dXJuIHI7XFxuXFxufVxcblxcblxcblxcbm1hdDQgdGFuc3Bvc2UobWF0NCBtKSB7XFxuXFxuICBtYXQ0IHI7XFxuXFxuICBmb3IgKGludCBpID0gMDsgaSA8IDQ7IGkrKykge1xcblxcbiAgICBmb3IgKGludCBqID0gMDsgaiA8IDQ7IGorKykge1xcblxcbiAgICAgICByW2ldW2pdID0gbVtqXVtpXTtcXG5cXG4gICAgfVxcblxcbiAgfVxcblxcbiAgcmV0dXJuIHI7XFxuXFxufVxcblxcblwiO1xuIiwiXHJcbnBrem8uQ2FudmFzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuY2FudmFzID0gZWxlbWVudDtcclxuICB9ICBcclxuICBcclxuICB0aGlzLmNhbnZhcy53aWR0aCAgPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aDtcclxuICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7ICBcclxuICBcclxuICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIsIHthbnRpYWxpYXM6IHRydWUsIGRlcHRoOiB0cnVlfSk7XHJcbiAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XHJcbiAgXHJcbiAgLy8gdGhlc2UgdmFsdWVzIGFyZSBmb3IgdGhlIHByb2dyYW1tZXIgb2YgdGhlIGRyYXcgZnVuY3Rpb24sIFxyXG4gIC8vIHdlIHBhc3MgdGhlIGdsIG9iamVjdCwgbm90IHRoZSBjYW52YXMuXHJcbiAgdGhpcy5nbC53aWR0aCAgPSB0aGlzLmNhbnZhcy53aWR0aDtcclxuICB0aGlzLmdsLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxufVxyXG5cclxucGt6by5DYW52YXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoY2IpIHtcclxuICBpZiAoY2IpIHtcclxuICAgIGNiLmNhbGwodGhpcywgdGhpcy5nbCk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLkNhbnZhcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjYikgeyAgXHJcbiAgaWYgKHRoaXMuY2FudmFzLndpZHRoICE9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoIHx8IHRoaXMuY2FudmFzLmhlaWdodCAhPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQpIHtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoICA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0OyAgXHJcbiAgICB0aGlzLmdsLndpZHRoICA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5nbC5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQgfCB0aGlzLmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG4gIFxyXG4gIGlmIChjYikge1xyXG4gICAgY2IuY2FsbCh0aGlzLCB0aGlzLmdsKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5UZXh0dXJlID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIHRoaXMudXJsICAgID0gdXJsO1xyXG4gIHRoaXMuaW1hZ2UgID0gbnVsbDtcclxuICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gIFxyXG4gIC8vIHdlIGRvbid0IHVwbG9hZCB0aGUgaW1hZ2UgdG8gVlJBTSwgYnV0IHRyeSB0byBsb2FkIGl0XHJcbiAgdGhpcy5sb2FkKCk7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5sb2FkID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIC8vIFRPRE8gbWFrZSB0aGUgYXBseSBjbGVhbmVyXHJcbiAgcmV0dXJuIG5ldyBwa3pvLlRleHR1cmUodXJsKTtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKCkge1x0XHJcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIHZhciB0ZXh0dXJlID0gdGhpcztcclxuICB0aGlzLmltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRleHR1cmUubG9hZGVkID0gdHJ1ZTsgICAgXHJcbiAgfTtcclxuICB0aGlzLmltYWdlLnNyYyA9IHRoaXMudXJsO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoISB0aGlzLmxvYWRlZCkge1xyXG4gICAgdGhyb3cgRXJyb3IoJ0NhbiBub3QgdXBsb2FkIHRleHR1cmUgdGhhdCBpcyBub3QgbG9hZGVkIHlldC4nKTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTtcclxuICBcclxuICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFXzJELCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLmltYWdlKTsgIFxyXG4gIHRoaXMuZ2wuZ2VuZXJhdGVNaXBtYXAodGhpcy5nbC5URVhUVVJFXzJEKTtcclxuICBcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy5nbC5MSU5FQVIpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLmdsLkxJTkVBUl9NSVBNQVBfTElORUFSKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLmdsLlJFUEVBVCk7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX1dSQVBfVCwgdGhpcy5nbC5SRVBFQVQpO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVUZXh0dXJlKHRoaXMuaWQpO1xyXG4gIHRoaXMuaWQgPSBudWxsO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZ2wsIGNoYW5uZWwpIHtcclxuXHR0aGlzLmdsID0gZ2w7ICBcclxuICAgIFxyXG4gIHRoaXMuZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIGNoYW5uZWwpO1xyXG4gIFxyXG4gIGlmICh0aGlzLmxvYWRlZCkgeyAgXHJcbiAgICBpZiAoISB0aGlzLmlkKSB7XHJcbiAgICAgIHRoaXMudXBsb2FkKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIFxyXG4gICAge1xyXG4gICAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5pZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIDApO1xyXG4gIH1cclxufVxyXG4iLCJcclxucGt6by5DdWJlTWFwID0gZnVuY3Rpb24gKCkgeyAgXHJcbiAgdGhpcy5sb2FkZWQgPSBmYWxzZTsgIFxyXG59XHJcblxyXG5wa3pvLkN1YmVNYXAubG9hZCA9IGZ1bmN0aW9uICh0ZXh0dXJlcykge1xyXG4gIHZhciBjbSA9IG5ldyBwa3pvLkN1YmVNYXAoKTtcclxuICBjbS5sb2FkKHRleHR1cmVzKTtcclxuICByZXR1cm4gY207XHJcbn1cclxuXHJcbnBrem8uQ3ViZU1hcC5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICh0ZXh0dXJlcykge1xyXG4gIHZhciBjdWJlbWFwID0gdGhpcztcclxuICB0aGlzLmxvYWRDb3VudCA9IDA7XHJcbiAgXHJcbiAgdmFyIG9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGN1YmVtYXAubG9hZENvdW50Kys7XHJcbiAgICBpZiAoY3ViZW1hcC5sb2FkQ291bnQgPT0gNikge1xyXG4gICAgICBjdWJlbWFwLmxvYWRlZCA9IHRydWU7ICAgICAgXHJcbiAgICB9XHJcbiAgfTtcclxuICBcclxuICB0aGlzLnhwb3NJbWFnZSA9IG5ldyBJbWFnZSgpOyAgXHJcbiAgdGhpcy54cG9zSW1hZ2Uub25sb2FkID0gb25sb2FkO1xyXG4gIHRoaXMueHBvc0ltYWdlLnNyYyAgICA9IHRleHR1cmVzLnhwb3M7XHJcbiAgXHJcbiAgdGhpcy54bmVnSW1hZ2UgPSBuZXcgSW1hZ2UoKTsgIFxyXG4gIHRoaXMueG5lZ0ltYWdlLm9ubG9hZCA9IG9ubG9hZDtcclxuICB0aGlzLnhuZWdJbWFnZS5zcmMgICAgPSB0ZXh0dXJlcy54bmVnO1xyXG4gIFxyXG4gIHRoaXMueXBvc0ltYWdlID0gbmV3IEltYWdlKCk7ICBcclxuICB0aGlzLnlwb3NJbWFnZS5vbmxvYWQgPSBvbmxvYWQ7XHJcbiAgdGhpcy55cG9zSW1hZ2Uuc3JjICAgID0gdGV4dHVyZXMueXBvcztcclxuICBcclxuICB0aGlzLnluZWdJbWFnZSA9IG5ldyBJbWFnZSgpOyAgXHJcbiAgdGhpcy55bmVnSW1hZ2Uub25sb2FkID0gb25sb2FkO1xyXG4gIHRoaXMueW5lZ0ltYWdlLnNyYyAgICA9IHRleHR1cmVzLnluZWc7XHJcbiAgXHJcbiAgdGhpcy56cG9zSW1hZ2UgPSBuZXcgSW1hZ2UoKTsgIFxyXG4gIHRoaXMuenBvc0ltYWdlLm9ubG9hZCA9IG9ubG9hZDtcclxuICB0aGlzLnpwb3NJbWFnZS5zcmMgICAgPSB0ZXh0dXJlcy56cG9zO1xyXG4gIFxyXG4gIHRoaXMuem5lZ0ltYWdlID0gbmV3IEltYWdlKCk7ICBcclxuICB0aGlzLnpuZWdJbWFnZS5vbmxvYWQgPSBvbmxvYWQ7XHJcbiAgdGhpcy56bmVnSW1hZ2Uuc3JjICAgID0gdGV4dHVyZXMuem5lZztcclxufVxyXG5cclxucGt6by5DdWJlTWFwLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCEgdGhpcy5sb2FkZWQpIHtcclxuICAgIHRocm93IEVycm9yKCdDYW4gbm90IHVwbG9hZCB0ZXh0dXJlIHRoYXQgaXMgbm90IGxvYWRlZCB5ZXQuJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMuaWQgPSB0aGlzLmdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy5pZCk7XHJcbiAgXHJcbiAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YLCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLnhwb3NJbWFnZSk7XHJcbiAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9YLCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLnhuZWdJbWFnZSk7XHJcbiAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZLCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLnlwb3NJbWFnZSk7XHJcbiAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZLCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLnluZWdJbWFnZSk7XHJcbiAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9aLCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLnpwb3NJbWFnZSk7XHJcbiAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aLCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLnpuZWdJbWFnZSk7XHJcbiAgXHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy5nbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMuZ2wuTElORUFSKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLmdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5nbC5MSU5FQVIpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMuZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy5nbC5URVhUVVJFX1dSQVBfVCwgdGhpcy5nbC5DTEFNUF9UT19FREdFKTtcclxufVxyXG5cclxucGt6by5DdWJlTWFwLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLmlkKTtcclxuICB0aGlzLmlkID0gbnVsbDtcclxufVxyXG5cclxucGt6by5DdWJlTWFwLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGdsLCBjaGFubmVsKSB7XHJcbiAgdGhpcy5nbCA9IGdsOyAgXHJcbiAgICBcclxuICB0aGlzLmdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBjaGFubmVsKTtcclxuICBcclxuICBpZiAodGhpcy5sb2FkZWQpIHsgIFxyXG4gICAgaWYgKCEgdGhpcy5pZCkge1xyXG4gICAgICB0aGlzLnVwbG9hZCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBcclxuICAgIHtcclxuICAgICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMuaWQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQLCAwKTtcclxuICB9XHJcbn1cclxuXHJcbiIsIlxyXG5wa3pvLlNoYWRlciA9IGZ1bmN0aW9uICh2ZXJ0ZXhDb2RlLCBmcmFnbWVudENvZGUpIHtcclxuICB0aGlzLnZlcnRleENvZGUgICA9IHZlcnRleENvZGU7XHJcbiAgdGhpcy5mcmFnbWVudENvZGUgPSBmcmFnbWVudENvZGU7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKGdsKSB7XHJcbiAgdGhpcy5nbCA9IGdsO1xyXG4gIHZhciB2ZXJ0ZXhTaGFkZXIgICA9IHRoaXMuY29tcGlsZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIsICAgdGhpcy52ZXJ0ZXhDb2RlKTtcclxuICB2YXIgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmNvbXBpbGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIsIHRoaXMuZnJhZ21lbnRDb2RlKTtcclxuICBcclxuICB2YXIgcHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gIFxyXG4gIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XHJcbiAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gIFxyXG4gIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgXHJcbiAgdmFyIGluZm9Mb2cgPSB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pO1xyXG4gIGlmICh0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykgPT09IGZhbHNlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoaW5mb0xvZyk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGluZm9Mb2cgIT09ICcnKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbmZvTG9nKTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5nbC5kZWxldGVTaGFkZXIodmVydGV4U2hhZGVyKTtcclxuICB0aGlzLmdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XHJcbiAgXHJcbiAgdGhpcy5pZCA9IHByb2dyYW07XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5jb21waWxlU2hhZGVyID0gZnVuY3Rpb24gKHR5cGUsIGNvZGUpIHtcclxuICB2YXIgaWQgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0eXBlKTsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wuc2hhZGVyU291cmNlKGlkLCBjb2RlKTtcclxuICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoaWQpO1xyXG4gIFxyXG4gIHZhciBpbmZvTG9nID0gdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGlkKTtcclxuICBpZiAodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoaWQsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpID09PSBmYWxzZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGluZm9Mb2cpO1xyXG4gIH1cclxuICBlbHNlIGlmIChpbmZvTG9nICE9PSAnJykge1xyXG4gICAgY29uc29sZS5sb2coaW5mb0xvZyk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBpZDtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVQcm9ncmFtKGlkKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZ2wpIHtcclxuICBpZiAoIXRoaXMuaWQpIHtcclxuICAgIHRoaXMuY29tcGlsZShnbCk7XHJcbiAgfVxyXG4gIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmlkKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldEFycnRpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lLCBidWZmZXIsIGVsZW1lbnRTaXplKSB7ICBcclxuICBidWZmZXIuYmluZCgpOyAgXHJcbiAgXHJcbiAgaWYgKGVsZW1lbnRTaXplID09PSB1bmRlZmluZWQpIHtcclxuICAgIHZhciBlbGVtZW50U2l6ZSA9IGJ1ZmZlci5lbGVtZW50U2l6ZTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHBvcyA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7ICBcclxuICBpZiAocG9zICE9IC0xKSB7XHJcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvcyk7XHJcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zLCBlbGVtZW50U2l6ZSwgYnVmZmVyLmVsZW1lbnRUeXBlLCB0aGlzLmdsLkZBTFNFLCAwLCAwKTsgIFxyXG4gIH1cclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0xaSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICBpZiAobG9jICE9IC0xKSB7XHJcbiAgICB0aGlzLmdsLnVuaWZvcm0xaShsb2MsIHZhbHVlKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtMWYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgaWYgKGxvYyAhPSAtMSkge1xyXG4gICAgdGhpcy5nbC51bmlmb3JtMWYobG9jLCB2YWx1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTJmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICBpZiAobG9jICE9IC0xKSB7XHJcbiAgICB0aGlzLmdsLnVuaWZvcm0yZihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTNmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICBpZiAobG9jICE9IC0xKSB7XHJcbiAgICB0aGlzLmdsLnVuaWZvcm0zZihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0pO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm00ZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgaWYgKGxvYyAhPSAtMSkge1xyXG4gICAgdGhpcy5nbC51bmlmb3JtNGYobG9jLCB2YWx1ZVswXSwgdmFsdWVbMV0sIHZhbHVlWzJdLCB2YWx1ZVs0XSk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybU1hdHJpeDNmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgdHJhbnNwb3NlKSB7XHJcbiAgaWYgKHRyYW5zcG9zZSA9PT0gdW5kZWZpbmVkIHx8dHJhbnNwb3NlID09PSBudWxsKSB7XHJcbiAgICB2YXIgdHJhbnNwb3NlID0gZmFsc2U7XHJcbiAgfVxyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICBpZiAobG9jICE9IC0xKSB7XHJcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYobG9jLCB0cmFuc3Bvc2UsIHZhbHVlKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtTWF0cml4NGZ2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCB0cmFuc3Bvc2UpIHtcclxuICBpZiAodHJhbnNwb3NlID09PSB1bmRlZmluZWQgfHx0cmFuc3Bvc2UgPT09IG51bGwpIHtcclxuICAgIHZhciB0cmFuc3Bvc2UgPSBmYWxzZTtcclxuICB9XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIGlmIChsb2MgIT0gLTEpIHtcclxuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdihsb2MsIHRyYW5zcG9zZSwgdmFsdWUpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLlNjZW5lID0gZnVuY3Rpb24gKCkge1xyXG5cdHRoaXMuYW1iaWVudExpZ2h0ID0gcmdtLnZlYzMoMC4yLCAwLjIsIDAuMik7XHRcclxufVxyXG5cclxucGt6by5TY2VuZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdGlmICh0aGlzLmVudGl0aWVzKSB7XHJcblx0XHR0aGlzLmVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24gKGVudGl0eSkge1xyXG5cdFx0XHRlbnRpdHkuZW5xdWV1ZShyZW5kZXJlcik7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbnBrem8uU2NlbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcclxuICBpZiAoISB0aGlzLmVudGl0aWVzKSB7XHJcbiAgICB0aGlzLmVudGl0aWVzID0gW2VudGl0eV07XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XHJcbiAgfVxyXG59IiwiXHJcbnBrem8uQnVmZmVyID0gZnVuY3Rpb24gKGdsLCBkYXRhLCBidHlwZSwgZXR5cGUpIHtcclxuICB0aGlzLmdsID0gZ2w7XHJcbiAgXHJcbiAgaWYgKGJ0eXBlID09PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMudHlwZSA9IGdsLkFSUkFZX0JVRkZFUjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLnR5cGUgPSBidHlwZTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGV0eXBlID09PSB1bmRlZmluZWQpIHtcclxuICAgIGlmICh0aGlzLnR5cGUgPT0gZ2wuQVJSQVlfQlVGRkVSKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudFR5cGUgPSBnbC5GTE9BVDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmVsZW1lbnRUeXBlID0gZ2wuVU5TSUdORURfU0hPUlQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5lbGVtZW50VHlwZSA9IGV0eXBlO1xyXG4gIH1cclxuICBcclxuICB0aGlzLmxvYWQoZGF0YSk7XHJcbn1cclxuXHJcbnBrem8ud3JhcEFycmF5ID0gZnVuY3Rpb24gKGdsLCB0eXBlLCBkYXRhKSB7XHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlIGdsLkZMT0FUOlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuRE9VQkxFOlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0NjRBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuVU5TSUdORURfQllURTpcclxuICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5VTlNJR05FRF9TSE9SVDpcclxuICAgICAgcmV0dXJuIG5ldyBVaW50MTZBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuVU5TSUdORURfSU5UOlxyXG4gICAgICByZXR1cm4gbmV3IFVpbnQzMkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5CWVRFOlxyXG4gICAgICByZXR1cm4gbmV3IEludDhBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuU0hPUlQ6XHJcbiAgICAgIHJldHVybiBuZXcgSW50MTZBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuSU5UOlxyXG4gICAgICByZXR1cm4gbmV3IEludDMyQXJyYXkoZGF0YSk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChkYXRhKSB7ICBcclxuICBpZiAoZGF0YVswXS5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdGhpcy5lbGVtZW50U2l6ZSA9IDE7XHJcbiAgICB0aGlzLmRhdGEgPSBwa3pvLndyYXBBcnJheSh0aGlzLmdsLCB0aGlzLmVsZW1lbnRUeXBlLCBkYXRhKTtcclxuICB9XHJcbiAgZWxzZSB7ICAgIFxyXG4gICAgdGhpcy5lbGVtZW50U2l6ZSA9IGRhdGFbMF0ubGVuZ3RoO1xyXG4gICAgdGhpcy5kYXRhID0gcGt6by53cmFwQXJyYXkodGhpcy5nbCwgdGhpcy5lbGVtZW50VHlwZSwgZGF0YS5sZW5ndGggKiB0aGlzLmVsZW1TaXplKTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIHZhciBidWZmZXIgPSB0aGlzO1xyXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgIGVsZW0uZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgICAgIGJ1ZmZlci5kYXRhW2ldID0gdjtcclxuICAgICAgICBpKys7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUudXBsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuaWQgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLnR5cGUsIHRoaXMuaWQpO1xyXG4gIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLnR5cGUsIHRoaXMuZGF0YSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLmlkKSB7XHJcbiAgICB0aGlzLmdsLmRlbGV0ZUJ1ZmZlcih0aGlzLmlkKTtcclxuICAgIHRoaXMuaWQgPSBudWxsO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihwcmltaXRpdmUpIHtcclxuICBpZiAoISB0aGlzLmlkKSB7XHJcbiAgICB0aGlzLnVwbG9hZCgpO1xyXG4gIH1cclxuICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy50eXBlLCB0aGlzLmlkKTtcclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihwcmltaXRpdmUpIHtcclxuICB0aGlzLmJpbmQoKTtcclxuICB0aGlzLmdsLmRyYXdFbGVtZW50cyhwcmltaXRpdmUsIHRoaXMuZGF0YS5sZW5ndGgsIHRoaXMuZWxlbWVudFR5cGUsIDApO1xyXG59XHJcblxyXG5cclxuIiwicGt6by5QbHlQYXJzZXIgPSAoZnVuY3Rpb24oKSB7XG4gIC8qXG4gICAqIEdlbmVyYXRlZCBieSBQRUcuanMgMC44LjAuXG4gICAqXG4gICAqIGh0dHA6Ly9wZWdqcy5tYWpkYS5jei9cbiAgICovXG5cbiAgZnVuY3Rpb24gcGVnJHN1YmNsYXNzKGNoaWxkLCBwYXJlbnQpIHtcbiAgICBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH1cbiAgICBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG4gICAgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFN5bnRheEVycm9yKG1lc3NhZ2UsIGV4cGVjdGVkLCBmb3VuZCwgb2Zmc2V0LCBsaW5lLCBjb2x1bW4pIHtcbiAgICB0aGlzLm1lc3NhZ2UgID0gbWVzc2FnZTtcbiAgICB0aGlzLmV4cGVjdGVkID0gZXhwZWN0ZWQ7XG4gICAgdGhpcy5mb3VuZCAgICA9IGZvdW5kO1xuICAgIHRoaXMub2Zmc2V0ICAgPSBvZmZzZXQ7XG4gICAgdGhpcy5saW5lICAgICA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gICA9IGNvbHVtbjtcblxuICAgIHRoaXMubmFtZSAgICAgPSBcIlN5bnRheEVycm9yXCI7XG4gIH1cblxuICBwZWckc3ViY2xhc3MoU3ludGF4RXJyb3IsIEVycm9yKTtcblxuICBmdW5jdGlvbiBwYXJzZShpbnB1dCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB7fSxcblxuICAgICAgICBwZWckRkFJTEVEID0ge30sXG5cbiAgICAgICAgcGVnJHN0YXJ0UnVsZUZ1bmN0aW9ucyA9IHsgcGx5OiBwZWckcGFyc2VwbHkgfSxcbiAgICAgICAgcGVnJHN0YXJ0UnVsZUZ1bmN0aW9uICA9IHBlZyRwYXJzZXBseSxcblxuICAgICAgICBwZWckYzAgPSBwZWckRkFJTEVELFxuICAgICAgICBwZWckYzEgPSBcInBseVwiLFxuICAgICAgICBwZWckYzIgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJwbHlcIiwgZGVzY3JpcHRpb246IFwiXFxcInBseVxcXCJcIiB9LFxuICAgICAgICBwZWckYzMgPSBbXSxcbiAgICAgICAgcGVnJGM0ID0gXCJlbmRfaGVhZGVyXCIsXG4gICAgICAgIHBlZyRjNSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImVuZF9oZWFkZXJcIiwgZGVzY3JpcHRpb246IFwiXFxcImVuZF9oZWFkZXJcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM2ID0gXCJmb3JtYXRcIixcbiAgICAgICAgcGVnJGM3ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiZm9ybWF0XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJmb3JtYXRcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM4ID0gXCJhc2NpaVwiLFxuICAgICAgICBwZWckYzkgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJhc2NpaVwiLCBkZXNjcmlwdGlvbjogXCJcXFwiYXNjaWlcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMxMCA9IFwiMS4wXCIsXG4gICAgICAgIHBlZyRjMTEgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCIxLjBcIiwgZGVzY3JpcHRpb246IFwiXFxcIjEuMFxcXCJcIiB9LFxuICAgICAgICBwZWckYzEyID0gXCJjb21tZW50XCIsXG4gICAgICAgIHBlZyRjMTMgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJjb21tZW50XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJjb21tZW50XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMTQgPSAvXlteXFxuXFxyXS8sXG4gICAgICAgIHBlZyRjMTUgPSB7IHR5cGU6IFwiY2xhc3NcIiwgdmFsdWU6IFwiW15cXFxcblxcXFxyXVwiLCBkZXNjcmlwdGlvbjogXCJbXlxcXFxuXFxcXHJdXCIgfSxcbiAgICAgICAgcGVnJGMxNiA9IGZ1bmN0aW9uKGEsIGIpIHthLnByb3BlcnRpZXMgPSBiOyBlbGVtZW50cy5wdXNoKGEpO30sXG4gICAgICAgIHBlZyRjMTcgPSBcImVsZW1lbnRcIixcbiAgICAgICAgcGVnJGMxOCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImVsZW1lbnRcIiwgZGVzY3JpcHRpb246IFwiXFxcImVsZW1lbnRcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMxOSA9IGZ1bmN0aW9uKGEsIGIpIHtyZXR1cm4ge3R5cGU6IGEsIGNvdW50OiBifTt9LFxuICAgICAgICBwZWckYzIwID0gXCJ2ZXJ0ZXhcIixcbiAgICAgICAgcGVnJGMyMSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInZlcnRleFwiLCBkZXNjcmlwdGlvbjogXCJcXFwidmVydGV4XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMjIgPSBcImZhY2VcIixcbiAgICAgICAgcGVnJGMyMyA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImZhY2VcIiwgZGVzY3JpcHRpb246IFwiXFxcImZhY2VcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMyNCA9IFwicHJvcGVydHlcIixcbiAgICAgICAgcGVnJGMyNSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInByb3BlcnR5XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJwcm9wZXJ0eVxcXCJcIiB9LFxuICAgICAgICBwZWckYzI2ID0gZnVuY3Rpb24oYSkge3JldHVybiBhO30sXG4gICAgICAgIHBlZyRjMjcgPSBcImZsb2F0XCIsXG4gICAgICAgIHBlZyRjMjggPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJmbG9hdFwiLCBkZXNjcmlwdGlvbjogXCJcXFwiZmxvYXRcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMyOSA9IFwidWludFwiLFxuICAgICAgICBwZWckYzMwID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwidWludFwiLCBkZXNjcmlwdGlvbjogXCJcXFwidWludFxcXCJcIiB9LFxuICAgICAgICBwZWckYzMxID0gXCJpbnRcIixcbiAgICAgICAgcGVnJGMzMiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImludFwiLCBkZXNjcmlwdGlvbjogXCJcXFwiaW50XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMzMgPSBcInVjaGFyXCIsXG4gICAgICAgIHBlZyRjMzQgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ1Y2hhclwiLCBkZXNjcmlwdGlvbjogXCJcXFwidWNoYXJcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMzNSA9IFwiY2hhclwiLFxuICAgICAgICBwZWckYzM2ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiY2hhclwiLCBkZXNjcmlwdGlvbjogXCJcXFwiY2hhclxcXCJcIiB9LFxuICAgICAgICBwZWckYzM3ID0gXCJsaXN0XCIsXG4gICAgICAgIHBlZyRjMzggPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJsaXN0XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJsaXN0XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMzkgPSBcInhcIixcbiAgICAgICAgcGVnJGM0MCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInhcIiwgZGVzY3JpcHRpb246IFwiXFxcInhcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM0MSA9IFwieVwiLFxuICAgICAgICBwZWckYzQyID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwieVwiLCBkZXNjcmlwdGlvbjogXCJcXFwieVxcXCJcIiB9LFxuICAgICAgICBwZWckYzQzID0gXCJ6XCIsXG4gICAgICAgIHBlZyRjNDQgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ6XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ6XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNDUgPSBcIm54XCIsXG4gICAgICAgIHBlZyRjNDYgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJueFwiLCBkZXNjcmlwdGlvbjogXCJcXFwibnhcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM0NyA9IFwibnlcIixcbiAgICAgICAgcGVnJGM0OCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIm55XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJueVxcXCJcIiB9LFxuICAgICAgICBwZWckYzQ5ID0gXCJuelwiLFxuICAgICAgICBwZWckYzUwID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwibnpcIiwgZGVzY3JpcHRpb246IFwiXFxcIm56XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNTEgPSBcInNcIixcbiAgICAgICAgcGVnJGM1MiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInNcIiwgZGVzY3JpcHRpb246IFwiXFxcInNcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM1MyA9IFwidFwiLFxuICAgICAgICBwZWckYzU0ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwidFwiLCBkZXNjcmlwdGlvbjogXCJcXFwidFxcXCJcIiB9LFxuICAgICAgICBwZWckYzU1ID0gXCJ2ZXJ0ZXhfaW5kaWNlc1wiLFxuICAgICAgICBwZWckYzU2ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwidmVydGV4X2luZGljZXNcIiwgZGVzY3JpcHRpb246IFwiXFxcInZlcnRleF9pbmRpY2VzXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNTcgPSBmdW5jdGlvbihhKSB7ZGVjb2RlTGluZShhKTt9LFxuICAgICAgICBwZWckYzU4ID0gbnVsbCxcbiAgICAgICAgcGVnJGM1OSA9IFwiLVwiLFxuICAgICAgICBwZWckYzYwID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiLVwiLCBkZXNjcmlwdGlvbjogXCJcXFwiLVxcXCJcIiB9LFxuICAgICAgICBwZWckYzYxID0gL15bMC05XS8sXG4gICAgICAgIHBlZyRjNjIgPSB7IHR5cGU6IFwiY2xhc3NcIiwgdmFsdWU6IFwiWzAtOV1cIiwgZGVzY3JpcHRpb246IFwiWzAtOV1cIiB9LFxuICAgICAgICBwZWckYzYzID0gXCIuXCIsXG4gICAgICAgIHBlZyRjNjQgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCIuXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCIuXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNjUgPSBmdW5jdGlvbihhKSB7cmV0dXJuIHBhcnNlRmxvYXQoc3RySm9pbihhKSk7fSxcbiAgICAgICAgcGVnJGM2NiA9IC9eWyBcXHRcXHgwQl0vLFxuICAgICAgICBwZWckYzY3ID0geyB0eXBlOiBcImNsYXNzXCIsIHZhbHVlOiBcIlsgXFxcXHRcXFxceDBCXVwiLCBkZXNjcmlwdGlvbjogXCJbIFxcXFx0XFxcXHgwQl1cIiB9LFxuICAgICAgICBwZWckYzY4ID0gXCJcXHJcXG5cIixcbiAgICAgICAgcGVnJGM2OSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIlxcclxcblwiLCBkZXNjcmlwdGlvbjogXCJcXFwiXFxcXHJcXFxcblxcXCJcIiB9LFxuICAgICAgICBwZWckYzcwID0gXCJcXG5cIixcbiAgICAgICAgcGVnJGM3MSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIlxcblwiLCBkZXNjcmlwdGlvbjogXCJcXFwiXFxcXG5cXFwiXCIgfSxcbiAgICAgICAgcGVnJGM3MiA9IFwiXFxyXCIsXG4gICAgICAgIHBlZyRjNzMgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJcXHJcIiwgZGVzY3JpcHRpb246IFwiXFxcIlxcXFxyXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNzQgPSBmdW5jdGlvbigpIHtsaW5lcysrfSxcblxuICAgICAgICBwZWckY3VyclBvcyAgICAgICAgICA9IDAsXG4gICAgICAgIHBlZyRyZXBvcnRlZFBvcyAgICAgID0gMCxcbiAgICAgICAgcGVnJGNhY2hlZFBvcyAgICAgICAgPSAwLFxuICAgICAgICBwZWckY2FjaGVkUG9zRGV0YWlscyA9IHsgbGluZTogMSwgY29sdW1uOiAxLCBzZWVuQ1I6IGZhbHNlIH0sXG4gICAgICAgIHBlZyRtYXhGYWlsUG9zICAgICAgID0gMCxcbiAgICAgICAgcGVnJG1heEZhaWxFeHBlY3RlZCAgPSBbXSxcbiAgICAgICAgcGVnJHNpbGVudEZhaWxzICAgICAgPSAwLFxuXG4gICAgICAgIHBlZyRyZXN1bHQ7XG5cbiAgICBpZiAoXCJzdGFydFJ1bGVcIiBpbiBvcHRpb25zKSB7XG4gICAgICBpZiAoIShvcHRpb25zLnN0YXJ0UnVsZSBpbiBwZWckc3RhcnRSdWxlRnVuY3Rpb25zKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBzdGFydCBwYXJzaW5nIGZyb20gcnVsZSBcXFwiXCIgKyBvcHRpb25zLnN0YXJ0UnVsZSArIFwiXFxcIi5cIik7XG4gICAgICB9XG5cbiAgICAgIHBlZyRzdGFydFJ1bGVGdW5jdGlvbiA9IHBlZyRzdGFydFJ1bGVGdW5jdGlvbnNbb3B0aW9ucy5zdGFydFJ1bGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRleHQoKSB7XG4gICAgICByZXR1cm4gaW5wdXQuc3Vic3RyaW5nKHBlZyRyZXBvcnRlZFBvcywgcGVnJGN1cnJQb3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9mZnNldCgpIHtcbiAgICAgIHJldHVybiBwZWckcmVwb3J0ZWRQb3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZSgpIHtcbiAgICAgIHJldHVybiBwZWckY29tcHV0ZVBvc0RldGFpbHMocGVnJHJlcG9ydGVkUG9zKS5saW5lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbHVtbigpIHtcbiAgICAgIHJldHVybiBwZWckY29tcHV0ZVBvc0RldGFpbHMocGVnJHJlcG9ydGVkUG9zKS5jb2x1bW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwZWN0ZWQoZGVzY3JpcHRpb24pIHtcbiAgICAgIHRocm93IHBlZyRidWlsZEV4Y2VwdGlvbihcbiAgICAgICAgbnVsbCxcbiAgICAgICAgW3sgdHlwZTogXCJvdGhlclwiLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24gfV0sXG4gICAgICAgIHBlZyRyZXBvcnRlZFBvc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gICAgICB0aHJvdyBwZWckYnVpbGRFeGNlcHRpb24obWVzc2FnZSwgbnVsbCwgcGVnJHJlcG9ydGVkUG9zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckY29tcHV0ZVBvc0RldGFpbHMocG9zKSB7XG4gICAgICBmdW5jdGlvbiBhZHZhbmNlKGRldGFpbHMsIHN0YXJ0UG9zLCBlbmRQb3MpIHtcbiAgICAgICAgdmFyIHAsIGNoO1xuXG4gICAgICAgIGZvciAocCA9IHN0YXJ0UG9zOyBwIDwgZW5kUG9zOyBwKyspIHtcbiAgICAgICAgICBjaCA9IGlucHV0LmNoYXJBdChwKTtcbiAgICAgICAgICBpZiAoY2ggPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgIGlmICghZGV0YWlscy5zZWVuQ1IpIHsgZGV0YWlscy5saW5lKys7IH1cbiAgICAgICAgICAgIGRldGFpbHMuY29sdW1uID0gMTtcbiAgICAgICAgICAgIGRldGFpbHMuc2VlbkNSID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXHJcIiB8fCBjaCA9PT0gXCJcXHUyMDI4XCIgfHwgY2ggPT09IFwiXFx1MjAyOVwiKSB7XG4gICAgICAgICAgICBkZXRhaWxzLmxpbmUrKztcbiAgICAgICAgICAgIGRldGFpbHMuY29sdW1uID0gMTtcbiAgICAgICAgICAgIGRldGFpbHMuc2VlbkNSID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGV0YWlscy5jb2x1bW4rKztcbiAgICAgICAgICAgIGRldGFpbHMuc2VlbkNSID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwZWckY2FjaGVkUG9zICE9PSBwb3MpIHtcbiAgICAgICAgaWYgKHBlZyRjYWNoZWRQb3MgPiBwb3MpIHtcbiAgICAgICAgICBwZWckY2FjaGVkUG9zID0gMDtcbiAgICAgICAgICBwZWckY2FjaGVkUG9zRGV0YWlscyA9IHsgbGluZTogMSwgY29sdW1uOiAxLCBzZWVuQ1I6IGZhbHNlIH07XG4gICAgICAgIH1cbiAgICAgICAgYWR2YW5jZShwZWckY2FjaGVkUG9zRGV0YWlscywgcGVnJGNhY2hlZFBvcywgcG9zKTtcbiAgICAgICAgcGVnJGNhY2hlZFBvcyA9IHBvcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBlZyRjYWNoZWRQb3NEZXRhaWxzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRmYWlsKGV4cGVjdGVkKSB7XG4gICAgICBpZiAocGVnJGN1cnJQb3MgPCBwZWckbWF4RmFpbFBvcykgeyByZXR1cm47IH1cblxuICAgICAgaWYgKHBlZyRjdXJyUG9zID4gcGVnJG1heEZhaWxQb3MpIHtcbiAgICAgICAgcGVnJG1heEZhaWxQb3MgPSBwZWckY3VyclBvcztcbiAgICAgICAgcGVnJG1heEZhaWxFeHBlY3RlZCA9IFtdO1xuICAgICAgfVxuXG4gICAgICBwZWckbWF4RmFpbEV4cGVjdGVkLnB1c2goZXhwZWN0ZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRidWlsZEV4Y2VwdGlvbihtZXNzYWdlLCBleHBlY3RlZCwgcG9zKSB7XG4gICAgICBmdW5jdGlvbiBjbGVhbnVwRXhwZWN0ZWQoZXhwZWN0ZWQpIHtcbiAgICAgICAgdmFyIGkgPSAxO1xuXG4gICAgICAgIGV4cGVjdGVkLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIGlmIChhLmRlc2NyaXB0aW9uIDwgYi5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYS5kZXNjcmlwdGlvbiA+IGIuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdoaWxlIChpIDwgZXhwZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGV4cGVjdGVkW2kgLSAxXSA9PT0gZXhwZWN0ZWRbaV0pIHtcbiAgICAgICAgICAgIGV4cGVjdGVkLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBidWlsZE1lc3NhZ2UoZXhwZWN0ZWQsIGZvdW5kKSB7XG4gICAgICAgIGZ1bmN0aW9uIHN0cmluZ0VzY2FwZShzKSB7XG4gICAgICAgICAgZnVuY3Rpb24gaGV4KGNoKSB7IHJldHVybiBjaC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpOyB9XG5cbiAgICAgICAgICByZXR1cm4gc1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgICAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICAgICdcXFxcXCInKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xceDA4L2csICdcXFxcYicpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx0L2csICAgJ1xcXFx0JylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgICAnXFxcXG4nKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcZi9nLCAgICdcXFxcZicpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxyL2csICAgJ1xcXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx4MDAtXFx4MDdcXHgwQlxceDBFXFx4MEZdL2csIGZ1bmN0aW9uKGNoKSB7IHJldHVybiAnXFxcXHgwJyArIGhleChjaCk7IH0pXG4gICAgICAgICAgICAucmVwbGFjZSgvW1xceDEwLVxceDFGXFx4ODAtXFx4RkZdL2csICAgIGZ1bmN0aW9uKGNoKSB7IHJldHVybiAnXFxcXHgnICArIGhleChjaCk7IH0pXG4gICAgICAgICAgICAucmVwbGFjZSgvW1xcdTAxODAtXFx1MEZGRl0vZywgICAgICAgICBmdW5jdGlvbihjaCkgeyByZXR1cm4gJ1xcXFx1MCcgKyBoZXgoY2gpOyB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHUxMDgwLVxcdUZGRkZdL2csICAgICAgICAgZnVuY3Rpb24oY2gpIHsgcmV0dXJuICdcXFxcdScgICsgaGV4KGNoKTsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXhwZWN0ZWREZXNjcyA9IG5ldyBBcnJheShleHBlY3RlZC5sZW5ndGgpLFxuICAgICAgICAgICAgZXhwZWN0ZWREZXNjLCBmb3VuZERlc2MsIGk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGV4cGVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZXhwZWN0ZWREZXNjc1tpXSA9IGV4cGVjdGVkW2ldLmRlc2NyaXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0ZWREZXNjID0gZXhwZWN0ZWQubGVuZ3RoID4gMVxuICAgICAgICAgID8gZXhwZWN0ZWREZXNjcy5zbGljZSgwLCAtMSkuam9pbihcIiwgXCIpXG4gICAgICAgICAgICAgICsgXCIgb3IgXCJcbiAgICAgICAgICAgICAgKyBleHBlY3RlZERlc2NzW2V4cGVjdGVkLmxlbmd0aCAtIDFdXG4gICAgICAgICAgOiBleHBlY3RlZERlc2NzWzBdO1xuXG4gICAgICAgIGZvdW5kRGVzYyA9IGZvdW5kID8gXCJcXFwiXCIgKyBzdHJpbmdFc2NhcGUoZm91bmQpICsgXCJcXFwiXCIgOiBcImVuZCBvZiBpbnB1dFwiO1xuXG4gICAgICAgIHJldHVybiBcIkV4cGVjdGVkIFwiICsgZXhwZWN0ZWREZXNjICsgXCIgYnV0IFwiICsgZm91bmREZXNjICsgXCIgZm91bmQuXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciBwb3NEZXRhaWxzID0gcGVnJGNvbXB1dGVQb3NEZXRhaWxzKHBvcyksXG4gICAgICAgICAgZm91bmQgICAgICA9IHBvcyA8IGlucHV0Lmxlbmd0aCA/IGlucHV0LmNoYXJBdChwb3MpIDogbnVsbDtcblxuICAgICAgaWYgKGV4cGVjdGVkICE9PSBudWxsKSB7XG4gICAgICAgIGNsZWFudXBFeHBlY3RlZChleHBlY3RlZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgU3ludGF4RXJyb3IoXG4gICAgICAgIG1lc3NhZ2UgIT09IG51bGwgPyBtZXNzYWdlIDogYnVpbGRNZXNzYWdlKGV4cGVjdGVkLCBmb3VuZCksXG4gICAgICAgIGV4cGVjdGVkLFxuICAgICAgICBmb3VuZCxcbiAgICAgICAgcG9zLFxuICAgICAgICBwb3NEZXRhaWxzLmxpbmUsXG4gICAgICAgIHBvc0RldGFpbHMuY29sdW1uXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXBseSgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMztcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gcGVnJHBhcnNlbWFnaWMoKTtcbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZWhlYWRlcigpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZWJvZHkoKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHMxID0gW3MxLCBzMiwgczNdO1xuICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZW1hZ2ljKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczI7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAzKSA9PT0gcGVnJGMxKSB7XG4gICAgICAgIHMxID0gcGVnJGMxO1xuICAgICAgICBwZWckY3VyclBvcyArPSAzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMik7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZW5sKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMxID0gW3MxLCBzMl07XG4gICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWhlYWRlcigpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBwZWckcGFyc2Vmb3JtYXQoKTtcbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IFtdO1xuICAgICAgICBzMyA9IHBlZyRwYXJzZWNvbW1lbnQoKTtcbiAgICAgICAgd2hpbGUgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczIucHVzaChzMyk7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2Vjb21tZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczMgPSBbXTtcbiAgICAgICAgICBzNCA9IHBlZyRwYXJzZWVsZW1lbnQoKTtcbiAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHdoaWxlIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzMy5wdXNoKHM0KTtcbiAgICAgICAgICAgICAgczQgPSBwZWckcGFyc2VlbGVtZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMzID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDEwKSA9PT0gcGVnJGM0KSB7XG4gICAgICAgICAgICAgIHM0ID0gcGVnJGM0O1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSAxMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHM0ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzUpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczUgPSBwZWckcGFyc2VubCgpO1xuICAgICAgICAgICAgICBpZiAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBzMSA9IFtzMSwgczIsIHMzLCBzNCwgczVdO1xuICAgICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2Vmb3JtYXQoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNSwgczY7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA2KSA9PT0gcGVnJGM2KSB7XG4gICAgICAgIHMxID0gcGVnJGM2O1xuICAgICAgICBwZWckY3VyclBvcyArPSA2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNyk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDUpID09PSBwZWckYzgpIHtcbiAgICAgICAgICAgIHMzID0gcGVnJGM4O1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gNTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczMgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzkpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczQgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDMpID09PSBwZWckYzEwKSB7XG4gICAgICAgICAgICAgICAgczUgPSBwZWckYzEwO1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDM7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgczUgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxMSk7IH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBzNiA9IHBlZyRwYXJzZW5sKCk7XG4gICAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBzMSA9IFtzMSwgczIsIHMzLCBzNCwgczUsIHM2XTtcbiAgICAgICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2Vjb21tZW50KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNykgPT09IHBlZyRjMTIpIHtcbiAgICAgICAgczEgPSBwZWckYzEyO1xuICAgICAgICBwZWckY3VyclBvcyArPSA3O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTMpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBbXTtcbiAgICAgICAgaWYgKHBlZyRjMTQudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgIHMzID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMzID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTUpOyB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczIucHVzaChzMyk7XG4gICAgICAgICAgaWYgKHBlZyRjMTQudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgICAgczMgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczMgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzE1KTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZW5sKCk7XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMSA9IFtzMSwgczIsIHMzXTtcbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VlbGVtZW50KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBwZWckcGFyc2VlaGFkZXIoKTtcbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IFtdO1xuICAgICAgICBzMyA9IHBlZyRwYXJzZXByb3BlcnR5KCk7XG4gICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHdoaWxlIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczIucHVzaChzMyk7XG4gICAgICAgICAgICBzMyA9IHBlZyRwYXJzZXByb3BlcnR5KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMyID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgIHMxID0gcGVnJGMxNihzMSwgczIpO1xuICAgICAgICAgIHMwID0gczE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VlaGFkZXIoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNSwgczY7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA3KSA9PT0gcGVnJGMxNykge1xuICAgICAgICBzMSA9IHBlZyRjMTc7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxOCk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gcGVnJHBhcnNlZWx0eXBlKCk7XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczUgPSBwZWckcGFyc2VudW1iZXIoKTtcbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczYgPSBwZWckcGFyc2VubCgpO1xuICAgICAgICAgICAgICAgIGlmIChzNiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICBzMSA9IHBlZyRjMTkoczMsIHM1KTtcbiAgICAgICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VlbHR5cGUoKSB7XG4gICAgICB2YXIgczA7XG5cbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDYpID09PSBwZWckYzIwKSB7XG4gICAgICAgIHMwID0gcGVnJGMyMDtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzIxKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDQpID09PSBwZWckYzIyKSB7XG4gICAgICAgICAgczAgPSBwZWckYzIyO1xuICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMyMyk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlcHJvcGVydHkoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNSwgczY7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA4KSA9PT0gcGVnJGMyNCkge1xuICAgICAgICBzMSA9IHBlZyRjMjQ7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMyNSk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gcGVnJHBhcnNlcHR5cGUoKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZXB2YWx1ZSgpO1xuICAgICAgICAgICAgICBpZiAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBzNiA9IHBlZyRwYXJzZW5sKCk7XG4gICAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgIHMxID0gcGVnJGMyNihzNSk7XG4gICAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlcHR5cGUoKSB7XG4gICAgICB2YXIgczA7XG5cbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDUpID09PSBwZWckYzI3KSB7XG4gICAgICAgIHMwID0gcGVnJGMyNztcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzI4KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDQpID09PSBwZWckYzI5KSB7XG4gICAgICAgICAgczAgPSBwZWckYzI5O1xuICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMzMCk7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAzKSA9PT0gcGVnJGMzMSkge1xuICAgICAgICAgICAgczAgPSBwZWckYzMxO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzMyKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDUpID09PSBwZWckYzMzKSB7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMzMztcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzM0KTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDQpID09PSBwZWckYzM1KSB7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzM1O1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDQ7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMzNik7IH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRwYXJzZWxpc3QoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlbGlzdCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNCkgPT09IHBlZyRjMzcpIHtcbiAgICAgICAgczEgPSBwZWckYzM3O1xuICAgICAgICBwZWckY3VyclBvcyArPSA0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMzgpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZXB0eXBlKCk7XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczUgPSBwZWckcGFyc2VwdHlwZSgpO1xuICAgICAgICAgICAgICBpZiAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBzMSA9IFtzMSwgczIsIHMzLCBzNCwgczVdO1xuICAgICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VwdmFsdWUoKSB7XG4gICAgICB2YXIgczA7XG5cbiAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTIwKSB7XG4gICAgICAgIHMwID0gcGVnJGMzOTtcbiAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQwKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTIxKSB7XG4gICAgICAgICAgczAgPSBwZWckYzQxO1xuICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0Mik7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDEyMikge1xuICAgICAgICAgICAgczAgPSBwZWckYzQzO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQ0KTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzQ1KSB7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGM0NTtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQ2KTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzQ3KSB7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzQ3O1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0OCk7IH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAyKSA9PT0gcGVnJGM0OSkge1xuICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzQ5O1xuICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzUwKTsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTE1KSB7XG4gICAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGM1MTtcbiAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzUyKTsgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTE2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzUzO1xuICAgICAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM1NCk7IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAxNCkgPT09IHBlZyRjNTUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGM1NTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDE0O1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNTYpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2Vib2R5KCkge1xuICAgICAgdmFyIHMwLCBzMTtcblxuICAgICAgczAgPSBbXTtcbiAgICAgIHMxID0gcGVnJHBhcnNlYmxpbmUoKTtcbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICB3aGlsZSAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMC5wdXNoKHMxKTtcbiAgICAgICAgICBzMSA9IHBlZyRwYXJzZWJsaW5lKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlYmxpbmUoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gW107XG4gICAgICBzMiA9IHBlZyRwYXJzZWJ2YWx1ZSgpO1xuICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHdoaWxlIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMxLnB1c2goczIpO1xuICAgICAgICAgIHMyID0gcGVnJHBhcnNlYnZhbHVlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJGMwO1xuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNlbmwoKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgczEgPSBwZWckYzU3KHMxKTtcbiAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlYnZhbHVlKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczI7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IHBlZyRwYXJzZW51bWJlcigpO1xuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgaWYgKHMyID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczIgPSBwZWckYzU4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgIHMxID0gcGVnJGMyNihzMSk7XG4gICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZW51bWJlcigpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1LCBzNiwgczc7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSA0NSkge1xuICAgICAgICBzMiA9IHBlZyRjNTk7XG4gICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMiA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2MCk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMiA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRjNTg7XG4gICAgICB9XG4gICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczMgPSBbXTtcbiAgICAgICAgaWYgKHBlZyRjNjEudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgIHM0ID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHM0ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjIpOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgd2hpbGUgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMy5wdXNoKHM0KTtcbiAgICAgICAgICAgIGlmIChwZWckYzYxLnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICAgICAgczQgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgczQgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjIpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMzID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHM0ID0gcGVnJGN1cnJQb3M7XG4gICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSA0Nikge1xuICAgICAgICAgICAgczUgPSBwZWckYzYzO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczUgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzY0KTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM2ID0gW107XG4gICAgICAgICAgICBpZiAocGVnJGM2MS50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgICAgIHM3ID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHM3ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzYyKTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKHM3ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM2LnB1c2goczcpO1xuICAgICAgICAgICAgICBpZiAocGVnJGM2MS50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgICAgICAgczcgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgczcgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2Mik7IH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gW3M1LCBzNl07XG4gICAgICAgICAgICAgIHM0ID0gczU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHM0O1xuICAgICAgICAgICAgICBzNCA9IHBlZyRjMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzNDtcbiAgICAgICAgICAgIHM0ID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczQgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJGM1ODtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMiA9IFtzMiwgczMsIHM0XTtcbiAgICAgICAgICAgIHMxID0gczI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczE7XG4gICAgICAgICAgICBzMSA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMTtcbiAgICAgICAgICBzMSA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMTtcbiAgICAgICAgczEgPSBwZWckYzA7XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgIHMxID0gcGVnJGM2NShzMSk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNld3MoKSB7XG4gICAgICB2YXIgczAsIHMxO1xuXG4gICAgICBzMCA9IFtdO1xuICAgICAgaWYgKHBlZyRjNjYudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICBzMSA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2Nyk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICB3aGlsZSAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMC5wdXNoKHMxKTtcbiAgICAgICAgICBpZiAocGVnJGM2Ni50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgICBzMSA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjcpOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZW5sKCkge1xuICAgICAgdmFyIHMwLCBzMTtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzY4KSB7XG4gICAgICAgIHMxID0gcGVnJGM2ODtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzY5KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTApIHtcbiAgICAgICAgICBzMSA9IHBlZyRjNzA7XG4gICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzcxKTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzMSA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTMpIHtcbiAgICAgICAgICAgIHMxID0gcGVnJGM3MjtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM3Myk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgczEgPSBwZWckYzc0KCk7XG4gICAgICB9XG4gICAgICBzMCA9IHMxO1xuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG5cclxuICAgICAgdmFyIGxpbmVzICAgICAgPSAwO1xyXG4gICAgICB2YXIgbWVzaCAgICAgICA9IG9wdGlvbnMubWVzaDtcclxuICAgICAgdmFyIGVsZW1lbnRzICAgPSBbXTtcclxuICAgICAgdmFyIGVsZW1lbnRJZHMgPSAwOyAvLyBjdXJyZW50bHkgYWN0aXZlIGVsZW1lbnRcclxuICAgICAgdmFyIHZhbHVlQ291bnQgPSAwOyAvLyB3aGljaCB2YWx1ZSB3YXMgcmVhZCBsYXN0LCB3aXRoaW4gdGhpcyBlbGVtZW50XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBzdHJKb2luKHZhbHVlcykge1xyXG4gICAgICAgIHZhciByID0gJyc7XHJcbiAgICAgICAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgeyAgICAgICBcclxuICAgICAgICAgICAgICByID0gci5jb25jYXQodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgeyAgICAgICAgICBcclxuICAgICAgICAgICAgICByID0gci5jb25jYXQoc3RySm9pbih2YWx1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGRlY29kZUxpbmUodmFsdWVzKSB7XHJcbiAgICAgICAgdmFyIHByb3BzID0gZWxlbWVudHNbZWxlbWVudElkc10ucHJvcGVydGllcztcclxuICAgICAgICBcclxuICAgICAgICBpZiAocHJvcHNbMF0gPT0gJ3ZlcnRleF9pbmRpY2VzJykge1xyXG4gICAgICAgICAgdmFyIGNvdW50ID0gdmFsdWVzWzBdO1xyXG4gICAgICAgICAgLy8gYW55dGhpbmcgbGFyZ2VyIHRoYW4gYSB0cmlhbmdsZSBpcyBiYXNpY2FsbHkgIFxyXG4gICAgICAgICAgLy8gaW1wbGVtZW50ZWQgYXMgYSB0cmlhbmdsZSBmYW5cclxuICAgICAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAvLyBhY3R1YWwgdXNhYmxlIHZhbHVlcyBzdGFydCB3aXRoIDFcclxuICAgICAgICAgICAgdmFyIGEgPSB2YWx1ZXNbMV07ICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGIgPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgIHZhciBjID0gdmFsdWVzW2kgKyAxXTtcclxuICAgICAgICAgICAgbWVzaC5hZGRUcmlhbmdsZShhLCBiLCBjKTtcclxuICAgICAgICAgIH0gICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7ICAgIFxyXG4gICAgICAgICAgdmFyIHZlcnRleCAgID0gcmdtLnZlYzMoMCk7XHJcbiAgICAgICAgICB2YXIgbm9ybWFsICAgPSByZ20udmVjMygwKTtcclxuICAgICAgICAgIHZhciB0ZXhDb29yZCA9IHJnbS52ZWMyKDApO1xyXG4gICAgICAgICAgcHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCwgaSkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHByb3ApIHtcclxuICAgICAgICAgICAgICBjYXNlICd4JzpcclxuICAgICAgICAgICAgICAgIHZlcnRleFswXSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgJ3knOlxyXG4gICAgICAgICAgICAgICAgdmVydGV4WzFdID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAneic6XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhbMl0gPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlICdueCc6XHJcbiAgICAgICAgICAgICAgICBub3JtYWxbMF0gPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlICdueSc6XHJcbiAgICAgICAgICAgICAgICBub3JtYWxbMV0gPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlICdueic6XHJcbiAgICAgICAgICAgICAgICBub3JtYWxbMl0gPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhazsgIFxyXG4gICAgICAgICAgICAgIGNhc2UgJ3QnOlxyXG4gICAgICAgICAgICAgICAgdGV4Q29vcmRbMF0gPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgIHRleENvb3JkWzFdID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBtZXNoLmFkZFZlcnRleCh2ZXJ0ZXgsIG5vcm1hbCwgdGV4Q29vcmQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFsdWVDb3VudCsrO1xyXG4gICAgICAgIGlmICh2YWx1ZUNvdW50ID09IGVsZW1lbnRzW2VsZW1lbnRJZHNdLmNvdW50KSB7XHJcbiAgICAgICAgICBlbGVtZW50SWRzKys7XHJcbiAgICAgICAgICB2YWx1ZUNvdW50ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXG5cbiAgICBwZWckcmVzdWx0ID0gcGVnJHN0YXJ0UnVsZUZ1bmN0aW9uKCk7XG5cbiAgICBpZiAocGVnJHJlc3VsdCAhPT0gcGVnJEZBSUxFRCAmJiBwZWckY3VyclBvcyA9PT0gaW5wdXQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcGVnJHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBlZyRyZXN1bHQgIT09IHBlZyRGQUlMRUQgJiYgcGVnJGN1cnJQb3MgPCBpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgcGVnJGZhaWwoeyB0eXBlOiBcImVuZFwiLCBkZXNjcmlwdGlvbjogXCJlbmQgb2YgaW5wdXRcIiB9KTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgcGVnJGJ1aWxkRXhjZXB0aW9uKG51bGwsIHBlZyRtYXhGYWlsRXhwZWN0ZWQsIHBlZyRtYXhGYWlsUG9zKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIFN5bnRheEVycm9yOiBTeW50YXhFcnJvcixcbiAgICBwYXJzZTogICAgICAgcGFyc2VcbiAgfTtcbn0pKCk7IiwiXHJcbnBrem8uTWVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmxvYWRlZCA9IGZhbHNlOyAgXHJcbn1cclxuXHJcbnBrem8uTWVzaC5sb2FkID0gZnVuY3Rpb24gKHVybCkge1xyXG4gICAgdmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcbiAgICBcclxuICAgIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgaWYgKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0ICYmIHhtbGh0dHAuc3RhdHVzID09IDIwMClcclxuICAgICAge1xyXG4gICAgICAgIHZhciBwYXJzZXIgPSBwa3pvLlBseVBhcnNlcjtcclxuICAgICAgICBwYXJzZXIucGFyc2UoeG1saHR0cC5yZXNwb25zZVRleHQsIHttZXNoOiBtZXNofSk7XHJcbiAgICAgICAgbWVzaC5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9ICAgIFxyXG4gICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICB4bWxodHRwLnNlbmQoKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIG1lc2g7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wbGFuZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCB3cmVzLCBocmVzKSB7XHJcbiAgdmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcbiAgXHJcbiAgaWYgKHdyZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdmFyIHdyZXMgPSAxO1xyXG4gIH1cclxuICBcclxuICBpZiAoaHJlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB2YXIgaHJlcyA9IDE7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciB3MiA9IHdpZHRoIC8gMi4wO1xyXG4gIHZhciBoMiA9IGhlaWdodCAvIDIuMDtcclxuICB2YXIgd3MgPSB3aWR0aCAvIHdyZXM7XHJcbiAgdmFyIGhzID0gaGVpZ2h0IC8gaHJlcztcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8PSB3cmVzOyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDw9IGhyZXM7IGorKykge1xyXG4gICAgICB2YXIgeCA9IC13MiArIGkgKiB3czsgXHJcbiAgICAgIHZhciB5ID0gLWgyICsgaiAqIGhzO1xyXG4gICAgICB2YXIgdCA9IGk7XHJcbiAgICAgIHZhciBzID0gajtcclxuICAgICAgbWVzaC5hZGRWZXJ0ZXgocmdtLnZlYzMoeCwgeSwgMCksIHJnbS52ZWMzKDAsIDAsIDEpLCByZ20udmVjMih0LCBzKSwgcmdtLnZlYzMoMCwgMSwgMCkpOyAgICAgICAgICAgIFxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICB2YXIgc3BhbiA9IHdyZXMgKyAxO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgd3JlczsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGhyZXM7IGorKykge1xyXG4gICAgICB2YXIgYSA9IChpICsgMCkgKiBzcGFuICsgKGogKyAwKTtcclxuICAgICAgdmFyIGIgPSAoaSArIDApICogc3BhbiArIChqICsgMSk7XHJcbiAgICAgIHZhciBjID0gKGkgKyAxKSAqIHNwYW4gKyAoaiArIDEpO1xyXG4gICAgICB2YXIgZCA9IChpICsgMSkgKiBzcGFuICsgKGogKyAwKTtcclxuICAgICAgbWVzaC5hZGRUcmlhbmdsZShhLCBiLCBjKTtcclxuICAgICAgbWVzaC5hZGRUcmlhbmdsZShjLCBkLCBhKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgbWVzaC5sb2FkZWQgPSB0cnVlO1xyXG4gIHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2guYm94ID0gZnVuY3Rpb24gKHMpIHtcclxuICBcclxuICB2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuICBcclxuICBtZXNoLnZlcnRpY2VzID0gXHJcbiAgICAgIFsgIHNbMF0sIHNbMV0sIHNbMl0sICAtc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLC1zWzFdLCBzWzJdLCAgIHNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG4gICAgICAgICBzWzBdLCBzWzFdLCBzWzJdLCAgIHNbMF0sLXNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwtc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdLCAgICBcclxuICAgICAgICAgc1swXSwgc1sxXSwgc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdLCAgLXNbMF0sIHNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwgc1syXSwgICAgXHJcbiAgICAgICAgLXNbMF0sIHNbMV0sIHNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgIC1zWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG4gICAgICAgIC1zWzBdLC1zWzFdLC1zWzJdLCAgIHNbMF0sLXNbMV0sLXNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgIC1zWzBdLC1zWzFdLCBzWzJdLCAgICBcclxuICAgICAgICAgc1swXSwtc1sxXSwtc1syXSwgIC1zWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sIHNbMV0sLXNbMl0sICAgc1swXSwgc1sxXSwtc1syXSBdOyAgXHJcbiAgICAgICAgIFxyXG4gIG1lc2gubm9ybWFscyA9IFxyXG4gICAgICBbICAwLCAwLCAxLCAgIDAsIDAsIDEsICAgMCwgMCwgMSwgICAwLCAwLCAxLCAgICAgXHJcbiAgICAgICAgIDEsIDAsIDAsICAgMSwgMCwgMCwgICAxLCAwLCAwLCAgIDEsIDAsIDAsICAgICBcclxuICAgICAgICAgMCwgMSwgMCwgICAwLCAxLCAwLCAgIDAsIDEsIDAsICAgMCwgMSwgMCwgICAgIFxyXG4gICAgICAgIC0xLCAwLCAwLCAgLTEsIDAsIDAsICAtMSwgMCwgMCwgIC0xLCAwLCAwLCAgICAgXHJcbiAgICAgICAgIDAsLTEsIDAsICAgMCwtMSwgMCwgICAwLC0xLCAwLCAgIDAsLTEsIDAsICAgICBcclxuICAgICAgICAgMCwgMCwtMSwgICAwLCAwLC0xLCAgIDAsIDAsLTEsICAgMCwgMCwtMSBdOyAgIFxyXG5cclxuICBtZXNoLnRleENvb3JkcyA9IFxyXG4gICAgICBbICAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAxLCAwLCAgICBcclxuICAgICAgICAgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgMSwgMSwgICAgXHJcbiAgICAgICAgIDEsIDAsICAgMSwgMSwgICAwLCAxLCAgIDAsIDAsICAgIFxyXG4gICAgICAgICAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAxLCAwLCAgICBcclxuICAgICAgICAgMCwgMCwgICAxLCAwLCAgIDEsIDEsICAgMCwgMSwgICAgXHJcbiAgICAgICAgIDAsIDAsICAgMSwgMCwgICAxLCAxLCAgIDAsIDEgXTsgIFxyXG5cclxuICBtZXNoLmluZGljZXMgPSBcclxuICAgICAgWyAgMCwgMSwgMiwgICAwLCAyLCAzLCAgIFxyXG4gICAgICAgICA0LCA1LCA2LCAgIDQsIDYsIDcsICAgXHJcbiAgICAgICAgIDgsIDksMTAsICAgOCwxMCwxMSwgICBcclxuICAgICAgICAxMiwxMywxNCwgIDEyLDE0LDE1LCAgIFxyXG4gICAgICAgIDE2LDE3LDE4LCAgMTYsMTgsMTksICAgXHJcbiAgICAgICAgMjAsMjEsMjIsICAyMCwyMiwyMyBdOyBcclxuXHJcbiAgbWVzaC5sb2FkZWQgPSB0cnVlO1xyXG4gIHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2guc3BoZXJlID0gZnVuY3Rpb24gKHJhZGl1cywgbkxhdGl0dWRlLCBuTG9uZ2l0dWRlKSB7XHJcbiAgXHJcbiAgdmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcbiAgXHJcbiAgdmFyIG5QaXRjaCA9IG5Mb25naXR1ZGUgKyAxO1xyXG4gIFxyXG4gIHZhciBwaXRjaEluYyA9IHJnbS5yYWRpYW5zKDE4MC4wIC8gblBpdGNoKTtcclxuICB2YXIgcm90SW5jICAgPSByZ20ucmFkaWFucygzNjAuMCAvIG5MYXRpdHVkZSk7XHJcbiBcclxuICAvLyBwb2xlc1xyXG4gIG1lc2guYWRkVmVydGV4KHJnbS52ZWMzKDAsIDAsIHJhZGl1cyksIHJnbS52ZWMzKDAsIDAsIDEpLCByZ20udmVjMigwLjUsIDApLCByZ20udmVjMygwLCAxLCAwKSk7IC8vIHRvcCB2ZXJ0ZXhcclxuICBtZXNoLmFkZFZlcnRleChyZ20udmVjMygwLCAwLCAtcmFkaXVzKSwgcmdtLnZlYzMoMCwgMCwgLTEpLCByZ20udmVjMigwLjUsIDEpLCByZ20udmVjMygwLCAxLCAwKSk7IC8vIGJvdHRvbSB2ZXJ0ZXhcclxuICAgXHJcbiAgLy8gYm9keSB2ZXJ0aWNlc1xyXG4gIHZhciB0d29QaSA9IE1hdGguUEkgKiAyLjA7XHJcbiAgZm9yICh2YXIgcCA9IDE7IHAgPCBuUGl0Y2g7IHArKykgeyAgICBcclxuICAgIHZhciBvdXQgPSBNYXRoLmFicyhyYWRpdXMgKiBNYXRoLnNpbihwICogcGl0Y2hJbmMpKTsgICAgXHJcbiAgICB2YXIgeiAgID0gcmFkaXVzICogTWF0aC5jb3MocCAqIHBpdGNoSW5jKTtcclxuICAgIFxyXG4gICAgZm9yKHZhciBzID0gMDsgcyA8PSBuTGF0aXR1ZGU7IHMrKykge1xyXG4gICAgICB2YXIgeCA9IG91dCAqIE1hdGguY29zKHMgKiByb3RJbmMpO1xyXG4gICAgICB2YXIgeSA9IG91dCAqIE1hdGguc2luKHMgKiByb3RJbmMpO1xyXG4gICAgICBcclxuICAgICAgdmFyIHZlYyAgPSByZ20udmVjMyh4LCB5LCB6KTtcclxuICAgICAgdmFyIG5vcm0gPSByZ20ubm9ybWFsaXplKHZlYyk7XHJcbiAgICAgIHZhciB0YyAgID0gcmdtLnZlYzIocyAvIG5MYXRpdHVkZSwgcCAvIG5QaXRjaCk7ICAgICAgXHJcbiAgICAgIHZhciB0YW5nID0gcmdtLmNyb3NzKG5vcm0sIHJnbS52ZWMzKDAsIDAsIDEpKTtcclxuICAgICAgbWVzaC5hZGRWZXJ0ZXgodmVjLCBub3JtLCB0YywgdGFuZyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8vIHBvbGFyIGNhcHNcclxuICB2YXIgb2ZmTGFzdFZlcnRzID0gMiArICgobkxhdGl0dWRlICsgMSkgKiAoblBpdGNoIC0gMikpO1xyXG4gIGZvcih2YXIgcyA9IDA7IHMgPCBuTGF0aXR1ZGU7IHMrKylcclxuICB7XHJcbiAgICBtZXNoLmFkZFRyaWFuZ2xlKDAsIDIgKyBzLCAyICsgcyArIDEpO1xyXG4gICAgbWVzaC5hZGRUcmlhbmdsZSgxLCBvZmZMYXN0VmVydHMgKyBzLCBvZmZMYXN0VmVydHMgKyBzICsgMSk7XHJcbiAgfVxyXG4gXHJcbiAgLy8gYm9keVxyXG4gIGZvcih2YXIgcCA9IDE7IHAgPCBuUGl0Y2gtMTsgcCsrKSB7XHJcbiAgICBmb3IodmFyIHMgPSAwOyBzIDwgbkxhdGl0dWRlOyBzKyspIHtcclxuICAgICAgdmFyIGEgPSAyICsgKHAtMSkgKiAobkxhdGl0dWRlICsgMSkgKyBzO1xyXG4gICAgICB2YXIgYiA9IGEgKyAxO1xyXG4gICAgICB2YXIgZCA9IDIgKyBwICogKG5MYXRpdHVkZSArIDEpICsgcztcclxuICAgICAgdmFyIGMgPSBkICsgMTtcclxuICAgICAgXHJcbiAgICAgIG1lc2guYWRkVHJpYW5nbGUoYSwgYiwgYyk7XHJcbiAgICAgIG1lc2guYWRkVHJpYW5nbGUoYywgZCwgYSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIG1lc2gubG9hZGVkID0gdHJ1ZTtcclxuICByZXR1cm4gbWVzaDtcclxufVxyXG5cclxucGt6by5NZXNoLmljb1NwaGVyZSA9IGZ1bmN0aW9uIChyYWRpdXMsIHJlY3Vyc2lvbkxldmVsKSB7XHJcbiAgdmFyIHQgPSAoMS4wICsgTWF0aC5zcXJ0KDUuMCkpIC8gMi4wO1xyXG4gIFxyXG4gIHZhciB2ZXJ0cyA9IFtcclxuICAgIHJnbS52ZWMzKC0xLCAgdCwgIDApLFxyXG4gICAgcmdtLnZlYzMoIDEsICB0LCAgMCksXHJcbiAgICByZ20udmVjMygtMSwgLXQsICAwKSxcclxuICAgIHJnbS52ZWMzKCAxLCAtdCwgIDApLFxyXG5cclxuICAgIHJnbS52ZWMzKCAwLCAtMSwgIHQpLFxyXG4gICAgcmdtLnZlYzMoIDAsICAxLCAgdCksXHJcbiAgICByZ20udmVjMyggMCwgLTEsIC10KSxcclxuICAgIHJnbS52ZWMzKCAwLCAgMSwgLXQpLFxyXG5cclxuICAgIHJnbS52ZWMzKCB0LCAgMCwgLTEpLFxyXG4gICAgcmdtLnZlYzMoIHQsICAwLCAgMSksXHJcbiAgICByZ20udmVjMygtdCwgIDAsIC0xKSxcclxuICAgIHJnbS52ZWMzKC10LCAgMCwgIDEpLFxyXG4gIF07XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmVydHNbaV0gPSBwa3pvLm5vcm1hbGl6ZSh2ZXJ0c1tpXSk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBmYWNlcyA9IFtcclxuICAgIFswLCAxMSwgNV0sXHJcbiAgICBbMCwgNSwgMV0sXHJcbiAgICBbMCwgMSwgN10sXHJcbiAgICBbMCwgNywgMTBdLFxyXG4gICAgWzAsIDEwLCAxMV0sXHJcblxyXG4gICAgWzEsIDUsIDldLFxyXG4gICAgWzUsIDExLCA0XSxcclxuICAgIFsxMSwgMTAsIDJdLFxyXG4gICAgWzEwLCA3LCA2XSxcclxuICAgIFs3LCAxLCA4XSxcclxuXHJcbiAgICBbMywgOSwgNF0sXHJcbiAgICBbMywgNCwgMl0sXHJcbiAgICBbMywgMiwgNl0sXHJcbiAgICBbMywgNiwgOF0sXHJcbiAgICBbMywgOCwgOV0sXHJcblxyXG4gICAgWzQsIDksIDVdLFxyXG4gICAgWzIsIDQsIDExXSxcclxuICAgIFs2LCAyLCAxMF0sXHJcbiAgICBbOCwgNiwgN10sXHJcbiAgICBbOSwgOCwgMV0sICBcclxuICBdO1xyXG4gIFxyXG4gIHZhciBtaWRwb2ludENhY2hlID0gW107ICBcclxuICBcclxuICB2YXIgYWRkTWlkcG9pbnRDYWNoZSA9IGZ1bmN0aW9uIChwMSwgcDIsIGkpIHtcclxuICAgIG1pZHBvaW50Q2FjaGUucHVzaCh7cDE6IHAxLCBwMjogcDIsIGk6IGl9KTtcclxuICB9XHJcbiAgdmFyIGdldE1pZHBvaW50Q2FjaGUgPSBmdW5jdGlvbiAocDEsIHAyKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1pZHBvaW50Q2FjaGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKG1pZHBvaW50Q2FjaGUucDEgPT0gcDEgJiYgbWlkcG9pbnRDYWNoZS5wMiA9PSBwMikge1xyXG4gICAgICAgIHJldHVybiBtaWRwb2ludENhY2hlLmk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuICBcclxuICB2YXIgbWlkcG9pbnQgPSBmdW5jdGlvbiAocDEsIHAyKSB7XHJcbiAgICB2YXIgc2kgPSBwMSA8IHAyID8gcDEgOiBwMjtcclxuICAgIHZhciBnaSA9IHAxIDwgcDIgPyBwMiA6IHAxO1xyXG4gICAgXHJcbiAgICB2YXIgY2kgPSBnZXRNaWRwb2ludENhY2hlKHNpLCBnaSk7XHJcbiAgICBpZiAoY2kgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgcmV0dXJuIGNpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwb2ludDEgPSB2ZXJ0c1twMV07XHJcbiAgICB2YXIgcG9pbnQyID0gdmVydHNbcDJdO1xyXG4gICAgdmFyIG1pZGRsZSA9IHBrem8ubm9ybWFsaXplKHBrem8uYWRkKHBvaW50MSwgcG9pbnQyKSk7XHJcbiAgICBcclxuICAgIHZlcnRzLnB1c2gobWlkZGxlKTtcclxuICAgIHZhciBpID0gdmVydHMubGVuZ3RoIC0gMTsgXHJcbiAgICBcclxuICAgIGFkZE1pZHBvaW50Q2FjaGUoc2ksIGdpLCBpKTtcclxuICAgIHJldHVybiBpO1xyXG4gIH1cclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJlY3Vyc2lvbkxldmVsOyBpKyspXHJcbiAge1xyXG4gICAgdmFyIGZhY2VzMiA9IFtdO1xyXG4gICAgZmFjZXMuZm9yRWFjaChmdW5jdGlvbiAoZmFjZSkge1xyXG4gICAgICB2YXIgYSA9IG1pZHBvaW50KGZhY2VbMF0sIGZhY2VbMV0pO1xyXG4gICAgICB2YXIgYiA9IG1pZHBvaW50KGZhY2VbMV0sIGZhY2VbMl0pO1xyXG4gICAgICB2YXIgYyA9IG1pZHBvaW50KGZhY2VbMl0sIGZhY2VbMF0pO1xyXG5cclxuICAgICAgZmFjZXMyLnB1c2goW2ZhY2VbMF0sIGEsIGNdKTtcclxuICAgICAgZmFjZXMyLnB1c2goW2ZhY2VbMV0sIGIsIGFdKTtcclxuICAgICAgZmFjZXMyLnB1c2goW2ZhY2VbMl0sIGMsIGJdKTtcclxuICAgICAgZmFjZXMyLnB1c2goW2EsIGIsIGNdKTtcclxuICAgIH0pO1xyXG4gICAgZmFjZXMgPSBmYWNlczI7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBtZXNoID0gbmV3IHBrem8uTWVzaCgpO1xyXG4gIFxyXG4gIHZhciB0d29QaSA9IE1hdGguUEkgKiAyLjA7XHJcbiAgdmVydHMuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgdmFyIHZlcnRleCAgID0gcGt6by5zdm11bHQodiwgcmFkaXVzKTtcclxuICAgIHZhciBub3JtYWwgICA9IHY7ICAgICBcclxuICAgIHZhciB0ZXhDb29yZCA9IHJnbS52ZWMyKE1hdGguYXRhbih2WzFdL3ZbMF0pIC8gdHdvUGksIE1hdGguYWNvcyh2WzJdKSAvIHR3b1BpKTtcclxuICAgIHZhciB0YW5nZW50ICA9IHBrem8uY3Jvc3Mobm9ybWFsLCByZ20udmVjMygwLCAwLCAxKSk7XHJcbiAgICBtZXNoLmFkZFZlcnRleCh2ZXJ0ZXgsIG5vcm1hbCwgdGV4Q29vcmQsIHRhbmdlbnQpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIGZhY2VzLmZvckVhY2goZnVuY3Rpb24gKGZhY2UpIHtcclxuICAgIG1lc2guYWRkVHJpYW5nbGUoZmFjZVswXSwgZmFjZVsxXSwgZmFjZVsyXSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgbWVzaC5sb2FkZWQgPSB0cnVlO1xyXG4gIHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLmFkZFZlcnRleCA9IGZ1bmN0aW9uICh2ZXJ0ZXgsIG5vcm1hbCwgdGV4Q29vcmQsIHRhbmdlbnQpIHtcclxuICBpZiAodGhpcy52ZXJ0aWNlcykge1xyXG4gICAgdGhpcy52ZXJ0aWNlcy5wdXNoKHZlcnRleFswXSwgdmVydGV4WzFdLCB2ZXJ0ZXhbMl0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudmVydGljZXMgPSBbdmVydGV4WzBdLCB2ZXJ0ZXhbMV0sIHZlcnRleFsyXV07XHJcbiAgfVxyXG4gIFxyXG4gIGlmICh0aGlzLm5vcm1hbHMpIHtcclxuICAgIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbFswXSwgbm9ybWFsWzFdLCBub3JtYWxbMl0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMubm9ybWFscyA9IFtub3JtYWxbMF0sIG5vcm1hbFsxXSwgbm9ybWFsWzJdXTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKHRoaXMudGV4Q29vcmRzKSB7XHJcbiAgICB0aGlzLnRleENvb3Jkcy5wdXNoKHRleENvb3JkWzBdLCB0ZXhDb29yZFsxXSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy50ZXhDb29yZHMgPSBbdGV4Q29vcmRbMF0sIHRleENvb3JkWzFdXTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKHRhbmdlbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHRoaXMudGFuZ2VudHMpIHtcclxuICAgICAgdGhpcy50YW5nZW50cy5wdXNoKHRhbmdlbnRbMF0sIHRhbmdlbnRbMV0sIHRhbmdlbnRbMl0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMudGFuZ2VudHMgPSBbdGFuZ2VudFswXSwgdGFuZ2VudFsxXSwgdGFuZ2VudFsyXV07XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLmdldFZlcnRleCA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgcmV0dXJuIHJnbS52ZWMzKHRoaXMudmVydGljZXNbaSAqIDNdLCB0aGlzLnZlcnRpY2VzW2kgKiAzICsgMV0sIHRoaXMudmVydGljZXNbaSAqIDMgKyAyXSk7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuZ2V0Tm9ybWFsID0gZnVuY3Rpb24gKGkpIHtcclxuICByZXR1cm4gcmdtLnZlYzModGhpcy5ub3JtYWxzW2kgKiAzXSwgdGhpcy5ub3JtYWxzW2kgKiAzICsgMV0sIHRoaXMubm9ybWFsc1tpICogMyArIDJdKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5nZXRUZXhDb29yZCA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgcmV0dXJuIHJnbS52ZWMyKHRoaXMudGV4Q29vcmRzW2kgKiAyXSwgdGhpcy50ZXhDb29yZHNbaSAqIDIgKyAxXSk7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuYWRkVHJpYW5nbGUgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gIGlmICh0aGlzLmluZGljZXMpIHtcclxuICAgIHRoaXMuaW5kaWNlcy5wdXNoKGEsIGIsIGMpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuaW5kaWNlcyA9IFthLCBiLCBjXTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUudXBsb2FkID0gZnVuY3Rpb24gKGdsKSB7XHJcbiAgXHJcbiAgaWYgKCF0aGlzLnRhbmdlbnRzKSB7XHJcbiAgICB0aGlzLmNvbXB1dGVUYW5nZW50cygpO1xyXG4gIH1cclxuICBcclxuICB0aGlzLnZlcnRleEJ1ZmZlciAgID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLnZlcnRpY2VzLCAgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7XHJcbiAgdGhpcy5ub3JtYWxCdWZmZXIgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy5ub3JtYWxzLCAgIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpOyAgICAgIFxyXG4gIHRoaXMudGV4Q29vcmRCdWZmZXIgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMudGV4Q29vcmRzLCBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTtcclxuICB0aGlzLnRhbmdlbnRzQnVmZmVyID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLnRhbmdlbnRzLCAgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7XHJcbiAgdGhpcy5pbmRleEJ1ZmZlciAgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy5pbmRpY2VzLCAgIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBnbC5VTlNJR05FRF9TSE9SVCk7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGdsLCBzaGFkZXIpIHtcclxuICBpZiAodGhpcy5sb2FkZWQpIHsgIFxyXG4gICAgaWYgKCF0aGlzLnZlcnRleEJ1ZmZlcikge1xyXG4gICAgICB0aGlzLnVwbG9hZChnbCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhVmVydGV4XCIsICAgdGhpcy52ZXJ0ZXhCdWZmZXIsICAgMyk7XHJcbiAgICBzaGFkZXIuc2V0QXJydGlidXRlKFwiYU5vcm1hbFwiLCAgIHRoaXMubm9ybWFsQnVmZmVyLCAgIDMpO1xyXG4gICAgc2hhZGVyLnNldEFycnRpYnV0ZShcImFUZXhDb29yZFwiLCB0aGlzLnRleENvb3JkQnVmZmVyLCAyKTtcclxuICAgIHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhVGFuZ2VudFwiLCAgdGhpcy50YW5nZW50c0J1ZmZlciwgMyk7XHJcbiAgICAgICAgXHJcbiAgICB0aGlzLmluZGV4QnVmZmVyLmRyYXcoZ2wuVFJJQU5HTEVTKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnZlcnRleEJ1ZmZlci5yZWxlYXNlKCk7ICAgXHJcbiAgZGVsZXRlIHRoaXMudmVydGV4QnVmZmVyO1xyXG4gIFxyXG4gIHRoaXMubm9ybWFsQnVmZmVyLnJlbGVhc2UoKTsgICBcclxuICBkZWxldGUgdGhpcy5ub3JtYWxCdWZmZXI7ICBcclxuICBcclxuICB0aGlzLnRleENvb3JkQnVmZmVyLnJlbGVhc2UoKTsgXHJcbiAgZGVsZXRlIHRoaXMudGV4Q29vcmRCdWZmZXI7XHJcbiAgXHJcbiAgdGhpcy5pbmRleEJ1ZmZlci5yZWxlYXNlKCk7XHJcbiAgZGVsZXRlIHRoaXMuaW5kZXhCdWZmZXI7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuY29tcHV0ZVRhbmdlbnRzID0gZnVuY3Rpb24gKCkgeyAgICBcclxuICB2YXIgdmVydGV4Q291bnQgPSB0aGlzLnZlcnRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgdmFyIGZhY2VDb3VudCAgID0gdGhpcy5pbmRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgXHJcbiAgdmFyIHRhbjEgPSBuZXcgQXJyYXkodmVydGV4Q291bnQpOyAgICBcclxuICB2YXIgdGFuMiA9IG5ldyBBcnJheSh2ZXJ0ZXhDb3VudCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgaSsrKSB7XHJcbiAgICB0YW4xW2ldID0gcmdtLnZlYzMoMCk7XHJcbiAgICB0YW4yW2ldID0gcmdtLnZlYzMoMCk7XHJcbiAgfVxyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmFjZUNvdW50OyBpKyspIHtcclxuICAgIHZhciBhID0gdGhpcy5pbmRpY2VzW2kgKiAzXTtcclxuICAgIHZhciBiID0gdGhpcy5pbmRpY2VzW2kgKiAzICsgMV07XHJcbiAgICB2YXIgYyA9IHRoaXMuaW5kaWNlc1tpICogMyArIDJdO1xyXG4gICAgXHJcbiAgICB2YXIgdjEgPSB0aGlzLmdldFZlcnRleChhKTtcclxuICAgIHZhciB2MiA9IHRoaXMuZ2V0VmVydGV4KGIpO1xyXG4gICAgdmFyIHYzID0gdGhpcy5nZXRWZXJ0ZXgoYyk7XHJcbiAgICBcclxuICAgIHZhciB3MSA9IHRoaXMuZ2V0VGV4Q29vcmQoYSk7XHJcbiAgICB2YXIgdzIgPSB0aGlzLmdldFRleENvb3JkKGIpO1xyXG4gICAgdmFyIHczID0gdGhpcy5nZXRUZXhDb29yZChjKTtcclxuICAgIFxyXG4gICAgdmFyIHgxID0gdjJbMF0gLSB2MVswXTtcclxuICAgIHZhciB4MiA9IHYzWzBdIC0gdjFbMF07XHJcbiAgICB2YXIgeTEgPSB2MlsxXSAtIHYxWzFdO1xyXG4gICAgdmFyIHkyID0gdjNbMV0gLSB2MVsxXTtcclxuICAgIHZhciB6MSA9IHYyWzJdIC0gdjFbMl07XHJcbiAgICB2YXIgejIgPSB2M1syXSAtIHYxWzJdO1xyXG5cclxuICAgIHZhciBzMSA9IHcyWzBdIC0gdzFbMF07XHJcbiAgICB2YXIgczIgPSB3M1swXSAtIHcxWzBdO1xyXG4gICAgdmFyIHQxID0gdzJbMV0gLSB3MVsxXTtcclxuICAgIHZhciB0MiA9IHczWzFdIC0gdzFbMV07XHJcblxyXG4gICAgdmFyIHIgPSAxLjAgLyAoczEgKiB0MiAtIHMyICogdDEpO1xyXG4gICAgdmFyIHNkaXIgPSByZ20udmVjMygodDIgKiB4MSAtIHQxICogeDIpICogciwgICh0MiAqIHkxIC0gdDEgKiB5MikgKiByLCh0MiAqIHoxIC0gdDEgKiB6MikgKiByKTtcclxuICAgIHZhciB0ZGlyID0gcmdtLnZlYzMoKHMxICogeDIgLSBzMiAqIHgxKSAqIHIsIChzMSAqIHkyIC0gczIgKiB5MSkgKiByLCAoczEgKiB6MiAtIHMyICogejEpICogcik7XHJcblxyXG4gICAgdGFuMVthXSA9IHJnbS5hZGQodGFuMVthXSwgc2Rpcik7XHJcbiAgICB0YW4xW2JdID0gcmdtLmFkZCh0YW4xW2JdLCBzZGlyKTtcclxuICAgIHRhbjFbY10gPSByZ20uYWRkKHRhbjFbY10sIHNkaXIpO1xyXG5cclxuICAgIHRhbjJbYV0gPSByZ20uYWRkKHRhbjJbYV0sIHRkaXIpO1xyXG4gICAgdGFuMltiXSA9IHJnbS5hZGQodGFuMltiXSwgdGRpcik7XHJcbiAgICB0YW4yW2NdID0gcmdtLmFkZCh0YW4yW2NdLCB0ZGlyKTtcclxuICB9XHJcbiAgICBcclxuICB0aGlzLnRhbmdlbnRzID0gW107XHJcbiAgZm9yICh2YXIgaiA9IDA7IGogPCB2ZXJ0ZXhDb3VudDsgaisrKSB7XHJcbiAgICB2YXIgbiA9IHRoaXMuZ2V0Tm9ybWFsKGopO1xyXG4gICAgdmFyIHQgPSB0YW4xW2pdO1xyXG4gICAgXHJcbiAgICB2YXIgdG4gPSByZ20ubm9ybWFsaXplKHJnbS52c211bHQocmdtLnN1Yih0LCBuKSwgcmdtLmRvdChuLCB0KSkpO1xyXG4gICAgXHJcbiAgICBpZiAocmdtLmRvdChyZ20uY3Jvc3MobiwgdCksIHRhbjJbal0pIDwgMC4wKSB7XHJcbiAgICAgIHRoaXMudGFuZ2VudHMucHVzaCgtdG5bMF0sIC10blsxXSwgLXRuWzJdKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnRhbmdlbnRzLnB1c2godG5bMF0sIHRuWzFdLCB0blsyXSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIlxyXG5wa3pvLk1hdGVyaWFsID0gZnVuY3Rpb24gKG9wdHMpIHtcdFxyXG4gIHRoaXMuYWxiZWRvICAgICAgICA9IHJnbS52ZWMzKDEsIDEsIDEpO1xyXG4gIHRoaXMucm91Z2huZXNzICAgICA9IDE7XHJcbiAgdGhpcy5tZXRhbCAgICAgICAgID0gMDtcclxuICB0aGlzLmVtaXNzaXZlQ29sb3IgPSByZ20udmVjMygwLCAwLCAwKTtcclxuICBcclxuICBpZiAob3B0cykge1xyXG4gICAgdGhpcy5yZWFkKG9wdHMpO1xyXG4gIH1cdFxyXG59XHJcblxyXG5wa3pvLk1hdGVyaWFsLmxvYWQgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgdmFyIG1hdGVyaWFsID0gbmV3IHBrem8uTWF0ZXJpYWwoKTtcclxuICBodHRwLmdldCh1cmwsIGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuICAgIGlmIChzdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgIG1hdGVyaWFsLnJlYWQoSlNPTi5wYXJzZShkYXRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgbWF0ZXJpYWwgJXMuJywgdXJsKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gbWF0ZXJpYWw7XHJcbn1cclxuXHJcbnBrem8uTWF0ZXJpYWwucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIGlmIChkYXRhLmFsYmVkbykge1xyXG4gICAgdGhpcy5hbGJlZG8gPSBkYXRhLmFsYmVkbztcclxuICB9XHJcbiAgXHJcbiAgaWYgKGRhdGEudGV4dHVyZSkge1xyXG4gICAgLy8gUkVWSUVXOiBzaG91bGQgdGhlIHRleHR1cmVzIG5vdCBiZSByZWxhdGl2ZSB0byB0aGUgY3VycmVudCBmaWxlP1xyXG4gICAgLy8gLT4gVXNlIHNvbWV0aGluZyBsaWtlIFwiYmFzZSBwYXRoXCIgdG8gZml4IHRoYXQsIHRoZW4gdGhlIGxvYWQgZnVuY3Rpb25cclxuICAgIC8vIHdpbGwgZXh0cmFjdCBpdCBhbmQgcGFzcyBpdCBhbGxvbmcuXHJcbiAgICB0aGlzLnRleHR1cmUgPSBwa3pvLlRleHR1cmUubG9hZChkYXRhLnRleHR1cmUpO1xyXG4gIH1cclxuICBcclxuICBpZiAoZGF0YS5yb3VnaG5lc3MpIHtcclxuICAgIHRoaXMucm91Z2huZXNzID0gZGF0YS5yb3VnaG5lc3M7XHJcbiAgfSAgXHJcbiAgaWYgKGRhdGEucm91Z2huZXNzTWFwKSB7XHJcbiAgICB0aGlzLnJvdWdobmVzc01hcCA9IHBrem8uVGV4dHVyZS5sb2FkKGRhdGEucm91Z2huZXNzTWFwKTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGRhdGEubWV0YWwpIHtcclxuICAgIHRoaXMubWV0YWwgPSBkYXRhLm1ldGFsO1xyXG4gIH0gIFxyXG4gIGlmIChkYXRhLm1ldGFsTWFwKSB7XHJcbiAgICB0aGlzLm1ldGFsTWFwID0gcGt6by5UZXh0dXJlLmxvYWQoZGF0YS5tZXRhbE1hcCk7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChkYXRhLm5vcm1hbE1hcCkge1xyXG4gICAgdGhpcy5ub3JtYWxNYXAgPSBwa3pvLlRleHR1cmUubG9hZChkYXRhLm5vcm1hbE1hcCk7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChkYXRhLmVtaXNzaXZlQ29sb3IpIHtcclxuICAgIHRoaXMuZW1pc3NpdmVDb2xvciA9IGRhdGEuZW1pc3NpdmVDb2xvcjtcclxuICB9XHJcbiAgaWYgKGRhdGEuZW1pc3NpdmVNYXApIHtcclxuICAgIHRoaXMuZW1pc3NpdmVNYXAgPSBwa3pvLlRleHR1cmUubG9hZChkYXRhLmVtaXNzaXZlTWFwKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uTWF0ZXJpYWwucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24gKGdsLCBzaGFkZXIpIHtcclxuXHRcclxuXHRzaGFkZXIuc2V0VW5pZm9ybTNmdigndUFsYmVkbycsIHRoaXMuYWxiZWRvKTtcclxuXHRcclxuXHRpZiAodGhpcy50ZXh0dXJlICYmIHRoaXMudGV4dHVyZS5sb2FkZWQpIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNUZXh0dXJlJywgMSk7XHJcblx0XHR0aGlzLnRleHR1cmUuYmluZChnbCwgMClcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VUZXh0dXJlJywgMCk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc1RleHR1cmUnLCAwKTtcclxuXHR9XHRcclxuICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybTFmKCd1Um91Z2huZXNzJywgdGhpcy5yb3VnaG5lc3MpO1xyXG4gIGlmICh0aGlzLnJvdWdobmVzc01hcCAmJiB0aGlzLnJvdWdobmVzc01hcC5sb2FkZWQpIHtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNSb3VnaG5lc3NNYXAnLCAxKTtcclxuXHRcdHRoaXMucm91Z2huZXNzTWFwLmJpbmQoZ2wsIDEpO1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndVJvdWdobmVzc01hcCcsIDEpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNSb3VnaG5lc3NNYXAnLCAwKTtcclxuICB9XHJcbiAgXHJcbiAgc2hhZGVyLnNldFVuaWZvcm0xZigndU1ldGFsJywgdGhpcy5tZXRhbCk7XHJcbiAgaWYgKHRoaXMucm91Z2huZXNzTWFwICYmIHRoaXMubWV0YWxNYXAubG9hZGVkKSB7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzTWV0YWxNYXAnLCAxKTtcclxuXHRcdHRoaXMubWV0YWxNYXAuYmluZChnbCwgMik7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1TWV0YWxNYXAnLCAyKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzTWV0YWxNYXAnLCAwKTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKHRoaXMubm9ybWFsTWFwICYmIHRoaXMubm9ybWFsTWFwLmxvYWRlZCkge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc05vcm1hbE1hcCcsIDEpO1xyXG5cdFx0dGhpcy5ub3JtYWxNYXAuYmluZChnbCwgMyk7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1Tm9ybWFsTWFwJywgMyk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc05vcm1hbE1hcCcsIDApO1xyXG5cdH1cdFxyXG4gIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1RW1pc3NpdmVDb2xvcicsIHRoaXMuZW1pc3NpdmVDb2xvcik7XHJcbiAgXHJcbiAgaWYgKHRoaXMuZW1pc3NpdmVNYXAgJiYgdGhpcy5lbWlzc2l2ZU1hcC5sb2FkZWQpIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNFbWlzc2l2ZU1hcCcsIDEpO1xyXG5cdFx0dGhpcy5lbWlzc2l2ZU1hcC5iaW5kKGdsLCA0KTtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VFbWlzc2l2ZU1hcCcsIDQpO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNFbWlzc2l2ZU1hcCcsIDApO1xyXG5cdH1cdFxyXG59XHJcblxyXG5cclxuIiwiXHJcbnBrem8uRW50aXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudHJhbnNmb3JtID0gcmdtLm1hdDQoMSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xyXG5cdHRoaXMudHJhbnNmb3JtID0gcmdtLnRyYW5zbGF0ZSh0aGlzLnRyYW5zZm9ybSwgeCwgeSwgeik7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoYW5nbGUsIHgsIHksIHopIHtcclxuXHR0aGlzLnRyYW5zZm9ybSA9IHJnbS5yb3RhdGUodGhpcy50cmFuc2Zvcm0sIGFuZ2xlLCB4LCB5LCB6KTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFhWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHJnbS52ZWMzKHRoaXMudHJhbnNmb3JtWzBdLCB0aGlzLnRyYW5zZm9ybVsxXSwgdGhpcy50cmFuc2Zvcm1bMl0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WVZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcmdtLnZlYzModGhpcy50cmFuc2Zvcm1bNF0sIHRoaXMudHJhbnNmb3JtWzVdLCB0aGlzLnRyYW5zZm9ybVs2XSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRaVmVjdG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiByZ20udmVjMyh0aGlzLnRyYW5zZm9ybVs4XSwgdGhpcy50cmFuc2Zvcm1bOV0sIHRoaXMudHJhbnNmb3JtWzEwXSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gcmdtLnZlYzModGhpcy50cmFuc2Zvcm1bMTJdLCB0aGlzLnRyYW5zZm9ybVsxM10sIHRoaXMudHJhbnNmb3JtWzE0XSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRXb3JsZFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgLy8gVE9ETyBwYXJlbnQgcm90YXRpb25cclxuICAgIHJldHVybiByZ20uYWRkKHRoaXMucGFyZW50LmdldFdvcmxkUG9zaXRpb24oKSwgdGhpcy5nZXRQb3NpdGlvbigpKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRQb3NpdGlvbigpO1xyXG4gIH0gIFxyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICB0aGlzLnRyYW5zZm9ybVsxMl0gPSB2YWx1ZVswXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxM10gPSB2YWx1ZVsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxNF0gPSB2YWx1ZVsyXTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uICh0YXJnZXQsIHVwKSB7XHJcbiAgdmFyIHBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbigpO1xyXG4gIHZhciBmb3J3YXJkICA9IHJnbS5ub3JtYWxpemUocmdtLnN1Yih0YXJnZXQsIHBvc2l0aW9uKSk7XHJcbiAgdmFyIHJpZ2h0ICAgID0gcmdtLm5vcm1hbGl6ZShyZ20uY3Jvc3MoZm9yd2FyZCwgdXApKTtcclxuICB2YXIgdXBuICAgICAgPSByZ20ubm9ybWFsaXplKHJnbS5jcm9zcyhyaWdodCwgZm9yd2FyZCkpO1xyXG4gIFxyXG4gIC8vIFRPRE8gc2NhbGluZ1xyXG4gIHRoaXMudHJhbnNmb3JtWzBdID0gcmlnaHRbMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMV0gPSByaWdodFsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsyXSA9IHJpZ2h0WzJdO1xyXG4gIFxyXG4gIHRoaXMudHJhbnNmb3JtWzRdID0gdXBuWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzVdID0gdXBuWzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzZdID0gdXBuWzJdO1xyXG4gIFxyXG4gIHRoaXMudHJhbnNmb3JtWzhdID0gZm9yd2FyZFswXTtcclxuICB0aGlzLnRyYW5zZm9ybVs5XSA9IGZvcndhcmRbMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMTBdID0gZm9yd2FyZFsyXTtcclxufVxyXG4iLCJcclxucGt6by5DYW1lcmEgPSBmdW5jdGlvbiAob3B0KSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuICBcclxuICB2YXIgbyA9IG9wdCA/IG9wdCA6IHt9O1xyXG4gIFxyXG4gIHRoaXMueWZvdiAgPSBvLnlmb3YgID8gby55Zm92ICA6ICA0NS4wO1xyXG4gIHRoaXMuem5lYXIgPSBvLnpuZWFyID8gby56bmVhciA6ICAgMC4xO1xyXG4gIHRoaXMuemZhciAgPSBvLnpmYXIgID8gby56ZmFyICA6IDEwMC4wO1xyXG59XHJcblxyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uQ2FtZXJhLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uQ2FtZXJhO1xyXG5cclxucGt6by5DYW1lcmEucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuICB2YXIgYXNwZWN0ID0gcmVuZGVyZXIuY2FudmFzLmdsLndpZHRoIC8gcmVuZGVyZXIuY2FudmFzLmdsLmhlaWdodDtcclxuICBcclxuICB2YXIgcHJvamVjdGlvbk1hdHJpeCA9IHJnbS5wZXJzcGVjdGl2ZSh0aGlzLnlmb3YsIGFzcGVjdCwgdGhpcy56bmVhciwgdGhpcy56ZmFyKTtcclxuICBcclxuICB2YXIgcCA9IHRoaXMuZ2V0UG9zaXRpb24oKTtcclxuICB2YXIgeCA9IHRoaXMuZ2V0WFZlY3RvcigpO1xyXG4gIHZhciB5ID0gdGhpcy5nZXRZVmVjdG9yKCk7XHJcbiAgdmFyIHogPSB0aGlzLmdldFpWZWN0b3IoKTtcclxuICBcclxuICB2YXIgdmlld01hdHJpeCA9IHJnbS5tYXQ0KFt4WzBdLCB4WzFdLCB4WzJdLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlbMF0sIHlbMV0sIHlbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgelswXSwgelsxXSwgelsyXSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAgICAwLCAgICAwLCAxXSk7XHJcbiAgdmlld01hdHJpeCA9IHJnbS50cmFuc3Bvc2Uodmlld01hdHJpeCk7IC8vIHVzZSBpbnZlcnNlXHJcbiAgdmlld01hdHJpeCA9IHJnbS50cmFuc2xhdGUodmlld01hdHJpeCwgLXBbMF0sIC1wWzFdLCAtcFsyXSk7ICBcclxuICBcclxuICByZW5kZXJlci5zZXRDYW1lcmEocHJvamVjdGlvbk1hdHJpeCwgdmlld01hdHJpeCk7XHJcbn1cclxuIiwiXHJcbnBrem8uT2JqZWN0ID0gZnVuY3Rpb24gKG1lc2gsIG1hdGVyaWFsKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuICBcclxuICB0aGlzLm1lc2ggICAgID0gbWVzaDtcclxuICB0aGlzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcbn1cclxuXHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5PYmplY3Q7XHJcblxyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdC8vIHRvZG8gcmVzcGVjdCBwYXJlbnQgdHJhbnNmb3JtXHJcblx0cmVuZGVyZXIuYWRkTWVzaCh0aGlzLnRyYW5zZm9ybSwgdGhpcy5tYXRlcmlhbCwgdGhpcy5tZXNoKTtcclxufVxyXG5cclxucGt6by5PYmplY3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoZ2wsIHNoYWRlciwgcGFyZW50TW9kZWxWaWV3TWF0cml4KSB7IFxyXG4gIFxyXG4gIHZhciBtb2RlbFZpZXdNYXRyaXggPSBwa3pvLm11bHRNYXRyaXgocGFyZW50TW9kZWxWaWV3TWF0cml4LCB0aGlzLnRyYW5zZm9ybSk7XHJcbiAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VNb2RlbFZpZXdNYXRyaXgnLCBtb2RlbFZpZXdNYXRyaXgpO1xyXG5cdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxNYXRyaXgnLCB0aGlzLnRyYW5zZm9ybSk7XHJcbiAgXHJcbiAgdGhpcy5tYXRlcmlhbC5zZXR1cChnbCwgc2hhZGVyKTtcclxuICB0aGlzLm1lc2guZHJhdyhnbCwgc2hhZGVyKTtcclxufVxyXG5cclxuIiwiXHJcbnBrem8uRGlyZWN0aW9uYWxMaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSByZ20udmVjMygwLjUsIDAuNSwgMC41KTtcclxufVxyXG5cclxucGt6by5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uRGlyZWN0aW9uYWxMaWdodDtcclxuXHJcbnBrem8uRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdHZhciBkaXIgPSByZ20ubmVnKHRoaXMuZ2V0WlZlY3RvcigpKTtcclxuXHRyZW5kZXJlci5hZGREaXJlY3Rpb25hbExpZ2h0KGRpciwgdGhpcy5jb2xvcik7XHJcbn1cclxuIiwiXHJcbnBrem8uUG9pbnRMaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSByZ20udmVjMygwLjUsIDAuNSwgMC41KTtcclxuICB0aGlzLnJhbmdlID0gMTAuMDtcclxufVxyXG5cclxucGt6by5Qb2ludExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5Qb2ludExpZ2h0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uUG9pbnRMaWdodDtcclxuXHJcbnBrem8uUG9pbnRMaWdodC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdHJlbmRlcmVyLmFkZFBvaW50TGlnaHQodGhpcy5nZXRQb3NpdGlvbigpLCB0aGlzLmNvbG9yLCB0aGlzLnJhbmdlKTtcclxufVxyXG4iLCJcclxucGt6by5TcG90TGlnaHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuXHRcclxuXHR0aGlzLmNvbG9yICA9IHJnbS52ZWMzKDAuNSwgMC41LCAwLjUpO1xyXG4gIHRoaXMucmFuZ2UgID0gMTAuMDtcclxuICB0aGlzLmN1dG9mZiA9IDI1LjA7XHJcbn1cclxuXHJcbnBrem8uU3BvdExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5TcG90TGlnaHQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5TcG90TGlnaHQ7XHJcblxyXG5wa3pvLlNwb3RMaWdodC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG4gIHZhciBkaXIgPSByZ20ubmVnKHRoaXMuZ2V0WlZlY3RvcigpKTtcclxuXHRyZW5kZXJlci5hZGRTcG90TGlnaHQodGhpcy5nZXRQb3NpdGlvbigpLCBkaXIsIHRoaXMuY29sb3IsIHRoaXMucmFuZ2UsIHRoaXMuY3V0b2ZmKTtcclxufVxyXG4iLCJcclxucGt6by5Ta3lCb3ggPSBmdW5jdGlvbiAoY3ViZU1hcCkge1xyXG4gIHBrem8uRW50aXR5LmNhbGwodGhpcyk7XHJcbiAgXHJcbiAgdGhpcy5jdWJlTWFwID0gY3ViZU1hcDtcclxufVxyXG5cclxucGt6by5Ta3lCb3gucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLlNreUJveC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLlNreUJveDtcclxuXHJcbnBrem8uU2t5Qm94LnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcbiAgaWYgKHRoaXMuY3ViZU1hcC5sb2FkZWQpIHtcclxuICAgIHJlbmRlcmVyLmFkZFNreUJveCh0aGlzLmN1YmVNYXApO1xyXG4gIH1cclxufVxyXG5cclxuIiwiXHJcbnBrem8uRW50aXR5R3JvdXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTsgICAgXHJcbn1cclxuXHJcbnBrem8uRW50aXR5R3JvdXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLkVudGl0eUdyb3VwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uRW50aXR5R3JvdXA7XHJcblxyXG5wa3pvLkVudGl0eUdyb3VwLmFkZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gIGlmICh0aGlzLmNoaWxkcmVuKSB7XHJcbiAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmNoaWxkcmVuID0gW2NoaWxkXTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uRW50aXR5R3JvdXAucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuICBpZiAodGhpcy5jaGlsZHJlbikge1xyXG4gICAgdGhpcy5jaGlsZHJlYW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgY2hpbGQuZW5xdWV1ZShyZW5kZXJlcik7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbiIsIlxyXG5wa3pvLlBhcnRpY2xlID0gZnVuY3Rpb24gKG9wdHMpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpOyAgICBcclxuICBcclxuICBmb3IgKHZhciBhIGluIG9wdHMpIHsgXHJcbiAgICB0aGlzW2FdID0gb3B0c1thXTsgXHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlBhcnRpY2xlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5QYXJ0aWNsZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLlBhcnRpY2xlO1xyXG5cclxucGt6by5QYXJ0aWNsZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG4gIGlmICh0aGlzLnRleHR1cmUubG9hZGVkKSB7XHJcbiAgICByZW5kZXJlci5hZGRQYXJ0aWNsZSh0aGlzLmdldFdvcmxkUG9zaXRpb24oKSwgdGhpcy5zaXplLCB0aGlzLnRleHR1cmUsIHRoaXMuY29sb3IsIHRoaXMudHJhbnNwYXJlbmN5KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5QYXJ0aWNsZVN5c3RlbSA9IGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTsgXHJcblxyXG4gIGZvciAodmFyIGEgaW4gb3B0cykgeyBcclxuICAgIHRoaXNbYV0gPSBvcHRzW2FdOyBcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5sYXN0U3Bhd24gPSBEYXRlLm5vdygpO1xyXG4gIHRoaXMuc3Bhd25UaW1lID0gKHRoaXMubGlmZXRpbWUgKiAxMDAwLjApIC8gdGhpcy5jb3VudDtcclxuICBcclxuICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xyXG59XHJcblxyXG5wa3pvLlBhcnRpY2xlU3lzdGVtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5QYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLlBhcnRpY2xlU3lzdGVtO1xyXG5cclxucGt6by5QYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICBcclxuICBpZiAobm93ID4gdGhpcy5sYXN0U3Bhd24gKyB0aGlzLnNwYXduVGltZSkge1xyXG4gICAgdmFyIHBhcnRpY2xlID0gbmV3IHBrem8uUGFydGljbGUoe1xyXG4gICAgICBjcmVhdGVkOiAgICAgIG5vdyxcclxuICAgICAgdGV4dHVyZTogICAgICB0aGlzLnRleHR1cmUsICAgICAgXHJcbiAgICAgIGNvbG9yOiAgICAgICAgdGhpcy5jb2xvcixcclxuICAgICAgdHJhbnNwYXJlbmN5OiB0aGlzLnRyYW5zcGFyZW5jeSxcclxuICAgICAgc2l6ZTogICAgICAgICB0aGlzLnNpemUsXHJcbiAgICAgIGxpZmV0aW1lOiAgICAgdGhpcy5saWZldGltZVxyXG4gICAgfSk7XHJcbiAgICBwYXJ0aWNsZS5wYXJlbnQgPSB0aGlzO1xyXG4gICAgaWYgKHRoaXMub25TcGF3bikge1xyXG4gICAgICB0aGlzLm9uU3Bhd24ocGFydGljbGUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wYXJ0aWNsZXMucHVzaChwYXJ0aWNsZSk7XHJcbiAgICB0aGlzLmxhc3RTcGF3biA9IG5vdztcclxuICB9XHJcbiAgXHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlIChpIDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoKSB7XHJcbiAgICB2YXIgcGFydGljbGUgPSB0aGlzLnBhcnRpY2xlc1tpXTtcclxuICAgIGlmIChub3cgPiBwYXJ0aWNsZS5jcmVhdGVkICsgKHBhcnRpY2xlLmxpZmV0aW1lICogMTAwMC4wKSkge1xyXG4gICAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaSsrO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBpZiAodGhpcy5vblVwZGF0ZSkge1xyXG4gICAgdGhpcy5wYXJ0aWNsZXMuZm9yRWFjaChmdW5jdGlvbiAocGFydGljbGUpIHsgICAgXHJcbiAgICAgIHRoaXMub25VcGRhdGUocGFydGljbGUpO1xyXG4gICAgfSwgdGhpcyk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlBhcnRpY2xlU3lzdGVtLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcbiAgLy8gVE9ETyBhY3R1YWxsIGltcGxlbWVudCBhbmltYXRlIGluIHRoZSByZW5kZXJlclxyXG4gIHRoaXMuYW5pbWF0ZSgpO1xyXG4gIFxyXG4gIHRoaXMucGFydGljbGVzLmZvckVhY2goZnVuY3Rpb24gKHBhcnRpY2xlKSB7XHJcbiAgICBwYXJ0aWNsZS5lbnF1ZXVlKHJlbmRlcmVyKTtcclxuICB9KTtcclxufVxyXG4iLCJcclxucGt6by5SZW5kZXJlciA9IGZ1bmN0aW9uIChjYW52YXMpIHtcclxuICB0aGlzLmNhbnZhcyA9IG5ldyBwa3pvLkNhbnZhcyhjYW52YXMpO1xyXG4gIFxyXG4gIHZhciByZW5kZXJlciA9IHRoaXM7XHJcbiAgXHJcbiAgdGhpcy5jYW52YXMuaW5pdChmdW5jdGlvbiAoZ2wpIHtcclxuICAgIHJlbmRlcmVyLnN5a0JveFNoYWRlciAgID0gbmV3IHBrem8uU2hhZGVyKHBrem8uSW52ZXJzZSArIHBrem8uVHJhbnNwb3NlICsgcGt6by5Ta3lCb3hWZXJ0LCBwa3pvLlNreUJveEZyYWcpO1xyXG4gICAgcmVuZGVyZXIuYW1iaWVudFNoYWRlciAgPSBuZXcgcGt6by5TaGFkZXIocGt6by5Tb2xpZFZlcnQsIHBrem8uQW1iaWVudEZyYWcpO1xyXG4gICAgcmVuZGVyZXIubGlnaHRTaGFkZXIgICAgPSBuZXcgcGt6by5TaGFkZXIocGt6by5Tb2xpZFZlcnQsIHBrem8uTGlnaHRGcmFnKTsgICBcclxuICAgIHJlbmRlcmVyLmVtaXNzaXZlU2hhZGVyID0gbmV3IHBrem8uU2hhZGVyKHBrem8uU29saWRWZXJ0LCBwa3pvLkVtaXNzaXZlRnJhZyk7XHJcbiAgICByZW5kZXJlci5wYXJ0aWNsZVNoYWRlciA9IG5ldyBwa3pvLlNoYWRlcihwa3pvLlBhcnRpY2xlVmVydCwgcGt6by5QYXJ0aWNsZUZyYWcpOyAgICBcclxuXHJcbiAgICByZW5kZXJlci5zY3JlZW5QbGFuZSAgID0gcGt6by5NZXNoLnBsYW5lKDIsIDIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5zZXRDYW1lcmEgPSBmdW5jdGlvbiAocHJvamVjdGlvbk1hdHJpeCwgdmlld01hdHJpeCkge1xyXG4gIHRoaXMucHJvamVjdGlvbk1hdHJpeCA9IHByb2plY3Rpb25NYXRyaXg7XHJcbiAgdGhpcy52aWV3TWF0cml4ICAgICAgID0gdmlld01hdHJpeDtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkTWVzaCA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0sIG1hdGVyaWFsLCBtZXNoKSB7XHJcbiAgdGhpcy5zb2xpZHMucHVzaCh7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybSxcclxuICAgIG1hdGVyaWFsOiBtYXRlcmlhbCwgXHJcbiAgICBtZXNoOiBtZXNoXHJcbiAgfSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmFkZFNreUJveCA9IGZ1bmN0aW9uIChjdWJlTWFwKSB7XHJcbiAgdGhpcy5za3lCb3ggPSBjdWJlTWFwO1xyXG59XHJcblxyXG5wa3pvLkRJUkVDVElPTkFMX0xJR0hUID0gMTtcclxucGt6by5QT0lOVF9MSUdIVCAgICAgICA9IDI7XHJcbnBrem8uU1BPVF9MSUdIVCAgICAgICAgPSAzO1xyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkRGlyZWN0aW9uYWxMaWdodCA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGNvbG9yKSB7XHJcbiAgdGhpcy5saWdodHMucHVzaCh7XHJcbiAgICB0eXBlOiBwa3pvLkRJUkVDVElPTkFMX0xJR0hULFxyXG4gICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICBjb2xvcjogY29sb3JcclxuICB9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkUG9pbnRMaWdodCA9IGZ1bmN0aW9uIChwb3NpdGlvbiwgY29sb3IsIHJhbmdlKSB7XHJcbiAgdGhpcy5saWdodHMucHVzaCh7XHJcbiAgICB0eXBlOiBwa3pvLlBPSU5UX0xJR0hULFxyXG4gICAgcG9zaXRpb246IHBvc2l0aW9uLFxyXG4gICAgY29sb3I6IGNvbG9yLFxyXG4gICAgcmFuZ2U6IHJhbmdlXHJcbiAgfSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmFkZFNwb3RMaWdodCA9IGZ1bmN0aW9uIChwb3NpdGlvbiwgZGlyZWN0aW9uLCBjb2xvciwgcmFuZ2UsIGN1dG9mZikge1xyXG4gIHRoaXMubGlnaHRzLnB1c2goe1xyXG4gICAgdHlwZTogcGt6by5TUE9UX0xJR0hULFxyXG4gICAgcG9zaXRpb246IHBvc2l0aW9uLFxyXG4gICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICBjb2xvcjogY29sb3IsXHJcbiAgICByYW5nZTogcmFuZ2UsXHJcbiAgICBjdXRvZmY6IGN1dG9mZlxyXG4gIH0pO1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5hZGRQYXJ0aWNsZSA9IGZ1bmN0aW9uIChwb3NpdGlvbiwgc2l6ZSwgdGV4dHVyZSwgY29sb3IsIHRyYW5zcGFyZW5jeSkge1xyXG4gIHRoaXMucGFydGljbGVzLnB1c2goe1xyXG4gICAgcG9zaXRpb246ICAgICBwb3NpdGlvbixcclxuICAgIHNpemU6ICAgICAgICAgc2l6ZSxcclxuICAgIHRleHR1cmU6ICAgICAgdGV4dHVyZSxcclxuICAgIGNvbG9yOiAgICAgICAgY29sb3IsXHJcbiAgICB0cmFuc3BhcmVuY3k6IHRyYW5zcGFyZW5jeVxyXG4gIH0pO1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5kcmF3U2t5Qm94ID0gZnVuY3Rpb24gKGdsKSB7XHJcbiAgaWYgKHRoaXMuc2t5Qm94KSB7XHJcbiAgICB2YXIgc2hhZGVyID0gdGhpcy5zeWtCb3hTaGFkZXI7XHJcbiAgICBcclxuICAgIHNoYWRlci5iaW5kKGdsKTtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1UHJvamVjdGlvbk1hdHJpeCcsIHRoaXMucHJvamVjdGlvbk1hdHJpeCk7ICAgXHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVZpZXdNYXRyaXgnLCAgICAgICB0aGlzLnZpZXdNYXRyaXgpO1xyXG4gICAgXHJcbiAgICB0aGlzLnNreUJveC5iaW5kKGdsLCAwKTtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VDdWJlbWFwJywgMCk7XHJcbiAgICBcclxuICAgIHRoaXMuc2NyZWVuUGxhbmUuZHJhdyhnbCwgc2hhZGVyKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmRyYXdTb2xpZHMgPSBmdW5jdGlvbiAoZ2wsIHNoYWRlcikge1xyXG4gIHRoaXMuc29saWRzLmZvckVhY2goZnVuY3Rpb24gKHNvbGlkKSB7XHJcbiAgICB2YXIgbm9ybSA9IHJnbS5tbXVsdChyZ20ubWF0Myh0aGlzLnZpZXdNYXRyaXgpLCByZ20ubWF0Myhzb2xpZC50cmFuc2Zvcm0pKTtcclxuICAgICAgICBcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxNYXRyaXgnLCBzb2xpZC50cmFuc2Zvcm0pO1xyXG4gICAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXgzZnYoJ3VOb3JtYWxNYXRyaXgnLCBub3JtKTtcclxuICAgIFxyXG4gICAgc29saWQubWF0ZXJpYWwuc2V0dXAoZ2wsIHNoYWRlcik7ICAgICBcclxuICAgIHNvbGlkLm1lc2guZHJhdyhnbCwgc2hhZGVyKTtcclxuICB9LCB0aGlzKTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYW1iaWVudFBhc3MgPSBmdW5jdGlvbiAoZ2wsIGFtYmllbnRMaWdodCkge1xyXG4gIHZhciBzaGFkZXIgPSB0aGlzLmFtYmllbnRTaGFkZXI7ICAgIFxyXG4gIHNoYWRlci5iaW5kKGdsKTtcclxuICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVByb2plY3Rpb25NYXRyaXgnLCB0aGlzLnByb2plY3Rpb25NYXRyaXgpOyAgIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1Vmlld01hdHJpeCcsICAgICAgIHRoaXMudmlld01hdHJpeCk7ICAgXHJcbiAgXHJcbiAgc2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VBbWJpZW50TGlnaHQnLCBhbWJpZW50TGlnaHQpOyAgICBcclxuICAgIFxyXG4gIHRoaXMuZHJhd1NvbGlkcyhnbCwgc2hhZGVyKTsgIFxyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5saWdodFBhc3MgPSBmdW5jdGlvbiAoZ2wsIGxpZ2h0KSB7XHJcbiAgdmFyIHNoYWRlciA9IHRoaXMubGlnaHRTaGFkZXI7ICAgIFxyXG4gIHNoYWRlci5iaW5kKGdsKTtcclxuICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVByb2plY3Rpb25NYXRyaXgnLCB0aGlzLnByb2plY3Rpb25NYXRyaXgpOyAgIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1Vmlld01hdHJpeCcsICAgICAgIHRoaXMudmlld01hdHJpeCk7ICAgXHJcbiAgXHJcbiAgc2hhZGVyLnNldFVuaWZvcm0xaSgndUxpZ2h0VHlwZScsIGxpZ2h0LnR5cGUpO1xyXG4gIGlmIChsaWdodC5kaXJlY3Rpb24pIHtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1TGlnaHREaXJlY3Rpb24nLCBsaWdodC5kaXJlY3Rpb24pO1xyXG4gIH0gIFxyXG4gIGlmIChsaWdodC5wb3NpdGlvbikge1xyXG4gICAgc2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VMaWdodFBvc2l0aW9uJywgbGlnaHQucG9zaXRpb24pO1xyXG4gIH1cclxuICBpZiAobGlnaHQucmFuZ2UpIHtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWYoJ3VMaWdodFJhbmdlJywgbGlnaHQucmFuZ2UpO1xyXG4gIH1cclxuICBpZiAobGlnaHQuY3V0b2ZmKSB7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTFmKCd1TGlnaHRDdXRvZmYnLCBsaWdodC5jdXRvZmYpO1xyXG4gIH1cclxuICBzaGFkZXIuc2V0VW5pZm9ybTNmdigndUxpZ2h0Q29sb3InLCBsaWdodC5jb2xvcik7XHJcbiAgXHJcbiAgdGhpcy5kcmF3U29saWRzKGdsLCBzaGFkZXIpOyAgICBcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuZW1pc3NpdmVQYXNzID0gZnVuY3Rpb24gKGdsKSB7XHJcbiAgdmFyIHNoYWRlciA9IHRoaXMuZW1pc3NpdmVTaGFkZXI7ICAgIFxyXG4gIHNoYWRlci5iaW5kKGdsKTtcclxuICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVByb2plY3Rpb25NYXRyaXgnLCB0aGlzLnByb2plY3Rpb25NYXRyaXgpOyAgIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1Vmlld01hdHJpeCcsICAgICAgIHRoaXMudmlld01hdHJpeCk7ICAgXHJcbiAgICBcclxuICB0aGlzLmRyYXdTb2xpZHMoZ2wsIHNoYWRlcik7ICBcclxufVxyXG5cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmRyYXdQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoZ2wpIHtcclxuICBcclxuICB2YXIgc2hhZGVyID0gdGhpcy5wYXJ0aWNsZVNoYWRlcjtcclxuICBzaGFkZXIuYmluZChnbCk7XHJcbiAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VQcm9qZWN0aW9uTWF0cml4JywgdGhpcy5wcm9qZWN0aW9uTWF0cml4KTsgICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVZpZXdNYXRyaXgnLCAgICAgICB0aGlzLnZpZXdNYXRyaXgpO1xyXG4gIFxyXG4gIC8vIHNpemUhXHJcbiAgdGhpcy5wYXJ0aWNsZXMuZm9yRWFjaChmdW5jdGlvbiAocGFydGljbGUpIHtcclxuICAgIFxyXG4gICAgdmFyIG1vZGVsTWF0cml4ID0gcmdtLm1hdDQoKTtcclxuICAgIG1vZGVsTWF0cml4ID0gcmdtLnRyYW5zbGF0ZShtb2RlbE1hdHJpeCwgcGFydGljbGUucG9zaXRpb25bMF0sIHBhcnRpY2xlLnBvc2l0aW9uWzFdLCBwYXJ0aWNsZS5wb3NpdGlvblsyXSk7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndU1vZGVsTWF0cml4JywgbW9kZWxNYXRyaXgpO1xyXG4gICAgXHJcbiAgICAvLyBUT0RPIG1hdGVyaWFsP1xyXG4gICAgc2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VDb2xvcicsIHBhcnRpY2xlLmNvbG9yKTtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWYoJ3VTaXplJywgcGFydGljbGUuc2l6ZSAqIDAuNSk7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTFmKCd1VHJhbnNwYXJlbmN5JywgcGFydGljbGUudHJhbnNwYXJlbmN5KTtcclxuICAgIFxyXG4gICAgaWYgKHBhcnRpY2xlLnRleHR1cmUgJiYgcGFydGljbGUudGV4dHVyZS5sb2FkZWQpIHtcclxuICAgICAgc2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc1RleHR1cmUnLCAxKTtcclxuICAgICAgcGFydGljbGUudGV4dHVyZS5iaW5kKGdsLCAwKVxyXG4gICAgICBzaGFkZXIuc2V0VW5pZm9ybTFpKCd1VGV4dHVyZScsIDApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNUZXh0dXJlJywgMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMuc2NyZWVuUGxhbmUuZHJhdyhnbCwgc2hhZGVyKTtcclxuICB9LCB0aGlzKTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHNjZW5lKSB7XHJcbiAgdmFyIHJlbmRlcmVyID0gdGhpcztcclxuICBcclxuICB0aGlzLnNvbGlkcyAgICA9IFtdO1xyXG4gIHRoaXMubGlnaHRzICAgID0gW107XHJcbiAgdGhpcy5za3lCb3ggICAgPSBudWxsO1xyXG4gIHRoaXMucGFydGljbGVzID0gW107XHJcbiAgc2NlbmUuZW5xdWV1ZSh0aGlzKTtcclxuICBcclxuICB0aGlzLmNhbnZhcy5kcmF3KGZ1bmN0aW9uIChnbCkge1xyXG4gICAgXHJcbiAgICAvKmdsLmRpc2FibGUoZ2wuQkxFTkQpO1xyXG4gICAgZ2wuZGVwdGhNYXNrKGZhbHNlKTtcclxuICAgIGdsLmRpc2FibGUoZ2wuREVQVEhfVEVTVCk7XHJcbiAgICByZW5kZXJlci5kcmF3U2t5Qm94KGdsKTsqL1xyXG4gICAgXHJcbiAgICBnbC5kZXB0aE1hc2sodHJ1ZSk7XHJcbiAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcbiAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcclxuICAgIHJlbmRlcmVyLmFtYmllbnRQYXNzKGdsLCBzY2VuZS5hbWJpZW50TGlnaHQpO1xyXG4gICAgXHJcbiAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xyXG4gICAgZ2wuYmxlbmRGdW5jKGdsLk9ORSwgZ2wuT05FKTtcclxuICAgIFxyXG4gICAgcmVuZGVyZXIubGlnaHRzLmZvckVhY2goZnVuY3Rpb24gKGxpZ2h0KSB7XHJcbiAgICAgIHJlbmRlcmVyLmxpZ2h0UGFzcyhnbCwgbGlnaHQpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8qcmVuZGVyZXIuZW1pc3NpdmVQYXNzKGdsKTtcclxuICAgIFxyXG4gICAgLy9nbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgZ2wuZGVwdGhNYXNrKGZhbHNlKTtcclxuICAgIGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xyXG4gICAgcmVuZGVyZXIuZHJhd1BhcnRpY2xlcyhnbCk7Ki9cclxuICB9KTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
