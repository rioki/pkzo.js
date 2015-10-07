
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

rgm.qconjugate = function (q) {
  return rgm.quat(-q[0], -q[1], -q[2], q[3]);
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

rgm.equal = function (a, b, eps) {
  if (a.length != b.length) {
    return false;
  }
  
  var e = (eps !== undefined) ? eps : 1e-6;
  
  for (var i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > e) {
      return false;
    }
  }
  
  return true;
}


rgm.radians = function(degrees) {
  return degrees * (Math.PI / 180.0);
};

rgm.degrees = function(radians) {
  return radians * (180.0 / Math.PI);
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

rgm.qtransform = function (q, v) {
  var qn = rgm.normalize(q)  
  var qv = rgm.quat(v[0], v[1], v[2], 0);
  var qc = rgm.qconjugate(qn);
  
  var qr = rgm.qmult(rgm.qmult(qn, qv), qc);
  
  return rgm.vec3(qr[0], qr[1], qr[2]);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0Xy5qcyIsImNvbnN0cnVjdG9ycy5qcyIsImZ1bmN0aW9ucy5qcyIsInRyYW5zZm9ybXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJyZ20tMC4xLjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIHJnbSA9IHt2ZXJzaW9uOiBcIjAuMS4wXCJ9O1xyXG4iLCJcclxucmdtLnZlYzIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxyXG4gIHtcclxuICAgIGNhc2UgMDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMik7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXSwgYXJndW1lbnRzWzBdXSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHNbMF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGFyZ3VtZW50c1swXSk7ICAgICAgICBcclxuICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdXSk7ICAgICAgICBcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndmVjMjogaW52YWxpZCBhcnJheSBzaXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMyOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuXHJcbnJnbS52ZWMzID0gZnVuY3Rpb24gKCkge1xyXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcclxuICB7XHJcbiAgICBjYXNlIDA6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzBdXSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7ICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50c1swXS5sZW5ndGgpIHtcclxuICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdLCAwLjBdKTsgICAgICAgIFxyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShhcmd1bWVudHNbMF0pOyAgICAgICAgXHJcbiAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF1bMF0sIGFyZ3VtZW50c1swXVsxXSwgYXJndW1lbnRzWzBdWzJdXSk7ICAgICAgICBcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndmVjMzogaW52YWxpZCBhcnJheSBzaXplJyk7XHJcbiAgICAgICAgfSAgICAgICBcclxuICAgICAgfSAgICAgIFxyXG4gICAgY2FzZSAzOlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMzOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuXHJcbnJnbS52ZWM0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcclxuICB7XHJcbiAgICBjYXNlIDA6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDQpO1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMF1dKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzWzBdLmxlbmd0aCkge1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdWzBdLCBhcmd1bWVudHNbMF1bMV0sIDAuMCwgMC4wXSk7ICAgICAgICBcclxuICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdLCBhcmd1bWVudHNbMF1bMl0sIDAuMF0pOyAgICAgICAgXHJcbiAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGFyZ3VtZW50c1swXSk7ICAgICAgICBcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndmVjMzogaW52YWxpZCBhcnJheSBzaXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBjYXNlIDQ6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdLCBhcmd1bWVudHNbM11dKTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcigndmVjNDogaW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzJyk7XHJcbiAgfVxyXG59XHJcblxyXG5yZ20ubWF0MyA9IGZ1bmN0aW9uICgpIHtcclxuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXHJcbiAge1xyXG4gICAgY2FzZSAwOlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMS4wLCAwLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgMS4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIDAuMCwgMS4wXSk7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXSwgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgYXJndW1lbnRzWzBdLCAgICAgICAgICAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgICAgICAgICAgMC4wLCBhcmd1bWVudHNbMF1dKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50c1swXS5sZW5ndGgpIHtcclxuICAgICAgICAgIGNhc2UgOTpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoYXJndW1lbnRzWzBdKTsgICAgICAgIFxyXG4gICAgICAgICAgY2FzZSAxNjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdLCBhcmd1bWVudHNbMF1bIDJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzWzBdWzRdLCBhcmd1bWVudHNbMF1bNV0sIGFyZ3VtZW50c1swXVsgNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1bOF0sIGFyZ3VtZW50c1swXVs5XSwgYXJndW1lbnRzWzBdWzEwXV0pO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXQzOiBpbnZhbGlkIGFycmF5IHNpemUnKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgfVxyXG4gICAgY2FzZSA5OlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbM10sIGFyZ3VtZW50c1s0XSwgYXJndW1lbnRzWzVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzWzZdLCBhcmd1bWVudHNbN10sIGFyZ3VtZW50c1s4XV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMyOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuXHJcbnJnbS5tYXQ0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcclxuICB7XHJcbiAgICBjYXNlIDA6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLjAsIDAuMCwgMC4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIDEuMCwgMC4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIDAuMCwgMC4wLCAxLjBdKTtcclxuICAgIGNhc2UgMTpcclxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdLCAgICAgICAgICAwLjAsICAgICAgICAgIDAuMCwgICAgICAgICAgMC4wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIGFyZ3VtZW50c1swXSwgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgICAgICAgICAgMC4wLCBhcmd1bWVudHNbMF0sICAgICAgICAgIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsICAgICAgICAgIDAuMCwgYXJndW1lbnRzWzBdXSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHNbMF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjYXNlIDk6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF1bMF0sIGFyZ3VtZW50c1swXVsxXSwgYXJndW1lbnRzWzBdWzJdLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1bM10sIGFyZ3VtZW50c1swXVs0XSwgYXJndW1lbnRzWzBdWzVdLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1bNl0sIGFyZ3VtZW50c1swXVs3XSwgYXJndW1lbnRzWzBdWzhdLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsICAgICAgICAgICAgIDAuMCwgICAgICAgICAgICAgMC4wLCAxLjBdKTtcclxuICAgICAgICAgIGNhc2UgMTY6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDM6IGludmFsaWQgYXJyYXkgc2l6ZScpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICB9XHJcbiAgICBjYXNlIDE2OlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWyAwXSwgYXJndW1lbnRzWyAxXSwgYXJndW1lbnRzWyAyXSwgYXJndW1lbnRzWyAzXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbIDRdLCBhcmd1bWVudHNbIDVdLCBhcmd1bWVudHNbIDZdLCBhcmd1bWVudHNbIDddLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1sgOF0sIGFyZ3VtZW50c1sgOV0sIGFyZ3VtZW50c1sxMF0sIGFyZ3VtZW50c1sxMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMTJdLCBhcmd1bWVudHNbMTNdLCBhcmd1bWVudHNbMTRdLCBhcmd1bWVudHNbMTVdXSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZlYzI6IGludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xyXG4gIH1cclxufVxyXG5cclxucmdtLnF1YXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxyXG4gIHtcclxuICAgIGNhc2UgMDpcclxuICAgICAgcmV0dXJuIHJnbS52ZWM0KDAsIDAsIDAsIDEpO1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICByZXR1cm4gcmdtLnZlYzQoYXJndW1lbnRzWzBdKTsgICAgIFxyXG4gICAgY2FzZSA0OlxyXG4gICAgICByZXR1cm4gcmdtLnZlYzQoW2FyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMyOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuIiwiXHJcbnJnbS5hZGQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkge1xyXG4gICAgdGhyb3cgRXJyb3IoJ2FkZDogYSBhbmQgYiBtdXN0IGJlIHRoZSBzYW1lIGRpbWVuc2lvbicpO1xyXG4gIH1cclxuICBcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gKyBiW2ldO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucmdtLnN1YiA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKSB7XHJcbiAgICB0aHJvdyBFcnJvcignc3ViOiBhIGFuZCBiIG11c3QgYmUgdGhlIHNhbWUgZGltZW5zaW9uJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSAtIGJbaV07XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20ubmVnID0gZnVuY3Rpb24gKGEpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IC1hW2ldO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucmdtLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHYgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgdiArPSBhW2ldICogYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbnJnbS5jcm9zcyA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgaWYgKGEubGVuZ3RoICE9IDMgfHxcclxuICAgICAgYi5sZW5ndGggIT0gMykge1xyXG4gICAgdGhyb3cgRXJyb3IoJ2Nyb3NzOiBhIGFuZCBiIG11c3QgYmUgM0QnKTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gIFxyXG4gIHJbMF0gPSAoYVsxXSAqIGJbMl0pIC0gKGFbMl0gKiBiWzFdKTtcclxuICByWzFdID0gKGFbMl0gKiBiWzBdKSAtIChhWzBdICogYlsyXSk7XHJcbiAgclsyXSA9IChhWzBdICogYlsxXSkgLSAoYVsxXSAqIGJbMF0pO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20udm11bHQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkge1xyXG4gICAgdGhyb3cgRXJyb3IoJ3ZtdWx0OiBhIGFuZCBiIG11c3QgYmUgdGhlIHNhbWUgZGltZW5zaW9uJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSAqIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20udnNtdWx0ID0gZnVuY3Rpb24gKHYsIHMpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkodi5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdi5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IHZbaV0gKiBzO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucmdtLmxlbmd0aCA9IGZ1bmN0aW9uICh2KSB7ICBcclxuICByZXR1cm4gTWF0aC5zcXJ0KHJnbS5kb3QodiwgdikpO1xyXG59XHJcblxyXG5yZ20ubm9ybWFsaXplID0gZnVuY3Rpb24gKHYpIHtcclxuICByZXR1cm4gcmdtLnZzbXVsdCh2LCAxLjAgLyByZ20ubGVuZ3RoKHYpKTtcclxufVxyXG5cclxucmdtLm1tdWx0ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICBpZiAoYS5sZW5ndGggIT0gYi5sZW5ndGgpIHtcclxuICAgIHRocm93IEVycm9yKCdtbXVsdDogYSBhbmQgYiBtdXN0IGJlIHRoZSBzYW1lIGRpbWVuc2lvbicpO1xyXG4gIH1cclxuICBcclxuICB2YXIgbiA9IE1hdGguc3FydChhLmxlbmd0aCk7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgdmFyIHYgPSAwO1xyXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IG47IGsrKykge1xyXG4gICAgICAgIHYgPSB2ICsgYVtpKm4ra10gKiBiW2sqbitqXTtcclxuICAgICAgfVxyXG4gICAgICByW2kqbitqXSA9IHY7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20udHJhbnNwb3NlID0gZnVuY3Rpb24obSkgeyAgICBcclxuICB2YXIgbiA9IE1hdGguc3FydChtLmxlbmd0aCk7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KG0ubGVuZ3RoKTtcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgcltqKm4raV0gPSBtW2kqbitqXTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS5tdm11bHQgPSBmdW5jdGlvbiAobSwgdikge1xyXG5cdHZhciBuID0gdi5sZW5ndGg7XHJcblx0dmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KG4pO1xyXG5cdFxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKVxyXG5cdHtcclxuXHRcdHJbaV0gPSAwO1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdFx0cltpXSArPSBtW2oqbitpXSAqIHZbal07XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiByO1xyXG59XHJcblxyXG5yZ20ucW11bHQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciB3YSA9IGFbM107XHJcbiAgdmFyIHZhID0gcmdtLnZlYzMoYVswXSwgYVsxXSwgYVsyXSk7XHJcbiAgdmFyIHdiID0gYlszXTtcclxuICB2YXIgdmIgPSByZ20udmVjMyhiWzBdLCBiWzFdLCBiWzJdKTtcclxuICBcclxuICB2YXIgdyA9IHdhICogd2IgLSByZ20uZG90KHZhLCB2Yik7XHJcbiAgdmFyIHYgPSByZ20uYWRkKHJnbS5hZGQocmdtLnZzbXVsdCh2Yiwgd2EpLCByZ20udnNtdWx0KHZhLCB3YikpLCByZ20uY3Jvc3ModmEsIHZiKSk7XHJcblxyXG4gIHJldHVybiByZ20ucXVhdCh2WzBdLCB2WzFdLCB2YVsyXSwgdyk7XHJcbn1cclxuXHJcbnJnbS5xY29uanVnYXRlID0gZnVuY3Rpb24gKHEpIHtcclxuICByZXR1cm4gcmdtLnF1YXQoLXFbMF0sIC1xWzFdLCAtcVsyXSwgcVszXSk7XHJcbn1cclxuXHJcbnJnbS5xdWF0Mm1hdDQgPSBmdW5jdGlvbiAocSkge1xyXG4gIHZhciB4eCA9IHFbMF0gKiBxWzBdO1xyXG4gIHZhciB4eSA9IHFbMF0gKiBxWzFdO1xyXG4gIHZhciB4eiA9IHFbMF0gKiBxWzJdO1xyXG4gIHZhciB4dyA9IHFbMF0gKiBxWzNdO1xyXG4gIHZhciB5eSA9IHFbMV0gKiBxWzFdO1xyXG4gIHZhciB5eiA9IHFbMV0gKiBxWzJdO1xyXG4gIHZhciB5dyA9IHFbMV0gKiBxWzNdO1xyXG4gIHZhciB6eiA9IHFbMl0gKiBxWzJdO1xyXG4gIHZhciB6dyA9IHFbMl0gKiBxWzNdO1xyXG4gIFxyXG4gIHZhciBtYXQgPSByZ20ubWF0NCgxKTtcclxuICBtYXRbMF0gID0gMSAtIDIgKiAoeXkgKyB6eik7XHJcbiAgbWF0WzRdICA9ICAgICAyICogKHh5IC0gencpO1xyXG4gIG1hdFs4XSAgPSAgICAgMiAqICh4eiArIHl3KTtcclxuICBtYXRbMV0gID0gICAgIDIgKiAoeHkgKyB6dyk7XHJcbiAgbWF0WzVdICA9IDEgLSAyICogKHh4ICsgenopO1xyXG4gIG1hdFs5XSAgPSAgICAgMiAqICh5eiAtIHh3KTtcclxuICBtYXRbMl0gID0gICAgIDIgKiAoeHogLSB5dyk7XHJcbiAgbWF0WzZdICA9ICAgICAyICogKHl6ICsgeHcpO1xyXG4gIG1hdFsxMF0gPSAxIC0gMiAqICh4eCArIHl5KTtcclxuICBtYXRbM10gID0gbWF0WzddID0gbWF0WzExXSA9IG1hdFsxMl0gPSBtYXRbMTNdID0gbWF0WzE0XSA9IDA7XHJcbiAgbWF0WzE1XSA9IDE7XHJcbiAgXHJcbiAgcmV0dXJuIG1hdDtcclxufVxyXG5cclxucmdtLmVxdWFsID0gZnVuY3Rpb24gKGEsIGIsIGVwcykge1xyXG4gIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICBcclxuICB2YXIgZSA9IChlcHMgIT09IHVuZGVmaW5lZCkgPyBlcHMgOiAxZS02O1xyXG4gIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKE1hdGguYWJzKGFbaV0gLSBiW2ldKSA+IGUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gdHJ1ZTtcclxufSIsIlxyXG5cclxucmdtLnJhZGlhbnMgPSBmdW5jdGlvbihkZWdyZWVzKSB7XHJcbiAgcmV0dXJuIGRlZ3JlZXMgKiAoTWF0aC5QSSAvIDE4MC4wKTtcclxufTtcclxuXHJcbnJnbS5kZWdyZWVzID0gZnVuY3Rpb24ocmFkaWFucykge1xyXG4gIHJldHVybiByYWRpYW5zICogKDE4MC4wIC8gTWF0aC5QSSk7XHJcbn07IFxyXG5cclxuXHJcbnJnbS5vcnRobyA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikge1xyXG4gIHZhciBybCA9IChyaWdodCAtIGxlZnQpO1xyXG4gIHZhciB0YiA9ICh0b3AgLSBib3R0b20pO1xyXG4gIHZhciBmbiA9IChmYXIgLSBuZWFyKTtcclxuICBcclxuICB2YXIgbSA9IHJnbS5tYXQ0KCk7ICBcclxuICBcclxuICBtWzBdID0gMiAvIHJsO1xyXG4gIG1bMV0gPSAwO1xyXG4gIG1bMl0gPSAwO1xyXG4gIG1bM10gPSAwO1xyXG4gIG1bNF0gPSAwO1xyXG4gIG1bNV0gPSAyIC8gdGI7XHJcbiAgbVs2XSA9IDA7XHJcbiAgbVs3XSA9IDA7XHJcbiAgbVs4XSA9IDA7XHJcbiAgbVs5XSA9IDA7XHJcbiAgbVsxMF0gPSAtMiAvIGZuO1xyXG4gIG1bMTFdID0gMDtcclxuICBtWzEyXSA9IC0obGVmdCArIHJpZ2h0KSAvIHJsO1xyXG4gIG1bMTNdID0gLSh0b3AgKyBib3R0b20pIC8gdGI7XHJcbiAgbVsxNF0gPSAtKGZhciArIG5lYXIpIC8gZm47XHJcbiAgbVsxNV0gPSAxO1xyXG5cclxuICByZXR1cm4gbTtcclxufVxyXG5cclxucmdtLmZydXN0dW0gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCB6bmVhciwgemZhcikge1xyXG4gIHZhciB0MSA9IDIgKiB6bmVhcjtcclxuICB2YXIgdDIgPSByaWdodCAtIGxlZnQ7XHJcbiAgdmFyIHQzID0gdG9wIC0gYm90dG9tO1xyXG4gIHZhciB0NCA9IHpmYXIgLSB6bmVhcjtcclxuXHJcbiAgdmFyIG0gPSBuZXcgRmxvYXQzMkFycmF5KDE2KTtcclxuICBcclxuICBtWzBdID0gdDEvdDI7IG1bNF0gPSAgICAgMDsgbVsgOF0gPSAgKHJpZ2h0ICsgbGVmdCkgLyB0MjsgbVsxMl0gPSAgICAgICAgICAgICAgICAgMDtcclxuICBtWzFdID0gICAgIDA7IG1bNV0gPSB0MS90MzsgbVsgOV0gPSAgKHRvcCArIGJvdHRvbSkgLyB0MzsgbVsxM10gPSAgICAgICAgICAgICAgICAgMDtcclxuICBtWzJdID0gICAgIDA7IG1bNl0gPSAgICAgMDsgbVsxMF0gPSAoLXpmYXIgLSB6bmVhcikgLyB0NDsgbVsxNF0gPSAoLXQxICogemZhcikgLyB0NDtcclxuICBtWzNdID0gICAgIDA7IG1bN10gPSAgICAgMDsgbVsxMV0gPSAgICAgICAgICAgICAgICAgICAtMTsgbVsxNV0gPSAgICAgICAgICAgICAgICAgMDtcclxuICBcclxuICByZXR1cm4gbTtcclxufVxyXG5cclxucmdtLnBlcnNwZWN0aXZlID0gZnVuY3Rpb24gKGZvdnksIGFzcGVjdCwgem5lYXIsIHpmYXIpIHtcclxuICB2YXIgeW1heCA9IHpuZWFyICogTWF0aC50YW4ocmdtLnJhZGlhbnMoZm92eSkpO1xyXG4gIHZhciB4bWF4ID0geW1heCAqIGFzcGVjdDtcclxuICByZXR1cm4gcmdtLmZydXN0dW0oLXhtYXgsIHhtYXgsIC15bWF4LCB5bWF4LCB6bmVhciwgemZhcik7XHJcbn1cclxuXHJcbi8vIE5PVEU6IHRoaXMgaXMgaW5lZmZpY2llbnQsIGl0IG1heSBiZSBzZW5zaWJsZSB0byBwcm92aWRlIGlucGxhY2UgdmVyc2lvbnNcclxucmdtLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKG0sIHgsIHksIHopIHsgICAgXHJcbiAgdmFyIHIgPSByZ20ubWF0NChtKTtcclxuICByWzEyXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXTtcclxuICByWzEzXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcclxuICByWzE0XSA9IG1bMl0gKiB4ICsgbVs2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcclxuICByWzE1XSA9IG1bM10gKiB4ICsgbVs3XSAqIHkgKyBtWzExXSAqIHogKyBtWzE1XTtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucmdtLnJvdGF0ZSA9IGZ1bmN0aW9uIChtLCBhbmdsZSwgeCwgeSwgeikgeyAgXHJcbiAgdmFyIGEgPSByZ20ucmFkaWFucyhhbmdsZSk7XHJcbiAgdmFyIGMgPSBNYXRoLmNvcyhhKTtcclxuICB2YXIgcyA9IE1hdGguc2luKGEpO1xyXG4gIFxyXG4gIHZhciBsID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgdmFyIG54ID0geCAvIGw7XHJcbiAgdmFyIG55ID0geSAvIGw7XHJcbiAgdmFyIG56ID0geiAvIGw7XHJcblxyXG4gIHZhciB0MCA9IG54ICogKDEgLSBjKTtcclxuICB2YXIgdDEgPSBueSAqICgxIC0gYyk7XHJcbiAgdmFyIHQyID0gbnogKiAoMSAtIGMpOyAgXHJcblxyXG4gIHZhciBkID0gcmdtLm1hdDQoMSk7XHJcbiAgXHJcbiAgZFsgMF0gPSBjICsgdDAgKiBueDtcclxuICBkWyAxXSA9IDAgKyB0MCAqIG55ICsgcyAqIG56O1xyXG4gIGRbIDJdID0gMCArIHQwICogbnogLSBzICogbnk7XHJcblxyXG4gIGRbIDRdID0gMCArIHQxICogbnggLSBzICogbno7XHJcbiAgZFsgNV0gPSBjICsgdDEgKiBueTtcclxuICBkWyA2XSA9IDAgKyB0MSAqIG56ICsgcyAqIG54O1xyXG5cclxuICBkWyA4XSA9IDAgKyB0MiAqIG54ICsgcyAqIG55O1xyXG4gIGRbIDldID0gMCArIHQyICogbnkgLSBzICogbng7XHJcbiAgZFsxMF0gPSBjICsgdDIgKiBuejsgIFxyXG4gIFxyXG4gIHZhciByID0gcmdtLm1tdWx0KG0sIGQpO1xyXG4gIFxyXG4gIHJbMTJdID0gbVsxMl07XHJcbiAgclsxM10gPSBtWzEzXTtcclxuICByWzE0XSA9IG1bMTRdO1xyXG4gIHJbMTVdID0gbVsxNV07XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS5zY2FsZSA9IGZ1bmN0aW9uKG0sIHgsIHksIHopIHsgICAgXHJcbiAgdmFyIHIgPSByZ20ubWF0NCgxKTtcclxuICBcclxuICByWyAwXSA9IG1bIDBdICogeDsgXHJcbiAgclsgMV0gPSBtWyAxXSAqIHg7IFxyXG4gIHJbIDJdID0gbVsgMl0gKiB4OyBcclxuICByWyAzXSA9IG1bIDNdICogeDsgXHJcbiAgXHJcbiAgclsgNF0gPSBtWyA0XSAqIHk7IFxyXG4gIHJbIDVdID0gbVsgNV0gKiB5OyBcclxuICByWyA2XSA9IG1bIDZdICogeTsgXHJcbiAgclsgN10gPSBtWyA3XSAqIHk7IFxyXG4gIFxyXG4gIHJbIDhdID0gbVsgOF0gKiB6O1xyXG4gIHJbIDldID0gbVsgOV0gKiB6O1xyXG4gIHJbMTBdID0gbVsxMF0gKiB6O1xyXG4gIHJbMTFdID0gbVsxMV0gKiB6O1xyXG4gIFxyXG4gIHJbMTJdID0gbVsxMl07XHJcbiAgclsxM10gPSBtWzEzXTtcclxuICByWzE0XSA9IG1bMTRdO1xyXG4gIHJbMTVdID0gbVsxNV07XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS5xcm90YXRlID0gZnVuY3Rpb24gKGFuZ2xlLCBheGlzKSB7XHJcbiAgdmFyIGFuICAgID0gcmdtLm5vcm1hbGl6ZShheGlzKTtcclxuICB2YXIgc2luX2EgPSBNYXRoLnNpbihyZ20ucmFkaWFucyhhbmdsZS8yLjApKTtcclxuICB2YXIgY29zX2EgPSBNYXRoLmNvcyhyZ20ucmFkaWFucyhhbmdsZS8yLjApKTtcclxuICB2YXIgeCA9IGFuWzBdICogc2luX2E7XHJcbiAgdmFyIHkgPSBhblsxXSAqIHNpbl9hO1xyXG4gIHZhciB6ID0gYW5bMl0gKiBzaW5fYTtcclxuICB2YXIgdyA9IGNvc19hO1xyXG4gIHJldHVybiByZ20ucXVhdCh4LCB5LCB6LCB3KTtcclxufVxyXG5cclxucmdtLnF0cmFuc2Zvcm0gPSBmdW5jdGlvbiAocSwgdikge1xyXG4gIHZhciBxbiA9IHJnbS5ub3JtYWxpemUocSkgIFxyXG4gIHZhciBxdiA9IHJnbS5xdWF0KHZbMF0sIHZbMV0sIHZbMl0sIDApO1xyXG4gIHZhciBxYyA9IHJnbS5xY29uanVnYXRlKHFuKTtcclxuICBcclxuICB2YXIgcXIgPSByZ20ucW11bHQocmdtLnFtdWx0KHFuLCBxdiksIHFjKTtcclxuICBcclxuICByZXR1cm4gcmdtLnZlYzMocXJbMF0sIHFyWzFdLCBxclsyXSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9