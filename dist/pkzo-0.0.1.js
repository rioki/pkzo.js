
var pkzo = {version: '0.0.1'};

pkzo.SolidFrag = "precision mediump float;\n\n\n\n//uniform sampler2D uTexture;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec2 vTexCoord;\n\n\n\nvoid main()\n\n{\n\n    //gl_FragColor = texture2D(uTexture, vTexCoord);\n\n    gl_FragColor = vec4(1, 1, 1, 1);\n\n}";
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




pkzo.Texture = function (gl, url) {
  this.gl     = gl;
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
    if (texture.id) {
      texture.sync();
    }
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

pkzo.Texture.prototype.bind = function () {
  if (! this.id) {
    this.upload();
  }
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


pkzo.Material = function () {}


pkzo.Material.prototype.setup = function (gl, shader) {
	
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBrem8uanMiLCJzaGFkZXJzLmpzIiwidmVjdG9yLmpzIiwibWF0cml4LmpzIiwiQ2FudmFzLmpzIiwiVGV4dHVyZS5qcyIsIlNoYWRlci5qcyIsIlNjZW5lLmpzIiwiQnVmZmVyLmpzIiwiTWVzaC5qcyIsIk1hdGVyaWFsLmpzIiwiRW50aXR5LmpzIiwiQ2FtZXJhLmpzIiwiT2JqZWN0LmpzIiwiUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicGt6by0wLjAuMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgcGt6byA9IHt2ZXJzaW9uOiAnMC4wLjEnfTtcclxuIiwicGt6by5Tb2xpZEZyYWcgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcblxcblxcbi8vdW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmU7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXhDb29yZDtcXG5cXG5cXG5cXG52b2lkIG1haW4oKVxcblxcbntcXG5cXG4gICAgLy9nbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmUsIHZUZXhDb29yZCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMSwgMSwgMSwgMSk7XFxuXFxufVwiO1xucGt6by5Tb2xpZFZlcnQgPSBcIlxcblxcbnVuaWZvcm0gbWF0NCB1UHJvamVjdGlvbk1hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDQgdU1vZGVsVmlld01hdHJpeDtcXG5cXG51bmlmb3JtIG1hdDMgdU5vcm1hbE1hdHJpeDtcXG5cXG5cXG5cXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4O1xcblxcbmF0dHJpYnV0ZSB2ZWMzIGFOb3JtYWw7XFxuXFxuYXR0cmlidXRlIHZlYzIgYVRleENvb3JkO1xcblxcblxcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4Q29vcmQ7XFxuXFxuXFxuXFxudm9pZCBtYWluKCkge1xcblxcbiAgdk5vcm1hbCAgICAgPSB1Tm9ybWFsTWF0cml4ICogYU5vcm1hbDtcXG5cXG4gIHZUZXhDb29yZCAgID0gYVRleENvb3JkO1xcblxcbiAgZ2xfUG9zaXRpb24gPSB1UHJvamVjdGlvbk1hdHJpeCAqIHVNb2RlbFZpZXdNYXRyaXggKiB2ZWM0KGFWZXJ0ZXgsIDEpO1xcblxcbn1cIjtcbiIsIlxyXG5wa3pvLnZlYzIgPSBmdW5jdGlvbiAodjAsIHYxKSB7XHJcbiAgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgIHR5cGVvZiB2MSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjBdKTtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjEgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYxXSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMik7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLnZlYzMgPSBmdW5jdGlvbiAodjAsIHYxLCB2Mikge1xyXG4gIGlmICh0eXBlb2YgdjAgPT09ICdudW1iZXInICYmIFxyXG4gICAgICB0eXBlb2YgdjEgPT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHR5cGVvZiB2MiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2MCwgdjAsIHYwXSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgICAgICAgdHlwZW9mIHYxID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjIgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYxLCB2Ml0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gIH1cclxufVxyXG5cclxucGt6by52ZWM0ID0gZnVuY3Rpb24gKHYwLCB2MSwgdjIsIHY0KSB7XHJcbiAgaWYgKHR5cGVvZiB2MCA9PT0gJ251bWJlcicgJiYgXHJcbiAgICAgIHR5cGVvZiB2MSA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgdHlwZW9mIHYyID09PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICB0eXBlb2YgdjMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYwLCB2MCwgdjBdKTtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIHYwID09PSAnbnVtYmVyJyAmJiBcclxuICAgICAgICAgICB0eXBlb2YgdjEgPT09ICdudW1iZXInICYmIFxyXG4gICAgICAgICAgIHR5cGVvZiB2MiA9PT0gJ251bWJlcicgJiZcclxuICAgICAgICAgICB0eXBlb2YgdjMgPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbdjAsIHYxLCB2MiwgdjRdKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSg0KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGFkZCBhbmQgc3ViIGFsc28gd29yayBmb3IgbWF0cml4XHJcbnBrem8uYWRkID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gKyBiW2ldO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucGt6by5zdWIgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSAtIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHYgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgdiArPSBhW2ldICogYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbnBrem8uY3Jvc3MgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIC8vIGFzc3VtZSBhLmxlbmd0aCA9PSBiLmxlbmd0aCA9PSAzXHJcbiAgXHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gIFxyXG4gIHJbMF0gPSAoYVsxXSAqIGJbMl0pIC0gKGFbMl0gKiBiWzFdKTtcclxuICByWzFdID0gKGFbMl0gKiBiWzBdKSAtIChhWzBdICogYlsyXSk7XHJcbiAgclsyXSA9IChhWzBdICogYlsxXSkgLSAoYVsxXSAqIGJbMF0pO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLm11bHRWZWN0b3JTY2FsYXIgPSBmdW5jdGlvbiAodiwgcykge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSh2Lmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gdltpXSAqIHM7XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLmxlbmd0aCA9IGZ1bmN0aW9uICh2KSB7ICBcclxuICByZXR1cm4gTWF0aC5zcXJ0KHBrem8uZG90KHYsIHYpKTtcclxufVxyXG5cclxucGt6by5ub3JtYWxpemUgPSBmdW5jdGlvbiAodikge1xyXG4gIHJldHVybiBwa3pvLm11bHRWZWN0b3JTY2FsYXIodiwgMSAvIHBrem8ubGVuZ3RoKHYpKTtcclxufVxyXG5cclxuIiwiXHJcbnBrem8ubWF0MiA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnYXJyYXknKSB7XHJcbiAgICBpZiAodi5sZW5ndGggIT0gNCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDIgbXVzdCBiZSA0IHZhbHVlcycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt2LCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIHZdKTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDFdKTtcclxufVxyXG5cclxucGt6by5tYXQzID0gZnVuY3Rpb24gKHYpIHtcclxuICBpZiAodHlwZW9mIHYgPT09ICdhcnJheScpIHtcclxuICAgIGlmICh2Lmxlbmd0aCAhPSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWF0MyBtdXN0IGJlIDkgdmFsdWVzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgdiwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCB2XSk7XHJcbiAgfVxyXG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAxXSk7XHJcbn1cclxuXHJcbnBrem8ubWF0NCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnYXJyYXknKSB7XHJcbiAgICBpZiAodi5sZW5ndGggIT0gMTYpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXQ0IG11c3QgYmUgMTYgdmFsdWVzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3YsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgdiwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCB2LCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIHZdKTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIDFdKTtcclxufVxyXG5cclxucGt6by5tdWx0TWF0cml4ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAvLyBhc3N1bWUgYS5sZW5ndGggPT0gYi5sZW5ndGhcclxuICB2YXIgbiA9IE1hdGguc3FydChhLmxlbmd0aCk7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgdmFyIHYgPSAwO1xyXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IG47IGsrKykge1xyXG4gICAgICAgIHYgPSB2ICsgYVtpKm4ra10gKiBiW2sqbitqXTtcclxuICAgICAgfVxyXG4gICAgICByW2kqbitqXSA9IHY7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnJhZGlhbnMgPSBmdW5jdGlvbihkZWdyZWVzKSB7XHJcbiAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xyXG59O1xyXG5cclxucGt6by5kZWdyZWVzID0gZnVuY3Rpb24ocmFkaWFucykge1xyXG4gIHJldHVybiByYWRpYW5zICogMTgwIC8gTWF0aC5QSTtcclxufTsgXHJcblxyXG5cclxucGt6by5vcnRobyA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikge1xyXG4gIHZhciBybCA9IChyaWdodCAtIGxlZnQpO1xyXG4gIHZhciB0YiA9ICh0b3AgLSBib3R0b20pO1xyXG4gIHZhciBmbiA9IChmYXIgLSBuZWFyKTtcclxuICBcclxuICB2YXIgbSA9IHBrem8ubWF0NCgpOyAgXHJcbiAgXHJcbiAgbVswXSA9IDIgLyBybDtcclxuICBtWzFdID0gMDtcclxuICBtWzJdID0gMDtcclxuICBtWzNdID0gMDtcclxuICBtWzRdID0gMDtcclxuICBtWzVdID0gMiAvIHRiO1xyXG4gIG1bNl0gPSAwO1xyXG4gIG1bN10gPSAwO1xyXG4gIG1bOF0gPSAwO1xyXG4gIG1bOV0gPSAwO1xyXG4gIG1bMTBdID0gLTIgLyBmbjtcclxuICBtWzExXSA9IDA7XHJcbiAgbVsxMl0gPSAtKGxlZnQgKyByaWdodCkgLyBybDtcclxuICBtWzEzXSA9IC0odG9wICsgYm90dG9tKSAvIHRiO1xyXG4gIG1bMTRdID0gLShmYXIgKyBuZWFyKSAvIGZuO1xyXG4gIG1bMTVdID0gMTtcclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnBrem8uZnJ1c3R1bSA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIHpuZWFyLCB6ZmFyKSB7XHJcbiAgdmFyIHQxID0gMiAqIHpuZWFyO1xyXG4gIHZhciB0MiA9IHJpZ2h0IC0gbGVmdDtcclxuICB2YXIgdDMgPSB0b3AgLSBib3R0b207XHJcbiAgdmFyIHQ0ID0gemZhciAtIHpuZWFyO1xyXG5cclxuICB2YXIgbSA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xyXG4gIFxyXG4gIG1bMF0gPSB0MS90MjsgbVs0XSA9ICAgICAwOyBtWyA4XSA9ICAocmlnaHQgKyBsZWZ0KSAvIHQyOyBtWzEyXSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIG1bMV0gPSAgICAgMDsgbVs1XSA9IHQxL3QzOyBtWyA5XSA9ICAodG9wICsgYm90dG9tKSAvIHQzOyBtWzEzXSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIG1bMl0gPSAgICAgMDsgbVs2XSA9ICAgICAwOyBtWzEwXSA9ICgtemZhciAtIHpuZWFyKSAvIHQ0OyBtWzE0XSA9ICgtdDEgKiB6ZmFyKSAvIHQ0O1xyXG4gIG1bM10gPSAgICAgMDsgbVs3XSA9ICAgICAwOyBtWzExXSA9ICAgICAgICAgICAgICAgICAgIC0xOyBtWzE1XSA9ICAgICAgICAgICAgICAgICAwO1xyXG4gIFxyXG4gIHJldHVybiBtO1xyXG59XHJcblxyXG5wa3pvLnBlcnNwZWN0aXZlID0gZnVuY3Rpb24gKGZvdnksIGFzcGVjdCwgem5lYXIsIHpmYXIpIHtcclxuICB2YXIgeW1heCA9IHpuZWFyICogTWF0aC50YW4ocGt6by5yYWRpYW5zKGZvdnkpKTtcclxuICB2YXIgeG1heCA9IHltYXggKiBhc3BlY3Q7XHJcbiAgcmV0dXJuIHBrem8uZnJ1c3R1bSgteG1heCwgeG1heCwgLXltYXgsIHltYXgsIHpuZWFyLCB6ZmFyKTtcclxufVxyXG5cclxuLy8gTk9URTogdGhpcyBpcyBpbmVmZmljaWVudCwgaXQgbWF5IGJlIHNlbnNpYmxlIHRvIHByb3ZpZGUgaW5wbGFjZSB2ZXJzaW9uc1xyXG5wa3pvLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKG0sIHgsIHksIHopIHsgICAgXHJcbiAgdmFyIHIgPSBwa3pvLm1hdDQobSk7XHJcbiAgclsxMl0gPSBtWzBdICogeCArIG1bNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl07XHJcbiAgclsxM10gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM107XHJcbiAgclsxNF0gPSBtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XHJcbiAgclsxNV0gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV07XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnBrem8ucm90YXRlID0gZnVuY3Rpb24gKG0sIGFuZ2xlLCB4LCB5LCB6KSB7ICBcclxuICB2YXIgYSA9IHBrem8ucmFkaWFucyhhbmdsZSk7XHJcbiAgdmFyIGMgPSBNYXRoLmNvcyhhKTtcclxuICB2YXIgcyA9IE1hdGguc2luKGEpO1xyXG4gIFxyXG4gIHZhciBsID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgdmFyIG54ID0geCAvIGw7XHJcbiAgdmFyIG55ID0geSAvIGw7XHJcbiAgdmFyIG56ID0geiAvIGw7XHJcblxyXG4gIHZhciB0MCA9IG54ICogKDEgLSBjKTtcclxuICB2YXIgdDEgPSBueSAqICgxIC0gYyk7XHJcbiAgdmFyIHQyID0gbnogKiAoMSAtIGMpOyAgXHJcblxyXG4gIHZhciBkID0gcGt6by5tYXQ0KDEpO1xyXG4gIFxyXG4gIGRbIDBdID0gYyArIHQwICogbng7XHJcbiAgZFsgMV0gPSAwICsgdDAgKiBueSArIHMgKiBuejtcclxuICBkWyAyXSA9IDAgKyB0MCAqIG56IC0gcyAqIG55O1xyXG5cclxuICBkWyA0XSA9IDAgKyB0MSAqIG54IC0gcyAqIG56O1xyXG4gIGRbIDVdID0gYyArIHQxICogbnk7XHJcbiAgZFsgNl0gPSAwICsgdDEgKiBueiArIHMgKiBueDtcclxuXHJcbiAgZFsgOF0gPSAwICsgdDIgKiBueCArIHMgKiBueTtcclxuICBkWyA5XSA9IDAgKyB0MiAqIG55IC0gcyAqIG54O1xyXG4gIGRbMTBdID0gYyArIHQyICogbno7ICBcclxuICBcclxuICB2YXIgciA9IHBrem8ubXVsdE1hdHJpeChtLCBkKTtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5wa3pvLnNjYWxlID0gZnVuY3Rpb24obSwgeCwgeSwgeikgeyAgICBcclxuICB2YXIgciA9IHBrem8ubWF0NCgxKTtcclxuICBcclxuICByWyAwXSA9IG1bIDBdICogeDsgXHJcbiAgclsgMV0gPSBtWyAxXSAqIHg7IFxyXG4gIHJbIDJdID0gbVsgMl0gKiB4OyBcclxuICByWyAzXSA9IG1bIDNdICogeDsgXHJcbiAgXHJcbiAgclsgNF0gPSBtWyA0XSAqIHk7IFxyXG4gIHJbIDVdID0gbVsgNV0gKiB5OyBcclxuICByWyA2XSA9IG1bIDZdICogeTsgXHJcbiAgclsgN10gPSBtWyA3XSAqIHk7IFxyXG4gIFxyXG4gIHJbIDhdID0gbVsgOF0gKiB6O1xyXG4gIHJbIDldID0gbVsgOV0gKiB6O1xyXG4gIHJbMTBdID0gbVsxMF0gKiB6O1xyXG4gIHJbMTFdID0gbVsxMV0gKiB6O1xyXG4gIFxyXG4gIHJbMTJdID0gbVsxMl07XHJcbiAgclsxM10gPSBtWzEzXTtcclxuICByWzE0XSA9IG1bMTRdO1xyXG4gIHJbMTVdID0gbVsxNV07XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn0iLCJcclxucGt6by5DYW52YXMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5jYW52YXMgPSBlbGVtZW50O1xyXG4gIH0gIFxyXG4gIFxyXG4gIHRoaXMuY2FudmFzLndpZHRoICA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoO1xyXG4gIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDsgIFxyXG4gIFxyXG4gIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIiwge2FudGlhbGlhczogdHJ1ZSwgZGVwdGg6IHRydWV9KTtcclxuICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcclxuICBcclxuICAvLyB0aGVzZSB2YWx1ZXMgYXJlIGZvciB0aGUgcHJvZ3JhbW1lciBvZiB0aGUgZHJhdyBmdW5jdGlvbiwgXHJcbiAgLy8gd2UgcGFzcyB0aGUgZ2wgb2JqZWN0LCBub3QgdGhlIGNhbnZhcy5cclxuICB0aGlzLmdsLndpZHRoICA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gIHRoaXMuZ2wuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG59XHJcblxyXG5wa3pvLkNhbnZhcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChjYikge1xyXG4gIGlmIChjYikge1xyXG4gICAgY2IuY2FsbCh0aGlzLCB0aGlzLmdsKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQ2FudmFzLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGNiKSB7ICBcclxuICBpZiAodGhpcy5jYW52YXMud2lkdGggIT0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGggfHwgdGhpcy5jYW52YXMuaGVpZ2h0ICE9IHRoaXMuY2FudmFzLmNsaWVudEhlaWdodCkge1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggID0gdGhpcy5jYW52YXMuY2xpZW50V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQ7ICBcclxuICAgIHRoaXMuZ2wud2lkdGggID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICB0aGlzLmdsLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuICB9XHJcbiAgXHJcbiAgdGhpcy5nbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IHRoaXMuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbiAgXHJcbiAgaWYgKGNiKSB7XHJcbiAgICBjYi5jYWxsKHRoaXMsIHRoaXMuZ2wpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLlRleHR1cmUgPSBmdW5jdGlvbiAoZ2wsIHVybCkge1xyXG4gIHRoaXMuZ2wgICAgID0gZ2w7XHJcbiAgdGhpcy51cmwgICAgPSB1cmw7XHJcbiAgdGhpcy5pbWFnZSAgPSBudWxsO1xyXG4gIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgXHJcbiAgLy8gd2UgZG9uJ3QgdXBsb2FkIHRoZSBpbWFnZSB0byBWUkFNLCBidXQgdHJ5IHRvIGxvYWQgaXRcclxuICB0aGlzLmxvYWQoKTtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICB2YXIgdGV4dHVyZSA9IHRoaXM7XHJcbiAgdGhpcy5pbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0ZXh0dXJlLmxvYWRlZCA9IHRydWU7XHJcbiAgICBpZiAodGV4dHVyZS5pZCkge1xyXG4gICAgICB0ZXh0dXJlLnN5bmMoKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHRoaXMuaW1hZ2Uuc3JjID0gdGhpcy51cmw7XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUudXBsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuaWQgPSB0aGlzLmdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5pZCk7XHJcbiAgXHJcbiAgaWYgKHRoaXMubG9hZGVkKSB7XHJcbiAgICB0aGlzLnN5bmMoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFXzJELCAwLCB0aGlzLmdsLlJHQkEsIDEsIDEsIDAsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uVGV4dHVyZS5wcm90b3R5cGUuc3luYyA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5pZCk7ICBcclxuICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFXzJELCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCB0aGlzLmltYWdlKTsgIFxyXG4gIHRoaXMuZ2wuZ2VuZXJhdGVNaXBtYXAodGhpcy5nbC5URVhUVVJFXzJEKTtcclxuICBcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy5nbC5MSU5FQVIpO1xyXG4gIHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLmdsLkxJTkVBUl9NSVBNQVBfTElORUFSKTtcclxuICB0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLmdsLlJFUEVBVCk7XHJcbiAgdGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX1dSQVBfVCwgdGhpcy5nbC5SRVBFQVQpO1xyXG4gIFxyXG4gIC8vIGNhbiB3ZSBkaXNjYXJkIGltYWdlIG5vdz9cclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLmlkKTtcclxuICB0aGlzLmlkID0gbnVsbDtcclxufVxyXG5cclxucGt6by5UZXh0dXJlLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghIHRoaXMuaWQpIHtcclxuICAgIHRoaXMudXBsb2FkKCk7XHJcbiAgfVxyXG4gIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmlkKTtcclxufVxyXG4iLCJcclxucGt6by5TaGFkZXIgPSBmdW5jdGlvbiAoZ2wsIHZlcnRleENvZGUsIGZyYWdtZW50Q29kZSkge1xyXG4gIHRoaXMuZ2wgICAgICAgICAgID0gZ2w7XHJcbiAgdGhpcy52ZXJ0ZXhDb2RlICAgPSB2ZXJ0ZXhDb2RlO1xyXG4gIHRoaXMuZnJhZ21lbnRDb2RlID0gZnJhZ21lbnRDb2RlO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuY29tcGlsZSA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgdmVydGV4U2hhZGVyICAgPSB0aGlzLmNvbXBpbGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSLCAgIHRoaXMudmVydGV4Q29kZSk7XHJcbiAgdmFyIGZyYWdtZW50U2hhZGVyID0gdGhpcy5jb21waWxlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSLCB0aGlzLmZyYWdtZW50Q29kZSk7XHJcbiAgXHJcbiAgdmFyIHByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICBcclxuICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xyXG4gIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcclxuICBcclxuICB0aGlzLmdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xyXG4gIFxyXG4gIHZhciBpbmZvTG9nID0gdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcclxuICBpZiAodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIHRoaXMuZ2wuTElOS19TVEFUVVMpID09PSBmYWxzZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGluZm9Mb2cpO1xyXG4gIH1cclxuICBlbHNlIGlmIChpbmZvTG9nICE9PSAnJykge1xyXG4gICAgY29uc29sZS5sb2coaW5mb0xvZyk7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKHZlcnRleFNoYWRlcik7XHJcbiAgdGhpcy5nbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xyXG4gIFxyXG4gIHRoaXMuaWQgPSBwcm9ncmFtO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuY29tcGlsZVNoYWRlciA9IGZ1bmN0aW9uICh0eXBlLCBjb2RlKSB7XHJcbiAgdmFyIGlkID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodHlwZSk7ICBcclxuICBcclxuICB0aGlzLmdsLnNoYWRlclNvdXJjZShpZCwgY29kZSk7XHJcbiAgdGhpcy5nbC5jb21waWxlU2hhZGVyKGlkKTtcclxuICBcclxuICB2YXIgaW5mb0xvZyA9IHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhpZCk7XHJcbiAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGlkLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSA9PT0gZmFsc2UpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihpbmZvTG9nKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoaW5mb0xvZyAhPT0gJycpIHtcclxuICAgIGNvbnNvbGUubG9nKGluZm9Mb2cpO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gaWQ7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuZ2wuZGVsZXRlUHJvZ3JhbShpZCk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy5pZCkge1xyXG4gICAgdGhpcy5jb21waWxlKCk7XHJcbiAgfVxyXG4gIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmlkKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldEFycnRpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lLCBidWZmZXIsIGVsZW1lbnRTaXplKSB7ICBcclxuICBidWZmZXIuYmluZCgpOyAgXHJcbiAgXHJcbiAgaWYgKGVsZW1lbnRTaXplID09PSB1bmRlZmluZWQpIHtcclxuICAgIHZhciBlbGVtZW50U2l6ZSA9IGJ1ZmZlci5lbGVtZW50U2l6ZTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHBvcyA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwb3MpO1xyXG4gIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3MsIGVsZW1lbnRTaXplLCBidWZmZXIuZWxlbWVudFR5cGUsIHRoaXMuZ2wuRkFMU0UsIDAsIDApOyAgXHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtMWkgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtMWkobG9jLCB2YWx1ZSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtMWYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtMWYobG9jLCB2YWx1ZSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtMmZ2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybTJmKGxvYywgdmFsdWVbMF0sIHZhbHVlWzFdKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm0zZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtM2YobG9jLCB2YWx1ZVswXSwgdmFsdWVbMV0sIHZhbHVlWzJdKTtcclxufVxyXG5cclxucGt6by5TaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm00ZnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICB2YXIgbG9jID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5pZCwgbmFtZSk7XHJcbiAgdGhpcy5nbC51bmlmb3JtNGYobG9jLCB2YWx1ZVswXSwgdmFsdWVbMV0sIHZhbHVlWzJdLCB2YWx1ZVs0XSk7XHJcbn1cclxuXHJcbnBrem8uU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtTWF0cml4M2Z2ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCB0cmFuc3Bvc2UpIHtcclxuICBpZiAodHJhbnNwb3NlID09PSB1bmRlZmluZWQgfHx0cmFuc3Bvc2UgPT09IG51bGwpIHtcclxuICAgIHZhciB0cmFuc3Bvc2UgPSBmYWxzZTtcclxuICB9XHJcbiAgdmFyIGxvYyA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuaWQsIG5hbWUpO1xyXG4gIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDNmdihsb2MsIHRyYW5zcG9zZSwgdmFsdWUpO1xyXG59XHJcblxyXG5wa3pvLlNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybU1hdHJpeDRmdiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgdHJhbnNwb3NlKSB7XHJcbiAgaWYgKHRyYW5zcG9zZSA9PT0gdW5kZWZpbmVkIHx8dHJhbnNwb3NlID09PSBudWxsKSB7XHJcbiAgICB2YXIgdHJhbnNwb3NlID0gZmFsc2U7XHJcbiAgfVxyXG4gIHZhciBsb2MgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLmlkLCBuYW1lKTtcclxuICB0aGlzLmdsLnVuaWZvcm1NYXRyaXg0ZnYobG9jLCB0cmFuc3Bvc2UsIHZhbHVlKTtcclxufVxyXG5cclxuXHJcbiIsIlxyXG5wa3pvLlNjZW5lID0gZnVuY3Rpb24gKCkge31cclxuXHJcbnBrem8uU2NlbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbnRpdHkpIHtcclxuICBpZiAoISB0aGlzLmVudGl0aWVzKSB7XHJcbiAgICB0aGlzLmVudGl0aWVzID0gW2VudGl0eV1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcclxuICB9XHJcbn0iLCJcclxucGt6by5CdWZmZXIgPSBmdW5jdGlvbiAoZ2wsIGRhdGEsIGJ0eXBlLCBldHlwZSkge1xyXG4gIHRoaXMuZ2wgPSBnbDtcclxuICBcclxuICBpZiAoYnR5cGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdGhpcy50eXBlID0gZ2wuQVJSQVlfQlVGRkVSO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudHlwZSA9IGJ0eXBlO1xyXG4gIH1cclxuICBcclxuICBpZiAoZXR5cGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHRoaXMudHlwZSA9PSBnbC5BUlJBWV9CVUZGRVIpIHtcclxuICAgICAgdGhpcy5lbGVtZW50VHlwZSA9IGdsLkZMT0FUO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudFR5cGUgPSBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmVsZW1lbnRUeXBlID0gZXR5cGU7XHJcbiAgfVxyXG4gIFxyXG4gIHRoaXMubG9hZChkYXRhKTtcclxufVxyXG5cclxucGt6by53cmFwQXJyYXkgPSBmdW5jdGlvbiAoZ2wsIHR5cGUsIGRhdGEpIHtcclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgZ2wuRkxPQVQ6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5ET1VCTEU6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQ2NEFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5VTlNJR05FRF9CWVRFOlxyXG4gICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLlVOU0lHTkVEX1NIT1JUOlxyXG4gICAgICByZXR1cm4gbmV3IFVpbnQxNkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5VTlNJR05FRF9JTlQ6XHJcbiAgICAgIHJldHVybiBuZXcgVWludDMyQXJyYXkoZGF0YSk7XHJcbiAgICBjYXNlIGdsLkJZVEU6XHJcbiAgICAgIHJldHVybiBuZXcgSW50OEFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5TSE9SVDpcclxuICAgICAgcmV0dXJuIG5ldyBJbnQxNkFycmF5KGRhdGEpO1xyXG4gICAgY2FzZSBnbC5JTlQ6XHJcbiAgICAgIHJldHVybiBuZXcgSW50MzJBcnJheShkYXRhKTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGRhdGEpIHsgIFxyXG4gIGlmIChkYXRhWzBdLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRTaXplID0gMTtcclxuICAgIHRoaXMuZGF0YSA9IHBrem8ud3JhcEFycmF5KHRoaXMuZ2wsIHRoaXMuZWxlbWVudFR5cGUsIGRhdGEpO1xyXG4gIH1cclxuICBlbHNlIHsgICAgXHJcbiAgICB0aGlzLmVsZW1lbnRTaXplID0gZGF0YVswXS5sZW5ndGg7XHJcbiAgICB0aGlzLmRhdGEgPSBwa3pvLndyYXBBcnJheSh0aGlzLmdsLCB0aGlzLmVsZW1lbnRUeXBlLCBkYXRhLmxlbmd0aCAqIHRoaXMuZWxlbVNpemUpO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGJ1ZmZlciA9IHRoaXM7XHJcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgZWxlbS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgYnVmZmVyLmRhdGFbaV0gPSB2O1xyXG4gICAgICAgIGkrKztcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbnBrem8uQnVmZmVyLnByb3RvdHlwZS51cGxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMudHlwZSwgdGhpcy5pZCk7XHJcbiAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMudHlwZSwgdGhpcy5kYXRhLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxufVxyXG5cclxucGt6by5CdWZmZXIucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHRoaXMuaWQpIHtcclxuICAgIHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMuaWQpO1xyXG4gICAgdGhpcy5pZCA9IG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKHByaW1pdGl2ZSkge1xyXG4gIGlmICghIHRoaXMuaWQpIHtcclxuICAgIHRoaXMudXBsb2FkKCk7XHJcbiAgfVxyXG4gIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLnR5cGUsIHRoaXMuaWQpO1xyXG59XHJcblxyXG5wa3pvLkJ1ZmZlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKHByaW1pdGl2ZSkge1xyXG4gIHRoaXMuYmluZCgpO1xyXG4gIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgdGhpcy5kYXRhLmxlbmd0aCwgdGhpcy5lbGVtZW50VHlwZSwgMCk7XHJcbn1cclxuXHJcblxyXG4iLCJcclxucGt6by5NZXNoID0gZnVuY3Rpb24gKCkge31cclxuXHJcbnBrem8uTWVzaC5ib3ggPSBmdW5jdGlvbiAocykge1xyXG5cdFxyXG5cdHZhciBtZXNoID0gbmV3IHBrem8uTWVzaCgpO1xyXG5cdFxyXG5cdG1lc2gudmVydGljZXMgPSBcclxuXHRcdFx0WyAgc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLCBzWzFdLCBzWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgICAgXHJcblx0XHRcdFx0IHNbMF0sIHNbMV0sIHNbMl0sICAgc1swXSwtc1sxXSwgc1syXSwgICBzWzBdLC1zWzFdLC1zWzJdLCAgIHNbMF0sIHNbMV0sLXNbMl0sICAgIFxyXG5cdFx0XHRcdCBzWzBdLCBzWzFdLCBzWzJdLCAgIHNbMF0sIHNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgIC1zWzBdLCBzWzFdLCBzWzJdLCAgICBcclxuXHRcdFx0XHQtc1swXSwgc1sxXSwgc1syXSwgIC1zWzBdLCBzWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sLXNbMl0sICAtc1swXSwtc1sxXSwgc1syXSwgICAgXHJcblx0XHRcdFx0LXNbMF0sLXNbMV0sLXNbMl0sICAgc1swXSwtc1sxXSwtc1syXSwgICBzWzBdLC1zWzFdLCBzWzJdLCAgLXNbMF0sLXNbMV0sIHNbMl0sICAgIFxyXG5cdFx0XHRcdCBzWzBdLC1zWzFdLC1zWzJdLCAgLXNbMF0sLXNbMV0sLXNbMl0sICAtc1swXSwgc1sxXSwtc1syXSwgICBzWzBdLCBzWzFdLC1zWzJdIF07ICBcclxuXHRcdFx0XHQgXHJcblx0bWVzaC5ub3JtYWxzID0gXHJcblx0XHRcdFsgIDAsIDAsIDEsICAgMCwgMCwgMSwgICAwLCAwLCAxLCAgIDAsIDAsIDEsICAgICBcclxuXHRcdFx0XHQgMSwgMCwgMCwgICAxLCAwLCAwLCAgIDEsIDAsIDAsICAgMSwgMCwgMCwgICAgIFxyXG5cdFx0XHRcdCAwLCAxLCAwLCAgIDAsIDEsIDAsICAgMCwgMSwgMCwgICAwLCAxLCAwLCAgICAgXHJcblx0XHRcdFx0LTEsIDAsIDAsICAtMSwgMCwgMCwgIC0xLCAwLCAwLCAgLTEsIDAsIDAsICAgICBcclxuXHRcdFx0XHQgMCwtMSwgMCwgICAwLC0xLCAwLCAgIDAsLTEsIDAsICAgMCwtMSwgMCwgICAgIFxyXG5cdFx0XHRcdCAwLCAwLC0xLCAgIDAsIDAsLTEsICAgMCwgMCwtMSwgICAwLCAwLC0xIF07ICAgXHJcblxyXG5cdG1lc2gudGV4Q29vcmRzID0gXHJcblx0XHRcdFsgIDEsIDEsICAgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgIFxyXG5cdFx0XHRcdCAwLCAxLCAgIDAsIDAsICAgMSwgMCwgICAxLCAxLCAgICBcclxuXHRcdFx0XHQgMSwgMCwgICAxLCAxLCAgIDAsIDEsICAgMCwgMCwgICAgXHJcblx0XHRcdFx0IDEsIDEsICAgMCwgMSwgICAwLCAwLCAgIDEsIDAsICAgIFxyXG5cdFx0XHRcdCAwLCAwLCAgIDEsIDAsICAgMSwgMSwgICAwLCAxLCAgICBcclxuXHRcdFx0XHQgMCwgMCwgICAxLCAwLCAgIDEsIDEsICAgMCwgMSBdOyAgXHJcblxyXG5cdG1lc2guaW5kaWNlcyA9IFxyXG5cdFx0XHRbICAwLCAxLCAyLCAgIDAsIDIsIDMsICAgXHJcblx0XHRcdFx0IDQsIDUsIDYsICAgNCwgNiwgNywgICBcclxuXHRcdFx0XHQgOCwgOSwxMCwgICA4LDEwLDExLCAgIFxyXG5cdFx0XHRcdDEyLDEzLDE0LCAgMTIsMTQsMTUsICAgXHJcblx0XHRcdFx0MTYsMTcsMTgsICAxNiwxOCwxOSwgICBcclxuXHRcdFx0XHQyMCwyMSwyMiwgIDIwLDIyLDIzIF07IFxyXG5cclxuXHRyZXR1cm4gbWVzaDtcclxufVxyXG5cclxucGt6by5NZXNoLmxvYWQgPSBmdW5jdGlvbiAoZmlsZSkge1xyXG5cdC8vIHNvbWV0aGluZyBzb21ldGhpbmcgeGhyXHJcblx0dmFyIG1lc2ggPSBuZXcgcGt6by5NZXNoKCk7XHJcblx0XHJcblx0cmV0dXJuIG1lc2g7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUudXBsb2FkID0gZnVuY3Rpb24gKGdsKSB7XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy52ZXJ0aWNlcywgIGdsLkFSUkFZX0JVRkZFUiwgZ2wuRkxPQVQpO1xyXG5cdHRoaXMubm9ybWFsQnVmZmVyICAgPSBuZXcgcGt6by5CdWZmZXIoZ2wsIHRoaXMubm9ybWFscywgICBnbC5BUlJBWV9CVUZGRVIsIGdsLkZMT0FUKTsgICAgICBcclxuXHR0aGlzLnRleENvb3JkQnVmZmVyID0gbmV3IHBrem8uQnVmZmVyKGdsLCB0aGlzLnRleENvb3JkcywgZ2wuQVJSQVlfQlVGRkVSLCBnbC5GTE9BVCk7ICAgICAgXHJcblx0dGhpcy5pbmRleEJ1ZmZlciAgICA9IG5ldyBwa3pvLkJ1ZmZlcihnbCwgdGhpcy5pbmRpY2VzLCAgIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBnbC5VTlNJR05FRF9TSE9SVCk7XHJcbn1cclxuXHJcbnBrem8uTWVzaC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGdsLCBzaGFkZXIpIHtcclxuXHRpZiAoIXRoaXMudmVydGV4QnVmZmVyKSB7XHJcblx0XHR0aGlzLnVwbG9hZChnbCk7XHJcblx0fVxyXG5cdFxyXG5cdHNoYWRlci5zZXRBcnJ0aWJ1dGUoXCJhVmVydGV4XCIsICAgdGhpcy52ZXJ0ZXhCdWZmZXIsICAgMyk7XHJcbiAgc2hhZGVyLnNldEFycnRpYnV0ZShcImFOb3JtYWxcIiwgICB0aGlzLm5vcm1hbEJ1ZmZlciwgICAzKTtcclxuICBzaGFkZXIuc2V0QXJydGlidXRlKFwiYVRleENvb3JkXCIsIHRoaXMudGV4Q29vcmRCdWZmZXIsIDIpO1xyXG4gICAgICBcclxuICB0aGlzLmluZGV4QnVmZmVyLmRyYXcoZ2wuVFJJQU5HTEVTKTtcclxufVxyXG5cclxucGt6by5NZXNoLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xyXG5cdHRoaXMudmVydGV4QnVmZmVyLnJlbGVhc2UoKTsgICBcclxuXHRkZWxldGUgdGhpcy52ZXJ0ZXhCdWZmZXI7XHJcblx0XHJcblx0dGhpcy5ub3JtYWxCdWZmZXIucmVsZWFzZSgpOyAgIFxyXG5cdGRlbGV0ZSB0aGlzLm5vcm1hbEJ1ZmZlcjtcdFxyXG5cdFxyXG5cdHRoaXMudGV4Q29vcmRCdWZmZXIucmVsZWFzZSgpOyBcclxuXHRkZWxldGUgdGhpcy50ZXhDb29yZEJ1ZmZlcjtcclxuXHRcclxuXHR0aGlzLmluZGV4QnVmZmVyLnJlbGVhc2UoKTtcclxuXHRkZWxldGUgdGhpcy5pbmRleEJ1ZmZlcjtcclxufVxyXG4iLCJcclxucGt6by5NYXRlcmlhbCA9IGZ1bmN0aW9uICgpIHt9XHJcblxyXG5cclxucGt6by5NYXRlcmlhbC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAoZ2wsIHNoYWRlcikge1xyXG5cdFxyXG59XHJcbiIsIlxyXG5wa3pvLkVudGl0eSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnRyYW5zZm9ybSA9IHBrem8ubWF0NCgxKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFhWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVswXSwgdGhpcy50cmFuc2Zvcm1bMV0sIHRoaXMudHJhbnNmb3JtWzJdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFlWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVs0XSwgdGhpcy50cmFuc2Zvcm1bNV0sIHRoaXMudHJhbnNmb3JtWzZdKTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmdldFpWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHBrem8udmVjMyh0aGlzLnRyYW5zZm9ybVs4XSwgdGhpcy50cmFuc2Zvcm1bOV0sIHRoaXMudHJhbnNmb3JtWzEwXSk7XHJcbn1cclxuXHJcbnBrem8uRW50aXR5LnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gcGt6by52ZWMzKHRoaXMudHJhbnNmb3JtWzEyXSwgdGhpcy50cmFuc2Zvcm1bMTNdLCB0aGlzLnRyYW5zZm9ybVsxNF0pO1xyXG59XHJcblxyXG5wa3pvLkVudGl0eS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICB0aGlzLnRyYW5zZm9ybVsxMl0gPSB2YWx1ZVswXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxM10gPSB2YWx1ZVsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsxNF0gPSB2YWx1ZVsyXTtcclxufVxyXG5cclxucGt6by5FbnRpdHkucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uICh0YXJnZXQsIHVwKSB7XHJcbiAgdmFyIHBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbigpO1xyXG4gIHZhciBmb3J3YXJkICA9IHBrem8ubm9ybWFsaXplKHBrem8uc3ViKHRhcmdldCwgcG9zaXRpb24pKTtcclxuICB2YXIgcmlnaHQgICAgPSBwa3pvLm5vcm1hbGl6ZShwa3pvLmNyb3NzKGZvcndhcmQsIHVwKSk7XHJcbiAgdmFyIHVwbiAgICAgID0gcGt6by5ub3JtYWxpemUocGt6by5jcm9zcyhyaWdodCwgZm9yd2FyZCkpO1xyXG4gIFxyXG4gIC8vIFRPRE8gc2NhbGluZ1xyXG4gIHRoaXMudHJhbnNmb3JtWzBdID0gcmlnaHRbMF07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMV0gPSByaWdodFsxXTtcclxuICB0aGlzLnRyYW5zZm9ybVsyXSA9IHJpZ2h0WzJdO1xyXG4gIFxyXG4gIHRoaXMudHJhbnNmb3JtWzRdID0gdXBuWzBdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzVdID0gdXBuWzFdO1xyXG4gIHRoaXMudHJhbnNmb3JtWzZdID0gdXBuWzJdO1xyXG4gIFxyXG4gIHRoaXMudHJhbnNmb3JtWzhdID0gZm9yd2FyZFswXTtcclxuICB0aGlzLnRyYW5zZm9ybVs5XSA9IGZvcndhcmRbMV07XHJcbiAgdGhpcy50cmFuc2Zvcm1bMTBdID0gZm9yd2FyZFsyXTtcclxufVxyXG4iLCJcclxucGt6by5DYW1lcmEgPSBmdW5jdGlvbiAob3B0KSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuXHRcclxuXHR2YXIgbyA9IG9wdCA/IG9wdCA6IHt9O1xyXG5cdFxyXG5cdHRoaXMueWZvdiAgID0gby55Zm92ID8gby55Zm92IDogNDUuMDtcclxuXHR0aGlzLnpuZWFyICA9IG8uem5lYXIgPyBvLnpuZWFyIDogMC4xO1xyXG5cdHRoaXMuemZhciAgID0gby56ZmFyID8gby56ZmFyIDogMTAwLjA7XHJcblx0dGhpcy5hc3BlY3QgPSAxLjA7XHJcbn1cclxuXHJcbnBrem8uQ2FtZXJhLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5DYW1lcmEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5DYW1lcmE7XHJcblxyXG5wa3pvLkNhbWVyYS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIFRPRE8gdGFrZSBpbnRvIGFjY291bnQgdGhlIHBhcmVuJ3QgcG9zaXRpb25cclxuXHRcclxuXHR0aGlzLnByb2plY3Rpb25NYXRyaXggPSBwa3pvLnBlcnNwZWN0aXZlKHRoaXMueWZvdiwgdGhpcy5hc3BlY3QsIHRoaXMuem5lYXIsIHRoaXMuemZhcik7XHJcblx0XHJcblx0Ly92YXIgZm9yd2FyZCA9IHRoaXMuZ2V0WFZlY3RvcigpO1xyXG5cdC8vdmFyIHJpZ2h0ICAgPSB0aGlzLmdldFlWZWN0b3IoKTtcclxuXHQvL3ZhciB1cCAgICAgID0gdGhpcy5nZXRaVmVjdG9yKCk7XHJcblx0dGhpcy52aWV3TWF0cml4ICAgPSBwa3pvLm1hdDQoMSk7XHJcblx0dGhpcy5ub3JtYWxNYXRyaXggPSBwa3pvLm1hdDMoMSk7XHJcblx0XHJcbn1cclxuIiwiXHJcbnBrem8uT2JqZWN0ID0gZnVuY3Rpb24gKG1lc2gsIG1hdGVyaWFsKSB7XHJcbiAgcGt6by5FbnRpdHkuY2FsbCh0aGlzKTtcclxuICBcclxuICB0aGlzLm1lc2ggICAgID0gbWVzaDtcclxuICB0aGlzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcbn1cclxuXHJcbnBrem8uT2JqZWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGt6by5FbnRpdHkucHJvdG90eXBlKTtcclxucGt6by5PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gcGt6by5PYmplY3Q7XHJcblxyXG5wa3pvLk9iamVjdC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChnbCwgc2hhZGVyLCBwYXJlbnRNb2RlbFZpZXdNYXRyaXgpIHsgXHJcbiAgXHJcbiAgdmFyIG1vZGVsVmlld01hdHJpeCA9IHBrem8ubXVsdE1hdHJpeChwYXJlbnRNb2RlbFZpZXdNYXRyaXgsIHRoaXMudHJhbnNmb3JtKTtcclxuICBzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndU1vZGVsVmlld01hdHJpeCcsIG1vZGVsVmlld01hdHJpeCk7XHJcbiAgXHJcbiAgdGhpcy5tYXRlcmlhbC5zZXR1cChnbCwgc2hhZGVyKTtcclxuICB0aGlzLm1lc2guZHJhdyhnbCwgc2hhZGVyKTtcclxufVxyXG5cclxuIiwiXHJcbnBrem8uUmVuZGVyZXIgPSBmdW5jdGlvbiAoY2FudmFzKSB7XHJcbiAgdGhpcy5jYW52YXMgPSBuZXcgcGt6by5DYW52YXMoY2FudmFzKTtcclxuICBcclxuICB2YXIgcmVuZGVyZXIgPSB0aGlzO1xyXG4gIFxyXG4gIHRoaXMuY2FudmFzLmluaXQoZnVuY3Rpb24gKGdsKSB7XHJcbiAgICByZW5kZXJlci5zb2xpZFNoYWRlciA9IG5ldyBwa3pvLlNoYWRlcihnbCwgcGt6by5Tb2xpZFZlcnQsIHBrem8uU29saWRGcmFnKTtcclxuICB9KTtcclxufVxyXG5cclxucGt6by5SZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHNjZW5lLCBjYW1lcmEpIHtcclxuXHR2YXIgcmVuZGVyZXIgPSB0aGlzO1xyXG5cdFxyXG4gIHRoaXMuY2FudmFzLmRyYXcoZnVuY3Rpb24gKGdsKSB7XHJcbiAgICBcclxuXHRcdHZhciBzaGFkZXIgPSByZW5kZXJlci5zb2xpZFNoYWRlcjtcdFx0XHJcblx0XHRzaGFkZXIuYmluZCgpO1xyXG5cdFx0XHJcblx0XHRjYW1lcmEuYXNwZWN0ID0gZ2wud2lkdGggLyBnbC5oZWlnaHQ7XHJcblx0XHRjYW1lcmEudXBkYXRlKCk7XHJcblx0XHRzaGFkZXIuc2V0VW5pZm9ybU1hdHJpeDRmdigndVByb2plY3Rpb25NYXRyaXgnLCBjYW1lcmEucHJvamVjdGlvbk1hdHJpeCk7XHRcdFxyXG5cdFx0c2hhZGVyLnNldFVuaWZvcm1NYXRyaXgzZnYoJ3VOb3JtYWxNYXRyaXgnLCBjYW1lcmEubm9ybWFsTWF0cml4KTtcdFx0XHJcblx0XHRcclxuXHRcdHZhciBtb2RlbFZpZXdNYXRyaXggPSBwa3pvLm1hdDQoY2FtZXJhLnZpZXdNYXRyaXgpO1x0XHRcclxuXHRcdFxyXG5cdFx0aWYgKHNjZW5lLmVudGl0aWVzKSB7XHJcblx0XHRcdHNjZW5lLmVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24gKGVudGl0eSkge1xyXG5cdFx0XHRcdGlmIChlbnRpdHkuZHJhdykge1xyXG5cdFx0XHRcdFx0ZW50aXR5LmRyYXcoZ2wsIHNoYWRlciwgbW9kZWxWaWV3TWF0cml4KTtcclxuXHRcdFx0XHR9XHRcdFx0XHRcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuICB9KTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=