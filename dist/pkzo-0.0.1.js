
var pkzo = {version: '0.0.1'};

pkzo.AmbientFrag = "precision mediump float;\n\n\n\nuniform vec3      uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool      uHasTexture;\n\n\n\nuniform vec3 uAmbientLight;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    vec3 color = uColor;\n\n    \n\n    if (uHasTexture) {\n\n        color = color * texture2D(uTexture, vTexCoord).rgb;\n\n    }\n\n    \n\n    gl_FragColor = vec4(color * uAmbientLight, 1);\n\n}\n\n";
pkzo.LightFrag = "precision mediump float;\n\n\n\nuniform vec3      uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool      uHasTexture;\n\n\n\nuniform int   uLightType; // 1: directional, 2: point, 3: spot\n\nuniform vec3  uLightColor;\n\nuniform vec3  uLightDirection;\n\nuniform vec3  uLightPosition;\n\nuniform float uLightRange;\n\nuniform float uLightCutoff;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\nvarying vec3 vPosition;\n\n\n\nvoid main() {\n\n    vec3 color = uColor;    \n\n    if (uHasTexture) {\n\n        color = color * texture2D(uTexture, vTexCoord).rgb;\n\n    }\n\n    \n\n    vec3 normal = normalize(vNormal);\n\n    \n\n    vec3 lightDirection;\n\n    float atten;\n\n    if (uLightType == 1) {\n\n        lightDirection = normalize(-uLightDirection);\n\n        atten = 1.0;\n\n    }\n\n    if (uLightType == 2) {\n\n        lightDirection = uLightPosition - vPosition;\n\n        float dist = length(lightDirection);\n\n        if (dist > uLightRange) {\n\n            discard;\n\n        }\n\n        lightDirection = normalize(lightDirection);\n\n        atten = 1.0 - (dist / uLightRange);    \n\n    }\n\n    if (uLightType == 3) {\n\n        lightDirection = uLightPosition - vPosition;\n\n        float dist = length(lightDirection);\n\n        if (dist > uLightRange) {\n\n            discard;\n\n        }\n\n        lightDirection = normalize(lightDirection);\n\n        atten = 1.0 - (dist / uLightRange);    \n\n        \n\n        if (dot(lightDirection, -uLightDirection) < uLightCutoff) {\n\n            discard;\n\n        }  \n\n    }\n\n    \n\n    vec3 result = vec3(0);    \n\n    float nDotL = dot(normal, lightDirection);\n\n    if (nDotL > 0.0) {    \n\n        result += nDotL * color * uLightColor * atten;\n\n    }\n\n        \n\n    gl_FragColor = vec4(result, 1);\n\n}                           \n\n";
pkzo.SolidFrag = "precision mediump float;\n\n\n\nuniform vec3 uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool uHasTexture;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    if (uHasTexture) {\n\n        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(uColor, 1);\n\n    }\n\n    else {\n\n        gl_FragColor = vec4(uColor, 1);\n\n    }\n\n}";
pkzo.SolidVert = "\n\nuniform mat4 uProjectionMatrix;\n\nuniform mat4 uViewMatrix;\n\nuniform mat4 uModelMatrix;\n\nuniform mat3 uNormalMatrix;\n\n\n\nattribute vec3 aVertex;\n\nattribute vec3 aNormal;\n\nattribute vec2 aTexCoord;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\nvarying vec3 vPosition;\n\n\n\nvoid main() {\n\n  vNormal     = uNormalMatrix * aNormal;\n\n  vTexCoord   = aTexCoord;\n\n  vPosition   = vec3(uModelMatrix * vec4(aVertex, 1.0));\n\n  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertex, 1);\n\n}";


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

pkzo.multVectorScalar = function (v, s) {
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
  return pkzo.multVectorScalar(v, 1 / pkzo.length(v));
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
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
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




pkzo.Mesh = function () {}

pkzo.Mesh.plane = function (width, height, wres, hres) {
	var mesh = new pkzo.Mesh();
	
	var w2 = width / 2.0;
	var h2 = height / 2.0;
	var ws = width / wres;
	var hs = height / hres;
	var ts = 1.0 / wres;
	var ss = 1.0 / hres;
	
	for (var i = 0; i <= wres; i++) {
		for (var j = 0; j <= hres; j++) {
			var x = -w2 + i * ws; 
			var y = -h2 + j * hs;
			var t = i * ts;
			var s = j * ss;
			mesh.addVertex(pkzo.vec3(x, y, 0), pkzo.vec3(0, 0, 1), pkzo.vec2(t, s));						
		}
	}
	
	for (var i = 0; i < wres; i++) {
		for (var j = 0; j < hres; j++) {
			var a = (i + 0) * wres + (j + 0);
			var b = (i + 0) * wres + (j + 1);
			var c = (i + 1) * wres + (j + 1);
			var d = (i + 1) * wres + (j + 0);
			mesh.addTriangle(a, b, c);
			mesh.addTriangle(c, d, b);
		}
	}
	
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

	return mesh;
}

pkzo.Mesh.load = function (file) {
	// something something xhr
	var mesh = new pkzo.Mesh();
	
	return mesh;
}

pkzo.Mesh.prototype.addVertex = function (vertex, normal, texCoord) {
	if (this.vertices) {
		this.vertices.push([vertex[0], vertex[1], vertex[2]]);
	}
	else {
		this.vertices = [vertex[0], vertex[1], vertex[2]];
	}
	
	if (this.normals) {
		this.normals.push([normal[0], normal[1], normal[2]]);
	}
	else {
		this.normals = [normal[0], normal[1], normal[2]];
	}
	
	if (this.texCoords) {
		this.texCoords.push([texCoord[0], texCoord[1], texCoord[2]]);
	}
	else {
		this.texCoords = [texCoord[0], texCoord[1], texCoord[2]];
	}
}

pkzo.Mesh.prototype.addTriangle = function (a, b, c) {
	if (this.indices) {
		this.indices.push([a, b, c]);
	}
	else {
		this.indices = [a, b, c];
	}
}

pkzo.Mesh.prototype.upload = function (gl) {
	this.vertexBuffer   = new pkzo.Buffer(gl, this.vertices,  gl.ARRAY_BUFFER, gl.FLOAT);
	this.normalBuffer   = new pkzo.Buffer(gl, this.normals,   gl.ARRAY_BUFFER, gl.FLOAT);      
	this.texCoordBuffer = new pkzo.Buffer(gl, this.texCoords, gl.ARRAY_BUFFER, gl.FLOAT);      
	this.indexBuffer    = new pkzo.Buffer(gl, this.indices,   gl.ELEMENT_ARRAY_BUFFER, gl.UNSIGNED_SHORT);
}

pkzo.Mesh.prototype.draw = function(gl, shader) {
	if (!this.vertexBuffer) {
		this.upload(gl);
	}
	
	shader.setArrtibute("aVertex",   this.vertexBuffer,   3);
  shader.setArrtibute("aNormal",   this.normalBuffer,   3);
  shader.setArrtibute("aTexCoord", this.texCoordBuffer, 2);
      
  this.indexBuffer.draw(gl.TRIANGLES);
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


pkzo.Material = function (opts) {	
	if (opts.color) {
		this.color = opts.color;
	}
	else {
		this.color = pkzo.vec3(1, 1, 1);
	}	
	if (opts.texture) {
		this.texture = opts.texture;
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
	
}


pkzo.Entity = function () {
  this.transform = pkzo.mat4(1);
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


pkzo.Renderer = function (canvas) {
	this.canvas = new pkzo.Canvas(canvas);
	
	var renderer = this;
	
	this.canvas.init(function (gl) {
		renderer.solidShader	 = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.SolidFrag);
		renderer.ambientShader = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.AmbientFrag);
		renderer.lightShader	 = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.LightFrag);
	});
}

pkzo.Renderer.prototype.setCamera = function (projectionMatrix, viewMatrix) {
	this.projectionMatrix = projectionMatrix;
	this.viewMatrix				= viewMatrix;
}

pkzo.Renderer.prototype.addMesh = function (transform, material, mesh) {
	this.solids.push({
		transform: transform,
		material: material, 
		mesh: mesh
	});
}

pkzo.DIRECTIONAL_LIGHT = 1;
pkzo.POINT_LIGHT			 = 2;
pkzo.SPOT_LIGHT			   = 3;

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
	shader.setUniformMatrix4fv('uViewMatrix',				this.viewMatrix);		
	
	shader.setUniform3fv('uAmbientLight', ambientLight);		
		
	this.drawSolids(gl, shader);	
}

pkzo.Renderer.prototype.lightPass = function (gl, light) {
	var shader = this.lightShader;		
	shader.bind();
	
	shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);		
	shader.setUniformMatrix4fv('uViewMatrix',				this.viewMatrix);		
	
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
	scene.enqueue(this);
	
	this.canvas.draw(function (gl) {
		
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.disable(gl.BLEND);
		
		renderer.ambientPass(gl, scene.ambientLight);
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE);
		
		renderer.lights.forEach(function (light) {
			renderer.lightPass(gl, light);
		});
	});
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBrem8uanMiLCJzaGFkZXJzLmpzIiwidmVjdG9yLmpzIiwibWF0cml4LmpzIiwiQ2FudmFzLmpzIiwiVGV4dHVyZS5qcyIsIlNoYWRlci5qcyIsIlNjZW5lLmpzIiwiQnVmZmVyLmpzIiwiTWVzaC5qcyIsIk1hdGVyaWFsLmpzIiwiRW50aXR5LmpzIiwiQ2FtZXJhLmpzIiwiT2JqZWN0LmpzIiwiRGlyZWN0aW9uYWxMaWdodC5qcyIsIlBvaW50TGlnaHQuanMiLCJTcG90TGlnaHQuanMiLCJSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicGt6by0wLjAuMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgcGt6byA9IHt2ZXJzaW9uOiAnMC4wLjEnfTtcclxuIiwicGt6by5BbWJpZW50RnJhZyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzICAgICAgdUNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlO1xcblxcbnVuaWZvcm0gYm9vbCAgICAgIHVIYXNUZXh0dXJlO1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyB1QW1iaWVudExpZ2h0O1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxuXFxuXFxudm9pZCBtYWluKClcXG5cXG57XFxuXFxuICAgIHZlYzMgY29sb3IgPSB1Q29sb3I7XFxuXFxuICAgIFxcblxcbiAgICBpZiAodUhhc1RleHR1cmUpIHtcXG5cXG4gICAgICAgIGNvbG9yID0gY29sb3IgKiB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkucmdiO1xcblxcbiAgICB9XFxuXFxuICAgIFxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yICogdUFtYmllbnRMaWdodCwgMSk7XFxuXFxufVxcblxcblwiO1xucGt6by5MaWdodEZyYWcgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyAgICAgIHVDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZTtcXG5cXG51bmlmb3JtIGJvb2wgICAgICB1SGFzVGV4dHVyZTtcXG5cXG5cXG5cXG51bmlmb3JtIGludCAgIHVMaWdodFR5cGU7IC8vIDE6IGRpcmVjdGlvbmFsLCAyOiBwb2ludCwgMzogc3BvdFxcblxcbnVuaWZvcm0gdmVjMyAgdUxpZ2h0Q29sb3I7XFxuXFxudW5pZm9ybSB2ZWMzICB1TGlnaHREaXJlY3Rpb247XFxuXFxudW5pZm9ybSB2ZWMzICB1TGlnaHRQb3NpdGlvbjtcXG5cXG51bmlmb3JtIGZsb2F0IHVMaWdodFJhbmdlO1xcblxcbnVuaWZvcm0gZmxvYXQgdUxpZ2h0Q3V0b2ZmO1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxudmFyeWluZyB2ZWMzIHZQb3NpdGlvbjtcXG5cXG5cXG5cXG52b2lkIG1haW4oKSB7XFxuXFxuICAgIHZlYzMgY29sb3IgPSB1Q29sb3I7ICAgIFxcblxcbiAgICBpZiAodUhhc1RleHR1cmUpIHtcXG5cXG4gICAgICAgIGNvbG9yID0gY29sb3IgKiB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkucmdiO1xcblxcbiAgICB9XFxuXFxuICAgIFxcblxcbiAgICB2ZWMzIG5vcm1hbCA9IG5vcm1hbGl6ZSh2Tm9ybWFsKTtcXG5cXG4gICAgXFxuXFxuICAgIHZlYzMgbGlnaHREaXJlY3Rpb247XFxuXFxuICAgIGZsb2F0IGF0dGVuO1xcblxcbiAgICBpZiAodUxpZ2h0VHlwZSA9PSAxKSB7XFxuXFxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IG5vcm1hbGl6ZSgtdUxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgICAgIGF0dGVuID0gMS4wO1xcblxcbiAgICB9XFxuXFxuICAgIGlmICh1TGlnaHRUeXBlID09IDIpIHtcXG5cXG4gICAgICAgIGxpZ2h0RGlyZWN0aW9uID0gdUxpZ2h0UG9zaXRpb24gLSB2UG9zaXRpb247XFxuXFxuICAgICAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGxpZ2h0RGlyZWN0aW9uKTtcXG5cXG4gICAgICAgIGlmIChkaXN0ID4gdUxpZ2h0UmFuZ2UpIHtcXG5cXG4gICAgICAgICAgICBkaXNjYXJkO1xcblxcbiAgICAgICAgfVxcblxcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSBub3JtYWxpemUobGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgYXR0ZW4gPSAxLjAgLSAoZGlzdCAvIHVMaWdodFJhbmdlKTsgICAgXFxuXFxuICAgIH1cXG5cXG4gICAgaWYgKHVMaWdodFR5cGUgPT0gMykge1xcblxcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSB1TGlnaHRQb3NpdGlvbiAtIHZQb3NpdGlvbjtcXG5cXG4gICAgICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgobGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgaWYgKGRpc3QgPiB1TGlnaHRSYW5nZSkge1xcblxcbiAgICAgICAgICAgIGRpc2NhcmQ7XFxuXFxuICAgICAgICB9XFxuXFxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IG5vcm1hbGl6ZShsaWdodERpcmVjdGlvbik7XFxuXFxuICAgICAgICBhdHRlbiA9IDEuMCAtIChkaXN0IC8gdUxpZ2h0UmFuZ2UpOyAgICBcXG5cXG4gICAgICAgIFxcblxcbiAgICAgICAgaWYgKGRvdChsaWdodERpcmVjdGlvbiwgLXVMaWdodERpcmVjdGlvbikgPCB1TGlnaHRDdXRvZmYpIHtcXG5cXG4gICAgICAgICAgICBkaXNjYXJkO1xcblxcbiAgICAgICAgfSAgXFxuXFxuICAgIH1cXG5cXG4gICAgXFxuXFxuICAgIHZlYzMgcmVzdWx0ID0gdmVjMygwKTsgICAgXFxuXFxuICAgIGZsb2F0IG5Eb3RMID0gZG90KG5vcm1hbCwgbGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICBpZiAobkRvdEwgPiAwLjApIHsgICAgXFxuXFxuICAgICAgICByZXN1bHQgKz0gbkRvdEwgKiBjb2xvciAqIHVMaWdodENvbG9yICogYXR0ZW47XFxuXFxuICAgIH1cXG5cXG4gICAgICAgIFxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHJlc3VsdCwgMSk7XFxuXFxufSAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcblxcblwiO1xucGt6by5Tb2xpZEZyYWcgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcblxcblxcbnVuaWZvcm0gdmVjMyB1Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmU7XFxuXFxudW5pZm9ybSBib29sIHVIYXNUZXh0dXJlO1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxuXFxuXFxudm9pZCBtYWluKClcXG5cXG57XFxuXFxuICAgIGlmICh1SGFzVGV4dHVyZSkge1xcblxcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlLCB2VGV4Q29vcmQpICogdmVjNCh1Q29sb3IsIDEpO1xcblxcbiAgICB9XFxuXFxuICAgIGVsc2Uge1xcblxcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh1Q29sb3IsIDEpO1xcblxcbiAgICB9XFxuXFxufVwiO1xucGt6by5Tb2xpZFZlcnQgPSBcIlxcblxcbnVuaWZvcm0gbWF0NCB1UHJvamVjdGlvbk1hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDQgdVZpZXdNYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQ0IHVNb2RlbE1hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDMgdU5vcm1hbE1hdHJpeDtcXG5cXG5cXG5cXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4O1xcblxcbmF0dHJpYnV0ZSB2ZWMzIGFOb3JtYWw7XFxuXFxuYXR0cmlidXRlIHZlYzIgYVRleENvb3JkO1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxudmFyeWluZyB2ZWMzIHZQb3NpdGlvbjtcXG5cXG5cXG5cXG52b2lkIG1haW4oKSB7XFxuXFxuICB2Tm9ybWFsICAgICA9IHVOb3JtYWxNYXRyaXggKiBhTm9ybWFsO1xcblxcbiAgdlRleENvb3JkICAgPSBhVGV4Q29vcmQ7XFxuXFxuICB2UG9zaXRpb24gICA9IHZlYzModU1vZGVsTWF0cml4ICogdmVjNChhVmVydGV4LCAxLjApKTtcXG5cXG4gIGdsX1Bvc2l0aW9uID0gdVByb2plY3Rpb25NYXRyaXggKiB1Vmlld01hdHJpeCAqIHVNb2RlbE1hdHJpeCAqIHZlYzQoYVZlcnRleCwgMSk7XFxuXFxufVwiO1xuIiwiXHJcbnBrem8udmVjMiA9IGZ1bmN0aW9uICh2MCwgdjEpIHtcclxuICBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgdHlwZW9mIHYxID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MF0pO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MSA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjFdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgyKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8udmVjMyA9IGZ1bmN0aW9uICh2MCwgdjEsIHYyKSB7XHJcbiAgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgIHR5cGVvZiB2MSA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIHYyID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MCwgdjBdKTtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjEgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MiA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjEsIHYyXSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLnZlYzQgPSBmdW5jdGlvbiAodjAsIHYxLCB2MiwgdjQpIHtcclxuICBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgdHlwZW9mIHYxID09PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgdjIgPT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiB2MyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjAsIHYwLCB2MF0pO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MSA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYyID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICAgICAgIHR5cGVvZiB2MyA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjEsIHYyLCB2NF0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDQpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5uZWcgPSBmdW5jdGlvbiAodikge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSh2Lmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gLXZbaV07XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG4vLyBhZGQgYW5kIHN1YiBhbHNvIHdvcmsgZm9yIG1hdHJpeFxyXG5wa3pvLmFkZCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIHJbaV0gPSBhW2ldICsgYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8uc3ViID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gLSBiW2ldO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5kb3QgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciB2ID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIHYgKz0gYVtpXSAqIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiB2O1xyXG59XHJcblxyXG5wa3pvLmNyb3NzID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAvLyBhc3N1bWUgYS5sZW5ndGggPT0gYi5sZW5ndGggPT0gM1xyXG4gIFxyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSgzKTtcclxuICBcclxuICByWzBdID0gKGFbMV0gKiBiWzJdKSAtIChhWzJdICogYlsxXSk7XHJcbiAgclsxXSA9IChhWzJdICogYlswXSkgLSAoYVswXSAqIGJbMl0pO1xyXG4gIHJbMl0gPSAoYVswXSAqIGJbMV0pIC0gKGFbMV0gKiBiWzBdKTtcclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5tdWx0VmVjdG9yU2NhbGFyID0gZnVuY3Rpb24gKHYsIHMpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkodi5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdi5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IHZbaV0gKiBzO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5sZW5ndGggPSBmdW5jdGlvbiAodikgeyAgXHJcbiAgcmV0dXJuIE1hdGguc3FydChwa3pvLmRvdCh2LCB2KSk7XHJcbn1cclxuXHJcbnBrem8ubm9ybWFsaXplID0gZnVuY3Rpb24gKHYpIHtcclxuICByZXR1cm4gcGt6by5tdWx0VmVjdG9yU2NhbGFyKHYsIDEgLyBwa3pvLmxlbmd0aCh2KSk7XHJcbn1cclxuXHJcbnBrem8ubXVsdE1hdHJpeFZlY3RvciA9IGZ1bmN0aW9uIChtLCB2KSB7XHJcblx0dmFyIG4gPSB2Lmxlbmd0aDtcclxuXHR2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkobik7XHJcblx0XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspXHJcblx0e1xyXG5cdFx0cltpXSA9IDA7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKylcclxuXHRcdHtcclxuXHRcdFx0XHRyW2ldICs9IG1baSpuK2pdICogdltqXTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHI7XHJcbn1cclxuIiwiXHJcbnBrem8ubWF0MyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgaWYgKHYgJiYgdi5sZW5ndGggJiYgdi5sZW5ndGggPT0gMTYpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3ZbMF0sIHZbMV0sIHZbMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzRdLCB2WzVdLCB2WzZdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdls4XSwgdls5XSwgdlsxMF1dKTtcclxuXHR9XHJcblx0aWYgKHYgJiYgdi5sZW5ndGgpIHtcclxuICAgIGlmICh2Lmxlbmd0aCAhPSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWF0MyBtdXN0IGJlIDkgdmFsdWVzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgdiwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCB2XSk7XHJcbiAgfVxyXG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAxXSk7XHJcbn1cclxuXHJcbnBrem8ubWF0NCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgaWYgKHYgJiYgdi5sZW5ndGgpIHsgICAgXHJcbiAgICBpZiAodi5sZW5ndGggIT0gMTYpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXQ0IG11c3QgYmUgMTYgdmFsdWVzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgdiwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCB2LCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIHZdKTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIDFdKTtcclxufVxyXG5cclxucGt6by5tdWx0TWF0cml4ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAvLyBhc3N1bWUgYS5sZW5ndGggPT0gYi5sZW5ndGhcclxuICB2YXIgbiA9IE1hdGguc3FydChhLmxlbmd0aCk7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgdmFyIHYgPSAwO1xyXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IG47IGsrKykge1xyXG4gICAgICAgIHYgPSB2ICsgYVtpKm4ra10gKiBiW2sqbitqXTtcclxuICAgICAgfVxyXG4gICAgICByW2kqbitqXSA9IHY7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnJhZGlhbnMgPSBmdW5jdGlvbihkZWdyZWVzKSB7XHJcbiAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xyXG59O1xyXG5cclxucGt6by5kZWdyZWVzID0gZnVuY3Rpb24ocmFkaWFucykge1xyXG4gIHJldHVybiByYWRpYW5zICogMTgwIC8gTWF0aC5QSTtcclxufTsgXHJcblxyXG5cclxucGt6by5vcnRobyA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikge1xyXG4gIHZhciBybCA9IChyaWdodCAtIGxlZnQpO1xyXG4gIHZhciB0YiA9ICh0b3AgLSBib3R0b20pO1xyXG4gIHZhciBmbiA9IChmYXIgLSBuZWFyKTtcclxuICBcclxuICB2YXIgbSA9IHBrem8ubWF0NCgpOyAgXHJcbiAgXHJcbiAgbVswXSA9IDIgLyBybDtcclxuICBtWzFdID0gMDtcclxuICBtWzJdID0gMDtcclxuICBtWzNdID0gMDtcclxuICBtWzRdID0gMDtcclxuICBtWzVdID0gMiAvIHRiO1xyXG4gIG1bNl0gPSAwO1xyXG4gIG1bN10gPSAwO1xyXG4gIG1bOF0gPSAwO1xyXG4gIG1bOV0gPSAwO1xyXG4gIG1bMTBdID0gLTIgLyBmbjtcclxuICBtWzExXSA9IDA7XHJcbiAgbVsxMl0gPSAtKGxlZnQgKyByaWdodCkgLyBybDtcclxuICBtWzEzXSA9IC0odG9wICsgYm90dG9tKSAvIHRiO1xyXG4gIG1bMTRdID0gLShmYXIgKyBuZWFyKSAvIGZuO1xyXG4gIG1bMTVdID0gMTtcclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnBrem8uZnJ1c3R1bSA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIHpuZWFyLCB6ZmFyKSB7XHJcbiAgdmFyIHQxID0gMiAqIHpuZWFyO1xyXG4gIHZhciB0MiA9IHJpZ2h0IC0gbGVmdDtcclxuICB2YXIgdDMgPSB0b3AgLSBib3R0b207XHJcbiAgdmFyIHQ0ID0gemZhciAtIHpuZWFyO1xyXG5cclxuICB2YXIgbSA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xyXG4gIFxyXG4gIG1bMF0gPSB0MS90MjsgbVs0XSA9ICAgICAwOyBtWyA4XSA9ICAocmlnaHQgKyBsZWZ0KSAvIHQyOyBtWzEyXSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIG1bMV0gPSAgICAgMDsgbVs1XSA9IHQxL3QzOyBtWyA5XSA9ICAodG9wICsgYm90dG9tKSAvIHQzOyBtWzEzXSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIG1bMl0gPSAgICAgMDsgbVs2XSA9ICAgICAwOyBtWzEwXSA9ICgtemZhciAtIHpuZWFyKSAvIHQ0OyBtWzE0XSA9ICgtdDEgKiB6ZmFyKSAvIHQ0O1xyXG4gIG1bM10gPSAgICAgMDsgbVs3XSA9ICAgICAwOyBtWzExXSA9ICAgICAgICAgICAgICAgICAgIC0xOyBtWzE1XSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIFxyXG4gIHJldHVybiBtO1xyXG59XHJcblxyXG5wa3pvLnBlcnNwZWN0aXZlID0gZnVuY3Rpb24gKGZvdnksIGFzcGVjdCwgem5lYXIsIHpmYXIpIHtcclxuICB2YXIgeW1heCA9IHpuZWFyICogTWF0aC50YW4ocGt6by5yYWRpYW5zKGZvdnkpKTtcclxuICB2YXIgeG1heCA9IHltYXggKiBhc3BlY3Q7XHJcbiAgcmV0dXJuIHBrem8uZnJ1c3R1bSgteG1heCwgeG1heCwgLXltYXgsIHltYXgsIHpuZWFyLCB6ZmFyKTtcclxufVxyXG5cclxuLy8gTk9URTogdGhpcyBpcyBpbmVmZmljaWVudCwgaXQgbWF5IGJlIHNlbnNpYmxlIHRvIHByb3ZpZGUgaW5wbGFjZSB2ZXJzaW9uc1xyXG5wa3pvLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKG0sIHgsIHksIHopIHsgICAgXHJcbiAgdmFyIHIgPSBwa3pvLm1hdDQobSk7XHJcbiAgclsxMl0gPSBtWzBdICogeCArIG1bNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl07XHJcbiAgclsxM10gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM107XHJcbiAgclsxNF0gPSBtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XHJcbiAgclsxNV0gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV07XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8ucm90YXRlID0gZnVuY3Rpb24gKG0sIGFuZ2xlLCB4LCB5LCB6KSB7ICBcclxuICB2YXIgYSA9IHBrem8ucmFkaWFucyhhbmdsZSk7XHJcbiAgdmFyIGMgPSBNYXRoLmNvcyhhKTtcclxuICB2YXIgcyA9IE1hdGguc2luKGEpO1xyXG4gIFxyXG4gIHZhciBsID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgdmFyIG54ID0geCAvIGw7XHJcbiAgdmFyIG55ID0geSAvIGw7XHJcbiAgdmFyIG56ID0geiAvIGw7XHJcblxyXG4gIHZhciB0MCA9IG54ICogKDEgLSBjKTtcclxuICB2YXIgdDEgPSBueSAqICgxIC0gYyk7XHJcbiAgdmFyIHQyID0gbnogKiAoMSAtIGMpOyAgXHJcblxyXG4gIHZhciBkID0gcGt6by5tYXQ0KDEpO1xyXG4gIFxyXG4gIGRbIDBdID0gYyArIHQwICogbng7XHJcbiAgZFsgMV0gPSAwICsgdDAgKiBueSArIHMgKiBuejtcclxuICBkWyAyXSA9IDAgKyB0MCAqIG56IC0gcyAqIG55O1xyXG5cclxuICBkWyA0XSA9IDAgKyB0MSAqIG54IC0gcyAqIG56O1xyXG4gIGRbIDVdID0gYyArIHQxICogbnk7XHJcbiAgZFsgNl0gPSAwICsgdDEgKiBueiArIHMgKiBueDtcclxuXHJcbiAgZFsgOF0gPSAwICsgdDIgKiBueCArIHMgKiBueTtcclxuICBkWyA5XSA9IDAgKyB0MiAqIG55IC0gcyAqIG54O1xyXG4gIGRbMTBdID0gYyArIHQyICogbno7ICBcclxuICBcclxuICB2YXIgciA9IHBrem8ubXVsdE1hdHJpeChtLCBkKTtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnNjYWxlID0gZnVuY3Rpb24obSwgeCwgeSwgeikgeyAgICBcclxuICB2YXIgciA9IHBrem8ubWF0NCgxKTtcclxuICBcclxuICByWyAwXSA9IG1bIDBdICogeDsgXHJcbiAgclsgMV0gPSBtWyAxXSAqIHg7IFxyXG4gIHJbIDJdID0gbVsgMl0gKiB4OyBcclxuICByWyAzXSA9IG1bIDNdICogeDsgXHJcbiAgXHJcbiAgclsgNF0gPSBtWyA0XSAqIHk7IFxyXG4gIHJbIDVdID0gbVsgNV0gKiB5OyBcclxuICByWyA2XSA9IG1bIDZdICogeTsgXHJcbiAgclsgN10gPSBtWyA3XSAqIHk7IFxyXG4gIFxyXG4gIHJbIDhdID0gbVsgOF0gKiB6O1xyXG4gIHJbIDldID0gbVsgOV0gKiB6O1xyXG4gIHJbMTBdID0gbVsxMF0gKiB6O1xyXG4gIHJbMTFdID0gbVsxMV0gKiB6O1xyXG4gIFxyXG4gIHJbMTJdID0gbVsxMl07XHJcbiAgclsxM10gPSBtWzEzXTtcclxuICByWzE0XSA9IG1bMTRdO1xyXG4gIHJbMTVdID0gbVsxNV07XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8udHJhbnNwb3NlID0gZnVuY3Rpb24obSkgeyAgICBcclxuICB2YXIgbiA9IE1hdGguc3FydChtLmxlbmd0aCk7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KG0ubGVuZ3RoKTtcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgcltqKm4raV0gPSBtW2kqbitqXTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuIiwiXHJcbnBrem8uQ2FudmFzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuY2FudmFzID0gZWxlbWVudDtcclxuICB9ICBcclxuICBcclxuICB0aGlzLmNhbnZhcy53aWR0aCAgPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aDtcclxuICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7ICBcclxuICBcclxuICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIsIHthbnRpYWxpYXM6IHRydWUsIGRlcHRoOiB0cnVlfSk7XHJcbiAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XHJcbiAgXHJcbiAgLy8gdGhlc2UgdmFsdWVzIGFyZSBmb3IgdGhlIHByb2dyYW1tZXIgb2YgdGhlIGRyYXcgZnVuY3Rpb24sIFxyXG4gIC8vIHdlIHBhc3MgdGhlIGdsIG9iamVjdCwgbm90IHRoZSBjYW52YXMuXHJcbiAgdGhpcy5nbC53aWR0aCAgPSB0aGlzLmNhbnZhcy53aWR0aDtcclxuICB0aGlzLmdsLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxufVxyXG5cclxucGt6by5DYW52YXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoY2IpIHtcclxuICBpZiAoY2IpIHtcclxuICAgIGNiLmNhbGwodGhpcywgdGhpcy5nbCk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLkNhbnZhcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjYikgeyAgXHJcbiAgaWYgKHRoaXMuY2FudmFzLndpZHRoICE9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoIHx8IHRoaXMuY2FudmFzLmhlaWdodCAhPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQpIHtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoICA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0OyAgXHJcbiAgICB0aGlzLmdsLndpZHRoICA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5nbC5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQgfCB0aGlzLmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG4gIFxyXG4gIGlmIChjYikge1xyXG4gICAgY2IuY2FsbCh0aGlzLCB0aGlzLmdsKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5UZXh0dXJlID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIHRoaXMudXJsICAgID0gdXJsO1xyXG4gIHRoaXMuaW1hZ2UgID0gbnVsbDtcclxuICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gIFxyXG4gIC8vIHdlIGRvbid0IHVwbG9hZCB0aGUgaW1hZ2UgdG8gVlJBTSwgYnV0IHRyeSB0byBsb2FkIGl0XHJcbiAgdGhpcy5sb2FkKCk7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICgpIHtcdFxyXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICB2YXIgdGV4dHVyZSA9IHRoaXM7XHJcbiAgdGhpcy5pbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0ZXh0dXJlLmxvYWRlZCA9IHRydWU7ICAgIFxyXG4gIH07XHJcbiAgdGhpcy5pbWFnZS5zcmMgPSB0aGlzLnVybDtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTtcclxuICBcclxuICBpZiAodGhpcy5sb2FkZWQpIHtcclxuICAgIHRoaXMuc3luYygpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfMkQsIDAsIHRoaXMuZ2wuUkdCQSwgMSwgMSwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIG51bGwpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTsgIFxyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfMkQsIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW1hZ2UpOyAgXHJcbiAgdGhpcy5nbC5nZW5lcmF0ZU1pcG1hcCh0aGlzLmdsLlRFWFRVUkVfMkQpO1xyXG4gIFxyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLmdsLkxJTkVBUik7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMuZ2wuTElORUFSX01JUE1BUF9MSU5FQVIpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMuZ2wuUkVQRUFUKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLmdsLlJFUEVBVCk7XHJcbiAgXHJcbiAgLy8gY2FuIHdlIGRpc2NhcmQgaW1hZ2Ugbm93P1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVUZXh0dXJlKHRoaXMuaWQpO1xyXG4gIHRoaXMuaWQgPSBudWxsO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZ2wsIGNoYW5uZWwpIHtcclxuXHR0aGlzLmdsID0gZ2w7XHJcbiAgaWYgKCEgdGhpcy5pZCkge1xyXG4gICAgdGhpcy51cGxvYWQoKTtcclxuICB9XHJcblx0Ly8gVE9ETyBjaGFubmVsXHJcbiAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuaWQpO1xyXG59XHJcbiIsIlxyXG5wa3pvLlNoYWRlciA9IGZ1bmN0aW9uIChnbCwgdmVydGV4Q29kZSwgZnJhZ21lbnRDb2RlKSB7XHJcbiAgdGhpcy5nbCAgICAgICAgICAgPSBnbDtcclxuICB0aGlzLnZlcnRleENvZGUgICA9IHZlcnRleENvZGU7XHJcbiAgdGhpcy5mcmFnbWVudENvZGUgPSBmcmFnbWVudENvZGU7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB2ZXJ0ZXhTaGFkZXIgICA9IHRoaXMuY29tcGlsZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIsICAgdGhpcy52ZXJ0ZXhDb2RlKTtcclxuICB2YXIgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmNvbXBpbGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIsIHRoaXMuZnJhZ21lbnRDb2RlKTtcclxuICBcclxuICB2YXIgcHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gIFxyXG4gIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XHJcbiAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gIFxyXG4gIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgXHJcbiAgdmFyIGluZm9Mb2cgPSB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pO1xyXG4gIGlmICh0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykgPT09IGZhbHNlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoaW5mb0xvZyk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGluZm9Mb2cgIT09ICcnKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbmZvTG9nKTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5nbC5kZWxldGVTaGFkZXIodmVydGV4U2hhZGVyKTtcclxuICB0aGlzLmdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XHJcbiAgXHJcbiAgdGhpcy5pZCA9IHByb2dyYW07XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5jb21waWxlU2hhZGVyID0gZnVuY3Rpb24gKHR5cGUsIGNvZGUpIHtcclxuICB2YXIgaWQgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0eXBlKTsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wuc2hhZGVyU291cmNlKGlkLCBjb2RlKTtcclxuICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoaWQpO1xyXG4gIFxyXG4gIHZhciBpbmZvTG9nID0gdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGlkKTtcclxuICBpZiAodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoaWQsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpID09PSBmYWxzZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGluZm9Mb2cpO1xyXG4gIH1cclxuICBlbHNlIGlmIChpbmZvTG9nICE9PSAnJykge1xyXG4gICAgY29uc29sZS5sb2coaW5mb0xvZyk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBpZDtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVQcm9ncmFtKGlkKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCF0aGlzLmlkKSB7XHJcbiAgICB0aGlzLmNvbXBpbGUoKTtcclxuICB9XHJcbiAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuaWQpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0QXJydGlidXRlID0gZnVuY3Rpb24gKG5hbWUsIGJ1ZmZlciwgZWxlbWVudFNpemUpIHsgIFxyXG4gIGJ1ZmZlci5iaW5kKCk7ICBcclxuICBcclxuICBpZiAoZWxlbWVudFNpemUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdmFyIGVsZW1lbnRTaXplID0gYnVmZmVyLmVsZW1lbnRTaXplO1xyXG4gIH1cclxuICBcclxuICB2YXIgcG9zID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvcyk7XHJcbiAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvcywgZWxlbWVudFNpemUsIGJ1ZmZlci5lbGVtZW50VHlwZSwgdGhpcy5nbC5GQUxTRSwgMCwgMCk7ICBcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0xaSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0xaShsb2MsIHZhbHVlKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0xZiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0xZihsb2MsIHZhbHVlKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0yZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtMmYobG9jLCB2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTNmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0zZihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0pO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTRmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm00Zihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0sIHZhbHVlWzRdKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm1NYXRyaXgzZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIHRyYW5zcG9zZSkge1xyXG4gIGlmICh0cmFuc3Bvc2UgPT09IHVuZGVmaW5lZCB8fHRyYW5zcG9zZSA9PT0gbnVsbCkge1xyXG4gICAgdmFyIHRyYW5zcG9zZSA9IGZhbHNlO1xyXG4gIH1cclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KGxvYywgdHJhbnNwb3NlLCB2YWx1ZSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtTWF0cml4NGZ2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCB0cmFuc3Bvc2UpIHtcclxuICBpZiAodHJhbnNwb3NlID09PSB1bmRlZmluZWQgfHx0cmFuc3Bvc2UgPT09IG51bGwpIHtcclxuICAgIHZhciB0cmFuc3Bvc2UgPSBmYWxzZTtcclxuICB9XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdihsb2MsIHRyYW5zcG9zZSwgdmFsdWUpO1xyXG59XHJcblxyXG5cclxuIiwiXHJcbnBrem8uU2NlbmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0dGhpcy5hbWJpZW50TGlnaHQgPSBwa3pvLnZlYzMoMC4yLCAwLjIsIDAuMik7XHRcclxufVxyXG5cclxucGt6by5TY2VuZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdGlmICh0aGlzLmVudGl0aWVzKSB7XHJcblx0XHR0aGlzLmVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24gKGVudGl0eSkge1xyXG5cdFx0XHRlbnRpdHkuZW5xdWV1ZShyZW5kZXJlcik7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbnBrem8uU2NlbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcclxuICBpZiAoISB0aGlzLmVudGl0aWVzKSB7XHJcbiAgICB0aGlzLmVudGl0aWVzID0gW2VudGl0eV1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcclxuICB9XHJcbn0iLCJcclxucGt6by5CdWZmZXIgPSBmdW5jdGlvbiAoZ2wsIGRhdGEsIGJ0eXBlLCBldHlwZSkge1xyXG4gIHRoaXMuZ2wgPSBnbDtcclxuICBcclxuICBpZiAoYnR5cGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdGhpcy50eXBlID0gZ2wuQVJSQVlfQlVGRkVSO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudHlwZSA9IGJ0eXBlO1xyXG4gIH1cclxuICBcclxuICBpZiAoZXR5cGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHRoaXMudHlwZSA9PSBnbC5BUlJBWV9CVUZGRVIpIHtcclxuICAgICAgdGhpcy5lbGVtZW50VHlwZSA9IGdsLkZMT0FUO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudFR5cGUgPSBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmVsZW1lbnRUeXBlID0gZXR5cGU7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMubG9hZChkYXRhKTtcclxufVxyXG5cclxucGt6by53cmFwQXJyYXkgPSBmdW5jdGlvbiAoZ2wsIHR5cGUsIGRhdGEpIHtcclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgZ2wuRkxPQVQ6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5ET1VCTEU6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQ2NEFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5VTlNJR05FRF9CWVRFOlxyXG4gICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX1NIT1JUOlxyXG4gICAgICByZXR1cm4gbmV3IFVpbnQxNkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5VTlNJR05FRF9JTlQ6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDMyQXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLkJZVEU6XHJcbiAgICAgIHJldHVybiBuZXcgSW50OEFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5TSE9SVDpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQxNkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5JTlQ6XHJcbiAgICAgIHJldHVybiBuZXcgSW50MzJBcnJheShkYXRhKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGRhdGEpIHsgIFxyXG4gIGlmIChkYXRhWzBdLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRTaXplID0gMTtcclxuICAgIHRoaXMuZGF0YSA9IHBrem8ud3JhcEFycmF5KHRoaXMuZ2wsIHRoaXMuZWxlbWVudFR5cGUsIGRhdGEpO1xyXG4gIH1cclxuICBlbHNlIHsgICAgXHJcbiAgICB0aGlzLmVsZW1lbnRTaXplID0gZGF0YVswXS5sZW5ndGg7XHJcbiAgICB0aGlzLmRhdGEgPSBwa3pvLndyYXBBcnJheSh0aGlzLmdsLCB0aGlzLmVsZW1lbnRUeXBlLCBkYXRhLmxlbmd0aCAqIHRoaXMuZWxlbVNpemUpO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGJ1ZmZlciA9IHRoaXM7XHJcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgZWxlbS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgYnVmZmVyLmRhdGFbaV0gPSB2O1xyXG4gICAgICAgIGkrKztcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMudHlwZSwgdGhpcy5pZCk7XHJcbiAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMudHlwZSwgdGhpcy5kYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHRoaXMuaWQpIHtcclxuICAgIHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMuaWQpO1xyXG4gICAgdGhpcy5pZCA9IG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKHByaW1pdGl2ZSkge1xyXG4gIGlmICghIHRoaXMuaWQpIHtcclxuICAgIHRoaXMudXBsb2FkKCk7XHJcbiAgfVxyXG4gIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLnR5cGUsIHRoaXMuaWQpO1xyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKHByaW1pdGl2ZSkge1xyXG4gIHRoaXMuYmluZCgpO1xyXG4gIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgdGhpcy5kYXRhLmxlbmd0aCwgdGhpcy5lbGVtZW50VHlwZSwgMCk7XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5NZXNoID0gZnVuY3Rpb24gKCkge31cclxuXHJcbnBrem8uTWVzaC5wbGFuZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCB3cmVzLCBocmVzKSB7XHJcblx0dmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcblx0XHJcblx0dmFyIHcyID0gd2lkdGggLyAyLjA7XHJcblx0dmFyIGgyID0gaGVpZ2h0IC8gMi4wO1xyXG5cdHZhciB3cyA9IHdpZHRoIC8gd3JlcztcclxuXHR2YXIgaHMgPSBoZWlnaHQgLyBocmVzO1xyXG5cdHZhciB0cyA9IDEuMCAvIHdyZXM7XHJcblx0dmFyIHNzID0gMS4wIC8gaHJlcztcclxuXHRcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8PSB3cmVzOyBpKyspIHtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDw9IGhyZXM7IGorKykge1xyXG5cdFx0XHR2YXIgeCA9IC13MiArIGkgKiB3czsgXHJcblx0XHRcdHZhciB5ID0gLWgyICsgaiAqIGhzO1xyXG5cdFx0XHR2YXIgdCA9IGkgKiB0cztcclxuXHRcdFx0dmFyIHMgPSBqICogc3M7XHJcblx0XHRcdG1lc2guYWRkVmVydGV4KHBrem8udmVjMyh4LCB5LCAwKSwgcGt6by52ZWMzKDAsIDAsIDEpLCBwa3pvLnZlYzIodCwgcykpO1x0XHRcdFx0XHRcdFxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHdyZXM7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBocmVzOyBqKyspIHtcclxuXHRcdFx0dmFyIGEgPSAoaSArIDApICogd3JlcyArIChqICsgMCk7XHJcblx0XHRcdHZhciBiID0gKGkgKyAwKSAqIHdyZXMgKyAoaiArIDEpO1xyXG5cdFx0XHR2YXIgYyA9IChpICsgMSkgKiB3cmVzICsgKGogKyAxKTtcclxuXHRcdFx0dmFyIGQgPSAoaSArIDEpICogd3JlcyArIChqICsgMCk7XHJcblx0XHRcdG1lc2guYWRkVHJpYW5nbGUoYSwgYiwgYyk7XHJcblx0XHRcdG1lc2guYWRkVHJpYW5nbGUoYywgZCwgYik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2guYm94ID0gZnVuY3Rpb24gKHMpIHtcclxuXHRcclxuXHR2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuXHRcclxuXHRtZXNoLnZlcnRpY2VzID0gXHJcblx0XHRcdFsgIHNbMF0sIHNbMV0sIHNbMl0sICAtc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLC1zWzFdLCBzWzJdLCAgIHNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG5cdFx0XHRcdCBzWzBdLCBzWzFdLCBzWzJdLCAgIHNbMF0sLXNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwtc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdLCAgICBcclxuXHRcdFx0XHQgc1swXSwgc1sxXSwgc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdLCAgLXNbMF0sIHNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwgc1syXSwgICAgXHJcblx0XHRcdFx0LXNbMF0sIHNbMV0sIHNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgIC1zWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG5cdFx0XHRcdC1zWzBdLC1zWzFdLC1zWzJdLCAgIHNbMF0sLXNbMV0sLXNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgIC1zWzBdLC1zWzFdLCBzWzJdLCAgICBcclxuXHRcdFx0XHQgc1swXSwtc1sxXSwtc1syXSwgIC1zWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sIHNbMV0sLXNbMl0sICAgc1swXSwgc1sxXSwtc1syXSBdOyAgXHJcblx0XHRcdFx0IFxyXG5cdG1lc2gubm9ybWFscyA9IFxyXG5cdFx0XHRbICAwLCAwLCAxLCAgIDAsIDAsIDEsICAgMCwgMCwgMSwgICAwLCAwLCAxLCAgICAgXHJcblx0XHRcdFx0IDEsIDAsIDAsICAgMSwgMCwgMCwgICAxLCAwLCAwLCAgIDEsIDAsIDAsICAgICBcclxuXHRcdFx0XHQgMCwgMSwgMCwgICAwLCAxLCAwLCAgIDAsIDEsIDAsICAgMCwgMSwgMCwgICAgIFxyXG5cdFx0XHRcdC0xLCAwLCAwLCAgLTEsIDAsIDAsICAtMSwgMCwgMCwgIC0xLCAwLCAwLCAgICAgXHJcblx0XHRcdFx0IDAsLTEsIDAsICAgMCwtMSwgMCwgICAwLC0xLCAwLCAgIDAsLTEsIDAsICAgICBcclxuXHRcdFx0XHQgMCwgMCwtMSwgICAwLCAwLC0xLCAgIDAsIDAsLTEsICAgMCwgMCwtMSBdOyAgIFxyXG5cclxuXHRtZXNoLnRleENvb3JkcyA9IFxyXG5cdFx0XHRbICAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAxLCAwLCAgICBcclxuXHRcdFx0XHQgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgMSwgMSwgICAgXHJcblx0XHRcdFx0IDEsIDAsICAgMSwgMSwgICAwLCAxLCAgIDAsIDAsICAgIFxyXG5cdFx0XHRcdCAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAxLCAwLCAgICBcclxuXHRcdFx0XHQgMCwgMCwgICAxLCAwLCAgIDEsIDEsICAgMCwgMSwgICAgXHJcblx0XHRcdFx0IDAsIDAsICAgMSwgMCwgICAxLCAxLCAgIDAsIDEgXTsgIFxyXG5cclxuXHRtZXNoLmluZGljZXMgPSBcclxuXHRcdFx0WyAgMCwgMSwgMiwgICAwLCAyLCAzLCAgIFxyXG5cdFx0XHRcdCA0LCA1LCA2LCAgIDQsIDYsIDcsICAgXHJcblx0XHRcdFx0IDgsIDksMTAsICAgOCwxMCwxMSwgICBcclxuXHRcdFx0XHQxMiwxMywxNCwgIDEyLDE0LDE1LCAgIFxyXG5cdFx0XHRcdDE2LDE3LDE4LCAgMTYsMTgsMTksICAgXHJcblx0XHRcdFx0MjAsMjEsMjIsICAyMCwyMiwyMyBdOyBcclxuXHJcblx0cmV0dXJuIG1lc2g7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5sb2FkID0gZnVuY3Rpb24gKGZpbGUpIHtcclxuXHQvLyBzb21ldGhpbmcgc29tZXRoaW5nIHhoclxyXG5cdHZhciBtZXNoID0gbmV3IHBrem8uTWVzaCgpO1xyXG5cdFxyXG5cdHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLmFkZFZlcnRleCA9IGZ1bmN0aW9uICh2ZXJ0ZXgsIG5vcm1hbCwgdGV4Q29vcmQpIHtcclxuXHRpZiAodGhpcy52ZXJ0aWNlcykge1xyXG5cdFx0dGhpcy52ZXJ0aWNlcy5wdXNoKFt2ZXJ0ZXhbMF0sIHZlcnRleFsxXSwgdmVydGV4WzJdXSk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dGhpcy52ZXJ0aWNlcyA9IFt2ZXJ0ZXhbMF0sIHZlcnRleFsxXSwgdmVydGV4WzJdXTtcclxuXHR9XHJcblx0XHJcblx0aWYgKHRoaXMubm9ybWFscykge1xyXG5cdFx0dGhpcy5ub3JtYWxzLnB1c2goW25vcm1hbFswXSwgbm9ybWFsWzFdLCBub3JtYWxbMl1dKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aGlzLm5vcm1hbHMgPSBbbm9ybWFsWzBdLCBub3JtYWxbMV0sIG5vcm1hbFsyXV07XHJcblx0fVxyXG5cdFxyXG5cdGlmICh0aGlzLnRleENvb3Jkcykge1xyXG5cdFx0dGhpcy50ZXhDb29yZHMucHVzaChbdGV4Q29vcmRbMF0sIHRleENvb3JkWzFdLCB0ZXhDb29yZFsyXV0pO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMudGV4Q29vcmRzID0gW3RleENvb3JkWzBdLCB0ZXhDb29yZFsxXSwgdGV4Q29vcmRbMl1dO1xyXG5cdH1cclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5hZGRUcmlhbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XHJcblx0aWYgKHRoaXMuaW5kaWNlcykge1xyXG5cdFx0dGhpcy5pbmRpY2VzLnB1c2goW2EsIGIsIGNdKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aGlzLmluZGljZXMgPSBbYSwgYiwgY107XHJcblx0fVxyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uIChnbCkge1xyXG5cdHRoaXMudmVydGV4QnVmZmVyICAgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMudmVydGljZXMsICBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTtcclxuXHR0aGlzLm5vcm1hbEJ1ZmZlciAgID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLm5vcm1hbHMsICAgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7ICAgICAgXHJcblx0dGhpcy50ZXhDb29yZEJ1ZmZlciA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy50ZXhDb29yZHMsIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpOyAgICAgIFxyXG5cdHRoaXMuaW5kZXhCdWZmZXIgICAgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMuaW5kaWNlcywgICBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ2wuVU5TSUdORURfU0hPUlQpO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihnbCwgc2hhZGVyKSB7XHJcblx0aWYgKCF0aGlzLnZlcnRleEJ1ZmZlcikge1xyXG5cdFx0dGhpcy51cGxvYWQoZ2wpO1xyXG5cdH1cclxuXHRcclxuXHRzaGFkZXIuc2V0QXJydGlidXRlKFwiYVZlcnRleFwiLCAgIHRoaXMudmVydGV4QnVmZmVyLCAgIDMpO1xyXG4gIHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhTm9ybWFsXCIsICAgdGhpcy5ub3JtYWxCdWZmZXIsICAgMyk7XHJcbiAgc2hhZGVyLnNldEFycnRpYnV0ZShcImFUZXhDb29yZFwiLCB0aGlzLnRleENvb3JkQnVmZmVyLCAyKTtcclxuICAgICAgXHJcbiAgdGhpcy5pbmRleEJ1ZmZlci5kcmF3KGdsLlRSSUFOR0xFUyk7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuXHR0aGlzLnZlcnRleEJ1ZmZlci5yZWxlYXNlKCk7ICAgXHJcblx0ZGVsZXRlIHRoaXMudmVydGV4QnVmZmVyO1xyXG5cdFxyXG5cdHRoaXMubm9ybWFsQnVmZmVyLnJlbGVhc2UoKTsgICBcclxuXHRkZWxldGUgdGhpcy5ub3JtYWxCdWZmZXI7XHRcclxuXHRcclxuXHR0aGlzLnRleENvb3JkQnVmZmVyLnJlbGVhc2UoKTsgXHJcblx0ZGVsZXRlIHRoaXMudGV4Q29vcmRCdWZmZXI7XHJcblx0XHJcblx0dGhpcy5pbmRleEJ1ZmZlci5yZWxlYXNlKCk7XHJcblx0ZGVsZXRlIHRoaXMuaW5kZXhCdWZmZXI7XHJcbn1cclxuIiwiXHJcbnBrem8uTWF0ZXJpYWwgPSBmdW5jdGlvbiAob3B0cykge1x0XHJcblx0aWYgKG9wdHMuY29sb3IpIHtcclxuXHRcdHRoaXMuY29sb3IgPSBvcHRzLmNvbG9yO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMuY29sb3IgPSBwa3pvLnZlYzMoMSwgMSwgMSk7XHJcblx0fVx0XHJcblx0aWYgKG9wdHMudGV4dHVyZSkge1xyXG5cdFx0dGhpcy50ZXh0dXJlID0gb3B0cy50ZXh0dXJlO1xyXG5cdH1cdFxyXG59XHJcblxyXG5wa3pvLk1hdGVyaWFsLnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uIChnbCwgc2hhZGVyKSB7XHJcblx0XHJcblx0c2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VDb2xvcicsIHRoaXMuY29sb3IpO1xyXG5cdFxyXG5cdGlmICh0aGlzLnRleHR1cmUgJiYgdGhpcy50ZXh0dXJlLmxvYWRlZCkge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc1RleHR1cmUnLCAxKTtcclxuXHRcdHRoaXMudGV4dHVyZS5iaW5kKGdsLCAwKVxyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndVRleHR1cmUnLCAwKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzVGV4dHVyZScsIDApO1xyXG5cdH1cclxuXHRcclxufVxyXG4iLCJcclxucGt6by5FbnRpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy50cmFuc2Zvcm0gPSBwa3pvLm1hdDQoMSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoYW5nbGUsIHgsIHksIHopIHtcclxuXHR0aGlzLnRyYW5zZm9ybSA9IHBrem8ucm90YXRlKHRoaXMudHJhbnNmb3JtLCBhbmdsZSwgeCwgeSwgeik7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRYVmVjdG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBwa3pvLnZlYzModGhpcy50cmFuc2Zvcm1bMF0sIHRoaXMudHJhbnNmb3JtWzFdLCB0aGlzLnRyYW5zZm9ybVsyXSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRZVmVjdG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBwa3pvLnZlYzModGhpcy50cmFuc2Zvcm1bNF0sIHRoaXMudHJhbnNmb3JtWzVdLCB0aGlzLnRyYW5zZm9ybVs2XSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRaVmVjdG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBwa3pvLnZlYzModGhpcy50cmFuc2Zvcm1bOF0sIHRoaXMudHJhbnNmb3JtWzldLCB0aGlzLnRyYW5zZm9ybVsxMF0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVsxMl0sIHRoaXMudHJhbnNmb3JtWzEzXSwgdGhpcy50cmFuc2Zvcm1bMTRdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgdGhpcy50cmFuc2Zvcm1bMTJdID0gdmFsdWVbMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMTNdID0gdmFsdWVbMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMTRdID0gdmFsdWVbMl07XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5sb29rQXQgPSBmdW5jdGlvbiAodGFyZ2V0LCB1cCkge1xyXG4gIHZhciBwb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb24oKTtcclxuICB2YXIgZm9yd2FyZCAgPSBwa3pvLm5vcm1hbGl6ZShwa3pvLnN1Yih0YXJnZXQsIHBvc2l0aW9uKSk7XHJcbiAgdmFyIHJpZ2h0ICAgID0gcGt6by5ub3JtYWxpemUocGt6by5jcm9zcyhmb3J3YXJkLCB1cCkpO1xyXG4gIHZhciB1cG4gICAgICA9IHBrem8ubm9ybWFsaXplKHBrem8uY3Jvc3MocmlnaHQsIGZvcndhcmQpKTtcclxuICBcclxuICAvLyBUT0RPIHNjYWxpbmdcclxuICB0aGlzLnRyYW5zZm9ybVswXSA9IHJpZ2h0WzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzFdID0gcmlnaHRbMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMl0gPSByaWdodFsyXTtcclxuICBcclxuICB0aGlzLnRyYW5zZm9ybVs0XSA9IHVwblswXTtcclxuICB0aGlzLnRyYW5zZm9ybVs1XSA9IHVwblsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVs2XSA9IHVwblsyXTtcclxuICBcclxuICB0aGlzLnRyYW5zZm9ybVs4XSA9IGZvcndhcmRbMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bOV0gPSBmb3J3YXJkWzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzEwXSA9IGZvcndhcmRbMl07XHJcbn1cclxuIiwiXHJcbnBrem8uQ2FtZXJhID0gZnVuY3Rpb24gKG9wdCkge1xyXG4gIHBrem8uRW50aXR5LmNhbGwodGhpcyk7XHJcbiAgXHJcbiAgdmFyIG8gPSBvcHQgPyBvcHQgOiB7fTtcclxuICBcclxuICB0aGlzLnlmb3YgID0gby55Zm92ICA/IG8ueWZvdiAgOiAgNDUuMDtcclxuICB0aGlzLnpuZWFyID0gby56bmVhciA/IG8uem5lYXIgOiAgIDAuMTtcclxuICB0aGlzLnpmYXIgID0gby56ZmFyICA/IG8uemZhciAgOiAxMDAuMDtcclxufVxyXG5cclxucGt6by5DYW1lcmEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLkNhbWVyYTtcclxuXHJcbnBrem8uQ2FtZXJhLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcbiAgdmFyIGFzcGVjdCA9IHJlbmRlcmVyLmNhbnZhcy5nbC53aWR0aCAvIHJlbmRlcmVyLmNhbnZhcy5nbC5oZWlnaHQ7XHJcbiAgXHJcbiAgdmFyIHByb2plY3Rpb25NYXRyaXggPSBwa3pvLnBlcnNwZWN0aXZlKHRoaXMueWZvdiwgYXNwZWN0LCB0aGlzLnpuZWFyLCB0aGlzLnpmYXIpO1xyXG4gIFxyXG4gIHZhciBwID0gdGhpcy5nZXRQb3NpdGlvbigpO1xyXG4gIHZhciB4ID0gdGhpcy5nZXRYVmVjdG9yKCk7XHJcbiAgdmFyIHkgPSB0aGlzLmdldFlWZWN0b3IoKTtcclxuICB2YXIgeiA9IHRoaXMuZ2V0WlZlY3RvcigpO1xyXG4gIFxyXG4gIHZhciB2aWV3TWF0cml4ID0gcGt6by5tYXQ0KFt4WzBdLCB4WzFdLCB4WzJdLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5WzBdLCB5WzFdLCB5WzJdLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6WzBdLCB6WzFdLCB6WzJdLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAgICAwLCAgICAwLCAxXSk7XHJcbiAgdmlld01hdHJpeCA9IHBrem8udHJhbnNwb3NlKHZpZXdNYXRyaXgpOyAvLyB1c2UgaW52ZXJzZVxyXG4gIHZpZXdNYXRyaXggPSBwa3pvLnRyYW5zbGF0ZSh2aWV3TWF0cml4LCAtcFswXSwgLXBbMV0sIC1wWzJdKTsgIFxyXG4gIFxyXG4gIHJlbmRlcmVyLnNldENhbWVyYShwcm9qZWN0aW9uTWF0cml4LCB2aWV3TWF0cml4KTtcclxufVxyXG4iLCJcclxucGt6by5PYmplY3QgPSBmdW5jdGlvbiAobWVzaCwgbWF0ZXJpYWwpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG4gIFxyXG4gIHRoaXMubWVzaCAgICAgPSBtZXNoO1xyXG4gIHRoaXMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcclxufVxyXG5cclxucGt6by5PYmplY3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLk9iamVjdDtcclxuXHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcblx0Ly8gdG9kbyByZXNwZWN0IHBhcmVudCB0cmFuc2Zvcm1cclxuXHRyZW5kZXJlci5hZGRNZXNoKHRoaXMudHJhbnNmb3JtLCB0aGlzLm1hdGVyaWFsLCB0aGlzLm1lc2gpO1xyXG59XHJcblxyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChnbCwgc2hhZGVyLCBwYXJlbnRNb2RlbFZpZXdNYXRyaXgpIHsgXHJcbiAgXHJcbiAgdmFyIG1vZGVsVmlld01hdHJpeCA9IHBrem8ubXVsdE1hdHJpeChwYXJlbnRNb2RlbFZpZXdNYXRyaXgsIHRoaXMudHJhbnNmb3JtKTtcclxuICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndU1vZGVsVmlld01hdHJpeCcsIG1vZGVsVmlld01hdHJpeCk7XHJcblx0c2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VNb2RlbE1hdHJpeCcsIHRoaXMudHJhbnNmb3JtKTtcclxuICBcclxuICB0aGlzLm1hdGVyaWFsLnNldHVwKGdsLCBzaGFkZXIpO1xyXG4gIHRoaXMubWVzaC5kcmF3KGdsLCBzaGFkZXIpO1xyXG59XHJcblxyXG4iLCJcclxucGt6by5EaXJlY3Rpb25hbExpZ2h0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHBrem8uRW50aXR5LmNhbGwodGhpcyk7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IHBrem8udmVjMygwLjUsIDAuNSwgMC41KTtcclxufVxyXG5cclxucGt6by5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uRGlyZWN0aW9uYWxMaWdodDtcclxuXHJcbnBrem8uRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdHZhciBkaXIgPSBwa3pvLm5lZyh0aGlzLmdldFpWZWN0b3IoKSk7XHJcblx0cmVuZGVyZXIuYWRkRGlyZWN0aW9uYWxMaWdodChkaXIsIHRoaXMuY29sb3IpO1xyXG59XHJcbiIsIlxyXG5wa3pvLlBvaW50TGlnaHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gcGt6by52ZWMzKDAuNSwgMC41LCAwLjUpO1xyXG4gIHRoaXMucmFuZ2UgPSAxMC4wO1xyXG59XHJcblxyXG5wa3pvLlBvaW50TGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLlBvaW50TGlnaHQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5Qb2ludExpZ2h0O1xyXG5cclxucGt6by5Qb2ludExpZ2h0LnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcblx0cmVuZGVyZXIuYWRkUG9pbnRMaWdodCh0aGlzLmdldFBvc2l0aW9uKCksIHRoaXMuY29sb3IsIHRoaXMucmFuZ2UpO1xyXG59XHJcbiIsIlxyXG5wa3pvLlNwb3RMaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgID0gcGt6by52ZWMzKDAuNSwgMC41LCAwLjUpO1xyXG4gIHRoaXMucmFuZ2UgID0gMTAuMDtcclxuICB0aGlzLmN1dG9mZiA9IDI1LjA7XHJcbn1cclxuXHJcbnBrem8uU3BvdExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5TcG90TGlnaHQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5TcG90TGlnaHQ7XHJcblxyXG5wa3pvLlNwb3RMaWdodC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG4gIHZhciBkaXIgPSBwa3pvLm5lZyh0aGlzLmdldFpWZWN0b3IoKSk7XHJcblx0cmVuZGVyZXIuYWRkU3BvdExpZ2h0KHRoaXMuZ2V0UG9zaXRpb24oKSwgZGlyLCB0aGlzLmNvbG9yLCB0aGlzLnJhbmdlLCB0aGlzLmN1dG9mZik7XHJcbn1cclxuIiwiXHJcbnBrem8uUmVuZGVyZXIgPSBmdW5jdGlvbiAoY2FudmFzKSB7XHJcblx0dGhpcy5jYW52YXMgPSBuZXcgcGt6by5DYW52YXMoY2FudmFzKTtcclxuXHRcclxuXHR2YXIgcmVuZGVyZXIgPSB0aGlzO1xyXG5cdFxyXG5cdHRoaXMuY2FudmFzLmluaXQoZnVuY3Rpb24gKGdsKSB7XHJcblx0XHRyZW5kZXJlci5zb2xpZFNoYWRlclx0ID0gbmV3IHBrem8uU2hhZGVyKGdsLCBwa3pvLlNvbGlkVmVydCwgcGt6by5Tb2xpZEZyYWcpO1xyXG5cdFx0cmVuZGVyZXIuYW1iaWVudFNoYWRlciA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5Tb2xpZFZlcnQsIHBrem8uQW1iaWVudEZyYWcpO1xyXG5cdFx0cmVuZGVyZXIubGlnaHRTaGFkZXJcdCA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5Tb2xpZFZlcnQsIHBrem8uTGlnaHRGcmFnKTtcclxuXHR9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuc2V0Q2FtZXJhID0gZnVuY3Rpb24gKHByb2plY3Rpb25NYXRyaXgsIHZpZXdNYXRyaXgpIHtcclxuXHR0aGlzLnByb2plY3Rpb25NYXRyaXggPSBwcm9qZWN0aW9uTWF0cml4O1xyXG5cdHRoaXMudmlld01hdHJpeFx0XHRcdFx0PSB2aWV3TWF0cml4O1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5hZGRNZXNoID0gZnVuY3Rpb24gKHRyYW5zZm9ybSwgbWF0ZXJpYWwsIG1lc2gpIHtcclxuXHR0aGlzLnNvbGlkcy5wdXNoKHtcclxuXHRcdHRyYW5zZm9ybTogdHJhbnNmb3JtLFxyXG5cdFx0bWF0ZXJpYWw6IG1hdGVyaWFsLCBcclxuXHRcdG1lc2g6IG1lc2hcclxuXHR9KTtcclxufVxyXG5cclxucGt6by5ESVJFQ1RJT05BTF9MSUdIVCA9IDE7XHJcbnBrem8uUE9JTlRfTElHSFRcdFx0XHQgPSAyO1xyXG5wa3pvLlNQT1RfTElHSFRcdFx0XHQgICA9IDM7XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5hZGREaXJlY3Rpb25hbExpZ2h0ID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgY29sb3IpIHtcclxuXHR0aGlzLmxpZ2h0cy5wdXNoKHtcclxuXHRcdHR5cGU6IHBrem8uRElSRUNUSU9OQUxfTElHSFQsXHJcblx0XHRkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuXHRcdGNvbG9yOiBjb2xvclxyXG5cdH0pO1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5hZGRQb2ludExpZ2h0ID0gZnVuY3Rpb24gKHBvc2l0aW9uLCBjb2xvciwgcmFuZ2UpIHtcclxuXHR0aGlzLmxpZ2h0cy5wdXNoKHtcclxuXHRcdHR5cGU6IHBrem8uUE9JTlRfTElHSFQsXHJcblx0XHRwb3NpdGlvbjogcG9zaXRpb24sXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRyYW5nZTogcmFuZ2VcclxuXHR9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkU3BvdExpZ2h0ID0gZnVuY3Rpb24gKHBvc2l0aW9uLCBkaXJlY3Rpb24sIGNvbG9yLCByYW5nZSwgY3V0b2ZmKSB7XHJcblx0dGhpcy5saWdodHMucHVzaCh7XHJcblx0XHR0eXBlOiBwa3pvLlNQT1RfTElHSFQsXHJcblx0XHRwb3NpdGlvbjogcG9zaXRpb24sXHJcbiAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdHJhbmdlOiByYW5nZSxcclxuICAgIGN1dG9mZjogY3V0b2ZmXHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5kcmF3U29saWRzID0gZnVuY3Rpb24gKGdsLCBzaGFkZXIpIHtcclxuXHR0aGlzLnNvbGlkcy5mb3JFYWNoKGZ1bmN0aW9uIChzb2xpZCkge1xyXG5cdFx0dmFyIG5vcm0gPSBwa3pvLm11bHRNYXRyaXgocGt6by5tYXQzKHRoaXMudmlld01hdHJpeCksIHBrem8ubWF0Myhzb2xpZC50cmFuc2Zvcm0pKTtcclxuXHRcdFx0XHRcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxNYXRyaXgnLCBzb2xpZC50cmFuc2Zvcm0pO1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm1NYXRyaXgzZnYoJ3VOb3JtYWxNYXRyaXgnLCBub3JtKTtcclxuXHRcdFxyXG5cdFx0c29saWQubWF0ZXJpYWwuc2V0dXAoZ2wsIHNoYWRlcik7XHRcdFx0XHJcblx0XHRzb2xpZC5tZXNoLmRyYXcoZ2wsIHNoYWRlcik7XHJcblx0fSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmFtYmllbnRQYXNzID0gZnVuY3Rpb24gKGdsLCBhbWJpZW50TGlnaHQpIHtcclxuXHR2YXIgc2hhZGVyID0gdGhpcy5hbWJpZW50U2hhZGVyO1x0XHRcclxuXHRzaGFkZXIuYmluZCgpO1xyXG5cdFxyXG5cdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1UHJvamVjdGlvbk1hdHJpeCcsIHRoaXMucHJvamVjdGlvbk1hdHJpeCk7XHRcdFxyXG5cdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1Vmlld01hdHJpeCcsXHRcdFx0XHR0aGlzLnZpZXdNYXRyaXgpO1x0XHRcclxuXHRcclxuXHRzaGFkZXIuc2V0VW5pZm9ybTNmdigndUFtYmllbnRMaWdodCcsIGFtYmllbnRMaWdodCk7XHRcdFxyXG5cdFx0XHJcblx0dGhpcy5kcmF3U29saWRzKGdsLCBzaGFkZXIpO1x0XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmxpZ2h0UGFzcyA9IGZ1bmN0aW9uIChnbCwgbGlnaHQpIHtcclxuXHR2YXIgc2hhZGVyID0gdGhpcy5saWdodFNoYWRlcjtcdFx0XHJcblx0c2hhZGVyLmJpbmQoKTtcclxuXHRcclxuXHRzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVByb2plY3Rpb25NYXRyaXgnLCB0aGlzLnByb2plY3Rpb25NYXRyaXgpO1x0XHRcclxuXHRzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVZpZXdNYXRyaXgnLFx0XHRcdFx0dGhpcy52aWV3TWF0cml4KTtcdFx0XHJcblx0XHJcblx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUxpZ2h0VHlwZScsIGxpZ2h0LnR5cGUpO1xyXG5cdGlmIChsaWdodC5kaXJlY3Rpb24pIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1TGlnaHREaXJlY3Rpb24nLCBsaWdodC5kaXJlY3Rpb24pO1xyXG5cdH1cdCBcclxuXHRpZiAobGlnaHQucG9zaXRpb24pIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1TGlnaHRQb3NpdGlvbicsIGxpZ2h0LnBvc2l0aW9uKTtcclxuXHR9XHJcblx0aWYgKGxpZ2h0LnJhbmdlKSB7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFmKCd1TGlnaHRSYW5nZScsIGxpZ2h0LnJhbmdlKTtcclxuXHR9XHJcbiAgaWYgKGxpZ2h0LmN1dG9mZikge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xZigndUxpZ2h0Q3V0b2ZmJywgbGlnaHQuY3V0b2ZmKTtcclxuXHR9XHJcblx0c2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VMaWdodENvbG9yJywgbGlnaHQuY29sb3IpO1xyXG5cdFxyXG5cdHRoaXMuZHJhd1NvbGlkcyhnbCwgc2hhZGVyKTtcdFxyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoc2NlbmUpIHtcclxuXHR2YXIgcmVuZGVyZXIgPSB0aGlzO1xyXG5cdFxyXG5cdHRoaXMuc29saWRzID0gW107XHJcblx0dGhpcy5saWdodHMgPSBbXTtcclxuXHRzY2VuZS5lbnF1ZXVlKHRoaXMpO1xyXG5cdFxyXG5cdHRoaXMuY2FudmFzLmRyYXcoZnVuY3Rpb24gKGdsKSB7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcclxuXHRcdGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xyXG5cdFx0Z2wuZGlzYWJsZShnbC5CTEVORCk7XHJcblx0XHRcclxuXHRcdHJlbmRlcmVyLmFtYmllbnRQYXNzKGdsLCBzY2VuZS5hbWJpZW50TGlnaHQpO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoZ2wuQkxFTkQpO1xyXG5cdFx0Z2wuYmxlbmRGdW5jKGdsLk9ORSwgZ2wuT05FKTtcclxuXHRcdFxyXG5cdFx0cmVuZGVyZXIubGlnaHRzLmZvckVhY2goZnVuY3Rpb24gKGxpZ2h0KSB7XHJcblx0XHRcdHJlbmRlcmVyLmxpZ2h0UGFzcyhnbCwgbGlnaHQpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9