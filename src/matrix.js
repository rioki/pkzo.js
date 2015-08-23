
pkzo.mat3 = function (v) {
  if (typeof v === 'array' || v instanceof Float32Array) {
    if (v.length == 16) {
			// down case from mat4
			return new Float32Array([v[0], v[1], v[2],
                               v[4], v[5], v[6],
                               v[8], v[9], v[10]]);
		}
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