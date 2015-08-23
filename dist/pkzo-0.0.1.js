
var pkzo = {version: '0.0.1'};

pkzo.SolidFrag = "precision mediump float;\n\n\n\nuniform vec3 uColor;\n\nuniform sampler2D uTexture;\n\nuniform bool uHasTexture;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    if (uHasTexture) {\n\n        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(uColor, 1);\n\n    }\n\n    else {\n\n        gl_FragColor = vec4(uColor, 1);\n\n    }\n\n}";
pkzo.SolidVert = "\n\nuniform mat4 uProjectionMatrix;\n\nuniform mat4 uViewMatrix;\n\nuniform mat4 uModelMatrix;\n\nuniform mat3 uNormalMatrix;\n\n\n\nattribute vec3 aVertex;\n\nattribute vec3 aNormal;\n\nattribute vec2 aTexCoord;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main() {\n\n  vNormal     = uNormalMatrix * aNormal;\n\n  vTexCoord   = aTexCoord;\n\n  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertex, 1);\n\n}";


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
	
	this.yfov   = o.yfov ? o.yfov : 45.0;
	this.znear  = o.znear ? o.znear : 0.1;
	this.zfar   = o.zfar ? o.zfar : 100.0;
	this.aspect = 1.0;
}

pkzo.Camera.prototype = Object.create(pkzo.Entity.prototype);
pkzo.Camera.prototype.constructor = pkzo.Camera;

pkzo.Camera.prototype.enqueue = function (renderer) {
	// something, something, renderer.setCamera
}

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



pkzo.Renderer = function (canvas) {
  this.canvas = new pkzo.Canvas(canvas);
  
  var renderer = this;
  
  this.canvas.init(function (gl) {
    renderer.solidShader = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.SolidFrag);
  });
}

pkzo.Renderer.prototype.addMesh = function (transform, material, mesh) {
	this.solids.push({
		transform: transform,
		material: material, 
		mesh: mesh
	});
}

pkzo.Renderer.prototype.render = function (scene, camera) {
	var renderer = this;
	
	this.solids = [];
	scene.enqueue(this);
	
  this.canvas.draw(function (gl) {
    
		gl.enable(gl.DEPTH_TEST);
		
		var shader = renderer.solidShader;		
		shader.bind();
		
		camera.aspect = gl.width / gl.height;
		camera.update();
		shader.setUniformMatrix4fv('uProjectionMatrix', camera.projectionMatrix);		
		shader.setUniformMatrix4fv('uViewMatrix',       camera.viewMatrix);		
		shader.setUniformMatrix3fv('uNormalMatrix',     camera.normalMatrix);		
		
		
		renderer.solids.forEach(function (solid) {
			shader.setUniformMatrix4fv('uModelMatrix', solid.transform);		
			solid.material.setup(gl, shader);			
			solid.mesh.draw(gl, shader);
		});
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBrem8uanMiLCJzaGFkZXJzLmpzIiwidmVjdG9yLmpzIiwibWF0cml4LmpzIiwiQ2FudmFzLmpzIiwiVGV4dHVyZS5qcyIsIlNoYWRlci5qcyIsIlNjZW5lLmpzIiwiQnVmZmVyLmpzIiwiTWVzaC5qcyIsIk1hdGVyaWFsLmpzIiwiRW50aXR5LmpzIiwiQ2FtZXJhLmpzIiwiT2JqZWN0LmpzIiwiUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJwa3pvLTAuMC4xLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBwa3pvID0ge3ZlcnNpb246ICcwLjAuMSd9O1xyXG4iLCJwa3pvLlNvbGlkRnJhZyA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSB2ZWMzIHVDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZTtcXG5cXG51bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgaWYgKHVIYXNUZXh0dXJlKSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCkgKiB2ZWM0KHVDb2xvciwgMSk7XFxuXFxuICAgIH1cXG5cXG4gICAgZWxzZSB7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHVDb2xvciwgMSk7XFxuXFxuICAgIH1cXG5cXG59XCI7XG5wa3pvLlNvbGlkVmVydCA9IFwiXFxuXFxudW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xcblxcbnVuaWZvcm0gbWF0NCB1Vmlld01hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDQgdU1vZGVsTWF0cml4O1xcblxcbnVuaWZvcm0gbWF0MyB1Tm9ybWFsTWF0cml4O1xcblxcblxcblxcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXg7XFxuXFxuYXR0cmlidXRlIHZlYzMgYU5vcm1hbDtcXG5cXG5hdHRyaWJ1dGUgdmVjMiBhVGV4Q29vcmQ7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKSB7XFxuXFxuICB2Tm9ybWFsICAgICA9IHVOb3JtYWxNYXRyaXggKiBhTm9ybWFsO1xcblxcbiAgdlRleENvb3JkICAgPSBhVGV4Q29vcmQ7XFxuXFxuICBnbF9Qb3NpdGlvbiA9IHVQcm9qZWN0aW9uTWF0cml4ICogdVZpZXdNYXRyaXggKiB1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXgsIDEpO1xcblxcbn1cIjtcbiIsIlxyXG5wa3pvLnZlYzIgPSBmdW5jdGlvbiAodjAsIHYxKSB7XHJcbiAgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgIHR5cGVvZiB2MSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjBdKTtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjEgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYxXSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMik7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLnZlYzMgPSBmdW5jdGlvbiAodjAsIHYxLCB2Mikge1xyXG4gIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICB0eXBlb2YgdjEgPT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiB2MiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjAsIHYwXSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYxID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjIgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYxLCB2Ml0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by52ZWM0ID0gZnVuY3Rpb24gKHYwLCB2MSwgdjIsIHY0KSB7XHJcbiAgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgIHR5cGVvZiB2MSA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIHYyID09PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgdjMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYwLCB2MCwgdjBdKTtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjEgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MiA9PT0gJ251bWJlcicgJiZcclxuICAgICAgICAgICB0eXBlb2YgdjMgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYxLCB2MiwgdjRdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSg0KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGFkZCBhbmQgc3ViIGFsc28gd29yayBmb3IgbWF0cml4XHJcbnBrem8uYWRkID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gKyBiW2ldO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5zdWIgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSAtIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHYgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgdiArPSBhW2ldICogYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbnBrem8uY3Jvc3MgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIC8vIGFzc3VtZSBhLmxlbmd0aCA9PSBiLmxlbmd0aCA9PSAzXHJcbiAgXHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gIFxyXG4gIHJbMF0gPSAoYVsxXSAqIGJbMl0pIC0gKGFbMl0gKiBiWzFdKTtcclxuICByWzFdID0gKGFbMl0gKiBiWzBdKSAtIChhWzBdICogYlsyXSk7XHJcbiAgclsyXSA9IChhWzBdICogYlsxXSkgLSAoYVsxXSAqIGJbMF0pO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLm11bHRWZWN0b3JTY2FsYXIgPSBmdW5jdGlvbiAodiwgcykge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSh2Lmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gdltpXSAqIHM7XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLmxlbmd0aCA9IGZ1bmN0aW9uICh2KSB7ICBcclxuICByZXR1cm4gTWF0aC5zcXJ0KHBrem8uZG90KHYsIHYpKTtcclxufVxyXG5cclxucGt6by5ub3JtYWxpemUgPSBmdW5jdGlvbiAodikge1xyXG4gIHJldHVybiBwa3pvLm11bHRWZWN0b3JTY2FsYXIodiwgMSAvIHBrem8ubGVuZ3RoKHYpKTtcclxufVxyXG5cclxuIiwiXHJcbnBrem8ubWF0MiA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnYXJyYXknKSB7XHJcbiAgICBpZiAodi5sZW5ndGggIT0gNCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDIgbXVzdCBiZSA0IHZhbHVlcycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2LCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIHZdKTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDFdKTtcclxufVxyXG5cclxucGt6by5tYXQzID0gZnVuY3Rpb24gKHYpIHtcclxuICBpZiAodHlwZW9mIHYgPT09ICdhcnJheScpIHtcclxuICAgIGlmICh2Lmxlbmd0aCAhPSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWF0MyBtdXN0IGJlIDkgdmFsdWVzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgdiwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCB2XSk7XHJcbiAgfVxyXG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAxXSk7XHJcbn1cclxuXHJcbnBrem8ubWF0NCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnYXJyYXknKSB7XHJcbiAgICBpZiAodi5sZW5ndGggIT0gMTYpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXQ0IG11c3QgYmUgMTYgdmFsdWVzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgdiwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCB2LCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIHZdKTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIDFdKTtcclxufVxyXG5cclxucGt6by5tdWx0TWF0cml4ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAvLyBhc3N1bWUgYS5sZW5ndGggPT0gYi5sZW5ndGhcclxuICB2YXIgbiA9IE1hdGguc3FydChhLmxlbmd0aCk7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgdmFyIHYgPSAwO1xyXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IG47IGsrKykge1xyXG4gICAgICAgIHYgPSB2ICsgYVtpKm4ra10gKiBiW2sqbitqXTtcclxuICAgICAgfVxyXG4gICAgICByW2kqbitqXSA9IHY7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnJhZGlhbnMgPSBmdW5jdGlvbihkZWdyZWVzKSB7XHJcbiAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xyXG59O1xyXG5cclxucGt6by5kZWdyZWVzID0gZnVuY3Rpb24ocmFkaWFucykge1xyXG4gIHJldHVybiByYWRpYW5zICogMTgwIC8gTWF0aC5QSTtcclxufTsgXHJcblxyXG5cclxucGt6by5vcnRobyA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikge1xyXG4gIHZhciBybCA9IChyaWdodCAtIGxlZnQpO1xyXG4gIHZhciB0YiA9ICh0b3AgLSBib3R0b20pO1xyXG4gIHZhciBmbiA9IChmYXIgLSBuZWFyKTtcclxuICBcclxuICB2YXIgbSA9IHBrem8ubWF0NCgpOyAgXHJcbiAgXHJcbiAgbVswXSA9IDIgLyBybDtcclxuICBtWzFdID0gMDtcclxuICBtWzJdID0gMDtcclxuICBtWzNdID0gMDtcclxuICBtWzRdID0gMDtcclxuICBtWzVdID0gMiAvIHRiO1xyXG4gIG1bNl0gPSAwO1xyXG4gIG1bN10gPSAwO1xyXG4gIG1bOF0gPSAwO1xyXG4gIG1bOV0gPSAwO1xyXG4gIG1bMTBdID0gLTIgLyBmbjtcclxuICBtWzExXSA9IDA7XHJcbiAgbVsxMl0gPSAtKGxlZnQgKyByaWdodCkgLyBybDtcclxuICBtWzEzXSA9IC0odG9wICsgYm90dG9tKSAvIHRiO1xyXG4gIG1bMTRdID0gLShmYXIgKyBuZWFyKSAvIGZuO1xyXG4gIG1bMTVdID0gMTtcclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnBrem8uZnJ1c3R1bSA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIHpuZWFyLCB6ZmFyKSB7XHJcbiAgdmFyIHQxID0gMiAqIHpuZWFyO1xyXG4gIHZhciB0MiA9IHJpZ2h0IC0gbGVmdDtcclxuICB2YXIgdDMgPSB0b3AgLSBib3R0b207XHJcbiAgdmFyIHQ0ID0gemZhciAtIHpuZWFyO1xyXG5cclxuICB2YXIgbSA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xyXG4gIFxyXG4gIG1bMF0gPSB0MS90MjsgbVs0XSA9ICAgICAwOyBtWyA4XSA9ICAocmlnaHQgKyBsZWZ0KSAvIHQyOyBtWzEyXSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIG1bMV0gPSAgICAgMDsgbVs1XSA9IHQxL3QzOyBtWyA5XSA9ICAodG9wICsgYm90dG9tKSAvIHQzOyBtWzEzXSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIG1bMl0gPSAgICAgMDsgbVs2XSA9ICAgICAwOyBtWzEwXSA9ICgtemZhciAtIHpuZWFyKSAvIHQ0OyBtWzE0XSA9ICgtdDEgKiB6ZmFyKSAvIHQ0O1xyXG4gIG1bM10gPSAgICAgMDsgbVs3XSA9ICAgICAwOyBtWzExXSA9ICAgICAgICAgICAgICAgICAgIC0xOyBtWzE1XSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIFxyXG4gIHJldHVybiBtO1xyXG59XHJcblxyXG5wa3pvLnBlcnNwZWN0aXZlID0gZnVuY3Rpb24gKGZvdnksIGFzcGVjdCwgem5lYXIsIHpmYXIpIHtcclxuICB2YXIgeW1heCA9IHpuZWFyICogTWF0aC50YW4ocGt6by5yYWRpYW5zKGZvdnkpKTtcclxuICB2YXIgeG1heCA9IHltYXggKiBhc3BlY3Q7XHJcbiAgcmV0dXJuIHBrem8uZnJ1c3R1bSgteG1heCwgeG1heCwgLXltYXgsIHltYXgsIHpuZWFyLCB6ZmFyKTtcclxufVxyXG5cclxuLy8gTk9URTogdGhpcyBpcyBpbmVmZmljaWVudCwgaXQgbWF5IGJlIHNlbnNpYmxlIHRvIHByb3ZpZGUgaW5wbGFjZSB2ZXJzaW9uc1xyXG5wa3pvLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKG0sIHgsIHksIHopIHsgICAgXHJcbiAgdmFyIHIgPSBwa3pvLm1hdDQobSk7XHJcbiAgclsxMl0gPSBtWzBdICogeCArIG1bNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl07XHJcbiAgclsxM10gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM107XHJcbiAgclsxNF0gPSBtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XHJcbiAgclsxNV0gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV07XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8ucm90YXRlID0gZnVuY3Rpb24gKG0sIGFuZ2xlLCB4LCB5LCB6KSB7ICBcclxuICB2YXIgYSA9IHBrem8ucmFkaWFucyhhbmdsZSk7XHJcbiAgdmFyIGMgPSBNYXRoLmNvcyhhKTtcclxuICB2YXIgcyA9IE1hdGguc2luKGEpO1xyXG4gIFxyXG4gIHZhciBsID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgdmFyIG54ID0geCAvIGw7XHJcbiAgdmFyIG55ID0geSAvIGw7XHJcbiAgdmFyIG56ID0geiAvIGw7XHJcblxyXG4gIHZhciB0MCA9IG54ICogKDEgLSBjKTtcclxuICB2YXIgdDEgPSBueSAqICgxIC0gYyk7XHJcbiAgdmFyIHQyID0gbnogKiAoMSAtIGMpOyAgXHJcblxyXG4gIHZhciBkID0gcGt6by5tYXQ0KDEpO1xyXG4gIFxyXG4gIGRbIDBdID0gYyArIHQwICogbng7XHJcbiAgZFsgMV0gPSAwICsgdDAgKiBueSArIHMgKiBuejtcclxuICBkWyAyXSA9IDAgKyB0MCAqIG56IC0gcyAqIG55O1xyXG5cclxuICBkWyA0XSA9IDAgKyB0MSAqIG54IC0gcyAqIG56O1xyXG4gIGRbIDVdID0gYyArIHQxICogbnk7XHJcbiAgZFsgNl0gPSAwICsgdDEgKiBueiArIHMgKiBueDtcclxuXHJcbiAgZFsgOF0gPSAwICsgdDIgKiBueCArIHMgKiBueTtcclxuICBkWyA5XSA9IDAgKyB0MiAqIG55IC0gcyAqIG54O1xyXG4gIGRbMTBdID0gYyArIHQyICogbno7ICBcclxuICBcclxuICB2YXIgciA9IHBrem8ubXVsdE1hdHJpeChtLCBkKTtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnNjYWxlID0gZnVuY3Rpb24obSwgeCwgeSwgeikgeyAgICBcclxuICB2YXIgciA9IHBrem8ubWF0NCgxKTtcclxuICBcclxuICByWyAwXSA9IG1bIDBdICogeDsgXHJcbiAgclsgMV0gPSBtWyAxXSAqIHg7IFxyXG4gIHJbIDJdID0gbVsgMl0gKiB4OyBcclxuICByWyAzXSA9IG1bIDNdICogeDsgXHJcbiAgXHJcbiAgclsgNF0gPSBtWyA0XSAqIHk7IFxyXG4gIHJbIDVdID0gbVsgNV0gKiB5OyBcclxuICByWyA2XSA9IG1bIDZdICogeTsgXHJcbiAgclsgN10gPSBtWyA3XSAqIHk7IFxyXG4gIFxyXG4gIHJbIDhdID0gbVsgOF0gKiB6O1xyXG4gIHJbIDldID0gbVsgOV0gKiB6O1xyXG4gIHJbMTBdID0gbVsxMF0gKiB6O1xyXG4gIHJbMTFdID0gbVsxMV0gKiB6O1xyXG4gIFxyXG4gIHJbMTJdID0gbVsxMl07XHJcbiAgclsxM10gPSBtWzEzXTtcclxuICByWzE0XSA9IG1bMTRdO1xyXG4gIHJbMTVdID0gbVsxNV07XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn0iLCJcclxucGt6by5DYW52YXMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5jYW52YXMgPSBlbGVtZW50O1xyXG4gIH0gIFxyXG4gIFxyXG4gIHRoaXMuY2FudmFzLndpZHRoICA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xyXG4gIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIiwge2FudGlhbGlhczogdHJ1ZSwgZGVwdGg6IHRydWV9KTtcclxuICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcclxuICBcclxuICAvLyB0aGVzZSB2YWx1ZXMgYXJlIGZvciB0aGUgcHJvZ3JhbW1lciBvZiB0aGUgZHJhdyBmdW5jdGlvbiwgXHJcbiAgLy8gd2UgcGFzcyB0aGUgZ2wgb2JqZWN0LCBub3QgdGhlIGNhbnZhcy5cclxuICB0aGlzLmdsLndpZHRoICA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gIHRoaXMuZ2wuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG59XHJcblxyXG5wa3pvLkNhbnZhcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChjYikge1xyXG4gIGlmIChjYikge1xyXG4gICAgY2IuY2FsbCh0aGlzLCB0aGlzLmdsKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQ2FudmFzLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGNiKSB7ICBcclxuICBpZiAodGhpcy5jYW52YXMud2lkdGggIT0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGggfHwgdGhpcy5jYW52YXMuaGVpZ2h0ICE9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodCkge1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggID0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7ICBcclxuICAgIHRoaXMuZ2wud2lkdGggID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICB0aGlzLmdsLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IHRoaXMuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbiAgXHJcbiAgaWYgKGNiKSB7XHJcbiAgICBjYi5jYWxsKHRoaXMsIHRoaXMuZ2wpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLlRleHR1cmUgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgdGhpcy51cmwgICAgPSB1cmw7XHJcbiAgdGhpcy5pbWFnZSAgPSBudWxsO1xyXG4gIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgXHJcbiAgLy8gd2UgZG9uJ3QgdXBsb2FkIHRoZSBpbWFnZSB0byBWUkFNLCBidXQgdHJ5IHRvIGxvYWQgaXRcclxuICB0aGlzLmxvYWQoKTtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKCkge1x0XHJcbiAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIHZhciB0ZXh0dXJlID0gdGhpcztcclxuICB0aGlzLmltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRleHR1cmUubG9hZGVkID0gdHJ1ZTsgICAgXHJcbiAgfTtcclxuICB0aGlzLmltYWdlLnNyYyA9IHRoaXMudXJsO1xyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuaWQpO1xyXG4gIFxyXG4gIGlmICh0aGlzLmxvYWRlZCkge1xyXG4gICAgdGhpcy5zeW5jKCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV8yRCwgMCwgdGhpcy5nbC5SR0JBLCAxLCAxLCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLlRleHR1cmUucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuaWQpOyAgXHJcbiAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV8yRCwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgdGhpcy5pbWFnZSk7ICBcclxuICB0aGlzLmdsLmdlbmVyYXRlTWlwbWFwKHRoaXMuZ2wuVEVYVFVSRV8yRCk7XHJcbiAgXHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMuZ2wuTElORUFSKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5nbC5MSU5FQVJfTUlQTUFQX0xJTkVBUik7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX1dSQVBfUywgdGhpcy5nbC5SRVBFQVQpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMuZ2wuUkVQRUFUKTtcclxuICBcclxuICAvLyBjYW4gd2UgZGlzY2FyZCBpbWFnZSBub3c/XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmdsLmRlbGV0ZVRleHR1cmUodGhpcy5pZCk7XHJcbiAgdGhpcy5pZCA9IG51bGw7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChnbCwgY2hhbm5lbCkge1xyXG5cdHRoaXMuZ2wgPSBnbDtcclxuICBpZiAoISB0aGlzLmlkKSB7XHJcbiAgICB0aGlzLnVwbG9hZCgpO1xyXG4gIH1cclxuXHQvLyBUT0RPIGNoYW5uZWxcclxuICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5pZCk7XHJcbn1cclxuIiwiXHJcbnBrem8uU2hhZGVyID0gZnVuY3Rpb24gKGdsLCB2ZXJ0ZXhDb2RlLCBmcmFnbWVudENvZGUpIHtcclxuICB0aGlzLmdsICAgICAgICAgICA9IGdsO1xyXG4gIHRoaXMudmVydGV4Q29kZSAgID0gdmVydGV4Q29kZTtcclxuICB0aGlzLmZyYWdtZW50Q29kZSA9IGZyYWdtZW50Q29kZTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmNvbXBpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHZlcnRleFNoYWRlciAgID0gdGhpcy5jb21waWxlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUiwgICB0aGlzLnZlcnRleENvZGUpO1xyXG4gIHZhciBmcmFnbWVudFNoYWRlciA9IHRoaXMuY29tcGlsZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUiwgdGhpcy5mcmFnbWVudENvZGUpO1xyXG4gIFxyXG4gIHZhciBwcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgXHJcbiAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcclxuICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XHJcbiAgXHJcbiAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICBcclxuICB2YXIgaW5mb0xvZyA9IHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XHJcbiAgaWYgKHRoaXMuZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCB0aGlzLmdsLkxJTktfU1RBVFVTKSA9PT0gZmFsc2UpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihpbmZvTG9nKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoaW5mb0xvZyAhPT0gJycpIHtcclxuICAgIGNvbnNvbGUubG9nKGluZm9Mb2cpO1xyXG4gIH1cclxuICBcclxuICB0aGlzLmdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xyXG4gIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcclxuICBcclxuICB0aGlzLmlkID0gcHJvZ3JhbTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLmNvbXBpbGVTaGFkZXIgPSBmdW5jdGlvbiAodHlwZSwgY29kZSkge1xyXG4gIHZhciBpZCA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHR5cGUpOyAgXHJcbiAgXHJcbiAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoaWQsIGNvZGUpO1xyXG4gIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihpZCk7XHJcbiAgXHJcbiAgdmFyIGluZm9Mb2cgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coaWQpO1xyXG4gIGlmICh0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihpZCwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykgPT09IGZhbHNlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoaW5mb0xvZyk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGluZm9Mb2cgIT09ICcnKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbmZvTG9nKTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGlkO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmdsLmRlbGV0ZVByb2dyYW0oaWQpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuaWQpIHtcclxuICAgIHRoaXMuY29tcGlsZSgpO1xyXG4gIH1cclxuICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5pZCk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRBcnJ0aWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgYnVmZmVyLCBlbGVtZW50U2l6ZSkgeyAgXHJcbiAgYnVmZmVyLmJpbmQoKTsgIFxyXG4gIFxyXG4gIGlmIChlbGVtZW50U2l6ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB2YXIgZWxlbWVudFNpemUgPSBidWZmZXIuZWxlbWVudFNpemU7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBwb3MgPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zKTtcclxuICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zLCBlbGVtZW50U2l6ZSwgYnVmZmVyLmVsZW1lbnRUeXBlLCB0aGlzLmdsLkZBTFNFLCAwLCAwKTsgIFxyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTFpID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTFpKGxvYywgdmFsdWUpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTFmID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTFmKGxvYywgdmFsdWUpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybTJmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm0yZihsb2MsIHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtM2Z2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTNmKGxvYywgdmFsdWVbMF0sIHZhbHVlWzFdLCB2YWx1ZVsyXSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtNGZ2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTRmKGxvYywgdmFsdWVbMF0sIHZhbHVlWzFdLCB2YWx1ZVsyXSwgdmFsdWVbNF0pO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybU1hdHJpeDNmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgdHJhbnNwb3NlKSB7XHJcbiAgaWYgKHRyYW5zcG9zZSA9PT0gdW5kZWZpbmVkIHx8dHJhbnNwb3NlID09PSBudWxsKSB7XHJcbiAgICB2YXIgdHJhbnNwb3NlID0gZmFsc2U7XHJcbiAgfVxyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm1NYXRyaXgzZnYobG9jLCB0cmFuc3Bvc2UsIHZhbHVlKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm1NYXRyaXg0ZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIHRyYW5zcG9zZSkge1xyXG4gIGlmICh0cmFuc3Bvc2UgPT09IHVuZGVmaW5lZCB8fHRyYW5zcG9zZSA9PT0gbnVsbCkge1xyXG4gICAgdmFyIHRyYW5zcG9zZSA9IGZhbHNlO1xyXG4gIH1cclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtTWF0cml4NGZ2KGxvYywgdHJhbnNwb3NlLCB2YWx1ZSk7XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5TY2VuZSA9IGZ1bmN0aW9uICgpIHt9XHJcblxyXG5wa3pvLlNjZW5lLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcblx0aWYgKHRoaXMuZW50aXRpZXMpIHtcclxuXHRcdHRoaXMuZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50aXR5KSB7XHJcblx0XHRcdGVudGl0eS5lbnF1ZXVlKHJlbmRlcmVyKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxucGt6by5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVudGl0eSkge1xyXG4gIGlmICghIHRoaXMuZW50aXRpZXMpIHtcclxuICAgIHRoaXMuZW50aXRpZXMgPSBbZW50aXR5XVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xyXG4gIH1cclxufSIsIlxyXG5wa3pvLkJ1ZmZlciA9IGZ1bmN0aW9uIChnbCwgZGF0YSwgYnR5cGUsIGV0eXBlKSB7XHJcbiAgdGhpcy5nbCA9IGdsO1xyXG4gIFxyXG4gIGlmIChidHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBnbC5BUlJBWV9CVUZGRVI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy50eXBlID0gYnR5cGU7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChldHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAodGhpcy50eXBlID09IGdsLkFSUkFZX0JVRkZFUikge1xyXG4gICAgICB0aGlzLmVsZW1lbnRUeXBlID0gZ2wuRkxPQVQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5lbGVtZW50VHlwZSA9IGdsLlVOU0lHTkVEX1NIT1JUO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMuZWxlbWVudFR5cGUgPSBldHlwZTtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5sb2FkKGRhdGEpO1xyXG59XHJcblxyXG5wa3pvLndyYXBBcnJheSA9IGZ1bmN0aW9uIChnbCwgdHlwZSwgZGF0YSkge1xyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSBnbC5GTE9BVDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLkRPVUJMRTpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDY0QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX0JZVEU6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuVU5TSUdORURfU0hPUlQ6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDE2QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVDpcclxuICAgICAgcmV0dXJuIG5ldyBVaW50MzJBcnJheShkYXRhKTtcclxuICAgIGNhc2UgZ2wuQllURTpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlNIT1JUOlxyXG4gICAgICByZXR1cm4gbmV3IEludDE2QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLklOVDpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQzMkFycmF5KGRhdGEpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoZGF0YSkgeyAgXHJcbiAgaWYgKGRhdGFbMF0ubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMuZWxlbWVudFNpemUgPSAxO1xyXG4gICAgdGhpcy5kYXRhID0gcGt6by53cmFwQXJyYXkodGhpcy5nbCwgdGhpcy5lbGVtZW50VHlwZSwgZGF0YSk7XHJcbiAgfVxyXG4gIGVsc2UgeyAgICBcclxuICAgIHRoaXMuZWxlbWVudFNpemUgPSBkYXRhWzBdLmxlbmd0aDtcclxuICAgIHRoaXMuZGF0YSA9IHBrem8ud3JhcEFycmF5KHRoaXMuZ2wsIHRoaXMuZWxlbWVudFR5cGUsIGRhdGEubGVuZ3RoICogdGhpcy5lbGVtU2l6ZSk7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB2YXIgYnVmZmVyID0gdGhpcztcclxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICBlbGVtLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICBidWZmZXIuZGF0YVtpXSA9IHY7XHJcbiAgICAgICAgaSsrO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLnVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy50eXBlLCB0aGlzLmlkKTtcclxuICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy50eXBlLCB0aGlzLmRhdGEsIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAodGhpcy5pZCkge1xyXG4gICAgdGhpcy5nbC5kZWxldGVCdWZmZXIodGhpcy5pZCk7XHJcbiAgICB0aGlzLmlkID0gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ocHJpbWl0aXZlKSB7XHJcbiAgaWYgKCEgdGhpcy5pZCkge1xyXG4gICAgdGhpcy51cGxvYWQoKTtcclxuICB9XHJcbiAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMudHlwZSwgdGhpcy5pZCk7XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24ocHJpbWl0aXZlKSB7XHJcbiAgdGhpcy5iaW5kKCk7XHJcbiAgdGhpcy5nbC5kcmF3RWxlbWVudHMocHJpbWl0aXZlLCB0aGlzLmRhdGEubGVuZ3RoLCB0aGlzLmVsZW1lbnRUeXBlLCAwKTtcclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLk1lc2ggPSBmdW5jdGlvbiAoKSB7fVxyXG5cclxucGt6by5NZXNoLmJveCA9IGZ1bmN0aW9uIChzKSB7XHJcblx0XHJcblx0dmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcblx0XHJcblx0bWVzaC52ZXJ0aWNlcyA9IFxyXG5cdFx0XHRbICBzWzBdLCBzWzFdLCBzWzJdLCAgLXNbMF0sIHNbMV0sIHNbMl0sICAtc1swXSwtc1sxXSwgc1syXSwgICBzWzBdLC1zWzFdLCBzWzJdLCAgICBcclxuXHRcdFx0XHQgc1swXSwgc1sxXSwgc1syXSwgICBzWzBdLC1zWzFdLCBzWzJdLCAgIHNbMF0sLXNbMV0sLXNbMl0sICAgc1swXSwgc1sxXSwtc1syXSwgICAgXHJcblx0XHRcdFx0IHNbMF0sIHNbMV0sIHNbMl0sICAgc1swXSwgc1sxXSwtc1syXSwgIC1zWzBdLCBzWzFdLC1zWzJdLCAgLXNbMF0sIHNbMV0sIHNbMl0sICAgIFxyXG5cdFx0XHRcdC1zWzBdLCBzWzFdLCBzWzJdLCAgLXNbMF0sIHNbMV0sLXNbMl0sICAtc1swXSwtc1sxXSwtc1syXSwgIC1zWzBdLC1zWzFdLCBzWzJdLCAgICBcclxuXHRcdFx0XHQtc1swXSwtc1sxXSwtc1syXSwgICBzWzBdLC1zWzFdLC1zWzJdLCAgIHNbMF0sLXNbMV0sIHNbMl0sICAtc1swXSwtc1sxXSwgc1syXSwgICAgXHJcblx0XHRcdFx0IHNbMF0sLXNbMV0sLXNbMl0sICAtc1swXSwtc1sxXSwtc1syXSwgIC1zWzBdLCBzWzFdLC1zWzJdLCAgIHNbMF0sIHNbMV0sLXNbMl0gXTsgIFxyXG5cdFx0XHRcdCBcclxuXHRtZXNoLm5vcm1hbHMgPSBcclxuXHRcdFx0WyAgMCwgMCwgMSwgICAwLCAwLCAxLCAgIDAsIDAsIDEsICAgMCwgMCwgMSwgICAgIFxyXG5cdFx0XHRcdCAxLCAwLCAwLCAgIDEsIDAsIDAsICAgMSwgMCwgMCwgICAxLCAwLCAwLCAgICAgXHJcblx0XHRcdFx0IDAsIDEsIDAsICAgMCwgMSwgMCwgICAwLCAxLCAwLCAgIDAsIDEsIDAsICAgICBcclxuXHRcdFx0XHQtMSwgMCwgMCwgIC0xLCAwLCAwLCAgLTEsIDAsIDAsICAtMSwgMCwgMCwgICAgIFxyXG5cdFx0XHRcdCAwLC0xLCAwLCAgIDAsLTEsIDAsICAgMCwtMSwgMCwgICAwLC0xLCAwLCAgICAgXHJcblx0XHRcdFx0IDAsIDAsLTEsICAgMCwgMCwtMSwgICAwLCAwLC0xLCAgIDAsIDAsLTEgXTsgICBcclxuXHJcblx0bWVzaC50ZXhDb29yZHMgPSBcclxuXHRcdFx0WyAgMSwgMSwgICAwLCAxLCAgIDAsIDAsICAgMSwgMCwgICAgXHJcblx0XHRcdFx0IDAsIDEsICAgMCwgMCwgICAxLCAwLCAgIDEsIDEsICAgIFxyXG5cdFx0XHRcdCAxLCAwLCAgIDEsIDEsICAgMCwgMSwgICAwLCAwLCAgICBcclxuXHRcdFx0XHQgMSwgMSwgICAwLCAxLCAgIDAsIDAsICAgMSwgMCwgICAgXHJcblx0XHRcdFx0IDAsIDAsICAgMSwgMCwgICAxLCAxLCAgIDAsIDEsICAgIFxyXG5cdFx0XHRcdCAwLCAwLCAgIDEsIDAsICAgMSwgMSwgICAwLCAxIF07ICBcclxuXHJcblx0bWVzaC5pbmRpY2VzID0gXHJcblx0XHRcdFsgIDAsIDEsIDIsICAgMCwgMiwgMywgICBcclxuXHRcdFx0XHQgNCwgNSwgNiwgICA0LCA2LCA3LCAgIFxyXG5cdFx0XHRcdCA4LCA5LDEwLCAgIDgsMTAsMTEsICAgXHJcblx0XHRcdFx0MTIsMTMsMTQsICAxMiwxNCwxNSwgICBcclxuXHRcdFx0XHQxNiwxNywxOCwgIDE2LDE4LDE5LCAgIFxyXG5cdFx0XHRcdDIwLDIxLDIyLCAgMjAsMjIsMjMgXTsgXHJcblxyXG5cdHJldHVybiBtZXNoO1xyXG59XHJcblxyXG5wa3pvLk1lc2gubG9hZCA9IGZ1bmN0aW9uIChmaWxlKSB7XHJcblx0Ly8gc29tZXRoaW5nIHNvbWV0aGluZyB4aHJcclxuXHR2YXIgbWVzaCA9IG5ldyBwa3pvLk1lc2goKTtcclxuXHRcclxuXHRyZXR1cm4gbWVzaDtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoZ2wpIHtcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciAgID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLnZlcnRpY2VzLCAgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7XHJcblx0dGhpcy5ub3JtYWxCdWZmZXIgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy5ub3JtYWxzLCAgIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpOyAgICAgIFxyXG5cdHRoaXMudGV4Q29vcmRCdWZmZXIgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMudGV4Q29vcmRzLCBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTsgICAgICBcclxuXHR0aGlzLmluZGV4QnVmZmVyICAgID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLmluZGljZXMsICAgZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGdsLlVOU0lHTkVEX1NIT1JUKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZ2wsIHNoYWRlcikge1xyXG5cdGlmICghdGhpcy52ZXJ0ZXhCdWZmZXIpIHtcclxuXHRcdHRoaXMudXBsb2FkKGdsKTtcclxuXHR9XHJcblx0XHJcblx0c2hhZGVyLnNldEFycnRpYnV0ZShcImFWZXJ0ZXhcIiwgICB0aGlzLnZlcnRleEJ1ZmZlciwgICAzKTtcclxuICBzaGFkZXIuc2V0QXJydGlidXRlKFwiYU5vcm1hbFwiLCAgIHRoaXMubm9ybWFsQnVmZmVyLCAgIDMpO1xyXG4gIHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhVGV4Q29vcmRcIiwgdGhpcy50ZXhDb29yZEJ1ZmZlciwgMik7XHJcbiAgICAgIFxyXG4gIHRoaXMuaW5kZXhCdWZmZXIuZHJhdyhnbC5UUklBTkdMRVMpO1xyXG59XHJcblxyXG5wa3pvLk1lc2gucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIucmVsZWFzZSgpOyAgIFxyXG5cdGRlbGV0ZSB0aGlzLnZlcnRleEJ1ZmZlcjtcclxuXHRcclxuXHR0aGlzLm5vcm1hbEJ1ZmZlci5yZWxlYXNlKCk7ICAgXHJcblx0ZGVsZXRlIHRoaXMubm9ybWFsQnVmZmVyO1x0XHJcblx0XHJcblx0dGhpcy50ZXhDb29yZEJ1ZmZlci5yZWxlYXNlKCk7IFxyXG5cdGRlbGV0ZSB0aGlzLnRleENvb3JkQnVmZmVyO1xyXG5cdFxyXG5cdHRoaXMuaW5kZXhCdWZmZXIucmVsZWFzZSgpO1xyXG5cdGRlbGV0ZSB0aGlzLmluZGV4QnVmZmVyO1xyXG59XHJcbiIsIlxyXG5wa3pvLk1hdGVyaWFsID0gZnVuY3Rpb24gKCkge1x0XHJcblx0dGhpcy5jb2xvciA9IHBrem8udmVjMygxLCAxLCAxKTtcclxufVxyXG5cclxucGt6by5NYXRlcmlhbC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAoZ2wsIHNoYWRlcikge1xyXG5cdFxyXG5cdHNoYWRlci5zZXRVbmlmb3JtM2Z2KCd1Q29sb3InLCB0aGlzLmNvbG9yKTtcclxuXHRcclxuXHRpZiAodGhpcy50ZXh0dXJlICYmIHRoaXMudGV4dHVyZS5sb2FkZWQpIHtcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VIYXNUZXh0dXJlJywgMSk7XHJcblx0XHR0aGlzLnRleHR1cmUuYmluZChnbCwgMClcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtMWkoJ3VUZXh0dXJlJywgMCk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm0xaSgndUhhc1RleHR1cmUnLCAwKTtcclxuXHR9XHJcblx0XHJcbn1cclxuIiwiXHJcbnBrem8uRW50aXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudHJhbnNmb3JtID0gcGt6by5tYXQ0KDEpO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGFuZ2xlLCB4LCB5LCB6KSB7XHJcblx0dGhpcy50cmFuc2Zvcm0gPSBwa3pvLnJvdGF0ZSh0aGlzLnRyYW5zZm9ybSwgYW5nbGUsIHgsIHksIHopO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WFZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzBdLCB0aGlzLnRyYW5zZm9ybVsxXSwgdGhpcy50cmFuc2Zvcm1bMl0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WVZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzRdLCB0aGlzLnRyYW5zZm9ybVs1XSwgdGhpcy50cmFuc2Zvcm1bNl0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuZ2V0WlZlY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzhdLCB0aGlzLnRyYW5zZm9ybVs5XSwgdGhpcy50cmFuc2Zvcm1bMTBdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBwa3pvLnZlYzModGhpcy50cmFuc2Zvcm1bMTJdLCB0aGlzLnRyYW5zZm9ybVsxM10sIHRoaXMudHJhbnNmb3JtWzE0XSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHRoaXMudHJhbnNmb3JtWzEyXSA9IHZhbHVlWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzEzXSA9IHZhbHVlWzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzE0XSA9IHZhbHVlWzJdO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24gKHRhcmdldCwgdXApIHtcclxuICB2YXIgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcbiAgdmFyIGZvcndhcmQgID0gcGt6by5ub3JtYWxpemUocGt6by5zdWIodGFyZ2V0LCBwb3NpdGlvbikpO1xyXG4gIHZhciByaWdodCAgICA9IHBrem8ubm9ybWFsaXplKHBrem8uY3Jvc3MoZm9yd2FyZCwgdXApKTtcclxuICB2YXIgdXBuICAgICAgPSBwa3pvLm5vcm1hbGl6ZShwa3pvLmNyb3NzKHJpZ2h0LCBmb3J3YXJkKSk7XHJcbiAgXHJcbiAgLy8gVE9ETyBzY2FsaW5nXHJcbiAgdGhpcy50cmFuc2Zvcm1bMF0gPSByaWdodFswXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxXSA9IHJpZ2h0WzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzJdID0gcmlnaHRbMl07XHJcbiAgXHJcbiAgdGhpcy50cmFuc2Zvcm1bNF0gPSB1cG5bMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bNV0gPSB1cG5bMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bNl0gPSB1cG5bMl07XHJcbiAgXHJcbiAgdGhpcy50cmFuc2Zvcm1bOF0gPSBmb3J3YXJkWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzldID0gZm9yd2FyZFsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxMF0gPSBmb3J3YXJkWzJdO1xyXG59XHJcbiIsIlxyXG5wa3pvLkNhbWVyYSA9IGZ1bmN0aW9uIChvcHQpIHtcclxuICBwa3pvLkVudGl0eS5jYWxsKHRoaXMpO1xyXG5cdFxyXG5cdHZhciBvID0gb3B0ID8gb3B0IDoge307XHJcblx0XHJcblx0dGhpcy55Zm92ICAgPSBvLnlmb3YgPyBvLnlmb3YgOiA0NS4wO1xyXG5cdHRoaXMuem5lYXIgID0gby56bmVhciA/IG8uem5lYXIgOiAwLjE7XHJcblx0dGhpcy56ZmFyICAgPSBvLnpmYXIgPyBvLnpmYXIgOiAxMDAuMDtcclxuXHR0aGlzLmFzcGVjdCA9IDEuMDtcclxufVxyXG5cclxucGt6by5DYW1lcmEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwa3pvLkVudGl0eS5wcm90b3R5cGUpO1xyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBwa3pvLkNhbWVyYTtcclxuXHJcbnBrem8uQ2FtZXJhLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XHJcblx0Ly8gc29tZXRoaW5nLCBzb21ldGhpbmcsIHJlbmRlcmVyLnNldENhbWVyYVxyXG59XHJcblxyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIFRPRE8gdGFrZSBpbnRvIGFjY291bnQgdGhlIHBhcmVuJ3QgcG9zaXRpb25cclxuXHRcclxuXHR0aGlzLnByb2plY3Rpb25NYXRyaXggPSBwa3pvLnBlcnNwZWN0aXZlKHRoaXMueWZvdiwgdGhpcy5hc3BlY3QsIHRoaXMuem5lYXIsIHRoaXMuemZhcik7XHJcblx0XHJcblx0Ly92YXIgZm9yd2FyZCA9IHRoaXMuZ2V0WFZlY3RvcigpO1xyXG5cdC8vdmFyIHJpZ2h0ICAgPSB0aGlzLmdldFlWZWN0b3IoKTtcclxuXHQvL3ZhciB1cCAgICAgID0gdGhpcy5nZXRaVmVjdG9yKCk7XHJcblx0dGhpcy52aWV3TWF0cml4ICAgPSBwa3pvLm1hdDQoMSk7XHJcblx0dGhpcy5ub3JtYWxNYXRyaXggPSBwa3pvLm1hdDMoMSk7XHJcblx0XHJcbn1cclxuIiwiXHJcbnBrem8uT2JqZWN0ID0gZnVuY3Rpb24gKG1lc2gsIG1hdGVyaWFsKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuICBcclxuICB0aGlzLm1lc2ggICAgID0gbWVzaDtcclxuICB0aGlzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcbn1cclxuXHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5PYmplY3Q7XHJcblxyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChyZW5kZXJlcikge1xyXG5cdC8vIHRvZG8gcmVzcGVjdCBwYXJlbnQgdHJhbnNmb3JtXHJcblx0cmVuZGVyZXIuYWRkTWVzaCh0aGlzLnRyYW5zZm9ybSwgdGhpcy5tYXRlcmlhbCwgdGhpcy5tZXNoKTtcclxufVxyXG5cclxucGt6by5PYmplY3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoZ2wsIHNoYWRlciwgcGFyZW50TW9kZWxWaWV3TWF0cml4KSB7IFxyXG4gIFxyXG4gIHZhciBtb2RlbFZpZXdNYXRyaXggPSBwa3pvLm11bHRNYXRyaXgocGFyZW50TW9kZWxWaWV3TWF0cml4LCB0aGlzLnRyYW5zZm9ybSk7XHJcbiAgc2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VNb2RlbFZpZXdNYXRyaXgnLCBtb2RlbFZpZXdNYXRyaXgpO1xyXG5cdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxNYXRyaXgnLCB0aGlzLnRyYW5zZm9ybSk7XHJcbiAgXHJcbiAgdGhpcy5tYXRlcmlhbC5zZXR1cChnbCwgc2hhZGVyKTtcclxuICB0aGlzLm1lc2guZHJhdyhnbCwgc2hhZGVyKTtcclxufVxyXG5cclxuIiwiXHJcbnBrem8uUmVuZGVyZXIgPSBmdW5jdGlvbiAoY2FudmFzKSB7XHJcbiAgdGhpcy5jYW52YXMgPSBuZXcgcGt6by5DYW52YXMoY2FudmFzKTtcclxuICBcclxuICB2YXIgcmVuZGVyZXIgPSB0aGlzO1xyXG4gIFxyXG4gIHRoaXMuY2FudmFzLmluaXQoZnVuY3Rpb24gKGdsKSB7XHJcbiAgICByZW5kZXJlci5zb2xpZFNoYWRlciA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5Tb2xpZFZlcnQsIHBrem8uU29saWRGcmFnKTtcclxuICB9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUuYWRkTWVzaCA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0sIG1hdGVyaWFsLCBtZXNoKSB7XHJcblx0dGhpcy5zb2xpZHMucHVzaCh7XHJcblx0XHR0cmFuc2Zvcm06IHRyYW5zZm9ybSxcclxuXHRcdG1hdGVyaWFsOiBtYXRlcmlhbCwgXHJcblx0XHRtZXNoOiBtZXNoXHJcblx0fSk7XHJcbn1cclxuXHJcbnBrem8uUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChzY2VuZSwgY2FtZXJhKSB7XHJcblx0dmFyIHJlbmRlcmVyID0gdGhpcztcclxuXHRcclxuXHR0aGlzLnNvbGlkcyA9IFtdO1xyXG5cdHNjZW5lLmVucXVldWUodGhpcyk7XHJcblx0XHJcbiAgdGhpcy5jYW52YXMuZHJhdyhmdW5jdGlvbiAoZ2wpIHtcclxuICAgIFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG5cdFx0XHJcblx0XHR2YXIgc2hhZGVyID0gcmVuZGVyZXIuc29saWRTaGFkZXI7XHRcdFxyXG5cdFx0c2hhZGVyLmJpbmQoKTtcclxuXHRcdFxyXG5cdFx0Y2FtZXJhLmFzcGVjdCA9IGdsLndpZHRoIC8gZ2wuaGVpZ2h0O1xyXG5cdFx0Y2FtZXJhLnVwZGF0ZSgpO1xyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm1NYXRyaXg0ZnYoJ3VQcm9qZWN0aW9uTWF0cml4JywgY2FtZXJhLnByb2plY3Rpb25NYXRyaXgpO1x0XHRcclxuXHRcdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1Vmlld01hdHJpeCcsICAgICAgIGNhbWVyYS52aWV3TWF0cml4KTtcdFx0XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDNmdigndU5vcm1hbE1hdHJpeCcsICAgICBjYW1lcmEubm9ybWFsTWF0cml4KTtcdFx0XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0cmVuZGVyZXIuc29saWRzLmZvckVhY2goZnVuY3Rpb24gKHNvbGlkKSB7XHJcblx0XHRcdHNoYWRlci5zZXRVbmlmb3JtTWF0cml4NGZ2KCd1TW9kZWxNYXRyaXgnLCBzb2xpZC50cmFuc2Zvcm0pO1x0XHRcclxuXHRcdFx0c29saWQubWF0ZXJpYWwuc2V0dXAoZ2wsIHNoYWRlcik7XHRcdFx0XHJcblx0XHRcdHNvbGlkLm1lc2guZHJhdyhnbCwgc2hhZGVyKTtcclxuXHRcdH0pO1xyXG4gIH0pO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==