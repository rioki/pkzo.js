
var pkzo = {version: '0.0.1'};

pkzo.AmbientFrag = "precision mediump float;\n\n\n\nuniform vec3      uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool      uHasTexture;\n\n\n\nuniform vec3 uAmbientLight;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    vec3 color = uColor;\n\n    \n\n    if (uHasTexture) {\n\n        color = color * texture2D(uTexture, vTexCoord).rgb;\n\n    }\n\n    \n\n    gl_FragColor = vec4(color * uAmbientLight, 1);\n\n}\n\n";
pkzo.LightFrag = "precision mediump float;\n\n\n\nuniform vec3      uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool      uHasTexture;\n\n\n\nuniform int   uLightType; // 1: directional, 2: point, 3: spot\n\nuniform vec3  uLightColor;\n\nuniform vec3  uLightDirection;\n\nuniform vec3  uLightPosition;\n\nuniform float uLightRange;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\nvarying vec3 vPosition;\n\n\n\nvoid main() {\n\n    vec3 color = uColor;    \n\n    if (uHasTexture) {\n\n        color = color * texture2D(uTexture, vTexCoord).rgb;\n\n    }\n\n    \n\n    vec3 normal = normalize(vNormal);\n\n    \n\n    vec3 lightDirection;\n\n    float atten;\n\n    if (uLightType == 1) {\n\n        lightDirection = normalize(-uLightDirection);\n\n        atten = 1.0;\n\n    }\n\n    if (uLightType == 2) {\n\n        lightDirection = uLightPosition - vPosition;\n\n        float dist = length(lightDirection);\n\n        if (dist > uLightRange) {\n\n            discard;\n\n        }\n\n        lightDirection = normalize(lightDirection);\n\n        atten = 1.0 - (dist / uLightRange);    \n\n    }\n\n    \n\n    vec3 result = vec3(0);    \n\n    float nDotL = dot(normal, lightDirection);\n\n    if (nDotL > 0.0) {    \n\n        result += nDotL * color * uLightColor * atten;\n\n    }\n\n        \n\n    gl_FragColor = vec4(result, 1);\n\n}                           \n\n";
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBrem8uanMiLCJzaGFkZXJzLmpzIiwidmVjdG9yLmpzIiwibWF0cml4LmpzIiwiQ2FudmFzLmpzIiwiVGV4dHVyZS5qcyIsIlNoYWRlci5qcyIsIlNjZW5lLmpzIiwiQnVmZmVyLmpzIiwiTWVzaC5qcyIsIk1hdGVyaWFsLmpzIiwiRW50aXR5LmpzIiwiQ2FtZXJhLmpzIiwiT2JqZWN0LmpzIiwiRGlyZWN0aW9uYWxMaWdodC5qcyIsIlBvaW50TGlnaHQuanMiLCJSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJwa3pvLTAuMC4xLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBwa3pvID0ge3ZlcnNpb246ICcwLjAuMSd9O1xyXG4iLCJwa3pvLkFtYmllbnRGcmFnID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIHZlYzMgICAgICB1Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmU7XFxuXFxudW5pZm9ybSBib29sICAgICAgdUhhc1RleHR1cmU7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzIHVBbWJpZW50TGlnaHQ7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgdmVjMyBjb2xvciA9IHVDb2xvcjtcXG5cXG4gICAgXFxuXFxuICAgIGlmICh1SGFzVGV4dHVyZSkge1xcblxcbiAgICAgICAgY29sb3IgPSBjb2xvciAqIHRleHR1cmUyRCh1VGV4dHVyZSwgdlRleENvb3JkKS5yZ2I7XFxuXFxuICAgIH1cXG5cXG4gICAgXFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IgKiB1QW1iaWVudExpZ2h0LCAxKTtcXG5cXG59XFxuXFxuXCI7XG5wa3pvLkxpZ2h0RnJhZyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzICAgICAgdUNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlO1xcblxcbnVuaWZvcm0gYm9vbCAgICAgIHVIYXNUZXh0dXJlO1xcblxcblxcblxcbnVuaWZvcm0gaW50ICAgdUxpZ2h0VHlwZTsgLy8gMTogZGlyZWN0aW9uYWwsIDI6IHBvaW50LCAzOiBzcG90XFxuXFxudW5pZm9ybSB2ZWMzICB1TGlnaHRDb2xvcjtcXG5cXG51bmlmb3JtIHZlYzMgIHVMaWdodERpcmVjdGlvbjtcXG5cXG51bmlmb3JtIHZlYzMgIHVMaWdodFBvc2l0aW9uO1xcblxcbnVuaWZvcm0gZmxvYXQgdUxpZ2h0UmFuZ2U7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG52YXJ5aW5nIHZlYzMgdlBvc2l0aW9uO1xcblxcblxcblxcbnZvaWQgbWFpbigpIHtcXG5cXG4gICAgdmVjMyBjb2xvciA9IHVDb2xvcjsgICAgXFxuXFxuICAgIGlmICh1SGFzVGV4dHVyZSkge1xcblxcbiAgICAgICAgY29sb3IgPSBjb2xvciAqIHRleHR1cmUyRCh1VGV4dHVyZSwgdlRleENvb3JkKS5yZ2I7XFxuXFxuICAgIH1cXG5cXG4gICAgXFxuXFxuICAgIHZlYzMgbm9ybWFsID0gbm9ybWFsaXplKHZOb3JtYWwpO1xcblxcbiAgICBcXG5cXG4gICAgdmVjMyBsaWdodERpcmVjdGlvbjtcXG5cXG4gICAgZmxvYXQgYXR0ZW47XFxuXFxuICAgIGlmICh1TGlnaHRUeXBlID09IDEpIHtcXG5cXG4gICAgICAgIGxpZ2h0RGlyZWN0aW9uID0gbm9ybWFsaXplKC11TGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgYXR0ZW4gPSAxLjA7XFxuXFxuICAgIH1cXG5cXG4gICAgaWYgKHVMaWdodFR5cGUgPT0gMikge1xcblxcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSB1TGlnaHRQb3NpdGlvbiAtIHZQb3NpdGlvbjtcXG5cXG4gICAgICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgobGlnaHREaXJlY3Rpb24pO1xcblxcbiAgICAgICAgaWYgKGRpc3QgPiB1TGlnaHRSYW5nZSkge1xcblxcbiAgICAgICAgICAgIGRpc2NhcmQ7XFxuXFxuICAgICAgICB9XFxuXFxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IG5vcm1hbGl6ZShsaWdodERpcmVjdGlvbik7XFxuXFxuICAgICAgICBhdHRlbiA9IDEuMCAtIChkaXN0IC8gdUxpZ2h0UmFuZ2UpOyAgICBcXG5cXG4gICAgfVxcblxcbiAgICBcXG5cXG4gICAgdmVjMyByZXN1bHQgPSB2ZWMzKDApOyAgICBcXG5cXG4gICAgZmxvYXQgbkRvdEwgPSBkb3Qobm9ybWFsLCBsaWdodERpcmVjdGlvbik7XFxuXFxuICAgIGlmIChuRG90TCA+IDAuMCkgeyAgICBcXG5cXG4gICAgICAgIHJlc3VsdCArPSBuRG90TCAqIGNvbG9yICogdUxpZ2h0Q29sb3IgKiBhdHRlbjtcXG5cXG4gICAgfVxcblxcbiAgICAgICAgXFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQocmVzdWx0LCAxKTtcXG5cXG59ICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXFxuXCI7XG5wa3pvLlNvbGlkRnJhZyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzIHVDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZTtcXG5cXG51bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgaWYgKHVIYXNUZXh0dXJlKSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkgKiB2ZWM0KHVDb2xvciwgMSk7XFxuXFxuICAgIH1cXG5cXG4gICAgZWxzZSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHVDb2xvciwgMSk7XFxuXFxuICAgIH1cXG5cXG59XCI7XG5wa3pvLlNvbGlkVmVydCA9IFwiXFxuXFxudW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xcblxcbnVuaWZvcm0gbWF0NCB1Vmlld01hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDQgdU1vZGVsTWF0cml4O1xcblxcbnVuaWZvcm0gbWF0MyB1Tm9ybWFsTWF0cml4O1xcblxcblxcblxcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXg7XFxuXFxuYXR0cmlidXRlIHZlYzMgYU5vcm1hbDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhVGV4Q29vcmQ7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG52YXJ5aW5nIHZlYzMgdlBvc2l0aW9uO1xcblxcblxcblxcbnZvaWQgbWFpbigpIHtcXG5cXG4gIHZOb3JtYWwgICAgID0gdU5vcm1hbE1hdHJpeCAqIGFOb3JtYWw7XFxuXFxuICB2VGV4Q29vcmQgICA9IGFUZXhDb29yZDtcXG5cXG4gIHZQb3NpdGlvbiAgID0gdmVjMyh1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXgsIDEuMCkpO1xcblxcbiAgZ2xfUG9zaXRpb24gPSB1UHJvamVjdGlvbk1hdHJpeCAqIHVWaWV3TWF0cml4ICogdU1vZGVsTWF0cml4ICogdmVjNChhVmVydGV4LCAxKTtcXG5cXG59XCI7XG4iLCJcclxucGt6by52ZWMyID0gZnVuY3Rpb24gKHYwLCB2MSkge1xyXG4gIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICB0eXBlb2YgdjEgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYwXSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYxID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MV0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDIpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by52ZWMzID0gZnVuY3Rpb24gKHYwLCB2MSwgdjIpIHtcclxuICBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgdHlwZW9mIHYxID09PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgdjIgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYwLCB2MF0pO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MSA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYyID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MSwgdjJdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgzKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8udmVjNCA9IGZ1bmN0aW9uICh2MCwgdjEsIHYyLCB2NCkge1xyXG4gIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICB0eXBlb2YgdjEgPT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiB2MiA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIHYzID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MCwgdjAsIHYwXSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYxID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjIgPT09ICdudW1iZXInICYmXHJcbiAgICAgICAgICAgdHlwZW9mIHYzID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MSwgdjIsIHY0XSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLm5lZyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KHYubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHYubGVuZ3RoOyBpKyspIHtcclxuICAgIHJbaV0gPSAtdltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbi8vIGFkZCBhbmQgc3ViIGFsc28gd29yayBmb3IgbWF0cml4XHJcbnBrem8uYWRkID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gKyBiW2ldO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5zdWIgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSAtIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHYgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgdiArPSBhW2ldICogYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbnBrem8uY3Jvc3MgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIC8vIGFzc3VtZSBhLmxlbmd0aCA9PSBiLmxlbmd0aCA9PSAzXHJcbiAgXHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gIFxyXG4gIHJbMF0gPSAoYVsxXSAqIGJbMl0pIC0gKGFbMl0gKiBiWzFdKTtcclxuICByWzFdID0gKGFbMl0gKiBiWzBdKSAtIChhWzBdICogYlsyXSk7XHJcbiAgclsyXSA9IChhWzBdICogYlsxXSkgLSAoYVsxXSAqIGJbMF0pO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLm11bHRWZWN0b3JTY2FsYXIgPSBmdW5jdGlvbiAodiwgcykge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSh2Lmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gdltpXSAqIHM7XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLmxlbmd0aCA9IGZ1bmN0aW9uICh2KSB7ICBcclxuICByZXR1cm4gTWF0aC5zcXJ0KHBrem8uZG90KHYsIHYpKTtcclxufVxyXG5cclxucGt6by5ub3JtYWxpemUgPSBmdW5jdGlvbiAodikge1xyXG4gIHJldHVybiBwa3pvLm11bHRWZWN0b3JTY2FsYXIodiwgMSAvIHBrem8ubGVuZ3RoKHYpKTtcclxufVxyXG5cclxucGt6by5tdWx0TWF0cml4VmVjdG9yID0gZnVuY3Rpb24gKG0sIHYpIHtcclxuXHR2YXIgbiA9IHYubGVuZ3RoO1xyXG5cdHZhciByID0gbmV3IEZsb2F0MzJBcnJheShuKTtcclxuXHRcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKylcclxuXHR7XHJcblx0XHRyW2ldID0gMDtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgbjsgaisrKVxyXG5cdFx0e1xyXG5cdFx0XHRcdHJbaV0gKz0gbVtpKm4ral0gKiB2W2pdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gcjtcclxufVxyXG4iLCJcclxucGt6by5tYXQzID0gZnVuY3Rpb24gKHYpIHtcclxuICBpZiAodiAmJiB2Lmxlbmd0aCAmJiB2Lmxlbmd0aCA9PSAxNikge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdlswXSwgdlsxXSwgdlsyXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbNF0sIHZbNV0sIHZbNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzhdLCB2WzldLCB2WzEwXV0pO1xyXG5cdH1cclxuXHRpZiAodiAmJiB2Lmxlbmd0aCkge1xyXG4gICAgaWYgKHYubGVuZ3RoICE9IDkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXQzIG11c3QgYmUgOSB2YWx1ZXMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KHYpO1xyXG4gIH1cclxuICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdiwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCB2LCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIHZdKTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDFdKTtcclxufVxyXG5cclxucGt6by5tYXQ0ID0gZnVuY3Rpb24gKHYpIHtcclxuICBpZiAodiAmJiB2Lmxlbmd0aCkgeyAgICBcclxuICAgIGlmICh2Lmxlbmd0aCAhPSAxNikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDQgbXVzdCBiZSAxNiB2YWx1ZXMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KHYpO1xyXG4gIH1cclxuICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdiwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCB2LCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIHYsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgdl0pO1xyXG4gIH1cclxuICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgMV0pO1xyXG59XHJcblxyXG5wa3pvLm11bHRNYXRyaXggPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIC8vIGFzc3VtZSBhLmxlbmd0aCA9PSBiLmxlbmd0aFxyXG4gIHZhciBuID0gTWF0aC5zcXJ0KGEubGVuZ3RoKTtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKykge1xyXG4gICAgICB2YXIgdiA9IDA7XHJcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbjsgaysrKSB7XHJcbiAgICAgICAgdiA9IHYgKyBhW2kqbitrXSAqIGJbaypuK2pdO1xyXG4gICAgICB9XHJcbiAgICAgIHJbaSpuK2pdID0gdjtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8ucmFkaWFucyA9IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcclxuICByZXR1cm4gZGVncmVlcyAqIE1hdGguUEkgLyAxODA7XHJcbn07XHJcblxyXG5wa3pvLmRlZ3JlZXMgPSBmdW5jdGlvbihyYWRpYW5zKSB7XHJcbiAgcmV0dXJuIHJhZGlhbnMgKiAxODAgLyBNYXRoLlBJO1xyXG59OyBcclxuXHJcblxyXG5wa3pvLm9ydGhvID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XHJcbiAgdmFyIHJsID0gKHJpZ2h0IC0gbGVmdCk7XHJcbiAgdmFyIHRiID0gKHRvcCAtIGJvdHRvbSk7XHJcbiAgdmFyIGZuID0gKGZhciAtIG5lYXIpO1xyXG4gIFxyXG4gIHZhciBtID0gcGt6by5tYXQ0KCk7ICBcclxuICBcclxuICBtWzBdID0gMiAvIHJsO1xyXG4gIG1bMV0gPSAwO1xyXG4gIG1bMl0gPSAwO1xyXG4gIG1bM10gPSAwO1xyXG4gIG1bNF0gPSAwO1xyXG4gIG1bNV0gPSAyIC8gdGI7XHJcbiAgbVs2XSA9IDA7XHJcbiAgbVs3XSA9IDA7XHJcbiAgbVs4XSA9IDA7XHJcbiAgbVs5XSA9IDA7XHJcbiAgbVsxMF0gPSAtMiAvIGZuO1xyXG4gIG1bMTFdID0gMDtcclxuICBtWzEyXSA9IC0obGVmdCArIHJpZ2h0KSAvIHJsO1xyXG4gIG1bMTNdID0gLSh0b3AgKyBib3R0b20pIC8gdGI7XHJcbiAgbVsxNF0gPSAtKGZhciArIG5lYXIpIC8gZm47XHJcbiAgbVsxNV0gPSAxO1xyXG5cclxuICByZXR1cm4gbTtcclxufVxyXG5cclxucGt6by5mcnVzdHVtID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgem5lYXIsIHpmYXIpIHtcclxuICB2YXIgdDEgPSAyICogem5lYXI7XHJcbiAgdmFyIHQyID0gcmlnaHQgLSBsZWZ0O1xyXG4gIHZhciB0MyA9IHRvcCAtIGJvdHRvbTtcclxuICB2YXIgdDQgPSB6ZmFyIC0gem5lYXI7XHJcblxyXG4gIHZhciBtID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XHJcbiAgXHJcbiAgbVswXSA9IHQxL3QyOyBtWzRdID0gICAgIDA7IG1bIDhdID0gIChyaWdodCArIGxlZnQpIC8gdDI7IG1bMTJdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgbVsxXSA9ICAgICAwOyBtWzVdID0gdDEvdDM7IG1bIDldID0gICh0b3AgKyBib3R0b20pIC8gdDM7IG1bMTNdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgbVsyXSA9ICAgICAwOyBtWzZdID0gICAgIDA7IG1bMTBdID0gKC16ZmFyIC0gem5lYXIpIC8gdDQ7IG1bMTRdID0gKC10MSAqIHpmYXIpIC8gdDQ7XHJcbiAgbVszXSA9ICAgICAwOyBtWzddID0gICAgIDA7IG1bMTFdID0gICAgICAgICAgICAgICAgICAgLTE7IG1bMTVdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnBrem8ucGVyc3BlY3RpdmUgPSBmdW5jdGlvbiAoZm92eSwgYXNwZWN0LCB6bmVhciwgemZhcikge1xyXG4gIHZhciB5bWF4ID0gem5lYXIgKiBNYXRoLnRhbihwa3pvLnJhZGlhbnMoZm92eSkpO1xyXG4gIHZhciB4bWF4ID0geW1heCAqIGFzcGVjdDtcclxuICByZXR1cm4gcGt6by5mcnVzdHVtKC14bWF4LCB4bWF4LCAteW1heCwgeW1heCwgem5lYXIsIHpmYXIpO1xyXG59XHJcblxyXG4vLyBOT1RFOiB0aGlzIGlzIGluZWZmaWNpZW50LCBpdCBtYXkgYmUgc2Vuc2libGUgdG8gcHJvdmlkZSBpbnBsYWNlIHZlcnNpb25zXHJcbnBrem8udHJhbnNsYXRlID0gZnVuY3Rpb24obSwgeCwgeSwgeikgeyAgICBcclxuICB2YXIgciA9IHBrem8ubWF0NChtKTtcclxuICByWzEyXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXTtcclxuICByWzEzXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcclxuICByWzE0XSA9IG1bMl0gKiB4ICsgbVs2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcclxuICByWzE1XSA9IG1bM10gKiB4ICsgbVs3XSAqIHkgKyBtWzExXSAqIHogKyBtWzE1XTtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5yb3RhdGUgPSBmdW5jdGlvbiAobSwgYW5nbGUsIHgsIHksIHopIHsgIFxyXG4gIHZhciBhID0gcGt6by5yYWRpYW5zKGFuZ2xlKTtcclxuICB2YXIgYyA9IE1hdGguY29zKGEpO1xyXG4gIHZhciBzID0gTWF0aC5zaW4oYSk7XHJcbiAgXHJcbiAgdmFyIGwgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICB2YXIgbnggPSB4IC8gbDtcclxuICB2YXIgbnkgPSB5IC8gbDtcclxuICB2YXIgbnogPSB6IC8gbDtcclxuXHJcbiAgdmFyIHQwID0gbnggKiAoMSAtIGMpO1xyXG4gIHZhciB0MSA9IG55ICogKDEgLSBjKTtcclxuICB2YXIgdDIgPSBueiAqICgxIC0gYyk7ICBcclxuXHJcbiAgdmFyIGQgPSBwa3pvLm1hdDQoMSk7XHJcbiAgXHJcbiAgZFsgMF0gPSBjICsgdDAgKiBueDtcclxuICBkWyAxXSA9IDAgKyB0MCAqIG55ICsgcyAqIG56O1xyXG4gIGRbIDJdID0gMCArIHQwICogbnogLSBzICogbnk7XHJcblxyXG4gIGRbIDRdID0gMCArIHQxICogbnggLSBzICogbno7XHJcbiAgZFsgNV0gPSBjICsgdDEgKiBueTtcclxuICBkWyA2XSA9IDAgKyB0MSAqIG56ICsgcyAqIG54O1xyXG5cclxuICBkWyA4XSA9IDAgKyB0MiAqIG54ICsgcyAqIG55O1xyXG4gIGRbIDldID0gMCArIHQyICogbnkgLSBzICogbng7XHJcbiAgZFsxMF0gPSBjICsgdDIgKiBuejsgIFxyXG4gIFxyXG4gIHZhciByID0gcGt6by5tdWx0TWF0cml4KG0sIGQpO1xyXG4gIFxyXG4gIHJbMTJdID0gbVsxMl07XHJcbiAgclsxM10gPSBtWzEzXTtcclxuICByWzE0XSA9IG1bMTRdO1xyXG4gIHJbMTVdID0gbVsxNV07XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8uc2NhbGUgPSBmdW5jdGlvbihtLCB4LCB5LCB6KSB7ICAgIFxyXG4gIHZhciByID0gcGt6by5tYXQ0KDEpO1xyXG4gIFxyXG4gIHJbIDBdID0gbVsgMF0gKiB4OyBcclxuICByWyAxXSA9IG1bIDFdICogeDsgXHJcbiAgclsgMl0gPSBtWyAyXSAqIHg7IFxyXG4gIHJbIDNdID0gbVsgM10gKiB4OyBcclxuICBcclxuICByWyA0XSA9IG1bIDRdICogeTsgXHJcbiAgclsgNV0gPSBtWyA1XSAqIHk7IFxyXG4gIHJbIDZdID0gbVsgNl0gKiB5OyBcclxuICByWyA3XSA9IG1bIDddICogeTsgXHJcbiAgXHJcbiAgclsgOF0gPSBtWyA4XSAqIHo7XHJcbiAgclsgOV0gPSBtWyA5XSAqIHo7XHJcbiAgclsxMF0gPSBtWzEwXSAqIHo7XHJcbiAgclsxMV0gPSBtWzExXSAqIHo7XHJcbiAgXHJcbiAgclsxMl0gPSBtWzEyXTtcclxuICByWzEzXSA9IG1bMTNdO1xyXG4gIHJbMTRdID0gbVsxNF07XHJcbiAgclsxNV0gPSBtWzE1XTtcclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by50cmFuc3Bvc2UgPSBmdW5jdGlvbihtKSB7ICAgIFxyXG4gIHZhciBuID0gTWF0aC5zcXJ0KG0ubGVuZ3RoKTtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkobS5sZW5ndGgpO1xyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKykge1xyXG4gICAgICByW2oqbitpXSA9IG1baSpuK2pdO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG4iLCJcclxucGt6by5DYW52YXMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5jYW52YXMgPSBlbGVtZW50O1xyXG4gIH0gIFxyXG4gIFxyXG4gIHRoaXMuY2FudmFzLndpZHRoICA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xyXG4gIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIiwge2FudGlhbGlhczogdHJ1ZSwgZGVwdGg6IHRydWV9KTtcclxuICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcclxuICBcclxuICAvLyB0aGVzZSB2YWx1ZXMgYXJlIGZvciB0aGUgcHJvZ3JhbW1lciBvZiB0aGUgZHJhdyBmdW5jdGlvbiwgXHJcbiAgLy8gd2UgcGFzcyB0aGUgZ2wgb2JqZWN0LCBub3QgdGhlIGNhbnZhcy5cclxuICB0aGlzLmdsLndpZHRoICA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gIHRoaXMuZ2wuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG59XHJcblxyXG5wa3pvLkNhbnZhcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChjYikge1xyXG4gIGlmIChjYikge1xyXG4gICAgY2IuY2FsbCh0aGlzLCB0aGlzLmdsKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQ2FudmFzLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGNiKSB7ICBcclxuICBpZiAodGhpcy5jYW52YXMud2lkdGggIT0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGggfHwgdGhpcy5jYW52YXMuaGVpZ2h0ICE9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodCkge1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggID0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7ICBcclxuICAgIHRoaXMuZ2wud2lkdGggID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICB0aGlzLmdsLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IHRoaXMuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbiAgXHJcbiAgaWYgKGNiKSB7XHJcbiAgICBjYi5jYWxsKHRoaXMsIHRoaXMuZ2wpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLlRleHR1cmUgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgdGhpcy51cmwgICAgPSB1cmw7XHJcbiAgdGhpcy5pbWFnZSAgPSBudWxsO1xyXG4gIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgXHJcbiAgLy8gd2UgZG9uJ3QgdXBsb2FkIHRoZSBpbWFnZSB0byBWUkFNLCBidXQgdHJ5IHRvIGxvYWQgaXRcclxuICB0aGlzLmxvYWQoKTtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKCkge1x0XHJcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIHZhciB0ZXh0dXJlID0gdGhpcztcclxuICB0aGlzLmltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRleHR1cmUubG9hZGVkID0gdHJ1ZTsgICAgXHJcbiAgfTtcclxuICB0aGlzLmltYWdlLnNyYyA9IHRoaXMudXJsO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuaWQpO1xyXG4gIFxyXG4gIGlmICh0aGlzLmxvYWRlZCkge1xyXG4gICAgdGhpcy5zeW5jKCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV8yRCwgMCwgdGhpcy5nbC5SR0JBLCAxLCAxLCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuaWQpOyAgXHJcbiAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV8yRCwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy5pbWFnZSk7ICBcclxuICB0aGlzLmdsLmdlbmVyYXRlTWlwbWFwKHRoaXMuZ2wuVEVYVFVSRV8yRCk7XHJcbiAgXHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMuZ2wuTElORUFSKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5nbC5MSU5FQVJfTUlQTUFQX0xJTkVBUik7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX1dSQVBfUywgdGhpcy5nbC5SRVBFQVQpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMuZ2wuUkVQRUFUKTtcclxuICBcclxuICAvLyBjYW4gd2UgZGlzY2FyZCBpbWFnZSBub3c/XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmdsLmRlbGV0ZVRleHR1cmUodGhpcy5pZCk7XHJcbiAgdGhpcy5pZCA9IG51bGw7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChnbCwgY2hhbm5lbCkge1xyXG5cdHRoaXMuZ2wgPSBnbDtcclxuICBpZiAoISB0aGlzLmlkKSB7XHJcbiAgICB0aGlzLnVwbG9hZCgpO1xyXG4gIH1cclxuXHQvLyBUT0RPIGNoYW5uZWxcclxuICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5pZCk7XHJcbn1cclxuIiwiXHJcbnBrem8uU2hhZGVyID0gZnVuY3Rpb24gKGdsLCB2ZXJ0ZXhDb2RlLCBmcmFnbWVudENvZGUpIHtcclxuICB0aGlzLmdsICAgICAgICAgICA9IGdsO1xyXG4gIHRoaXMudmVydGV4Q29kZSAgID0gdmVydGV4Q29kZTtcclxuICB0aGlzLmZyYWdtZW50Q29kZSA9IGZyYWdtZW50Q29kZTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmNvbXBpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHZlcnRleFNoYWRlciAgID0gdGhpcy5jb21waWxlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUiwgICB0aGlzLnZlcnRleENvZGUpO1xyXG4gIHZhciBmcmFnbWVudFNoYWRlciA9IHRoaXMuY29tcGlsZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUiwgdGhpcy5mcmFnbWVudENvZGUpO1xyXG4gIFxyXG4gIHZhciBwcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgXHJcbiAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcclxuICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XHJcbiAgXHJcbiAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICBcclxuICB2YXIgaW5mb0xvZyA9IHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XHJcbiAgaWYgKHRoaXMuZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCB0aGlzLmdsLkxJTktfU1RBVFVTKSA9PT0gZmFsc2UpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihpbmZvTG9nKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoaW5mb0xvZyAhPT0gJycpIHtcclxuICAgIGNvbnNvbGUubG9nKGluZm9Mb2cpO1xyXG4gIH1cclxuICBcclxuICB0aGlzLmdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xyXG4gIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcclxuICBcclxuICB0aGlzLmlkID0gcHJvZ3JhbTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmNvbXBpbGVTaGFkZXIgPSBmdW5jdGlvbiAodHlwZSwgY29kZSkge1xyXG4gIHZhciBpZCA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHR5cGUpOyAgXHJcbiAgXHJcbiAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoaWQsIGNvZGUpO1xyXG4gIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihpZCk7XHJcbiAgXHJcbiAgdmFyIGluZm9Mb2cgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coaWQpO1xyXG4gIGlmICh0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihpZCwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykgPT09IGZhbHNlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoaW5mb0xvZyk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGluZm9Mb2cgIT09ICcnKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbmZvTG9nKTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGlkO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmdsLmRlbGV0ZVByb2dyYW0oaWQpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuaWQpIHtcclxuICAgIHRoaXMuY29tcGlsZSgpO1xyXG4gIH1cclxuICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5pZCk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRBcnJ0aWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgYnVmZmVyLCBlbGVtZW50U2l6ZSkgeyAgXHJcbiAgYnVmZmVyLmJpbmQoKTsgIFxyXG4gIFxyXG4gIGlmIChlbGVtZW50U2l6ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB2YXIgZWxlbWVudFNpemUgPSBidWZmZXIuZWxlbWVudFNpemU7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBwb3MgPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zKTtcclxuICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zLCBlbGVtZW50U2l6ZSwgYnVmZmVyLmVsZW1lbnRUeXBlLCB0aGlzLmdsLkZBTFNFLCAwLCAwKTsgIFxyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTFpID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTFpKGxvYywgdmFsdWUpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTFmID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTFmKGxvYywgdmFsdWUpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTJmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0yZihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtM2Z2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTNmKGxvYywgdmFsdWVbMF0sIHZhbHVlWzFdLCB2YWx1ZVsyXSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtNGZ2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTRmKGxvYywgdmFsdWVbMF0sIHZhbHVlWzFdLCB2YWx1ZVsyXSwgdmFsdWVbNF0pO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybU1hdHJpeDNmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgdHJhbnNwb3NlKSB7XHJcbiAgaWYgKHRyYW5zcG9zZSA9PT0gdW5kZWZpbmVkIHx8dHJhbnNwb3NlID09PSBudWxsKSB7XHJcbiAgICB2YXIgdHJhbnNwb3NlID0gZmFsc2U7XHJcbiAgfVxyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYobG9jLCB0cmFuc3Bvc2UsIHZhbHVlKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm1NYXRyaXg0ZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIHRyYW5zcG9zZSkge1xyXG4gIGlmICh0cmFuc3Bvc2UgPT09IHVuZGVmaW5lZCB8fHRyYW5zcG9zZSA9PT0gbnVsbCkge1xyXG4gICAgdmFyIHRyYW5zcG9zZSA9IGZhbHNlO1xyXG4gIH1cclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtTWF0cml4NGZ2KGxvYywgdHJhbnNwb3NlLCB2YWx1ZSk7XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5TY2VuZSA9IGZ1bmN0aW9uICgpIHtcclxuXHR0aGlzLmFtYmllbnRMaWdodCA9IHBrem8udmVjMygwLjIsIDAuMiwgMC4yKTtcdFxyXG59XHJcblxyXG5wa3pvLlNjZW5lLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcblx0aWYgKHRoaXMuZW50aXRpZXMpIHtcclxuXHRcdHRoaXMuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50aXR5KSB7XHJcblx0XHRcdGVudGl0eS5lbnF1ZXVlKHJlbmRlcmVyKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxucGt6by5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVudGl0eSkge1xyXG4gIGlmICghIHRoaXMuZW50aXRpZXMpIHtcclxuICAgIHRoaXMuZW50aXRpZXMgPSBbZW50aXR5XVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xyXG4gIH1cclxufSIsIlxyXG5wa3pvLkJ1ZmZlciA9IGZ1bmN0aW9uIChnbCwgZGF0YSwgYnR5cGUsIGV0eXBlKSB7XHJcbiAgdGhpcy5nbCA9IGdsO1xyXG4gIFxyXG4gIGlmIChidHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBnbC5BUlJBWV9CVUZGRVI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy50eXBlID0gYnR5cGU7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChldHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAodGhpcy50eXBlID09IGdsLkFSUkFZX0JVRkZFUikge1xyXG4gICAgICB0aGlzLmVsZW1lbnRUeXBlID0gZ2wuRkxPQVQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5lbGVtZW50VHlwZSA9IGdsLlVOU0lHTkVEX1NIT1JUO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZWxlbWVudFR5cGUgPSBldHlwZTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5sb2FkKGRhdGEpO1xyXG59XHJcblxyXG5wa3pvLndyYXBBcnJheSA9IGZ1bmN0aW9uIChnbCwgdHlwZSwgZGF0YSkge1xyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSBnbC5GTE9BVDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLkRPVUJMRTpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDY0QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX0JZVEU6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuVU5TSUdORURfU0hPUlQ6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDE2QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVDpcclxuICAgICAgcmV0dXJuIG5ldyBVaW50MzJBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuQllURTpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlNIT1JUOlxyXG4gICAgICByZXR1cm4gbmV3IEludDE2QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLklOVDpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQzMkFycmF5KGRhdGEpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoZGF0YSkgeyAgXHJcbiAgaWYgKGRhdGFbMF0ubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMuZWxlbWVudFNpemUgPSAxO1xyXG4gICAgdGhpcy5kYXRhID0gcGt6by53cmFwQXJyYXkodGhpcy5nbCwgdGhpcy5lbGVtZW50VHlwZSwgZGF0YSk7XHJcbiAgfVxyXG4gIGVsc2UgeyAgICBcclxuICAgIHRoaXMuZWxlbWVudFNpemUgPSBkYXRhWzBdLmxlbmd0aDtcclxuICAgIHRoaXMuZGF0YSA9IHBrem8ud3JhcEFycmF5KHRoaXMuZ2wsIHRoaXMuZWxlbWVudFR5cGUsIGRhdGEubGVuZ3RoICogdGhpcy5lbGVtU2l6ZSk7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB2YXIgYnVmZmVyID0gdGhpcztcclxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICBlbGVtLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICBidWZmZXIuZGF0YVtpXSA9IHY7XHJcbiAgICAgICAgaSsrO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy50eXBlLCB0aGlzLmlkKTtcclxuICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy50eXBlLCB0aGlzLmRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAodGhpcy5pZCkge1xyXG4gICAgdGhpcy5nbC5kZWxldGVCdWZmZXIodGhpcy5pZCk7XHJcbiAgICB0aGlzLmlkID0gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ocHJpbWl0aXZlKSB7XHJcbiAgaWYgKCEgdGhpcy5pZCkge1xyXG4gICAgdGhpcy51cGxvYWQoKTtcclxuICB9XHJcbiAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMudHlwZSwgdGhpcy5pZCk7XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24ocHJpbWl0aXZlKSB7XHJcbiAgdGhpcy5iaW5kKCk7XHJcbiAgdGhpcy5nbC5kcmF3RWxlbWVudHMocHJpbWl0aXZlLCB0aGlzLmRhdGEubGVuZ3RoLCB0aGlzLmVsZW1lbnRUeXBlLCAwKTtcclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLk1lc2ggPSBmdW5jdGlvbiAoKSB7fVxyXG5cclxucGt6by5NZXNoLnBsYW5lID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHdyZXMsIGhyZXMpIHtcclxuXHR2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuXHRcclxuXHR2YXIgdzIgPSB3aWR0aCAvIDIuMDtcclxuXHR2YXIgaDIgPSBoZWlnaHQgLyAyLjA7XHJcblx0dmFyIHdzID0gd2lkdGggLyB3cmVzO1xyXG5cdHZhciBocyA9IGhlaWdodCAvIGhyZXM7XHJcblx0dmFyIHRzID0gMS4wIC8gd3JlcztcclxuXHR2YXIgc3MgPSAxLjAgLyBocmVzO1xyXG5cdFxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDw9IHdyZXM7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPD0gaHJlczsgaisrKSB7XHJcblx0XHRcdHZhciB4ID0gLXcyICsgaSAqIHdzOyBcclxuXHRcdFx0dmFyIHkgPSAtaDIgKyBqICogaHM7XHJcblx0XHRcdHZhciB0ID0gaSAqIHRzO1xyXG5cdFx0XHR2YXIgcyA9IGogKiBzcztcclxuXHRcdFx0bWVzaC5hZGRWZXJ0ZXgocGt6by52ZWMzKHgsIHksIDApLCBwa3pvLnZlYzMoMCwgMCwgMSksIHBrem8udmVjMih0LCBzKSk7XHRcdFx0XHRcdFx0XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgd3JlczsgaSsrKSB7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGhyZXM7IGorKykge1xyXG5cdFx0XHR2YXIgYSA9IChpICsgMCkgKiB3cmVzICsgKGogKyAwKTtcclxuXHRcdFx0dmFyIGIgPSAoaSArIDApICogd3JlcyArIChqICsgMSk7XHJcblx0XHRcdHZhciBjID0gKGkgKyAxKSAqIHdyZXMgKyAoaiArIDEpO1xyXG5cdFx0XHR2YXIgZCA9IChpICsgMSkgKiB3cmVzICsgKGogKyAwKTtcclxuXHRcdFx0bWVzaC5hZGRUcmlhbmdsZShhLCBiLCBjKTtcclxuXHRcdFx0bWVzaC5hZGRUcmlhbmdsZShjLCBkLCBiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIG1lc2g7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5ib3ggPSBmdW5jdGlvbiAocykge1xyXG5cdFxyXG5cdHZhciBtZXNoID0gbmV3IHBrem8uTWVzaCgpO1xyXG5cdFxyXG5cdG1lc2gudmVydGljZXMgPSBcclxuXHRcdFx0WyAgc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLCBzWzFdLCBzWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgICAgXHJcblx0XHRcdFx0IHNbMF0sIHNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgICBzWzBdLC1zWzFdLC1zWzJdLCAgIHNbMF0sIHNbMV0sLXNbMl0sICAgIFxyXG5cdFx0XHRcdCBzWzBdLCBzWzFdLCBzWzJdLCAgIHNbMF0sIHNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgIC1zWzBdLCBzWzFdLCBzWzJdLCAgICBcclxuXHRcdFx0XHQtc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLCBzWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sLXNbMl0sICAtc1swXSwtc1sxXSwgc1syXSwgICAgXHJcblx0XHRcdFx0LXNbMF0sLXNbMV0sLXNbMl0sICAgc1swXSwtc1sxXSwtc1syXSwgICBzWzBdLC1zWzFdLCBzWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG5cdFx0XHRcdCBzWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdIF07ICBcclxuXHRcdFx0XHQgXHJcblx0bWVzaC5ub3JtYWxzID0gXHJcblx0XHRcdFsgIDAsIDAsIDEsICAgMCwgMCwgMSwgICAwLCAwLCAxLCAgIDAsIDAsIDEsICAgICBcclxuXHRcdFx0XHQgMSwgMCwgMCwgICAxLCAwLCAwLCAgIDEsIDAsIDAsICAgMSwgMCwgMCwgICAgIFxyXG5cdFx0XHRcdCAwLCAxLCAwLCAgIDAsIDEsIDAsICAgMCwgMSwgMCwgICAwLCAxLCAwLCAgICAgXHJcblx0XHRcdFx0LTEsIDAsIDAsICAtMSwgMCwgMCwgIC0xLCAwLCAwLCAgLTEsIDAsIDAsICAgICBcclxuXHRcdFx0XHQgMCwtMSwgMCwgICAwLC0xLCAwLCAgIDAsLTEsIDAsICAgMCwtMSwgMCwgICAgIFxyXG5cdFx0XHRcdCAwLCAwLC0xLCAgIDAsIDAsLTEsICAgMCwgMCwtMSwgICAwLCAwLC0xIF07ICAgXHJcblxyXG5cdG1lc2gudGV4Q29vcmRzID0gXHJcblx0XHRcdFsgIDEsIDEsICAgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgIFxyXG5cdFx0XHRcdCAwLCAxLCAgIDAsIDAsICAgMSwgMCwgICAxLCAxLCAgICBcclxuXHRcdFx0XHQgMSwgMCwgICAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAgXHJcblx0XHRcdFx0IDEsIDEsICAgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgIFxyXG5cdFx0XHRcdCAwLCAwLCAgIDEsIDAsICAgMSwgMSwgICAwLCAxLCAgICBcclxuXHRcdFx0XHQgMCwgMCwgICAxLCAwLCAgIDEsIDEsICAgMCwgMSBdOyAgXHJcblxyXG5cdG1lc2guaW5kaWNlcyA9IFxyXG5cdFx0XHRbICAwLCAxLCAyLCAgIDAsIDIsIDMsICAgXHJcblx0XHRcdFx0IDQsIDUsIDYsICAgNCwgNiwgNywgICBcclxuXHRcdFx0XHQgOCwgOSwxMCwgICA4LDEwLDExLCAgIFxyXG5cdFx0XHRcdDEyLDEzLDE0LCAgMTIsMTQsMTUsICAgXHJcblx0XHRcdFx0MTYsMTcsMTgsICAxNiwxOCwxOSwgICBcclxuXHRcdFx0XHQyMCwyMSwyMiwgIDIwLDIyLDIzIF07IFxyXG5cclxuXHRyZXR1cm4gbWVzaDtcclxufVxyXG5cclxucGt6by5NZXNoLmxvYWQgPSBmdW5jdGlvbiAoZmlsZSkge1xyXG5cdC8vIHNvbWV0aGluZyBzb21ldGhpbmcgeGhyXHJcblx0dmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcblx0XHJcblx0cmV0dXJuIG1lc2g7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuYWRkVmVydGV4ID0gZnVuY3Rpb24gKHZlcnRleCwgbm9ybWFsLCB0ZXhDb29yZCkge1xyXG5cdGlmICh0aGlzLnZlcnRpY2VzKSB7XHJcblx0XHR0aGlzLnZlcnRpY2VzLnB1c2goW3ZlcnRleFswXSwgdmVydGV4WzFdLCB2ZXJ0ZXhbMl1dKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aGlzLnZlcnRpY2VzID0gW3ZlcnRleFswXSwgdmVydGV4WzFdLCB2ZXJ0ZXhbMl1dO1xyXG5cdH1cclxuXHRcclxuXHRpZiAodGhpcy5ub3JtYWxzKSB7XHJcblx0XHR0aGlzLm5vcm1hbHMucHVzaChbbm9ybWFsWzBdLCBub3JtYWxbMV0sIG5vcm1hbFsyXV0pO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMubm9ybWFscyA9IFtub3JtYWxbMF0sIG5vcm1hbFsxXSwgbm9ybWFsWzJdXTtcclxuXHR9XHJcblx0XHJcblx0aWYgKHRoaXMudGV4Q29vcmRzKSB7XHJcblx0XHR0aGlzLnRleENvb3Jkcy5wdXNoKFt0ZXhDb29yZFswXSwgdGV4Q29vcmRbMV0sIHRleENvb3JkWzJdXSk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dGhpcy50ZXhDb29yZHMgPSBbdGV4Q29vcmRbMF0sIHRleENvb3JkWzFdLCB0ZXhDb29yZFsyXV07XHJcblx0fVxyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLmFkZFRyaWFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIGMpIHtcclxuXHRpZiAodGhpcy5pbmRpY2VzKSB7XHJcblx0XHR0aGlzLmluZGljZXMucHVzaChbYSwgYiwgY10pO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRoaXMuaW5kaWNlcyA9IFthLCBiLCBjXTtcclxuXHR9XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUudXBsb2FkID0gZnVuY3Rpb24gKGdsKSB7XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy52ZXJ0aWNlcywgIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpO1xyXG5cdHRoaXMubm9ybWFsQnVmZmVyICAgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMubm9ybWFscywgICBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTsgICAgICBcclxuXHR0aGlzLnRleENvb3JkQnVmZmVyID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLnRleENvb3JkcywgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7ICAgICAgXHJcblx0dGhpcy5pbmRleEJ1ZmZlciAgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy5pbmRpY2VzLCAgIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBnbC5VTlNJR05FRF9TSE9SVCk7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGdsLCBzaGFkZXIpIHtcclxuXHRpZiAoIXRoaXMudmVydGV4QnVmZmVyKSB7XHJcblx0XHR0aGlzLnVwbG9hZChnbCk7XHJcblx0fVxyXG5cdFxyXG5cdHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhVmVydGV4XCIsICAgdGhpcy52ZXJ0ZXhCdWZmZXIsICAgMyk7XHJcbiAgc2hhZGVyLnNldEFycnRpYnV0ZShcImFOb3JtYWxcIiwgICB0aGlzLm5vcm1hbEJ1ZmZlciwgICAzKTtcclxuICBzaGFkZXIuc2V0QXJydGlidXRlKFwiYVRleENvb3JkXCIsIHRoaXMudGV4Q29vcmRCdWZmZXIsIDIpO1xyXG4gICAgICBcclxuICB0aGlzLmluZGV4QnVmZmVyLmRyYXcoZ2wuVFJJQU5HTEVTKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xyXG5cdHRoaXMudmVydGV4QnVmZmVyLnJlbGVhc2UoKTsgICBcclxuXHRkZWxldGUgdGhpcy52ZXJ0ZXhCdWZmZXI7XHJcblx0XHJcblx0dGhpcy5ub3JtYWxCdWZmZXIucmVsZWFzZSgpOyAgIFxyXG5cdGRlbGV0ZSB0aGlzLm5vcm1hbEJ1ZmZlcjtcdFxyXG5cdFxyXG5cdHRoaXMudGV4Q29vcmRCdWZmZXIucmVsZWFzZSgpOyBcclxuXHRkZWxldGUgdGhpcy50ZXhDb29yZEJ1ZmZlcjtcclxuXHRcclxuXHR0aGlzLmluZGV4QnVmZmVyLnJlbGVhc2UoKTtcclxuXHRkZWxldGUgdGhpcy5pbmRleEJ1ZmZlcjtcclxufVxyXG4iLCJcclxucGt6by5NYXRlcmlhbCA9IGZ1bmN0aW9uIChvcHRzKSB7XHRcclxuXHRpZiAob3B0cy5jb2xvcikge1xyXG5cdFx0dGhpcy5jb2xvciA9IG9wdHMuY29sb3I7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0dGhpcy5jb2xvciA9IHBrem8udmVjMygxLCAxLCAxKTtcclxuXHR9XHRcclxuXHRpZiAob3B0cy50ZXh0dXJlKSB7XHJcblx0XHR0aGlzLnRleHR1cmUgPSBvcHRzLnRleHR1cmU7XHJcblx0fVx0XHJcbn1cclxuXHJcbnBrem8uTWF0ZXJpYWwucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24gKGdsLCBzaGFkZXIpIHtcclxuXHRcclxuXHRzaGFkZXIuc2V0VW5pZm9ybTNmdigndUNvbG9yJywgdGhpcy5jb2xvcik7XHJcblx0XHJcblx0aWYgKHRoaXMudGV4dHVyZSAmJiB0aGlzLnRleHR1cmUubG9hZGVkKSB7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1SGFzVGV4dHVyZScsIDEpO1xyXG5cdFx0dGhpcy50ZXh0dXJlLmJpbmQoZ2wsIDApXHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1VGV4dHVyZScsIDApO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNUZXh0dXJlJywgMCk7XHJcblx0fVxyXG5cdFxyXG59XHJcbiIsIlxyXG5wa3pvLkVudGl0eSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnRyYW5zZm9ybSA9IHBrem8ubWF0NCgxKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSwgeCwgeSwgeikge1xyXG5cdHRoaXMudHJhbnNmb3JtID0gcGt6by5yb3RhdGUodGhpcy50cmFuc2Zvcm0sIGFuZ2xlLCB4LCB5LCB6KTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFhWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVswXSwgdGhpcy50cmFuc2Zvcm1bMV0sIHRoaXMudHJhbnNmb3JtWzJdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFlWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVs0XSwgdGhpcy50cmFuc2Zvcm1bNV0sIHRoaXMudHJhbnNmb3JtWzZdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFpWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVs4XSwgdGhpcy50cmFuc2Zvcm1bOV0sIHRoaXMudHJhbnNmb3JtWzEwXSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzEyXSwgdGhpcy50cmFuc2Zvcm1bMTNdLCB0aGlzLnRyYW5zZm9ybVsxNF0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICB0aGlzLnRyYW5zZm9ybVsxMl0gPSB2YWx1ZVswXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxM10gPSB2YWx1ZVsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxNF0gPSB2YWx1ZVsyXTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uICh0YXJnZXQsIHVwKSB7XHJcbiAgdmFyIHBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbigpO1xyXG4gIHZhciBmb3J3YXJkICA9IHBrem8ubm9ybWFsaXplKHBrem8uc3ViKHRhcmdldCwgcG9zaXRpb24pKTtcclxuICB2YXIgcmlnaHQgICAgPSBwa3pvLm5vcm1hbGl6ZShwa3pvLmNyb3NzKGZvcndhcmQsIHVwKSk7XHJcbiAgdmFyIHVwbiAgICAgID0gcGt6by5ub3JtYWxpemUocGt6by5jcm9zcyhyaWdodCwgZm9yd2FyZCkpO1xyXG4gIFxyXG4gIC8vIFRPRE8gc2NhbGluZ1xyXG4gIHRoaXMudHJhbnNmb3JtWzBdID0gcmlnaHRbMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMV0gPSByaWdodFsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsyXSA9IHJpZ2h0WzJdO1xyXG4gIFxyXG4gIHRoaXMudHJhbnNmb3JtWzRdID0gdXBuWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzVdID0gdXBuWzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzZdID0gdXBuWzJdO1xyXG4gIFxyXG4gIHRoaXMudHJhbnNmb3JtWzhdID0gZm9yd2FyZFswXTtcclxuICB0aGlzLnRyYW5zZm9ybVs5XSA9IGZvcndhcmRbMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMTBdID0gZm9yd2FyZFsyXTtcclxufVxyXG4iLCJcclxucGt6by5DYW1lcmEgPSBmdW5jdGlvbiAob3B0KSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuICBcclxuICB2YXIgbyA9IG9wdCA/IG9wdCA6IHt9O1xyXG4gIFxyXG4gIHRoaXMueWZvdiAgPSBvLnlmb3YgID8gby55Zm92ICA6ICA0NS4wO1xyXG4gIHRoaXMuem5lYXIgPSBvLnpuZWFyID8gby56bmVhciA6ICAgMC4xO1xyXG4gIHRoaXMuemZhciAgPSBvLnpmYXIgID8gby56ZmFyICA6IDEwMC4wO1xyXG59XHJcblxyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uQ2FtZXJhLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uQ2FtZXJhO1xyXG5cclxucGt6by5DYW1lcmEucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuICB2YXIgYXNwZWN0ID0gcmVuZGVyZXIuY2FudmFzLmdsLndpZHRoIC8gcmVuZGVyZXIuY2FudmFzLmdsLmhlaWdodDtcclxuICBcclxuICB2YXIgcHJvamVjdGlvbk1hdHJpeCA9IHBrem8ucGVyc3BlY3RpdmUodGhpcy55Zm92LCBhc3BlY3QsIHRoaXMuem5lYXIsIHRoaXMuemZhcik7XHJcbiAgXHJcbiAgdmFyIHAgPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcbiAgdmFyIHggPSB0aGlzLmdldFhWZWN0b3IoKTtcclxuICB2YXIgeSA9IHRoaXMuZ2V0WVZlY3RvcigpO1xyXG4gIHZhciB6ID0gdGhpcy5nZXRaVmVjdG9yKCk7XHJcbiAgXHJcbiAgdmFyIHZpZXdNYXRyaXggPSBwa3pvLm1hdDQoW3hbMF0sIHhbMV0sIHhbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlbMF0sIHlbMV0sIHlbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpbMF0sIHpbMV0sIHpbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsICAgIDAsICAgIDAsIDFdKTtcclxuICB2aWV3TWF0cml4ID0gcGt6by50cmFuc3Bvc2Uodmlld01hdHJpeCk7IC8vIHVzZSBpbnZlcnNlXHJcbiAgdmlld01hdHJpeCA9IHBrem8udHJhbnNsYXRlKHZpZXdNYXRyaXgsIC1wWzBdLCAtcFsxXSwgLXBbMl0pOyAgXHJcbiAgXHJcbiAgcmVuZGVyZXIuc2V0Q2FtZXJhKHByb2plY3Rpb25NYXRyaXgsIHZpZXdNYXRyaXgpO1xyXG59XHJcbiIsIlxyXG5wa3pvLk9iamVjdCA9IGZ1bmN0aW9uIChtZXNoLCBtYXRlcmlhbCkge1xyXG4gIHBrem8uRW50aXR5LmNhbGwodGhpcyk7XHJcbiAgXHJcbiAgdGhpcy5tZXNoICAgICA9IG1lc2g7XHJcbiAgdGhpcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG59XHJcblxyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHBrem8uT2JqZWN0O1xyXG5cclxucGt6by5PYmplY3QucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuXHQvLyB0b2RvIHJlc3BlY3QgcGFyZW50IHRyYW5zZm9ybVxyXG5cdHJlbmRlcmVyLmFkZE1lc2godGhpcy50cmFuc2Zvcm0sIHRoaXMubWF0ZXJpYWwsIHRoaXMubWVzaCk7XHJcbn1cclxuXHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGdsLCBzaGFkZXIsIHBhcmVudE1vZGVsVmlld01hdHJpeCkgeyBcclxuICBcclxuICB2YXIgbW9kZWxWaWV3TWF0cml4ID0gcGt6by5tdWx0TWF0cml4KHBhcmVudE1vZGVsVmlld01hdHJpeCwgdGhpcy50cmFuc2Zvcm0pO1xyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxWaWV3TWF0cml4JywgbW9kZWxWaWV3TWF0cml4KTtcclxuXHRzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndU1vZGVsTWF0cml4JywgdGhpcy50cmFuc2Zvcm0pO1xyXG4gIFxyXG4gIHRoaXMubWF0ZXJpYWwuc2V0dXAoZ2wsIHNoYWRlcik7XHJcbiAgdGhpcy5tZXNoLmRyYXcoZ2wsIHNoYWRlcik7XHJcbn1cclxuXHJcbiIsIlxyXG5wa3pvLkRpcmVjdGlvbmFsTGlnaHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gcGt6by52ZWMzKDAuNSwgMC41LCAwLjUpO1xyXG59XHJcblxyXG5wa3pvLkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5EaXJlY3Rpb25hbExpZ2h0O1xyXG5cclxucGt6by5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcblx0dmFyIGRpciA9IHBrem8ubmVnKHRoaXMuZ2V0WlZlY3RvcigpKTtcclxuXHRyZW5kZXJlci5hZGREaXJlY3Rpb25hbExpZ2h0KGRpciwgdGhpcy5jb2xvcik7XHJcbn1cclxuIiwiXHJcbnBrem8uUG9pbnRMaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBwa3pvLnZlYzMoMC41LCAwLjUsIDAuNSk7XHJcbiAgdGhpcy5yYW5nZSA9IDEwLjA7XHJcbn1cclxuXHJcbnBrem8uUG9pbnRMaWdodC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBrem8uRW50aXR5LnByb3RvdHlwZSk7XHJcbnBrem8uUG9pbnRMaWdodC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLlBvaW50TGlnaHQ7XHJcblxyXG5wa3pvLlBvaW50TGlnaHQucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcclxuXHRyZW5kZXJlci5hZGRQb2ludExpZ2h0KHRoaXMuZ2V0UG9zaXRpb24oKSwgdGhpcy5jb2xvciwgdGhpcy5yYW5nZSk7XHJcbn1cclxuIiwiXHJcbnBrem8uUmVuZGVyZXIgPSBmdW5jdGlvbiAoY2FudmFzKSB7XHJcblx0dGhpcy5jYW52YXMgPSBuZXcgcGt6by5DYW52YXMoY2FudmFzKTtcclxuXHRcclxuXHR2YXIgcmVuZGVyZXIgPSB0aGlzO1xyXG5cdFxyXG5cdHRoaXMuY2FudmFzLmluaXQoZnVuY3Rpb24gKGdsKSB7XHJcblx0XHRyZW5kZXJlci5zb2xpZFNoYWRlclx0ID0gbmV3IHBrem8uU2hhZGVyKGdsLCBwa3pvLlNvbGlkVmVydCwgcGt6by5Tb2xpZEZyYWcpO1xyXG5cdFx0cmVuZGVyZXIuYW1iaWVudFNoYWRlciA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5Tb2xpZFZlcnQsIHBrem8uQW1iaWVudEZyYWcpO1xyXG5cdFx0cmVuZGVyZXIubGlnaHRTaGFkZXJcdCA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5Tb2xpZFZlcnQsIHBrem8uTGlnaHRGcmFnKTtcclxuXHR9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuc2V0Q2FtZXJhID0gZnVuY3Rpb24gKHByb2plY3Rpb25NYXRyaXgsIHZpZXdNYXRyaXgpIHtcclxuXHR0aGlzLnByb2plY3Rpb25NYXRyaXggPSBwcm9qZWN0aW9uTWF0cml4O1xyXG5cdHRoaXMudmlld01hdHJpeFx0XHRcdFx0PSB2aWV3TWF0cml4O1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5hZGRNZXNoID0gZnVuY3Rpb24gKHRyYW5zZm9ybSwgbWF0ZXJpYWwsIG1lc2gpIHtcclxuXHR0aGlzLnNvbGlkcy5wdXNoKHtcclxuXHRcdHRyYW5zZm9ybTogdHJhbnNmb3JtLFxyXG5cdFx0bWF0ZXJpYWw6IG1hdGVyaWFsLCBcclxuXHRcdG1lc2g6IG1lc2hcclxuXHR9KTtcclxufVxyXG5cclxucGt6by5ESVJFQ1RJT05BTF9MSUdIVCA9IDE7XHJcbnBrem8uUE9JTlRfTElHSFRcdFx0XHQgPSAyO1xyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkRGlyZWN0aW9uYWxMaWdodCA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGNvbG9yKSB7XHJcblx0dGhpcy5saWdodHMucHVzaCh7XHJcblx0XHR0eXBlOiBwa3pvLkRJUkVDVElPTkFMX0xJR0hULFxyXG5cdFx0ZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcblx0XHRjb2xvcjogY29sb3JcclxuXHR9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkUG9pbnRMaWdodCA9IGZ1bmN0aW9uIChwb3NpdGlvbiwgY29sb3IsIHJhbmdlKSB7XHJcblx0dGhpcy5saWdodHMucHVzaCh7XHJcblx0XHR0eXBlOiBwa3pvLlBPSU5UX0xJR0hULFxyXG5cdFx0cG9zaXRpb246IHBvc2l0aW9uLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0cmFuZ2U6IHJhbmdlXHJcblx0fSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLmRyYXdTb2xpZHMgPSBmdW5jdGlvbiAoZ2wsIHNoYWRlcikge1xyXG5cdHRoaXMuc29saWRzLmZvckVhY2goZnVuY3Rpb24gKHNvbGlkKSB7XHJcblx0XHR2YXIgbm9ybSA9IHBrem8ubXVsdE1hdHJpeChwa3pvLm1hdDModGhpcy52aWV3TWF0cml4KSwgcGt6by5tYXQzKHNvbGlkLnRyYW5zZm9ybSkpO1xyXG5cdFx0XHRcdFxyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VNb2RlbE1hdHJpeCcsIHNvbGlkLnRyYW5zZm9ybSk7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDNmdigndU5vcm1hbE1hdHJpeCcsIG5vcm0pO1xyXG5cdFx0XHJcblx0XHRzb2xpZC5tYXRlcmlhbC5zZXR1cChnbCwgc2hhZGVyKTtcdFx0XHRcclxuXHRcdHNvbGlkLm1lc2guZHJhdyhnbCwgc2hhZGVyKTtcclxuXHR9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYW1iaWVudFBhc3MgPSBmdW5jdGlvbiAoZ2wsIGFtYmllbnRMaWdodCkge1xyXG5cdHZhciBzaGFkZXIgPSB0aGlzLmFtYmllbnRTaGFkZXI7XHRcdFxyXG5cdHNoYWRlci5iaW5kKCk7XHJcblx0XHJcblx0c2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VQcm9qZWN0aW9uTWF0cml4JywgdGhpcy5wcm9qZWN0aW9uTWF0cml4KTtcdFx0XHJcblx0c2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VWaWV3TWF0cml4JyxcdFx0XHRcdHRoaXMudmlld01hdHJpeCk7XHRcdFxyXG5cdFxyXG5cdHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1QW1iaWVudExpZ2h0JywgYW1iaWVudExpZ2h0KTtcdFx0XHJcblx0XHRcclxuXHR0aGlzLmRyYXdTb2xpZHMoZ2wsIHNoYWRlcik7XHRcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUubGlnaHRQYXNzID0gZnVuY3Rpb24gKGdsLCBsaWdodCkge1xyXG5cdHZhciBzaGFkZXIgPSB0aGlzLmxpZ2h0U2hhZGVyO1x0XHRcclxuXHRzaGFkZXIuYmluZCgpO1xyXG5cdFxyXG5cdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1UHJvamVjdGlvbk1hdHJpeCcsIHRoaXMucHJvamVjdGlvbk1hdHJpeCk7XHRcdFxyXG5cdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1Vmlld01hdHJpeCcsXHRcdFx0XHR0aGlzLnZpZXdNYXRyaXgpO1x0XHRcclxuXHRcclxuXHRzaGFkZXIuc2V0VW5pZm9ybTFpKCd1TGlnaHRUeXBlJywgbGlnaHQudHlwZSk7XHJcblx0aWYgKGxpZ2h0LmRpcmVjdGlvbikge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VMaWdodERpcmVjdGlvbicsIGxpZ2h0LmRpcmVjdGlvbik7XHJcblx0fVx0IFxyXG5cdGlmIChsaWdodC5wb3NpdGlvbikge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0zZnYoJ3VMaWdodFBvc2l0aW9uJywgbGlnaHQucG9zaXRpb24pO1xyXG5cdH1cclxuXHRpZiAobGlnaHQucmFuZ2UpIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWYoJ3VMaWdodFJhbmdlJywgbGlnaHQucmFuZ2UpO1xyXG5cdH1cclxuXHRzaGFkZXIuc2V0VW5pZm9ybTNmdigndUxpZ2h0Q29sb3InLCBsaWdodC5jb2xvcik7XHJcblx0XHJcblx0dGhpcy5kcmF3U29saWRzKGdsLCBzaGFkZXIpO1x0XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChzY2VuZSkge1xyXG5cdHZhciByZW5kZXJlciA9IHRoaXM7XHJcblx0XHJcblx0dGhpcy5zb2xpZHMgPSBbXTtcclxuXHR0aGlzLmxpZ2h0cyA9IFtdO1xyXG5cdHNjZW5lLmVucXVldWUodGhpcyk7XHJcblx0XHJcblx0dGhpcy5jYW52YXMuZHJhdyhmdW5jdGlvbiAoZ2wpIHtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG5cdFx0Z2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XHJcblx0XHRnbC5kaXNhYmxlKGdsLkJMRU5EKTtcclxuXHRcdFxyXG5cdFx0cmVuZGVyZXIuYW1iaWVudFBhc3MoZ2wsIHNjZW5lLmFtYmllbnRMaWdodCk7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5CTEVORCk7XHJcblx0XHRnbC5ibGVuZEZ1bmMoZ2wuT05FLCBnbC5PTkUpO1xyXG5cdFx0XHJcblx0XHRyZW5kZXJlci5saWdodHMuZm9yRWFjaChmdW5jdGlvbiAobGlnaHQpIHtcclxuXHRcdFx0cmVuZGVyZXIubGlnaHRQYXNzKGdsLCBsaWdodCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=