
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

pkzo.AmbientFrag = "precision highp float;\n\n\n\nuniform vec3      uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool      uHasTexture;\n\n\n\nuniform vec3 uAmbientLight;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    vec3 color = uColor;\n\n    \n\n    if (uHasTexture) {\n\n        color = color * texture2D(uTexture, vTexCoord).rgb;\n\n    }\n\n    \n\n    gl_FragColor = vec4(color * uAmbientLight, 1);\n\n}\n\n";
pkzo.Inverse = "/*\n\nThe MIT License (MIT)\n\n\n\nCopyright (c) 2014 Mikola Lysenko\n\n\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\n\nof this software and associated documentation files (the \"Software\"), to deal\n\nin the Software without restriction, including without limitation the rights\n\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n\ncopies of the Software, and to permit persons to whom the Software is\n\nfurnished to do so, subject to the following conditions:\n\n\n\nThe above copyright notice and this permission notice shall be included in\n\nall copies or substantial portions of the Software.\n\n\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n\nTHE SOFTWARE.\n\n*/\n\n\n\nmat2 inverse(mat2 m) {\n\n  return mat2(m[1][1],-m[0][1],\n\n             -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);\n\n}\n\n\n\nmat3 inverse(mat3 m) {\n\n  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n\n  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n\n  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n\n\n\n  float b01 = a22 * a11 - a12 * a21;\n\n  float b11 = -a22 * a10 + a12 * a20;\n\n  float b21 = a21 * a10 - a11 * a20;\n\n\n\n  float det = a00 * b01 + a01 * b11 + a02 * b21;\n\n\n\n  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n\n              b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n\n              b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n\n}\n\n\n\nmat4 inverse(mat4 m) {\n\n  float\n\n      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n\n      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n\n      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n\n      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n\n\n\n      b00 = a00 * a11 - a01 * a10,\n\n      b01 = a00 * a12 - a02 * a10,\n\n      b02 = a00 * a13 - a03 * a10,\n\n      b03 = a01 * a12 - a02 * a11,\n\n      b04 = a01 * a13 - a03 * a11,\n\n      b05 = a02 * a13 - a03 * a12,\n\n      b06 = a20 * a31 - a21 * a30,\n\n      b07 = a20 * a32 - a22 * a30,\n\n      b08 = a20 * a33 - a23 * a30,\n\n      b09 = a21 * a32 - a22 * a31,\n\n      b10 = a21 * a33 - a23 * a31,\n\n      b11 = a22 * a33 - a23 * a32,\n\n\n\n      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\n\n\n  return mat4(\n\n      a11 * b11 - a12 * b10 + a13 * b09,\n\n      a02 * b10 - a01 * b11 - a03 * b09,\n\n      a31 * b05 - a32 * b04 + a33 * b03,\n\n      a22 * b04 - a21 * b05 - a23 * b03,\n\n      a12 * b08 - a10 * b11 - a13 * b07,\n\n      a00 * b11 - a02 * b08 + a03 * b07,\n\n      a32 * b02 - a30 * b05 - a33 * b01,\n\n      a20 * b05 - a22 * b02 + a23 * b01,\n\n      a10 * b10 - a11 * b08 + a13 * b06,\n\n      a01 * b08 - a00 * b10 - a03 * b06,\n\n      a30 * b04 - a31 * b02 + a33 * b00,\n\n      a21 * b02 - a20 * b04 - a23 * b00,\n\n      a11 * b07 - a10 * b09 - a12 * b06,\n\n      a00 * b09 - a01 * b07 + a02 * b06,\n\n      a31 * b01 - a30 * b03 - a32 * b00,\n\n      a20 * b03 - a21 * b01 + a22 * b00) / det;\n\n}\n\n";
pkzo.LightFrag = "precision highp float;\n\n\n\nuniform vec3      uColor;\n\nuniform bool      uHasTexture;\n\nuniform sampler2D uTexture;\n\nuniform float     uRoughness;\n\nuniform bool      uHasRoughnessMap;\n\nuniform sampler2D uRoughnessMap;\n\nuniform bool      uHasNormalMap;\n\nuniform sampler2D uNormalMap;\n\n\n\nuniform int   uLightType; // 1: directional, 2: point, 3: spot\n\nuniform vec3  uLightColor;\n\nuniform vec3  uLightDirection;\n\nuniform vec3  uLightPosition;\n\nuniform float uLightRange;\n\nuniform float uLightCutoff;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\nvarying vec3 vPosition;\n\nvarying vec3 vEye;\n\nvarying mat3 vTBN;\n\n\n\nvoid main() {\n\n    vec3 color = uColor;    \n\n    if (uHasTexture) {\n\n        color = color * texture2D(uTexture, vTexCoord).rgb;\n\n    }\n\n    \n\n    vec3 normal;\n\n    if (uHasNormalMap) {\n\n        normal = normalize(vTBN * texture2D(uNormalMap, vTexCoord).rgb);\n\n    }\n\n    else {\n\n        normal = normalize(vNormal);        \n\n    }\n\n    \n\n    vec3 lightDirection;\n\n    float atten;\n\n    if (uLightType == 1) {\n\n        lightDirection = normalize(-uLightDirection);\n\n        atten = 1.0;\n\n    }\n\n    if (uLightType == 2) {\n\n        lightDirection = uLightPosition - vPosition;\n\n        float dist = length(lightDirection);\n\n        if (dist > uLightRange) {\n\n            discard;\n\n        }\n\n        lightDirection = normalize(lightDirection);\n\n        atten = 1.0 - (dist / uLightRange);    \n\n    }\n\n    if (uLightType == 3) {\n\n        lightDirection = uLightPosition - vPosition;\n\n        float dist = length(lightDirection);\n\n        if (dist > uLightRange) {\n\n            discard;\n\n        }\n\n        lightDirection = normalize(lightDirection);\n\n        atten = 1.0 - (dist / uLightRange);    \n\n        \n\n        if (dot(lightDirection, -uLightDirection) < uLightCutoff) {\n\n            discard;\n\n        }  \n\n    }\n\n    \n\n    vec3 result = vec3(0);    \n\n    float nDotL = dot(normal, lightDirection);\n\n    if (nDotL > 0.0) {    \n\n        result += nDotL * color * uLightColor * atten;\n\n        \n\n        vec3 eye = normalize(vEye);\n\n        vec3 reflection = reflect(normal, lightDirection);\n\n        float shininess = 1.0 - uRoughness;\n\n        if (uHasRoughnessMap) {\n\n            shininess = shininess * (1.0 - texture2D(uRoughnessMap, vTexCoord).r);\n\n        }        \n\n\n\n        float eDotR = dot(eye, reflection);	\n\n        if (eDotR > 0.0)\n\n        {\n\n            // 0-1 -> 0-128\n\n            float si = pow(eDotR, shininess * 128.0);\n\n            result += uLightColor * vec3(shininess)  * si;\n\n        }\n\n    }\n\n            \n\n    gl_FragColor = vec4(result, 1.0);\n\n}                           \n\n";
pkzo.SkyBoxFrag = "precision highp float;\n\n\n\nuniform samplerCube uCubemap;\n\n\n\nvarying vec3 vDirection;\n\n\n\nvoid main()\n\n{\n\n    gl_FragColor = textureCube(uCubemap, vDirection);\n\n}\n\n";
pkzo.SkyBoxVert = "precision highp float;\n\n\n\nuniform mat4 uProjectionMatrix;\n\nuniform mat4 uViewMatrix;\n\n\n\nattribute vec3 aVertex;\n\n\n\nvarying vec3 vDirection;\n\n\n\nvoid main()\n\n{\n\n    vec4 vertex            = vec4(aVertex, 1);\n\n    mat4 inverseProjection = inverse(uProjectionMatrix);\n\n    mat3 inverseView       = inverse(mat3(uViewMatrix));\n\n    vec3 unprojected       = (inverseProjection * vertex).xyz;\n\n    \n\n    vDirection  = inverseView * unprojected;\n\n    gl_Position = vertex;\n\n}";
pkzo.SolidFrag = "precision highp float;\n\n\n\nuniform vec3 uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool uHasTexture;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    if (uHasTexture) {\n\n        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(uColor, 1);\n\n    }\n\n    else {\n\n        gl_FragColor = vec4(uColor, 1);\n\n    }\n\n}";
pkzo.SolidVert = "precision highp float;\n\n\n\nuniform mat4 uProjectionMatrix;\n\nuniform mat4 uViewMatrix;\n\nuniform mat4 uModelMatrix;\n\nuniform mat3 uNormalMatrix;\n\n\n\nattribute vec3 aVertex;\n\nattribute vec3 aNormal;\n\nattribute vec2 aTexCoord;\n\nattribute vec3 aTangent;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\nvarying vec3 vPosition;\n\nvarying vec3 vEye;\n\nvarying mat3 vTBN;\n\n\n\nvoid main() {\n\n  vec3 n = normalize(uNormalMatrix * aNormal);\n\n  vec3 t = normalize(uNormalMatrix * aTangent);\n\n  vec3 b = normalize(cross(n, t));\n\n    \n\n  vNormal     = n;\n\n  vTexCoord   = aTexCoord;\n\n  vPosition   = vec3(uModelMatrix * vec4(aVertex, 1.0));\n\n  \n\n  vEye        = mat3(uViewMatrix) * -aVertex;\n\n  vTBN        = mat3(t, b, n);\n\n  \n\n  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertex, 1);\n\n}";
pkzo.Transpose = "\n\nmat2 tanspose(mat2 m) {\n\n  mat2 r;\n\n  for (int i = 0; i < 2; i++) {\n\n    for (int j = 0; j < 2; j++) {\n\n       r[i][j] = m[j][i];\n\n    }\n\n  }\n\n  return r;\n\n}\n\n\n\nmat3 tanspose(mat3 m) {\n\n  mat3 r;\n\n  for (int i = 0; i < 3; i++) {\n\n    for (int j = 0; j < 3; j++) {\n\n       r[i][j] = m[j][i];\n\n    }\n\n  }\n\n  return r;\n\n}\n\n\n\nmat4 tanspose(mat4 m) {\n\n  mat4 r;\n\n  for (int i = 0; i < 4; i++) {\n\n    for (int j = 0; j < 4; j++) {\n\n       r[i][j] = m[j][i];\n\n    }\n\n  }\n\n  return r;\n\n}\n\n";


pkzo.vec2 = function (v0, v1) {
  if (typeof v0 === 'number' && 
      typeof v1 === 'undefined') {
    return new Float32Array([v0, v0]);
  }
  else if (typeof v0 === 'number' && 
           typeof v1 === 'number') {
    return new Float32Array([v0, v1]);
  }
  else {
    return new Float32Array(2);
  }
}

pkzo.vec3 = function (v0, v1, v2) {
  if (typeof v0 === 'number' && 
      typeof v1 === 'undefined' &&
      typeof v2 === 'undefined') {
    return new Float32Array([v0, v0, v0]);
  }
  else if (typeof v0 === 'number' && 
           typeof v1 === 'number' && 
           typeof v2 === 'number') {
    return new Float32Array([v0, v1, v2]);
  }
  else {
    return new Float32Array(3);
  }
}

pkzo.vec4 = function (v0, v1, v2, v4) {
  if (typeof v0 === 'number' && 
      typeof v1 === 'undefined' &&
      typeof v2 === 'undefined' &&
      typeof v3 === 'undefined') {
    return new Float32Array([v0, v0, v0, v0]);
  }
  else if (typeof v0 === 'number' && 
           typeof v1 === 'number' && 
           typeof v2 === 'number' &&
           typeof v3 === 'number') {
    return new Float32Array([v0, v1, v2, v4]);
  }
  else {
    return new Float32Array(4);
  }
}

pkzo.neg = function (v) {
  var r = new Float32Array(v.length);
  for (var i = 0; i < v.length; i++) {
    r[i] = -v[i];
  }
  return r;
}

// add and sub also work for matrix
pkzo.add = function (a, b) {
  var r = new Float32Array(a.length);
  for (var i = 0; i < a.length; i++) {
    r[i] = a[i] + b[i];
  }
  return r;
}

pkzo.sub = function (a, b) {
  var r = new Float32Array(a.length);
  for (var i = 0; i < a.length; i++) {
    r[i] = a[i] - b[i];
  }
  return r;
}

pkzo.dot = function (a, b) {
  var v = 0;
  for (var i = 0; i < a.length; i++) {
    v += a[i] * b[i];
  }
  return v;
}

pkzo.cross = function (a, b) {
  // assume a.length == b.length == 3
  
  var r = new Float32Array(3);
  
  r[0] = (a[1] * b[2]) - (a[2] * b[1]);
  r[1] = (a[2] * b[0]) - (a[0] * b[2]);
  r[2] = (a[0] * b[1]) - (a[1] * b[0]);
  
  return r;
}

pkzo.svmult = function (v, s) {
  var r = new Float32Array(v.length);
  for (var i = 0; i < v.length; i++) {
    r[i] = v[i] * s;
  }
  return r;
}

pkzo.length = function (v) {  
  return Math.sqrt(pkzo.dot(v, v));
}

pkzo.normalize = function (v) {
  return pkzo.svmult(v, 1 / pkzo.length(v));
}

pkzo.multMatrixVector = function (m, v) {
	var n = v.length;
	var r = new Float32Array(n);
	
	for (var i = 0; i < n; i++)
	{
		r[i] = 0;
		for (var j = 0; j < n; j++)
		{
				r[i] += m[i*n+j] * v[j];
		}
	}
	
	return r;
}

pkzo.midpoint = function (a, b) {
  var p = pkzo.sub(b, a);
  m = pkzo.add(a, pkzo.svmult(p, 0.5));
  return m;
}


pkzo.mat3 = function (v) {
  if (v && v.length && v.length == 16) {
			return new Float32Array([v[0], v[1], v[2],
                               v[4], v[5], v[6],
                               v[8], v[9], v[10]]);
	}
	if (v && v.length) {
    if (v.length != 9) {
      throw new Error('mat3 must be 9 values');
    }
    return new Float32Array(v);
  }
  if (typeof v === 'number') {
    return new Float32Array([v, 0, 0,
                             0, v, 0,
                             0, 0, v]);
  }
  return new Float32Array([1, 0, 0,
                           0, 1, 0,
                           0, 0, 1]);
}

pkzo.mat4 = function (v) {
  if (v && v.length) {    
    if (v.length != 16) {
      throw new Error('mat4 must be 16 values');
    }
    return new Float32Array(v);
  }
  if (typeof v === 'number') {
    return new Float32Array([v, 0, 0, 0,
                             0, v, 0, 0,
                             0, 0, v, 0,
                             0, 0, 0, v]);
  }
  return new Float32Array([1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1]);
}

pkzo.multMatrix = function (a, b) {
  // assume a.length == b.length
  var n = Math.sqrt(a.length);
  var r = new Float32Array(a.length);
  
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      var v = 0;
      for (var k = 0; k < n; k++) {
        v = v + a[i*n+k] * b[k*n+j];
      }
      r[i*n+j] = v;
    }
  }
  
  return r;
}

pkzo.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

pkzo.degrees = function(radians) {
  return radians * 180 / Math.PI;
}; 


pkzo.ortho = function (left, right, bottom, top, near, far) {
  var rl = (right - left);
  var tb = (top - bottom);
  var fn = (far - near);
  
  var m = pkzo.mat4();  
  
  m[0] = 2 / rl;
  m[1] = 0;
  m[2] = 0;
  m[3] = 0;
  m[4] = 0;
  m[5] = 2 / tb;
  m[6] = 0;
  m[7] = 0;
  m[8] = 0;
  m[9] = 0;
  m[10] = -2 / fn;
  m[11] = 0;
  m[12] = -(left + right) / rl;
  m[13] = -(top + bottom) / tb;
  m[14] = -(far + near) / fn;
  m[15] = 1;

  return m;
}

pkzo.frustum = function (left, right, bottom, top, znear, zfar) {
  var t1 = 2 * znear;
  var t2 = right - left;
  var t3 = top - bottom;
  var t4 = zfar - znear;

  var m = new Float32Array(16);
  
  m[0] = t1/t2; m[4] =     0; m[ 8] =  (right + left) / t2; m[12] =                 0;
  m[1] =     0; m[5] = t1/t3; m[ 9] =  (top + bottom) / t3; m[13] =                 0;
  m[2] =     0; m[6] =     0; m[10] = (-zfar - znear) / t4; m[14] = (-t1 * zfar) / t4;
  m[3] =     0; m[7] =     0; m[11] =                   -1; m[15] =                 0;
  
  return m;
}

pkzo.perspective = function (fovy, aspect, znear, zfar) {
  var ymax = znear * Math.tan(pkzo.radians(fovy));
  var xmax = ymax * aspect;
  return pkzo.frustum(-xmax, xmax, -ymax, ymax, znear, zfar);
}

// NOTE: this is inefficient, it may be sensible to provide inplace versions
pkzo.translate = function(m, x, y, z) {    
  var r = pkzo.mat4(m);
  r[12] = m[0] * x + m[4] * y + m[ 8] * z + m[12];
  r[13] = m[1] * x + m[5] * y + m[ 9] * z + m[13];
  r[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
  r[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
  return r;
}

pkzo.rotate = function (m, angle, x, y, z) {  
  var a = pkzo.radians(angle);
  var c = Math.cos(a);
  var s = Math.sin(a);
  
  var l = Math.sqrt(x * x + y * y + z * z);
  var nx = x / l;
  var ny = y / l;
  var nz = z / l;

  var t0 = nx * (1 - c);
  var t1 = ny * (1 - c);
  var t2 = nz * (1 - c);  

  var d = pkzo.mat4(1);
  
  d[ 0] = c + t0 * nx;
  d[ 1] = 0 + t0 * ny + s * nz;
  d[ 2] = 0 + t0 * nz - s * ny;

  d[ 4] = 0 + t1 * nx - s * nz;
  d[ 5] = c + t1 * ny;
  d[ 6] = 0 + t1 * nz + s * nx;

  d[ 8] = 0 + t2 * nx + s * ny;
  d[ 9] = 0 + t2 * ny - s * nx;
  d[10] = c + t2 * nz;  
  
  var r = pkzo.multMatrix(m, d);
  
  r[12] = m[12];
  r[13] = m[13];
  r[14] = m[14];
  r[15] = m[15];
  
  return r;
}

pkzo.scale = function(m, x, y, z) {    
  var r = pkzo.mat4(1);
  
  r[ 0] = m[ 0] * x; 
  r[ 1] = m[ 1] * x; 
  r[ 2] = m[ 2] * x; 
  r[ 3] = m[ 3] * x; 
  
  r[ 4] = m[ 4] * y; 
  r[ 5] = m[ 5] * y; 
  r[ 6] = m[ 6] * y; 
  r[ 7] = m[ 7] * y; 
  
  r[ 8] = m[ 8] * z;
  r[ 9] = m[ 9] * z;
  r[10] = m[10] * z;
  r[11] = m[11] * z;
  
  r[12] = m[12];
  r[13] = m[13];
  r[14] = m[14];
  r[15] = m[15];
  
  return r;
}

pkzo.transpose = function(m) {    
  var n = Math.sqrt(m.length);
  var r = new Float32Array(m.length);
  
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      r[j*n+i] = m[i*n+j];
    }
  }
  
  return r;
}


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



pkzo.Shader = function (gl, vertexCode, fragmentCode) {
  this.gl           = gl;
  this.vertexCode   = vertexCode;
  this.fragmentCode = fragmentCode;
}

pkzo.Shader.prototype.compile = function () {
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

pkzo.Shader.prototype.bind = function () {
  if (!this.id) {
    this.compile();
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
	this.ambientLight = pkzo.vec3(0.2, 0.2, 0.2);	
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
    this.entities = [entity]
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
          var vertex   = pkzo.vec3(0);
          var normal   = pkzo.vec3(0);
          var texCoord = pkzo.vec2(0);
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
      mesh.addVertex(pkzo.vec3(x, y, 0), pkzo.vec3(0, 0, 1), pkzo.vec2(t, s), pkzo.vec3(0, 1, 0));            
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
  
  var pitchInc = pkzo.radians(180.0 / nPitch);
  var rotInc   = pkzo.radians(360.0 / nLatitude);
 
  // poles
  mesh.addVertex(pkzo.vec3(0, 0, radius), pkzo.vec3(0, 0, 1), pkzo.vec2(0.5, 0), pkzo.vec3(0, 1, 0)); // top vertex
  mesh.addVertex(pkzo.vec3(0, 0, -radius), pkzo.vec3(0, 0, -1), pkzo.vec2(0.5, 1), pkzo.vec3(0, 1, 0)); // bottom vertex
   
  // body vertices
  var twoPi = Math.PI * 2.0;
  for (var p = 1; p < nPitch; p++) {    
    var out = Math.abs(radius * Math.sin(p * pitchInc));    
    var z   = radius * Math.cos(p * pitchInc);
    
    for(var s = 0; s <= nLatitude; s++) {
      var x = out * Math.cos(s * rotInc);
      var y = out * Math.sin(s * rotInc);
      
      var vec  = pkzo.vec3(x, y, z);
      var norm = pkzo.normalize(vec);
      var tc   = pkzo.vec2(s / nLatitude, p / nPitch);      
      var tang = pkzo.cross(norm, pkzo.vec3(0, 0, 1));
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
    pkzo.vec3(-1,  t,  0),
    pkzo.vec3( 1,  t,  0),
    pkzo.vec3(-1, -t,  0),
    pkzo.vec3( 1, -t,  0),

    pkzo.vec3( 0, -1,  t),
    pkzo.vec3( 0,  1,  t),
    pkzo.vec3( 0, -1, -t),
    pkzo.vec3( 0,  1, -t),

    pkzo.vec3( t,  0, -1),
    pkzo.vec3( t,  0,  1),
    pkzo.vec3(-t,  0, -1),
    pkzo.vec3(-t,  0,  1),
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
    var texCoord = pkzo.vec2(Math.atan(v[1]/v[0]) / twoPi, Math.acos(v[2]) / twoPi);
    var tangent  = pkzo.cross(normal, pkzo.vec3(0, 0, 1));
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
  return pkzo.vec3(this.vertices[i * 3], this.vertices[i * 3 + 1], this.vertices[i * 3 + 2]);
}

pkzo.Mesh.prototype.getNormal = function (i) {
  return pkzo.vec3(this.normals[i * 3], this.normals[i * 3 + 1], this.normals[i * 3 + 2]);
}

pkzo.Mesh.prototype.getTexCoord = function (i) {
  return pkzo.vec2(this.texCoords[i * 2], this.texCoords[i * 2 + 1]);
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
    tan1[i] = pkzo.vec3(0);
    tan2[i] = pkzo.vec3(0);
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
    var sdir = pkzo.vec3((t2 * x1 - t1 * x2) * r,  (t2 * y1 - t1 * y2) * r,(t2 * z1 - t1 * z2) * r);
    var tdir = pkzo.vec3((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r);

    tan1[a] = pkzo.add(tan1[a], sdir);
    tan1[b] = pkzo.add(tan1[b], sdir);
    tan1[c] = pkzo.add(tan1[c], sdir);

    tan2[a] = pkzo.add(tan2[a], tdir);
    tan2[b] = pkzo.add(tan2[b], tdir);
    tan2[c] = pkzo.add(tan2[c], tdir);
  }
    
  this.tangents = [];
  for (var j = 0; j < vertexCount; j++) {
    var n = this.getNormal(j);
    var t = tan1[j];
    
    var tn = pkzo.normalize(pkzo.svmult(pkzo.sub(t, n), pkzo.dot(n, t)));
    
    if (pkzo.dot(pkzo.cross(n, t), tan2[j]) < 0.0) {
      this.tangents.push(-tn[0], -tn[1], -tn[2]);
    }
    else {
      this.tangents.push(tn[0], tn[1], tn[2]);
    }
  }
}


pkzo.Material = function (opts) {	
  this.color     = pkzo.vec3(1, 1, 1);
  this.roughness = 1;
  
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
  if (data.color) {
    this.color = data.color;
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
  
  if (data.normalMap) {
    this.normalMap = pkzo.Texture.load(data.normalMap);
  }
}

pkzo.Material.prototype.setup = function (gl, shader) {
	
	shader.setUniform3fv('uColor', this.color);
	
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
		this.roughnessMap.bind(gl, 1)
		shader.setUniform1i('uRoughnessMap', 1);
  }
  else {
    shader.setUniform1i('uHasRoughnessMap', 0);
  }
  
  if (this.normalMap && this.normalMap.loaded) {
		shader.setUniform1i('uHasNormalMap', 1);
		this.normalMap.bind(gl, 2)
		shader.setUniform1i('uNormalMap', 2);
	}
	else {
		shader.setUniform1i('uHasNormalMap', 0);
	}	
}




pkzo.Entity = function () {
  this.transform = pkzo.mat4(1);
}

pkzo.Entity.prototype.translate = function (x, y, z) {
	this.transform = pkzo.translate(this.transform, x, y, z);
}

pkzo.Entity.prototype.rotate = function (angle, x, y, z) {
	this.transform = pkzo.rotate(this.transform, angle, x, y, z);
}

pkzo.Entity.prototype.getXVector = function () {
	return pkzo.vec3(this.transform[0], this.transform[1], this.transform[2]);
}

pkzo.Entity.prototype.getYVector = function () {
	return pkzo.vec3(this.transform[4], this.transform[5], this.transform[6]);
}

pkzo.Entity.prototype.getZVector = function () {
	return pkzo.vec3(this.transform[8], this.transform[9], this.transform[10]);
}

pkzo.Entity.prototype.getPosition = function () {
  return pkzo.vec3(this.transform[12], this.transform[13], this.transform[14]);
}

pkzo.Entity.prototype.setPosition = function (value) {
  this.transform[12] = value[0];
  this.transform[13] = value[1];
  this.transform[14] = value[2];
}

pkzo.Entity.prototype.lookAt = function (target, up) {
  var position = this.getPosition();
  var forward  = pkzo.normalize(pkzo.sub(target, position));
  var right    = pkzo.normalize(pkzo.cross(forward, up));
  var upn      = pkzo.normalize(pkzo.cross(right, forward));
  
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
  
  var projectionMatrix = pkzo.perspective(this.yfov, aspect, this.znear, this.zfar);
  
  var p = this.getPosition();
  var x = this.getXVector();
  var y = this.getYVector();
  var z = this.getZVector();
  
  var viewMatrix = pkzo.mat4([x[0], x[1], x[2], 0,
                              y[0], y[1], y[2], 0,
                              z[0], z[1], z[2], 0,
                                 0,    0,    0, 1]);
  viewMatrix = pkzo.transpose(viewMatrix); // use inverse
  viewMatrix = pkzo.translate(viewMatrix, -p[0], -p[1], -p[2]);  
  
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
	
	this.color = pkzo.vec3(0.5, 0.5, 0.5);
}

pkzo.DirectionalLight.prototype = Object.create(pkzo.Entity.prototype);
pkzo.DirectionalLight.prototype.constructor = pkzo.DirectionalLight;

pkzo.DirectionalLight.prototype.enqueue = function (renderer) {
	var dir = pkzo.neg(this.getZVector());
	renderer.addDirectionalLight(dir, this.color);
}


pkzo.PointLight = function () {
  pkzo.Entity.call(this);
	
	this.color = pkzo.vec3(0.5, 0.5, 0.5);
  this.range = 10.0;
}

pkzo.PointLight.prototype = Object.create(pkzo.Entity.prototype);
pkzo.PointLight.prototype.constructor = pkzo.PointLight;

pkzo.PointLight.prototype.enqueue = function (renderer) {
	renderer.addPointLight(this.getPosition(), this.color, this.range);
}


pkzo.SpotLight = function () {
  pkzo.Entity.call(this);
	
	this.color  = pkzo.vec3(0.5, 0.5, 0.5);
  this.range  = 10.0;
  this.cutoff = 25.0;
}

pkzo.SpotLight.prototype = Object.create(pkzo.Entity.prototype);
pkzo.SpotLight.prototype.constructor = pkzo.SpotLight;

pkzo.SpotLight.prototype.enqueue = function (renderer) {
  var dir = pkzo.neg(this.getZVector());
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



pkzo.Renderer = function (canvas) {
  this.canvas = new pkzo.Canvas(canvas);
  
  var renderer = this;
  
  this.canvas.init(function (gl) {
    renderer.sykBoxShader  = new pkzo.Shader(gl, pkzo.Inverse + pkzo.Transpose + pkzo.SkyBoxVert, pkzo.SkyBoxFrag);
    renderer.ambientShader = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.AmbientFrag);
    renderer.lightShader   = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.LightFrag);   

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

pkzo.Renderer.prototype.drawSkyBox = function (gl) {
  if (this.skyBox) {
    var shader = this.sykBoxShader;
    
    shader.bind();
    shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
    shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);
    
    this.skyBox.bind(gl, 0);
    shader.setUniform1i('uCubemap', 0);
    
    this.screenPlane.draw(gl, shader);    
  }
}

pkzo.Renderer.prototype.drawSolids = function (gl, shader) {
  this.solids.forEach(function (solid) {
    var norm = pkzo.multMatrix(pkzo.mat3(this.viewMatrix), pkzo.mat3(solid.transform));
        
    shader.setUniformMatrix4fv('uModelMatrix', solid.transform);
    shader.setUniformMatrix3fv('uNormalMatrix', norm);
    
    solid.material.setup(gl, shader);     
    solid.mesh.draw(gl, shader);
  });
}

pkzo.Renderer.prototype.ambientPass = function (gl, ambientLight) {
  var shader = this.ambientShader;    
  shader.bind();
  
  shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
  shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);   
  
  shader.setUniform3fv('uAmbientLight', ambientLight);    
    
  this.drawSolids(gl, shader);  
}

pkzo.Renderer.prototype.lightPass = function (gl, light) {
  var shader = this.lightShader;    
  shader.bind();
  
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

pkzo.Renderer.prototype.render = function (scene) {
  var renderer = this;
  
  this.solids = [];
  this.lights = [];
  this.skyBox = null;
  scene.enqueue(this);
  
  this.canvas.draw(function (gl) {
    
    gl.disable(gl.BLEND);
    gl.depthMask(false);
    gl.disable(gl.DEPTH_TEST);
    renderer.drawSkyBox(gl);
    
    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    renderer.ambientPass(gl, scene.ambientLight);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    
    renderer.lights.forEach(function (light) {
      renderer.lightPass(gl, light);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuanMiLCJwa3pvLmpzIiwic2hhZGVycy5qcyIsInZlY3Rvci5qcyIsIm1hdHJpeC5qcyIsIkNhbnZhcy5qcyIsIlRleHR1cmUuanMiLCJDdWJlTWFwLmpzIiwiU2hhZGVyLmpzIiwiU2NlbmUuanMiLCJCdWZmZXIuanMiLCJQbHlQYXJzZXIuanMiLCJNZXNoLmpzIiwiTWF0ZXJpYWwuanMiLCJFbnRpdHkuanMiLCJDYW1lcmEuanMiLCJPYmplY3QuanMiLCJEaXJlY3Rpb25hbExpZ2h0LmpzIiwiUG9pbnRMaWdodC5qcyIsIlNwb3RMaWdodC5qcyIsIlNreUJveC5qcyIsIlJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1cUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicGt6by0wLjAuMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgaHR0cCA9IHt9O1xyXG5cclxuaHR0cC5zZW5kID0gZnVuY3Rpb24gKHR5cGUsIHVybCwgZGF0YSwgY2IpIHtcclxuICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKVxyXG4gIHtcclxuICAgIGlmICh4bWxodHRwLnJlYWR5U3RhdGUgPT0gNClcclxuICAgIHtcclxuICAgICAgY2IoeG1saHR0cC5zdGF0dXMsIHhtbGh0dHAucmVzcG9uc2VUZXh0KTtcclxuICAgIH1cclxuICB9ICAgIFxyXG4gIHhtbGh0dHAub3Blbih0eXBlLCB1cmwsIHRydWUpO1xyXG4gIHhtbGh0dHAuc2VuZChkYXRhKTtcclxufVxyXG5cclxuaHR0cC5nZXQgPSBmdW5jdGlvbiAodXJsLCBjYikge1xyXG4gIGh0dHAuc2VuZChcIkdFVFwiLCB1cmwsIG51bGwsIGNiKTtcclxufVxyXG5cclxuaHR0cC5wb3N0ID0gZnVuY3Rpb24gKHVybCwgZGF0YSwgY2IpIHtcclxuICBodHRwLnNlbmQoXCJHRVRcIiwgdXJsLCBkYXRhLCBjYik7XHJcbn1cclxuIiwiXHJcbnZhciBwa3pvID0ge3ZlcnNpb246ICcwLjAuMSd9O1xyXG4iLCJwa3pvLkFtYmllbnRGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzICAgICAgdUNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlO1xcblxcbnVuaWZvcm0gYm9vbCAgICAgIHVIYXNUZXh0dXJlO1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyB1QW1iaWVudExpZ2h0O1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxuXFxuXFxudm9pZCBtYWluKClcXG5cXG57XFxuXFxuICAgIHZlYzMgY29sb3IgPSB1Q29sb3I7XFxuXFxuICAgIFxcblxcbiAgICBpZiAodUhhc1RleHR1cmUpIHtcXG5cXG4gICAgICAgIGNvbG9yID0gY29sb3IgKiB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkucmdiO1xcblxcbiAgICB9XFxuXFxuICAgIFxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yICogdUFtYmllbnRMaWdodCwgMSk7XFxuXFxufVxcblxcblwiO1xucGt6by5JbnZlcnNlID0gXCIvKlxcblxcblRoZSBNSVQgTGljZW5zZSAoTUlUKVxcblxcblxcblxcbkNvcHlyaWdodCAoYykgMjAxNCBNaWtvbGEgTHlzZW5rb1xcblxcblxcblxcblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcXG5cXG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcXFwiU29mdHdhcmVcXFwiKSwgdG8gZGVhbFxcblxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcXG5cXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXFxuXFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXFxuXFxuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcXG5cXG5cXG5cXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxcblxcbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxcblxcblxcblxcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcXFwiQVMgSVNcXFwiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXFxuXFxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXFxuXFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXFxuXFxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxcblxcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXFxuXFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxcblxcblRIRSBTT0ZUV0FSRS5cXG5cXG4qL1xcblxcblxcblxcbm1hdDIgaW52ZXJzZShtYXQyIG0pIHtcXG5cXG4gIHJldHVybiBtYXQyKG1bMV1bMV0sLW1bMF1bMV0sXFxuXFxuICAgICAgICAgICAgIC1tWzFdWzBdLCBtWzBdWzBdKSAvIChtWzBdWzBdKm1bMV1bMV0gLSBtWzBdWzFdKm1bMV1bMF0pO1xcblxcbn1cXG5cXG5cXG5cXG5tYXQzIGludmVyc2UobWF0MyBtKSB7XFxuXFxuICBmbG9hdCBhMDAgPSBtWzBdWzBdLCBhMDEgPSBtWzBdWzFdLCBhMDIgPSBtWzBdWzJdO1xcblxcbiAgZmxvYXQgYTEwID0gbVsxXVswXSwgYTExID0gbVsxXVsxXSwgYTEyID0gbVsxXVsyXTtcXG5cXG4gIGZsb2F0IGEyMCA9IG1bMl1bMF0sIGEyMSA9IG1bMl1bMV0sIGEyMiA9IG1bMl1bMl07XFxuXFxuXFxuXFxuICBmbG9hdCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjE7XFxuXFxuICBmbG9hdCBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwO1xcblxcbiAgZmxvYXQgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwO1xcblxcblxcblxcbiAgZmxvYXQgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xcblxcblxcblxcbiAgcmV0dXJuIG1hdDMoYjAxLCAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSksIChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpLFxcblxcbiAgICAgICAgICAgICAgYjExLCAoYTIyICogYTAwIC0gYTAyICogYTIwKSwgKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApLFxcblxcbiAgICAgICAgICAgICAgYjIxLCAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCksIChhMTEgKiBhMDAgLSBhMDEgKiBhMTApKSAvIGRldDtcXG5cXG59XFxuXFxuXFxuXFxubWF0NCBpbnZlcnNlKG1hdDQgbSkge1xcblxcbiAgZmxvYXRcXG5cXG4gICAgICBhMDAgPSBtWzBdWzBdLCBhMDEgPSBtWzBdWzFdLCBhMDIgPSBtWzBdWzJdLCBhMDMgPSBtWzBdWzNdLFxcblxcbiAgICAgIGExMCA9IG1bMV1bMF0sIGExMSA9IG1bMV1bMV0sIGExMiA9IG1bMV1bMl0sIGExMyA9IG1bMV1bM10sXFxuXFxuICAgICAgYTIwID0gbVsyXVswXSwgYTIxID0gbVsyXVsxXSwgYTIyID0gbVsyXVsyXSwgYTIzID0gbVsyXVszXSxcXG5cXG4gICAgICBhMzAgPSBtWzNdWzBdLCBhMzEgPSBtWzNdWzFdLCBhMzIgPSBtWzNdWzJdLCBhMzMgPSBtWzNdWzNdLFxcblxcblxcblxcbiAgICAgIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMCxcXG5cXG4gICAgICBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTAsXFxuXFxuICAgICAgYjAyID0gYTAwICogYTEzIC0gYTAzICogYTEwLFxcblxcbiAgICAgIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMSxcXG5cXG4gICAgICBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTEsXFxuXFxuICAgICAgYjA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyLFxcblxcbiAgICAgIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMCxcXG5cXG4gICAgICBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzAsXFxuXFxuICAgICAgYjA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwLFxcblxcbiAgICAgIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMSxcXG5cXG4gICAgICBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzEsXFxuXFxuICAgICAgYjExID0gYTIyICogYTMzIC0gYTIzICogYTMyLFxcblxcblxcblxcbiAgICAgIGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcXG5cXG5cXG5cXG4gIHJldHVybiBtYXQ0KFxcblxcbiAgICAgIGExMSAqIGIxMSAtIGExMiAqIGIxMCArIGExMyAqIGIwOSxcXG5cXG4gICAgICBhMDIgKiBiMTAgLSBhMDEgKiBiMTEgLSBhMDMgKiBiMDksXFxuXFxuICAgICAgYTMxICogYjA1IC0gYTMyICogYjA0ICsgYTMzICogYjAzLFxcblxcbiAgICAgIGEyMiAqIGIwNCAtIGEyMSAqIGIwNSAtIGEyMyAqIGIwMyxcXG5cXG4gICAgICBhMTIgKiBiMDggLSBhMTAgKiBiMTEgLSBhMTMgKiBiMDcsXFxuXFxuICAgICAgYTAwICogYjExIC0gYTAyICogYjA4ICsgYTAzICogYjA3LFxcblxcbiAgICAgIGEzMiAqIGIwMiAtIGEzMCAqIGIwNSAtIGEzMyAqIGIwMSxcXG5cXG4gICAgICBhMjAgKiBiMDUgLSBhMjIgKiBiMDIgKyBhMjMgKiBiMDEsXFxuXFxuICAgICAgYTEwICogYjEwIC0gYTExICogYjA4ICsgYTEzICogYjA2LFxcblxcbiAgICAgIGEwMSAqIGIwOCAtIGEwMCAqIGIxMCAtIGEwMyAqIGIwNixcXG5cXG4gICAgICBhMzAgKiBiMDQgLSBhMzEgKiBiMDIgKyBhMzMgKiBiMDAsXFxuXFxuICAgICAgYTIxICogYjAyIC0gYTIwICogYjA0IC0gYTIzICogYjAwLFxcblxcbiAgICAgIGExMSAqIGIwNyAtIGExMCAqIGIwOSAtIGExMiAqIGIwNixcXG5cXG4gICAgICBhMDAgKiBiMDkgLSBhMDEgKiBiMDcgKyBhMDIgKiBiMDYsXFxuXFxuICAgICAgYTMxICogYjAxIC0gYTMwICogYjAzIC0gYTMyICogYjAwLFxcblxcbiAgICAgIGEyMCAqIGIwMyAtIGEyMSAqIGIwMSArIGEyMiAqIGIwMCkgLyBkZXQ7XFxuXFxufVxcblxcblwiO1xucGt6by5MaWdodEZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIHZlYzMgICAgICB1Q29sb3I7XFxuXFxudW5pZm9ybSBib29sICAgICAgdUhhc1RleHR1cmU7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmU7XFxuXFxudW5pZm9ybSBmbG9hdCAgICAgdVJvdWdobmVzcztcXG5cXG51bmlmb3JtIGJvb2wgICAgICB1SGFzUm91Z2huZXNzTWFwO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVSb3VnaG5lc3NNYXA7XFxuXFxudW5pZm9ybSBib29sICAgICAgdUhhc05vcm1hbE1hcDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1Tm9ybWFsTWFwO1xcblxcblxcblxcbnVuaWZvcm0gaW50ICAgdUxpZ2h0VHlwZTsgLy8gMTogZGlyZWN0aW9uYWwsIDI6IHBvaW50LCAzOiBzcG90XFxuXFxudW5pZm9ybSB2ZWMzICB1TGlnaHRDb2xvcjtcXG5cXG51bmlmb3JtIHZlYzMgIHVMaWdodERpcmVjdGlvbjtcXG5cXG51bmlmb3JtIHZlYzMgIHVMaWdodFBvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdUxpZ2h0UmFuZ2U7XFxuXFxudW5pZm9ybSBmbG9hdCB1TGlnaHRDdXRvZmY7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG52YXJ5aW5nIHZlYzMgdlBvc2l0aW9uO1xcblxcbnZhcnlpbmcgdmVjMyB2RXllO1xcblxcbnZhcnlpbmcgbWF0MyB2VEJOO1xcblxcblxcblxcbnZvaWQgbWFpbigpIHtcXG5cXG4gICAgdmVjMyBjb2xvciA9IHVDb2xvcjsgICAgXFxuXFxuICAgIGlmICh1SGFzVGV4dHVyZSkge1xcblxcbiAgICAgICAgY29sb3IgPSBjb2xvciAqIHRleHR1cmUyRCh1VGV4dHVyZSwgdlRleENvb3JkKS5yZ2I7XFxuXFxuICAgIH1cXG5cXG4gICAgXFxuXFxuICAgIHZlYzMgbm9ybWFsO1xcblxcbiAgICBpZiAodUhhc05vcm1hbE1hcCkge1xcblxcbiAgICAgICAgbm9ybWFsID0gbm9ybWFsaXplKHZUQk4gKiB0ZXh0dXJlMkQodU5vcm1hbE1hcCwgdlRleENvb3JkKS5yZ2IpO1xcblxcbiAgICB9XFxuXFxuICAgIGVsc2Uge1xcblxcbiAgICAgICAgbm9ybWFsID0gbm9ybWFsaXplKHZOb3JtYWwpOyAgICAgICAgXFxuXFxuICAgIH1cXG5cXG4gICAgXFxuXFxuICAgIHZlYzMgbGlnaHREaXJlY3Rpb247XFxuXFxuICAgIGZsb2F0IGF0dGVuO1xcblxcbiAgICBpZiAodUxpZ2h0VHlwZSA9PSAxKSB7XFxuXFxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IG5vcm1hbGl6ZSgtdUxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgICAgIGF0dGVuID0gMS4wO1xcblxcbiAgICB9XFxuXFxuICAgIGlmICh1TGlnaHRUeXBlID09IDIpIHtcXG5cXG4gICAgICAgIGxpZ2h0RGlyZWN0aW9uID0gdUxpZ2h0UG9zaXRpb24gLSB2UG9zaXRpb247XFxuXFxuICAgICAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgICAgIGlmIChkaXN0ID4gdUxpZ2h0UmFuZ2UpIHtcXG5cXG4gICAgICAgICAgICBkaXNjYXJkO1xcblxcbiAgICAgICAgfVxcblxcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSBub3JtYWxpemUobGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgYXR0ZW4gPSAxLjAgLSAoZGlzdCAvIHVMaWdodFJhbmdlKTsgICAgXFxuXFxuICAgIH1cXG5cXG4gICAgaWYgKHVMaWdodFR5cGUgPT0gMykge1xcblxcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSB1TGlnaHRQb3NpdGlvbiAtIHZQb3NpdGlvbjtcXG5cXG4gICAgICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgobGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgaWYgKGRpc3QgPiB1TGlnaHRSYW5nZSkge1xcblxcbiAgICAgICAgICAgIGRpc2NhcmQ7XFxuXFxuICAgICAgICB9XFxuXFxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IG5vcm1hbGl6ZShsaWdodERpcmVjdGlvbik7XFxuXFxuICAgICAgICBhdHRlbiA9IDEuMCAtIChkaXN0IC8gdUxpZ2h0UmFuZ2UpOyAgICBcXG5cXG4gICAgICAgIFxcblxcbiAgICAgICAgaWYgKGRvdChsaWdodERpcmVjdGlvbiwgLXVMaWdodERpcmVjdGlvbikgPCB1TGlnaHRDdXRvZmYpIHtcXG5cXG4gICAgICAgICAgICBkaXNjYXJkO1xcblxcbiAgICAgICAgfSAgXFxuXFxuICAgIH1cXG5cXG4gICAgXFxuXFxuICAgIHZlYzMgcmVzdWx0ID0gdmVjMygwKTsgICAgXFxuXFxuICAgIGZsb2F0IG5Eb3RMID0gZG90KG5vcm1hbCwgbGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICBpZiAobkRvdEwgPiAwLjApIHsgICAgXFxuXFxuICAgICAgICByZXN1bHQgKz0gbkRvdEwgKiBjb2xvciAqIHVMaWdodENvbG9yICogYXR0ZW47XFxuXFxuICAgICAgICBcXG5cXG4gICAgICAgIHZlYzMgZXllID0gbm9ybWFsaXplKHZFeWUpO1xcblxcbiAgICAgICAgdmVjMyByZWZsZWN0aW9uID0gcmVmbGVjdChub3JtYWwsIGxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgICAgIGZsb2F0IHNoaW5pbmVzcyA9IDEuMCAtIHVSb3VnaG5lc3M7XFxuXFxuICAgICAgICBpZiAodUhhc1JvdWdobmVzc01hcCkge1xcblxcbiAgICAgICAgICAgIHNoaW5pbmVzcyA9IHNoaW5pbmVzcyAqICgxLjAgLSB0ZXh0dXJlMkQodVJvdWdobmVzc01hcCwgdlRleENvb3JkKS5yKTtcXG5cXG4gICAgICAgIH0gICAgICAgIFxcblxcblxcblxcbiAgICAgICAgZmxvYXQgZURvdFIgPSBkb3QoZXllLCByZWZsZWN0aW9uKTtcdFxcblxcbiAgICAgICAgaWYgKGVEb3RSID4gMC4wKVxcblxcbiAgICAgICAge1xcblxcbiAgICAgICAgICAgIC8vIDAtMSAtPiAwLTEyOFxcblxcbiAgICAgICAgICAgIGZsb2F0IHNpID0gcG93KGVEb3RSLCBzaGluaW5lc3MgKiAxMjguMCk7XFxuXFxuICAgICAgICAgICAgcmVzdWx0ICs9IHVMaWdodENvbG9yICogdmVjMyhzaGluaW5lc3MpICAqIHNpO1xcblxcbiAgICAgICAgfVxcblxcbiAgICB9XFxuXFxuICAgICAgICAgICAgXFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQocmVzdWx0LCAxLjApO1xcblxcbn0gICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cXG5cIjtcbnBrem8uU2t5Qm94RnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gc2FtcGxlckN1YmUgdUN1YmVtYXA7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZEaXJlY3Rpb247XFxuXFxuXFxuXFxudm9pZCBtYWluKClcXG5cXG57XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmVDdWJlKHVDdWJlbWFwLCB2RGlyZWN0aW9uKTtcXG5cXG59XFxuXFxuXCI7XG5wa3pvLlNreUJveFZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIG1hdDQgdVByb2plY3Rpb25NYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQ0IHVWaWV3TWF0cml4O1xcblxcblxcblxcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXg7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZEaXJlY3Rpb247XFxuXFxuXFxuXFxudm9pZCBtYWluKClcXG5cXG57XFxuXFxuICAgIHZlYzQgdmVydGV4ICAgICAgICAgICAgPSB2ZWM0KGFWZXJ0ZXgsIDEpO1xcblxcbiAgICBtYXQ0IGludmVyc2VQcm9qZWN0aW9uID0gaW52ZXJzZSh1UHJvamVjdGlvbk1hdHJpeCk7XFxuXFxuICAgIG1hdDMgaW52ZXJzZVZpZXcgICAgICAgPSBpbnZlcnNlKG1hdDModVZpZXdNYXRyaXgpKTtcXG5cXG4gICAgdmVjMyB1bnByb2plY3RlZCAgICAgICA9IChpbnZlcnNlUHJvamVjdGlvbiAqIHZlcnRleCkueHl6O1xcblxcbiAgICBcXG5cXG4gICAgdkRpcmVjdGlvbiAgPSBpbnZlcnNlVmlldyAqIHVucHJvamVjdGVkO1xcblxcbiAgICBnbF9Qb3NpdGlvbiA9IHZlcnRleDtcXG5cXG59XCI7XG5wa3pvLlNvbGlkRnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyB1Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmU7XFxuXFxudW5pZm9ybSBib29sIHVIYXNUZXh0dXJlO1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxuXFxuXFxudm9pZCBtYWluKClcXG5cXG57XFxuXFxuICAgIGlmICh1SGFzVGV4dHVyZSkge1xcblxcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlLCB2VGV4Q29vcmQpICogdmVjNCh1Q29sb3IsIDEpO1xcblxcbiAgICB9XFxuXFxuICAgIGVsc2Uge1xcblxcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh1Q29sb3IsIDEpO1xcblxcbiAgICB9XFxuXFxufVwiO1xucGt6by5Tb2xpZFZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIG1hdDQgdVByb2plY3Rpb25NYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQ0IHVWaWV3TWF0cml4O1xcblxcbnVuaWZvcm0gbWF0NCB1TW9kZWxNYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQzIHVOb3JtYWxNYXRyaXg7XFxuXFxuXFxuXFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleDtcXG5cXG5hdHRyaWJ1dGUgdmVjMyBhTm9ybWFsO1xcblxcbmF0dHJpYnV0ZSB2ZWMyIGFUZXhDb29yZDtcXG5cXG5hdHRyaWJ1dGUgdmVjMyBhVGFuZ2VudDtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzMgdk5vcm1hbDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleENvb3JkO1xcblxcbnZhcnlpbmcgdmVjMyB2UG9zaXRpb247XFxuXFxudmFyeWluZyB2ZWMzIHZFeWU7XFxuXFxudmFyeWluZyBtYXQzIHZUQk47XFxuXFxuXFxuXFxudm9pZCBtYWluKCkge1xcblxcbiAgdmVjMyBuID0gbm9ybWFsaXplKHVOb3JtYWxNYXRyaXggKiBhTm9ybWFsKTtcXG5cXG4gIHZlYzMgdCA9IG5vcm1hbGl6ZSh1Tm9ybWFsTWF0cml4ICogYVRhbmdlbnQpO1xcblxcbiAgdmVjMyBiID0gbm9ybWFsaXplKGNyb3NzKG4sIHQpKTtcXG5cXG4gICAgXFxuXFxuICB2Tm9ybWFsICAgICA9IG47XFxuXFxuICB2VGV4Q29vcmQgICA9IGFUZXhDb29yZDtcXG5cXG4gIHZQb3NpdGlvbiAgID0gdmVjMyh1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXgsIDEuMCkpO1xcblxcbiAgXFxuXFxuICB2RXllICAgICAgICA9IG1hdDModVZpZXdNYXRyaXgpICogLWFWZXJ0ZXg7XFxuXFxuICB2VEJOICAgICAgICA9IG1hdDModCwgYiwgbik7XFxuXFxuICBcXG5cXG4gIGdsX1Bvc2l0aW9uID0gdVByb2plY3Rpb25NYXRyaXggKiB1Vmlld01hdHJpeCAqIHVNb2RlbE1hdHJpeCAqIHZlYzQoYVZlcnRleCwgMSk7XFxuXFxufVwiO1xucGt6by5UcmFuc3Bvc2UgPSBcIlxcblxcbm1hdDIgdGFuc3Bvc2UobWF0MiBtKSB7XFxuXFxuICBtYXQyIHI7XFxuXFxuICBmb3IgKGludCBpID0gMDsgaSA8IDI7IGkrKykge1xcblxcbiAgICBmb3IgKGludCBqID0gMDsgaiA8IDI7IGorKykge1xcblxcbiAgICAgICByW2ldW2pdID0gbVtqXVtpXTtcXG5cXG4gICAgfVxcblxcbiAgfVxcblxcbiAgcmV0dXJuIHI7XFxuXFxufVxcblxcblxcblxcbm1hdDMgdGFuc3Bvc2UobWF0MyBtKSB7XFxuXFxuICBtYXQzIHI7XFxuXFxuICBmb3IgKGludCBpID0gMDsgaSA8IDM7IGkrKykge1xcblxcbiAgICBmb3IgKGludCBqID0gMDsgaiA8IDM7IGorKykge1xcblxcbiAgICAgICByW2ldW2pdID0gbVtqXVtpXTtcXG5cXG4gICAgfVxcblxcbiAgfVxcblxcbiAgcmV0dXJuIHI7XFxuXFxufVxcblxcblxcblxcbm1hdDQgdGFuc3Bvc2UobWF0NCBtKSB7XFxuXFxuICBtYXQ0IHI7XFxuXFxuICBmb3IgKGludCBpID0gMDsgaSA8IDQ7IGkrKykge1xcblxcbiAgICBmb3IgKGludCBqID0gMDsgaiA8IDQ7IGorKykge1xcblxcbiAgICAgICByW2ldW2pdID0gbVtqXVtpXTtcXG5cXG4gICAgfVxcblxcbiAgfVxcblxcbiAgcmV0dXJuIHI7XFxuXFxufVxcblxcblwiO1xuIiwiXHJcbnBrem8udmVjMiA9IGZ1bmN0aW9uICh2MCwgdjEpIHtcclxuICBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgdHlwZW9mIHYxID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MF0pO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MSA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjFdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgyKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8udmVjMyA9IGZ1bmN0aW9uICh2MCwgdjEsIHYyKSB7XHJcbiAgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgIHR5cGVvZiB2MSA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIHYyID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MCwgdjBdKTtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjEgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MiA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjEsIHYyXSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLnZlYzQgPSBmdW5jdGlvbiAodjAsIHYxLCB2MiwgdjQpIHtcclxuICBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgdHlwZW9mIHYxID09PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgdjIgPT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiB2MyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjAsIHYwLCB2MF0pO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MSA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYyID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICAgICAgIHR5cGVvZiB2MyA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjEsIHYyLCB2NF0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDQpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5uZWcgPSBmdW5jdGlvbiAodikge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSh2Lmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gLXZbaV07XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG4vLyBhZGQgYW5kIHN1YiBhbHNvIHdvcmsgZm9yIG1hdHJpeFxyXG5wa3pvLmFkZCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIHJbaV0gPSBhW2ldICsgYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8uc3ViID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gLSBiW2ldO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5kb3QgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciB2ID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIHYgKz0gYVtpXSAqIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiB2O1xyXG59XHJcblxyXG5wa3pvLmNyb3NzID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAvLyBhc3N1bWUgYS5sZW5ndGggPT0gYi5sZW5ndGggPT0gM1xyXG4gIFxyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSgzKTtcclxuICBcclxuICByWzBdID0gKGFbMV0gKiBiWzJdKSAtIChhWzJdICogYlsxXSk7XHJcbiAgclsxXSA9IChhWzJdICogYlswXSkgLSAoYVswXSAqIGJbMl0pO1xyXG4gIHJbMl0gPSAoYVswXSAqIGJbMV0pIC0gKGFbMV0gKiBiWzBdKTtcclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5zdm11bHQgPSBmdW5jdGlvbiAodiwgcykge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSh2Lmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gdltpXSAqIHM7XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLmxlbmd0aCA9IGZ1bmN0aW9uICh2KSB7ICBcclxuICByZXR1cm4gTWF0aC5zcXJ0KHBrem8uZG90KHYsIHYpKTtcclxufVxyXG5cclxucGt6by5ub3JtYWxpemUgPSBmdW5jdGlvbiAodikge1xyXG4gIHJldHVybiBwa3pvLnN2bXVsdCh2LCAxIC8gcGt6by5sZW5ndGgodikpO1xyXG59XHJcblxyXG5wa3pvLm11bHRNYXRyaXhWZWN0b3IgPSBmdW5jdGlvbiAobSwgdikge1xyXG5cdHZhciBuID0gdi5sZW5ndGg7XHJcblx0dmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KG4pO1xyXG5cdFxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKVxyXG5cdHtcclxuXHRcdHJbaV0gPSAwO1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdFx0cltpXSArPSBtW2kqbitqXSAqIHZbal07XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLm1pZHBvaW50ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgcCA9IHBrem8uc3ViKGIsIGEpO1xyXG4gIG0gPSBwa3pvLmFkZChhLCBwa3pvLnN2bXVsdChwLCAwLjUpKTtcclxuICByZXR1cm4gbTtcclxufVxyXG4iLCJcclxucGt6by5tYXQzID0gZnVuY3Rpb24gKHYpIHtcclxuICBpZiAodiAmJiB2Lmxlbmd0aCAmJiB2Lmxlbmd0aCA9PSAxNikge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdlswXSwgdlsxXSwgdlsyXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbNF0sIHZbNV0sIHZbNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzhdLCB2WzldLCB2WzEwXV0pO1xyXG5cdH1cclxuXHRpZiAodiAmJiB2Lmxlbmd0aCkge1xyXG4gICAgaWYgKHYubGVuZ3RoICE9IDkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXQzIG11c3QgYmUgOSB2YWx1ZXMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KHYpO1xyXG4gIH1cclxuICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdiwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCB2LCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIHZdKTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDFdKTtcclxufVxyXG5cclxucGt6by5tYXQ0ID0gZnVuY3Rpb24gKHYpIHtcclxuICBpZiAodiAmJiB2Lmxlbmd0aCkgeyAgICBcclxuICAgIGlmICh2Lmxlbmd0aCAhPSAxNikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDQgbXVzdCBiZSAxNiB2YWx1ZXMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KHYpO1xyXG4gIH1cclxuICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdiwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCB2LCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIHYsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgdl0pO1xyXG4gIH1cclxuICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgMV0pO1xyXG59XHJcblxyXG5wa3pvLm11bHRNYXRyaXggPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIC8vIGFzc3VtZSBhLmxlbmd0aCA9PSBiLmxlbmd0aFxyXG4gIHZhciBuID0gTWF0aC5zcXJ0KGEubGVuZ3RoKTtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKykge1xyXG4gICAgICB2YXIgdiA9IDA7XHJcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbjsgaysrKSB7XHJcbiAgICAgICAgdiA9IHYgKyBhW2kqbitrXSAqIGJbaypuK2pdO1xyXG4gICAgICB9XHJcbiAgICAgIHJbaSpuK2pdID0gdjtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8ucmFkaWFucyA9IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcclxuICByZXR1cm4gZGVncmVlcyAqIE1hdGguUEkgLyAxODA7XHJcbn07XHJcblxyXG5wa3pvLmRlZ3JlZXMgPSBmdW5jdGlvbihyYWRpYW5zKSB7XHJcbiAgcmV0dXJuIHJhZGlhbnMgKiAxODAgLyBNYXRoLlBJO1xyXG59OyBcclxuXHJcblxyXG5wa3pvLm9ydGhvID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XHJcbiAgdmFyIHJsID0gKHJpZ2h0IC0gbGVmdCk7XHJcbiAgdmFyIHRiID0gKHRvcCAtIGJvdHRvbSk7XHJcbiAgdmFyIGZuID0gKGZhciAtIG5lYXIpO1xyXG4gIFxyXG4gIHZhciBtID0gcGt6by5tYXQ0KCk7ICBcclxuICBcclxuICBtWzBdID0gMiAvIHJsO1xyXG4gIG1bMV0gPSAwO1xyXG4gIG1bMl0gPSAwO1xyXG4gIG1bM10gPSAwO1xyXG4gIG1bNF0gPSAwO1xyXG4gIG1bNV0gPSAyIC8gdGI7XHJcbiAgbVs2XSA9IDA7XHJcbiAgbVs3XSA9IDA7XHJcbiAgbVs4XSA9IDA7XHJcbiAgbVs5XSA9IDA7XHJcbiAgbVsxMF0gPSAtMiAvIGZuO1xyXG4gIG1bMTFdID0gMDtcclxuICBtWzEyXSA9IC0obGVmdCArIHJpZ2h0KSAvIHJsO1xyXG4gIG1bMTNdID0gLSh0b3AgKyBib3R0b20pIC8gdGI7XHJcbiAgbVsxNF0gPSAtKGZhciArIG5lYXIpIC8gZm47XHJcbiAgbVsxNV0gPSAxO1xyXG5cclxuICByZXR1cm4gbTtcclxufVxyXG5cclxucGt6by5mcnVzdHVtID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgem5lYXIsIHpmYXIpIHtcclxuICB2YXIgdDEgPSAyICogem5lYXI7XHJcbiAgdmFyIHQyID0gcmlnaHQgLSBsZWZ0O1xyXG4gIHZhciB0MyA9IHRvcCAtIGJvdHRvbTtcclxuICB2YXIgdDQgPSB6ZmFyIC0gem5lYXI7XHJcblxyXG4gIHZhciBtID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XHJcbiAgXHJcbiAgbVswXSA9IHQxL3QyOyBtWzRdID0gICAgIDA7IG1bIDhdID0gIChyaWdodCArIGxlZnQpIC8gdDI7IG1bMTJdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgbVsxXSA9ICAgICAwOyBtWzVdID0gdDEvdDM7IG1bIDldID0gICh0b3AgKyBib3R0b20pIC8gdDM7IG1bMTNdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgbVsyXSA9ICAgICAwOyBtWzZdID0gICAgIDA7IG1bMTBdID0gKC16ZmFyIC0gem5lYXIpIC8gdDQ7IG1bMTRdID0gKC10MSAqIHpmYXIpIC8gdDQ7XHJcbiAgbVszXSA9ICAgICAwOyBtWzddID0gICAgIDA7IG1bMTFdID0gICAgICAgICAgICAgICAgICAgLTE7IG1bMTVdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnBrem8ucGVyc3BlY3RpdmUgPSBmdW5jdGlvbiAoZm92eSwgYXNwZWN0LCB6bmVhciwgemZhcikge1xyXG4gIHZhciB5bWF4ID0gem5lYXIgKiBNYXRoLnRhbihwa3pvLnJhZGlhbnMoZm92eSkpO1xyXG4gIHZhciB4bWF4ID0geW1heCAqIGFzcGVjdDtcclxuICByZXR1cm4gcGt6by5mcnVzdHVtKC14bWF4LCB4bWF4LCAteW1heCwgeW1heCwgem5lYXIsIHpmYXIpO1xyXG59XHJcblxyXG4vLyBOT1RFOiB0aGlzIGlzIGluZWZmaWNpZW50LCBpdCBtYXkgYmUgc2Vuc2libGUgdG8gcHJvdmlkZSBpbnBsYWNlIHZlcnNpb25zXHJcbnBrem8udHJhbnNsYXRlID0gZnVuY3Rpb24obSwgeCwgeSwgeikgeyAgICBcclxuICB2YXIgciA9IHBrem8ubWF0NChtKTtcclxuICByWzEyXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXTtcclxuICByWzEzXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcclxuICByWzE0XSA9IG1bMl0gKiB4ICsgbVs2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcclxuICByWzE1XSA9IG1bM10gKiB4ICsgbVs3XSAqIHkgKyBtWzExXSAqIHogKyBtWzE1XTtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5yb3RhdGUgPSBmdW5jdGlvbiAobSwgYW5nbGUsIHgsIHksIHopIHsgIFxyXG4gIHZhciBhID0gcGt6by5yYWRpYW5zKGFuZ2xlKTtcclxuICB2YXIgYyA9IE1hdGguY29zKGEpO1xyXG4gIHZhciBzID0gTWF0aC5zaW4oYSk7XHJcbiAgXHJcbiAgdmFyIGwgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICB2YXIgbnggPSB4IC8gbDtcclxuICB2YXIgbnkgPSB5IC8gbDtcclxuICB2YXIgbnogPSB6IC8gbDtcclxuXHJcbiAgdmFyIHQwID0gbnggKiAoMSAtIGMpO1xyXG4gIHZhciB0MSA9IG55ICogKDEgLSBjKTtcclxuICB2YXIgdDIgPSBueiAqICgxIC0gYyk7ICBcclxuXHJcbiAgdmFyIGQgPSBwa3pvLm1hdDQoMSk7XHJcbiAgXHJcbiAgZFsgMF0gPSBjICsgdDAgKiBueDtcclxuICBkWyAxXSA9IDAgKyB0MCAqIG55ICsgcyAqIG56O1xyXG4gIGRbIDJdID0gMCArIHQwICogbnogLSBzICogbnk7XHJcblxyXG4gIGRbIDRdID0gMCArIHQxICogbnggLSBzICogbno7XHJcbiAgZFsgNV0gPSBjICsgdDEgKiBueTtcclxuICBkWyA2XSA9IDAgKyB0MSAqIG56ICsgcyAqIG54O1xyXG5cclxuICBkWyA4XSA9IDAgKyB0MiAqIG54ICsgcyAqIG55O1xyXG4gIGRbIDldID0gMCArIHQyICogbnkgLSBzICogbng7XHJcbiAgZFsxMF0gPSBjICsgdDIgKiBuejsgIFxyXG4gIFxyXG4gIHZhciByID0gcGt6by5tdWx0TWF0cml4KG0sIGQpO1xyXG4gIFxyXG4gIHJbMTJdID0gbVsxMl07XHJcbiAgclsxM10gPSBtWzEzXTtcclxuICByWzE0XSA9IG1bMTRdO1xyXG4gIHJbMTVdID0gbVsxNV07XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8uc2NhbGUgPSBmdW5jdGlvbihtLCB4LCB5LCB6KSB7ICAgIFxyXG4gIHZhciByID0gcGt6by5tYXQ0KDEpO1xyXG4gIFxyXG4gIHJbIDBdID0gbVsgMF0gKiB4OyBcclxuICByWyAxXSA9IG1bIDFdICogeDsgXHJcbiAgclsgMl0gPSBtWyAyXSAqIHg7IFxyXG4gIHJbIDNdID0gbVsgM10gKiB4OyBcclxuICBcclxuICByWyA0XSA9IG1bIDRdICogeTsgXHJcbiAgclsgNV0gPSBtWyA1XSAqIHk7IFxyXG4gIHJbIDZdID0gbVsgNl0gKiB5OyBcclxuICByWyA3XSA9IG1bIDddICogeTsgXHJcbiAgXHJcbiAgclsgOF0gPSBtWyA4XSAqIHo7XHJcbiAgclsgOV0gPSBtWyA5XSAqIHo7XHJcbiAgclsxMF0gPSBtWzEwXSAqIHo7XHJcbiAgclsxMV0gPSBtWzExXSAqIHo7XHJcbiAgXHJcbiAgclsxMl0gPSBtWzEyXTtcclxuICByWzEzXSA9IG1bMTNdO1xyXG4gIHJbMTRdID0gbVsxNF07XHJcbiAgclsxNV0gPSBtWzE1XTtcclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by50cmFuc3Bvc2UgPSBmdW5jdGlvbihtKSB7ICAgIFxyXG4gIHZhciBuID0gTWF0aC5zcXJ0KG0ubGVuZ3RoKTtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkobS5sZW5ndGgpO1xyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKykge1xyXG4gICAgICByW2oqbitpXSA9IG1baSpuK2pdO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG4iLCJcclxucGt6by5DYW52YXMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5jYW52YXMgPSBlbGVtZW50O1xyXG4gIH0gIFxyXG4gIFxyXG4gIHRoaXMuY2FudmFzLndpZHRoICA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xyXG4gIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIiwge2FudGlhbGlhczogdHJ1ZSwgZGVwdGg6IHRydWV9KTtcclxuICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcclxuICBcclxuICAvLyB0aGVzZSB2YWx1ZXMgYXJlIGZvciB0aGUgcHJvZ3JhbW1lciBvZiB0aGUgZHJhdyBmdW5jdGlvbiwgXHJcbiAgLy8gd2UgcGFzcyB0aGUgZ2wgb2JqZWN0LCBub3QgdGhlIGNhbnZhcy5cclxuICB0aGlzLmdsLndpZHRoICA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gIHRoaXMuZ2wuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG59XHJcblxyXG5wa3pvLkNhbnZhcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChjYikge1xyXG4gIGlmIChjYikge1xyXG4gICAgY2IuY2FsbCh0aGlzLCB0aGlzLmdsKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQ2FudmFzLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGNiKSB7ICBcclxuICBpZiAodGhpcy5jYW52YXMud2lkdGggIT0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGggfHwgdGhpcy5jYW52YXMuaGVpZ2h0ICE9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodCkge1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggID0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7ICBcclxuICAgIHRoaXMuZ2wud2lkdGggID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICB0aGlzLmdsLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IHRoaXMuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbiAgXHJcbiAgaWYgKGNiKSB7XHJcbiAgICBjYi5jYWxsKHRoaXMsIHRoaXMuZ2wpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLlRleHR1cmUgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgdGhpcy51cmwgICAgPSB1cmw7XHJcbiAgdGhpcy5pbWFnZSAgPSBudWxsO1xyXG4gIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgXHJcbiAgLy8gd2UgZG9uJ3QgdXBsb2FkIHRoZSBpbWFnZSB0byBWUkFNLCBidXQgdHJ5IHRvIGxvYWQgaXRcclxuICB0aGlzLmxvYWQoKTtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLmxvYWQgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgLy8gVE9ETyBtYWtlIHRoZSBhcGx5IGNsZWFuZXJcclxuICByZXR1cm4gbmV3IHBrem8uVGV4dHVyZSh1cmwpO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoKSB7XHRcclxuICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgdmFyIHRleHR1cmUgPSB0aGlzO1xyXG4gIHRoaXMuaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGV4dHVyZS5sb2FkZWQgPSB0cnVlOyAgICBcclxuICB9O1xyXG4gIHRoaXMuaW1hZ2Uuc3JjID0gdGhpcy51cmw7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUudXBsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghIHRoaXMubG9hZGVkKSB7XHJcbiAgICB0aHJvdyBFcnJvcignQ2FuIG5vdCB1cGxvYWQgdGV4dHVyZSB0aGF0IGlzIG5vdCBsb2FkZWQgeWV0LicpO1xyXG4gIH1cclxuICBcclxuICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuaWQpO1xyXG4gIFxyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfMkQsIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW1hZ2UpOyAgXHJcbiAgdGhpcy5nbC5nZW5lcmF0ZU1pcG1hcCh0aGlzLmdsLlRFWFRVUkVfMkQpO1xyXG4gIFxyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLmdsLkxJTkVBUik7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMuZ2wuTElORUFSX01JUE1BUF9MSU5FQVIpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMuZ2wuUkVQRUFUKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLmdsLlJFUEVBVCk7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmdsLmRlbGV0ZVRleHR1cmUodGhpcy5pZCk7XHJcbiAgdGhpcy5pZCA9IG51bGw7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChnbCwgY2hhbm5lbCkge1xyXG5cdHRoaXMuZ2wgPSBnbDsgIFxyXG4gICAgXHJcbiAgdGhpcy5nbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgY2hhbm5lbCk7XHJcbiAgXHJcbiAgaWYgKHRoaXMubG9hZGVkKSB7ICBcclxuICAgIGlmICghIHRoaXMuaWQpIHtcclxuICAgICAgdGhpcy51cGxvYWQoKTtcclxuICAgIH1cclxuICAgIGVsc2UgXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgMCk7XHJcbiAgfVxyXG59XHJcbiIsIlxyXG5wa3pvLkN1YmVNYXAgPSBmdW5jdGlvbiAoKSB7ICBcclxuICB0aGlzLmxvYWRlZCA9IGZhbHNlOyAgXHJcbn1cclxuXHJcbnBrem8uQ3ViZU1hcC5sb2FkID0gZnVuY3Rpb24gKHRleHR1cmVzKSB7XHJcbiAgdmFyIGNtID0gbmV3IHBrem8uQ3ViZU1hcCgpO1xyXG4gIGNtLmxvYWQodGV4dHVyZXMpO1xyXG4gIHJldHVybiBjbTtcclxufVxyXG5cclxucGt6by5DdWJlTWFwLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKHRleHR1cmVzKSB7XHJcbiAgdmFyIGN1YmVtYXAgPSB0aGlzO1xyXG4gIHRoaXMubG9hZENvdW50ID0gMDtcclxuICBcclxuICB2YXIgb25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY3ViZW1hcC5sb2FkQ291bnQrKztcclxuICAgIGlmIChjdWJlbWFwLmxvYWRDb3VudCA9PSA2KSB7XHJcbiAgICAgIGN1YmVtYXAubG9hZGVkID0gdHJ1ZTsgICAgICBcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIHRoaXMueHBvc0ltYWdlID0gbmV3IEltYWdlKCk7ICBcclxuICB0aGlzLnhwb3NJbWFnZS5vbmxvYWQgPSBvbmxvYWQ7XHJcbiAgdGhpcy54cG9zSW1hZ2Uuc3JjICAgID0gdGV4dHVyZXMueHBvcztcclxuICBcclxuICB0aGlzLnhuZWdJbWFnZSA9IG5ldyBJbWFnZSgpOyAgXHJcbiAgdGhpcy54bmVnSW1hZ2Uub25sb2FkID0gb25sb2FkO1xyXG4gIHRoaXMueG5lZ0ltYWdlLnNyYyAgICA9IHRleHR1cmVzLnhuZWc7XHJcbiAgXHJcbiAgdGhpcy55cG9zSW1hZ2UgPSBuZXcgSW1hZ2UoKTsgIFxyXG4gIHRoaXMueXBvc0ltYWdlLm9ubG9hZCA9IG9ubG9hZDtcclxuICB0aGlzLnlwb3NJbWFnZS5zcmMgICAgPSB0ZXh0dXJlcy55cG9zO1xyXG4gIFxyXG4gIHRoaXMueW5lZ0ltYWdlID0gbmV3IEltYWdlKCk7ICBcclxuICB0aGlzLnluZWdJbWFnZS5vbmxvYWQgPSBvbmxvYWQ7XHJcbiAgdGhpcy55bmVnSW1hZ2Uuc3JjICAgID0gdGV4dHVyZXMueW5lZztcclxuICBcclxuICB0aGlzLnpwb3NJbWFnZSA9IG5ldyBJbWFnZSgpOyAgXHJcbiAgdGhpcy56cG9zSW1hZ2Uub25sb2FkID0gb25sb2FkO1xyXG4gIHRoaXMuenBvc0ltYWdlLnNyYyAgICA9IHRleHR1cmVzLnpwb3M7XHJcbiAgXHJcbiAgdGhpcy56bmVnSW1hZ2UgPSBuZXcgSW1hZ2UoKTsgIFxyXG4gIHRoaXMuem5lZ0ltYWdlLm9ubG9hZCA9IG9ubG9hZDtcclxuICB0aGlzLnpuZWdJbWFnZS5zcmMgICAgPSB0ZXh0dXJlcy56bmVnO1xyXG59XHJcblxyXG5wa3pvLkN1YmVNYXAucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoISB0aGlzLmxvYWRlZCkge1xyXG4gICAgdGhyb3cgRXJyb3IoJ0NhbiBub3QgdXBsb2FkIHRleHR1cmUgdGhhdCBpcyBub3QgbG9hZGVkIHlldC4nKTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLmlkKTtcclxuICBcclxuICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gsIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMueHBvc0ltYWdlKTtcclxuICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1gsIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMueG5lZ0ltYWdlKTtcclxuICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ksIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMueXBvc0ltYWdlKTtcclxuICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1ksIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMueW5lZ0ltYWdlKTtcclxuICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1osIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuenBvc0ltYWdlKTtcclxuICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1osIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuem5lZ0ltYWdlKTtcclxuICBcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLmdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy5nbC5MSU5FQVIpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMuZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLmdsLkxJTkVBUik7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy5nbC5URVhUVVJFX1dSQVBfUywgdGhpcy5nbC5DTEFNUF9UT19FREdFKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLmdsLkNMQU1QX1RPX0VER0UpO1xyXG59XHJcblxyXG5wa3pvLkN1YmVNYXAucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVUZXh0dXJlKHRoaXMuaWQpO1xyXG4gIHRoaXMuaWQgPSBudWxsO1xyXG59XHJcblxyXG5wa3pvLkN1YmVNYXAucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZ2wsIGNoYW5uZWwpIHtcclxuICB0aGlzLmdsID0gZ2w7ICBcclxuICAgIFxyXG4gIHRoaXMuZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIGNoYW5uZWwpO1xyXG4gIFxyXG4gIGlmICh0aGlzLmxvYWRlZCkgeyAgXHJcbiAgICBpZiAoISB0aGlzLmlkKSB7XHJcbiAgICAgIHRoaXMudXBsb2FkKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIFxyXG4gICAge1xyXG4gICAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy5pZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVAsIDApO1xyXG4gIH1cclxufVxyXG5cclxuIiwiXHJcbnBrem8uU2hhZGVyID0gZnVuY3Rpb24gKGdsLCB2ZXJ0ZXhDb2RlLCBmcmFnbWVudENvZGUpIHtcclxuICB0aGlzLmdsICAgICAgICAgICA9IGdsO1xyXG4gIHRoaXMudmVydGV4Q29kZSAgID0gdmVydGV4Q29kZTtcclxuICB0aGlzLmZyYWdtZW50Q29kZSA9IGZyYWdtZW50Q29kZTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmNvbXBpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHZlcnRleFNoYWRlciAgID0gdGhpcy5jb21waWxlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUiwgICB0aGlzLnZlcnRleENvZGUpO1xyXG4gIHZhciBmcmFnbWVudFNoYWRlciA9IHRoaXMuY29tcGlsZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUiwgdGhpcy5mcmFnbWVudENvZGUpO1xyXG4gIFxyXG4gIHZhciBwcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgXHJcbiAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcclxuICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XHJcbiAgXHJcbiAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICBcclxuICB2YXIgaW5mb0xvZyA9IHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XHJcbiAgaWYgKHRoaXMuZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCB0aGlzLmdsLkxJTktfU1RBVFVTKSA9PT0gZmFsc2UpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihpbmZvTG9nKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoaW5mb0xvZyAhPT0gJycpIHtcclxuICAgIGNvbnNvbGUubG9nKGluZm9Mb2cpO1xyXG4gIH1cclxuICBcclxuICB0aGlzLmdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xyXG4gIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcclxuICBcclxuICB0aGlzLmlkID0gcHJvZ3JhbTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmNvbXBpbGVTaGFkZXIgPSBmdW5jdGlvbiAodHlwZSwgY29kZSkge1xyXG4gIHZhciBpZCA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHR5cGUpOyAgXHJcbiAgXHJcbiAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoaWQsIGNvZGUpO1xyXG4gIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihpZCk7XHJcbiAgXHJcbiAgdmFyIGluZm9Mb2cgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coaWQpO1xyXG4gIGlmICh0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihpZCwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykgPT09IGZhbHNlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoaW5mb0xvZyk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGluZm9Mb2cgIT09ICcnKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbmZvTG9nKTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGlkO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmdsLmRlbGV0ZVByb2dyYW0oaWQpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuaWQpIHtcclxuICAgIHRoaXMuY29tcGlsZSgpO1xyXG4gIH1cclxuICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5pZCk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRBcnJ0aWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgYnVmZmVyLCBlbGVtZW50U2l6ZSkgeyAgXHJcbiAgYnVmZmVyLmJpbmQoKTsgIFxyXG4gIFxyXG4gIGlmIChlbGVtZW50U2l6ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB2YXIgZWxlbWVudFNpemUgPSBidWZmZXIuZWxlbWVudFNpemU7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBwb3MgPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpOyAgXHJcbiAgaWYgKHBvcyAhPSAtMSkge1xyXG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwb3MpO1xyXG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvcywgZWxlbWVudFNpemUsIGJ1ZmZlci5lbGVtZW50VHlwZSwgdGhpcy5nbC5GQUxTRSwgMCwgMCk7ICBcclxuICB9XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtMWkgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgaWYgKGxvYyAhPSAtMSkge1xyXG4gICAgdGhpcy5nbC51bmlmb3JtMWkobG9jLCB2YWx1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTFmID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIGlmIChsb2MgIT0gLTEpIHtcclxuICAgIHRoaXMuZ2wudW5pZm9ybTFmKGxvYywgdmFsdWUpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0yZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgaWYgKGxvYyAhPSAtMSkge1xyXG4gICAgdGhpcy5nbC51bmlmb3JtMmYobG9jLCB2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0zZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgaWYgKGxvYyAhPSAtMSkge1xyXG4gICAgdGhpcy5nbC51bmlmb3JtM2YobG9jLCB2YWx1ZVswXSwgdmFsdWVbMV0sIHZhbHVlWzJdKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtNGZ2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIGlmIChsb2MgIT0gLTEpIHtcclxuICAgIHRoaXMuZ2wudW5pZm9ybTRmKGxvYywgdmFsdWVbMF0sIHZhbHVlWzFdLCB2YWx1ZVsyXSwgdmFsdWVbNF0pO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm1NYXRyaXgzZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIHRyYW5zcG9zZSkge1xyXG4gIGlmICh0cmFuc3Bvc2UgPT09IHVuZGVmaW5lZCB8fHRyYW5zcG9zZSA9PT0gbnVsbCkge1xyXG4gICAgdmFyIHRyYW5zcG9zZSA9IGZhbHNlO1xyXG4gIH1cclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgaWYgKGxvYyAhPSAtMSkge1xyXG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KGxvYywgdHJhbnNwb3NlLCB2YWx1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybU1hdHJpeDRmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgdHJhbnNwb3NlKSB7XHJcbiAgaWYgKHRyYW5zcG9zZSA9PT0gdW5kZWZpbmVkIHx8dHJhbnNwb3NlID09PSBudWxsKSB7XHJcbiAgICB2YXIgdHJhbnNwb3NlID0gZmFsc2U7XHJcbiAgfVxyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICBpZiAobG9jICE9IC0xKSB7XHJcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXg0ZnYobG9jLCB0cmFuc3Bvc2UsIHZhbHVlKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5TY2VuZSA9IGZ1bmN0aW9uICgpIHtcclxuXHR0aGlzLmFtYmllbnRMaWdodCA9IHBrem8udmVjMygwLjIsIDAuMiwgMC4yKTtcdFxyXG59XHJcblxyXG5wa3pvLlNjZW5lLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcblx0aWYgKHRoaXMuZW50aXRpZXMpIHtcclxuXHRcdHRoaXMuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50aXR5KSB7XHJcblx0XHRcdGVudGl0eS5lbnF1ZXVlKHJlbmRlcmVyKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxucGt6by5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVudGl0eSkge1xyXG4gIGlmICghIHRoaXMuZW50aXRpZXMpIHtcclxuICAgIHRoaXMuZW50aXRpZXMgPSBbZW50aXR5XVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xyXG4gIH1cclxufSIsIlxyXG5wa3pvLkJ1ZmZlciA9IGZ1bmN0aW9uIChnbCwgZGF0YSwgYnR5cGUsIGV0eXBlKSB7XHJcbiAgdGhpcy5nbCA9IGdsO1xyXG4gIFxyXG4gIGlmIChidHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBnbC5BUlJBWV9CVUZGRVI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy50eXBlID0gYnR5cGU7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChldHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAodGhpcy50eXBlID09IGdsLkFSUkFZX0JVRkZFUikge1xyXG4gICAgICB0aGlzLmVsZW1lbnRUeXBlID0gZ2wuRkxPQVQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5lbGVtZW50VHlwZSA9IGdsLlVOU0lHTkVEX1NIT1JUO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZWxlbWVudFR5cGUgPSBldHlwZTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5sb2FkKGRhdGEpO1xyXG59XHJcblxyXG5wa3pvLndyYXBBcnJheSA9IGZ1bmN0aW9uIChnbCwgdHlwZSwgZGF0YSkge1xyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSBnbC5GTE9BVDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLkRPVUJMRTpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDY0QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX0JZVEU6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuVU5TSUdORURfU0hPUlQ6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDE2QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVDpcclxuICAgICAgcmV0dXJuIG5ldyBVaW50MzJBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuQllURTpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlNIT1JUOlxyXG4gICAgICByZXR1cm4gbmV3IEludDE2QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLklOVDpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQzMkFycmF5KGRhdGEpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoZGF0YSkgeyAgXHJcbiAgaWYgKGRhdGFbMF0ubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMuZWxlbWVudFNpemUgPSAxO1xyXG4gICAgdGhpcy5kYXRhID0gcGt6by53cmFwQXJyYXkodGhpcy5nbCwgdGhpcy5lbGVtZW50VHlwZSwgZGF0YSk7XHJcbiAgfVxyXG4gIGVsc2UgeyAgICBcclxuICAgIHRoaXMuZWxlbWVudFNpemUgPSBkYXRhWzBdLmxlbmd0aDtcclxuICAgIHRoaXMuZGF0YSA9IHBrem8ud3JhcEFycmF5KHRoaXMuZ2wsIHRoaXMuZWxlbWVudFR5cGUsIGRhdGEubGVuZ3RoICogdGhpcy5lbGVtU2l6ZSk7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB2YXIgYnVmZmVyID0gdGhpcztcclxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICBlbGVtLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICBidWZmZXIuZGF0YVtpXSA9IHY7XHJcbiAgICAgICAgaSsrO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy50eXBlLCB0aGlzLmlkKTtcclxuICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy50eXBlLCB0aGlzLmRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAodGhpcy5pZCkge1xyXG4gICAgdGhpcy5nbC5kZWxldGVCdWZmZXIodGhpcy5pZCk7XHJcbiAgICB0aGlzLmlkID0gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ocHJpbWl0aXZlKSB7XHJcbiAgaWYgKCEgdGhpcy5pZCkge1xyXG4gICAgdGhpcy51cGxvYWQoKTtcclxuICB9XHJcbiAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMudHlwZSwgdGhpcy5pZCk7XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24ocHJpbWl0aXZlKSB7XHJcbiAgdGhpcy5iaW5kKCk7XHJcbiAgdGhpcy5nbC5kcmF3RWxlbWVudHMocHJpbWl0aXZlLCB0aGlzLmRhdGEubGVuZ3RoLCB0aGlzLmVsZW1lbnRUeXBlLCAwKTtcclxufVxyXG5cclxuXHJcbiIsInBrem8uUGx5UGFyc2VyID0gKGZ1bmN0aW9uKCkge1xuICAvKlxuICAgKiBHZW5lcmF0ZWQgYnkgUEVHLmpzIDAuOC4wLlxuICAgKlxuICAgKiBodHRwOi8vcGVnanMubWFqZGEuY3ovXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBlZyRzdWJjbGFzcyhjaGlsZCwgcGFyZW50KSB7XG4gICAgZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9XG4gICAgY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7XG4gIH1cblxuICBmdW5jdGlvbiBTeW50YXhFcnJvcihtZXNzYWdlLCBleHBlY3RlZCwgZm91bmQsIG9mZnNldCwgbGluZSwgY29sdW1uKSB7XG4gICAgdGhpcy5tZXNzYWdlICA9IG1lc3NhZ2U7XG4gICAgdGhpcy5leHBlY3RlZCA9IGV4cGVjdGVkO1xuICAgIHRoaXMuZm91bmQgICAgPSBmb3VuZDtcbiAgICB0aGlzLm9mZnNldCAgID0gb2Zmc2V0O1xuICAgIHRoaXMubGluZSAgICAgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uICAgPSBjb2x1bW47XG5cbiAgICB0aGlzLm5hbWUgICAgID0gXCJTeW50YXhFcnJvclwiO1xuICB9XG5cbiAgcGVnJHN1YmNsYXNzKFN5bnRheEVycm9yLCBFcnJvcik7XG5cbiAgZnVuY3Rpb24gcGFyc2UoaW5wdXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDoge30sXG5cbiAgICAgICAgcGVnJEZBSUxFRCA9IHt9LFxuXG4gICAgICAgIHBlZyRzdGFydFJ1bGVGdW5jdGlvbnMgPSB7IHBseTogcGVnJHBhcnNlcGx5IH0sXG4gICAgICAgIHBlZyRzdGFydFJ1bGVGdW5jdGlvbiAgPSBwZWckcGFyc2VwbHksXG5cbiAgICAgICAgcGVnJGMwID0gcGVnJEZBSUxFRCxcbiAgICAgICAgcGVnJGMxID0gXCJwbHlcIixcbiAgICAgICAgcGVnJGMyID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwicGx5XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJwbHlcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMzID0gW10sXG4gICAgICAgIHBlZyRjNCA9IFwiZW5kX2hlYWRlclwiLFxuICAgICAgICBwZWckYzUgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJlbmRfaGVhZGVyXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJlbmRfaGVhZGVyXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNiA9IFwiZm9ybWF0XCIsXG4gICAgICAgIHBlZyRjNyA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImZvcm1hdFwiLCBkZXNjcmlwdGlvbjogXCJcXFwiZm9ybWF0XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjOCA9IFwiYXNjaWlcIixcbiAgICAgICAgcGVnJGM5ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiYXNjaWlcIiwgZGVzY3JpcHRpb246IFwiXFxcImFzY2lpXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMTAgPSBcIjEuMFwiLFxuICAgICAgICBwZWckYzExID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiMS4wXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCIxLjBcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMxMiA9IFwiY29tbWVudFwiLFxuICAgICAgICBwZWckYzEzID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiY29tbWVudFwiLCBkZXNjcmlwdGlvbjogXCJcXFwiY29tbWVudFxcXCJcIiB9LFxuICAgICAgICBwZWckYzE0ID0gL15bXlxcblxccl0vLFxuICAgICAgICBwZWckYzE1ID0geyB0eXBlOiBcImNsYXNzXCIsIHZhbHVlOiBcIlteXFxcXG5cXFxccl1cIiwgZGVzY3JpcHRpb246IFwiW15cXFxcblxcXFxyXVwiIH0sXG4gICAgICAgIHBlZyRjMTYgPSBmdW5jdGlvbihhLCBiKSB7YS5wcm9wZXJ0aWVzID0gYjsgZWxlbWVudHMucHVzaChhKTt9LFxuICAgICAgICBwZWckYzE3ID0gXCJlbGVtZW50XCIsXG4gICAgICAgIHBlZyRjMTggPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJlbGVtZW50XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJlbGVtZW50XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMTkgPSBmdW5jdGlvbihhLCBiKSB7cmV0dXJuIHt0eXBlOiBhLCBjb3VudDogYn07fSxcbiAgICAgICAgcGVnJGMyMCA9IFwidmVydGV4XCIsXG4gICAgICAgIHBlZyRjMjEgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ2ZXJ0ZXhcIiwgZGVzY3JpcHRpb246IFwiXFxcInZlcnRleFxcXCJcIiB9LFxuICAgICAgICBwZWckYzIyID0gXCJmYWNlXCIsXG4gICAgICAgIHBlZyRjMjMgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJmYWNlXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJmYWNlXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMjQgPSBcInByb3BlcnR5XCIsXG4gICAgICAgIHBlZyRjMjUgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJwcm9wZXJ0eVwiLCBkZXNjcmlwdGlvbjogXCJcXFwicHJvcGVydHlcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMyNiA9IGZ1bmN0aW9uKGEpIHtyZXR1cm4gYTt9LFxuICAgICAgICBwZWckYzI3ID0gXCJmbG9hdFwiLFxuICAgICAgICBwZWckYzI4ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiZmxvYXRcIiwgZGVzY3JpcHRpb246IFwiXFxcImZsb2F0XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMjkgPSBcInVpbnRcIixcbiAgICAgICAgcGVnJGMzMCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInVpbnRcIiwgZGVzY3JpcHRpb246IFwiXFxcInVpbnRcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMzMSA9IFwiaW50XCIsXG4gICAgICAgIHBlZyRjMzIgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJpbnRcIiwgZGVzY3JpcHRpb246IFwiXFxcImludFxcXCJcIiB9LFxuICAgICAgICBwZWckYzMzID0gXCJ1Y2hhclwiLFxuICAgICAgICBwZWckYzM0ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwidWNoYXJcIiwgZGVzY3JpcHRpb246IFwiXFxcInVjaGFyXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMzUgPSBcImNoYXJcIixcbiAgICAgICAgcGVnJGMzNiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImNoYXJcIiwgZGVzY3JpcHRpb246IFwiXFxcImNoYXJcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMzNyA9IFwibGlzdFwiLFxuICAgICAgICBwZWckYzM4ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwibGlzdFwiLCBkZXNjcmlwdGlvbjogXCJcXFwibGlzdFxcXCJcIiB9LFxuICAgICAgICBwZWckYzM5ID0gXCJ4XCIsXG4gICAgICAgIHBlZyRjNDAgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ4XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ4XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNDEgPSBcInlcIixcbiAgICAgICAgcGVnJGM0MiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInlcIiwgZGVzY3JpcHRpb246IFwiXFxcInlcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM0MyA9IFwielwiLFxuICAgICAgICBwZWckYzQ0ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwielwiLCBkZXNjcmlwdGlvbjogXCJcXFwielxcXCJcIiB9LFxuICAgICAgICBwZWckYzQ1ID0gXCJueFwiLFxuICAgICAgICBwZWckYzQ2ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwibnhcIiwgZGVzY3JpcHRpb246IFwiXFxcIm54XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNDcgPSBcIm55XCIsXG4gICAgICAgIHBlZyRjNDggPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJueVwiLCBkZXNjcmlwdGlvbjogXCJcXFwibnlcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM0OSA9IFwibnpcIixcbiAgICAgICAgcGVnJGM1MCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIm56XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJuelxcXCJcIiB9LFxuICAgICAgICBwZWckYzUxID0gXCJzXCIsXG4gICAgICAgIHBlZyRjNTIgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJzXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJzXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNTMgPSBcInRcIixcbiAgICAgICAgcGVnJGM1NCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInRcIiwgZGVzY3JpcHRpb246IFwiXFxcInRcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM1NSA9IFwidmVydGV4X2luZGljZXNcIixcbiAgICAgICAgcGVnJGM1NiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInZlcnRleF9pbmRpY2VzXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ2ZXJ0ZXhfaW5kaWNlc1xcXCJcIiB9LFxuICAgICAgICBwZWckYzU3ID0gZnVuY3Rpb24oYSkge2RlY29kZUxpbmUoYSk7fSxcbiAgICAgICAgcGVnJGM1OCA9IG51bGwsXG4gICAgICAgIHBlZyRjNTkgPSBcIi1cIixcbiAgICAgICAgcGVnJGM2MCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIi1cIiwgZGVzY3JpcHRpb246IFwiXFxcIi1cXFwiXCIgfSxcbiAgICAgICAgcGVnJGM2MSA9IC9eWzAtOV0vLFxuICAgICAgICBwZWckYzYyID0geyB0eXBlOiBcImNsYXNzXCIsIHZhbHVlOiBcIlswLTldXCIsIGRlc2NyaXB0aW9uOiBcIlswLTldXCIgfSxcbiAgICAgICAgcGVnJGM2MyA9IFwiLlwiLFxuICAgICAgICBwZWckYzY0ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiLlwiLCBkZXNjcmlwdGlvbjogXCJcXFwiLlxcXCJcIiB9LFxuICAgICAgICBwZWckYzY1ID0gZnVuY3Rpb24oYSkge3JldHVybiBwYXJzZUZsb2F0KHN0ckpvaW4oYSkpO30sXG4gICAgICAgIHBlZyRjNjYgPSAvXlsgXFx0XFx4MEJdLyxcbiAgICAgICAgcGVnJGM2NyA9IHsgdHlwZTogXCJjbGFzc1wiLCB2YWx1ZTogXCJbIFxcXFx0XFxcXHgwQl1cIiwgZGVzY3JpcHRpb246IFwiWyBcXFxcdFxcXFx4MEJdXCIgfSxcbiAgICAgICAgcGVnJGM2OCA9IFwiXFxyXFxuXCIsXG4gICAgICAgIHBlZyRjNjkgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJcXHJcXG5cIiwgZGVzY3JpcHRpb246IFwiXFxcIlxcXFxyXFxcXG5cXFwiXCIgfSxcbiAgICAgICAgcGVnJGM3MCA9IFwiXFxuXCIsXG4gICAgICAgIHBlZyRjNzEgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJcXG5cIiwgZGVzY3JpcHRpb246IFwiXFxcIlxcXFxuXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNzIgPSBcIlxcclwiLFxuICAgICAgICBwZWckYzczID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiXFxyXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJcXFxcclxcXCJcIiB9LFxuICAgICAgICBwZWckYzc0ID0gZnVuY3Rpb24oKSB7bGluZXMrK30sXG5cbiAgICAgICAgcGVnJGN1cnJQb3MgICAgICAgICAgPSAwLFxuICAgICAgICBwZWckcmVwb3J0ZWRQb3MgICAgICA9IDAsXG4gICAgICAgIHBlZyRjYWNoZWRQb3MgICAgICAgID0gMCxcbiAgICAgICAgcGVnJGNhY2hlZFBvc0RldGFpbHMgPSB7IGxpbmU6IDEsIGNvbHVtbjogMSwgc2VlbkNSOiBmYWxzZSB9LFxuICAgICAgICBwZWckbWF4RmFpbFBvcyAgICAgICA9IDAsXG4gICAgICAgIHBlZyRtYXhGYWlsRXhwZWN0ZWQgID0gW10sXG4gICAgICAgIHBlZyRzaWxlbnRGYWlscyAgICAgID0gMCxcblxuICAgICAgICBwZWckcmVzdWx0O1xuXG4gICAgaWYgKFwic3RhcnRSdWxlXCIgaW4gb3B0aW9ucykge1xuICAgICAgaWYgKCEob3B0aW9ucy5zdGFydFJ1bGUgaW4gcGVnJHN0YXJ0UnVsZUZ1bmN0aW9ucykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3Qgc3RhcnQgcGFyc2luZyBmcm9tIHJ1bGUgXFxcIlwiICsgb3B0aW9ucy5zdGFydFJ1bGUgKyBcIlxcXCIuXCIpO1xuICAgICAgfVxuXG4gICAgICBwZWckc3RhcnRSdWxlRnVuY3Rpb24gPSBwZWckc3RhcnRSdWxlRnVuY3Rpb25zW29wdGlvbnMuc3RhcnRSdWxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXh0KCkge1xuICAgICAgcmV0dXJuIGlucHV0LnN1YnN0cmluZyhwZWckcmVwb3J0ZWRQb3MsIHBlZyRjdXJyUG9zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvZmZzZXQoKSB7XG4gICAgICByZXR1cm4gcGVnJHJlcG9ydGVkUG9zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmUoKSB7XG4gICAgICByZXR1cm4gcGVnJGNvbXB1dGVQb3NEZXRhaWxzKHBlZyRyZXBvcnRlZFBvcykubGluZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb2x1bW4oKSB7XG4gICAgICByZXR1cm4gcGVnJGNvbXB1dGVQb3NEZXRhaWxzKHBlZyRyZXBvcnRlZFBvcykuY29sdW1uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGVjdGVkKGRlc2NyaXB0aW9uKSB7XG4gICAgICB0aHJvdyBwZWckYnVpbGRFeGNlcHRpb24oXG4gICAgICAgIG51bGwsXG4gICAgICAgIFt7IHR5cGU6IFwib3RoZXJcIiwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uIH1dLFxuICAgICAgICBwZWckcmVwb3J0ZWRQb3NcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xuICAgICAgdGhyb3cgcGVnJGJ1aWxkRXhjZXB0aW9uKG1lc3NhZ2UsIG51bGwsIHBlZyRyZXBvcnRlZFBvcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJGNvbXB1dGVQb3NEZXRhaWxzKHBvcykge1xuICAgICAgZnVuY3Rpb24gYWR2YW5jZShkZXRhaWxzLCBzdGFydFBvcywgZW5kUG9zKSB7XG4gICAgICAgIHZhciBwLCBjaDtcblxuICAgICAgICBmb3IgKHAgPSBzdGFydFBvczsgcCA8IGVuZFBvczsgcCsrKSB7XG4gICAgICAgICAgY2ggPSBpbnB1dC5jaGFyQXQocCk7XG4gICAgICAgICAgaWYgKGNoID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICBpZiAoIWRldGFpbHMuc2VlbkNSKSB7IGRldGFpbHMubGluZSsrOyB9XG4gICAgICAgICAgICBkZXRhaWxzLmNvbHVtbiA9IDE7XG4gICAgICAgICAgICBkZXRhaWxzLnNlZW5DUiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiXFxyXCIgfHwgY2ggPT09IFwiXFx1MjAyOFwiIHx8IGNoID09PSBcIlxcdTIwMjlcIikge1xuICAgICAgICAgICAgZGV0YWlscy5saW5lKys7XG4gICAgICAgICAgICBkZXRhaWxzLmNvbHVtbiA9IDE7XG4gICAgICAgICAgICBkZXRhaWxzLnNlZW5DUiA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRldGFpbHMuY29sdW1uKys7XG4gICAgICAgICAgICBkZXRhaWxzLnNlZW5DUiA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGVnJGNhY2hlZFBvcyAhPT0gcG9zKSB7XG4gICAgICAgIGlmIChwZWckY2FjaGVkUG9zID4gcG9zKSB7XG4gICAgICAgICAgcGVnJGNhY2hlZFBvcyA9IDA7XG4gICAgICAgICAgcGVnJGNhY2hlZFBvc0RldGFpbHMgPSB7IGxpbmU6IDEsIGNvbHVtbjogMSwgc2VlbkNSOiBmYWxzZSB9O1xuICAgICAgICB9XG4gICAgICAgIGFkdmFuY2UocGVnJGNhY2hlZFBvc0RldGFpbHMsIHBlZyRjYWNoZWRQb3MsIHBvcyk7XG4gICAgICAgIHBlZyRjYWNoZWRQb3MgPSBwb3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwZWckY2FjaGVkUG9zRGV0YWlscztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckZmFpbChleHBlY3RlZCkge1xuICAgICAgaWYgKHBlZyRjdXJyUG9zIDwgcGVnJG1heEZhaWxQb3MpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGlmIChwZWckY3VyclBvcyA+IHBlZyRtYXhGYWlsUG9zKSB7XG4gICAgICAgIHBlZyRtYXhGYWlsUG9zID0gcGVnJGN1cnJQb3M7XG4gICAgICAgIHBlZyRtYXhGYWlsRXhwZWN0ZWQgPSBbXTtcbiAgICAgIH1cblxuICAgICAgcGVnJG1heEZhaWxFeHBlY3RlZC5wdXNoKGV4cGVjdGVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckYnVpbGRFeGNlcHRpb24obWVzc2FnZSwgZXhwZWN0ZWQsIHBvcykge1xuICAgICAgZnVuY3Rpb24gY2xlYW51cEV4cGVjdGVkKGV4cGVjdGVkKSB7XG4gICAgICAgIHZhciBpID0gMTtcblxuICAgICAgICBleHBlY3RlZC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICBpZiAoYS5kZXNjcmlwdGlvbiA8IGIuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGEuZGVzY3JpcHRpb24gPiBiLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB3aGlsZSAoaSA8IGV4cGVjdGVkLmxlbmd0aCkge1xuICAgICAgICAgIGlmIChleHBlY3RlZFtpIC0gMV0gPT09IGV4cGVjdGVkW2ldKSB7XG4gICAgICAgICAgICBleHBlY3RlZC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYnVpbGRNZXNzYWdlKGV4cGVjdGVkLCBmb3VuZCkge1xuICAgICAgICBmdW5jdGlvbiBzdHJpbmdFc2NhcGUocykge1xuICAgICAgICAgIGZ1bmN0aW9uIGhleChjaCkgeyByZXR1cm4gY2guY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTsgfVxuXG4gICAgICAgICAgcmV0dXJuIHNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csICAgJ1xcXFxcXFxcJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAgICAnXFxcXFwiJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHgwOC9nLCAnXFxcXGInKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcdC9nLCAgICdcXFxcdCcpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICAgJ1xcXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXGYvZywgICAnXFxcXGYnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcci9nLCAgICdcXFxccicpXG4gICAgICAgICAgICAucmVwbGFjZSgvW1xceDAwLVxceDA3XFx4MEJcXHgwRVxceDBGXS9nLCBmdW5jdGlvbihjaCkgeyByZXR1cm4gJ1xcXFx4MCcgKyBoZXgoY2gpOyB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHgxMC1cXHgxRlxceDgwLVxceEZGXS9nLCAgICBmdW5jdGlvbihjaCkgeyByZXR1cm4gJ1xcXFx4JyAgKyBoZXgoY2gpOyB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHUwMTgwLVxcdTBGRkZdL2csICAgICAgICAgZnVuY3Rpb24oY2gpIHsgcmV0dXJuICdcXFxcdTAnICsgaGV4KGNoKTsgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx1MTA4MC1cXHVGRkZGXS9nLCAgICAgICAgIGZ1bmN0aW9uKGNoKSB7IHJldHVybiAnXFxcXHUnICArIGhleChjaCk7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGV4cGVjdGVkRGVzY3MgPSBuZXcgQXJyYXkoZXhwZWN0ZWQubGVuZ3RoKSxcbiAgICAgICAgICAgIGV4cGVjdGVkRGVzYywgZm91bmREZXNjLCBpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBleHBlY3RlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGV4cGVjdGVkRGVzY3NbaV0gPSBleHBlY3RlZFtpXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdGVkRGVzYyA9IGV4cGVjdGVkLmxlbmd0aCA+IDFcbiAgICAgICAgICA/IGV4cGVjdGVkRGVzY3Muc2xpY2UoMCwgLTEpLmpvaW4oXCIsIFwiKVxuICAgICAgICAgICAgICArIFwiIG9yIFwiXG4gICAgICAgICAgICAgICsgZXhwZWN0ZWREZXNjc1tleHBlY3RlZC5sZW5ndGggLSAxXVxuICAgICAgICAgIDogZXhwZWN0ZWREZXNjc1swXTtcblxuICAgICAgICBmb3VuZERlc2MgPSBmb3VuZCA/IFwiXFxcIlwiICsgc3RyaW5nRXNjYXBlKGZvdW5kKSArIFwiXFxcIlwiIDogXCJlbmQgb2YgaW5wdXRcIjtcblxuICAgICAgICByZXR1cm4gXCJFeHBlY3RlZCBcIiArIGV4cGVjdGVkRGVzYyArIFwiIGJ1dCBcIiArIGZvdW5kRGVzYyArIFwiIGZvdW5kLlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zRGV0YWlscyA9IHBlZyRjb21wdXRlUG9zRGV0YWlscyhwb3MpLFxuICAgICAgICAgIGZvdW5kICAgICAgPSBwb3MgPCBpbnB1dC5sZW5ndGggPyBpbnB1dC5jaGFyQXQocG9zKSA6IG51bGw7XG5cbiAgICAgIGlmIChleHBlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICBjbGVhbnVwRXhwZWN0ZWQoZXhwZWN0ZWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFN5bnRheEVycm9yKFxuICAgICAgICBtZXNzYWdlICE9PSBudWxsID8gbWVzc2FnZSA6IGJ1aWxkTWVzc2FnZShleHBlY3RlZCwgZm91bmQpLFxuICAgICAgICBleHBlY3RlZCxcbiAgICAgICAgZm91bmQsXG4gICAgICAgIHBvcyxcbiAgICAgICAgcG9zRGV0YWlscy5saW5lLFxuICAgICAgICBwb3NEZXRhaWxzLmNvbHVtblxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VwbHkoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczM7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IHBlZyRwYXJzZW1hZ2ljKCk7XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VoZWFkZXIoKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2Vib2R5KCk7XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMSA9IFtzMSwgczIsIHMzXTtcbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VtYWdpYygpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMykgPT09IHBlZyRjMSkge1xuICAgICAgICBzMSA9IHBlZyRjMTtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gMztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzIpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VubCgpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMSA9IFtzMSwgczJdO1xuICAgICAgICAgIHMwID0gczE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VoZWFkZXIoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNTtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gcGVnJHBhcnNlZm9ybWF0KCk7XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBbXTtcbiAgICAgICAgczMgPSBwZWckcGFyc2Vjb21tZW50KCk7XG4gICAgICAgIHdoaWxlIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMyLnB1c2goczMpO1xuICAgICAgICAgIHMzID0gcGVnJHBhcnNlY29tbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gW107XG4gICAgICAgICAgczQgPSBwZWckcGFyc2VlbGVtZW50KCk7XG4gICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICB3aGlsZSAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczMucHVzaChzNCk7XG4gICAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNlZWxlbWVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMyA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAxMCkgPT09IHBlZyRjNCkge1xuICAgICAgICAgICAgICBzNCA9IHBlZyRjNDtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMTA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzNCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM1KTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gcGVnJHBhcnNlbmwoKTtcbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczEgPSBbczEsIHMyLCBzMywgczQsIHM1XTtcbiAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlZm9ybWF0KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczUsIHM2O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNikgPT09IHBlZyRjNikge1xuICAgICAgICBzMSA9IHBlZyRjNjtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzcpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA1KSA9PT0gcGVnJGM4KSB7XG4gICAgICAgICAgICBzMyA9IHBlZyRjODtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMzID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM5KTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAzKSA9PT0gcGVnJGMxMCkge1xuICAgICAgICAgICAgICAgIHM1ID0gcGVnJGMxMDtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSAzO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHM1ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTEpOyB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczYgPSBwZWckcGFyc2VubCgpO1xuICAgICAgICAgICAgICAgIGlmIChzNiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgczEgPSBbczEsIHMyLCBzMywgczQsIHM1LCBzNl07XG4gICAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlY29tbWVudCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMztcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDcpID09PSBwZWckYzEyKSB7XG4gICAgICAgIHMxID0gcGVnJGMxMjtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzEzKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gW107XG4gICAgICAgIGlmIChwZWckYzE0LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICBzMyA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMyA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzE1KTsgfVxuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMyLnB1c2goczMpO1xuICAgICAgICAgIGlmIChwZWckYzE0LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICAgIHMzID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMzID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxNSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2VubCgpO1xuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczEgPSBbczEsIHMyLCBzM107XG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlZWxlbWVudCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMztcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gcGVnJHBhcnNlZWhhZGVyKCk7XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBbXTtcbiAgICAgICAgczMgPSBwZWckcGFyc2Vwcm9wZXJ0eSgpO1xuICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICB3aGlsZSAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHMyLnB1c2goczMpO1xuICAgICAgICAgICAgczMgPSBwZWckcGFyc2Vwcm9wZXJ0eSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMiA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICBzMSA9IHBlZyRjMTYoczEsIHMyKTtcbiAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlZWhhZGVyKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczUsIHM2O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNykgPT09IHBlZyRjMTcpIHtcbiAgICAgICAgczEgPSBwZWckYzE3O1xuICAgICAgICBwZWckY3VyclBvcyArPSA3O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTgpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZWVsdHlwZSgpO1xuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczQgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gcGVnJHBhcnNlbnVtYmVyKCk7XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHM2ID0gcGVnJHBhcnNlbmwoKTtcbiAgICAgICAgICAgICAgICBpZiAoczYgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgczEgPSBwZWckYzE5KHMzLCBzNSk7XG4gICAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlZWx0eXBlKCkge1xuICAgICAgdmFyIHMwO1xuXG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA2KSA9PT0gcGVnJGMyMCkge1xuICAgICAgICBzMCA9IHBlZyRjMjA7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMyMSk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA0KSA9PT0gcGVnJGMyMikge1xuICAgICAgICAgIHMwID0gcGVnJGMyMjtcbiAgICAgICAgICBwZWckY3VyclBvcyArPSA0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMjMpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXByb3BlcnR5KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczUsIHM2O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgOCkgPT09IHBlZyRjMjQpIHtcbiAgICAgICAgczEgPSBwZWckYzI0O1xuICAgICAgICBwZWckY3VyclBvcyArPSA4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMjUpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZXB0eXBlKCk7XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczUgPSBwZWckcGFyc2VwdmFsdWUoKTtcbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczYgPSBwZWckcGFyc2VubCgpO1xuICAgICAgICAgICAgICAgIGlmIChzNiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICBzMSA9IHBlZyRjMjYoczUpO1xuICAgICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXB0eXBlKCkge1xuICAgICAgdmFyIHMwO1xuXG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA1KSA9PT0gcGVnJGMyNykge1xuICAgICAgICBzMCA9IHBlZyRjMjc7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMyOCk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA0KSA9PT0gcGVnJGMyOSkge1xuICAgICAgICAgIHMwID0gcGVnJGMyOTtcbiAgICAgICAgICBwZWckY3VyclBvcyArPSA0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMzApOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMykgPT09IHBlZyRjMzEpIHtcbiAgICAgICAgICAgIHMwID0gcGVnJGMzMTtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMzMik7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA1KSA9PT0gcGVnJGMzMykge1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMzM7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMzNCk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA0KSA9PT0gcGVnJGMzNSkge1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMzNTtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSA0O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMzYpOyB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckcGFyc2VsaXN0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWxpc3QoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNTtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDQpID09PSBwZWckYzM3KSB7XG4gICAgICAgIHMxID0gcGVnJGMzNztcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzM4KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2VwdHlwZSgpO1xuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczQgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gcGVnJHBhcnNlcHR5cGUoKTtcbiAgICAgICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgczEgPSBbczEsIHMyLCBzMywgczQsIHM1XTtcbiAgICAgICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlcHZhbHVlKCkge1xuICAgICAgdmFyIHMwO1xuXG4gICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDEyMCkge1xuICAgICAgICBzMCA9IHBlZyRjMzk7XG4gICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0MCk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDEyMSkge1xuICAgICAgICAgIHMwID0gcGVnJGM0MTtcbiAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNDIpOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMjIpIHtcbiAgICAgICAgICAgIHMwID0gcGVnJGM0MztcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0NCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAyKSA9PT0gcGVnJGM0NSkge1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjNDU7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM0Nik7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAyKSA9PT0gcGVnJGM0Nykge1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGM0NztcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSAyO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNDgpOyB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMikgPT09IHBlZyRjNDkpIHtcbiAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGM0OTtcbiAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM1MCk7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDExNSkge1xuICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjNTE7XG4gICAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM1Mik7IH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDExNikge1xuICAgICAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGM1MztcbiAgICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNTQpOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHMwID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMTQpID09PSBwZWckYzU1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjNTU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSAxNDtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzU2KTsgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlYm9keSgpIHtcbiAgICAgIHZhciBzMCwgczE7XG5cbiAgICAgIHMwID0gW107XG4gICAgICBzMSA9IHBlZyRwYXJzZWJsaW5lKCk7XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgd2hpbGUgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczAucHVzaChzMSk7XG4gICAgICAgICAgczEgPSBwZWckcGFyc2VibGluZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWJsaW5lKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczI7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IFtdO1xuICAgICAgczIgPSBwZWckcGFyc2VidmFsdWUoKTtcbiAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICB3aGlsZSAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMS5wdXNoKHMyKTtcbiAgICAgICAgICBzMiA9IHBlZyRwYXJzZWJ2YWx1ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRjMDtcbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZW5sKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgIHMxID0gcGVnJGM1NyhzMSk7XG4gICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWJ2YWx1ZSgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBwZWckcGFyc2VudW1iZXIoKTtcbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgIGlmIChzMiA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMyID0gcGVnJGM1ODtcbiAgICAgICAgfVxuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICBzMSA9IHBlZyRjMjYoczEpO1xuICAgICAgICAgIHMwID0gczE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VudW1iZXIoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczMsIHM0LCBzNSwgczYsIHM3O1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gNDUpIHtcbiAgICAgICAgczIgPSBwZWckYzU5O1xuICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczIgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjApOyB9XG4gICAgICB9XG4gICAgICBpZiAoczIgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckYzU4O1xuICAgICAgfVxuICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMzID0gW107XG4gICAgICAgIGlmIChwZWckYzYxLnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICBzNCA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzNCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzYyKTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHdoaWxlIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczMucHVzaChzNCk7XG4gICAgICAgICAgICBpZiAocGVnJGM2MS50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgICAgIHM0ID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHM0ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzYyKTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMyA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzNCA9IHBlZyRjdXJyUG9zO1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gNDYpIHtcbiAgICAgICAgICAgIHM1ID0gcGVnJGM2MztcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHM1ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2NCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHM1ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNiA9IFtdO1xuICAgICAgICAgICAgaWYgKHBlZyRjNjEudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgICAgICBzNyA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzNyA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2Mik7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChzNyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNi5wdXNoKHM3KTtcbiAgICAgICAgICAgICAgaWYgKHBlZyRjNjEudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgICAgICAgIHM3ID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHM3ID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjIpOyB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzNiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IFtzNSwgczZdO1xuICAgICAgICAgICAgICBzNCA9IHM1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzNDtcbiAgICAgICAgICAgICAgczQgPSBwZWckYzA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczQ7XG4gICAgICAgICAgICBzNCA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHM0ID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRjNTg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczIgPSBbczIsIHMzLCBzNF07XG4gICAgICAgICAgICBzMSA9IHMyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMxO1xuICAgICAgICAgICAgczEgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczE7XG4gICAgICAgICAgczEgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczE7XG4gICAgICAgIHMxID0gcGVnJGMwO1xuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICBzMSA9IHBlZyRjNjUoczEpO1xuICAgICAgfVxuICAgICAgczAgPSBzMTtcblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXdzKCkge1xuICAgICAgdmFyIHMwLCBzMTtcblxuICAgICAgczAgPSBbXTtcbiAgICAgIGlmIChwZWckYzY2LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgczEgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjcpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgd2hpbGUgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczAucHVzaChzMSk7XG4gICAgICAgICAgaWYgKHBlZyRjNjYudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgICAgczEgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzY3KTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VubCgpIHtcbiAgICAgIHZhciBzMCwgczE7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCAyKSA9PT0gcGVnJGM2OCkge1xuICAgICAgICBzMSA9IHBlZyRjNjg7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2OSk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDEwKSB7XG4gICAgICAgICAgczEgPSBwZWckYzcwO1xuICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM3MSk7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoczEgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDEzKSB7XG4gICAgICAgICAgICBzMSA9IHBlZyRjNzI7XG4gICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNzMpOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgIHMxID0gcGVnJGM3NCgpO1xuICAgICAgfVxuICAgICAgczAgPSBzMTtcblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuXHJcbiAgICAgIHZhciBsaW5lcyAgICAgID0gMDtcclxuICAgICAgdmFyIG1lc2ggICAgICAgPSBvcHRpb25zLm1lc2g7XHJcbiAgICAgIHZhciBlbGVtZW50cyAgID0gW107XHJcbiAgICAgIHZhciBlbGVtZW50SWRzID0gMDsgLy8gY3VycmVudGx5IGFjdGl2ZSBlbGVtZW50XHJcbiAgICAgIHZhciB2YWx1ZUNvdW50ID0gMDsgLy8gd2hpY2ggdmFsdWUgd2FzIHJlYWQgbGFzdCwgd2l0aGluIHRoaXMgZWxlbWVudFxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gc3RySm9pbih2YWx1ZXMpIHtcclxuICAgICAgICB2YXIgciA9ICcnO1xyXG4gICAgICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHsgICAgICAgXHJcbiAgICAgICAgICAgICAgciA9IHIuY29uY2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHsgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgciA9IHIuY29uY2F0KHN0ckpvaW4odmFsdWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBkZWNvZGVMaW5lKHZhbHVlcykge1xyXG4gICAgICAgIHZhciBwcm9wcyA9IGVsZW1lbnRzW2VsZW1lbnRJZHNdLnByb3BlcnRpZXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHByb3BzWzBdID09ICd2ZXJ0ZXhfaW5kaWNlcycpIHtcclxuICAgICAgICAgIHZhciBjb3VudCA9IHZhbHVlc1swXTtcclxuICAgICAgICAgIC8vIGFueXRoaW5nIGxhcmdlciB0aGFuIGEgdHJpYW5nbGUgaXMgYmFzaWNhbGx5ICBcclxuICAgICAgICAgIC8vIGltcGxlbWVudGVkIGFzIGEgdHJpYW5nbGUgZmFuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMjsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgLy8gYWN0dWFsIHVzYWJsZSB2YWx1ZXMgc3RhcnQgd2l0aCAxXHJcbiAgICAgICAgICAgIHZhciBhID0gdmFsdWVzWzFdOyAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBiID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICB2YXIgYyA9IHZhbHVlc1tpICsgMV07XHJcbiAgICAgICAgICAgIG1lc2guYWRkVHJpYW5nbGUoYSwgYiwgYyk7XHJcbiAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyAgICBcclxuICAgICAgICAgIHZhciB2ZXJ0ZXggICA9IHBrem8udmVjMygwKTtcclxuICAgICAgICAgIHZhciBub3JtYWwgICA9IHBrem8udmVjMygwKTtcclxuICAgICAgICAgIHZhciB0ZXhDb29yZCA9IHBrem8udmVjMigwKTtcclxuICAgICAgICAgIHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3AsIGkpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAneCc6XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhbMF0gPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlICd5JzpcclxuICAgICAgICAgICAgICAgIHZlcnRleFsxXSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgJ3onOlxyXG4gICAgICAgICAgICAgICAgdmVydGV4WzJdID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAnbngnOlxyXG4gICAgICAgICAgICAgICAgbm9ybWFsWzBdID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAnbnknOlxyXG4gICAgICAgICAgICAgICAgbm9ybWFsWzFdID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAnbnonOlxyXG4gICAgICAgICAgICAgICAgbm9ybWFsWzJdID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7ICBcclxuICAgICAgICAgICAgICBjYXNlICd0JzpcclxuICAgICAgICAgICAgICAgIHRleENvb3JkWzBdID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAncyc6XHJcbiAgICAgICAgICAgICAgICB0ZXhDb29yZFsxXSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9ICAgICAgICBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgbWVzaC5hZGRWZXJ0ZXgodmVydGV4LCBub3JtYWwsIHRleENvb3JkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhbHVlQ291bnQrKztcclxuICAgICAgICBpZiAodmFsdWVDb3VudCA9PSBlbGVtZW50c1tlbGVtZW50SWRzXS5jb3VudCkge1xyXG4gICAgICAgICAgZWxlbWVudElkcysrO1xyXG4gICAgICAgICAgdmFsdWVDb3VudCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxuXG4gICAgcGVnJHJlc3VsdCA9IHBlZyRzdGFydFJ1bGVGdW5jdGlvbigpO1xuXG4gICAgaWYgKHBlZyRyZXN1bHQgIT09IHBlZyRGQUlMRUQgJiYgcGVnJGN1cnJQb3MgPT09IGlucHV0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHBlZyRyZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwZWckcmVzdWx0ICE9PSBwZWckRkFJTEVEICYmIHBlZyRjdXJyUG9zIDwgaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgIHBlZyRmYWlsKHsgdHlwZTogXCJlbmRcIiwgZGVzY3JpcHRpb246IFwiZW5kIG9mIGlucHV0XCIgfSk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IHBlZyRidWlsZEV4Y2VwdGlvbihudWxsLCBwZWckbWF4RmFpbEV4cGVjdGVkLCBwZWckbWF4RmFpbFBvcyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBTeW50YXhFcnJvcjogU3ludGF4RXJyb3IsXG4gICAgcGFyc2U6ICAgICAgIHBhcnNlXG4gIH07XG59KSgpOyIsIlxyXG5wa3pvLk1lc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5sb2FkZWQgPSBmYWxzZTsgIFxyXG59XHJcblxyXG5wa3pvLk1lc2gubG9hZCA9IGZ1bmN0aW9uICh1cmwpIHtcclxuICAgIHZhciBtZXNoID0gbmV3IHBrem8uTWVzaCgpO1xyXG4gICAgXHJcbiAgICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgIGlmICh4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiB4bWxodHRwLnN0YXR1cyA9PSAyMDApXHJcbiAgICAgIHtcclxuICAgICAgICB2YXIgcGFyc2VyID0gcGt6by5QbHlQYXJzZXI7XHJcbiAgICAgICAgcGFyc2VyLnBhcnNlKHhtbGh0dHAucmVzcG9uc2VUZXh0LCB7bWVzaDogbWVzaH0pO1xyXG4gICAgICAgIG1lc2gubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSAgICBcclxuICAgIHhtbGh0dHAub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgeG1saHR0cC5zZW5kKCk7XHJcbiAgICBcclxuICAgIHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucGxhbmUgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgd3JlcywgaHJlcykge1xyXG4gIHZhciBtZXNoID0gbmV3IHBrem8uTWVzaCgpO1xyXG4gIFxyXG4gIGlmICh3cmVzID09PSB1bmRlZmluZWQpIHtcclxuICAgIHZhciB3cmVzID0gMTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGhyZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdmFyIGhyZXMgPSAxO1xyXG4gIH1cclxuICBcclxuICB2YXIgdzIgPSB3aWR0aCAvIDIuMDtcclxuICB2YXIgaDIgPSBoZWlnaHQgLyAyLjA7XHJcbiAgdmFyIHdzID0gd2lkdGggLyB3cmVzO1xyXG4gIHZhciBocyA9IGhlaWdodCAvIGhyZXM7XHJcbiAgXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPD0gd3JlczsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8PSBocmVzOyBqKyspIHtcclxuICAgICAgdmFyIHggPSAtdzIgKyBpICogd3M7IFxyXG4gICAgICB2YXIgeSA9IC1oMiArIGogKiBocztcclxuICAgICAgdmFyIHQgPSBpO1xyXG4gICAgICB2YXIgcyA9IGo7XHJcbiAgICAgIG1lc2guYWRkVmVydGV4KHBrem8udmVjMyh4LCB5LCAwKSwgcGt6by52ZWMzKDAsIDAsIDEpLCBwa3pvLnZlYzIodCwgcyksIHBrem8udmVjMygwLCAxLCAwKSk7ICAgICAgICAgICAgXHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBzcGFuID0gd3JlcyArIDE7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB3cmVzOyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgaHJlczsgaisrKSB7XHJcbiAgICAgIHZhciBhID0gKGkgKyAwKSAqIHNwYW4gKyAoaiArIDApO1xyXG4gICAgICB2YXIgYiA9IChpICsgMCkgKiBzcGFuICsgKGogKyAxKTtcclxuICAgICAgdmFyIGMgPSAoaSArIDEpICogc3BhbiArIChqICsgMSk7XHJcbiAgICAgIHZhciBkID0gKGkgKyAxKSAqIHNwYW4gKyAoaiArIDApO1xyXG4gICAgICBtZXNoLmFkZFRyaWFuZ2xlKGEsIGIsIGMpO1xyXG4gICAgICBtZXNoLmFkZFRyaWFuZ2xlKGMsIGQsIGEpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBtZXNoLmxvYWRlZCA9IHRydWU7XHJcbiAgcmV0dXJuIG1lc2g7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5ib3ggPSBmdW5jdGlvbiAocykge1xyXG4gIFxyXG4gIHZhciBtZXNoID0gbmV3IHBrem8uTWVzaCgpO1xyXG4gIFxyXG4gIG1lc2gudmVydGljZXMgPSBcclxuICAgICAgWyAgc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLCBzWzFdLCBzWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgICAgXHJcbiAgICAgICAgIHNbMF0sIHNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgICBzWzBdLC1zWzFdLC1zWzJdLCAgIHNbMF0sIHNbMV0sLXNbMl0sICAgIFxyXG4gICAgICAgICBzWzBdLCBzWzFdLCBzWzJdLCAgIHNbMF0sIHNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgIC1zWzBdLCBzWzFdLCBzWzJdLCAgICBcclxuICAgICAgICAtc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLCBzWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sLXNbMl0sICAtc1swXSwtc1sxXSwgc1syXSwgICAgXHJcbiAgICAgICAgLXNbMF0sLXNbMV0sLXNbMl0sICAgc1swXSwtc1sxXSwtc1syXSwgICBzWzBdLC1zWzFdLCBzWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG4gICAgICAgICBzWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdIF07ICBcclxuICAgICAgICAgXHJcbiAgbWVzaC5ub3JtYWxzID0gXHJcbiAgICAgIFsgIDAsIDAsIDEsICAgMCwgMCwgMSwgICAwLCAwLCAxLCAgIDAsIDAsIDEsICAgICBcclxuICAgICAgICAgMSwgMCwgMCwgICAxLCAwLCAwLCAgIDEsIDAsIDAsICAgMSwgMCwgMCwgICAgIFxyXG4gICAgICAgICAwLCAxLCAwLCAgIDAsIDEsIDAsICAgMCwgMSwgMCwgICAwLCAxLCAwLCAgICAgXHJcbiAgICAgICAgLTEsIDAsIDAsICAtMSwgMCwgMCwgIC0xLCAwLCAwLCAgLTEsIDAsIDAsICAgICBcclxuICAgICAgICAgMCwtMSwgMCwgICAwLC0xLCAwLCAgIDAsLTEsIDAsICAgMCwtMSwgMCwgICAgIFxyXG4gICAgICAgICAwLCAwLC0xLCAgIDAsIDAsLTEsICAgMCwgMCwtMSwgICAwLCAwLC0xIF07ICAgXHJcblxyXG4gIG1lc2gudGV4Q29vcmRzID0gXHJcbiAgICAgIFsgIDEsIDEsICAgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgIFxyXG4gICAgICAgICAwLCAxLCAgIDAsIDAsICAgMSwgMCwgICAxLCAxLCAgICBcclxuICAgICAgICAgMSwgMCwgICAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAgXHJcbiAgICAgICAgIDEsIDEsICAgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgIFxyXG4gICAgICAgICAwLCAwLCAgIDEsIDAsICAgMSwgMSwgICAwLCAxLCAgICBcclxuICAgICAgICAgMCwgMCwgICAxLCAwLCAgIDEsIDEsICAgMCwgMSBdOyAgXHJcblxyXG4gIG1lc2guaW5kaWNlcyA9IFxyXG4gICAgICBbICAwLCAxLCAyLCAgIDAsIDIsIDMsICAgXHJcbiAgICAgICAgIDQsIDUsIDYsICAgNCwgNiwgNywgICBcclxuICAgICAgICAgOCwgOSwxMCwgICA4LDEwLDExLCAgIFxyXG4gICAgICAgIDEyLDEzLDE0LCAgMTIsMTQsMTUsICAgXHJcbiAgICAgICAgMTYsMTcsMTgsICAxNiwxOCwxOSwgICBcclxuICAgICAgICAyMCwyMSwyMiwgIDIwLDIyLDIzIF07IFxyXG5cclxuICBtZXNoLmxvYWRlZCA9IHRydWU7XHJcbiAgcmV0dXJuIG1lc2g7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5zcGhlcmUgPSBmdW5jdGlvbiAocmFkaXVzLCBuTGF0aXR1ZGUsIG5Mb25naXR1ZGUpIHtcclxuICBcclxuICB2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuICBcclxuICB2YXIgblBpdGNoID0gbkxvbmdpdHVkZSArIDE7XHJcbiAgXHJcbiAgdmFyIHBpdGNoSW5jID0gcGt6by5yYWRpYW5zKDE4MC4wIC8gblBpdGNoKTtcclxuICB2YXIgcm90SW5jICAgPSBwa3pvLnJhZGlhbnMoMzYwLjAgLyBuTGF0aXR1ZGUpO1xyXG4gXHJcbiAgLy8gcG9sZXNcclxuICBtZXNoLmFkZFZlcnRleChwa3pvLnZlYzMoMCwgMCwgcmFkaXVzKSwgcGt6by52ZWMzKDAsIDAsIDEpLCBwa3pvLnZlYzIoMC41LCAwKSwgcGt6by52ZWMzKDAsIDEsIDApKTsgLy8gdG9wIHZlcnRleFxyXG4gIG1lc2guYWRkVmVydGV4KHBrem8udmVjMygwLCAwLCAtcmFkaXVzKSwgcGt6by52ZWMzKDAsIDAsIC0xKSwgcGt6by52ZWMyKDAuNSwgMSksIHBrem8udmVjMygwLCAxLCAwKSk7IC8vIGJvdHRvbSB2ZXJ0ZXhcclxuICAgXHJcbiAgLy8gYm9keSB2ZXJ0aWNlc1xyXG4gIHZhciB0d29QaSA9IE1hdGguUEkgKiAyLjA7XHJcbiAgZm9yICh2YXIgcCA9IDE7IHAgPCBuUGl0Y2g7IHArKykgeyAgICBcclxuICAgIHZhciBvdXQgPSBNYXRoLmFicyhyYWRpdXMgKiBNYXRoLnNpbihwICogcGl0Y2hJbmMpKTsgICAgXHJcbiAgICB2YXIgeiAgID0gcmFkaXVzICogTWF0aC5jb3MocCAqIHBpdGNoSW5jKTtcclxuICAgIFxyXG4gICAgZm9yKHZhciBzID0gMDsgcyA8PSBuTGF0aXR1ZGU7IHMrKykge1xyXG4gICAgICB2YXIgeCA9IG91dCAqIE1hdGguY29zKHMgKiByb3RJbmMpO1xyXG4gICAgICB2YXIgeSA9IG91dCAqIE1hdGguc2luKHMgKiByb3RJbmMpO1xyXG4gICAgICBcclxuICAgICAgdmFyIHZlYyAgPSBwa3pvLnZlYzMoeCwgeSwgeik7XHJcbiAgICAgIHZhciBub3JtID0gcGt6by5ub3JtYWxpemUodmVjKTtcclxuICAgICAgdmFyIHRjICAgPSBwa3pvLnZlYzIocyAvIG5MYXRpdHVkZSwgcCAvIG5QaXRjaCk7ICAgICAgXHJcbiAgICAgIHZhciB0YW5nID0gcGt6by5jcm9zcyhub3JtLCBwa3pvLnZlYzMoMCwgMCwgMSkpO1xyXG4gICAgICBtZXNoLmFkZFZlcnRleCh2ZWMsIG5vcm0sIHRjLCB0YW5nKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gcG9sYXIgY2Fwc1xyXG4gIHZhciBvZmZMYXN0VmVydHMgPSAyICsgKChuTGF0aXR1ZGUgKyAxKSAqIChuUGl0Y2ggLSAyKSk7XHJcbiAgZm9yKHZhciBzID0gMDsgcyA8IG5MYXRpdHVkZTsgcysrKVxyXG4gIHtcclxuICAgIG1lc2guYWRkVHJpYW5nbGUoMCwgMiArIHMsIDIgKyBzICsgMSk7XHJcbiAgICBtZXNoLmFkZFRyaWFuZ2xlKDEsIG9mZkxhc3RWZXJ0cyArIHMsIG9mZkxhc3RWZXJ0cyArIHMgKyAxKTtcclxuICB9XHJcbiBcclxuICAvLyBib2R5XHJcbiAgZm9yKHZhciBwID0gMTsgcCA8IG5QaXRjaC0xOyBwKyspIHtcclxuICAgIGZvcih2YXIgcyA9IDA7IHMgPCBuTGF0aXR1ZGU7IHMrKykge1xyXG4gICAgICB2YXIgYSA9IDIgKyAocC0xKSAqIChuTGF0aXR1ZGUgKyAxKSArIHM7XHJcbiAgICAgIHZhciBiID0gYSArIDE7XHJcbiAgICAgIHZhciBkID0gMiArIHAgKiAobkxhdGl0dWRlICsgMSkgKyBzO1xyXG4gICAgICB2YXIgYyA9IGQgKyAxO1xyXG4gICAgICBcclxuICAgICAgbWVzaC5hZGRUcmlhbmdsZShhLCBiLCBjKTtcclxuICAgICAgbWVzaC5hZGRUcmlhbmdsZShjLCBkLCBhKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgbWVzaC5sb2FkZWQgPSB0cnVlO1xyXG4gIHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2guaWNvU3BoZXJlID0gZnVuY3Rpb24gKHJhZGl1cywgcmVjdXJzaW9uTGV2ZWwpIHtcclxuICB2YXIgdCA9ICgxLjAgKyBNYXRoLnNxcnQoNS4wKSkgLyAyLjA7XHJcbiAgXHJcbiAgdmFyIHZlcnRzID0gW1xyXG4gICAgcGt6by52ZWMzKC0xLCAgdCwgIDApLFxyXG4gICAgcGt6by52ZWMzKCAxLCAgdCwgIDApLFxyXG4gICAgcGt6by52ZWMzKC0xLCAtdCwgIDApLFxyXG4gICAgcGt6by52ZWMzKCAxLCAtdCwgIDApLFxyXG5cclxuICAgIHBrem8udmVjMyggMCwgLTEsICB0KSxcclxuICAgIHBrem8udmVjMyggMCwgIDEsICB0KSxcclxuICAgIHBrem8udmVjMyggMCwgLTEsIC10KSxcclxuICAgIHBrem8udmVjMyggMCwgIDEsIC10KSxcclxuXHJcbiAgICBwa3pvLnZlYzMoIHQsICAwLCAtMSksXHJcbiAgICBwa3pvLnZlYzMoIHQsICAwLCAgMSksXHJcbiAgICBwa3pvLnZlYzMoLXQsICAwLCAtMSksXHJcbiAgICBwa3pvLnZlYzMoLXQsICAwLCAgMSksXHJcbiAgXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZlcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2ZXJ0c1tpXSA9IHBrem8ubm9ybWFsaXplKHZlcnRzW2ldKTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIGZhY2VzID0gW1xyXG4gICAgWzAsIDExLCA1XSxcclxuICAgIFswLCA1LCAxXSxcclxuICAgIFswLCAxLCA3XSxcclxuICAgIFswLCA3LCAxMF0sXHJcbiAgICBbMCwgMTAsIDExXSxcclxuXHJcbiAgICBbMSwgNSwgOV0sXHJcbiAgICBbNSwgMTEsIDRdLFxyXG4gICAgWzExLCAxMCwgMl0sXHJcbiAgICBbMTAsIDcsIDZdLFxyXG4gICAgWzcsIDEsIDhdLFxyXG5cclxuICAgIFszLCA5LCA0XSxcclxuICAgIFszLCA0LCAyXSxcclxuICAgIFszLCAyLCA2XSxcclxuICAgIFszLCA2LCA4XSxcclxuICAgIFszLCA4LCA5XSxcclxuXHJcbiAgICBbNCwgOSwgNV0sXHJcbiAgICBbMiwgNCwgMTFdLFxyXG4gICAgWzYsIDIsIDEwXSxcclxuICAgIFs4LCA2LCA3XSxcclxuICAgIFs5LCA4LCAxXSwgIFxyXG4gIF07XHJcbiAgXHJcbiAgdmFyIG1pZHBvaW50Q2FjaGUgPSBbXTsgIFxyXG4gIFxyXG4gIHZhciBhZGRNaWRwb2ludENhY2hlID0gZnVuY3Rpb24gKHAxLCBwMiwgaSkge1xyXG4gICAgbWlkcG9pbnRDYWNoZS5wdXNoKHtwMTogcDEsIHAyOiBwMiwgaTogaX0pO1xyXG4gIH1cclxuICB2YXIgZ2V0TWlkcG9pbnRDYWNoZSA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWlkcG9pbnRDYWNoZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAobWlkcG9pbnRDYWNoZS5wMSA9PSBwMSAmJiBtaWRwb2ludENhY2hlLnAyID09IHAyKSB7XHJcbiAgICAgICAgcmV0dXJuIG1pZHBvaW50Q2FjaGUuaTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBtaWRwb2ludCA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcclxuICAgIHZhciBzaSA9IHAxIDwgcDIgPyBwMSA6IHAyO1xyXG4gICAgdmFyIGdpID0gcDEgPCBwMiA/IHAyIDogcDE7XHJcbiAgICBcclxuICAgIHZhciBjaSA9IGdldE1pZHBvaW50Q2FjaGUoc2ksIGdpKTtcclxuICAgIGlmIChjaSAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gY2k7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBvaW50MSA9IHZlcnRzW3AxXTtcclxuICAgIHZhciBwb2ludDIgPSB2ZXJ0c1twMl07XHJcbiAgICB2YXIgbWlkZGxlID0gcGt6by5ub3JtYWxpemUocGt6by5hZGQocG9pbnQxLCBwb2ludDIpKTtcclxuICAgIFxyXG4gICAgdmVydHMucHVzaChtaWRkbGUpO1xyXG4gICAgdmFyIGkgPSB2ZXJ0cy5sZW5ndGggLSAxOyBcclxuICAgIFxyXG4gICAgYWRkTWlkcG9pbnRDYWNoZShzaSwgZ2ksIGkpO1xyXG4gICAgcmV0dXJuIGk7XHJcbiAgfVxyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmVjdXJzaW9uTGV2ZWw7IGkrKylcclxuICB7XHJcbiAgICB2YXIgZmFjZXMyID0gW107XHJcbiAgICBmYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChmYWNlKSB7XHJcbiAgICAgIHZhciBhID0gbWlkcG9pbnQoZmFjZVswXSwgZmFjZVsxXSk7XHJcbiAgICAgIHZhciBiID0gbWlkcG9pbnQoZmFjZVsxXSwgZmFjZVsyXSk7XHJcbiAgICAgIHZhciBjID0gbWlkcG9pbnQoZmFjZVsyXSwgZmFjZVswXSk7XHJcblxyXG4gICAgICBmYWNlczIucHVzaChbZmFjZVswXSwgYSwgY10pO1xyXG4gICAgICBmYWNlczIucHVzaChbZmFjZVsxXSwgYiwgYV0pO1xyXG4gICAgICBmYWNlczIucHVzaChbZmFjZVsyXSwgYywgYl0pO1xyXG4gICAgICBmYWNlczIucHVzaChbYSwgYiwgY10pO1xyXG4gICAgfSk7XHJcbiAgICBmYWNlcyA9IGZhY2VzMjtcclxuICB9XHJcbiAgXHJcbiAgdmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcbiAgXHJcbiAgdmFyIHR3b1BpID0gTWF0aC5QSSAqIDIuMDtcclxuICB2ZXJ0cy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICB2YXIgdmVydGV4ICAgPSBwa3pvLnN2bXVsdCh2LCByYWRpdXMpO1xyXG4gICAgdmFyIG5vcm1hbCAgID0gdjsgICAgIFxyXG4gICAgdmFyIHRleENvb3JkID0gcGt6by52ZWMyKE1hdGguYXRhbih2WzFdL3ZbMF0pIC8gdHdvUGksIE1hdGguYWNvcyh2WzJdKSAvIHR3b1BpKTtcclxuICAgIHZhciB0YW5nZW50ICA9IHBrem8uY3Jvc3Mobm9ybWFsLCBwa3pvLnZlYzMoMCwgMCwgMSkpO1xyXG4gICAgbWVzaC5hZGRWZXJ0ZXgodmVydGV4LCBub3JtYWwsIHRleENvb3JkLCB0YW5nZW50KTtcclxuICB9KTtcclxuICBcclxuICBmYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChmYWNlKSB7XHJcbiAgICBtZXNoLmFkZFRyaWFuZ2xlKGZhY2VbMF0sIGZhY2VbMV0sIGZhY2VbMl0pO1xyXG4gIH0pO1xyXG4gIFxyXG4gIG1lc2gubG9hZGVkID0gdHJ1ZTtcclxuICByZXR1cm4gbWVzaDtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5hZGRWZXJ0ZXggPSBmdW5jdGlvbiAodmVydGV4LCBub3JtYWwsIHRleENvb3JkLCB0YW5nZW50KSB7XHJcbiAgaWYgKHRoaXMudmVydGljZXMpIHtcclxuICAgIHRoaXMudmVydGljZXMucHVzaCh2ZXJ0ZXhbMF0sIHZlcnRleFsxXSwgdmVydGV4WzJdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLnZlcnRpY2VzID0gW3ZlcnRleFswXSwgdmVydGV4WzFdLCB2ZXJ0ZXhbMl1dO1xyXG4gIH1cclxuICBcclxuICBpZiAodGhpcy5ub3JtYWxzKSB7XHJcbiAgICB0aGlzLm5vcm1hbHMucHVzaChub3JtYWxbMF0sIG5vcm1hbFsxXSwgbm9ybWFsWzJdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLm5vcm1hbHMgPSBbbm9ybWFsWzBdLCBub3JtYWxbMV0sIG5vcm1hbFsyXV07XHJcbiAgfVxyXG4gIFxyXG4gIGlmICh0aGlzLnRleENvb3Jkcykge1xyXG4gICAgdGhpcy50ZXhDb29yZHMucHVzaCh0ZXhDb29yZFswXSwgdGV4Q29vcmRbMV0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudGV4Q29vcmRzID0gW3RleENvb3JkWzBdLCB0ZXhDb29yZFsxXV07XHJcbiAgfVxyXG4gIFxyXG4gIGlmICh0YW5nZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGlmICh0aGlzLnRhbmdlbnRzKSB7XHJcbiAgICAgIHRoaXMudGFuZ2VudHMucHVzaCh0YW5nZW50WzBdLCB0YW5nZW50WzFdLCB0YW5nZW50WzJdKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnRhbmdlbnRzID0gW3RhbmdlbnRbMF0sIHRhbmdlbnRbMV0sIHRhbmdlbnRbMl1dO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5nZXRWZXJ0ZXggPSBmdW5jdGlvbiAoaSkge1xyXG4gIHJldHVybiBwa3pvLnZlYzModGhpcy52ZXJ0aWNlc1tpICogM10sIHRoaXMudmVydGljZXNbaSAqIDMgKyAxXSwgdGhpcy52ZXJ0aWNlc1tpICogMyArIDJdKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5nZXROb3JtYWwgPSBmdW5jdGlvbiAoaSkge1xyXG4gIHJldHVybiBwa3pvLnZlYzModGhpcy5ub3JtYWxzW2kgKiAzXSwgdGhpcy5ub3JtYWxzW2kgKiAzICsgMV0sIHRoaXMubm9ybWFsc1tpICogMyArIDJdKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5nZXRUZXhDb29yZCA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgcmV0dXJuIHBrem8udmVjMih0aGlzLnRleENvb3Jkc1tpICogMl0sIHRoaXMudGV4Q29vcmRzW2kgKiAyICsgMV0pO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLmFkZFRyaWFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIGMpIHtcclxuICBpZiAodGhpcy5pbmRpY2VzKSB7XHJcbiAgICB0aGlzLmluZGljZXMucHVzaChhLCBiLCBjKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmluZGljZXMgPSBbYSwgYiwgY107XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uIChnbCkge1xyXG4gIFxyXG4gIGlmICghdGhpcy50YW5nZW50cykge1xyXG4gICAgdGhpcy5jb21wdXRlVGFuZ2VudHMoKTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy52ZXJ0ZXhCdWZmZXIgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy52ZXJ0aWNlcywgIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpO1xyXG4gIHRoaXMubm9ybWFsQnVmZmVyICAgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMubm9ybWFscywgICBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTsgICAgICBcclxuICB0aGlzLnRleENvb3JkQnVmZmVyID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLnRleENvb3JkcywgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7XHJcbiAgdGhpcy50YW5nZW50c0J1ZmZlciA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy50YW5nZW50cywgIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpO1xyXG4gIHRoaXMuaW5kZXhCdWZmZXIgICAgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMuaW5kaWNlcywgICBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ2wuVU5TSUdORURfU0hPUlQpO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihnbCwgc2hhZGVyKSB7XHJcbiAgaWYgKHRoaXMubG9hZGVkKSB7ICBcclxuICAgIGlmICghdGhpcy52ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgdGhpcy51cGxvYWQoZ2wpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzaGFkZXIuc2V0QXJydGlidXRlKFwiYVZlcnRleFwiLCAgIHRoaXMudmVydGV4QnVmZmVyLCAgIDMpO1xyXG4gICAgc2hhZGVyLnNldEFycnRpYnV0ZShcImFOb3JtYWxcIiwgICB0aGlzLm5vcm1hbEJ1ZmZlciwgICAzKTtcclxuICAgIHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhVGV4Q29vcmRcIiwgdGhpcy50ZXhDb29yZEJ1ZmZlciwgMik7XHJcbiAgICBzaGFkZXIuc2V0QXJydGlidXRlKFwiYVRhbmdlbnRcIiwgIHRoaXMudGFuZ2VudHNCdWZmZXIsIDMpO1xyXG4gICAgICAgIFxyXG4gICAgdGhpcy5pbmRleEJ1ZmZlci5kcmF3KGdsLlRSSUFOR0xFUyk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy52ZXJ0ZXhCdWZmZXIucmVsZWFzZSgpOyAgIFxyXG4gIGRlbGV0ZSB0aGlzLnZlcnRleEJ1ZmZlcjtcclxuICBcclxuICB0aGlzLm5vcm1hbEJ1ZmZlci5yZWxlYXNlKCk7ICAgXHJcbiAgZGVsZXRlIHRoaXMubm9ybWFsQnVmZmVyOyAgXHJcbiAgXHJcbiAgdGhpcy50ZXhDb29yZEJ1ZmZlci5yZWxlYXNlKCk7IFxyXG4gIGRlbGV0ZSB0aGlzLnRleENvb3JkQnVmZmVyO1xyXG4gIFxyXG4gIHRoaXMuaW5kZXhCdWZmZXIucmVsZWFzZSgpO1xyXG4gIGRlbGV0ZSB0aGlzLmluZGV4QnVmZmVyO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLmNvbXB1dGVUYW5nZW50cyA9IGZ1bmN0aW9uICgpIHsgICAgXHJcbiAgdmFyIHZlcnRleENvdW50ID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGggLyAzO1xyXG4gIHZhciBmYWNlQ291bnQgICA9IHRoaXMuaW5kaWNlcy5sZW5ndGggLyAzO1xyXG4gIFxyXG4gIHZhciB0YW4xID0gbmV3IEFycmF5KHZlcnRleENvdW50KTsgICAgXHJcbiAgdmFyIHRhbjIgPSBuZXcgQXJyYXkodmVydGV4Q291bnQpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmVydGV4Q291bnQ7IGkrKykge1xyXG4gICAgdGFuMVtpXSA9IHBrem8udmVjMygwKTtcclxuICAgIHRhbjJbaV0gPSBwa3pvLnZlYzMoMCk7XHJcbiAgfVxyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmFjZUNvdW50OyBpKyspIHtcclxuICAgIHZhciBhID0gdGhpcy5pbmRpY2VzW2kgKiAzXTtcclxuICAgIHZhciBiID0gdGhpcy5pbmRpY2VzW2kgKiAzICsgMV07XHJcbiAgICB2YXIgYyA9IHRoaXMuaW5kaWNlc1tpICogMyArIDJdO1xyXG4gICAgXHJcbiAgICB2YXIgdjEgPSB0aGlzLmdldFZlcnRleChhKTtcclxuICAgIHZhciB2MiA9IHRoaXMuZ2V0VmVydGV4KGIpO1xyXG4gICAgdmFyIHYzID0gdGhpcy5nZXRWZXJ0ZXgoYyk7XHJcbiAgICBcclxuICAgIHZhciB3MSA9IHRoaXMuZ2V0VGV4Q29vcmQoYSk7XHJcbiAgICB2YXIgdzIgPSB0aGlzLmdldFRleENvb3JkKGIpO1xyXG4gICAgdmFyIHczID0gdGhpcy5nZXRUZXhDb29yZChjKTtcclxuICAgIFxyXG4gICAgdmFyIHgxID0gdjJbMF0gLSB2MVswXTtcclxuICAgIHZhciB4MiA9IHYzWzBdIC0gdjFbMF07XHJcbiAgICB2YXIgeTEgPSB2MlsxXSAtIHYxWzFdO1xyXG4gICAgdmFyIHkyID0gdjNbMV0gLSB2MVsxXTtcclxuICAgIHZhciB6MSA9IHYyWzJdIC0gdjFbMl07XHJcbiAgICB2YXIgejIgPSB2M1syXSAtIHYxWzJdO1xyXG5cclxuICAgIHZhciBzMSA9IHcyWzBdIC0gdzFbMF07XHJcbiAgICB2YXIgczIgPSB3M1swXSAtIHcxWzBdO1xyXG4gICAgdmFyIHQxID0gdzJbMV0gLSB3MVsxXTtcclxuICAgIHZhciB0MiA9IHczWzFdIC0gdzFbMV07XHJcblxyXG4gICAgdmFyIHIgPSAxLjAgLyAoczEgKiB0MiAtIHMyICogdDEpO1xyXG4gICAgdmFyIHNkaXIgPSBwa3pvLnZlYzMoKHQyICogeDEgLSB0MSAqIHgyKSAqIHIsICAodDIgKiB5MSAtIHQxICogeTIpICogciwodDIgKiB6MSAtIHQxICogejIpICogcik7XHJcbiAgICB2YXIgdGRpciA9IHBrem8udmVjMygoczEgKiB4MiAtIHMyICogeDEpICogciwgKHMxICogeTIgLSBzMiAqIHkxKSAqIHIsIChzMSAqIHoyIC0gczIgKiB6MSkgKiByKTtcclxuXHJcbiAgICB0YW4xW2FdID0gcGt6by5hZGQodGFuMVthXSwgc2Rpcik7XHJcbiAgICB0YW4xW2JdID0gcGt6by5hZGQodGFuMVtiXSwgc2Rpcik7XHJcbiAgICB0YW4xW2NdID0gcGt6by5hZGQodGFuMVtjXSwgc2Rpcik7XHJcblxyXG4gICAgdGFuMlthXSA9IHBrem8uYWRkKHRhbjJbYV0sIHRkaXIpO1xyXG4gICAgdGFuMltiXSA9IHBrem8uYWRkKHRhbjJbYl0sIHRkaXIpO1xyXG4gICAgdGFuMltjXSA9IHBrem8uYWRkKHRhbjJbY10sIHRkaXIpO1xyXG4gIH1cclxuICAgIFxyXG4gIHRoaXMudGFuZ2VudHMgPSBbXTtcclxuICBmb3IgKHZhciBqID0gMDsgaiA8IHZlcnRleENvdW50OyBqKyspIHtcclxuICAgIHZhciBuID0gdGhpcy5nZXROb3JtYWwoaik7XHJcbiAgICB2YXIgdCA9IHRhbjFbal07XHJcbiAgICBcclxuICAgIHZhciB0biA9IHBrem8ubm9ybWFsaXplKHBrem8uc3ZtdWx0KHBrem8uc3ViKHQsIG4pLCBwa3pvLmRvdChuLCB0KSkpO1xyXG4gICAgXHJcbiAgICBpZiAocGt6by5kb3QocGt6by5jcm9zcyhuLCB0KSwgdGFuMltqXSkgPCAwLjApIHtcclxuICAgICAgdGhpcy50YW5nZW50cy5wdXNoKC10blswXSwgLXRuWzFdLCAtdG5bMl0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMudGFuZ2VudHMucHVzaCh0blswXSwgdG5bMV0sIHRuWzJdKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiXHJcbnBrem8uTWF0ZXJpYWwgPSBmdW5jdGlvbiAob3B0cykge1x0XHJcbiAgdGhpcy5jb2xvciAgICAgPSBwa3pvLnZlYzMoMSwgMSwgMSk7XHJcbiAgdGhpcy5yb3VnaG5lc3MgPSAxO1xyXG4gIFxyXG4gIGlmIChvcHRzKSB7XHJcbiAgICB0aGlzLnJlYWQob3B0cyk7XHJcbiAgfVx0XHJcbn1cclxuXHJcbnBrem8uTWF0ZXJpYWwubG9hZCA9IGZ1bmN0aW9uICh1cmwpIHtcclxuICB2YXIgbWF0ZXJpYWwgPSBuZXcgcGt6by5NYXRlcmlhbCgpO1xyXG4gIGh0dHAuZ2V0KHVybCwgZnVuY3Rpb24gKHN0YXR1cywgZGF0YSkge1xyXG4gICAgaWYgKHN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgbWF0ZXJpYWwucmVhZChKU09OLnBhcnNlKGRhdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBtYXRlcmlhbCAlcy4nLCB1cmwpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBtYXRlcmlhbDtcclxufVxyXG5cclxucGt6by5NYXRlcmlhbC5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgaWYgKGRhdGEuY29sb3IpIHtcclxuICAgIHRoaXMuY29sb3IgPSBkYXRhLmNvbG9yO1xyXG4gIH1cclxuICBcclxuICBpZiAoZGF0YS50ZXh0dXJlKSB7XHJcbiAgICAvLyBSRVZJRVc6IHNob3VsZCB0aGUgdGV4dHVyZXMgbm90IGJlIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IGZpbGU/XHJcbiAgICAvLyAtPiBVc2Ugc29tZXRoaW5nIGxpa2UgXCJiYXNlIHBhdGhcIiB0byBmaXggdGhhdCwgdGhlbiB0aGUgbG9hZCBmdW5jdGlvblxyXG4gICAgLy8gd2lsbCBleHRyYWN0IGl0IGFuZCBwYXNzIGl0IGFsbG9uZy5cclxuICAgIHRoaXMudGV4dHVyZSA9IHBrem8uVGV4dHVyZS5sb2FkKGRhdGEudGV4dHVyZSk7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChkYXRhLnJvdWdobmVzcykge1xyXG4gICAgdGhpcy5yb3VnaG5lc3MgPSBkYXRhLnJvdWdobmVzcztcclxuICB9XHJcbiAgXHJcbiAgaWYgKGRhdGEucm91Z2huZXNzTWFwKSB7XHJcbiAgICB0aGlzLnJvdWdobmVzc01hcCA9IHBrem8uVGV4dHVyZS5sb2FkKGRhdGEucm91Z2huZXNzTWFwKTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGRhdGEubm9ybWFsTWFwKSB7XHJcbiAgICB0aGlzLm5vcm1hbE1hcCA9IHBrem8uVGV4dHVyZS5sb2FkKGRhdGEubm9ybWFsTWFwKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uTWF0ZXJpYWwucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24gKGdsLCBzaGFkZXIpIHtcclxuXHRcclxuXHRzaGFkZXIuc2V0VW5pZm9ybTNmdigndUNvbG9yJywgdGhpcy5jb2xvcik7XHJcblx0XHJcblx0aWYgKHRoaXMudGV4dHVyZSAmJiB0aGlzLnRleHR1cmUubG9hZGVkKSB7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzVGV4dHVyZScsIDEpO1xyXG5cdFx0dGhpcy50ZXh0dXJlLmJpbmQoZ2wsIDApXHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1VGV4dHVyZScsIDApO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNUZXh0dXJlJywgMCk7XHJcblx0fVx0XHJcbiAgXHJcbiAgc2hhZGVyLnNldFVuaWZvcm0xZigndVJvdWdobmVzcycsIHRoaXMucm91Z2huZXNzKTtcclxuICBpZiAodGhpcy5yb3VnaG5lc3NNYXAgJiYgdGhpcy5yb3VnaG5lc3NNYXAubG9hZGVkKSB7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzUm91Z2huZXNzTWFwJywgMSk7XHJcblx0XHR0aGlzLnJvdWdobmVzc01hcC5iaW5kKGdsLCAxKVxyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndVJvdWdobmVzc01hcCcsIDEpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNSb3VnaG5lc3NNYXAnLCAwKTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKHRoaXMubm9ybWFsTWFwICYmIHRoaXMubm9ybWFsTWFwLmxvYWRlZCkge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc05vcm1hbE1hcCcsIDEpO1xyXG5cdFx0dGhpcy5ub3JtYWxNYXAuYmluZChnbCwgMilcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VOb3JtYWxNYXAnLCAyKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzTm9ybWFsTWFwJywgMCk7XHJcblx0fVx0XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5FbnRpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy50cmFuc2Zvcm0gPSBwa3pvLm1hdDQoMSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xyXG5cdHRoaXMudHJhbnNmb3JtID0gcGt6by50cmFuc2xhdGUodGhpcy50cmFuc2Zvcm0sIHgsIHksIHopO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGFuZ2xlLCB4LCB5LCB6KSB7XHJcblx0dGhpcy50cmFuc2Zvcm0gPSBwa3pvLnJvdGF0ZSh0aGlzLnRyYW5zZm9ybSwgYW5nbGUsIHgsIHksIHopO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WFZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzBdLCB0aGlzLnRyYW5zZm9ybVsxXSwgdGhpcy50cmFuc2Zvcm1bMl0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WVZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzRdLCB0aGlzLnRyYW5zZm9ybVs1XSwgdGhpcy50cmFuc2Zvcm1bNl0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WlZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzhdLCB0aGlzLnRyYW5zZm9ybVs5XSwgdGhpcy50cmFuc2Zvcm1bMTBdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBwa3pvLnZlYzModGhpcy50cmFuc2Zvcm1bMTJdLCB0aGlzLnRyYW5zZm9ybVsxM10sIHRoaXMudHJhbnNmb3JtWzE0XSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHRoaXMudHJhbnNmb3JtWzEyXSA9IHZhbHVlWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzEzXSA9IHZhbHVlWzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzE0XSA9IHZhbHVlWzJdO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24gKHRhcmdldCwgdXApIHtcclxuICB2YXIgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcbiAgdmFyIGZvcndhcmQgID0gcGt6by5ub3JtYWxpemUocGt6by5zdWIodGFyZ2V0LCBwb3NpdGlvbikpO1xyXG4gIHZhciByaWdodCAgICA9IHBrem8ubm9ybWFsaXplKHBrem8uY3Jvc3MoZm9yd2FyZCwgdXApKTtcclxuICB2YXIgdXBuICAgICAgPSBwa3pvLm5vcm1hbGl6ZShwa3pvLmNyb3NzKHJpZ2h0LCBmb3J3YXJkKSk7XHJcbiAgXHJcbiAgLy8gVE9ETyBzY2FsaW5nXHJcbiAgdGhpcy50cmFuc2Zvcm1bMF0gPSByaWdodFswXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxXSA9IHJpZ2h0WzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzJdID0gcmlnaHRbMl07XHJcbiAgXHJcbiAgdGhpcy50cmFuc2Zvcm1bNF0gPSB1cG5bMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bNV0gPSB1cG5bMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bNl0gPSB1cG5bMl07XHJcbiAgXHJcbiAgdGhpcy50cmFuc2Zvcm1bOF0gPSBmb3J3YXJkWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzldID0gZm9yd2FyZFsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxMF0gPSBmb3J3YXJkWzJdO1xyXG59XHJcbiIsIlxyXG5wa3pvLkNhbWVyYSA9IGZ1bmN0aW9uIChvcHQpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG4gIFxyXG4gIHZhciBvID0gb3B0ID8gb3B0IDoge307XHJcbiAgXHJcbiAgdGhpcy55Zm92ICA9IG8ueWZvdiAgPyBvLnlmb3YgIDogIDQ1LjA7XHJcbiAgdGhpcy56bmVhciA9IG8uem5lYXIgPyBvLnpuZWFyIDogICAwLjE7XHJcbiAgdGhpcy56ZmFyICA9IG8uemZhciAgPyBvLnpmYXIgIDogMTAwLjA7XHJcbn1cclxuXHJcbnBrem8uQ2FtZXJhLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5DYW1lcmEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5DYW1lcmE7XHJcblxyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG4gIHZhciBhc3BlY3QgPSByZW5kZXJlci5jYW52YXMuZ2wud2lkdGggLyByZW5kZXJlci5jYW52YXMuZ2wuaGVpZ2h0O1xyXG4gIFxyXG4gIHZhciBwcm9qZWN0aW9uTWF0cml4ID0gcGt6by5wZXJzcGVjdGl2ZSh0aGlzLnlmb3YsIGFzcGVjdCwgdGhpcy56bmVhciwgdGhpcy56ZmFyKTtcclxuICBcclxuICB2YXIgcCA9IHRoaXMuZ2V0UG9zaXRpb24oKTtcclxuICB2YXIgeCA9IHRoaXMuZ2V0WFZlY3RvcigpO1xyXG4gIHZhciB5ID0gdGhpcy5nZXRZVmVjdG9yKCk7XHJcbiAgdmFyIHogPSB0aGlzLmdldFpWZWN0b3IoKTtcclxuICBcclxuICB2YXIgdmlld01hdHJpeCA9IHBrem8ubWF0NChbeFswXSwgeFsxXSwgeFsyXSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeVswXSwgeVsxXSwgeVsyXSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgelswXSwgelsxXSwgelsyXSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgICAgMCwgICAgMCwgMV0pO1xyXG4gIHZpZXdNYXRyaXggPSBwa3pvLnRyYW5zcG9zZSh2aWV3TWF0cml4KTsgLy8gdXNlIGludmVyc2VcclxuICB2aWV3TWF0cml4ID0gcGt6by50cmFuc2xhdGUodmlld01hdHJpeCwgLXBbMF0sIC1wWzFdLCAtcFsyXSk7ICBcclxuICBcclxuICByZW5kZXJlci5zZXRDYW1lcmEocHJvamVjdGlvbk1hdHJpeCwgdmlld01hdHJpeCk7XHJcbn1cclxuIiwiXHJcbnBrem8uT2JqZWN0ID0gZnVuY3Rpb24gKG1lc2gsIG1hdGVyaWFsKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuICBcclxuICB0aGlzLm1lc2ggICAgID0gbWVzaDtcclxuICB0aGlzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcbn1cclxuXHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5PYmplY3Q7XHJcblxyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdC8vIHRvZG8gcmVzcGVjdCBwYXJlbnQgdHJhbnNmb3JtXHJcblx0cmVuZGVyZXIuYWRkTWVzaCh0aGlzLnRyYW5zZm9ybSwgdGhpcy5tYXRlcmlhbCwgdGhpcy5tZXNoKTtcclxufVxyXG5cclxucGt6by5PYmplY3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoZ2wsIHNoYWRlciwgcGFyZW50TW9kZWxWaWV3TWF0cml4KSB7IFxyXG4gIFxyXG4gIHZhciBtb2RlbFZpZXdNYXRyaXggPSBwa3pvLm11bHRNYXRyaXgocGFyZW50TW9kZWxWaWV3TWF0cml4LCB0aGlzLnRyYW5zZm9ybSk7XHJcbiAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VNb2RlbFZpZXdNYXRyaXgnLCBtb2RlbFZpZXdNYXRyaXgpO1xyXG5cdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxNYXRyaXgnLCB0aGlzLnRyYW5zZm9ybSk7XHJcbiAgXHJcbiAgdGhpcy5tYXRlcmlhbC5zZXR1cChnbCwgc2hhZGVyKTtcclxuICB0aGlzLm1lc2guZHJhdyhnbCwgc2hhZGVyKTtcclxufVxyXG5cclxuIiwiXHJcbnBrem8uRGlyZWN0aW9uYWxMaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBwa3pvLnZlYzMoMC41LCAwLjUsIDAuNSk7XHJcbn1cclxuXHJcbnBrem8uRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLkRpcmVjdGlvbmFsTGlnaHQ7XHJcblxyXG5wa3pvLkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuXHR2YXIgZGlyID0gcGt6by5uZWcodGhpcy5nZXRaVmVjdG9yKCkpO1xyXG5cdHJlbmRlcmVyLmFkZERpcmVjdGlvbmFsTGlnaHQoZGlyLCB0aGlzLmNvbG9yKTtcclxufVxyXG4iLCJcclxucGt6by5Qb2ludExpZ2h0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHBrem8uRW50aXR5LmNhbGwodGhpcyk7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IHBrem8udmVjMygwLjUsIDAuNSwgMC41KTtcclxuICB0aGlzLnJhbmdlID0gMTAuMDtcclxufVxyXG5cclxucGt6by5Qb2ludExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5Qb2ludExpZ2h0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uUG9pbnRMaWdodDtcclxuXHJcbnBrem8uUG9pbnRMaWdodC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdHJlbmRlcmVyLmFkZFBvaW50TGlnaHQodGhpcy5nZXRQb3NpdGlvbigpLCB0aGlzLmNvbG9yLCB0aGlzLnJhbmdlKTtcclxufVxyXG4iLCJcclxucGt6by5TcG90TGlnaHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuXHRcclxuXHR0aGlzLmNvbG9yICA9IHBrem8udmVjMygwLjUsIDAuNSwgMC41KTtcclxuICB0aGlzLnJhbmdlICA9IDEwLjA7XHJcbiAgdGhpcy5jdXRvZmYgPSAyNS4wO1xyXG59XHJcblxyXG5wa3pvLlNwb3RMaWdodC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uU3BvdExpZ2h0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uU3BvdExpZ2h0O1xyXG5cclxucGt6by5TcG90TGlnaHQucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuICB2YXIgZGlyID0gcGt6by5uZWcodGhpcy5nZXRaVmVjdG9yKCkpO1xyXG5cdHJlbmRlcmVyLmFkZFNwb3RMaWdodCh0aGlzLmdldFBvc2l0aW9uKCksIGRpciwgdGhpcy5jb2xvciwgdGhpcy5yYW5nZSwgdGhpcy5jdXRvZmYpO1xyXG59XHJcbiIsIlxyXG5wa3pvLlNreUJveCA9IGZ1bmN0aW9uIChjdWJlTWFwKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuICBcclxuICB0aGlzLmN1YmVNYXAgPSBjdWJlTWFwO1xyXG59XHJcblxyXG5wa3pvLlNreUJveC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uU2t5Qm94LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uU2t5Qm94O1xyXG5cclxucGt6by5Ta3lCb3gucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuICBpZiAodGhpcy5jdWJlTWFwLmxvYWRlZCkge1xyXG4gICAgcmVuZGVyZXIuYWRkU2t5Qm94KHRoaXMuY3ViZU1hcCk7XHJcbiAgfVxyXG59XHJcblxyXG4iLCJcclxucGt6by5SZW5kZXJlciA9IGZ1bmN0aW9uIChjYW52YXMpIHtcclxuICB0aGlzLmNhbnZhcyA9IG5ldyBwa3pvLkNhbnZhcyhjYW52YXMpO1xyXG4gIFxyXG4gIHZhciByZW5kZXJlciA9IHRoaXM7XHJcbiAgXHJcbiAgdGhpcy5jYW52YXMuaW5pdChmdW5jdGlvbiAoZ2wpIHtcclxuICAgIHJlbmRlcmVyLnN5a0JveFNoYWRlciAgPSBuZXcgcGt6by5TaGFkZXIoZ2wsIHBrem8uSW52ZXJzZSArIHBrem8uVHJhbnNwb3NlICsgcGt6by5Ta3lCb3hWZXJ0LCBwa3pvLlNreUJveEZyYWcpO1xyXG4gICAgcmVuZGVyZXIuYW1iaWVudFNoYWRlciA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5Tb2xpZFZlcnQsIHBrem8uQW1iaWVudEZyYWcpO1xyXG4gICAgcmVuZGVyZXIubGlnaHRTaGFkZXIgICA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5Tb2xpZFZlcnQsIHBrem8uTGlnaHRGcmFnKTsgICBcclxuXHJcbiAgICByZW5kZXJlci5zY3JlZW5QbGFuZSAgID0gcGt6by5NZXNoLnBsYW5lKDIsIDIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5zZXRDYW1lcmEgPSBmdW5jdGlvbiAocHJvamVjdGlvbk1hdHJpeCwgdmlld01hdHJpeCkge1xyXG4gIHRoaXMucHJvamVjdGlvbk1hdHJpeCA9IHByb2plY3Rpb25NYXRyaXg7XHJcbiAgdGhpcy52aWV3TWF0cml4ICAgICAgID0gdmlld01hdHJpeDtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkTWVzaCA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0sIG1hdGVyaWFsLCBtZXNoKSB7XHJcbiAgdGhpcy5zb2xpZHMucHVzaCh7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybSxcclxuICAgIG1hdGVyaWFsOiBtYXRlcmlhbCwgXHJcbiAgICBtZXNoOiBtZXNoXHJcbiAgfSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmFkZFNreUJveCA9IGZ1bmN0aW9uIChjdWJlTWFwKSB7XHJcbiAgdGhpcy5za3lCb3ggPSBjdWJlTWFwO1xyXG59XHJcblxyXG5wa3pvLkRJUkVDVElPTkFMX0xJR0hUID0gMTtcclxucGt6by5QT0lOVF9MSUdIVCAgICAgICA9IDI7XHJcbnBrem8uU1BPVF9MSUdIVCAgICAgICAgPSAzO1xyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkRGlyZWN0aW9uYWxMaWdodCA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGNvbG9yKSB7XHJcbiAgdGhpcy5saWdodHMucHVzaCh7XHJcbiAgICB0eXBlOiBwa3pvLkRJUkVDVElPTkFMX0xJR0hULFxyXG4gICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICBjb2xvcjogY29sb3JcclxuICB9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkUG9pbnRMaWdodCA9IGZ1bmN0aW9uIChwb3NpdGlvbiwgY29sb3IsIHJhbmdlKSB7XHJcbiAgdGhpcy5saWdodHMucHVzaCh7XHJcbiAgICB0eXBlOiBwa3pvLlBPSU5UX0xJR0hULFxyXG4gICAgcG9zaXRpb246IHBvc2l0aW9uLFxyXG4gICAgY29sb3I6IGNvbG9yLFxyXG4gICAgcmFuZ2U6IHJhbmdlXHJcbiAgfSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmFkZFNwb3RMaWdodCA9IGZ1bmN0aW9uIChwb3NpdGlvbiwgZGlyZWN0aW9uLCBjb2xvciwgcmFuZ2UsIGN1dG9mZikge1xyXG4gIHRoaXMubGlnaHRzLnB1c2goe1xyXG4gICAgdHlwZTogcGt6by5TUE9UX0xJR0hULFxyXG4gICAgcG9zaXRpb246IHBvc2l0aW9uLFxyXG4gICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICBjb2xvcjogY29sb3IsXHJcbiAgICByYW5nZTogcmFuZ2UsXHJcbiAgICBjdXRvZmY6IGN1dG9mZlxyXG4gIH0pO1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5kcmF3U2t5Qm94ID0gZnVuY3Rpb24gKGdsKSB7XHJcbiAgaWYgKHRoaXMuc2t5Qm94KSB7XHJcbiAgICB2YXIgc2hhZGVyID0gdGhpcy5zeWtCb3hTaGFkZXI7XHJcbiAgICBcclxuICAgIHNoYWRlci5iaW5kKCk7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVByb2plY3Rpb25NYXRyaXgnLCB0aGlzLnByb2plY3Rpb25NYXRyaXgpOyAgIFxyXG4gICAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VWaWV3TWF0cml4JywgICAgICAgdGhpcy52aWV3TWF0cml4KTtcclxuICAgIFxyXG4gICAgdGhpcy5za3lCb3guYmluZChnbCwgMCk7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTFpKCd1Q3ViZW1hcCcsIDApO1xyXG4gICAgXHJcbiAgICB0aGlzLnNjcmVlblBsYW5lLmRyYXcoZ2wsIHNoYWRlcik7ICAgIFxyXG4gIH1cclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuZHJhd1NvbGlkcyA9IGZ1bmN0aW9uIChnbCwgc2hhZGVyKSB7XHJcbiAgdGhpcy5zb2xpZHMuZm9yRWFjaChmdW5jdGlvbiAoc29saWQpIHtcclxuICAgIHZhciBub3JtID0gcGt6by5tdWx0TWF0cml4KHBrem8ubWF0Myh0aGlzLnZpZXdNYXRyaXgpLCBwa3pvLm1hdDMoc29saWQudHJhbnNmb3JtKSk7XHJcbiAgICAgICAgXHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndU1vZGVsTWF0cml4Jywgc29saWQudHJhbnNmb3JtKTtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4M2Z2KCd1Tm9ybWFsTWF0cml4Jywgbm9ybSk7XHJcbiAgICBcclxuICAgIHNvbGlkLm1hdGVyaWFsLnNldHVwKGdsLCBzaGFkZXIpOyAgICAgXHJcbiAgICBzb2xpZC5tZXNoLmRyYXcoZ2wsIHNoYWRlcik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmFtYmllbnRQYXNzID0gZnVuY3Rpb24gKGdsLCBhbWJpZW50TGlnaHQpIHtcclxuICB2YXIgc2hhZGVyID0gdGhpcy5hbWJpZW50U2hhZGVyOyAgICBcclxuICBzaGFkZXIuYmluZCgpO1xyXG4gIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1UHJvamVjdGlvbk1hdHJpeCcsIHRoaXMucHJvamVjdGlvbk1hdHJpeCk7ICAgXHJcbiAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VWaWV3TWF0cml4JywgICAgICAgdGhpcy52aWV3TWF0cml4KTsgICBcclxuICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybTNmdigndUFtYmllbnRMaWdodCcsIGFtYmllbnRMaWdodCk7ICAgIFxyXG4gICAgXHJcbiAgdGhpcy5kcmF3U29saWRzKGdsLCBzaGFkZXIpOyAgXHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmxpZ2h0UGFzcyA9IGZ1bmN0aW9uIChnbCwgbGlnaHQpIHtcclxuICB2YXIgc2hhZGVyID0gdGhpcy5saWdodFNoYWRlcjsgICAgXHJcbiAgc2hhZGVyLmJpbmQoKTtcclxuICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVByb2plY3Rpb25NYXRyaXgnLCB0aGlzLnByb2plY3Rpb25NYXRyaXgpOyAgIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1Vmlld01hdHJpeCcsICAgICAgIHRoaXMudmlld01hdHJpeCk7ICAgXHJcbiAgXHJcbiAgc2hhZGVyLnNldFVuaWZvcm0xaSgndUxpZ2h0VHlwZScsIGxpZ2h0LnR5cGUpO1xyXG4gIGlmIChsaWdodC5kaXJlY3Rpb24pIHtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1TGlnaHREaXJlY3Rpb24nLCBsaWdodC5kaXJlY3Rpb24pO1xyXG4gIH0gIFxyXG4gIGlmIChsaWdodC5wb3NpdGlvbikge1xyXG4gICAgc2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VMaWdodFBvc2l0aW9uJywgbGlnaHQucG9zaXRpb24pO1xyXG4gIH1cclxuICBpZiAobGlnaHQucmFuZ2UpIHtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWYoJ3VMaWdodFJhbmdlJywgbGlnaHQucmFuZ2UpO1xyXG4gIH1cclxuICBpZiAobGlnaHQuY3V0b2ZmKSB7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTFmKCd1TGlnaHRDdXRvZmYnLCBsaWdodC5jdXRvZmYpO1xyXG4gIH1cclxuICBzaGFkZXIuc2V0VW5pZm9ybTNmdigndUxpZ2h0Q29sb3InLCBsaWdodC5jb2xvcik7XHJcbiAgXHJcbiAgdGhpcy5kcmF3U29saWRzKGdsLCBzaGFkZXIpOyAgXHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChzY2VuZSkge1xyXG4gIHZhciByZW5kZXJlciA9IHRoaXM7XHJcbiAgXHJcbiAgdGhpcy5zb2xpZHMgPSBbXTtcclxuICB0aGlzLmxpZ2h0cyA9IFtdO1xyXG4gIHRoaXMuc2t5Qm94ID0gbnVsbDtcclxuICBzY2VuZS5lbnF1ZXVlKHRoaXMpO1xyXG4gIFxyXG4gIHRoaXMuY2FudmFzLmRyYXcoZnVuY3Rpb24gKGdsKSB7XHJcbiAgICBcclxuICAgIGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xyXG4gICAgZ2wuZGVwdGhNYXNrKGZhbHNlKTtcclxuICAgIGdsLmRpc2FibGUoZ2wuREVQVEhfVEVTVCk7XHJcbiAgICByZW5kZXJlci5kcmF3U2t5Qm94KGdsKTtcclxuICAgIFxyXG4gICAgZ2wuZGVwdGhNYXNrKHRydWUpO1xyXG4gICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XHJcbiAgICByZW5kZXJlci5hbWJpZW50UGFzcyhnbCwgc2NlbmUuYW1iaWVudExpZ2h0KTtcclxuICAgIFxyXG4gICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcclxuICAgIGdsLmJsZW5kRnVuYyhnbC5PTkUsIGdsLk9ORSk7XHJcbiAgICBcclxuICAgIHJlbmRlcmVyLmxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uIChsaWdodCkge1xyXG4gICAgICByZW5kZXJlci5saWdodFBhc3MoZ2wsIGxpZ2h0KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==