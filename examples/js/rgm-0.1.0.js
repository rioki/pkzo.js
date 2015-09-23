
var rgm = {version: "0.1.0"};


rgm.vec2 = function () {
  switch (arguments.length)
  {
    case 0:
      return new Float32Array(2);
    case 1:
      if (typeof arguments[0] === "number") {
        return new Float32Array([arguments[0], arguments[0]]);
      }
      else {
        switch (arguments[0].length) {
          case 2:
            return new Float32Array(arguments[0]);        
          case 3:
          case 4:
            return new Float32Array([arguments[0][0], arguments[0][1]]);        
          default:
            throw new Error('vec2: invalid array size');
        }
      }
    case 2:
      return new Float32Array([arguments[0], arguments[1]]);
    default:
      throw new Error('vec2: invalid number of arguments');
  }
}

rgm.vec3 = function () {
  switch (arguments.length)
  {
    case 0:
      return new Float32Array(3);
    case 1:
      if (typeof arguments[0] === "number") {
        return new Float32Array([arguments[0], arguments[0], arguments[0]]);
      }
      else {        
        switch (arguments[0].length) {
          case 2:
            return new Float32Array([arguments[0][0], arguments[0][1], 0.0]);        
          case 3:
            return new Float32Array(arguments[0]);        
          case 4:
            return new Float32Array([arguments[0][0], arguments[0][1], arguments[0][2]]);        
          default:
            throw new Error('vec3: invalid array size');
        }       
      }      
    case 3:
      return new Float32Array([arguments[0], arguments[1], arguments[2]]);
    default:
      throw new Error('vec3: invalid number of arguments');
  }
}

rgm.vec4 = function () {
  switch (arguments.length)
  {
    case 0:
      return new Float32Array(4);
    case 1:
      if (typeof arguments[0] === "number") {
        return new Float32Array([arguments[0], arguments[0], arguments[0], arguments[0]]);
      }
      else {        
        switch (arguments[0].length) {
          case 2:
            return new Float32Array([arguments[0][0], arguments[0][1], 0.0, 0.0]);        
          case 3:
            return new Float32Array([arguments[0][0], arguments[0][1], arguments[0][2], 0.0]);        
          case 4:
            return new Float32Array(arguments[0]);        
          default:
            throw new Error('vec3: invalid array size');
        }
      }
    case 4:
      return new Float32Array([arguments[0], arguments[1], arguments[2], arguments[3]]);
    default:
      throw new Error('vec4: invalid number of arguments');
  }
}

rgm.mat3 = function () {
  switch (arguments.length)
  {
    case 0:
      return new Float32Array([1.0, 0.0, 0.0,
                               0.0, 1.0, 0.0,
                               0.0, 0.0, 1.0]);
    case 1:
      if (typeof arguments[0] === "number") {
        return new Float32Array([arguments[0],          0.0,          0.0,
                                          0.0, arguments[0],          0.0,
                                          0.0,          0.0, arguments[0]]);
      }
      else {
        switch (arguments[0].length) {
          case 9:
            return new Float32Array(arguments[0]);        
          case 16:
            return new Float32Array([arguments[0][0], arguments[0][1], arguments[0][ 2],
                                     arguments[0][4], arguments[0][5], arguments[0][ 6],
                                     arguments[0][8], arguments[0][9], arguments[0][10]]);
          default:
            throw new Error('mat3: invalid array size');
        }        
      }
    case 9:
      return new Float32Array([arguments[0], arguments[1], arguments[2], 
                               arguments[3], arguments[4], arguments[5],
                               arguments[6], arguments[7], arguments[8]]);
    default:
      throw new Error('vec2: invalid number of arguments');
  }
}

rgm.mat4 = function () {
  switch (arguments.length)
  {
    case 0:
      return new Float32Array([1.0, 0.0, 0.0, 0.0,
                               0.0, 1.0, 0.0, 0.0,
                               0.0, 0.0, 1.0, 0.0,
                               0.0, 0.0, 0.0, 1.0]);
    case 1:
      if (typeof arguments[0] === "number") {
        return new Float32Array([arguments[0],          0.0,          0.0,          0.0,
                                          0.0, arguments[0],          0.0,          0.0,
                                          0.0,          0.0, arguments[0],          0.0,
                                          0.0,          0.0,          0.0, arguments[0]]);
      }
      else {
        switch (arguments[0].length) {
          case 9:
            return new Float32Array([arguments[0][0], arguments[0][1], arguments[0][2], 0.0,
                                     arguments[0][3], arguments[0][4], arguments[0][5], 0.0,
                                     arguments[0][6], arguments[0][7], arguments[0][8], 0.0,
                                                 0.0,             0.0,             0.0, 1.0]);
          case 16:
            return new Float32Array(arguments[0]);
          default:
            throw new Error('mat3: invalid array size');
        }        
      }
    case 16:
      return new Float32Array([arguments[ 0], arguments[ 1], arguments[ 2], arguments[ 3], 
                               arguments[ 4], arguments[ 5], arguments[ 6], arguments[ 7], 
                               arguments[ 8], arguments[ 9], arguments[10], arguments[11],
                               arguments[12], arguments[13], arguments[14], arguments[15]]);
    default:
      throw new Error('vec2: invalid number of arguments');
  }
}

rgm.quat = function () {
  switch (arguments.length)
  {
    case 0:
      return rgm.vec4(0, 0, 0, 1);
    case 1:
      return rgm.vec4(arguments[0]);     
    case 4:
      return rgm.vec4([arguments[0], arguments[1], arguments[2], arguments[3]]);
    default:
      throw new Error('vec2: invalid number of arguments');
  }
}


rgm.add = function (a, b) {
  if (a.length != b.length) {
    throw Error('add: a and b must be the same dimension');
  }
  
  var r = new Float32Array(a.length);
  for (var i = 0; i < a.length; i++) {
    r[i] = a[i] + b[i];
  }
  
  return r;
}

rgm.sub = function (a, b) {
  if (a.length != b.length) {
    throw Error('sub: a and b must be the same dimension');
  }
  
  var r = new Float32Array(a.length);
  for (var i = 0; i < a.length; i++) {
    r[i] = a[i] - b[i];
  }
  
  return r;
}

rgm.neg = function (a) {
  var r = new Float32Array(a.length);
  for (var i = 0; i < a.length; i++) {
    r[i] = -a[i];
  }
  
  return r;
}

rgm.dot = function (a, b) {
  var v = 0;
  for (var i = 0; i < a.length; i++) {
    v += a[i] * b[i];
  }
  return v;
}

rgm.cross = function (a, b) {
  if (a.length != 3 ||
      b.length != 3) {
    throw Error('cross: a and b must be 3D');
  }
  
  var r = new Float32Array(3);
  
  r[0] = (a[1] * b[2]) - (a[2] * b[1]);
  r[1] = (a[2] * b[0]) - (a[0] * b[2]);
  r[2] = (a[0] * b[1]) - (a[1] * b[0]);
  
  return r;
}

rgm.vmult = function (a, b) {
  if (a.length != b.length) {
    throw Error('vmult: a and b must be the same dimension');
  }
  
  var r = new Float32Array(a.length);
  for (var i = 0; i < a.length; i++) {
    r[i] = a[i] * b[i];
  }
  return r;
}

rgm.vsmult = function (v, s) {
  var r = new Float32Array(v.length);
  for (var i = 0; i < v.length; i++) {
    r[i] = v[i] * s;
  }
  return r;
}

rgm.length = function (v) {  
  return Math.sqrt(rgm.dot(v, v));
}

rgm.normalize = function (v) {
  return rgm.vsmult(v, 1.0 / rgm.length(v));
}

rgm.mmult = function (a, b) {
  if (a.length != b.length) {
    throw Error('mmult: a and b must be the same dimension');
  }
  
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

rgm.transpose = function(m) {    
  var n = Math.sqrt(m.length);
  var r = new Float32Array(m.length);
  
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      r[j*n+i] = m[i*n+j];
    }
  }
  
  return r;
}

rgm.mvmult = function (m, v) {
	var n = v.length;
	var r = new Float32Array(n);
	
	for (var i = 0; i < n; i++)
	{
		r[i] = 0;
		for (var j = 0; j < n; j++)
		{
				r[i] += m[j*n+i] * v[j];
		}
	}
	
	return r;
}

rgm.qmult = function (a, b) {
  var wa = a[3];
  var va = rgm.vec3(a[0], a[1], a[2]);
  var wb = b[3];
  var vb = rgm.vec3(b[0], b[1], b[2]);
  
  var w = wa * wb - rgm.dot(va, vb);
  var v = rgm.add(rgm.add(rgm.vsmult(vb, wa), rgm.vsmult(va, wb)), rgm.cross(va, vb));

  return rgm.quat(v[0], v[1], va[2], w);
}

rgm.quat2mat4 = function (q) {
  var xx = q[0] * q[0];
  var xy = q[0] * q[1];
  var xz = q[0] * q[2];
  var xw = q[0] * q[3];
  var yy = q[1] * q[1];
  var yz = q[1] * q[2];
  var yw = q[1] * q[3];
  var zz = q[2] * q[2];
  var zw = q[2] * q[3];
  
  var mat = rgm.mat4(1);
  mat[0]  = 1 - 2 * (yy + zz);
  mat[4]  =     2 * (xy - zw);
  mat[8]  =     2 * (xz + yw);
  mat[1]  =     2 * (xy + zw);
  mat[5]  = 1 - 2 * (xx + zz);
  mat[9]  =     2 * (yz - xw);
  mat[2]  =     2 * (xz - yw);
  mat[6]  =     2 * (yz + xw);
  mat[10] = 1 - 2 * (xx + yy);
  mat[3]  = mat[7] = mat[11] = mat[12] = mat[13] = mat[14] = 0;
  mat[15] = 1;
  
  return mat;
}



rgm.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

rgm.degrees = function(radians) {
  return radians * 180 / Math.PI;
}; 


rgm.ortho = function (left, right, bottom, top, near, far) {
  var rl = (right - left);
  var tb = (top - bottom);
  var fn = (far - near);
  
  var m = rgm.mat4();  
  
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

rgm.frustum = function (left, right, bottom, top, znear, zfar) {
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

rgm.perspective = function (fovy, aspect, znear, zfar) {
  var ymax = znear * Math.tan(rgm.radians(fovy));
  var xmax = ymax * aspect;
  return rgm.frustum(-xmax, xmax, -ymax, ymax, znear, zfar);
}

// NOTE: this is inefficient, it may be sensible to provide inplace versions
rgm.translate = function(m, x, y, z) {    
  var r = rgm.mat4(m);
  r[12] = m[0] * x + m[4] * y + m[ 8] * z + m[12];
  r[13] = m[1] * x + m[5] * y + m[ 9] * z + m[13];
  r[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
  r[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
  return r;
}

rgm.rotate = function (m, angle, x, y, z) {  
  var a = rgm.radians(angle);
  var c = Math.cos(a);
  var s = Math.sin(a);
  
  var l = Math.sqrt(x * x + y * y + z * z);
  var nx = x / l;
  var ny = y / l;
  var nz = z / l;

  var t0 = nx * (1 - c);
  var t1 = ny * (1 - c);
  var t2 = nz * (1 - c);  

  var d = rgm.mat4(1);
  
  d[ 0] = c + t0 * nx;
  d[ 1] = 0 + t0 * ny + s * nz;
  d[ 2] = 0 + t0 * nz - s * ny;

  d[ 4] = 0 + t1 * nx - s * nz;
  d[ 5] = c + t1 * ny;
  d[ 6] = 0 + t1 * nz + s * nx;

  d[ 8] = 0 + t2 * nx + s * ny;
  d[ 9] = 0 + t2 * ny - s * nx;
  d[10] = c + t2 * nz;  
  
  var r = rgm.mmult(m, d);
  
  r[12] = m[12];
  r[13] = m[13];
  r[14] = m[14];
  r[15] = m[15];
  
  return r;
}

rgm.scale = function(m, x, y, z) {    
  var r = rgm.mat4(1);
  
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

rgm.qrotate = function (angle, axis) {
  var an    = rgm.normalize(axis);
  var sin_a = Math.sin(rgm.radians(angle/2.0));
  var cos_a = Math.cos(rgm.radians(angle/2.0));
  var x = an[0] * sin_a;
  var y = an[1] * sin_a;
  var z = an[2] * sin_a;
  var w = cos_a;
  return rgm.quat(x, y, z, w);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0Xy5qcyIsImNvbnN0cnVjdG9ycy5qcyIsImZ1bmN0aW9ucy5qcyIsInRyYW5zZm9ybXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InJnbS0wLjEuMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgcmdtID0ge3ZlcnNpb246IFwiMC4xLjBcIn07XHJcbiIsIlxyXG5yZ20udmVjMiA9IGZ1bmN0aW9uICgpIHtcclxuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXHJcbiAge1xyXG4gICAgY2FzZSAwOlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgyKTtcclxuICAgIGNhc2UgMTpcclxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMF1dKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50c1swXS5sZW5ndGgpIHtcclxuICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoYXJndW1lbnRzWzBdKTsgICAgICAgIFxyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdWzBdLCBhcmd1bWVudHNbMF1bMV1dKTsgICAgICAgIFxyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMyOiBpbnZhbGlkIGFycmF5IHNpemUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIGNhc2UgMjpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdXSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZlYzI6IGludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xyXG4gIH1cclxufVxyXG5cclxucmdtLnZlYzMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxyXG4gIHtcclxuICAgIGNhc2UgMDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMF1dKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzWzBdLmxlbmd0aCkge1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdWzBdLCBhcmd1bWVudHNbMF1bMV0sIDAuMF0pOyAgICAgICAgXHJcbiAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGFyZ3VtZW50c1swXSk7ICAgICAgICBcclxuICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdLCBhcmd1bWVudHNbMF1bMl1dKTsgICAgICAgIFxyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMzOiBpbnZhbGlkIGFycmF5IHNpemUnKTtcclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgICB9ICAgICAgXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdXSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZlYzM6IGludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xyXG4gIH1cclxufVxyXG5cclxucmdtLnZlYzQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxyXG4gIHtcclxuICAgIGNhc2UgMDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1swXV0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHNbMF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF1bMF0sIGFyZ3VtZW50c1swXVsxXSwgMC4wLCAwLjBdKTsgICAgICAgIFxyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdWzBdLCBhcmd1bWVudHNbMF1bMV0sIGFyZ3VtZW50c1swXVsyXSwgMC4wXSk7ICAgICAgICBcclxuICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoYXJndW1lbnRzWzBdKTsgICAgICAgIFxyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMzOiBpbnZhbGlkIGFycmF5IHNpemUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIGNhc2UgNDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWM0OiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuXHJcbnJnbS5tYXQzID0gZnVuY3Rpb24gKCkge1xyXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcclxuICB7XHJcbiAgICBjYXNlIDA6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLjAsIDAuMCwgMC4wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wLCAxLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgMC4wLCAxLjBdKTtcclxuICAgIGNhc2UgMTpcclxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdLCAgICAgICAgICAwLjAsICAgICAgICAgIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wLCBhcmd1bWVudHNbMF0sICAgICAgICAgIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsIGFyZ3VtZW50c1swXV0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzWzBdLmxlbmd0aCkge1xyXG4gICAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShhcmd1bWVudHNbMF0pOyAgICAgICAgXHJcbiAgICAgICAgICBjYXNlIDE2OlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdWzBdLCBhcmd1bWVudHNbMF1bMV0sIGFyZ3VtZW50c1swXVsgMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1bNF0sIGFyZ3VtZW50c1swXVs1XSwgYXJndW1lbnRzWzBdWyA2XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1swXVs4XSwgYXJndW1lbnRzWzBdWzldLCBhcmd1bWVudHNbMF1bMTBdXSk7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDM6IGludmFsaWQgYXJyYXkgc2l6ZScpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICB9XHJcbiAgICBjYXNlIDk6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1szXSwgYXJndW1lbnRzWzRdLCBhcmd1bWVudHNbNV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbNl0sIGFyZ3VtZW50c1s3XSwgYXJndW1lbnRzWzhdXSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZlYzI6IGludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xyXG4gIH1cclxufVxyXG5cclxucmdtLm1hdDQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxyXG4gIHtcclxuICAgIGNhc2UgMDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEuMCwgMC4wLCAwLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgMS4wLCAwLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgMC4wLCAwLjAsIDEuMF0pO1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sICAgICAgICAgIDAuMCwgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgYXJndW1lbnRzWzBdLCAgICAgICAgICAwLjAsICAgICAgICAgIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsIGFyZ3VtZW50c1swXSwgICAgICAgICAgMC4wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsICAgICAgICAgIDAuMCwgICAgICAgICAgMC4wLCBhcmd1bWVudHNbMF1dKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50c1swXS5sZW5ndGgpIHtcclxuICAgICAgICAgIGNhc2UgOTpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdLCBhcmd1bWVudHNbMF1bMl0sIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1swXVszXSwgYXJndW1lbnRzWzBdWzRdLCBhcmd1bWVudHNbMF1bNV0sIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1swXVs2XSwgYXJndW1lbnRzWzBdWzddLCBhcmd1bWVudHNbMF1bOF0sIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgICAgICAgICAgICAgMC4wLCAgICAgICAgICAgICAwLjAsIDEuMF0pO1xyXG4gICAgICAgICAgY2FzZSAxNjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoYXJndW1lbnRzWzBdKTtcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWF0MzogaW52YWxpZCBhcnJheSBzaXplJyk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIGNhc2UgMTY6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbIDBdLCBhcmd1bWVudHNbIDFdLCBhcmd1bWVudHNbIDJdLCBhcmd1bWVudHNbIDNdLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1sgNF0sIGFyZ3VtZW50c1sgNV0sIGFyZ3VtZW50c1sgNl0sIGFyZ3VtZW50c1sgN10sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzWyA4XSwgYXJndW1lbnRzWyA5XSwgYXJndW1lbnRzWzEwXSwgYXJndW1lbnRzWzExXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1sxMl0sIGFyZ3VtZW50c1sxM10sIGFyZ3VtZW50c1sxNF0sIGFyZ3VtZW50c1sxNV1dKTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcigndmVjMjogaW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzJyk7XHJcbiAgfVxyXG59XHJcblxyXG5yZ20ucXVhdCA9IGZ1bmN0aW9uICgpIHtcclxuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXHJcbiAge1xyXG4gICAgY2FzZSAwOlxyXG4gICAgICByZXR1cm4gcmdtLnZlYzQoMCwgMCwgMCwgMSk7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIHJldHVybiByZ20udmVjNChhcmd1bWVudHNbMF0pOyAgICAgXHJcbiAgICBjYXNlIDQ6XHJcbiAgICAgIHJldHVybiByZ20udmVjNChbYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSwgYXJndW1lbnRzWzNdXSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZlYzI6IGludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xyXG4gIH1cclxufVxyXG4iLCJcclxucmdtLmFkZCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKSB7XHJcbiAgICB0aHJvdyBFcnJvcignYWRkOiBhIGFuZCBiIG11c3QgYmUgdGhlIHNhbWUgZGltZW5zaW9uJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSArIGJbaV07XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20uc3ViID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICBpZiAoYS5sZW5ndGggIT0gYi5sZW5ndGgpIHtcclxuICAgIHRocm93IEVycm9yKCdzdWI6IGEgYW5kIGIgbXVzdCBiZSB0aGUgc2FtZSBkaW1lbnNpb24nKTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIHJbaV0gPSBhW2ldIC0gYltpXTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS5uZWcgPSBmdW5jdGlvbiAoYSkge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gLWFbaV07XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20uZG90ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICB2YXIgdiA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2ICs9IGFbaV0gKiBiW2ldO1xyXG4gIH1cclxuICByZXR1cm4gdjtcclxufVxyXG5cclxucmdtLmNyb3NzID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICBpZiAoYS5sZW5ndGggIT0gMyB8fFxyXG4gICAgICBiLmxlbmd0aCAhPSAzKSB7XHJcbiAgICB0aHJvdyBFcnJvcignY3Jvc3M6IGEgYW5kIGIgbXVzdCBiZSAzRCcpO1xyXG4gIH1cclxuICBcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgXHJcbiAgclswXSA9IChhWzFdICogYlsyXSkgLSAoYVsyXSAqIGJbMV0pO1xyXG4gIHJbMV0gPSAoYVsyXSAqIGJbMF0pIC0gKGFbMF0gKiBiWzJdKTtcclxuICByWzJdID0gKGFbMF0gKiBiWzFdKSAtIChhWzFdICogYlswXSk7XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS52bXVsdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKSB7XHJcbiAgICB0aHJvdyBFcnJvcigndm11bHQ6IGEgYW5kIGIgbXVzdCBiZSB0aGUgc2FtZSBkaW1lbnNpb24nKTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgIHJbaV0gPSBhW2ldICogYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS52c211bHQgPSBmdW5jdGlvbiAodiwgcykge1xyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheSh2Lmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gdltpXSAqIHM7XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20ubGVuZ3RoID0gZnVuY3Rpb24gKHYpIHsgIFxyXG4gIHJldHVybiBNYXRoLnNxcnQocmdtLmRvdCh2LCB2KSk7XHJcbn1cclxuXHJcbnJnbS5ub3JtYWxpemUgPSBmdW5jdGlvbiAodikge1xyXG4gIHJldHVybiByZ20udnNtdWx0KHYsIDEuMCAvIHJnbS5sZW5ndGgodikpO1xyXG59XHJcblxyXG5yZ20ubW11bHQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkge1xyXG4gICAgdGhyb3cgRXJyb3IoJ21tdWx0OiBhIGFuZCBiIG11c3QgYmUgdGhlIHNhbWUgZGltZW5zaW9uJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBuID0gTWF0aC5zcXJ0KGEubGVuZ3RoKTtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKykge1xyXG4gICAgICB2YXIgdiA9IDA7XHJcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbjsgaysrKSB7XHJcbiAgICAgICAgdiA9IHYgKyBhW2kqbitrXSAqIGJbaypuK2pdO1xyXG4gICAgICB9XHJcbiAgICAgIHJbaSpuK2pdID0gdjtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS50cmFuc3Bvc2UgPSBmdW5jdGlvbihtKSB7ICAgIFxyXG4gIHZhciBuID0gTWF0aC5zcXJ0KG0ubGVuZ3RoKTtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkobS5sZW5ndGgpO1xyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKykge1xyXG4gICAgICByW2oqbitpXSA9IG1baSpuK2pdO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucmdtLm12bXVsdCA9IGZ1bmN0aW9uIChtLCB2KSB7XHJcblx0dmFyIG4gPSB2Lmxlbmd0aDtcclxuXHR2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkobik7XHJcblx0XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspXHJcblx0e1xyXG5cdFx0cltpXSA9IDA7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IG47IGorKylcclxuXHRcdHtcclxuXHRcdFx0XHRyW2ldICs9IG1baipuK2ldICogdltqXTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS5xbXVsdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHdhID0gYVszXTtcclxuICB2YXIgdmEgPSByZ20udmVjMyhhWzBdLCBhWzFdLCBhWzJdKTtcclxuICB2YXIgd2IgPSBiWzNdO1xyXG4gIHZhciB2YiA9IHJnbS52ZWMzKGJbMF0sIGJbMV0sIGJbMl0pO1xyXG4gIFxyXG4gIHZhciB3ID0gd2EgKiB3YiAtIHJnbS5kb3QodmEsIHZiKTtcclxuICB2YXIgdiA9IHJnbS5hZGQocmdtLmFkZChyZ20udnNtdWx0KHZiLCB3YSksIHJnbS52c211bHQodmEsIHdiKSksIHJnbS5jcm9zcyh2YSwgdmIpKTtcclxuXHJcbiAgcmV0dXJuIHJnbS5xdWF0KHZbMF0sIHZbMV0sIHZhWzJdLCB3KTtcclxufVxyXG5cclxucmdtLnF1YXQybWF0NCA9IGZ1bmN0aW9uIChxKSB7XHJcbiAgdmFyIHh4ID0gcVswXSAqIHFbMF07XHJcbiAgdmFyIHh5ID0gcVswXSAqIHFbMV07XHJcbiAgdmFyIHh6ID0gcVswXSAqIHFbMl07XHJcbiAgdmFyIHh3ID0gcVswXSAqIHFbM107XHJcbiAgdmFyIHl5ID0gcVsxXSAqIHFbMV07XHJcbiAgdmFyIHl6ID0gcVsxXSAqIHFbMl07XHJcbiAgdmFyIHl3ID0gcVsxXSAqIHFbM107XHJcbiAgdmFyIHp6ID0gcVsyXSAqIHFbMl07XHJcbiAgdmFyIHp3ID0gcVsyXSAqIHFbM107XHJcbiAgXHJcbiAgdmFyIG1hdCA9IHJnbS5tYXQ0KDEpO1xyXG4gIG1hdFswXSAgPSAxIC0gMiAqICh5eSArIHp6KTtcclxuICBtYXRbNF0gID0gICAgIDIgKiAoeHkgLSB6dyk7XHJcbiAgbWF0WzhdICA9ICAgICAyICogKHh6ICsgeXcpO1xyXG4gIG1hdFsxXSAgPSAgICAgMiAqICh4eSArIHp3KTtcclxuICBtYXRbNV0gID0gMSAtIDIgKiAoeHggKyB6eik7XHJcbiAgbWF0WzldICA9ICAgICAyICogKHl6IC0geHcpO1xyXG4gIG1hdFsyXSAgPSAgICAgMiAqICh4eiAtIHl3KTtcclxuICBtYXRbNl0gID0gICAgIDIgKiAoeXogKyB4dyk7XHJcbiAgbWF0WzEwXSA9IDEgLSAyICogKHh4ICsgeXkpO1xyXG4gIG1hdFszXSAgPSBtYXRbN10gPSBtYXRbMTFdID0gbWF0WzEyXSA9IG1hdFsxM10gPSBtYXRbMTRdID0gMDtcclxuICBtYXRbMTVdID0gMTtcclxuICBcclxuICByZXR1cm4gbWF0O1xyXG59XHJcbiIsIlxyXG5cclxucmdtLnJhZGlhbnMgPSBmdW5jdGlvbihkZWdyZWVzKSB7XHJcbiAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xyXG59O1xyXG5cclxucmdtLmRlZ3JlZXMgPSBmdW5jdGlvbihyYWRpYW5zKSB7XHJcbiAgcmV0dXJuIHJhZGlhbnMgKiAxODAgLyBNYXRoLlBJO1xyXG59OyBcclxuXHJcblxyXG5yZ20ub3J0aG8gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcclxuICB2YXIgcmwgPSAocmlnaHQgLSBsZWZ0KTtcclxuICB2YXIgdGIgPSAodG9wIC0gYm90dG9tKTtcclxuICB2YXIgZm4gPSAoZmFyIC0gbmVhcik7XHJcbiAgXHJcbiAgdmFyIG0gPSByZ20ubWF0NCgpOyAgXHJcbiAgXHJcbiAgbVswXSA9IDIgLyBybDtcclxuICBtWzFdID0gMDtcclxuICBtWzJdID0gMDtcclxuICBtWzNdID0gMDtcclxuICBtWzRdID0gMDtcclxuICBtWzVdID0gMiAvIHRiO1xyXG4gIG1bNl0gPSAwO1xyXG4gIG1bN10gPSAwO1xyXG4gIG1bOF0gPSAwO1xyXG4gIG1bOV0gPSAwO1xyXG4gIG1bMTBdID0gLTIgLyBmbjtcclxuICBtWzExXSA9IDA7XHJcbiAgbVsxMl0gPSAtKGxlZnQgKyByaWdodCkgLyBybDtcclxuICBtWzEzXSA9IC0odG9wICsgYm90dG9tKSAvIHRiO1xyXG4gIG1bMTRdID0gLShmYXIgKyBuZWFyKSAvIGZuO1xyXG4gIG1bMTVdID0gMTtcclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnJnbS5mcnVzdHVtID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgem5lYXIsIHpmYXIpIHtcclxuICB2YXIgdDEgPSAyICogem5lYXI7XHJcbiAgdmFyIHQyID0gcmlnaHQgLSBsZWZ0O1xyXG4gIHZhciB0MyA9IHRvcCAtIGJvdHRvbTtcclxuICB2YXIgdDQgPSB6ZmFyIC0gem5lYXI7XHJcblxyXG4gIHZhciBtID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XHJcbiAgXHJcbiAgbVswXSA9IHQxL3QyOyBtWzRdID0gICAgIDA7IG1bIDhdID0gIChyaWdodCArIGxlZnQpIC8gdDI7IG1bMTJdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgbVsxXSA9ICAgICAwOyBtWzVdID0gdDEvdDM7IG1bIDldID0gICh0b3AgKyBib3R0b20pIC8gdDM7IG1bMTNdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgbVsyXSA9ICAgICAwOyBtWzZdID0gICAgIDA7IG1bMTBdID0gKC16ZmFyIC0gem5lYXIpIC8gdDQ7IG1bMTRdID0gKC10MSAqIHpmYXIpIC8gdDQ7XHJcbiAgbVszXSA9ICAgICAwOyBtWzddID0gICAgIDA7IG1bMTFdID0gICAgICAgICAgICAgICAgICAgLTE7IG1bMTVdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnJnbS5wZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uIChmb3Z5LCBhc3BlY3QsIHpuZWFyLCB6ZmFyKSB7XHJcbiAgdmFyIHltYXggPSB6bmVhciAqIE1hdGgudGFuKHJnbS5yYWRpYW5zKGZvdnkpKTtcclxuICB2YXIgeG1heCA9IHltYXggKiBhc3BlY3Q7XHJcbiAgcmV0dXJuIHJnbS5mcnVzdHVtKC14bWF4LCB4bWF4LCAteW1heCwgeW1heCwgem5lYXIsIHpmYXIpO1xyXG59XHJcblxyXG4vLyBOT1RFOiB0aGlzIGlzIGluZWZmaWNpZW50LCBpdCBtYXkgYmUgc2Vuc2libGUgdG8gcHJvdmlkZSBpbnBsYWNlIHZlcnNpb25zXHJcbnJnbS50cmFuc2xhdGUgPSBmdW5jdGlvbihtLCB4LCB5LCB6KSB7ICAgIFxyXG4gIHZhciByID0gcmdtLm1hdDQobSk7XHJcbiAgclsxMl0gPSBtWzBdICogeCArIG1bNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl07XHJcbiAgclsxM10gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM107XHJcbiAgclsxNF0gPSBtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XHJcbiAgclsxNV0gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV07XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS5yb3RhdGUgPSBmdW5jdGlvbiAobSwgYW5nbGUsIHgsIHksIHopIHsgIFxyXG4gIHZhciBhID0gcmdtLnJhZGlhbnMoYW5nbGUpO1xyXG4gIHZhciBjID0gTWF0aC5jb3MoYSk7XHJcbiAgdmFyIHMgPSBNYXRoLnNpbihhKTtcclxuICBcclxuICB2YXIgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gIHZhciBueCA9IHggLyBsO1xyXG4gIHZhciBueSA9IHkgLyBsO1xyXG4gIHZhciBueiA9IHogLyBsO1xyXG5cclxuICB2YXIgdDAgPSBueCAqICgxIC0gYyk7XHJcbiAgdmFyIHQxID0gbnkgKiAoMSAtIGMpO1xyXG4gIHZhciB0MiA9IG56ICogKDEgLSBjKTsgIFxyXG5cclxuICB2YXIgZCA9IHJnbS5tYXQ0KDEpO1xyXG4gIFxyXG4gIGRbIDBdID0gYyArIHQwICogbng7XHJcbiAgZFsgMV0gPSAwICsgdDAgKiBueSArIHMgKiBuejtcclxuICBkWyAyXSA9IDAgKyB0MCAqIG56IC0gcyAqIG55O1xyXG5cclxuICBkWyA0XSA9IDAgKyB0MSAqIG54IC0gcyAqIG56O1xyXG4gIGRbIDVdID0gYyArIHQxICogbnk7XHJcbiAgZFsgNl0gPSAwICsgdDEgKiBueiArIHMgKiBueDtcclxuXHJcbiAgZFsgOF0gPSAwICsgdDIgKiBueCArIHMgKiBueTtcclxuICBkWyA5XSA9IDAgKyB0MiAqIG55IC0gcyAqIG54O1xyXG4gIGRbMTBdID0gYyArIHQyICogbno7ICBcclxuICBcclxuICB2YXIgciA9IHJnbS5tbXVsdChtLCBkKTtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20uc2NhbGUgPSBmdW5jdGlvbihtLCB4LCB5LCB6KSB7ICAgIFxyXG4gIHZhciByID0gcmdtLm1hdDQoMSk7XHJcbiAgXHJcbiAgclsgMF0gPSBtWyAwXSAqIHg7IFxyXG4gIHJbIDFdID0gbVsgMV0gKiB4OyBcclxuICByWyAyXSA9IG1bIDJdICogeDsgXHJcbiAgclsgM10gPSBtWyAzXSAqIHg7IFxyXG4gIFxyXG4gIHJbIDRdID0gbVsgNF0gKiB5OyBcclxuICByWyA1XSA9IG1bIDVdICogeTsgXHJcbiAgclsgNl0gPSBtWyA2XSAqIHk7IFxyXG4gIHJbIDddID0gbVsgN10gKiB5OyBcclxuICBcclxuICByWyA4XSA9IG1bIDhdICogejtcclxuICByWyA5XSA9IG1bIDldICogejtcclxuICByWzEwXSA9IG1bMTBdICogejtcclxuICByWzExXSA9IG1bMTFdICogejtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20ucXJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSwgYXhpcykge1xyXG4gIHZhciBhbiAgICA9IHJnbS5ub3JtYWxpemUoYXhpcyk7XHJcbiAgdmFyIHNpbl9hID0gTWF0aC5zaW4ocmdtLnJhZGlhbnMoYW5nbGUvMi4wKSk7XHJcbiAgdmFyIGNvc19hID0gTWF0aC5jb3MocmdtLnJhZGlhbnMoYW5nbGUvMi4wKSk7XHJcbiAgdmFyIHggPSBhblswXSAqIHNpbl9hO1xyXG4gIHZhciB5ID0gYW5bMV0gKiBzaW5fYTtcclxuICB2YXIgeiA9IGFuWzJdICogc2luX2E7XHJcbiAgdmFyIHcgPSBjb3NfYTtcclxuICByZXR1cm4gcmdtLnF1YXQoeCwgeSwgeiwgdyk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9