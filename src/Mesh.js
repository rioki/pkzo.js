
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
