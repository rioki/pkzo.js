
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
  this.id = this.gl.createTexture();
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
  
  if (this.loaded) {
    this.sync();
  }
  else {
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
  }
}

pkzo.Texture.prototype.sync = function () {
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);  
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);  
  this.gl.generateMipmap(this.gl.TEXTURE_2D);
  
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
  
  // can we discard image now?
}

pkzo.Texture.prototype.release = function () {
  this.gl.deleteTexture(this.id);
  this.id = null;
}

pkzo.Texture.prototype.bind = function (gl, channel) {
	this.gl = gl;
  if (! this.id) {
    this.upload();
  }
	// TODO channel
  this.gl.activeTexture(gl.TEXTURE0 + channel);
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
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
      if (cubemap.id) {
        cubemap.sync();
      }
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
  this.id = this.gl.createTexture();
  this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.id);
  
  if (this.loaded) {
    this.sync();
  }  
}

pkzo.CubeMap.prototype.sync = function () {
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
  if (! this.id) {
    this.upload();
  }
  // TODO channel
  this.gl.activeTexture(gl.TEXTURE0 + channel);
  this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.id);
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
  this.gl.enableVertexAttribArray(pos);
  this.gl.vertexAttribPointer(pos, elementSize, buffer.elementType, this.gl.FALSE, 0, 0);  
}

pkzo.Shader.prototype.setUniform1i = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  this.gl.uniform1i(loc, value);
}

pkzo.Shader.prototype.setUniform1f = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  this.gl.uniform1f(loc, value);
}

pkzo.Shader.prototype.setUniform2fv = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  this.gl.uniform2f(loc, value[0], value[1]);
}

pkzo.Shader.prototype.setUniform3fv = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  this.gl.uniform3f(loc, value[0], value[1], value[2]);
}

pkzo.Shader.prototype.setUniform4fv = function (name, value) {
  var loc = this.gl.getUniformLocation(this.id, name);
  this.gl.uniform4f(loc, value[0], value[1], value[2], value[4]);
}

pkzo.Shader.prototype.setUniformMatrix3fv = function (name, value, transpose) {
  if (transpose === undefined ||transpose === null) {
    var transpose = false;
  }
  var loc = this.gl.getUniformLocation(this.id, name);
  this.gl.uniformMatrix3fv(loc, transpose, value);
}

pkzo.Shader.prototype.setUniformMatrix4fv = function (name, value, transpose) {
  if (transpose === undefined ||transpose === null) {
    var transpose = false;
  }
  var loc = this.gl.getUniformLocation(this.id, name);
  this.gl.uniformMatrix4fv(loc, transpose, value);
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
  renderer.addSkyBox(this.cubeMap);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHAuanMiLCJwa3pvLmpzIiwic2hhZGVycy5qcyIsInZlY3Rvci5qcyIsIm1hdHJpeC5qcyIsIkNhbnZhcy5qcyIsIlRleHR1cmUuanMiLCJDdWJlTWFwLmpzIiwiU2hhZGVyLmpzIiwiU2NlbmUuanMiLCJCdWZmZXIuanMiLCJQbHlQYXJzZXIuanMiLCJNZXNoLmpzIiwiTWF0ZXJpYWwuanMiLCJFbnRpdHkuanMiLCJDYW1lcmEuanMiLCJPYmplY3QuanMiLCJEaXJlY3Rpb25hbExpZ2h0LmpzIiwiUG9pbnRMaWdodC5qcyIsIlNwb3RMaWdodC5qcyIsIlNreUJveC5qcyIsIlJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNXFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJwa3pvLTAuMC4xLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBodHRwID0ge307XHJcblxyXG5odHRwLnNlbmQgPSBmdW5jdGlvbiAodHlwZSwgdXJsLCBkYXRhLCBjYikge1xyXG4gIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpXHJcbiAge1xyXG4gICAgaWYgKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KVxyXG4gICAge1xyXG4gICAgICBjYih4bWxodHRwLnN0YXR1cywgeG1saHR0cC5yZXNwb25zZVRleHQpO1xyXG4gICAgfVxyXG4gIH0gICAgXHJcbiAgeG1saHR0cC5vcGVuKHR5cGUsIHVybCwgdHJ1ZSk7XHJcbiAgeG1saHR0cC5zZW5kKGRhdGEpO1xyXG59XHJcblxyXG5odHRwLmdldCA9IGZ1bmN0aW9uICh1cmwsIGNiKSB7XHJcbiAgaHR0cC5zZW5kKFwiR0VUXCIsIHVybCwgbnVsbCwgY2IpO1xyXG59XHJcblxyXG5odHRwLnBvc3QgPSBmdW5jdGlvbiAodXJsLCBkYXRhLCBjYikge1xyXG4gIGh0dHAuc2VuZChcIkdFVFwiLCB1cmwsIGRhdGEsIGNiKTtcclxufVxyXG4iLCJcclxudmFyIHBrem8gPSB7dmVyc2lvbjogJzAuMC4xJ307XHJcbiIsInBrem8uQW1iaWVudEZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIHZlYzMgICAgICB1Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmU7XFxuXFxudW5pZm9ybSBib29sICAgICAgdUhhc1RleHR1cmU7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzIHVBbWJpZW50TGlnaHQ7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgdmVjMyBjb2xvciA9IHVDb2xvcjtcXG5cXG4gICAgXFxuXFxuICAgIGlmICh1SGFzVGV4dHVyZSkge1xcblxcbiAgICAgICAgY29sb3IgPSBjb2xvciAqIHRleHR1cmUyRCh1VGV4dHVyZSwgdlRleENvb3JkKS5yZ2I7XFxuXFxuICAgIH1cXG5cXG4gICAgXFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IgKiB1QW1iaWVudExpZ2h0LCAxKTtcXG5cXG59XFxuXFxuXCI7XG5wa3pvLkludmVyc2UgPSBcIi8qXFxuXFxuVGhlIE1JVCBMaWNlbnNlIChNSVQpXFxuXFxuXFxuXFxuQ29weXJpZ2h0IChjKSAyMDE0IE1pa29sYSBMeXNlbmtvXFxuXFxuXFxuXFxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxcblxcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFxcXCJTb2Z0d2FyZVxcXCIpLCB0byBkZWFsXFxuXFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xcblxcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcXG5cXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcXG5cXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxcblxcblxcblxcblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXFxuXFxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXFxuXFxuXFxuXFxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFxcXCJBUyBJU1xcXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcXG5cXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcXG5cXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcXG5cXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXFxuXFxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcXG5cXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXFxuXFxuVEhFIFNPRlRXQVJFLlxcblxcbiovXFxuXFxuXFxuXFxubWF0MiBpbnZlcnNlKG1hdDIgbSkge1xcblxcbiAgcmV0dXJuIG1hdDIobVsxXVsxXSwtbVswXVsxXSxcXG5cXG4gICAgICAgICAgICAgLW1bMV1bMF0sIG1bMF1bMF0pIC8gKG1bMF1bMF0qbVsxXVsxXSAtIG1bMF1bMV0qbVsxXVswXSk7XFxuXFxufVxcblxcblxcblxcbm1hdDMgaW52ZXJzZShtYXQzIG0pIHtcXG5cXG4gIGZsb2F0IGEwMCA9IG1bMF1bMF0sIGEwMSA9IG1bMF1bMV0sIGEwMiA9IG1bMF1bMl07XFxuXFxuICBmbG9hdCBhMTAgPSBtWzFdWzBdLCBhMTEgPSBtWzFdWzFdLCBhMTIgPSBtWzFdWzJdO1xcblxcbiAgZmxvYXQgYTIwID0gbVsyXVswXSwgYTIxID0gbVsyXVsxXSwgYTIyID0gbVsyXVsyXTtcXG5cXG5cXG5cXG4gIGZsb2F0IGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMTtcXG5cXG4gIGZsb2F0IGIxMSA9IC1hMjIgKiBhMTAgKyBhMTIgKiBhMjA7XFxuXFxuICBmbG9hdCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XFxuXFxuXFxuXFxuICBmbG9hdCBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XFxuXFxuXFxuXFxuICByZXR1cm4gbWF0MyhiMDEsICgtYTIyICogYTAxICsgYTAyICogYTIxKSwgKGExMiAqIGEwMSAtIGEwMiAqIGExMSksXFxuXFxuICAgICAgICAgICAgICBiMTEsIChhMjIgKiBhMDAgLSBhMDIgKiBhMjApLCAoLWExMiAqIGEwMCArIGEwMiAqIGExMCksXFxuXFxuICAgICAgICAgICAgICBiMjEsICgtYTIxICogYTAwICsgYTAxICogYTIwKSwgKGExMSAqIGEwMCAtIGEwMSAqIGExMCkpIC8gZGV0O1xcblxcbn1cXG5cXG5cXG5cXG5tYXQ0IGludmVyc2UobWF0NCBtKSB7XFxuXFxuICBmbG9hdFxcblxcbiAgICAgIGEwMCA9IG1bMF1bMF0sIGEwMSA9IG1bMF1bMV0sIGEwMiA9IG1bMF1bMl0sIGEwMyA9IG1bMF1bM10sXFxuXFxuICAgICAgYTEwID0gbVsxXVswXSwgYTExID0gbVsxXVsxXSwgYTEyID0gbVsxXVsyXSwgYTEzID0gbVsxXVszXSxcXG5cXG4gICAgICBhMjAgPSBtWzJdWzBdLCBhMjEgPSBtWzJdWzFdLCBhMjIgPSBtWzJdWzJdLCBhMjMgPSBtWzJdWzNdLFxcblxcbiAgICAgIGEzMCA9IG1bM11bMF0sIGEzMSA9IG1bM11bMV0sIGEzMiA9IG1bM11bMl0sIGEzMyA9IG1bM11bM10sXFxuXFxuXFxuXFxuICAgICAgYjAwID0gYTAwICogYTExIC0gYTAxICogYTEwLFxcblxcbiAgICAgIGIwMSA9IGEwMCAqIGExMiAtIGEwMiAqIGExMCxcXG5cXG4gICAgICBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTAsXFxuXFxuICAgICAgYjAzID0gYTAxICogYTEyIC0gYTAyICogYTExLFxcblxcbiAgICAgIGIwNCA9IGEwMSAqIGExMyAtIGEwMyAqIGExMSxcXG5cXG4gICAgICBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTIsXFxuXFxuICAgICAgYjA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwLFxcblxcbiAgICAgIGIwNyA9IGEyMCAqIGEzMiAtIGEyMiAqIGEzMCxcXG5cXG4gICAgICBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzAsXFxuXFxuICAgICAgYjA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxLFxcblxcbiAgICAgIGIxMCA9IGEyMSAqIGEzMyAtIGEyMyAqIGEzMSxcXG5cXG4gICAgICBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzIsXFxuXFxuXFxuXFxuICAgICAgZGV0ID0gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xcblxcblxcblxcbiAgcmV0dXJuIG1hdDQoXFxuXFxuICAgICAgYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5LFxcblxcbiAgICAgIGEwMiAqIGIxMCAtIGEwMSAqIGIxMSAtIGEwMyAqIGIwOSxcXG5cXG4gICAgICBhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMsXFxuXFxuICAgICAgYTIyICogYjA0IC0gYTIxICogYjA1IC0gYTIzICogYjAzLFxcblxcbiAgICAgIGExMiAqIGIwOCAtIGExMCAqIGIxMSAtIGExMyAqIGIwNyxcXG5cXG4gICAgICBhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcsXFxuXFxuICAgICAgYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxLFxcblxcbiAgICAgIGEyMCAqIGIwNSAtIGEyMiAqIGIwMiArIGEyMyAqIGIwMSxcXG5cXG4gICAgICBhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYsXFxuXFxuICAgICAgYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2LFxcblxcbiAgICAgIGEzMCAqIGIwNCAtIGEzMSAqIGIwMiArIGEzMyAqIGIwMCxcXG5cXG4gICAgICBhMjEgKiBiMDIgLSBhMjAgKiBiMDQgLSBhMjMgKiBiMDAsXFxuXFxuICAgICAgYTExICogYjA3IC0gYTEwICogYjA5IC0gYTEyICogYjA2LFxcblxcbiAgICAgIGEwMCAqIGIwOSAtIGEwMSAqIGIwNyArIGEwMiAqIGIwNixcXG5cXG4gICAgICBhMzEgKiBiMDEgLSBhMzAgKiBiMDMgLSBhMzIgKiBiMDAsXFxuXFxuICAgICAgYTIwICogYjAzIC0gYTIxICogYjAxICsgYTIyICogYjAwKSAvIGRldDtcXG5cXG59XFxuXFxuXCI7XG5wa3pvLkxpZ2h0RnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyAgICAgIHVDb2xvcjtcXG5cXG51bmlmb3JtIGJvb2wgICAgICB1SGFzVGV4dHVyZTtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZTtcXG5cXG51bmlmb3JtIGZsb2F0ICAgICB1Um91Z2huZXNzO1xcblxcbnVuaWZvcm0gYm9vbCAgICAgIHVIYXNSb3VnaG5lc3NNYXA7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVJvdWdobmVzc01hcDtcXG5cXG51bmlmb3JtIGJvb2wgICAgICB1SGFzTm9ybWFsTWFwO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVOb3JtYWxNYXA7XFxuXFxuXFxuXFxudW5pZm9ybSBpbnQgICB1TGlnaHRUeXBlOyAvLyAxOiBkaXJlY3Rpb25hbCwgMjogcG9pbnQsIDM6IHNwb3RcXG5cXG51bmlmb3JtIHZlYzMgIHVMaWdodENvbG9yO1xcblxcbnVuaWZvcm0gdmVjMyAgdUxpZ2h0RGlyZWN0aW9uO1xcblxcbnVuaWZvcm0gdmVjMyAgdUxpZ2h0UG9zaXRpb247XFxuXFxudW5pZm9ybSBmbG9hdCB1TGlnaHRSYW5nZTtcXG5cXG51bmlmb3JtIGZsb2F0IHVMaWdodEN1dG9mZjtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzMgdk5vcm1hbDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleENvb3JkO1xcblxcbnZhcnlpbmcgdmVjMyB2UG9zaXRpb247XFxuXFxudmFyeWluZyB2ZWMzIHZFeWU7XFxuXFxudmFyeWluZyBtYXQzIHZUQk47XFxuXFxuXFxuXFxudm9pZCBtYWluKCkge1xcblxcbiAgICB2ZWMzIGNvbG9yID0gdUNvbG9yOyAgICBcXG5cXG4gICAgaWYgKHVIYXNUZXh0dXJlKSB7XFxuXFxuICAgICAgICBjb2xvciA9IGNvbG9yICogdGV4dHVyZTJEKHVUZXh0dXJlLCB2VGV4Q29vcmQpLnJnYjtcXG5cXG4gICAgfVxcblxcbiAgICBcXG5cXG4gICAgdmVjMyBub3JtYWw7XFxuXFxuICAgIGlmICh1SGFzTm9ybWFsTWFwKSB7XFxuXFxuICAgICAgICBub3JtYWwgPSBub3JtYWxpemUodlRCTiAqIHRleHR1cmUyRCh1Tm9ybWFsTWFwLCB2VGV4Q29vcmQpLnJnYik7XFxuXFxuICAgIH1cXG5cXG4gICAgZWxzZSB7XFxuXFxuICAgICAgICBub3JtYWwgPSBub3JtYWxpemUodk5vcm1hbCk7ICAgICAgICBcXG5cXG4gICAgfVxcblxcbiAgICBcXG5cXG4gICAgdmVjMyBsaWdodERpcmVjdGlvbjtcXG5cXG4gICAgZmxvYXQgYXR0ZW47XFxuXFxuICAgIGlmICh1TGlnaHRUeXBlID09IDEpIHtcXG5cXG4gICAgICAgIGxpZ2h0RGlyZWN0aW9uID0gbm9ybWFsaXplKC11TGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgYXR0ZW4gPSAxLjA7XFxuXFxuICAgIH1cXG5cXG4gICAgaWYgKHVMaWdodFR5cGUgPT0gMikge1xcblxcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSB1TGlnaHRQb3NpdGlvbiAtIHZQb3NpdGlvbjtcXG5cXG4gICAgICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgobGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgaWYgKGRpc3QgPiB1TGlnaHRSYW5nZSkge1xcblxcbiAgICAgICAgICAgIGRpc2NhcmQ7XFxuXFxuICAgICAgICB9XFxuXFxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IG5vcm1hbGl6ZShsaWdodERpcmVjdGlvbik7XFxuXFxuICAgICAgICBhdHRlbiA9IDEuMCAtIChkaXN0IC8gdUxpZ2h0UmFuZ2UpOyAgICBcXG5cXG4gICAgfVxcblxcbiAgICBpZiAodUxpZ2h0VHlwZSA9PSAzKSB7XFxuXFxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IHVMaWdodFBvc2l0aW9uIC0gdlBvc2l0aW9uO1xcblxcbiAgICAgICAgZmxvYXQgZGlzdCA9IGxlbmd0aChsaWdodERpcmVjdGlvbik7XFxuXFxuICAgICAgICBpZiAoZGlzdCA+IHVMaWdodFJhbmdlKSB7XFxuXFxuICAgICAgICAgICAgZGlzY2FyZDtcXG5cXG4gICAgICAgIH1cXG5cXG4gICAgICAgIGxpZ2h0RGlyZWN0aW9uID0gbm9ybWFsaXplKGxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgICAgIGF0dGVuID0gMS4wIC0gKGRpc3QgLyB1TGlnaHRSYW5nZSk7ICAgIFxcblxcbiAgICAgICAgXFxuXFxuICAgICAgICBpZiAoZG90KGxpZ2h0RGlyZWN0aW9uLCAtdUxpZ2h0RGlyZWN0aW9uKSA8IHVMaWdodEN1dG9mZikge1xcblxcbiAgICAgICAgICAgIGRpc2NhcmQ7XFxuXFxuICAgICAgICB9ICBcXG5cXG4gICAgfVxcblxcbiAgICBcXG5cXG4gICAgdmVjMyByZXN1bHQgPSB2ZWMzKDApOyAgICBcXG5cXG4gICAgZmxvYXQgbkRvdEwgPSBkb3Qobm9ybWFsLCBsaWdodERpcmVjdGlvbik7XFxuXFxuICAgIGlmIChuRG90TCA+IDAuMCkgeyAgICBcXG5cXG4gICAgICAgIHJlc3VsdCArPSBuRG90TCAqIGNvbG9yICogdUxpZ2h0Q29sb3IgKiBhdHRlbjtcXG5cXG4gICAgICAgIFxcblxcbiAgICAgICAgdmVjMyBleWUgPSBub3JtYWxpemUodkV5ZSk7XFxuXFxuICAgICAgICB2ZWMzIHJlZmxlY3Rpb24gPSByZWZsZWN0KG5vcm1hbCwgbGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgZmxvYXQgc2hpbmluZXNzID0gMS4wIC0gdVJvdWdobmVzcztcXG5cXG4gICAgICAgIGlmICh1SGFzUm91Z2huZXNzTWFwKSB7XFxuXFxuICAgICAgICAgICAgc2hpbmluZXNzID0gc2hpbmluZXNzICogKDEuMCAtIHRleHR1cmUyRCh1Um91Z2huZXNzTWFwLCB2VGV4Q29vcmQpLnIpO1xcblxcbiAgICAgICAgfSAgICAgICAgXFxuXFxuXFxuXFxuICAgICAgICBmbG9hdCBlRG90UiA9IGRvdChleWUsIHJlZmxlY3Rpb24pO1x0XFxuXFxuICAgICAgICBpZiAoZURvdFIgPiAwLjApXFxuXFxuICAgICAgICB7XFxuXFxuICAgICAgICAgICAgLy8gMC0xIC0+IDAtMTI4XFxuXFxuICAgICAgICAgICAgZmxvYXQgc2kgPSBwb3coZURvdFIsIHNoaW5pbmVzcyAqIDEyOC4wKTtcXG5cXG4gICAgICAgICAgICByZXN1bHQgKz0gdUxpZ2h0Q29sb3IgKiB2ZWMzKHNoaW5pbmVzcykgICogc2k7XFxuXFxuICAgICAgICB9XFxuXFxuICAgIH1cXG5cXG4gICAgICAgICAgICBcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChyZXN1bHQsIDEuMCk7XFxuXFxufSAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcblxcblwiO1xucGt6by5Ta3lCb3hGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSBzYW1wbGVyQ3ViZSB1Q3ViZW1hcDtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzMgdkRpcmVjdGlvbjtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZUN1YmUodUN1YmVtYXAsIHZEaXJlY3Rpb24pO1xcblxcbn1cXG5cXG5cIjtcbnBrem8uU2t5Qm94VmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gbWF0NCB1UHJvamVjdGlvbk1hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDQgdVZpZXdNYXRyaXg7XFxuXFxuXFxuXFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleDtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzMgdkRpcmVjdGlvbjtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgdmVjNCB2ZXJ0ZXggICAgICAgICAgICA9IHZlYzQoYVZlcnRleCwgMSk7XFxuXFxuICAgIG1hdDQgaW52ZXJzZVByb2plY3Rpb24gPSBpbnZlcnNlKHVQcm9qZWN0aW9uTWF0cml4KTtcXG5cXG4gICAgbWF0MyBpbnZlcnNlVmlldyAgICAgICA9IGludmVyc2UobWF0Myh1Vmlld01hdHJpeCkpO1xcblxcbiAgICB2ZWMzIHVucHJvamVjdGVkICAgICAgID0gKGludmVyc2VQcm9qZWN0aW9uICogdmVydGV4KS54eXo7XFxuXFxuICAgIFxcblxcbiAgICB2RGlyZWN0aW9uICA9IGludmVyc2VWaWV3ICogdW5wcm9qZWN0ZWQ7XFxuXFxuICAgIGdsX1Bvc2l0aW9uID0gdmVydGV4O1xcblxcbn1cIjtcbnBrem8uU29saWRGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzIHVDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZTtcXG5cXG51bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgaWYgKHVIYXNUZXh0dXJlKSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkgKiB2ZWM0KHVDb2xvciwgMSk7XFxuXFxuICAgIH1cXG5cXG4gICAgZWxzZSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHVDb2xvciwgMSk7XFxuXFxuICAgIH1cXG5cXG59XCI7XG5wa3pvLlNvbGlkVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gbWF0NCB1UHJvamVjdGlvbk1hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDQgdVZpZXdNYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQ0IHVNb2RlbE1hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDMgdU5vcm1hbE1hdHJpeDtcXG5cXG5cXG5cXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4O1xcblxcbmF0dHJpYnV0ZSB2ZWMzIGFOb3JtYWw7XFxuXFxuYXR0cmlidXRlIHZlYzIgYVRleENvb3JkO1xcblxcbmF0dHJpYnV0ZSB2ZWMzIGFUYW5nZW50O1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxudmFyeWluZyB2ZWMzIHZQb3NpdGlvbjtcXG5cXG52YXJ5aW5nIHZlYzMgdkV5ZTtcXG5cXG52YXJ5aW5nIG1hdDMgdlRCTjtcXG5cXG5cXG5cXG52b2lkIG1haW4oKSB7XFxuXFxuICB2ZWMzIG4gPSBub3JtYWxpemUodU5vcm1hbE1hdHJpeCAqIGFOb3JtYWwpO1xcblxcbiAgdmVjMyB0ID0gbm9ybWFsaXplKHVOb3JtYWxNYXRyaXggKiBhVGFuZ2VudCk7XFxuXFxuICB2ZWMzIGIgPSBub3JtYWxpemUoY3Jvc3MobiwgdCkpO1xcblxcbiAgICBcXG5cXG4gIHZOb3JtYWwgICAgID0gbjtcXG5cXG4gIHZUZXhDb29yZCAgID0gYVRleENvb3JkO1xcblxcbiAgdlBvc2l0aW9uICAgPSB2ZWMzKHVNb2RlbE1hdHJpeCAqIHZlYzQoYVZlcnRleCwgMS4wKSk7XFxuXFxuICBcXG5cXG4gIHZFeWUgICAgICAgID0gbWF0Myh1Vmlld01hdHJpeCkgKiAtYVZlcnRleDtcXG5cXG4gIHZUQk4gICAgICAgID0gbWF0Myh0LCBiLCBuKTtcXG5cXG4gIFxcblxcbiAgZ2xfUG9zaXRpb24gPSB1UHJvamVjdGlvbk1hdHJpeCAqIHVWaWV3TWF0cml4ICogdU1vZGVsTWF0cml4ICogdmVjNChhVmVydGV4LCAxKTtcXG5cXG59XCI7XG5wa3pvLlRyYW5zcG9zZSA9IFwiXFxuXFxubWF0MiB0YW5zcG9zZShtYXQyIG0pIHtcXG5cXG4gIG1hdDIgcjtcXG5cXG4gIGZvciAoaW50IGkgPSAwOyBpIDwgMjsgaSsrKSB7XFxuXFxuICAgIGZvciAoaW50IGogPSAwOyBqIDwgMjsgaisrKSB7XFxuXFxuICAgICAgIHJbaV1bal0gPSBtW2pdW2ldO1xcblxcbiAgICB9XFxuXFxuICB9XFxuXFxuICByZXR1cm4gcjtcXG5cXG59XFxuXFxuXFxuXFxubWF0MyB0YW5zcG9zZShtYXQzIG0pIHtcXG5cXG4gIG1hdDMgcjtcXG5cXG4gIGZvciAoaW50IGkgPSAwOyBpIDwgMzsgaSsrKSB7XFxuXFxuICAgIGZvciAoaW50IGogPSAwOyBqIDwgMzsgaisrKSB7XFxuXFxuICAgICAgIHJbaV1bal0gPSBtW2pdW2ldO1xcblxcbiAgICB9XFxuXFxuICB9XFxuXFxuICByZXR1cm4gcjtcXG5cXG59XFxuXFxuXFxuXFxubWF0NCB0YW5zcG9zZShtYXQ0IG0pIHtcXG5cXG4gIG1hdDQgcjtcXG5cXG4gIGZvciAoaW50IGkgPSAwOyBpIDwgNDsgaSsrKSB7XFxuXFxuICAgIGZvciAoaW50IGogPSAwOyBqIDwgNDsgaisrKSB7XFxuXFxuICAgICAgIHJbaV1bal0gPSBtW2pdW2ldO1xcblxcbiAgICB9XFxuXFxuICB9XFxuXFxuICByZXR1cm4gcjtcXG5cXG59XFxuXFxuXCI7XG4iLCJcclxucGt6by52ZWMyID0gZnVuY3Rpb24gKHYwLCB2MSkge1xyXG4gIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICB0eXBlb2YgdjEgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYwXSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYxID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MV0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDIpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by52ZWMzID0gZnVuY3Rpb24gKHYwLCB2MSwgdjIpIHtcclxuICBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgdHlwZW9mIHYxID09PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgdjIgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYwLCB2MF0pO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MSA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYyID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MSwgdjJdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgzKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8udmVjNCA9IGZ1bmN0aW9uICh2MCwgdjEsIHYyLCB2NCkge1xyXG4gIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICB0eXBlb2YgdjEgPT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiB2MiA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIHYzID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MCwgdjAsIHYwXSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYxID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjIgPT09ICdudW1iZXInICYmXHJcbiAgICAgICAgICAgdHlwZW9mIHYzID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MSwgdjIsIHY0XSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLm5lZyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KHYubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHYubGVuZ3RoOyBpKyspIHtcclxuICAgIHJbaV0gPSAtdltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbi8vIGFkZCBhbmQgc3ViIGFsc28gd29yayBmb3IgbWF0cml4XHJcbnBrem8uYWRkID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gKyBiW2ldO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5zdWIgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSAtIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHYgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgdiArPSBhW2ldICogYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbnBrem8uY3Jvc3MgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIC8vIGFzc3VtZSBhLmxlbmd0aCA9PSBiLmxlbmd0aCA9PSAzXHJcbiAgXHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gIFxyXG4gIHJbMF0gPSAoYVsxXSAqIGJbMl0pIC0gKGFbMl0gKiBiWzFdKTtcclxuICByWzFdID0gKGFbMl0gKiBiWzBdKSAtIChhWzBdICogYlsyXSk7XHJcbiAgclsyXSA9IChhWzBdICogYlsxXSkgLSAoYVsxXSAqIGJbMF0pO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnN2bXVsdCA9IGZ1bmN0aW9uICh2LCBzKSB7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KHYubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHYubGVuZ3RoOyBpKyspIHtcclxuICAgIHJbaV0gPSB2W2ldICogcztcclxuICB9XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8ubGVuZ3RoID0gZnVuY3Rpb24gKHYpIHsgIFxyXG4gIHJldHVybiBNYXRoLnNxcnQocGt6by5kb3QodiwgdikpO1xyXG59XHJcblxyXG5wa3pvLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgcmV0dXJuIHBrem8uc3ZtdWx0KHYsIDEgLyBwa3pvLmxlbmd0aCh2KSk7XHJcbn1cclxuXHJcbnBrem8ubXVsdE1hdHJpeFZlY3RvciA9IGZ1bmN0aW9uIChtLCB2KSB7XHJcblx0dmFyIG4gPSB2Lmxlbmd0aDtcclxuXHR2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkobik7XHJcblx0XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspXHJcblx0e1xyXG5cdFx0cltpXSA9IDA7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKylcclxuXHRcdHtcclxuXHRcdFx0XHRyW2ldICs9IG1baSpuK2pdICogdltqXTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8ubWlkcG9pbnQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciBwID0gcGt6by5zdWIoYiwgYSk7XHJcbiAgbSA9IHBrem8uYWRkKGEsIHBrem8uc3ZtdWx0KHAsIDAuNSkpO1xyXG4gIHJldHVybiBtO1xyXG59XHJcbiIsIlxyXG5wa3pvLm1hdDMgPSBmdW5jdGlvbiAodikge1xyXG4gIGlmICh2ICYmIHYubGVuZ3RoICYmIHYubGVuZ3RoID09IDE2KSB7XHJcblx0XHRcdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2WzBdLCB2WzFdLCB2WzJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdls0XSwgdls1XSwgdls2XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbOF0sIHZbOV0sIHZbMTBdXSk7XHJcblx0fVxyXG5cdGlmICh2ICYmIHYubGVuZ3RoKSB7XHJcbiAgICBpZiAodi5sZW5ndGggIT0gOSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDMgbXVzdCBiZSA5IHZhbHVlcycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2LCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIHYsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgdl0pO1xyXG4gIH1cclxuICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMV0pO1xyXG59XHJcblxyXG5wa3pvLm1hdDQgPSBmdW5jdGlvbiAodikge1xyXG4gIGlmICh2ICYmIHYubGVuZ3RoKSB7ICAgIFxyXG4gICAgaWYgKHYubGVuZ3RoICE9IDE2KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWF0NCBtdXN0IGJlIDE2IHZhbHVlcycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2LCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIHYsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgdiwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCB2XSk7XHJcbiAgfVxyXG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCAxXSk7XHJcbn1cclxuXHJcbnBrem8ubXVsdE1hdHJpeCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgLy8gYXNzdW1lIGEubGVuZ3RoID09IGIubGVuZ3RoXHJcbiAgdmFyIG4gPSBNYXRoLnNxcnQoYS5sZW5ndGgpO1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbjsgaisrKSB7XHJcbiAgICAgIHZhciB2ID0gMDtcclxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBuOyBrKyspIHtcclxuICAgICAgICB2ID0gdiArIGFbaSpuK2tdICogYltrKm4ral07XHJcbiAgICAgIH1cclxuICAgICAgcltpKm4ral0gPSB2O1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5yYWRpYW5zID0gZnVuY3Rpb24oZGVncmVlcykge1xyXG4gIHJldHVybiBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcclxufTtcclxuXHJcbnBrem8uZGVncmVlcyA9IGZ1bmN0aW9uKHJhZGlhbnMpIHtcclxuICByZXR1cm4gcmFkaWFucyAqIDE4MCAvIE1hdGguUEk7XHJcbn07IFxyXG5cclxuXHJcbnBrem8ub3J0aG8gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcclxuICB2YXIgcmwgPSAocmlnaHQgLSBsZWZ0KTtcclxuICB2YXIgdGIgPSAodG9wIC0gYm90dG9tKTtcclxuICB2YXIgZm4gPSAoZmFyIC0gbmVhcik7XHJcbiAgXHJcbiAgdmFyIG0gPSBwa3pvLm1hdDQoKTsgIFxyXG4gIFxyXG4gIG1bMF0gPSAyIC8gcmw7XHJcbiAgbVsxXSA9IDA7XHJcbiAgbVsyXSA9IDA7XHJcbiAgbVszXSA9IDA7XHJcbiAgbVs0XSA9IDA7XHJcbiAgbVs1XSA9IDIgLyB0YjtcclxuICBtWzZdID0gMDtcclxuICBtWzddID0gMDtcclxuICBtWzhdID0gMDtcclxuICBtWzldID0gMDtcclxuICBtWzEwXSA9IC0yIC8gZm47XHJcbiAgbVsxMV0gPSAwO1xyXG4gIG1bMTJdID0gLShsZWZ0ICsgcmlnaHQpIC8gcmw7XHJcbiAgbVsxM10gPSAtKHRvcCArIGJvdHRvbSkgLyB0YjtcclxuICBtWzE0XSA9IC0oZmFyICsgbmVhcikgLyBmbjtcclxuICBtWzE1XSA9IDE7XHJcblxyXG4gIHJldHVybiBtO1xyXG59XHJcblxyXG5wa3pvLmZydXN0dW0gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCB6bmVhciwgemZhcikge1xyXG4gIHZhciB0MSA9IDIgKiB6bmVhcjtcclxuICB2YXIgdDIgPSByaWdodCAtIGxlZnQ7XHJcbiAgdmFyIHQzID0gdG9wIC0gYm90dG9tO1xyXG4gIHZhciB0NCA9IHpmYXIgLSB6bmVhcjtcclxuXHJcbiAgdmFyIG0gPSBuZXcgRmxvYXQzMkFycmF5KDE2KTtcclxuICBcclxuICBtWzBdID0gdDEvdDI7IG1bNF0gPSAgICAgMDsgbVsgOF0gPSAgKHJpZ2h0ICsgbGVmdCkgLyB0MjsgbVsxMl0gPSAgICAgICAgICAgICAgICAgMDtcclxuICBtWzFdID0gICAgIDA7IG1bNV0gPSB0MS90MzsgbVsgOV0gPSAgKHRvcCArIGJvdHRvbSkgLyB0MzsgbVsxM10gPSAgICAgICAgICAgICAgICAgMDtcclxuICBtWzJdID0gICAgIDA7IG1bNl0gPSAgICAgMDsgbVsxMF0gPSAoLXpmYXIgLSB6bmVhcikgLyB0NDsgbVsxNF0gPSAoLXQxICogemZhcikgLyB0NDtcclxuICBtWzNdID0gICAgIDA7IG1bN10gPSAgICAgMDsgbVsxMV0gPSAgICAgICAgICAgICAgICAgICAtMTsgbVsxNV0gPSAgICAgICAgICAgICAgICAgMDtcclxuICBcclxuICByZXR1cm4gbTtcclxufVxyXG5cclxucGt6by5wZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uIChmb3Z5LCBhc3BlY3QsIHpuZWFyLCB6ZmFyKSB7XHJcbiAgdmFyIHltYXggPSB6bmVhciAqIE1hdGgudGFuKHBrem8ucmFkaWFucyhmb3Z5KSk7XHJcbiAgdmFyIHhtYXggPSB5bWF4ICogYXNwZWN0O1xyXG4gIHJldHVybiBwa3pvLmZydXN0dW0oLXhtYXgsIHhtYXgsIC15bWF4LCB5bWF4LCB6bmVhciwgemZhcik7XHJcbn1cclxuXHJcbi8vIE5PVEU6IHRoaXMgaXMgaW5lZmZpY2llbnQsIGl0IG1heSBiZSBzZW5zaWJsZSB0byBwcm92aWRlIGlucGxhY2UgdmVyc2lvbnNcclxucGt6by50cmFuc2xhdGUgPSBmdW5jdGlvbihtLCB4LCB5LCB6KSB7ICAgIFxyXG4gIHZhciByID0gcGt6by5tYXQ0KG0pO1xyXG4gIHJbMTJdID0gbVswXSAqIHggKyBtWzRdICogeSArIG1bIDhdICogeiArIG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxXSAqIHggKyBtWzVdICogeSArIG1bIDldICogeiArIG1bMTNdO1xyXG4gIHJbMTRdID0gbVsyXSAqIHggKyBtWzZdICogeSArIG1bMTBdICogeiArIG1bMTRdO1xyXG4gIHJbMTVdID0gbVszXSAqIHggKyBtWzddICogeSArIG1bMTFdICogeiArIG1bMTVdO1xyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnJvdGF0ZSA9IGZ1bmN0aW9uIChtLCBhbmdsZSwgeCwgeSwgeikgeyAgXHJcbiAgdmFyIGEgPSBwa3pvLnJhZGlhbnMoYW5nbGUpO1xyXG4gIHZhciBjID0gTWF0aC5jb3MoYSk7XHJcbiAgdmFyIHMgPSBNYXRoLnNpbihhKTtcclxuICBcclxuICB2YXIgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gIHZhciBueCA9IHggLyBsO1xyXG4gIHZhciBueSA9IHkgLyBsO1xyXG4gIHZhciBueiA9IHogLyBsO1xyXG5cclxuICB2YXIgdDAgPSBueCAqICgxIC0gYyk7XHJcbiAgdmFyIHQxID0gbnkgKiAoMSAtIGMpO1xyXG4gIHZhciB0MiA9IG56ICogKDEgLSBjKTsgIFxyXG5cclxuICB2YXIgZCA9IHBrem8ubWF0NCgxKTtcclxuICBcclxuICBkWyAwXSA9IGMgKyB0MCAqIG54O1xyXG4gIGRbIDFdID0gMCArIHQwICogbnkgKyBzICogbno7XHJcbiAgZFsgMl0gPSAwICsgdDAgKiBueiAtIHMgKiBueTtcclxuXHJcbiAgZFsgNF0gPSAwICsgdDEgKiBueCAtIHMgKiBuejtcclxuICBkWyA1XSA9IGMgKyB0MSAqIG55O1xyXG4gIGRbIDZdID0gMCArIHQxICogbnogKyBzICogbng7XHJcblxyXG4gIGRbIDhdID0gMCArIHQyICogbnggKyBzICogbnk7XHJcbiAgZFsgOV0gPSAwICsgdDIgKiBueSAtIHMgKiBueDtcclxuICBkWzEwXSA9IGMgKyB0MiAqIG56OyAgXHJcbiAgXHJcbiAgdmFyIHIgPSBwa3pvLm11bHRNYXRyaXgobSwgZCk7XHJcbiAgXHJcbiAgclsxMl0gPSBtWzEyXTtcclxuICByWzEzXSA9IG1bMTNdO1xyXG4gIHJbMTRdID0gbVsxNF07XHJcbiAgclsxNV0gPSBtWzE1XTtcclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5zY2FsZSA9IGZ1bmN0aW9uKG0sIHgsIHksIHopIHsgICAgXHJcbiAgdmFyIHIgPSBwa3pvLm1hdDQoMSk7XHJcbiAgXHJcbiAgclsgMF0gPSBtWyAwXSAqIHg7IFxyXG4gIHJbIDFdID0gbVsgMV0gKiB4OyBcclxuICByWyAyXSA9IG1bIDJdICogeDsgXHJcbiAgclsgM10gPSBtWyAzXSAqIHg7IFxyXG4gIFxyXG4gIHJbIDRdID0gbVsgNF0gKiB5OyBcclxuICByWyA1XSA9IG1bIDVdICogeTsgXHJcbiAgclsgNl0gPSBtWyA2XSAqIHk7IFxyXG4gIHJbIDddID0gbVsgN10gKiB5OyBcclxuICBcclxuICByWyA4XSA9IG1bIDhdICogejtcclxuICByWyA5XSA9IG1bIDldICogejtcclxuICByWzEwXSA9IG1bMTBdICogejtcclxuICByWzExXSA9IG1bMTFdICogejtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKG0pIHsgICAgXHJcbiAgdmFyIG4gPSBNYXRoLnNxcnQobS5sZW5ndGgpO1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShtLmxlbmd0aCk7XHJcbiAgXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbjsgaisrKSB7XHJcbiAgICAgIHJbaipuK2ldID0gbVtpKm4ral07XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcbiIsIlxyXG5wa3pvLkNhbnZhcyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGVsZW1lbnQ7XHJcbiAgfSAgXHJcbiAgXHJcbiAgdGhpcy5jYW52YXMud2lkdGggID0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGg7XHJcbiAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0OyAgXHJcbiAgXHJcbiAgdGhpcy5nbCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiLCB7YW50aWFsaWFzOiB0cnVlLCBkZXB0aDogdHJ1ZX0pO1xyXG4gIHRoaXMuZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApO1xyXG4gIFxyXG4gIC8vIHRoZXNlIHZhbHVlcyBhcmUgZm9yIHRoZSBwcm9ncmFtbWVyIG9mIHRoZSBkcmF3IGZ1bmN0aW9uLCBcclxuICAvLyB3ZSBwYXNzIHRoZSBnbCBvYmplY3QsIG5vdCB0aGUgY2FudmFzLlxyXG4gIHRoaXMuZ2wud2lkdGggID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgdGhpcy5nbC5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbn1cclxuXHJcbnBrem8uQ2FudmFzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKGNiKSB7XHJcbiAgaWYgKGNiKSB7XHJcbiAgICBjYi5jYWxsKHRoaXMsIHRoaXMuZ2wpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5DYW52YXMucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY2IpIHsgIFxyXG4gIGlmICh0aGlzLmNhbnZhcy53aWR0aCAhPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aCB8fCB0aGlzLmNhbnZhcy5oZWlnaHQgIT0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0KSB7XHJcbiAgICB0aGlzLmNhbnZhcy53aWR0aCAgPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDsgIFxyXG4gICAgdGhpcy5nbC53aWR0aCAgPSB0aGlzLmNhbnZhcy53aWR0aDtcclxuICAgIHRoaXMuZ2wuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gIH1cclxuICBcclxuICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuICBcclxuICBpZiAoY2IpIHtcclxuICAgIGNiLmNhbGwodGhpcywgdGhpcy5nbCk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwiXHJcbnBrem8uVGV4dHVyZSA9IGZ1bmN0aW9uICh1cmwpIHtcclxuICB0aGlzLnVybCAgICA9IHVybDtcclxuICB0aGlzLmltYWdlICA9IG51bGw7XHJcbiAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICBcclxuICAvLyB3ZSBkb24ndCB1cGxvYWQgdGhlIGltYWdlIHRvIFZSQU0sIGJ1dCB0cnkgdG8gbG9hZCBpdFxyXG4gIHRoaXMubG9hZCgpO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUubG9hZCA9IGZ1bmN0aW9uICh1cmwpIHtcclxuICAvLyBUT0RPIG1ha2UgdGhlIGFwbHkgY2xlYW5lclxyXG4gIHJldHVybiBuZXcgcGt6by5UZXh0dXJlKHVybCk7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICgpIHtcdFxyXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICB2YXIgdGV4dHVyZSA9IHRoaXM7XHJcbiAgdGhpcy5pbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0ZXh0dXJlLmxvYWRlZCA9IHRydWU7ICAgIFxyXG4gIH07XHJcbiAgdGhpcy5pbWFnZS5zcmMgPSB0aGlzLnVybDtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTtcclxuICBcclxuICBpZiAodGhpcy5sb2FkZWQpIHtcclxuICAgIHRoaXMuc3luYygpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfMkQsIDAsIHRoaXMuZ2wuUkdCQSwgMSwgMSwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIG51bGwpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTsgIFxyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfMkQsIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW1hZ2UpOyAgXHJcbiAgdGhpcy5nbC5nZW5lcmF0ZU1pcG1hcCh0aGlzLmdsLlRFWFRVUkVfMkQpO1xyXG4gIFxyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLmdsLkxJTkVBUik7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMuZ2wuTElORUFSX01JUE1BUF9MSU5FQVIpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMuZ2wuUkVQRUFUKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLmdsLlJFUEVBVCk7XHJcbiAgXHJcbiAgLy8gY2FuIHdlIGRpc2NhcmQgaW1hZ2Ugbm93P1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVUZXh0dXJlKHRoaXMuaWQpO1xyXG4gIHRoaXMuaWQgPSBudWxsO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZ2wsIGNoYW5uZWwpIHtcclxuXHR0aGlzLmdsID0gZ2w7XHJcbiAgaWYgKCEgdGhpcy5pZCkge1xyXG4gICAgdGhpcy51cGxvYWQoKTtcclxuICB9XHJcblx0Ly8gVE9ETyBjaGFubmVsXHJcbiAgdGhpcy5nbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgY2hhbm5lbCk7XHJcbiAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuaWQpO1xyXG59XHJcbiIsIlxyXG5wa3pvLkN1YmVNYXAgPSBmdW5jdGlvbiAoKSB7ICBcclxuICB0aGlzLmxvYWRlZCA9IGZhbHNlOyAgXHJcbn1cclxuXHJcbnBrem8uQ3ViZU1hcC5sb2FkID0gZnVuY3Rpb24gKHRleHR1cmVzKSB7XHJcbiAgdmFyIGNtID0gbmV3IHBrem8uQ3ViZU1hcCgpO1xyXG4gIGNtLmxvYWQodGV4dHVyZXMpO1xyXG4gIHJldHVybiBjbTtcclxufVxyXG5cclxucGt6by5DdWJlTWFwLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKHRleHR1cmVzKSB7XHJcbiAgdmFyIGN1YmVtYXAgPSB0aGlzO1xyXG4gIHRoaXMubG9hZENvdW50ID0gMDtcclxuICBcclxuICB2YXIgb25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY3ViZW1hcC5sb2FkQ291bnQrKztcclxuICAgIGlmIChjdWJlbWFwLmxvYWRDb3VudCA9PSA2KSB7XHJcbiAgICAgIGN1YmVtYXAubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgaWYgKGN1YmVtYXAuaWQpIHtcclxuICAgICAgICBjdWJlbWFwLnN5bmMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbiAgXHJcbiAgdGhpcy54cG9zSW1hZ2UgPSBuZXcgSW1hZ2UoKTsgIFxyXG4gIHRoaXMueHBvc0ltYWdlLm9ubG9hZCA9IG9ubG9hZDtcclxuICB0aGlzLnhwb3NJbWFnZS5zcmMgICAgPSB0ZXh0dXJlcy54cG9zO1xyXG4gIFxyXG4gIHRoaXMueG5lZ0ltYWdlID0gbmV3IEltYWdlKCk7ICBcclxuICB0aGlzLnhuZWdJbWFnZS5vbmxvYWQgPSBvbmxvYWQ7XHJcbiAgdGhpcy54bmVnSW1hZ2Uuc3JjICAgID0gdGV4dHVyZXMueG5lZztcclxuICBcclxuICB0aGlzLnlwb3NJbWFnZSA9IG5ldyBJbWFnZSgpOyAgXHJcbiAgdGhpcy55cG9zSW1hZ2Uub25sb2FkID0gb25sb2FkO1xyXG4gIHRoaXMueXBvc0ltYWdlLnNyYyAgICA9IHRleHR1cmVzLnlwb3M7XHJcbiAgXHJcbiAgdGhpcy55bmVnSW1hZ2UgPSBuZXcgSW1hZ2UoKTsgIFxyXG4gIHRoaXMueW5lZ0ltYWdlLm9ubG9hZCA9IG9ubG9hZDtcclxuICB0aGlzLnluZWdJbWFnZS5zcmMgICAgPSB0ZXh0dXJlcy55bmVnO1xyXG4gIFxyXG4gIHRoaXMuenBvc0ltYWdlID0gbmV3IEltYWdlKCk7ICBcclxuICB0aGlzLnpwb3NJbWFnZS5vbmxvYWQgPSBvbmxvYWQ7XHJcbiAgdGhpcy56cG9zSW1hZ2Uuc3JjICAgID0gdGV4dHVyZXMuenBvcztcclxuICBcclxuICB0aGlzLnpuZWdJbWFnZSA9IG5ldyBJbWFnZSgpOyAgXHJcbiAgdGhpcy56bmVnSW1hZ2Uub25sb2FkID0gb25sb2FkO1xyXG4gIHRoaXMuem5lZ0ltYWdlLnNyYyAgICA9IHRleHR1cmVzLnpuZWc7XHJcbn1cclxuXHJcbnBrem8uQ3ViZU1hcC5wcm90b3R5cGUudXBsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuaWQgPSB0aGlzLmdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy5pZCk7XHJcbiAgXHJcbiAgaWYgKHRoaXMubG9hZGVkKSB7XHJcbiAgICB0aGlzLnN5bmMoKTtcclxuICB9ICBcclxufVxyXG5cclxucGt6by5DdWJlTWFwLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLmlkKTsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy54cG9zSW1hZ2UpO1xyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWCwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy54bmVnSW1hZ2UpO1xyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWSwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy55cG9zSW1hZ2UpO1xyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWSwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy55bmVnSW1hZ2UpO1xyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWiwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy56cG9zSW1hZ2UpO1xyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWiwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy56bmVnSW1hZ2UpO1xyXG4gIFxyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMuZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLmdsLkxJTkVBUik7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy5nbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMuZ2wuTElORUFSKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLmdsLkNMQU1QX1RPX0VER0UpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMuZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbn1cclxuXHJcbnBrem8uQ3ViZU1hcC5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmdsLmRlbGV0ZVRleHR1cmUodGhpcy5pZCk7XHJcbiAgdGhpcy5pZCA9IG51bGw7XHJcbn1cclxuXHJcbnBrem8uQ3ViZU1hcC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChnbCwgY2hhbm5lbCkge1xyXG4gIHRoaXMuZ2wgPSBnbDtcclxuICBpZiAoISB0aGlzLmlkKSB7XHJcbiAgICB0aGlzLnVwbG9hZCgpO1xyXG4gIH1cclxuICAvLyBUT0RPIGNoYW5uZWxcclxuICB0aGlzLmdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBjaGFubmVsKTtcclxuICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy5pZCk7XHJcbn1cclxuXHJcbiIsIlxyXG5wa3pvLlNoYWRlciA9IGZ1bmN0aW9uIChnbCwgdmVydGV4Q29kZSwgZnJhZ21lbnRDb2RlKSB7XHJcbiAgdGhpcy5nbCAgICAgICAgICAgPSBnbDtcclxuICB0aGlzLnZlcnRleENvZGUgICA9IHZlcnRleENvZGU7XHJcbiAgdGhpcy5mcmFnbWVudENvZGUgPSBmcmFnbWVudENvZGU7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB2ZXJ0ZXhTaGFkZXIgICA9IHRoaXMuY29tcGlsZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIsICAgdGhpcy52ZXJ0ZXhDb2RlKTtcclxuICB2YXIgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmNvbXBpbGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIsIHRoaXMuZnJhZ21lbnRDb2RlKTtcclxuICBcclxuICB2YXIgcHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gIFxyXG4gIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XHJcbiAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gIFxyXG4gIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgXHJcbiAgdmFyIGluZm9Mb2cgPSB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pO1xyXG4gIGlmICh0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykgPT09IGZhbHNlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoaW5mb0xvZyk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGluZm9Mb2cgIT09ICcnKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbmZvTG9nKTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5nbC5kZWxldGVTaGFkZXIodmVydGV4U2hhZGVyKTtcclxuICB0aGlzLmdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XHJcbiAgXHJcbiAgdGhpcy5pZCA9IHByb2dyYW07XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5jb21waWxlU2hhZGVyID0gZnVuY3Rpb24gKHR5cGUsIGNvZGUpIHtcclxuICB2YXIgaWQgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0eXBlKTsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wuc2hhZGVyU291cmNlKGlkLCBjb2RlKTtcclxuICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoaWQpO1xyXG4gIFxyXG4gIHZhciBpbmZvTG9nID0gdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGlkKTtcclxuICBpZiAodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoaWQsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpID09PSBmYWxzZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGluZm9Mb2cpO1xyXG4gIH1cclxuICBlbHNlIGlmIChpbmZvTG9nICE9PSAnJykge1xyXG4gICAgY29uc29sZS5sb2coaW5mb0xvZyk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBpZDtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVQcm9ncmFtKGlkKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCF0aGlzLmlkKSB7XHJcbiAgICB0aGlzLmNvbXBpbGUoKTtcclxuICB9XHJcbiAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuaWQpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0QXJydGlidXRlID0gZnVuY3Rpb24gKG5hbWUsIGJ1ZmZlciwgZWxlbWVudFNpemUpIHsgIFxyXG4gIGJ1ZmZlci5iaW5kKCk7ICBcclxuICBcclxuICBpZiAoZWxlbWVudFNpemUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdmFyIGVsZW1lbnRTaXplID0gYnVmZmVyLmVsZW1lbnRTaXplO1xyXG4gIH1cclxuICBcclxuICB2YXIgcG9zID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvcyk7XHJcbiAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvcywgZWxlbWVudFNpemUsIGJ1ZmZlci5lbGVtZW50VHlwZSwgdGhpcy5nbC5GQUxTRSwgMCwgMCk7ICBcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0xaSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0xaShsb2MsIHZhbHVlKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0xZiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0xZihsb2MsIHZhbHVlKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0yZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtMmYobG9jLCB2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTNmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0zZihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0pO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTRmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm00Zihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0sIHZhbHVlWzRdKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm1NYXRyaXgzZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIHRyYW5zcG9zZSkge1xyXG4gIGlmICh0cmFuc3Bvc2UgPT09IHVuZGVmaW5lZCB8fHRyYW5zcG9zZSA9PT0gbnVsbCkge1xyXG4gICAgdmFyIHRyYW5zcG9zZSA9IGZhbHNlO1xyXG4gIH1cclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KGxvYywgdHJhbnNwb3NlLCB2YWx1ZSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtTWF0cml4NGZ2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCB0cmFuc3Bvc2UpIHtcclxuICBpZiAodHJhbnNwb3NlID09PSB1bmRlZmluZWQgfHx0cmFuc3Bvc2UgPT09IG51bGwpIHtcclxuICAgIHZhciB0cmFuc3Bvc2UgPSBmYWxzZTtcclxuICB9XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdihsb2MsIHRyYW5zcG9zZSwgdmFsdWUpO1xyXG59XHJcblxyXG5cclxuIiwiXHJcbnBrem8uU2NlbmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0dGhpcy5hbWJpZW50TGlnaHQgPSBwa3pvLnZlYzMoMC4yLCAwLjIsIDAuMik7XHRcclxufVxyXG5cclxucGt6by5TY2VuZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdGlmICh0aGlzLmVudGl0aWVzKSB7XHJcblx0XHR0aGlzLmVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24gKGVudGl0eSkge1xyXG5cdFx0XHRlbnRpdHkuZW5xdWV1ZShyZW5kZXJlcik7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbnBrem8uU2NlbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcclxuICBpZiAoISB0aGlzLmVudGl0aWVzKSB7XHJcbiAgICB0aGlzLmVudGl0aWVzID0gW2VudGl0eV1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcclxuICB9XHJcbn0iLCJcclxucGt6by5CdWZmZXIgPSBmdW5jdGlvbiAoZ2wsIGRhdGEsIGJ0eXBlLCBldHlwZSkge1xyXG4gIHRoaXMuZ2wgPSBnbDtcclxuICBcclxuICBpZiAoYnR5cGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdGhpcy50eXBlID0gZ2wuQVJSQVlfQlVGRkVSO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudHlwZSA9IGJ0eXBlO1xyXG4gIH1cclxuICBcclxuICBpZiAoZXR5cGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHRoaXMudHlwZSA9PSBnbC5BUlJBWV9CVUZGRVIpIHtcclxuICAgICAgdGhpcy5lbGVtZW50VHlwZSA9IGdsLkZMT0FUO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudFR5cGUgPSBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmVsZW1lbnRUeXBlID0gZXR5cGU7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMubG9hZChkYXRhKTtcclxufVxyXG5cclxucGt6by53cmFwQXJyYXkgPSBmdW5jdGlvbiAoZ2wsIHR5cGUsIGRhdGEpIHtcclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgZ2wuRkxPQVQ6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5ET1VCTEU6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQ2NEFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5VTlNJR05FRF9CWVRFOlxyXG4gICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX1NIT1JUOlxyXG4gICAgICByZXR1cm4gbmV3IFVpbnQxNkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5VTlNJR05FRF9JTlQ6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDMyQXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLkJZVEU6XHJcbiAgICAgIHJldHVybiBuZXcgSW50OEFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5TSE9SVDpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQxNkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5JTlQ6XHJcbiAgICAgIHJldHVybiBuZXcgSW50MzJBcnJheShkYXRhKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGRhdGEpIHsgIFxyXG4gIGlmIChkYXRhWzBdLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRTaXplID0gMTtcclxuICAgIHRoaXMuZGF0YSA9IHBrem8ud3JhcEFycmF5KHRoaXMuZ2wsIHRoaXMuZWxlbWVudFR5cGUsIGRhdGEpO1xyXG4gIH1cclxuICBlbHNlIHsgICAgXHJcbiAgICB0aGlzLmVsZW1lbnRTaXplID0gZGF0YVswXS5sZW5ndGg7XHJcbiAgICB0aGlzLmRhdGEgPSBwa3pvLndyYXBBcnJheSh0aGlzLmdsLCB0aGlzLmVsZW1lbnRUeXBlLCBkYXRhLmxlbmd0aCAqIHRoaXMuZWxlbVNpemUpO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGJ1ZmZlciA9IHRoaXM7XHJcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgZWxlbS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgYnVmZmVyLmRhdGFbaV0gPSB2O1xyXG4gICAgICAgIGkrKztcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMudHlwZSwgdGhpcy5pZCk7XHJcbiAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMudHlwZSwgdGhpcy5kYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHRoaXMuaWQpIHtcclxuICAgIHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMuaWQpO1xyXG4gICAgdGhpcy5pZCA9IG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKHByaW1pdGl2ZSkge1xyXG4gIGlmICghIHRoaXMuaWQpIHtcclxuICAgIHRoaXMudXBsb2FkKCk7XHJcbiAgfVxyXG4gIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLnR5cGUsIHRoaXMuaWQpO1xyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKHByaW1pdGl2ZSkge1xyXG4gIHRoaXMuYmluZCgpO1xyXG4gIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgdGhpcy5kYXRhLmxlbmd0aCwgdGhpcy5lbGVtZW50VHlwZSwgMCk7XHJcbn1cclxuXHJcblxyXG4iLCJwa3pvLlBseVBhcnNlciA9IChmdW5jdGlvbigpIHtcbiAgLypcbiAgICogR2VuZXJhdGVkIGJ5IFBFRy5qcyAwLjguMC5cbiAgICpcbiAgICogaHR0cDovL3BlZ2pzLm1hamRhLmN6L1xuICAgKi9cblxuICBmdW5jdGlvbiBwZWckc3ViY2xhc3MoY2hpbGQsIHBhcmVudCkge1xuICAgIGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfVxuICAgIGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcbiAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpO1xuICB9XG5cbiAgZnVuY3Rpb24gU3ludGF4RXJyb3IobWVzc2FnZSwgZXhwZWN0ZWQsIGZvdW5kLCBvZmZzZXQsIGxpbmUsIGNvbHVtbikge1xuICAgIHRoaXMubWVzc2FnZSAgPSBtZXNzYWdlO1xuICAgIHRoaXMuZXhwZWN0ZWQgPSBleHBlY3RlZDtcbiAgICB0aGlzLmZvdW5kICAgID0gZm91bmQ7XG4gICAgdGhpcy5vZmZzZXQgICA9IG9mZnNldDtcbiAgICB0aGlzLmxpbmUgICAgID0gbGluZTtcbiAgICB0aGlzLmNvbHVtbiAgID0gY29sdW1uO1xuXG4gICAgdGhpcy5uYW1lICAgICA9IFwiU3ludGF4RXJyb3JcIjtcbiAgfVxuXG4gIHBlZyRzdWJjbGFzcyhTeW50YXhFcnJvciwgRXJyb3IpO1xuXG4gIGZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuXG4gICAgICAgIHBlZyRGQUlMRUQgPSB7fSxcblxuICAgICAgICBwZWckc3RhcnRSdWxlRnVuY3Rpb25zID0geyBwbHk6IHBlZyRwYXJzZXBseSB9LFxuICAgICAgICBwZWckc3RhcnRSdWxlRnVuY3Rpb24gID0gcGVnJHBhcnNlcGx5LFxuXG4gICAgICAgIHBlZyRjMCA9IHBlZyRGQUlMRUQsXG4gICAgICAgIHBlZyRjMSA9IFwicGx5XCIsXG4gICAgICAgIHBlZyRjMiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInBseVwiLCBkZXNjcmlwdGlvbjogXCJcXFwicGx5XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMyA9IFtdLFxuICAgICAgICBwZWckYzQgPSBcImVuZF9oZWFkZXJcIixcbiAgICAgICAgcGVnJGM1ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiZW5kX2hlYWRlclwiLCBkZXNjcmlwdGlvbjogXCJcXFwiZW5kX2hlYWRlclxcXCJcIiB9LFxuICAgICAgICBwZWckYzYgPSBcImZvcm1hdFwiLFxuICAgICAgICBwZWckYzcgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJmb3JtYXRcIiwgZGVzY3JpcHRpb246IFwiXFxcImZvcm1hdFxcXCJcIiB9LFxuICAgICAgICBwZWckYzggPSBcImFzY2lpXCIsXG4gICAgICAgIHBlZyRjOSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImFzY2lpXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJhc2NpaVxcXCJcIiB9LFxuICAgICAgICBwZWckYzEwID0gXCIxLjBcIixcbiAgICAgICAgcGVnJGMxMSA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIjEuMFwiLCBkZXNjcmlwdGlvbjogXCJcXFwiMS4wXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMTIgPSBcImNvbW1lbnRcIixcbiAgICAgICAgcGVnJGMxMyA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImNvbW1lbnRcIiwgZGVzY3JpcHRpb246IFwiXFxcImNvbW1lbnRcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMxNCA9IC9eW15cXG5cXHJdLyxcbiAgICAgICAgcGVnJGMxNSA9IHsgdHlwZTogXCJjbGFzc1wiLCB2YWx1ZTogXCJbXlxcXFxuXFxcXHJdXCIsIGRlc2NyaXB0aW9uOiBcIlteXFxcXG5cXFxccl1cIiB9LFxuICAgICAgICBwZWckYzE2ID0gZnVuY3Rpb24oYSwgYikge2EucHJvcGVydGllcyA9IGI7IGVsZW1lbnRzLnB1c2goYSk7fSxcbiAgICAgICAgcGVnJGMxNyA9IFwiZWxlbWVudFwiLFxuICAgICAgICBwZWckYzE4ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiZWxlbWVudFwiLCBkZXNjcmlwdGlvbjogXCJcXFwiZWxlbWVudFxcXCJcIiB9LFxuICAgICAgICBwZWckYzE5ID0gZnVuY3Rpb24oYSwgYikge3JldHVybiB7dHlwZTogYSwgY291bnQ6IGJ9O30sXG4gICAgICAgIHBlZyRjMjAgPSBcInZlcnRleFwiLFxuICAgICAgICBwZWckYzIxID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwidmVydGV4XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ2ZXJ0ZXhcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMyMiA9IFwiZmFjZVwiLFxuICAgICAgICBwZWckYzIzID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiZmFjZVwiLCBkZXNjcmlwdGlvbjogXCJcXFwiZmFjZVxcXCJcIiB9LFxuICAgICAgICBwZWckYzI0ID0gXCJwcm9wZXJ0eVwiLFxuICAgICAgICBwZWckYzI1ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwicHJvcGVydHlcIiwgZGVzY3JpcHRpb246IFwiXFxcInByb3BlcnR5XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMjYgPSBmdW5jdGlvbihhKSB7cmV0dXJuIGE7fSxcbiAgICAgICAgcGVnJGMyNyA9IFwiZmxvYXRcIixcbiAgICAgICAgcGVnJGMyOCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImZsb2F0XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJmbG9hdFxcXCJcIiB9LFxuICAgICAgICBwZWckYzI5ID0gXCJ1aW50XCIsXG4gICAgICAgIHBlZyRjMzAgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ1aW50XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ1aW50XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMzEgPSBcImludFwiLFxuICAgICAgICBwZWckYzMyID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiaW50XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJpbnRcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMzMyA9IFwidWNoYXJcIixcbiAgICAgICAgcGVnJGMzNCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInVjaGFyXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ1Y2hhclxcXCJcIiB9LFxuICAgICAgICBwZWckYzM1ID0gXCJjaGFyXCIsXG4gICAgICAgIHBlZyRjMzYgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJjaGFyXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJjaGFyXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjMzcgPSBcImxpc3RcIixcbiAgICAgICAgcGVnJGMzOCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcImxpc3RcIiwgZGVzY3JpcHRpb246IFwiXFxcImxpc3RcXFwiXCIgfSxcbiAgICAgICAgcGVnJGMzOSA9IFwieFwiLFxuICAgICAgICBwZWckYzQwID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwieFwiLCBkZXNjcmlwdGlvbjogXCJcXFwieFxcXCJcIiB9LFxuICAgICAgICBwZWckYzQxID0gXCJ5XCIsXG4gICAgICAgIHBlZyRjNDIgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ5XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ5XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNDMgPSBcInpcIixcbiAgICAgICAgcGVnJGM0NCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcInpcIiwgZGVzY3JpcHRpb246IFwiXFxcInpcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM0NSA9IFwibnhcIixcbiAgICAgICAgcGVnJGM0NiA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIm54XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJueFxcXCJcIiB9LFxuICAgICAgICBwZWckYzQ3ID0gXCJueVwiLFxuICAgICAgICBwZWckYzQ4ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwibnlcIiwgZGVzY3JpcHRpb246IFwiXFxcIm55XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNDkgPSBcIm56XCIsXG4gICAgICAgIHBlZyRjNTAgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJuelwiLCBkZXNjcmlwdGlvbjogXCJcXFwibnpcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM1MSA9IFwic1wiLFxuICAgICAgICBwZWckYzUyID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwic1wiLCBkZXNjcmlwdGlvbjogXCJcXFwic1xcXCJcIiB9LFxuICAgICAgICBwZWckYzUzID0gXCJ0XCIsXG4gICAgICAgIHBlZyRjNTQgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ0XCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJ0XFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNTUgPSBcInZlcnRleF9pbmRpY2VzXCIsXG4gICAgICAgIHBlZyRjNTYgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCJ2ZXJ0ZXhfaW5kaWNlc1wiLCBkZXNjcmlwdGlvbjogXCJcXFwidmVydGV4X2luZGljZXNcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM1NyA9IGZ1bmN0aW9uKGEpIHtkZWNvZGVMaW5lKGEpO30sXG4gICAgICAgIHBlZyRjNTggPSBudWxsLFxuICAgICAgICBwZWckYzU5ID0gXCItXCIsXG4gICAgICAgIHBlZyRjNjAgPSB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZTogXCItXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCItXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNjEgPSAvXlswLTldLyxcbiAgICAgICAgcGVnJGM2MiA9IHsgdHlwZTogXCJjbGFzc1wiLCB2YWx1ZTogXCJbMC05XVwiLCBkZXNjcmlwdGlvbjogXCJbMC05XVwiIH0sXG4gICAgICAgIHBlZyRjNjMgPSBcIi5cIixcbiAgICAgICAgcGVnJGM2NCA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIi5cIiwgZGVzY3JpcHRpb246IFwiXFxcIi5cXFwiXCIgfSxcbiAgICAgICAgcGVnJGM2NSA9IGZ1bmN0aW9uKGEpIHtyZXR1cm4gcGFyc2VGbG9hdChzdHJKb2luKGEpKTt9LFxuICAgICAgICBwZWckYzY2ID0gL15bIFxcdFxceDBCXS8sXG4gICAgICAgIHBlZyRjNjcgPSB7IHR5cGU6IFwiY2xhc3NcIiwgdmFsdWU6IFwiWyBcXFxcdFxcXFx4MEJdXCIsIGRlc2NyaXB0aW9uOiBcIlsgXFxcXHRcXFxceDBCXVwiIH0sXG4gICAgICAgIHBlZyRjNjggPSBcIlxcclxcblwiLFxuICAgICAgICBwZWckYzY5ID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiXFxyXFxuXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJcXFxcclxcXFxuXFxcIlwiIH0sXG4gICAgICAgIHBlZyRjNzAgPSBcIlxcblwiLFxuICAgICAgICBwZWckYzcxID0geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWU6IFwiXFxuXCIsIGRlc2NyaXB0aW9uOiBcIlxcXCJcXFxcblxcXCJcIiB9LFxuICAgICAgICBwZWckYzcyID0gXCJcXHJcIixcbiAgICAgICAgcGVnJGM3MyA9IHsgdHlwZTogXCJsaXRlcmFsXCIsIHZhbHVlOiBcIlxcclwiLCBkZXNjcmlwdGlvbjogXCJcXFwiXFxcXHJcXFwiXCIgfSxcbiAgICAgICAgcGVnJGM3NCA9IGZ1bmN0aW9uKCkge2xpbmVzKyt9LFxuXG4gICAgICAgIHBlZyRjdXJyUG9zICAgICAgICAgID0gMCxcbiAgICAgICAgcGVnJHJlcG9ydGVkUG9zICAgICAgPSAwLFxuICAgICAgICBwZWckY2FjaGVkUG9zICAgICAgICA9IDAsXG4gICAgICAgIHBlZyRjYWNoZWRQb3NEZXRhaWxzID0geyBsaW5lOiAxLCBjb2x1bW46IDEsIHNlZW5DUjogZmFsc2UgfSxcbiAgICAgICAgcGVnJG1heEZhaWxQb3MgICAgICAgPSAwLFxuICAgICAgICBwZWckbWF4RmFpbEV4cGVjdGVkICA9IFtdLFxuICAgICAgICBwZWckc2lsZW50RmFpbHMgICAgICA9IDAsXG5cbiAgICAgICAgcGVnJHJlc3VsdDtcblxuICAgIGlmIChcInN0YXJ0UnVsZVwiIGluIG9wdGlvbnMpIHtcbiAgICAgIGlmICghKG9wdGlvbnMuc3RhcnRSdWxlIGluIHBlZyRzdGFydFJ1bGVGdW5jdGlvbnMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHN0YXJ0IHBhcnNpbmcgZnJvbSBydWxlIFxcXCJcIiArIG9wdGlvbnMuc3RhcnRSdWxlICsgXCJcXFwiLlwiKTtcbiAgICAgIH1cblxuICAgICAgcGVnJHN0YXJ0UnVsZUZ1bmN0aW9uID0gcGVnJHN0YXJ0UnVsZUZ1bmN0aW9uc1tvcHRpb25zLnN0YXJ0UnVsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGV4dCgpIHtcbiAgICAgIHJldHVybiBpbnB1dC5zdWJzdHJpbmcocGVnJHJlcG9ydGVkUG9zLCBwZWckY3VyclBvcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2Zmc2V0KCkge1xuICAgICAgcmV0dXJuIHBlZyRyZXBvcnRlZFBvcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lKCkge1xuICAgICAgcmV0dXJuIHBlZyRjb21wdXRlUG9zRGV0YWlscyhwZWckcmVwb3J0ZWRQb3MpLmxpbmU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29sdW1uKCkge1xuICAgICAgcmV0dXJuIHBlZyRjb21wdXRlUG9zRGV0YWlscyhwZWckcmVwb3J0ZWRQb3MpLmNvbHVtbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBlY3RlZChkZXNjcmlwdGlvbikge1xuICAgICAgdGhyb3cgcGVnJGJ1aWxkRXhjZXB0aW9uKFxuICAgICAgICBudWxsLFxuICAgICAgICBbeyB0eXBlOiBcIm90aGVyXCIsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiB9XSxcbiAgICAgICAgcGVnJHJlcG9ydGVkUG9zXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcbiAgICAgIHRocm93IHBlZyRidWlsZEV4Y2VwdGlvbihtZXNzYWdlLCBudWxsLCBwZWckcmVwb3J0ZWRQb3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRjb21wdXRlUG9zRGV0YWlscyhwb3MpIHtcbiAgICAgIGZ1bmN0aW9uIGFkdmFuY2UoZGV0YWlscywgc3RhcnRQb3MsIGVuZFBvcykge1xuICAgICAgICB2YXIgcCwgY2g7XG5cbiAgICAgICAgZm9yIChwID0gc3RhcnRQb3M7IHAgPCBlbmRQb3M7IHArKykge1xuICAgICAgICAgIGNoID0gaW5wdXQuY2hhckF0KHApO1xuICAgICAgICAgIGlmIChjaCA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgaWYgKCFkZXRhaWxzLnNlZW5DUikgeyBkZXRhaWxzLmxpbmUrKzsgfVxuICAgICAgICAgICAgZGV0YWlscy5jb2x1bW4gPSAxO1xuICAgICAgICAgICAgZGV0YWlscy5zZWVuQ1IgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIlxcclwiIHx8IGNoID09PSBcIlxcdTIwMjhcIiB8fCBjaCA9PT0gXCJcXHUyMDI5XCIpIHtcbiAgICAgICAgICAgIGRldGFpbHMubGluZSsrO1xuICAgICAgICAgICAgZGV0YWlscy5jb2x1bW4gPSAxO1xuICAgICAgICAgICAgZGV0YWlscy5zZWVuQ1IgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZXRhaWxzLmNvbHVtbisrO1xuICAgICAgICAgICAgZGV0YWlscy5zZWVuQ1IgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBlZyRjYWNoZWRQb3MgIT09IHBvcykge1xuICAgICAgICBpZiAocGVnJGNhY2hlZFBvcyA+IHBvcykge1xuICAgICAgICAgIHBlZyRjYWNoZWRQb3MgPSAwO1xuICAgICAgICAgIHBlZyRjYWNoZWRQb3NEZXRhaWxzID0geyBsaW5lOiAxLCBjb2x1bW46IDEsIHNlZW5DUjogZmFsc2UgfTtcbiAgICAgICAgfVxuICAgICAgICBhZHZhbmNlKHBlZyRjYWNoZWRQb3NEZXRhaWxzLCBwZWckY2FjaGVkUG9zLCBwb3MpO1xuICAgICAgICBwZWckY2FjaGVkUG9zID0gcG9zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGVnJGNhY2hlZFBvc0RldGFpbHM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJGZhaWwoZXhwZWN0ZWQpIHtcbiAgICAgIGlmIChwZWckY3VyclBvcyA8IHBlZyRtYXhGYWlsUG9zKSB7IHJldHVybjsgfVxuXG4gICAgICBpZiAocGVnJGN1cnJQb3MgPiBwZWckbWF4RmFpbFBvcykge1xuICAgICAgICBwZWckbWF4RmFpbFBvcyA9IHBlZyRjdXJyUG9zO1xuICAgICAgICBwZWckbWF4RmFpbEV4cGVjdGVkID0gW107XG4gICAgICB9XG5cbiAgICAgIHBlZyRtYXhGYWlsRXhwZWN0ZWQucHVzaChleHBlY3RlZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJGJ1aWxkRXhjZXB0aW9uKG1lc3NhZ2UsIGV4cGVjdGVkLCBwb3MpIHtcbiAgICAgIGZ1bmN0aW9uIGNsZWFudXBFeHBlY3RlZChleHBlY3RlZCkge1xuICAgICAgICB2YXIgaSA9IDE7XG5cbiAgICAgICAgZXhwZWN0ZWQuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgaWYgKGEuZGVzY3JpcHRpb24gPCBiLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgfSBlbHNlIGlmIChhLmRlc2NyaXB0aW9uID4gYi5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBleHBlY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoZXhwZWN0ZWRbaSAtIDFdID09PSBleHBlY3RlZFtpXSkge1xuICAgICAgICAgICAgZXhwZWN0ZWQuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGJ1aWxkTWVzc2FnZShleHBlY3RlZCwgZm91bmQpIHtcbiAgICAgICAgZnVuY3Rpb24gc3RyaW5nRXNjYXBlKHMpIHtcbiAgICAgICAgICBmdW5jdGlvbiBoZXgoY2gpIHsgcmV0dXJuIGNoLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IH1cblxuICAgICAgICAgIHJldHVybiBzXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCAgICdcXFxcXFxcXCcpXG4gICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgICAgJ1xcXFxcIicpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx4MDgvZywgJ1xcXFxiJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgICAnXFxcXHQnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAgICdcXFxcbicpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxmL2csICAgJ1xcXFxmJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgICAnXFxcXHInKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHgwMC1cXHgwN1xceDBCXFx4MEVcXHgwRl0vZywgZnVuY3Rpb24oY2gpIHsgcmV0dXJuICdcXFxceDAnICsgaGV4KGNoKTsgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx4MTAtXFx4MUZcXHg4MC1cXHhGRl0vZywgICAgZnVuY3Rpb24oY2gpIHsgcmV0dXJuICdcXFxceCcgICsgaGV4KGNoKTsgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx1MDE4MC1cXHUwRkZGXS9nLCAgICAgICAgIGZ1bmN0aW9uKGNoKSB7IHJldHVybiAnXFxcXHUwJyArIGhleChjaCk7IH0pXG4gICAgICAgICAgICAucmVwbGFjZSgvW1xcdTEwODAtXFx1RkZGRl0vZywgICAgICAgICBmdW5jdGlvbihjaCkgeyByZXR1cm4gJ1xcXFx1JyAgKyBoZXgoY2gpOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBleHBlY3RlZERlc2NzID0gbmV3IEFycmF5KGV4cGVjdGVkLmxlbmd0aCksXG4gICAgICAgICAgICBleHBlY3RlZERlc2MsIGZvdW5kRGVzYywgaTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXhwZWN0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBleHBlY3RlZERlc2NzW2ldID0gZXhwZWN0ZWRbaV0uZGVzY3JpcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3RlZERlc2MgPSBleHBlY3RlZC5sZW5ndGggPiAxXG4gICAgICAgICAgPyBleHBlY3RlZERlc2NzLnNsaWNlKDAsIC0xKS5qb2luKFwiLCBcIilcbiAgICAgICAgICAgICAgKyBcIiBvciBcIlxuICAgICAgICAgICAgICArIGV4cGVjdGVkRGVzY3NbZXhwZWN0ZWQubGVuZ3RoIC0gMV1cbiAgICAgICAgICA6IGV4cGVjdGVkRGVzY3NbMF07XG5cbiAgICAgICAgZm91bmREZXNjID0gZm91bmQgPyBcIlxcXCJcIiArIHN0cmluZ0VzY2FwZShmb3VuZCkgKyBcIlxcXCJcIiA6IFwiZW5kIG9mIGlucHV0XCI7XG5cbiAgICAgICAgcmV0dXJuIFwiRXhwZWN0ZWQgXCIgKyBleHBlY3RlZERlc2MgKyBcIiBidXQgXCIgKyBmb3VuZERlc2MgKyBcIiBmb3VuZC5cIjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBvc0RldGFpbHMgPSBwZWckY29tcHV0ZVBvc0RldGFpbHMocG9zKSxcbiAgICAgICAgICBmb3VuZCAgICAgID0gcG9zIDwgaW5wdXQubGVuZ3RoID8gaW5wdXQuY2hhckF0KHBvcykgOiBudWxsO1xuXG4gICAgICBpZiAoZXhwZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgY2xlYW51cEV4cGVjdGVkKGV4cGVjdGVkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBTeW50YXhFcnJvcihcbiAgICAgICAgbWVzc2FnZSAhPT0gbnVsbCA/IG1lc3NhZ2UgOiBidWlsZE1lc3NhZ2UoZXhwZWN0ZWQsIGZvdW5kKSxcbiAgICAgICAgZXhwZWN0ZWQsXG4gICAgICAgIGZvdW5kLFxuICAgICAgICBwb3MsXG4gICAgICAgIHBvc0RldGFpbHMubGluZSxcbiAgICAgICAgcG9zRGV0YWlscy5jb2x1bW5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlcGx5KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBwZWckcGFyc2VtYWdpYygpO1xuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNlaGVhZGVyKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gcGVnJHBhcnNlYm9keSgpO1xuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczEgPSBbczEsIHMyLCBzM107XG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlbWFnaWMoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDMpID09PSBwZWckYzEpIHtcbiAgICAgICAgczEgPSBwZWckYzE7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMyKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNlbmwoKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczEgPSBbczEsIHMyXTtcbiAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlaGVhZGVyKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczU7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IHBlZyRwYXJzZWZvcm1hdCgpO1xuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gW107XG4gICAgICAgIHMzID0gcGVnJHBhcnNlY29tbWVudCgpO1xuICAgICAgICB3aGlsZSAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMi5wdXNoKHMzKTtcbiAgICAgICAgICBzMyA9IHBlZyRwYXJzZWNvbW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMyA9IFtdO1xuICAgICAgICAgIHM0ID0gcGVnJHBhcnNlZWxlbWVudCgpO1xuICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgd2hpbGUgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHMzLnB1c2goczQpO1xuICAgICAgICAgICAgICBzNCA9IHBlZyRwYXJzZWVsZW1lbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczMgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMTApID09PSBwZWckYzQpIHtcbiAgICAgICAgICAgICAgczQgPSBwZWckYzQ7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zICs9IDEwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgczQgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNSk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZW5sKCk7XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHMxID0gW3MxLCBzMiwgczMsIHM0LCBzNV07XG4gICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWZvcm1hdCgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1LCBzNjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDYpID09PSBwZWckYzYpIHtcbiAgICAgICAgczEgPSBwZWckYzY7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM3KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNSkgPT09IHBlZyRjOCkge1xuICAgICAgICAgICAgczMgPSBwZWckYzg7XG4gICAgICAgICAgICBwZWckY3VyclBvcyArPSA1O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMyA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjOSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzNCA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMykgPT09IHBlZyRjMTApIHtcbiAgICAgICAgICAgICAgICBzNSA9IHBlZyRjMTA7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzNSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzExKTsgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHM2ID0gcGVnJHBhcnNlbmwoKTtcbiAgICAgICAgICAgICAgICBpZiAoczYgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgIHMxID0gW3MxLCBzMiwgczMsIHM0LCBzNSwgczZdO1xuICAgICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWNvbW1lbnQoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczM7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA3KSA9PT0gcGVnJGMxMikge1xuICAgICAgICBzMSA9IHBlZyRjMTI7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxMyk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IFtdO1xuICAgICAgICBpZiAocGVnJGMxNC50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgczMgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczMgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMxNSk7IH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMi5wdXNoKHMzKTtcbiAgICAgICAgICBpZiAocGVnJGMxNC50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgICBzMyA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMyA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMTUpOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gcGVnJHBhcnNlbmwoKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHMxID0gW3MxLCBzMiwgczNdO1xuICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWVsZW1lbnQoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMiwgczM7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBzMSA9IHBlZyRwYXJzZWVoYWRlcigpO1xuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gW107XG4gICAgICAgIHMzID0gcGVnJHBhcnNlcHJvcGVydHkoKTtcbiAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgd2hpbGUgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICBzMi5wdXNoKHMzKTtcbiAgICAgICAgICAgIHMzID0gcGVnJHBhcnNlcHJvcGVydHkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczIgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgczEgPSBwZWckYzE2KHMxLCBzMik7XG4gICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWVoYWRlcigpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1LCBzNjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDcpID09PSBwZWckYzE3KSB7XG4gICAgICAgIHMxID0gcGVnJGMxNztcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gNztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzE4KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2VlbHR5cGUoKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZW51bWJlcigpO1xuICAgICAgICAgICAgICBpZiAoczUgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICBzNiA9IHBlZyRwYXJzZW5sKCk7XG4gICAgICAgICAgICAgICAgaWYgKHM2ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgIHMxID0gcGVnJGMxOShzMywgczUpO1xuICAgICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWVsdHlwZSgpIHtcbiAgICAgIHZhciBzMDtcblxuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNikgPT09IHBlZyRjMjApIHtcbiAgICAgICAgczAgPSBwZWckYzIwO1xuICAgICAgICBwZWckY3VyclBvcyArPSA2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMjEpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNCkgPT09IHBlZyRjMjIpIHtcbiAgICAgICAgICBzMCA9IHBlZyRjMjI7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgKz0gNDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzIzKTsgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2Vwcm9wZXJ0eSgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyLCBzMywgczQsIHM1LCBzNjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDgpID09PSBwZWckYzI0KSB7XG4gICAgICAgIHMxID0gcGVnJGMyNDtcbiAgICAgICAgcGVnJGN1cnJQb3MgKz0gODtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzI1KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczMgPSBwZWckcGFyc2VwdHlwZSgpO1xuICAgICAgICAgIGlmIChzMyAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczQgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICAgICAgaWYgKHM0ICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgICAgIHM1ID0gcGVnJHBhcnNlcHZhbHVlKCk7XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHM2ID0gcGVnJHBhcnNlbmwoKTtcbiAgICAgICAgICAgICAgICBpZiAoczYgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICAgICAgICAgICAgczEgPSBwZWckYzI2KHM1KTtcbiAgICAgICAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VwdHlwZSgpIHtcbiAgICAgIHZhciBzMDtcblxuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNSkgPT09IHBlZyRjMjcpIHtcbiAgICAgICAgczAgPSBwZWckYzI3O1xuICAgICAgICBwZWckY3VyclBvcyArPSA1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMjgpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNCkgPT09IHBlZyRjMjkpIHtcbiAgICAgICAgICBzMCA9IHBlZyRjMjk7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgKz0gNDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzMwKTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDMpID09PSBwZWckYzMxKSB7XG4gICAgICAgICAgICBzMCA9IHBlZyRjMzE7XG4gICAgICAgICAgICBwZWckY3VyclBvcyArPSAzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMzIpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNSkgPT09IHBlZyRjMzMpIHtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzMzO1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSA1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjMzQpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgNCkgPT09IHBlZyRjMzUpIHtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjMzU7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gNDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzM2KTsgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJHBhcnNlbGlzdCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VsaXN0KCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczU7XG5cbiAgICAgIHMwID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuc3Vic3RyKHBlZyRjdXJyUG9zLCA0KSA9PT0gcGVnJGMzNykge1xuICAgICAgICBzMSA9IHBlZyRjMzc7XG4gICAgICAgIHBlZyRjdXJyUG9zICs9IDQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzMSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGMzOCk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMiA9IHBlZyRwYXJzZXdzKCk7XG4gICAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMzID0gcGVnJHBhcnNlcHR5cGUoKTtcbiAgICAgICAgICBpZiAoczMgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHM0ID0gcGVnJHBhcnNld3MoKTtcbiAgICAgICAgICAgIGlmIChzNCAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICBzNSA9IHBlZyRwYXJzZXB0eXBlKCk7XG4gICAgICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIHMxID0gW3MxLCBzMiwgczMsIHM0LCBzNV07XG4gICAgICAgICAgICAgICAgczAgPSBzMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMwO1xuICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZXB2YWx1ZSgpIHtcbiAgICAgIHZhciBzMDtcblxuICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMjApIHtcbiAgICAgICAgczAgPSBwZWckYzM5O1xuICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNDApOyB9XG4gICAgICB9XG4gICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMjEpIHtcbiAgICAgICAgICBzMCA9IHBlZyRjNDE7XG4gICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQyKTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBlZyRjdXJyUG9zKSA9PT0gMTIyKSB7XG4gICAgICAgICAgICBzMCA9IHBlZyRjNDM7XG4gICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNDQpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMikgPT09IHBlZyRjNDUpIHtcbiAgICAgICAgICAgICAgczAgPSBwZWckYzQ1O1xuICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNDYpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMikgPT09IHBlZyRjNDcpIHtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRjNDc7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzQ4KTsgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDIpID09PSBwZWckYzQ5KSB7XG4gICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjNDk7XG4gICAgICAgICAgICAgICAgICBwZWckY3VyclBvcyArPSAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNTApOyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzUxO1xuICAgICAgICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgczAgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNTIpOyB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoczAgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMTYpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRjNTM7XG4gICAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBzMCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzU0KTsgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzMCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocGVnJGN1cnJQb3MsIDE0KSA9PT0gcGVnJGM1NSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgczAgPSBwZWckYzU1O1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MgKz0gMTQ7XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMwID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM1Nik7IH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHMwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZyRwYXJzZWJvZHkoKSB7XG4gICAgICB2YXIgczAsIHMxO1xuXG4gICAgICBzMCA9IFtdO1xuICAgICAgczEgPSBwZWckcGFyc2VibGluZSgpO1xuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHdoaWxlIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMwLnB1c2goczEpO1xuICAgICAgICAgIHMxID0gcGVnJHBhcnNlYmxpbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VibGluZSgpIHtcbiAgICAgIHZhciBzMCwgczEsIHMyO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgczEgPSBbXTtcbiAgICAgIHMyID0gcGVnJHBhcnNlYnZhbHVlKCk7XG4gICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgd2hpbGUgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczEucHVzaChzMik7XG4gICAgICAgICAgczIgPSBwZWckcGFyc2VidmFsdWUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckYzA7XG4gICAgICB9XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2VubCgpO1xuICAgICAgICBpZiAoczIgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgICBzMSA9IHBlZyRjNTcoczEpO1xuICAgICAgICAgIHMwID0gczE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgICBzMCA9IHBlZyRjMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVnJGN1cnJQb3MgPSBzMDtcbiAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2VidmFsdWUoKSB7XG4gICAgICB2YXIgczAsIHMxLCBzMjtcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gcGVnJHBhcnNlbnVtYmVyKCk7XG4gICAgICBpZiAoczEgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgczIgPSBwZWckcGFyc2V3cygpO1xuICAgICAgICBpZiAoczIgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICBzMiA9IHBlZyRjNTg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMyICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgcGVnJHJlcG9ydGVkUG9zID0gczA7XG4gICAgICAgICAgczEgPSBwZWckYzI2KHMxKTtcbiAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgICAgczAgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZyRjdXJyUG9zID0gczA7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlbnVtYmVyKCkge1xuICAgICAgdmFyIHMwLCBzMSwgczIsIHMzLCBzNCwgczUsIHM2LCBzNztcblxuICAgICAgczAgPSBwZWckY3VyclBvcztcbiAgICAgIHMxID0gcGVnJGN1cnJQb3M7XG4gICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDQ1KSB7XG4gICAgICAgIHMyID0gcGVnJGM1OTtcbiAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMyID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzYwKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMyID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHMyID0gcGVnJGM1ODtcbiAgICAgIH1cbiAgICAgIGlmIChzMiAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBzMyA9IFtdO1xuICAgICAgICBpZiAocGVnJGM2MS50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgICAgczQgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczQgPSBwZWckRkFJTEVEO1xuICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2Mik7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICB3aGlsZSAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHMzLnB1c2goczQpO1xuICAgICAgICAgICAgaWYgKHBlZyRjNjEudGVzdChpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpKSkge1xuICAgICAgICAgICAgICBzNCA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzNCA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2Mik7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgczMgPSBwZWckYzA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMzICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgczQgPSBwZWckY3VyclBvcztcbiAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwZWckY3VyclBvcykgPT09IDQ2KSB7XG4gICAgICAgICAgICBzNSA9IHBlZyRjNjM7XG4gICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzNSA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjQpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzNSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczYgPSBbXTtcbiAgICAgICAgICAgIGlmIChwZWckYzYxLnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICAgICAgczcgPSBpbnB1dC5jaGFyQXQocGVnJGN1cnJQb3MpO1xuICAgICAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgczcgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjIpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoczcgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczYucHVzaChzNyk7XG4gICAgICAgICAgICAgIGlmIChwZWckYzYxLnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICAgICAgICBzNyA9IGlucHV0LmNoYXJBdChwZWckY3VyclBvcyk7XG4gICAgICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzNyA9IHBlZyRGQUlMRUQ7XG4gICAgICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzYyKTsgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoczYgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgICAgczUgPSBbczUsIHM2XTtcbiAgICAgICAgICAgICAgczQgPSBzNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlZyRjdXJyUG9zID0gczQ7XG4gICAgICAgICAgICAgIHM0ID0gcGVnJGMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZWckY3VyclBvcyA9IHM0O1xuICAgICAgICAgICAgczQgPSBwZWckYzA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzNCA9PT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgICAgczQgPSBwZWckYzU4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoczQgIT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgICAgIHMyID0gW3MyLCBzMywgczRdO1xuICAgICAgICAgICAgczEgPSBzMjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MgPSBzMTtcbiAgICAgICAgICAgIHMxID0gcGVnJGMwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZWckY3VyclBvcyA9IHMxO1xuICAgICAgICAgIHMxID0gcGVnJGMwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWckY3VyclBvcyA9IHMxO1xuICAgICAgICBzMSA9IHBlZyRjMDtcbiAgICAgIH1cbiAgICAgIGlmIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICBwZWckcmVwb3J0ZWRQb3MgPSBzMDtcbiAgICAgICAgczEgPSBwZWckYzY1KHMxKTtcbiAgICAgIH1cbiAgICAgIHMwID0gczE7XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWckcGFyc2V3cygpIHtcbiAgICAgIHZhciBzMCwgczE7XG5cbiAgICAgIHMwID0gW107XG4gICAgICBpZiAocGVnJGM2Ni50ZXN0KGlucHV0LmNoYXJBdChwZWckY3VyclBvcykpKSB7XG4gICAgICAgIHMxID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzY3KTsgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHdoaWxlIChzMSAhPT0gcGVnJEZBSUxFRCkge1xuICAgICAgICAgIHMwLnB1c2goczEpO1xuICAgICAgICAgIGlmIChwZWckYzY2LnRlc3QoaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKSkpIHtcbiAgICAgICAgICAgIHMxID0gaW5wdXQuY2hhckF0KHBlZyRjdXJyUG9zKTtcbiAgICAgICAgICAgIHBlZyRjdXJyUG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICAgIGlmIChwZWckc2lsZW50RmFpbHMgPT09IDApIHsgcGVnJGZhaWwocGVnJGM2Nyk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMwID0gcGVnJGMwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gczA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVnJHBhcnNlbmwoKSB7XG4gICAgICB2YXIgczAsIHMxO1xuXG4gICAgICBzMCA9IHBlZyRjdXJyUG9zO1xuICAgICAgaWYgKGlucHV0LnN1YnN0cihwZWckY3VyclBvcywgMikgPT09IHBlZyRjNjgpIHtcbiAgICAgICAgczEgPSBwZWckYzY4O1xuICAgICAgICBwZWckY3VyclBvcyArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNjkpOyB9XG4gICAgICB9XG4gICAgICBpZiAoczEgPT09IHBlZyRGQUlMRUQpIHtcbiAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMCkge1xuICAgICAgICAgIHMxID0gcGVnJGM3MDtcbiAgICAgICAgICBwZWckY3VyclBvcysrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMxID0gcGVnJEZBSUxFRDtcbiAgICAgICAgICBpZiAocGVnJHNpbGVudEZhaWxzID09PSAwKSB7IHBlZyRmYWlsKHBlZyRjNzEpOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMxID09PSBwZWckRkFJTEVEKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocGVnJGN1cnJQb3MpID09PSAxMykge1xuICAgICAgICAgICAgczEgPSBwZWckYzcyO1xuICAgICAgICAgICAgcGVnJGN1cnJQb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgczEgPSBwZWckRkFJTEVEO1xuICAgICAgICAgICAgaWYgKHBlZyRzaWxlbnRGYWlscyA9PT0gMCkgeyBwZWckZmFpbChwZWckYzczKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHMxICE9PSBwZWckRkFJTEVEKSB7XG4gICAgICAgIHBlZyRyZXBvcnRlZFBvcyA9IHMwO1xuICAgICAgICBzMSA9IHBlZyRjNzQoKTtcbiAgICAgIH1cbiAgICAgIHMwID0gczE7XG5cbiAgICAgIHJldHVybiBzMDtcbiAgICB9XG5cblxyXG4gICAgICB2YXIgbGluZXMgICAgICA9IDA7XHJcbiAgICAgIHZhciBtZXNoICAgICAgID0gb3B0aW9ucy5tZXNoO1xyXG4gICAgICB2YXIgZWxlbWVudHMgICA9IFtdO1xyXG4gICAgICB2YXIgZWxlbWVudElkcyA9IDA7IC8vIGN1cnJlbnRseSBhY3RpdmUgZWxlbWVudFxyXG4gICAgICB2YXIgdmFsdWVDb3VudCA9IDA7IC8vIHdoaWNoIHZhbHVlIHdhcyByZWFkIGxhc3QsIHdpdGhpbiB0aGlzIGVsZW1lbnRcclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHN0ckpvaW4odmFsdWVzKSB7XHJcbiAgICAgICAgdmFyIHIgPSAnJztcclxuICAgICAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7ICAgICAgIFxyXG4gICAgICAgICAgICAgIHIgPSByLmNvbmNhdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7ICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIHIgPSByLmNvbmNhdChzdHJKb2luKHZhbHVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gZGVjb2RlTGluZSh2YWx1ZXMpIHtcclxuICAgICAgICB2YXIgcHJvcHMgPSBlbGVtZW50c1tlbGVtZW50SWRzXS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChwcm9wc1swXSA9PSAndmVydGV4X2luZGljZXMnKSB7XHJcbiAgICAgICAgICB2YXIgY291bnQgPSB2YWx1ZXNbMF07XHJcbiAgICAgICAgICAvLyBhbnl0aGluZyBsYXJnZXIgdGhhbiBhIHRyaWFuZ2xlIGlzIGJhc2ljYWxseSAgXHJcbiAgICAgICAgICAvLyBpbXBsZW1lbnRlZCBhcyBhIHRyaWFuZ2xlIGZhblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDI7IGkgPCBjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIGFjdHVhbCB1c2FibGUgdmFsdWVzIHN0YXJ0IHdpdGggMVxyXG4gICAgICAgICAgICB2YXIgYSA9IHZhbHVlc1sxXTsgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgYiA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGMgPSB2YWx1ZXNbaSArIDFdO1xyXG4gICAgICAgICAgICBtZXNoLmFkZFRyaWFuZ2xlKGEsIGIsIGMpO1xyXG4gICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgICAgXHJcbiAgICAgICAgICB2YXIgdmVydGV4ICAgPSBwa3pvLnZlYzMoMCk7XHJcbiAgICAgICAgICB2YXIgbm9ybWFsICAgPSBwa3pvLnZlYzMoMCk7XHJcbiAgICAgICAgICB2YXIgdGV4Q29vcmQgPSBwa3pvLnZlYzIoMCk7XHJcbiAgICAgICAgICBwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wLCBpKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocHJvcCkge1xyXG4gICAgICAgICAgICAgIGNhc2UgJ3gnOlxyXG4gICAgICAgICAgICAgICAgdmVydGV4WzBdID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAneSc6XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhbMV0gPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlICd6JzpcclxuICAgICAgICAgICAgICAgIHZlcnRleFsyXSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgJ254JzpcclxuICAgICAgICAgICAgICAgIG5vcm1hbFswXSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgJ255JzpcclxuICAgICAgICAgICAgICAgIG5vcm1hbFsxXSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgJ256JzpcclxuICAgICAgICAgICAgICAgIG5vcm1hbFsyXSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrOyAgXHJcbiAgICAgICAgICAgICAgY2FzZSAndCc6XHJcbiAgICAgICAgICAgICAgICB0ZXhDb29yZFswXSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgJ3MnOlxyXG4gICAgICAgICAgICAgICAgdGV4Q29vcmRbMV0gPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIG1lc2guYWRkVmVydGV4KHZlcnRleCwgbm9ybWFsLCB0ZXhDb29yZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB2YWx1ZUNvdW50Kys7XHJcbiAgICAgICAgaWYgKHZhbHVlQ291bnQgPT0gZWxlbWVudHNbZWxlbWVudElkc10uY291bnQpIHtcclxuICAgICAgICAgIGVsZW1lbnRJZHMrKztcclxuICAgICAgICAgIHZhbHVlQ291bnQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cblxuICAgIHBlZyRyZXN1bHQgPSBwZWckc3RhcnRSdWxlRnVuY3Rpb24oKTtcblxuICAgIGlmIChwZWckcmVzdWx0ICE9PSBwZWckRkFJTEVEICYmIHBlZyRjdXJyUG9zID09PSBpbnB1dC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBwZWckcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGVnJHJlc3VsdCAhPT0gcGVnJEZBSUxFRCAmJiBwZWckY3VyclBvcyA8IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICBwZWckZmFpbCh7IHR5cGU6IFwiZW5kXCIsIGRlc2NyaXB0aW9uOiBcImVuZCBvZiBpbnB1dFwiIH0pO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBwZWckYnVpbGRFeGNlcHRpb24obnVsbCwgcGVnJG1heEZhaWxFeHBlY3RlZCwgcGVnJG1heEZhaWxQb3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgU3ludGF4RXJyb3I6IFN5bnRheEVycm9yLFxuICAgIHBhcnNlOiAgICAgICBwYXJzZVxuICB9O1xufSkoKTsiLCJcclxucGt6by5NZXNoID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMubG9hZGVkID0gZmFsc2U7ICBcclxufVxyXG5cclxucGt6by5NZXNoLmxvYWQgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgICB2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuICAgIFxyXG4gICAgdmFyIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IDQgJiYgeG1saHR0cC5zdGF0dXMgPT0gMjAwKVxyXG4gICAgICB7XHJcbiAgICAgICAgdmFyIHBhcnNlciA9IHBrem8uUGx5UGFyc2VyO1xyXG4gICAgICAgIHBhcnNlci5wYXJzZSh4bWxodHRwLnJlc3BvbnNlVGV4dCwge21lc2g6IG1lc2h9KTtcclxuICAgICAgICBtZXNoLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICB4bWxodHRwLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcclxuICAgIHhtbGh0dHAuc2VuZCgpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gbWVzaDtcclxufVxyXG5cclxucGt6by5NZXNoLnBsYW5lID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHdyZXMsIGhyZXMpIHtcclxuICB2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuICBcclxuICBpZiAod3JlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB2YXIgd3JlcyA9IDE7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChocmVzID09PSB1bmRlZmluZWQpIHtcclxuICAgIHZhciBocmVzID0gMTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHcyID0gd2lkdGggLyAyLjA7XHJcbiAgdmFyIGgyID0gaGVpZ2h0IC8gMi4wO1xyXG4gIHZhciB3cyA9IHdpZHRoIC8gd3JlcztcclxuICB2YXIgaHMgPSBoZWlnaHQgLyBocmVzO1xyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDw9IHdyZXM7IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPD0gaHJlczsgaisrKSB7XHJcbiAgICAgIHZhciB4ID0gLXcyICsgaSAqIHdzOyBcclxuICAgICAgdmFyIHkgPSAtaDIgKyBqICogaHM7XHJcbiAgICAgIHZhciB0ID0gaTtcclxuICAgICAgdmFyIHMgPSBqO1xyXG4gICAgICBtZXNoLmFkZFZlcnRleChwa3pvLnZlYzMoeCwgeSwgMCksIHBrem8udmVjMygwLCAwLCAxKSwgcGt6by52ZWMyKHQsIHMpLCBwa3pvLnZlYzMoMCwgMSwgMCkpOyAgICAgICAgICAgIFxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICB2YXIgc3BhbiA9IHdyZXMgKyAxO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgd3JlczsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGhyZXM7IGorKykge1xyXG4gICAgICB2YXIgYSA9IChpICsgMCkgKiBzcGFuICsgKGogKyAwKTtcclxuICAgICAgdmFyIGIgPSAoaSArIDApICogc3BhbiArIChqICsgMSk7XHJcbiAgICAgIHZhciBjID0gKGkgKyAxKSAqIHNwYW4gKyAoaiArIDEpO1xyXG4gICAgICB2YXIgZCA9IChpICsgMSkgKiBzcGFuICsgKGogKyAwKTtcclxuICAgICAgbWVzaC5hZGRUcmlhbmdsZShhLCBiLCBjKTtcclxuICAgICAgbWVzaC5hZGRUcmlhbmdsZShjLCBkLCBhKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgbWVzaC5sb2FkZWQgPSB0cnVlO1xyXG4gIHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2guYm94ID0gZnVuY3Rpb24gKHMpIHtcclxuICBcclxuICB2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuICBcclxuICBtZXNoLnZlcnRpY2VzID0gXHJcbiAgICAgIFsgIHNbMF0sIHNbMV0sIHNbMl0sICAtc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLC1zWzFdLCBzWzJdLCAgIHNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG4gICAgICAgICBzWzBdLCBzWzFdLCBzWzJdLCAgIHNbMF0sLXNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwtc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdLCAgICBcclxuICAgICAgICAgc1swXSwgc1sxXSwgc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdLCAgLXNbMF0sIHNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwgc1syXSwgICAgXHJcbiAgICAgICAgLXNbMF0sIHNbMV0sIHNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgIC1zWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG4gICAgICAgIC1zWzBdLC1zWzFdLC1zWzJdLCAgIHNbMF0sLXNbMV0sLXNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgIC1zWzBdLC1zWzFdLCBzWzJdLCAgICBcclxuICAgICAgICAgc1swXSwtc1sxXSwtc1syXSwgIC1zWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sIHNbMV0sLXNbMl0sICAgc1swXSwgc1sxXSwtc1syXSBdOyAgXHJcbiAgICAgICAgIFxyXG4gIG1lc2gubm9ybWFscyA9IFxyXG4gICAgICBbICAwLCAwLCAxLCAgIDAsIDAsIDEsICAgMCwgMCwgMSwgICAwLCAwLCAxLCAgICAgXHJcbiAgICAgICAgIDEsIDAsIDAsICAgMSwgMCwgMCwgICAxLCAwLCAwLCAgIDEsIDAsIDAsICAgICBcclxuICAgICAgICAgMCwgMSwgMCwgICAwLCAxLCAwLCAgIDAsIDEsIDAsICAgMCwgMSwgMCwgICAgIFxyXG4gICAgICAgIC0xLCAwLCAwLCAgLTEsIDAsIDAsICAtMSwgMCwgMCwgIC0xLCAwLCAwLCAgICAgXHJcbiAgICAgICAgIDAsLTEsIDAsICAgMCwtMSwgMCwgICAwLC0xLCAwLCAgIDAsLTEsIDAsICAgICBcclxuICAgICAgICAgMCwgMCwtMSwgICAwLCAwLC0xLCAgIDAsIDAsLTEsICAgMCwgMCwtMSBdOyAgIFxyXG5cclxuICBtZXNoLnRleENvb3JkcyA9IFxyXG4gICAgICBbICAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAxLCAwLCAgICBcclxuICAgICAgICAgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgMSwgMSwgICAgXHJcbiAgICAgICAgIDEsIDAsICAgMSwgMSwgICAwLCAxLCAgIDAsIDAsICAgIFxyXG4gICAgICAgICAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAxLCAwLCAgICBcclxuICAgICAgICAgMCwgMCwgICAxLCAwLCAgIDEsIDEsICAgMCwgMSwgICAgXHJcbiAgICAgICAgIDAsIDAsICAgMSwgMCwgICAxLCAxLCAgIDAsIDEgXTsgIFxyXG5cclxuICBtZXNoLmluZGljZXMgPSBcclxuICAgICAgWyAgMCwgMSwgMiwgICAwLCAyLCAzLCAgIFxyXG4gICAgICAgICA0LCA1LCA2LCAgIDQsIDYsIDcsICAgXHJcbiAgICAgICAgIDgsIDksMTAsICAgOCwxMCwxMSwgICBcclxuICAgICAgICAxMiwxMywxNCwgIDEyLDE0LDE1LCAgIFxyXG4gICAgICAgIDE2LDE3LDE4LCAgMTYsMTgsMTksICAgXHJcbiAgICAgICAgMjAsMjEsMjIsICAyMCwyMiwyMyBdOyBcclxuXHJcbiAgbWVzaC5sb2FkZWQgPSB0cnVlO1xyXG4gIHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2guc3BoZXJlID0gZnVuY3Rpb24gKHJhZGl1cywgbkxhdGl0dWRlLCBuTG9uZ2l0dWRlKSB7XHJcbiAgXHJcbiAgdmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcbiAgXHJcbiAgdmFyIG5QaXRjaCA9IG5Mb25naXR1ZGUgKyAxO1xyXG4gIFxyXG4gIHZhciBwaXRjaEluYyA9IHBrem8ucmFkaWFucygxODAuMCAvIG5QaXRjaCk7XHJcbiAgdmFyIHJvdEluYyAgID0gcGt6by5yYWRpYW5zKDM2MC4wIC8gbkxhdGl0dWRlKTtcclxuIFxyXG4gIC8vIHBvbGVzXHJcbiAgbWVzaC5hZGRWZXJ0ZXgocGt6by52ZWMzKDAsIDAsIHJhZGl1cyksIHBrem8udmVjMygwLCAwLCAxKSwgcGt6by52ZWMyKDAuNSwgMCksIHBrem8udmVjMygwLCAxLCAwKSk7IC8vIHRvcCB2ZXJ0ZXhcclxuICBtZXNoLmFkZFZlcnRleChwa3pvLnZlYzMoMCwgMCwgLXJhZGl1cyksIHBrem8udmVjMygwLCAwLCAtMSksIHBrem8udmVjMigwLjUsIDEpLCBwa3pvLnZlYzMoMCwgMSwgMCkpOyAvLyBib3R0b20gdmVydGV4XHJcbiAgIFxyXG4gIC8vIGJvZHkgdmVydGljZXNcclxuICB2YXIgdHdvUGkgPSBNYXRoLlBJICogMi4wO1xyXG4gIGZvciAodmFyIHAgPSAxOyBwIDwgblBpdGNoOyBwKyspIHsgICAgXHJcbiAgICB2YXIgb3V0ID0gTWF0aC5hYnMocmFkaXVzICogTWF0aC5zaW4ocCAqIHBpdGNoSW5jKSk7ICAgIFxyXG4gICAgdmFyIHogICA9IHJhZGl1cyAqIE1hdGguY29zKHAgKiBwaXRjaEluYyk7XHJcbiAgICBcclxuICAgIGZvcih2YXIgcyA9IDA7IHMgPD0gbkxhdGl0dWRlOyBzKyspIHtcclxuICAgICAgdmFyIHggPSBvdXQgKiBNYXRoLmNvcyhzICogcm90SW5jKTtcclxuICAgICAgdmFyIHkgPSBvdXQgKiBNYXRoLnNpbihzICogcm90SW5jKTtcclxuICAgICAgXHJcbiAgICAgIHZhciB2ZWMgID0gcGt6by52ZWMzKHgsIHksIHopO1xyXG4gICAgICB2YXIgbm9ybSA9IHBrem8ubm9ybWFsaXplKHZlYyk7XHJcbiAgICAgIHZhciB0YyAgID0gcGt6by52ZWMyKHMgLyBuTGF0aXR1ZGUsIHAgLyBuUGl0Y2gpOyAgICAgIFxyXG4gICAgICB2YXIgdGFuZyA9IHBrem8uY3Jvc3Mobm9ybSwgcGt6by52ZWMzKDAsIDAsIDEpKTtcclxuICAgICAgbWVzaC5hZGRWZXJ0ZXgodmVjLCBub3JtLCB0YywgdGFuZyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8vIHBvbGFyIGNhcHNcclxuICB2YXIgb2ZmTGFzdFZlcnRzID0gMiArICgobkxhdGl0dWRlICsgMSkgKiAoblBpdGNoIC0gMikpO1xyXG4gIGZvcih2YXIgcyA9IDA7IHMgPCBuTGF0aXR1ZGU7IHMrKylcclxuICB7XHJcbiAgICBtZXNoLmFkZFRyaWFuZ2xlKDAsIDIgKyBzLCAyICsgcyArIDEpO1xyXG4gICAgbWVzaC5hZGRUcmlhbmdsZSgxLCBvZmZMYXN0VmVydHMgKyBzLCBvZmZMYXN0VmVydHMgKyBzICsgMSk7XHJcbiAgfVxyXG4gXHJcbiAgLy8gYm9keVxyXG4gIGZvcih2YXIgcCA9IDE7IHAgPCBuUGl0Y2gtMTsgcCsrKSB7XHJcbiAgICBmb3IodmFyIHMgPSAwOyBzIDwgbkxhdGl0dWRlOyBzKyspIHtcclxuICAgICAgdmFyIGEgPSAyICsgKHAtMSkgKiAobkxhdGl0dWRlICsgMSkgKyBzO1xyXG4gICAgICB2YXIgYiA9IGEgKyAxO1xyXG4gICAgICB2YXIgZCA9IDIgKyBwICogKG5MYXRpdHVkZSArIDEpICsgcztcclxuICAgICAgdmFyIGMgPSBkICsgMTtcclxuICAgICAgXHJcbiAgICAgIG1lc2guYWRkVHJpYW5nbGUoYSwgYiwgYyk7XHJcbiAgICAgIG1lc2guYWRkVHJpYW5nbGUoYywgZCwgYSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIG1lc2gubG9hZGVkID0gdHJ1ZTtcclxuICByZXR1cm4gbWVzaDtcclxufVxyXG5cclxucGt6by5NZXNoLmljb1NwaGVyZSA9IGZ1bmN0aW9uIChyYWRpdXMsIHJlY3Vyc2lvbkxldmVsKSB7XHJcbiAgdmFyIHQgPSAoMS4wICsgTWF0aC5zcXJ0KDUuMCkpIC8gMi4wO1xyXG4gIFxyXG4gIHZhciB2ZXJ0cyA9IFtcclxuICAgIHBrem8udmVjMygtMSwgIHQsICAwKSxcclxuICAgIHBrem8udmVjMyggMSwgIHQsICAwKSxcclxuICAgIHBrem8udmVjMygtMSwgLXQsICAwKSxcclxuICAgIHBrem8udmVjMyggMSwgLXQsICAwKSxcclxuXHJcbiAgICBwa3pvLnZlYzMoIDAsIC0xLCAgdCksXHJcbiAgICBwa3pvLnZlYzMoIDAsICAxLCAgdCksXHJcbiAgICBwa3pvLnZlYzMoIDAsIC0xLCAtdCksXHJcbiAgICBwa3pvLnZlYzMoIDAsICAxLCAtdCksXHJcblxyXG4gICAgcGt6by52ZWMzKCB0LCAgMCwgLTEpLFxyXG4gICAgcGt6by52ZWMzKCB0LCAgMCwgIDEpLFxyXG4gICAgcGt6by52ZWMzKC10LCAgMCwgLTEpLFxyXG4gICAgcGt6by52ZWMzKC10LCAgMCwgIDEpLFxyXG4gIF07XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmVydHNbaV0gPSBwa3pvLm5vcm1hbGl6ZSh2ZXJ0c1tpXSk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBmYWNlcyA9IFtcclxuICAgIFswLCAxMSwgNV0sXHJcbiAgICBbMCwgNSwgMV0sXHJcbiAgICBbMCwgMSwgN10sXHJcbiAgICBbMCwgNywgMTBdLFxyXG4gICAgWzAsIDEwLCAxMV0sXHJcblxyXG4gICAgWzEsIDUsIDldLFxyXG4gICAgWzUsIDExLCA0XSxcclxuICAgIFsxMSwgMTAsIDJdLFxyXG4gICAgWzEwLCA3LCA2XSxcclxuICAgIFs3LCAxLCA4XSxcclxuXHJcbiAgICBbMywgOSwgNF0sXHJcbiAgICBbMywgNCwgMl0sXHJcbiAgICBbMywgMiwgNl0sXHJcbiAgICBbMywgNiwgOF0sXHJcbiAgICBbMywgOCwgOV0sXHJcblxyXG4gICAgWzQsIDksIDVdLFxyXG4gICAgWzIsIDQsIDExXSxcclxuICAgIFs2LCAyLCAxMF0sXHJcbiAgICBbOCwgNiwgN10sXHJcbiAgICBbOSwgOCwgMV0sICBcclxuICBdO1xyXG4gIFxyXG4gIHZhciBtaWRwb2ludENhY2hlID0gW107ICBcclxuICBcclxuICB2YXIgYWRkTWlkcG9pbnRDYWNoZSA9IGZ1bmN0aW9uIChwMSwgcDIsIGkpIHtcclxuICAgIG1pZHBvaW50Q2FjaGUucHVzaCh7cDE6IHAxLCBwMjogcDIsIGk6IGl9KTtcclxuICB9XHJcbiAgdmFyIGdldE1pZHBvaW50Q2FjaGUgPSBmdW5jdGlvbiAocDEsIHAyKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1pZHBvaW50Q2FjaGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKG1pZHBvaW50Q2FjaGUucDEgPT0gcDEgJiYgbWlkcG9pbnRDYWNoZS5wMiA9PSBwMikge1xyXG4gICAgICAgIHJldHVybiBtaWRwb2ludENhY2hlLmk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuICBcclxuICB2YXIgbWlkcG9pbnQgPSBmdW5jdGlvbiAocDEsIHAyKSB7XHJcbiAgICB2YXIgc2kgPSBwMSA8IHAyID8gcDEgOiBwMjtcclxuICAgIHZhciBnaSA9IHAxIDwgcDIgPyBwMiA6IHAxO1xyXG4gICAgXHJcbiAgICB2YXIgY2kgPSBnZXRNaWRwb2ludENhY2hlKHNpLCBnaSk7XHJcbiAgICBpZiAoY2kgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgcmV0dXJuIGNpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwb2ludDEgPSB2ZXJ0c1twMV07XHJcbiAgICB2YXIgcG9pbnQyID0gdmVydHNbcDJdO1xyXG4gICAgdmFyIG1pZGRsZSA9IHBrem8ubm9ybWFsaXplKHBrem8uYWRkKHBvaW50MSwgcG9pbnQyKSk7XHJcbiAgICBcclxuICAgIHZlcnRzLnB1c2gobWlkZGxlKTtcclxuICAgIHZhciBpID0gdmVydHMubGVuZ3RoIC0gMTsgXHJcbiAgICBcclxuICAgIGFkZE1pZHBvaW50Q2FjaGUoc2ksIGdpLCBpKTtcclxuICAgIHJldHVybiBpO1xyXG4gIH1cclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJlY3Vyc2lvbkxldmVsOyBpKyspXHJcbiAge1xyXG4gICAgdmFyIGZhY2VzMiA9IFtdO1xyXG4gICAgZmFjZXMuZm9yRWFjaChmdW5jdGlvbiAoZmFjZSkge1xyXG4gICAgICB2YXIgYSA9IG1pZHBvaW50KGZhY2VbMF0sIGZhY2VbMV0pO1xyXG4gICAgICB2YXIgYiA9IG1pZHBvaW50KGZhY2VbMV0sIGZhY2VbMl0pO1xyXG4gICAgICB2YXIgYyA9IG1pZHBvaW50KGZhY2VbMl0sIGZhY2VbMF0pO1xyXG5cclxuICAgICAgZmFjZXMyLnB1c2goW2ZhY2VbMF0sIGEsIGNdKTtcclxuICAgICAgZmFjZXMyLnB1c2goW2ZhY2VbMV0sIGIsIGFdKTtcclxuICAgICAgZmFjZXMyLnB1c2goW2ZhY2VbMl0sIGMsIGJdKTtcclxuICAgICAgZmFjZXMyLnB1c2goW2EsIGIsIGNdKTtcclxuICAgIH0pO1xyXG4gICAgZmFjZXMgPSBmYWNlczI7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBtZXNoID0gbmV3IHBrem8uTWVzaCgpO1xyXG4gIFxyXG4gIHZhciB0d29QaSA9IE1hdGguUEkgKiAyLjA7XHJcbiAgdmVydHMuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgdmFyIHZlcnRleCAgID0gcGt6by5zdm11bHQodiwgcmFkaXVzKTtcclxuICAgIHZhciBub3JtYWwgICA9IHY7ICAgICBcclxuICAgIHZhciB0ZXhDb29yZCA9IHBrem8udmVjMihNYXRoLmF0YW4odlsxXS92WzBdKSAvIHR3b1BpLCBNYXRoLmFjb3ModlsyXSkgLyB0d29QaSk7XHJcbiAgICB2YXIgdGFuZ2VudCAgPSBwa3pvLmNyb3NzKG5vcm1hbCwgcGt6by52ZWMzKDAsIDAsIDEpKTtcclxuICAgIG1lc2guYWRkVmVydGV4KHZlcnRleCwgbm9ybWFsLCB0ZXhDb29yZCwgdGFuZ2VudCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgZmFjZXMuZm9yRWFjaChmdW5jdGlvbiAoZmFjZSkge1xyXG4gICAgbWVzaC5hZGRUcmlhbmdsZShmYWNlWzBdLCBmYWNlWzFdLCBmYWNlWzJdKTtcclxuICB9KTtcclxuICBcclxuICBtZXNoLmxvYWRlZCA9IHRydWU7XHJcbiAgcmV0dXJuIG1lc2g7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuYWRkVmVydGV4ID0gZnVuY3Rpb24gKHZlcnRleCwgbm9ybWFsLCB0ZXhDb29yZCwgdGFuZ2VudCkge1xyXG4gIGlmICh0aGlzLnZlcnRpY2VzKSB7XHJcbiAgICB0aGlzLnZlcnRpY2VzLnB1c2godmVydGV4WzBdLCB2ZXJ0ZXhbMV0sIHZlcnRleFsyXSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy52ZXJ0aWNlcyA9IFt2ZXJ0ZXhbMF0sIHZlcnRleFsxXSwgdmVydGV4WzJdXTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKHRoaXMubm9ybWFscykge1xyXG4gICAgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsWzBdLCBub3JtYWxbMV0sIG5vcm1hbFsyXSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5ub3JtYWxzID0gW25vcm1hbFswXSwgbm9ybWFsWzFdLCBub3JtYWxbMl1dO1xyXG4gIH1cclxuICBcclxuICBpZiAodGhpcy50ZXhDb29yZHMpIHtcclxuICAgIHRoaXMudGV4Q29vcmRzLnB1c2godGV4Q29vcmRbMF0sIHRleENvb3JkWzFdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLnRleENvb3JkcyA9IFt0ZXhDb29yZFswXSwgdGV4Q29vcmRbMV1dO1xyXG4gIH1cclxuICBcclxuICBpZiAodGFuZ2VudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAodGhpcy50YW5nZW50cykge1xyXG4gICAgICB0aGlzLnRhbmdlbnRzLnB1c2godGFuZ2VudFswXSwgdGFuZ2VudFsxXSwgdGFuZ2VudFsyXSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy50YW5nZW50cyA9IFt0YW5nZW50WzBdLCB0YW5nZW50WzFdLCB0YW5nZW50WzJdXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuZ2V0VmVydGV4ID0gZnVuY3Rpb24gKGkpIHtcclxuICByZXR1cm4gcGt6by52ZWMzKHRoaXMudmVydGljZXNbaSAqIDNdLCB0aGlzLnZlcnRpY2VzW2kgKiAzICsgMV0sIHRoaXMudmVydGljZXNbaSAqIDMgKyAyXSk7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuZ2V0Tm9ybWFsID0gZnVuY3Rpb24gKGkpIHtcclxuICByZXR1cm4gcGt6by52ZWMzKHRoaXMubm9ybWFsc1tpICogM10sIHRoaXMubm9ybWFsc1tpICogMyArIDFdLCB0aGlzLm5vcm1hbHNbaSAqIDMgKyAyXSk7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuZ2V0VGV4Q29vcmQgPSBmdW5jdGlvbiAoaSkge1xyXG4gIHJldHVybiBwa3pvLnZlYzIodGhpcy50ZXhDb29yZHNbaSAqIDJdLCB0aGlzLnRleENvb3Jkc1tpICogMiArIDFdKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5hZGRUcmlhbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XHJcbiAgaWYgKHRoaXMuaW5kaWNlcykge1xyXG4gICAgdGhpcy5pbmRpY2VzLnB1c2goYSwgYiwgYyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5pbmRpY2VzID0gW2EsIGIsIGNdO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoZ2wpIHtcclxuICBcclxuICBpZiAoIXRoaXMudGFuZ2VudHMpIHtcclxuICAgIHRoaXMuY29tcHV0ZVRhbmdlbnRzKCk7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMudmVydGV4QnVmZmVyICAgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMudmVydGljZXMsICBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTtcclxuICB0aGlzLm5vcm1hbEJ1ZmZlciAgID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLm5vcm1hbHMsICAgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7ICAgICAgXHJcbiAgdGhpcy50ZXhDb29yZEJ1ZmZlciA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy50ZXhDb29yZHMsIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpO1xyXG4gIHRoaXMudGFuZ2VudHNCdWZmZXIgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMudGFuZ2VudHMsICBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTtcclxuICB0aGlzLmluZGV4QnVmZmVyICAgID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLmluZGljZXMsICAgZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGdsLlVOU0lHTkVEX1NIT1JUKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZ2wsIHNoYWRlcikge1xyXG4gIGlmICh0aGlzLmxvYWRlZCkgeyAgXHJcbiAgICBpZiAoIXRoaXMudmVydGV4QnVmZmVyKSB7XHJcbiAgICAgIHRoaXMudXBsb2FkKGdsKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2hhZGVyLnNldEFycnRpYnV0ZShcImFWZXJ0ZXhcIiwgICB0aGlzLnZlcnRleEJ1ZmZlciwgICAzKTtcclxuICAgIHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhTm9ybWFsXCIsICAgdGhpcy5ub3JtYWxCdWZmZXIsICAgMyk7XHJcbiAgICBzaGFkZXIuc2V0QXJydGlidXRlKFwiYVRleENvb3JkXCIsIHRoaXMudGV4Q29vcmRCdWZmZXIsIDIpO1xyXG4gICAgc2hhZGVyLnNldEFycnRpYnV0ZShcImFUYW5nZW50XCIsICB0aGlzLnRhbmdlbnRzQnVmZmVyLCAzKTtcclxuICAgICAgICBcclxuICAgIHRoaXMuaW5kZXhCdWZmZXIuZHJhdyhnbC5UUklBTkdMRVMpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudmVydGV4QnVmZmVyLnJlbGVhc2UoKTsgICBcclxuICBkZWxldGUgdGhpcy52ZXJ0ZXhCdWZmZXI7XHJcbiAgXHJcbiAgdGhpcy5ub3JtYWxCdWZmZXIucmVsZWFzZSgpOyAgIFxyXG4gIGRlbGV0ZSB0aGlzLm5vcm1hbEJ1ZmZlcjsgIFxyXG4gIFxyXG4gIHRoaXMudGV4Q29vcmRCdWZmZXIucmVsZWFzZSgpOyBcclxuICBkZWxldGUgdGhpcy50ZXhDb29yZEJ1ZmZlcjtcclxuICBcclxuICB0aGlzLmluZGV4QnVmZmVyLnJlbGVhc2UoKTtcclxuICBkZWxldGUgdGhpcy5pbmRleEJ1ZmZlcjtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5jb21wdXRlVGFuZ2VudHMgPSBmdW5jdGlvbiAoKSB7ICAgIFxyXG4gIHZhciB2ZXJ0ZXhDb3VudCA9IHRoaXMudmVydGljZXMubGVuZ3RoIC8gMztcclxuICB2YXIgZmFjZUNvdW50ICAgPSB0aGlzLmluZGljZXMubGVuZ3RoIC8gMztcclxuICBcclxuICB2YXIgdGFuMSA9IG5ldyBBcnJheSh2ZXJ0ZXhDb3VudCk7ICAgIFxyXG4gIHZhciB0YW4yID0gbmV3IEFycmF5KHZlcnRleENvdW50KTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZlcnRleENvdW50OyBpKyspIHtcclxuICAgIHRhbjFbaV0gPSBwa3pvLnZlYzMoMCk7XHJcbiAgICB0YW4yW2ldID0gcGt6by52ZWMzKDApO1xyXG4gIH1cclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZhY2VDb3VudDsgaSsrKSB7XHJcbiAgICB2YXIgYSA9IHRoaXMuaW5kaWNlc1tpICogM107XHJcbiAgICB2YXIgYiA9IHRoaXMuaW5kaWNlc1tpICogMyArIDFdO1xyXG4gICAgdmFyIGMgPSB0aGlzLmluZGljZXNbaSAqIDMgKyAyXTtcclxuICAgIFxyXG4gICAgdmFyIHYxID0gdGhpcy5nZXRWZXJ0ZXgoYSk7XHJcbiAgICB2YXIgdjIgPSB0aGlzLmdldFZlcnRleChiKTtcclxuICAgIHZhciB2MyA9IHRoaXMuZ2V0VmVydGV4KGMpO1xyXG4gICAgXHJcbiAgICB2YXIgdzEgPSB0aGlzLmdldFRleENvb3JkKGEpO1xyXG4gICAgdmFyIHcyID0gdGhpcy5nZXRUZXhDb29yZChiKTtcclxuICAgIHZhciB3MyA9IHRoaXMuZ2V0VGV4Q29vcmQoYyk7XHJcbiAgICBcclxuICAgIHZhciB4MSA9IHYyWzBdIC0gdjFbMF07XHJcbiAgICB2YXIgeDIgPSB2M1swXSAtIHYxWzBdO1xyXG4gICAgdmFyIHkxID0gdjJbMV0gLSB2MVsxXTtcclxuICAgIHZhciB5MiA9IHYzWzFdIC0gdjFbMV07XHJcbiAgICB2YXIgejEgPSB2MlsyXSAtIHYxWzJdO1xyXG4gICAgdmFyIHoyID0gdjNbMl0gLSB2MVsyXTtcclxuXHJcbiAgICB2YXIgczEgPSB3MlswXSAtIHcxWzBdO1xyXG4gICAgdmFyIHMyID0gdzNbMF0gLSB3MVswXTtcclxuICAgIHZhciB0MSA9IHcyWzFdIC0gdzFbMV07XHJcbiAgICB2YXIgdDIgPSB3M1sxXSAtIHcxWzFdO1xyXG5cclxuICAgIHZhciByID0gMS4wIC8gKHMxICogdDIgLSBzMiAqIHQxKTtcclxuICAgIHZhciBzZGlyID0gcGt6by52ZWMzKCh0MiAqIHgxIC0gdDEgKiB4MikgKiByLCAgKHQyICogeTEgLSB0MSAqIHkyKSAqIHIsKHQyICogejEgLSB0MSAqIHoyKSAqIHIpO1xyXG4gICAgdmFyIHRkaXIgPSBwa3pvLnZlYzMoKHMxICogeDIgLSBzMiAqIHgxKSAqIHIsIChzMSAqIHkyIC0gczIgKiB5MSkgKiByLCAoczEgKiB6MiAtIHMyICogejEpICogcik7XHJcblxyXG4gICAgdGFuMVthXSA9IHBrem8uYWRkKHRhbjFbYV0sIHNkaXIpO1xyXG4gICAgdGFuMVtiXSA9IHBrem8uYWRkKHRhbjFbYl0sIHNkaXIpO1xyXG4gICAgdGFuMVtjXSA9IHBrem8uYWRkKHRhbjFbY10sIHNkaXIpO1xyXG5cclxuICAgIHRhbjJbYV0gPSBwa3pvLmFkZCh0YW4yW2FdLCB0ZGlyKTtcclxuICAgIHRhbjJbYl0gPSBwa3pvLmFkZCh0YW4yW2JdLCB0ZGlyKTtcclxuICAgIHRhbjJbY10gPSBwa3pvLmFkZCh0YW4yW2NdLCB0ZGlyKTtcclxuICB9XHJcbiAgICBcclxuICB0aGlzLnRhbmdlbnRzID0gW107XHJcbiAgZm9yICh2YXIgaiA9IDA7IGogPCB2ZXJ0ZXhDb3VudDsgaisrKSB7XHJcbiAgICB2YXIgbiA9IHRoaXMuZ2V0Tm9ybWFsKGopO1xyXG4gICAgdmFyIHQgPSB0YW4xW2pdO1xyXG4gICAgXHJcbiAgICB2YXIgdG4gPSBwa3pvLm5vcm1hbGl6ZShwa3pvLnN2bXVsdChwa3pvLnN1Yih0LCBuKSwgcGt6by5kb3QobiwgdCkpKTtcclxuICAgIFxyXG4gICAgaWYgKHBrem8uZG90KHBrem8uY3Jvc3MobiwgdCksIHRhbjJbal0pIDwgMC4wKSB7XHJcbiAgICAgIHRoaXMudGFuZ2VudHMucHVzaCgtdG5bMF0sIC10blsxXSwgLXRuWzJdKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnRhbmdlbnRzLnB1c2godG5bMF0sIHRuWzFdLCB0blsyXSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIlxyXG5wa3pvLk1hdGVyaWFsID0gZnVuY3Rpb24gKG9wdHMpIHtcdFxyXG4gIHRoaXMuY29sb3IgICAgID0gcGt6by52ZWMzKDEsIDEsIDEpO1xyXG4gIHRoaXMucm91Z2huZXNzID0gMTtcclxuICBcclxuICBpZiAob3B0cykge1xyXG4gICAgdGhpcy5yZWFkKG9wdHMpO1xyXG4gIH1cdFxyXG59XHJcblxyXG5wa3pvLk1hdGVyaWFsLmxvYWQgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgdmFyIG1hdGVyaWFsID0gbmV3IHBrem8uTWF0ZXJpYWwoKTtcclxuICBodHRwLmdldCh1cmwsIGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEpIHtcclxuICAgIGlmIChzdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgIG1hdGVyaWFsLnJlYWQoSlNPTi5wYXJzZShkYXRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgbWF0ZXJpYWwgJXMuJywgdXJsKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gbWF0ZXJpYWw7XHJcbn1cclxuXHJcbnBrem8uTWF0ZXJpYWwucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIGlmIChkYXRhLmNvbG9yKSB7XHJcbiAgICB0aGlzLmNvbG9yID0gZGF0YS5jb2xvcjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGRhdGEudGV4dHVyZSkge1xyXG4gICAgLy8gUkVWSUVXOiBzaG91bGQgdGhlIHRleHR1cmVzIG5vdCBiZSByZWxhdGl2ZSB0byB0aGUgY3VycmVudCBmaWxlP1xyXG4gICAgLy8gLT4gVXNlIHNvbWV0aGluZyBsaWtlIFwiYmFzZSBwYXRoXCIgdG8gZml4IHRoYXQsIHRoZW4gdGhlIGxvYWQgZnVuY3Rpb25cclxuICAgIC8vIHdpbGwgZXh0cmFjdCBpdCBhbmQgcGFzcyBpdCBhbGxvbmcuXHJcbiAgICB0aGlzLnRleHR1cmUgPSBwa3pvLlRleHR1cmUubG9hZChkYXRhLnRleHR1cmUpO1xyXG4gIH1cclxuICBcclxuICBpZiAoZGF0YS5yb3VnaG5lc3MpIHtcclxuICAgIHRoaXMucm91Z2huZXNzID0gZGF0YS5yb3VnaG5lc3M7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChkYXRhLnJvdWdobmVzc01hcCkge1xyXG4gICAgdGhpcy5yb3VnaG5lc3NNYXAgPSBwa3pvLlRleHR1cmUubG9hZChkYXRhLnJvdWdobmVzc01hcCk7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChkYXRhLm5vcm1hbE1hcCkge1xyXG4gICAgdGhpcy5ub3JtYWxNYXAgPSBwa3pvLlRleHR1cmUubG9hZChkYXRhLm5vcm1hbE1hcCk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLk1hdGVyaWFsLnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uIChnbCwgc2hhZGVyKSB7XHJcblx0XHJcblx0c2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VDb2xvcicsIHRoaXMuY29sb3IpO1xyXG5cdFxyXG5cdGlmICh0aGlzLnRleHR1cmUgJiYgdGhpcy50ZXh0dXJlLmxvYWRlZCkge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc1RleHR1cmUnLCAxKTtcclxuXHRcdHRoaXMudGV4dHVyZS5iaW5kKGdsLCAwKVxyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndVRleHR1cmUnLCAwKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzVGV4dHVyZScsIDApO1xyXG5cdH1cdFxyXG4gIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtMWYoJ3VSb3VnaG5lc3MnLCB0aGlzLnJvdWdobmVzcyk7XHJcbiAgaWYgKHRoaXMucm91Z2huZXNzTWFwICYmIHRoaXMucm91Z2huZXNzTWFwLmxvYWRlZCkge1xyXG4gICAgc2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc1JvdWdobmVzc01hcCcsIDEpO1xyXG5cdFx0dGhpcy5yb3VnaG5lc3NNYXAuYmluZChnbCwgMSlcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VSb3VnaG5lc3NNYXAnLCAxKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzUm91Z2huZXNzTWFwJywgMCk7XHJcbiAgfVxyXG4gIFxyXG4gIGlmICh0aGlzLm5vcm1hbE1hcCAmJiB0aGlzLm5vcm1hbE1hcC5sb2FkZWQpIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNOb3JtYWxNYXAnLCAxKTtcclxuXHRcdHRoaXMubm9ybWFsTWFwLmJpbmQoZ2wsIDIpXHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1Tm9ybWFsTWFwJywgMik7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc05vcm1hbE1hcCcsIDApO1xyXG5cdH1cdFxyXG59XHJcblxyXG5cclxuIiwiXHJcbnBrem8uRW50aXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudHJhbnNmb3JtID0gcGt6by5tYXQ0KDEpO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKHgsIHksIHopIHtcclxuXHR0aGlzLnRyYW5zZm9ybSA9IHBrem8udHJhbnNsYXRlKHRoaXMudHJhbnNmb3JtLCB4LCB5LCB6KTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSwgeCwgeSwgeikge1xyXG5cdHRoaXMudHJhbnNmb3JtID0gcGt6by5yb3RhdGUodGhpcy50cmFuc2Zvcm0sIGFuZ2xlLCB4LCB5LCB6KTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFhWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVswXSwgdGhpcy50cmFuc2Zvcm1bMV0sIHRoaXMudHJhbnNmb3JtWzJdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFlWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVs0XSwgdGhpcy50cmFuc2Zvcm1bNV0sIHRoaXMudHJhbnNmb3JtWzZdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFpWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVs4XSwgdGhpcy50cmFuc2Zvcm1bOV0sIHRoaXMudHJhbnNmb3JtWzEwXSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzEyXSwgdGhpcy50cmFuc2Zvcm1bMTNdLCB0aGlzLnRyYW5zZm9ybVsxNF0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICB0aGlzLnRyYW5zZm9ybVsxMl0gPSB2YWx1ZVswXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxM10gPSB2YWx1ZVsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxNF0gPSB2YWx1ZVsyXTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uICh0YXJnZXQsIHVwKSB7XHJcbiAgdmFyIHBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbigpO1xyXG4gIHZhciBmb3J3YXJkICA9IHBrem8ubm9ybWFsaXplKHBrem8uc3ViKHRhcmdldCwgcG9zaXRpb24pKTtcclxuICB2YXIgcmlnaHQgICAgPSBwa3pvLm5vcm1hbGl6ZShwa3pvLmNyb3NzKGZvcndhcmQsIHVwKSk7XHJcbiAgdmFyIHVwbiAgICAgID0gcGt6by5ub3JtYWxpemUocGt6by5jcm9zcyhyaWdodCwgZm9yd2FyZCkpO1xyXG4gIFxyXG4gIC8vIFRPRE8gc2NhbGluZ1xyXG4gIHRoaXMudHJhbnNmb3JtWzBdID0gcmlnaHRbMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMV0gPSByaWdodFsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsyXSA9IHJpZ2h0WzJdO1xyXG4gIFxyXG4gIHRoaXMudHJhbnNmb3JtWzRdID0gdXBuWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzVdID0gdXBuWzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzZdID0gdXBuWzJdO1xyXG4gIFxyXG4gIHRoaXMudHJhbnNmb3JtWzhdID0gZm9yd2FyZFswXTtcclxuICB0aGlzLnRyYW5zZm9ybVs5XSA9IGZvcndhcmRbMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMTBdID0gZm9yd2FyZFsyXTtcclxufVxyXG4iLCJcclxucGt6by5DYW1lcmEgPSBmdW5jdGlvbiAob3B0KSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuICBcclxuICB2YXIgbyA9IG9wdCA/IG9wdCA6IHt9O1xyXG4gIFxyXG4gIHRoaXMueWZvdiAgPSBvLnlmb3YgID8gby55Zm92ICA6ICA0NS4wO1xyXG4gIHRoaXMuem5lYXIgPSBvLnpuZWFyID8gby56bmVhciA6ICAgMC4xO1xyXG4gIHRoaXMuemZhciAgPSBvLnpmYXIgID8gby56ZmFyICA6IDEwMC4wO1xyXG59XHJcblxyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uQ2FtZXJhLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uQ2FtZXJhO1xyXG5cclxucGt6by5DYW1lcmEucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuICB2YXIgYXNwZWN0ID0gcmVuZGVyZXIuY2FudmFzLmdsLndpZHRoIC8gcmVuZGVyZXIuY2FudmFzLmdsLmhlaWdodDtcclxuICBcclxuICB2YXIgcHJvamVjdGlvbk1hdHJpeCA9IHBrem8ucGVyc3BlY3RpdmUodGhpcy55Zm92LCBhc3BlY3QsIHRoaXMuem5lYXIsIHRoaXMuemZhcik7XHJcbiAgXHJcbiAgdmFyIHAgPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcbiAgdmFyIHggPSB0aGlzLmdldFhWZWN0b3IoKTtcclxuICB2YXIgeSA9IHRoaXMuZ2V0WVZlY3RvcigpO1xyXG4gIHZhciB6ID0gdGhpcy5nZXRaVmVjdG9yKCk7XHJcbiAgXHJcbiAgdmFyIHZpZXdNYXRyaXggPSBwa3pvLm1hdDQoW3hbMF0sIHhbMV0sIHhbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlbMF0sIHlbMV0sIHlbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpbMF0sIHpbMV0sIHpbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsICAgIDAsICAgIDAsIDFdKTtcclxuICB2aWV3TWF0cml4ID0gcGt6by50cmFuc3Bvc2Uodmlld01hdHJpeCk7IC8vIHVzZSBpbnZlcnNlXHJcbiAgdmlld01hdHJpeCA9IHBrem8udHJhbnNsYXRlKHZpZXdNYXRyaXgsIC1wWzBdLCAtcFsxXSwgLXBbMl0pOyAgXHJcbiAgXHJcbiAgcmVuZGVyZXIuc2V0Q2FtZXJhKHByb2plY3Rpb25NYXRyaXgsIHZpZXdNYXRyaXgpO1xyXG59XHJcbiIsIlxyXG5wa3pvLk9iamVjdCA9IGZ1bmN0aW9uIChtZXNoLCBtYXRlcmlhbCkge1xyXG4gIHBrem8uRW50aXR5LmNhbGwodGhpcyk7XHJcbiAgXHJcbiAgdGhpcy5tZXNoICAgICA9IG1lc2g7XHJcbiAgdGhpcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG59XHJcblxyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uT2JqZWN0O1xyXG5cclxucGt6by5PYmplY3QucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuXHQvLyB0b2RvIHJlc3BlY3QgcGFyZW50IHRyYW5zZm9ybVxyXG5cdHJlbmRlcmVyLmFkZE1lc2godGhpcy50cmFuc2Zvcm0sIHRoaXMubWF0ZXJpYWwsIHRoaXMubWVzaCk7XHJcbn1cclxuXHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGdsLCBzaGFkZXIsIHBhcmVudE1vZGVsVmlld01hdHJpeCkgeyBcclxuICBcclxuICB2YXIgbW9kZWxWaWV3TWF0cml4ID0gcGt6by5tdWx0TWF0cml4KHBhcmVudE1vZGVsVmlld01hdHJpeCwgdGhpcy50cmFuc2Zvcm0pO1xyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxWaWV3TWF0cml4JywgbW9kZWxWaWV3TWF0cml4KTtcclxuXHRzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndU1vZGVsTWF0cml4JywgdGhpcy50cmFuc2Zvcm0pO1xyXG4gIFxyXG4gIHRoaXMubWF0ZXJpYWwuc2V0dXAoZ2wsIHNoYWRlcik7XHJcbiAgdGhpcy5tZXNoLmRyYXcoZ2wsIHNoYWRlcik7XHJcbn1cclxuXHJcbiIsIlxyXG5wa3pvLkRpcmVjdGlvbmFsTGlnaHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gcGt6by52ZWMzKDAuNSwgMC41LCAwLjUpO1xyXG59XHJcblxyXG5wa3pvLkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5EaXJlY3Rpb25hbExpZ2h0O1xyXG5cclxucGt6by5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcblx0dmFyIGRpciA9IHBrem8ubmVnKHRoaXMuZ2V0WlZlY3RvcigpKTtcclxuXHRyZW5kZXJlci5hZGREaXJlY3Rpb25hbExpZ2h0KGRpciwgdGhpcy5jb2xvcik7XHJcbn1cclxuIiwiXHJcbnBrem8uUG9pbnRMaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBwa3pvLnZlYzMoMC41LCAwLjUsIDAuNSk7XHJcbiAgdGhpcy5yYW5nZSA9IDEwLjA7XHJcbn1cclxuXHJcbnBrem8uUG9pbnRMaWdodC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uUG9pbnRMaWdodC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLlBvaW50TGlnaHQ7XHJcblxyXG5wa3pvLlBvaW50TGlnaHQucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuXHRyZW5kZXJlci5hZGRQb2ludExpZ2h0KHRoaXMuZ2V0UG9zaXRpb24oKSwgdGhpcy5jb2xvciwgdGhpcy5yYW5nZSk7XHJcbn1cclxuIiwiXHJcbnBrem8uU3BvdExpZ2h0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHBrem8uRW50aXR5LmNhbGwodGhpcyk7XHJcblx0XHJcblx0dGhpcy5jb2xvciAgPSBwa3pvLnZlYzMoMC41LCAwLjUsIDAuNSk7XHJcbiAgdGhpcy5yYW5nZSAgPSAxMC4wO1xyXG4gIHRoaXMuY3V0b2ZmID0gMjUuMDtcclxufVxyXG5cclxucGt6by5TcG90TGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLlNwb3RMaWdodC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLlNwb3RMaWdodDtcclxuXHJcbnBrem8uU3BvdExpZ2h0LnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcbiAgdmFyIGRpciA9IHBrem8ubmVnKHRoaXMuZ2V0WlZlY3RvcigpKTtcclxuXHRyZW5kZXJlci5hZGRTcG90TGlnaHQodGhpcy5nZXRQb3NpdGlvbigpLCBkaXIsIHRoaXMuY29sb3IsIHRoaXMucmFuZ2UsIHRoaXMuY3V0b2ZmKTtcclxufVxyXG4iLCJcclxucGt6by5Ta3lCb3ggPSBmdW5jdGlvbiAoY3ViZU1hcCkge1xyXG4gIHBrem8uRW50aXR5LmNhbGwodGhpcyk7XHJcbiAgXHJcbiAgdGhpcy5jdWJlTWFwID0gY3ViZU1hcDtcclxufVxyXG5cclxucGt6by5Ta3lCb3gucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLlNreUJveC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLlNreUJveDtcclxuXHJcbnBrem8uU2t5Qm94LnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcbiAgcmVuZGVyZXIuYWRkU2t5Qm94KHRoaXMuY3ViZU1hcCk7XHJcbn1cclxuXHJcbiIsIlxyXG5wa3pvLlJlbmRlcmVyID0gZnVuY3Rpb24gKGNhbnZhcykge1xyXG4gIHRoaXMuY2FudmFzID0gbmV3IHBrem8uQ2FudmFzKGNhbnZhcyk7XHJcbiAgXHJcbiAgdmFyIHJlbmRlcmVyID0gdGhpcztcclxuICBcclxuICB0aGlzLmNhbnZhcy5pbml0KGZ1bmN0aW9uIChnbCkge1xyXG4gICAgcmVuZGVyZXIuc3lrQm94U2hhZGVyICA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5JbnZlcnNlICsgcGt6by5UcmFuc3Bvc2UgKyBwa3pvLlNreUJveFZlcnQsIHBrem8uU2t5Qm94RnJhZyk7XHJcbiAgICByZW5kZXJlci5hbWJpZW50U2hhZGVyID0gbmV3IHBrem8uU2hhZGVyKGdsLCBwa3pvLlNvbGlkVmVydCwgcGt6by5BbWJpZW50RnJhZyk7XHJcbiAgICByZW5kZXJlci5saWdodFNoYWRlciAgID0gbmV3IHBrem8uU2hhZGVyKGdsLCBwa3pvLlNvbGlkVmVydCwgcGt6by5MaWdodEZyYWcpOyAgIFxyXG5cclxuICAgIHJlbmRlcmVyLnNjcmVlblBsYW5lICAgPSBwa3pvLk1lc2gucGxhbmUoMiwgMik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLnNldENhbWVyYSA9IGZ1bmN0aW9uIChwcm9qZWN0aW9uTWF0cml4LCB2aWV3TWF0cml4KSB7XHJcbiAgdGhpcy5wcm9qZWN0aW9uTWF0cml4ID0gcHJvamVjdGlvbk1hdHJpeDtcclxuICB0aGlzLnZpZXdNYXRyaXggICAgICAgPSB2aWV3TWF0cml4O1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5hZGRNZXNoID0gZnVuY3Rpb24gKHRyYW5zZm9ybSwgbWF0ZXJpYWwsIG1lc2gpIHtcclxuICB0aGlzLnNvbGlkcy5wdXNoKHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtLFxyXG4gICAgbWF0ZXJpYWw6IG1hdGVyaWFsLCBcclxuICAgIG1lc2g6IG1lc2hcclxuICB9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkU2t5Qm94ID0gZnVuY3Rpb24gKGN1YmVNYXApIHtcclxuICB0aGlzLnNreUJveCA9IGN1YmVNYXA7XHJcbn1cclxuXHJcbnBrem8uRElSRUNUSU9OQUxfTElHSFQgPSAxO1xyXG5wa3pvLlBPSU5UX0xJR0hUICAgICAgID0gMjtcclxucGt6by5TUE9UX0xJR0hUICAgICAgICA9IDM7XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5hZGREaXJlY3Rpb25hbExpZ2h0ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgY29sb3IpIHtcclxuICB0aGlzLmxpZ2h0cy5wdXNoKHtcclxuICAgIHR5cGU6IHBrem8uRElSRUNUSU9OQUxfTElHSFQsXHJcbiAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgIGNvbG9yOiBjb2xvclxyXG4gIH0pO1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5hZGRQb2ludExpZ2h0ID0gZnVuY3Rpb24gKHBvc2l0aW9uLCBjb2xvciwgcmFuZ2UpIHtcclxuICB0aGlzLmxpZ2h0cy5wdXNoKHtcclxuICAgIHR5cGU6IHBrem8uUE9JTlRfTElHSFQsXHJcbiAgICBwb3NpdGlvbjogcG9zaXRpb24sXHJcbiAgICBjb2xvcjogY29sb3IsXHJcbiAgICByYW5nZTogcmFuZ2VcclxuICB9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkU3BvdExpZ2h0ID0gZnVuY3Rpb24gKHBvc2l0aW9uLCBkaXJlY3Rpb24sIGNvbG9yLCByYW5nZSwgY3V0b2ZmKSB7XHJcbiAgdGhpcy5saWdodHMucHVzaCh7XHJcbiAgICB0eXBlOiBwa3pvLlNQT1RfTElHSFQsXHJcbiAgICBwb3NpdGlvbjogcG9zaXRpb24sXHJcbiAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgIGNvbG9yOiBjb2xvcixcclxuICAgIHJhbmdlOiByYW5nZSxcclxuICAgIGN1dG9mZjogY3V0b2ZmXHJcbiAgfSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmRyYXdTa3lCb3ggPSBmdW5jdGlvbiAoZ2wpIHtcclxuICBpZiAodGhpcy5za3lCb3gpIHtcclxuICAgIHZhciBzaGFkZXIgPSB0aGlzLnN5a0JveFNoYWRlcjtcclxuICAgIFxyXG4gICAgc2hhZGVyLmJpbmQoKTtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1UHJvamVjdGlvbk1hdHJpeCcsIHRoaXMucHJvamVjdGlvbk1hdHJpeCk7ICAgXHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVZpZXdNYXRyaXgnLCAgICAgICB0aGlzLnZpZXdNYXRyaXgpO1xyXG4gICAgXHJcbiAgICB0aGlzLnNreUJveC5iaW5kKGdsLCAwKTtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VDdWJlbWFwJywgMCk7XHJcbiAgICBcclxuICAgIHRoaXMuc2NyZWVuUGxhbmUuZHJhdyhnbCwgc2hhZGVyKTsgICAgXHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5kcmF3U29saWRzID0gZnVuY3Rpb24gKGdsLCBzaGFkZXIpIHtcclxuICB0aGlzLnNvbGlkcy5mb3JFYWNoKGZ1bmN0aW9uIChzb2xpZCkge1xyXG4gICAgdmFyIG5vcm0gPSBwa3pvLm11bHRNYXRyaXgocGt6by5tYXQzKHRoaXMudmlld01hdHJpeCksIHBrem8ubWF0Myhzb2xpZC50cmFuc2Zvcm0pKTtcclxuICAgICAgICBcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxNYXRyaXgnLCBzb2xpZC50cmFuc2Zvcm0pO1xyXG4gICAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXgzZnYoJ3VOb3JtYWxNYXRyaXgnLCBub3JtKTtcclxuICAgIFxyXG4gICAgc29saWQubWF0ZXJpYWwuc2V0dXAoZ2wsIHNoYWRlcik7ICAgICBcclxuICAgIHNvbGlkLm1lc2guZHJhdyhnbCwgc2hhZGVyKTtcclxuICB9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYW1iaWVudFBhc3MgPSBmdW5jdGlvbiAoZ2wsIGFtYmllbnRMaWdodCkge1xyXG4gIHZhciBzaGFkZXIgPSB0aGlzLmFtYmllbnRTaGFkZXI7ICAgIFxyXG4gIHNoYWRlci5iaW5kKCk7XHJcbiAgXHJcbiAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VQcm9qZWN0aW9uTWF0cml4JywgdGhpcy5wcm9qZWN0aW9uTWF0cml4KTsgICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVZpZXdNYXRyaXgnLCAgICAgICB0aGlzLnZpZXdNYXRyaXgpOyAgIFxyXG4gIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1QW1iaWVudExpZ2h0JywgYW1iaWVudExpZ2h0KTsgICAgXHJcbiAgICBcclxuICB0aGlzLmRyYXdTb2xpZHMoZ2wsIHNoYWRlcik7ICBcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUubGlnaHRQYXNzID0gZnVuY3Rpb24gKGdsLCBsaWdodCkge1xyXG4gIHZhciBzaGFkZXIgPSB0aGlzLmxpZ2h0U2hhZGVyOyAgICBcclxuICBzaGFkZXIuYmluZCgpO1xyXG4gIFxyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1UHJvamVjdGlvbk1hdHJpeCcsIHRoaXMucHJvamVjdGlvbk1hdHJpeCk7ICAgXHJcbiAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VWaWV3TWF0cml4JywgICAgICAgdGhpcy52aWV3TWF0cml4KTsgICBcclxuICBcclxuICBzaGFkZXIuc2V0VW5pZm9ybTFpKCd1TGlnaHRUeXBlJywgbGlnaHQudHlwZSk7XHJcbiAgaWYgKGxpZ2h0LmRpcmVjdGlvbikge1xyXG4gICAgc2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VMaWdodERpcmVjdGlvbicsIGxpZ2h0LmRpcmVjdGlvbik7XHJcbiAgfSAgXHJcbiAgaWYgKGxpZ2h0LnBvc2l0aW9uKSB7XHJcbiAgICBzaGFkZXIuc2V0VW5pZm9ybTNmdigndUxpZ2h0UG9zaXRpb24nLCBsaWdodC5wb3NpdGlvbik7XHJcbiAgfVxyXG4gIGlmIChsaWdodC5yYW5nZSkge1xyXG4gICAgc2hhZGVyLnNldFVuaWZvcm0xZigndUxpZ2h0UmFuZ2UnLCBsaWdodC5yYW5nZSk7XHJcbiAgfVxyXG4gIGlmIChsaWdodC5jdXRvZmYpIHtcclxuICAgIHNoYWRlci5zZXRVbmlmb3JtMWYoJ3VMaWdodEN1dG9mZicsIGxpZ2h0LmN1dG9mZik7XHJcbiAgfVxyXG4gIHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1TGlnaHRDb2xvcicsIGxpZ2h0LmNvbG9yKTtcclxuICBcclxuICB0aGlzLmRyYXdTb2xpZHMoZ2wsIHNoYWRlcik7ICBcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHNjZW5lKSB7XHJcbiAgdmFyIHJlbmRlcmVyID0gdGhpcztcclxuICBcclxuICB0aGlzLnNvbGlkcyA9IFtdO1xyXG4gIHRoaXMubGlnaHRzID0gW107XHJcbiAgdGhpcy5za3lCb3ggPSBudWxsO1xyXG4gIHNjZW5lLmVucXVldWUodGhpcyk7XHJcbiAgXHJcbiAgdGhpcy5jYW52YXMuZHJhdyhmdW5jdGlvbiAoZ2wpIHtcclxuICAgIFxyXG4gICAgZ2wuZGlzYWJsZShnbC5CTEVORCk7XHJcbiAgICBnbC5kZXB0aE1hc2soZmFsc2UpO1xyXG4gICAgZ2wuZGlzYWJsZShnbC5ERVBUSF9URVNUKTtcclxuICAgIHJlbmRlcmVyLmRyYXdTa3lCb3goZ2wpO1xyXG4gICAgXHJcbiAgICBnbC5kZXB0aE1hc2sodHJ1ZSk7XHJcbiAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcbiAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcclxuICAgIHJlbmRlcmVyLmFtYmllbnRQYXNzKGdsLCBzY2VuZS5hbWJpZW50TGlnaHQpO1xyXG4gICAgXHJcbiAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xyXG4gICAgZ2wuYmxlbmRGdW5jKGdsLk9ORSwgZ2wuT05FKTtcclxuICAgIFxyXG4gICAgcmVuZGVyZXIubGlnaHRzLmZvckVhY2goZnVuY3Rpb24gKGxpZ2h0KSB7XHJcbiAgICAgIHJlbmRlcmVyLmxpZ2h0UGFzcyhnbCwgbGlnaHQpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9