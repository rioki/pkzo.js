
var pkzo = {version: '0.0.1'};

pkzo.SolidFrag = "precision mediump float;\n\n\n\nuniform vec3 uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool uHasTexture;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    if (uHasTexture) {\n\n        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(uColor, 1);\n\n    }\n\n    else {\n\n        gl_FragColor = vec4(uColor, 1);\n\n    }\n\n}";
pkzo.SolidVert = "\n\nuniform mat4 uProjectionMatrix;\n\nuniform mat4 uModelViewMatrix;\n\nuniform mat3 uNormalMatrix;\n\n\n\nattribute vec3 aVertex;\n\nattribute vec3 aNormal;\n\nattribute vec2 aTexCoord;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main() {\n\n  vNormal     = uNormalMatrix * aNormal;\n\n  vTexCoord   = aTexCoord;\n\n  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertex, 1);\n\n}";


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



pkzo.mat2 = function (v) {
  if (typeof v === 'array') {
    if (v.length != 4) {
      throw new Error('mat2 must be 4 values');
    }
    return new Float32Array(v);
  }
  if (typeof v === 'number') {
    return new Float32Array([v, 0,
                             0, v]);
  }
  return new Float32Array([1, 0,
                           0, 1]);
}

pkzo.mat3 = function (v) {
  if (typeof v === 'array') {
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
  if (typeof v === 'array') {
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




pkzo.Scene = function () {}

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


pkzo.Material = function () {	
	this.color = pkzo.vec3(1, 1, 1);
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
	
	this.yfov   = o.yfov ? o.yfov : 45.0;
	this.znear  = o.znear ? o.znear : 0.1;
	this.zfar   = o.zfar ? o.zfar : 100.0;
	this.aspect = 1.0;
}

pkzo.Camera.prototype = Object.create(pkzo.Entity.prototype);
pkzo.Camera.prototype.constructor = pkzo.Camera;

pkzo.Camera.prototype.update = function () {
	// TODO take into account the paren't position
	
	this.projectionMatrix = pkzo.perspective(this.yfov, this.aspect, this.znear, this.zfar);
	
	//var forward = this.getXVector();
	//var right   = this.getYVector();
	//var up      = this.getZVector();
	this.viewMatrix   = pkzo.mat4(1);
	this.normalMatrix = pkzo.mat3(1);
	
}


pkzo.Object = function (mesh, material) {
  pkzo.Entity.call(this);
  
  this.mesh     = mesh;
  this.material = material;
}

pkzo.Object.prototype = Object.create(pkzo.Entity.prototype);
pkzo.Object.prototype.constructor = pkzo.Object;

pkzo.Object.prototype.draw = function (gl, shader, parentModelViewMatrix) { 
  
  var modelViewMatrix = pkzo.multMatrix(parentModelViewMatrix, this.transform);
  shader.setUniformMatrix4fv('uModelViewMatrix', modelViewMatrix);
  
  this.material.setup(gl, shader);
  this.mesh.draw(gl, shader);
}



pkzo.Renderer = function (canvas) {
  this.canvas = new pkzo.Canvas(canvas);
  
  var renderer = this;
  
  this.canvas.init(function (gl) {
    renderer.solidShader = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.SolidFrag);
  });
}

pkzo.Renderer.prototype.render = function (scene, camera) {
	var renderer = this;
	
  this.canvas.draw(function (gl) {
    
		gl.enable(gl.DEPTH_TEST);
		
		var shader = renderer.solidShader;		
		shader.bind();
		
		camera.aspect = gl.width / gl.height;
		camera.update();
		shader.setUniformMatrix4fv('uProjectionMatrix', camera.projectionMatrix);		
		shader.setUniformMatrix3fv('uNormalMatrix', camera.normalMatrix);		
		
		var modelViewMatrix = pkzo.mat4(camera.viewMatrix);		
		
		if (scene.entities) {
			scene.entities.forEach(function (entity) {
				if (entity.draw) {
					entity.draw(gl, shader, modelViewMatrix);
				}				
			});
		}
		
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBrem8uanMiLCJzaGFkZXJzLmpzIiwidmVjdG9yLmpzIiwibWF0cml4LmpzIiwiQ2FudmFzLmpzIiwiVGV4dHVyZS5qcyIsIlNoYWRlci5qcyIsIlNjZW5lLmpzIiwiQnVmZmVyLmpzIiwiTWVzaC5qcyIsIk1hdGVyaWFsLmpzIiwiRW50aXR5LmpzIiwiQ2FtZXJhLmpzIiwiT2JqZWN0LmpzIiwiUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InBrem8tMC4wLjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIHBrem8gPSB7dmVyc2lvbjogJzAuMC4xJ307XHJcbiIsInBrem8uU29saWRGcmFnID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG5cXG5cXG51bmlmb3JtIHZlYzMgdUNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlO1xcblxcbnVuaWZvcm0gYm9vbCB1SGFzVGV4dHVyZTtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzMgdk5vcm1hbDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleENvb3JkO1xcblxcblxcblxcbnZvaWQgbWFpbigpXFxuXFxue1xcblxcbiAgICBpZiAodUhhc1RleHR1cmUpIHtcXG5cXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZSwgdlRleENvb3JkKSAqIHZlYzQodUNvbG9yLCAxKTtcXG5cXG4gICAgfVxcblxcbiAgICBlbHNlIHtcXG5cXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodUNvbG9yLCAxKTtcXG5cXG4gICAgfVxcblxcbn1cIjtcbnBrem8uU29saWRWZXJ0ID0gXCJcXG5cXG51bmlmb3JtIG1hdDQgdVByb2plY3Rpb25NYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQ0IHVNb2RlbFZpZXdNYXRyaXg7XFxuXFxudW5pZm9ybSBtYXQzIHVOb3JtYWxNYXRyaXg7XFxuXFxuXFxuXFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleDtcXG5cXG5hdHRyaWJ1dGUgdmVjMyBhTm9ybWFsO1xcblxcbmF0dHJpYnV0ZSB2ZWMyIGFUZXhDb29yZDtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzMgdk5vcm1hbDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleENvb3JkO1xcblxcblxcblxcbnZvaWQgbWFpbigpIHtcXG5cXG4gIHZOb3JtYWwgICAgID0gdU5vcm1hbE1hdHJpeCAqIGFOb3JtYWw7XFxuXFxuICB2VGV4Q29vcmQgICA9IGFUZXhDb29yZDtcXG5cXG4gIGdsX1Bvc2l0aW9uID0gdVByb2plY3Rpb25NYXRyaXggKiB1TW9kZWxWaWV3TWF0cml4ICogdmVjNChhVmVydGV4LCAxKTtcXG5cXG59XCI7XG4iLCJcclxucGt6by52ZWMyID0gZnVuY3Rpb24gKHYwLCB2MSkge1xyXG4gIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICB0eXBlb2YgdjEgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYwXSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYxID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MV0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDIpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by52ZWMzID0gZnVuY3Rpb24gKHYwLCB2MSwgdjIpIHtcclxuICBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgdHlwZW9mIHYxID09PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgdjIgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYwLCB2MF0pO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MSA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYyID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MSwgdjJdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgzKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8udmVjNCA9IGZ1bmN0aW9uICh2MCwgdjEsIHYyLCB2NCkge1xyXG4gIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICB0eXBlb2YgdjEgPT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiB2MiA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIHYzID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MCwgdjAsIHYwXSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYxID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjIgPT09ICdudW1iZXInICYmXHJcbiAgICAgICAgICAgdHlwZW9mIHYzID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YwLCB2MSwgdjIsIHY0XSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBhZGQgYW5kIHN1YiBhbHNvIHdvcmsgZm9yIG1hdHJpeFxyXG5wa3pvLmFkZCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIHJbaV0gPSBhW2ldICsgYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8uc3ViID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gLSBiW2ldO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5kb3QgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciB2ID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIHYgKz0gYVtpXSAqIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiB2O1xyXG59XHJcblxyXG5wa3pvLmNyb3NzID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAvLyBhc3N1bWUgYS5sZW5ndGggPT0gYi5sZW5ndGggPT0gM1xyXG4gIFxyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSgzKTtcclxuICBcclxuICByWzBdID0gKGFbMV0gKiBiWzJdKSAtIChhWzJdICogYlsxXSk7XHJcbiAgclsxXSA9IChhWzJdICogYlswXSkgLSAoYVswXSAqIGJbMl0pO1xyXG4gIHJbMl0gPSAoYVswXSAqIGJbMV0pIC0gKGFbMV0gKiBiWzBdKTtcclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5tdWx0VmVjdG9yU2NhbGFyID0gZnVuY3Rpb24gKHYsIHMpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkodi5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdi5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IHZbaV0gKiBzO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5sZW5ndGggPSBmdW5jdGlvbiAodikgeyAgXHJcbiAgcmV0dXJuIE1hdGguc3FydChwa3pvLmRvdCh2LCB2KSk7XHJcbn1cclxuXHJcbnBrem8ubm9ybWFsaXplID0gZnVuY3Rpb24gKHYpIHtcclxuICByZXR1cm4gcGt6by5tdWx0VmVjdG9yU2NhbGFyKHYsIDEgLyBwa3pvLmxlbmd0aCh2KSk7XHJcbn1cclxuXHJcbiIsIlxyXG5wa3pvLm1hdDIgPSBmdW5jdGlvbiAodikge1xyXG4gIGlmICh0eXBlb2YgdiA9PT0gJ2FycmF5Jykge1xyXG4gICAgaWYgKHYubGVuZ3RoICE9IDQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXQyIG11c3QgYmUgNCB2YWx1ZXMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KHYpO1xyXG4gIH1cclxuICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdiwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCB2XSk7XHJcbiAgfVxyXG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxXSk7XHJcbn1cclxuXHJcbnBrem8ubWF0MyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnYXJyYXknKSB7XHJcbiAgICBpZiAodi5sZW5ndGggIT0gOSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDMgbXVzdCBiZSA5IHZhbHVlcycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2LCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIHYsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgdl0pO1xyXG4gIH1cclxuICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMV0pO1xyXG59XHJcblxyXG5wa3pvLm1hdDQgPSBmdW5jdGlvbiAodikge1xyXG4gIGlmICh0eXBlb2YgdiA9PT0gJ2FycmF5Jykge1xyXG4gICAgaWYgKHYubGVuZ3RoICE9IDE2KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWF0NCBtdXN0IGJlIDE2IHZhbHVlcycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2LCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIHYsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgdiwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCB2XSk7XHJcbiAgfVxyXG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCAxXSk7XHJcbn1cclxuXHJcbnBrem8ubXVsdE1hdHJpeCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgLy8gYXNzdW1lIGEubGVuZ3RoID09IGIubGVuZ3RoXHJcbiAgdmFyIG4gPSBNYXRoLnNxcnQoYS5sZW5ndGgpO1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbjsgaisrKSB7XHJcbiAgICAgIHZhciB2ID0gMDtcclxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBuOyBrKyspIHtcclxuICAgICAgICB2ID0gdiArIGFbaSpuK2tdICogYltrKm4ral07XHJcbiAgICAgIH1cclxuICAgICAgcltpKm4ral0gPSB2O1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5yYWRpYW5zID0gZnVuY3Rpb24oZGVncmVlcykge1xyXG4gIHJldHVybiBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcclxufTtcclxuXHJcbnBrem8uZGVncmVlcyA9IGZ1bmN0aW9uKHJhZGlhbnMpIHtcclxuICByZXR1cm4gcmFkaWFucyAqIDE4MCAvIE1hdGguUEk7XHJcbn07IFxyXG5cclxuXHJcbnBrem8ub3J0aG8gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcclxuICB2YXIgcmwgPSAocmlnaHQgLSBsZWZ0KTtcclxuICB2YXIgdGIgPSAodG9wIC0gYm90dG9tKTtcclxuICB2YXIgZm4gPSAoZmFyIC0gbmVhcik7XHJcbiAgXHJcbiAgdmFyIG0gPSBwa3pvLm1hdDQoKTsgIFxyXG4gIFxyXG4gIG1bMF0gPSAyIC8gcmw7XHJcbiAgbVsxXSA9IDA7XHJcbiAgbVsyXSA9IDA7XHJcbiAgbVszXSA9IDA7XHJcbiAgbVs0XSA9IDA7XHJcbiAgbVs1XSA9IDIgLyB0YjtcclxuICBtWzZdID0gMDtcclxuICBtWzddID0gMDtcclxuICBtWzhdID0gMDtcclxuICBtWzldID0gMDtcclxuICBtWzEwXSA9IC0yIC8gZm47XHJcbiAgbVsxMV0gPSAwO1xyXG4gIG1bMTJdID0gLShsZWZ0ICsgcmlnaHQpIC8gcmw7XHJcbiAgbVsxM10gPSAtKHRvcCArIGJvdHRvbSkgLyB0YjtcclxuICBtWzE0XSA9IC0oZmFyICsgbmVhcikgLyBmbjtcclxuICBtWzE1XSA9IDE7XHJcblxyXG4gIHJldHVybiBtO1xyXG59XHJcblxyXG5wa3pvLmZydXN0dW0gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCB6bmVhciwgemZhcikge1xyXG4gIHZhciB0MSA9IDIgKiB6bmVhcjtcclxuICB2YXIgdDIgPSByaWdodCAtIGxlZnQ7XHJcbiAgdmFyIHQzID0gdG9wIC0gYm90dG9tO1xyXG4gIHZhciB0NCA9IHpmYXIgLSB6bmVhcjtcclxuXHJcbiAgdmFyIG0gPSBuZXcgRmxvYXQzMkFycmF5KDE2KTtcclxuICBcclxuICBtWzBdID0gdDEvdDI7IG1bNF0gPSAgICAgMDsgbVsgOF0gPSAgKHJpZ2h0ICsgbGVmdCkgLyB0MjsgbVsxMl0gPSAgICAgICAgICAgICAgICAgMDtcclxuICBtWzFdID0gICAgIDA7IG1bNV0gPSB0MS90MzsgbVsgOV0gPSAgKHRvcCArIGJvdHRvbSkgLyB0MzsgbVsxM10gPSAgICAgICAgICAgICAgICAgMDtcclxuICBtWzJdID0gICAgIDA7IG1bNl0gPSAgICAgMDsgbVsxMF0gPSAoLXpmYXIgLSB6bmVhcikgLyB0NDsgbVsxNF0gPSAoLXQxICogemZhcikgLyB0NDtcclxuICBtWzNdID0gICAgIDA7IG1bN10gPSAgICAgMDsgbVsxMV0gPSAgICAgICAgICAgICAgICAgICAtMTsgbVsxNV0gPSAgICAgICAgICAgICAgICAgMDtcclxuICBcclxuICByZXR1cm4gbTtcclxufVxyXG5cclxucGt6by5wZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uIChmb3Z5LCBhc3BlY3QsIHpuZWFyLCB6ZmFyKSB7XHJcbiAgdmFyIHltYXggPSB6bmVhciAqIE1hdGgudGFuKHBrem8ucmFkaWFucyhmb3Z5KSk7XHJcbiAgdmFyIHhtYXggPSB5bWF4ICogYXNwZWN0O1xyXG4gIHJldHVybiBwa3pvLmZydXN0dW0oLXhtYXgsIHhtYXgsIC15bWF4LCB5bWF4LCB6bmVhciwgemZhcik7XHJcbn1cclxuXHJcbi8vIE5PVEU6IHRoaXMgaXMgaW5lZmZpY2llbnQsIGl0IG1heSBiZSBzZW5zaWJsZSB0byBwcm92aWRlIGlucGxhY2UgdmVyc2lvbnNcclxucGt6by50cmFuc2xhdGUgPSBmdW5jdGlvbihtLCB4LCB5LCB6KSB7ICAgIFxyXG4gIHZhciByID0gcGt6by5tYXQ0KG0pO1xyXG4gIHJbMTJdID0gbVswXSAqIHggKyBtWzRdICogeSArIG1bIDhdICogeiArIG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxXSAqIHggKyBtWzVdICogeSArIG1bIDldICogeiArIG1bMTNdO1xyXG4gIHJbMTRdID0gbVsyXSAqIHggKyBtWzZdICogeSArIG1bMTBdICogeiArIG1bMTRdO1xyXG4gIHJbMTVdID0gbVszXSAqIHggKyBtWzddICogeSArIG1bMTFdICogeiArIG1bMTVdO1xyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnJvdGF0ZSA9IGZ1bmN0aW9uIChtLCBhbmdsZSwgeCwgeSwgeikgeyAgXHJcbiAgdmFyIGEgPSBwa3pvLnJhZGlhbnMoYW5nbGUpO1xyXG4gIHZhciBjID0gTWF0aC5jb3MoYSk7XHJcbiAgdmFyIHMgPSBNYXRoLnNpbihhKTtcclxuICBcclxuICB2YXIgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gIHZhciBueCA9IHggLyBsO1xyXG4gIHZhciBueSA9IHkgLyBsO1xyXG4gIHZhciBueiA9IHogLyBsO1xyXG5cclxuICB2YXIgdDAgPSBueCAqICgxIC0gYyk7XHJcbiAgdmFyIHQxID0gbnkgKiAoMSAtIGMpO1xyXG4gIHZhciB0MiA9IG56ICogKDEgLSBjKTsgIFxyXG5cclxuICB2YXIgZCA9IHBrem8ubWF0NCgxKTtcclxuICBcclxuICBkWyAwXSA9IGMgKyB0MCAqIG54O1xyXG4gIGRbIDFdID0gMCArIHQwICogbnkgKyBzICogbno7XHJcbiAgZFsgMl0gPSAwICsgdDAgKiBueiAtIHMgKiBueTtcclxuXHJcbiAgZFsgNF0gPSAwICsgdDEgKiBueCAtIHMgKiBuejtcclxuICBkWyA1XSA9IGMgKyB0MSAqIG55O1xyXG4gIGRbIDZdID0gMCArIHQxICogbnogKyBzICogbng7XHJcblxyXG4gIGRbIDhdID0gMCArIHQyICogbnggKyBzICogbnk7XHJcbiAgZFsgOV0gPSAwICsgdDIgKiBueSAtIHMgKiBueDtcclxuICBkWzEwXSA9IGMgKyB0MiAqIG56OyAgXHJcbiAgXHJcbiAgdmFyIHIgPSBwa3pvLm11bHRNYXRyaXgobSwgZCk7XHJcbiAgXHJcbiAgclsxMl0gPSBtWzEyXTtcclxuICByWzEzXSA9IG1bMTNdO1xyXG4gIHJbMTRdID0gbVsxNF07XHJcbiAgclsxNV0gPSBtWzE1XTtcclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5zY2FsZSA9IGZ1bmN0aW9uKG0sIHgsIHksIHopIHsgICAgXHJcbiAgdmFyIHIgPSBwa3pvLm1hdDQoMSk7XHJcbiAgXHJcbiAgclsgMF0gPSBtWyAwXSAqIHg7IFxyXG4gIHJbIDFdID0gbVsgMV0gKiB4OyBcclxuICByWyAyXSA9IG1bIDJdICogeDsgXHJcbiAgclsgM10gPSBtWyAzXSAqIHg7IFxyXG4gIFxyXG4gIHJbIDRdID0gbVsgNF0gKiB5OyBcclxuICByWyA1XSA9IG1bIDVdICogeTsgXHJcbiAgclsgNl0gPSBtWyA2XSAqIHk7IFxyXG4gIHJbIDddID0gbVsgN10gKiB5OyBcclxuICBcclxuICByWyA4XSA9IG1bIDhdICogejtcclxuICByWyA5XSA9IG1bIDldICogejtcclxuICByWzEwXSA9IG1bMTBdICogejtcclxuICByWzExXSA9IG1bMTFdICogejtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59IiwiXHJcbnBrem8uQ2FudmFzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuY2FudmFzID0gZWxlbWVudDtcclxuICB9ICBcclxuICBcclxuICB0aGlzLmNhbnZhcy53aWR0aCAgPSB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aDtcclxuICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7ICBcclxuICBcclxuICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIsIHthbnRpYWxpYXM6IHRydWUsIGRlcHRoOiB0cnVlfSk7XHJcbiAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XHJcbiAgXHJcbiAgLy8gdGhlc2UgdmFsdWVzIGFyZSBmb3IgdGhlIHByb2dyYW1tZXIgb2YgdGhlIGRyYXcgZnVuY3Rpb24sIFxyXG4gIC8vIHdlIHBhc3MgdGhlIGdsIG9iamVjdCwgbm90IHRoZSBjYW52YXMuXHJcbiAgdGhpcy5nbC53aWR0aCAgPSB0aGlzLmNhbnZhcy53aWR0aDtcclxuICB0aGlzLmdsLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxufVxyXG5cclxucGt6by5DYW52YXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoY2IpIHtcclxuICBpZiAoY2IpIHtcclxuICAgIGNiLmNhbGwodGhpcywgdGhpcy5nbCk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLkNhbnZhcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjYikgeyAgXHJcbiAgaWYgKHRoaXMuY2FudmFzLndpZHRoICE9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoIHx8IHRoaXMuY2FudmFzLmhlaWdodCAhPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQpIHtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoICA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0OyAgXHJcbiAgICB0aGlzLmdsLndpZHRoICA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5nbC5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMuZ2wudmlld3BvcnQoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQgfCB0aGlzLmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG4gIFxyXG4gIGlmIChjYikge1xyXG4gICAgY2IuY2FsbCh0aGlzLCB0aGlzLmdsKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5UZXh0dXJlID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIHRoaXMudXJsICAgID0gdXJsO1xyXG4gIHRoaXMuaW1hZ2UgID0gbnVsbDtcclxuICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gIFxyXG4gIC8vIHdlIGRvbid0IHVwbG9hZCB0aGUgaW1hZ2UgdG8gVlJBTSwgYnV0IHRyeSB0byBsb2FkIGl0XHJcbiAgdGhpcy5sb2FkKCk7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICgpIHtcdFxyXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICB2YXIgdGV4dHVyZSA9IHRoaXM7XHJcbiAgdGhpcy5pbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0ZXh0dXJlLmxvYWRlZCA9IHRydWU7ICAgIFxyXG4gIH07XHJcbiAgdGhpcy5pbWFnZS5zcmMgPSB0aGlzLnVybDtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTtcclxuICBcclxuICBpZiAodGhpcy5sb2FkZWQpIHtcclxuICAgIHRoaXMuc3luYygpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfMkQsIDAsIHRoaXMuZ2wuUkdCQSwgMSwgMSwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIG51bGwpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTsgIFxyXG4gIHRoaXMuZ2wudGV4SW1hZ2UyRCh0aGlzLmdsLlRFWFRVUkVfMkQsIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW1hZ2UpOyAgXHJcbiAgdGhpcy5nbC5nZW5lcmF0ZU1pcG1hcCh0aGlzLmdsLlRFWFRVUkVfMkQpO1xyXG4gIFxyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLmdsLkxJTkVBUik7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMuZ2wuTElORUFSX01JUE1BUF9MSU5FQVIpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMuZ2wuUkVQRUFUKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLmdsLlJFUEVBVCk7XHJcbiAgXHJcbiAgLy8gY2FuIHdlIGRpc2NhcmQgaW1hZ2Ugbm93P1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVUZXh0dXJlKHRoaXMuaWQpO1xyXG4gIHRoaXMuaWQgPSBudWxsO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZ2wsIGNoYW5uZWwpIHtcclxuXHR0aGlzLmdsID0gZ2w7XHJcbiAgaWYgKCEgdGhpcy5pZCkge1xyXG4gICAgdGhpcy51cGxvYWQoKTtcclxuICB9XHJcblx0Ly8gVE9ETyBjaGFubmVsXHJcbiAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuaWQpO1xyXG59XHJcbiIsIlxyXG5wa3pvLlNoYWRlciA9IGZ1bmN0aW9uIChnbCwgdmVydGV4Q29kZSwgZnJhZ21lbnRDb2RlKSB7XHJcbiAgdGhpcy5nbCAgICAgICAgICAgPSBnbDtcclxuICB0aGlzLnZlcnRleENvZGUgICA9IHZlcnRleENvZGU7XHJcbiAgdGhpcy5mcmFnbWVudENvZGUgPSBmcmFnbWVudENvZGU7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB2ZXJ0ZXhTaGFkZXIgICA9IHRoaXMuY29tcGlsZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIsICAgdGhpcy52ZXJ0ZXhDb2RlKTtcclxuICB2YXIgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmNvbXBpbGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIsIHRoaXMuZnJhZ21lbnRDb2RlKTtcclxuICBcclxuICB2YXIgcHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gIFxyXG4gIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlcik7XHJcbiAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gIFxyXG4gIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgXHJcbiAgdmFyIGluZm9Mb2cgPSB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pO1xyXG4gIGlmICh0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykgPT09IGZhbHNlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoaW5mb0xvZyk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGluZm9Mb2cgIT09ICcnKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbmZvTG9nKTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5nbC5kZWxldGVTaGFkZXIodmVydGV4U2hhZGVyKTtcclxuICB0aGlzLmdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XHJcbiAgXHJcbiAgdGhpcy5pZCA9IHByb2dyYW07XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5jb21waWxlU2hhZGVyID0gZnVuY3Rpb24gKHR5cGUsIGNvZGUpIHtcclxuICB2YXIgaWQgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0eXBlKTsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wuc2hhZGVyU291cmNlKGlkLCBjb2RlKTtcclxuICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoaWQpO1xyXG4gIFxyXG4gIHZhciBpbmZvTG9nID0gdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGlkKTtcclxuICBpZiAodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoaWQsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpID09PSBmYWxzZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGluZm9Mb2cpO1xyXG4gIH1cclxuICBlbHNlIGlmIChpbmZvTG9nICE9PSAnJykge1xyXG4gICAgY29uc29sZS5sb2coaW5mb0xvZyk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBpZDtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5kZWxldGVQcm9ncmFtKGlkKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCF0aGlzLmlkKSB7XHJcbiAgICB0aGlzLmNvbXBpbGUoKTtcclxuICB9XHJcbiAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuaWQpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0QXJydGlidXRlID0gZnVuY3Rpb24gKG5hbWUsIGJ1ZmZlciwgZWxlbWVudFNpemUpIHsgIFxyXG4gIGJ1ZmZlci5iaW5kKCk7ICBcclxuICBcclxuICBpZiAoZWxlbWVudFNpemUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdmFyIGVsZW1lbnRTaXplID0gYnVmZmVyLmVsZW1lbnRTaXplO1xyXG4gIH1cclxuICBcclxuICB2YXIgcG9zID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvcyk7XHJcbiAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvcywgZWxlbWVudFNpemUsIGJ1ZmZlci5lbGVtZW50VHlwZSwgdGhpcy5nbC5GQUxTRSwgMCwgMCk7ICBcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0xaSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0xaShsb2MsIHZhbHVlKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0xZiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0xZihsb2MsIHZhbHVlKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0yZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtMmYobG9jLCB2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTNmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0zZihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0pO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTRmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm00Zihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0sIHZhbHVlWzRdKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm1NYXRyaXgzZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIHRyYW5zcG9zZSkge1xyXG4gIGlmICh0cmFuc3Bvc2UgPT09IHVuZGVmaW5lZCB8fHRyYW5zcG9zZSA9PT0gbnVsbCkge1xyXG4gICAgdmFyIHRyYW5zcG9zZSA9IGZhbHNlO1xyXG4gIH1cclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtTWF0cml4M2Z2KGxvYywgdHJhbnNwb3NlLCB2YWx1ZSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtTWF0cml4NGZ2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCB0cmFuc3Bvc2UpIHtcclxuICBpZiAodHJhbnNwb3NlID09PSB1bmRlZmluZWQgfHx0cmFuc3Bvc2UgPT09IG51bGwpIHtcclxuICAgIHZhciB0cmFuc3Bvc2UgPSBmYWxzZTtcclxuICB9XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdihsb2MsIHRyYW5zcG9zZSwgdmFsdWUpO1xyXG59XHJcblxyXG5cclxuIiwiXHJcbnBrem8uU2NlbmUgPSBmdW5jdGlvbiAoKSB7fVxyXG5cclxucGt6by5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVudGl0eSkge1xyXG4gIGlmICghIHRoaXMuZW50aXRpZXMpIHtcclxuICAgIHRoaXMuZW50aXRpZXMgPSBbZW50aXR5XVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xyXG4gIH1cclxufSIsIlxyXG5wa3pvLkJ1ZmZlciA9IGZ1bmN0aW9uIChnbCwgZGF0YSwgYnR5cGUsIGV0eXBlKSB7XHJcbiAgdGhpcy5nbCA9IGdsO1xyXG4gIFxyXG4gIGlmIChidHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBnbC5BUlJBWV9CVUZGRVI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy50eXBlID0gYnR5cGU7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChldHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAodGhpcy50eXBlID09IGdsLkFSUkFZX0JVRkZFUikge1xyXG4gICAgICB0aGlzLmVsZW1lbnRUeXBlID0gZ2wuRkxPQVQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5lbGVtZW50VHlwZSA9IGdsLlVOU0lHTkVEX1NIT1JUO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZWxlbWVudFR5cGUgPSBldHlwZTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5sb2FkKGRhdGEpO1xyXG59XHJcblxyXG5wa3pvLndyYXBBcnJheSA9IGZ1bmN0aW9uIChnbCwgdHlwZSwgZGF0YSkge1xyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSBnbC5GTE9BVDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLkRPVUJMRTpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDY0QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX0JZVEU6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuVU5TSUdORURfU0hPUlQ6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDE2QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVDpcclxuICAgICAgcmV0dXJuIG5ldyBVaW50MzJBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuQllURTpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlNIT1JUOlxyXG4gICAgICByZXR1cm4gbmV3IEludDE2QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLklOVDpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQzMkFycmF5KGRhdGEpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoZGF0YSkgeyAgXHJcbiAgaWYgKGRhdGFbMF0ubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMuZWxlbWVudFNpemUgPSAxO1xyXG4gICAgdGhpcy5kYXRhID0gcGt6by53cmFwQXJyYXkodGhpcy5nbCwgdGhpcy5lbGVtZW50VHlwZSwgZGF0YSk7XHJcbiAgfVxyXG4gIGVsc2UgeyAgICBcclxuICAgIHRoaXMuZWxlbWVudFNpemUgPSBkYXRhWzBdLmxlbmd0aDtcclxuICAgIHRoaXMuZGF0YSA9IHBrem8ud3JhcEFycmF5KHRoaXMuZ2wsIHRoaXMuZWxlbWVudFR5cGUsIGRhdGEubGVuZ3RoICogdGhpcy5lbGVtU2l6ZSk7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB2YXIgYnVmZmVyID0gdGhpcztcclxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICBlbGVtLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICBidWZmZXIuZGF0YVtpXSA9IHY7XHJcbiAgICAgICAgaSsrO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy50eXBlLCB0aGlzLmlkKTtcclxuICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy50eXBlLCB0aGlzLmRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAodGhpcy5pZCkge1xyXG4gICAgdGhpcy5nbC5kZWxldGVCdWZmZXIodGhpcy5pZCk7XHJcbiAgICB0aGlzLmlkID0gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ocHJpbWl0aXZlKSB7XHJcbiAgaWYgKCEgdGhpcy5pZCkge1xyXG4gICAgdGhpcy51cGxvYWQoKTtcclxuICB9XHJcbiAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMudHlwZSwgdGhpcy5pZCk7XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24ocHJpbWl0aXZlKSB7XHJcbiAgdGhpcy5iaW5kKCk7XHJcbiAgdGhpcy5nbC5kcmF3RWxlbWVudHMocHJpbWl0aXZlLCB0aGlzLmRhdGEubGVuZ3RoLCB0aGlzLmVsZW1lbnRUeXBlLCAwKTtcclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLk1lc2ggPSBmdW5jdGlvbiAoKSB7fVxyXG5cclxucGt6by5NZXNoLmJveCA9IGZ1bmN0aW9uIChzKSB7XHJcblx0XHJcblx0dmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcblx0XHJcblx0bWVzaC52ZXJ0aWNlcyA9IFxyXG5cdFx0XHRbICBzWzBdLCBzWzFdLCBzWzJdLCAgLXNbMF0sIHNbMV0sIHNbMl0sICAtc1swXSwtc1sxXSwgc1syXSwgICBzWzBdLC1zWzFdLCBzWzJdLCAgICBcclxuXHRcdFx0XHQgc1swXSwgc1sxXSwgc1syXSwgICBzWzBdLC1zWzFdLCBzWzJdLCAgIHNbMF0sLXNbMV0sLXNbMl0sICAgc1swXSwgc1sxXSwtc1syXSwgICAgXHJcblx0XHRcdFx0IHNbMF0sIHNbMV0sIHNbMl0sICAgc1swXSwgc1sxXSwtc1syXSwgIC1zWzBdLCBzWzFdLC1zWzJdLCAgLXNbMF0sIHNbMV0sIHNbMl0sICAgIFxyXG5cdFx0XHRcdC1zWzBdLCBzWzFdLCBzWzJdLCAgLXNbMF0sIHNbMV0sLXNbMl0sICAtc1swXSwtc1sxXSwtc1syXSwgIC1zWzBdLC1zWzFdLCBzWzJdLCAgICBcclxuXHRcdFx0XHQtc1swXSwtc1sxXSwtc1syXSwgICBzWzBdLC1zWzFdLC1zWzJdLCAgIHNbMF0sLXNbMV0sIHNbMl0sICAtc1swXSwtc1sxXSwgc1syXSwgICAgXHJcblx0XHRcdFx0IHNbMF0sLXNbMV0sLXNbMl0sICAtc1swXSwtc1sxXSwtc1syXSwgIC1zWzBdLCBzWzFdLC1zWzJdLCAgIHNbMF0sIHNbMV0sLXNbMl0gXTsgIFxyXG5cdFx0XHRcdCBcclxuXHRtZXNoLm5vcm1hbHMgPSBcclxuXHRcdFx0WyAgMCwgMCwgMSwgICAwLCAwLCAxLCAgIDAsIDAsIDEsICAgMCwgMCwgMSwgICAgIFxyXG5cdFx0XHRcdCAxLCAwLCAwLCAgIDEsIDAsIDAsICAgMSwgMCwgMCwgICAxLCAwLCAwLCAgICAgXHJcblx0XHRcdFx0IDAsIDEsIDAsICAgMCwgMSwgMCwgICAwLCAxLCAwLCAgIDAsIDEsIDAsICAgICBcclxuXHRcdFx0XHQtMSwgMCwgMCwgIC0xLCAwLCAwLCAgLTEsIDAsIDAsICAtMSwgMCwgMCwgICAgIFxyXG5cdFx0XHRcdCAwLC0xLCAwLCAgIDAsLTEsIDAsICAgMCwtMSwgMCwgICAwLC0xLCAwLCAgICAgXHJcblx0XHRcdFx0IDAsIDAsLTEsICAgMCwgMCwtMSwgICAwLCAwLC0xLCAgIDAsIDAsLTEgXTsgICBcclxuXHJcblx0bWVzaC50ZXhDb29yZHMgPSBcclxuXHRcdFx0WyAgMSwgMSwgICAwLCAxLCAgIDAsIDAsICAgMSwgMCwgICAgXHJcblx0XHRcdFx0IDAsIDEsICAgMCwgMCwgICAxLCAwLCAgIDEsIDEsICAgIFxyXG5cdFx0XHRcdCAxLCAwLCAgIDEsIDEsICAgMCwgMSwgICAwLCAwLCAgICBcclxuXHRcdFx0XHQgMSwgMSwgICAwLCAxLCAgIDAsIDAsICAgMSwgMCwgICAgXHJcblx0XHRcdFx0IDAsIDAsICAgMSwgMCwgICAxLCAxLCAgIDAsIDEsICAgIFxyXG5cdFx0XHRcdCAwLCAwLCAgIDEsIDAsICAgMSwgMSwgICAwLCAxIF07ICBcclxuXHJcblx0bWVzaC5pbmRpY2VzID0gXHJcblx0XHRcdFsgIDAsIDEsIDIsICAgMCwgMiwgMywgICBcclxuXHRcdFx0XHQgNCwgNSwgNiwgICA0LCA2LCA3LCAgIFxyXG5cdFx0XHRcdCA4LCA5LDEwLCAgIDgsMTAsMTEsICAgXHJcblx0XHRcdFx0MTIsMTMsMTQsICAxMiwxNCwxNSwgICBcclxuXHRcdFx0XHQxNiwxNywxOCwgIDE2LDE4LDE5LCAgIFxyXG5cdFx0XHRcdDIwLDIxLDIyLCAgMjAsMjIsMjMgXTsgXHJcblxyXG5cdHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2gubG9hZCA9IGZ1bmN0aW9uIChmaWxlKSB7XHJcblx0Ly8gc29tZXRoaW5nIHNvbWV0aGluZyB4aHJcclxuXHR2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuXHRcclxuXHRyZXR1cm4gbWVzaDtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoZ2wpIHtcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciAgID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLnZlcnRpY2VzLCAgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7XHJcblx0dGhpcy5ub3JtYWxCdWZmZXIgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy5ub3JtYWxzLCAgIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpOyAgICAgIFxyXG5cdHRoaXMudGV4Q29vcmRCdWZmZXIgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMudGV4Q29vcmRzLCBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTsgICAgICBcclxuXHR0aGlzLmluZGV4QnVmZmVyICAgID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLmluZGljZXMsICAgZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGdsLlVOU0lHTkVEX1NIT1JUKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZ2wsIHNoYWRlcikge1xyXG5cdGlmICghdGhpcy52ZXJ0ZXhCdWZmZXIpIHtcclxuXHRcdHRoaXMudXBsb2FkKGdsKTtcclxuXHR9XHJcblx0XHJcblx0c2hhZGVyLnNldEFycnRpYnV0ZShcImFWZXJ0ZXhcIiwgICB0aGlzLnZlcnRleEJ1ZmZlciwgICAzKTtcclxuICBzaGFkZXIuc2V0QXJydGlidXRlKFwiYU5vcm1hbFwiLCAgIHRoaXMubm9ybWFsQnVmZmVyLCAgIDMpO1xyXG4gIHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhVGV4Q29vcmRcIiwgdGhpcy50ZXhDb29yZEJ1ZmZlciwgMik7XHJcbiAgICAgIFxyXG4gIHRoaXMuaW5kZXhCdWZmZXIuZHJhdyhnbC5UUklBTkdMRVMpO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIucmVsZWFzZSgpOyAgIFxyXG5cdGRlbGV0ZSB0aGlzLnZlcnRleEJ1ZmZlcjtcclxuXHRcclxuXHR0aGlzLm5vcm1hbEJ1ZmZlci5yZWxlYXNlKCk7ICAgXHJcblx0ZGVsZXRlIHRoaXMubm9ybWFsQnVmZmVyO1x0XHJcblx0XHJcblx0dGhpcy50ZXhDb29yZEJ1ZmZlci5yZWxlYXNlKCk7IFxyXG5cdGRlbGV0ZSB0aGlzLnRleENvb3JkQnVmZmVyO1xyXG5cdFxyXG5cdHRoaXMuaW5kZXhCdWZmZXIucmVsZWFzZSgpO1xyXG5cdGRlbGV0ZSB0aGlzLmluZGV4QnVmZmVyO1xyXG59XHJcbiIsIlxyXG5wa3pvLk1hdGVyaWFsID0gZnVuY3Rpb24gKCkge1x0XHJcblx0dGhpcy5jb2xvciA9IHBrem8udmVjMygxLCAxLCAxKTtcclxufVxyXG5cclxucGt6by5NYXRlcmlhbC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAoZ2wsIHNoYWRlcikge1xyXG5cdFxyXG5cdHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1Q29sb3InLCB0aGlzLmNvbG9yKTtcclxuXHRcclxuXHRpZiAodGhpcy50ZXh0dXJlICYmIHRoaXMudGV4dHVyZS5sb2FkZWQpIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNUZXh0dXJlJywgMSk7XHJcblx0XHR0aGlzLnRleHR1cmUuYmluZChnbCwgMClcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VUZXh0dXJlJywgMCk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc1RleHR1cmUnLCAwKTtcclxuXHR9XHJcblx0XHJcbn1cclxuIiwiXHJcbnBrem8uRW50aXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudHJhbnNmb3JtID0gcGt6by5tYXQ0KDEpO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WFZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzBdLCB0aGlzLnRyYW5zZm9ybVsxXSwgdGhpcy50cmFuc2Zvcm1bMl0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WVZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzRdLCB0aGlzLnRyYW5zZm9ybVs1XSwgdGhpcy50cmFuc2Zvcm1bNl0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WlZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzhdLCB0aGlzLnRyYW5zZm9ybVs5XSwgdGhpcy50cmFuc2Zvcm1bMTBdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBwa3pvLnZlYzModGhpcy50cmFuc2Zvcm1bMTJdLCB0aGlzLnRyYW5zZm9ybVsxM10sIHRoaXMudHJhbnNmb3JtWzE0XSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHRoaXMudHJhbnNmb3JtWzEyXSA9IHZhbHVlWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzEzXSA9IHZhbHVlWzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzE0XSA9IHZhbHVlWzJdO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24gKHRhcmdldCwgdXApIHtcclxuICB2YXIgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcbiAgdmFyIGZvcndhcmQgID0gcGt6by5ub3JtYWxpemUocGt6by5zdWIodGFyZ2V0LCBwb3NpdGlvbikpO1xyXG4gIHZhciByaWdodCAgICA9IHBrem8ubm9ybWFsaXplKHBrem8uY3Jvc3MoZm9yd2FyZCwgdXApKTtcclxuICB2YXIgdXBuICAgICAgPSBwa3pvLm5vcm1hbGl6ZShwa3pvLmNyb3NzKHJpZ2h0LCBmb3J3YXJkKSk7XHJcbiAgXHJcbiAgLy8gVE9ETyBzY2FsaW5nXHJcbiAgdGhpcy50cmFuc2Zvcm1bMF0gPSByaWdodFswXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxXSA9IHJpZ2h0WzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzJdID0gcmlnaHRbMl07XHJcbiAgXHJcbiAgdGhpcy50cmFuc2Zvcm1bNF0gPSB1cG5bMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bNV0gPSB1cG5bMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bNl0gPSB1cG5bMl07XHJcbiAgXHJcbiAgdGhpcy50cmFuc2Zvcm1bOF0gPSBmb3J3YXJkWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzldID0gZm9yd2FyZFsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxMF0gPSBmb3J3YXJkWzJdO1xyXG59XHJcbiIsIlxyXG5wa3pvLkNhbWVyYSA9IGZ1bmN0aW9uIChvcHQpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG5cdFxyXG5cdHZhciBvID0gb3B0ID8gb3B0IDoge307XHJcblx0XHJcblx0dGhpcy55Zm92ICAgPSBvLnlmb3YgPyBvLnlmb3YgOiA0NS4wO1xyXG5cdHRoaXMuem5lYXIgID0gby56bmVhciA/IG8uem5lYXIgOiAwLjE7XHJcblx0dGhpcy56ZmFyICAgPSBvLnpmYXIgPyBvLnpmYXIgOiAxMDAuMDtcclxuXHR0aGlzLmFzcGVjdCA9IDEuMDtcclxufVxyXG5cclxucGt6by5DYW1lcmEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLkNhbWVyYTtcclxuXHJcbnBrem8uQ2FtZXJhLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gVE9ETyB0YWtlIGludG8gYWNjb3VudCB0aGUgcGFyZW4ndCBwb3NpdGlvblxyXG5cdFxyXG5cdHRoaXMucHJvamVjdGlvbk1hdHJpeCA9IHBrem8ucGVyc3BlY3RpdmUodGhpcy55Zm92LCB0aGlzLmFzcGVjdCwgdGhpcy56bmVhciwgdGhpcy56ZmFyKTtcclxuXHRcclxuXHQvL3ZhciBmb3J3YXJkID0gdGhpcy5nZXRYVmVjdG9yKCk7XHJcblx0Ly92YXIgcmlnaHQgICA9IHRoaXMuZ2V0WVZlY3RvcigpO1xyXG5cdC8vdmFyIHVwICAgICAgPSB0aGlzLmdldFpWZWN0b3IoKTtcclxuXHR0aGlzLnZpZXdNYXRyaXggICA9IHBrem8ubWF0NCgxKTtcclxuXHR0aGlzLm5vcm1hbE1hdHJpeCA9IHBrem8ubWF0MygxKTtcclxuXHRcclxufVxyXG4iLCJcclxucGt6by5PYmplY3QgPSBmdW5jdGlvbiAobWVzaCwgbWF0ZXJpYWwpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG4gIFxyXG4gIHRoaXMubWVzaCAgICAgPSBtZXNoO1xyXG4gIHRoaXMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcclxufVxyXG5cclxucGt6by5PYmplY3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLk9iamVjdDtcclxuXHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGdsLCBzaGFkZXIsIHBhcmVudE1vZGVsVmlld01hdHJpeCkgeyBcclxuICBcclxuICB2YXIgbW9kZWxWaWV3TWF0cml4ID0gcGt6by5tdWx0TWF0cml4KHBhcmVudE1vZGVsVmlld01hdHJpeCwgdGhpcy50cmFuc2Zvcm0pO1xyXG4gIHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxWaWV3TWF0cml4JywgbW9kZWxWaWV3TWF0cml4KTtcclxuICBcclxuICB0aGlzLm1hdGVyaWFsLnNldHVwKGdsLCBzaGFkZXIpO1xyXG4gIHRoaXMubWVzaC5kcmF3KGdsLCBzaGFkZXIpO1xyXG59XHJcblxyXG4iLCJcclxucGt6by5SZW5kZXJlciA9IGZ1bmN0aW9uIChjYW52YXMpIHtcclxuICB0aGlzLmNhbnZhcyA9IG5ldyBwa3pvLkNhbnZhcyhjYW52YXMpO1xyXG4gIFxyXG4gIHZhciByZW5kZXJlciA9IHRoaXM7XHJcbiAgXHJcbiAgdGhpcy5jYW52YXMuaW5pdChmdW5jdGlvbiAoZ2wpIHtcclxuICAgIHJlbmRlcmVyLnNvbGlkU2hhZGVyID0gbmV3IHBrem8uU2hhZGVyKGdsLCBwa3pvLlNvbGlkVmVydCwgcGt6by5Tb2xpZEZyYWcpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5wa3pvLlJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoc2NlbmUsIGNhbWVyYSkge1xyXG5cdHZhciByZW5kZXJlciA9IHRoaXM7XHJcblx0XHJcbiAgdGhpcy5jYW52YXMuZHJhdyhmdW5jdGlvbiAoZ2wpIHtcclxuICAgIFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG5cdFx0XHJcblx0XHR2YXIgc2hhZGVyID0gcmVuZGVyZXIuc29saWRTaGFkZXI7XHRcdFxyXG5cdFx0c2hhZGVyLmJpbmQoKTtcclxuXHRcdFxyXG5cdFx0Y2FtZXJhLmFzcGVjdCA9IGdsLndpZHRoIC8gZ2wuaGVpZ2h0O1xyXG5cdFx0Y2FtZXJhLnVwZGF0ZSgpO1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VQcm9qZWN0aW9uTWF0cml4JywgY2FtZXJhLnByb2plY3Rpb25NYXRyaXgpO1x0XHRcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4M2Z2KCd1Tm9ybWFsTWF0cml4JywgY2FtZXJhLm5vcm1hbE1hdHJpeCk7XHRcdFxyXG5cdFx0XHJcblx0XHR2YXIgbW9kZWxWaWV3TWF0cml4ID0gcGt6by5tYXQ0KGNhbWVyYS52aWV3TWF0cml4KTtcdFx0XHJcblx0XHRcclxuXHRcdGlmIChzY2VuZS5lbnRpdGllcykge1xyXG5cdFx0XHRzY2VuZS5lbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRpdHkpIHtcclxuXHRcdFx0XHRpZiAoZW50aXR5LmRyYXcpIHtcclxuXHRcdFx0XHRcdGVudGl0eS5kcmF3KGdsLCBzaGFkZXIsIG1vZGVsVmlld01hdHJpeCk7XHJcblx0XHRcdFx0fVx0XHRcdFx0XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcbiAgfSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9