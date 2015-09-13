
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0Xy5qcyIsImNvbnN0cnVjdG9ycy5qcyIsImZ1bmN0aW9ucy5qcyIsInRyYW5zZm9ybXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJyZ20tMC4xLjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIHJnbSA9IHt2ZXJzaW9uOiBcIjAuMS4wXCJ9O1xyXG4iLCJcclxucmdtLnZlYzIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxyXG4gIHtcclxuICAgIGNhc2UgMDpcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMik7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXSwgYXJndW1lbnRzWzBdXSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHNbMF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGFyZ3VtZW50c1swXSk7ICAgICAgICBcclxuICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdXSk7ICAgICAgICBcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndmVjMjogaW52YWxpZCBhcnJheSBzaXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMyOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuXHJcbnJnbS52ZWMzID0gZnVuY3Rpb24gKCkge1xyXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcclxuICB7XHJcbiAgICBjYXNlIDA6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzBdXSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7ICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50c1swXS5sZW5ndGgpIHtcclxuICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdLCAwLjBdKTsgICAgICAgIFxyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShhcmd1bWVudHNbMF0pOyAgICAgICAgXHJcbiAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF1bMF0sIGFyZ3VtZW50c1swXVsxXSwgYXJndW1lbnRzWzBdWzJdXSk7ICAgICAgICBcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndmVjMzogaW52YWxpZCBhcnJheSBzaXplJyk7XHJcbiAgICAgICAgfSAgICAgICBcclxuICAgICAgfSAgICAgIFxyXG4gICAgY2FzZSAzOlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMzOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuXHJcbnJnbS52ZWM0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcclxuICB7XHJcbiAgICBjYXNlIDA6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDQpO1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMF1dKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzWzBdLmxlbmd0aCkge1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdWzBdLCBhcmd1bWVudHNbMF1bMV0sIDAuMCwgMC4wXSk7ICAgICAgICBcclxuICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdLCBhcmd1bWVudHNbMF1bMl0sIDAuMF0pOyAgICAgICAgXHJcbiAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGFyZ3VtZW50c1swXSk7ICAgICAgICBcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndmVjMzogaW52YWxpZCBhcnJheSBzaXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBjYXNlIDQ6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdLCBhcmd1bWVudHNbM11dKTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcigndmVjNDogaW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzJyk7XHJcbiAgfVxyXG59XHJcblxyXG5yZ20ubWF0MyA9IGZ1bmN0aW9uICgpIHtcclxuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXHJcbiAge1xyXG4gICAgY2FzZSAwOlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMS4wLCAwLjAsIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgMS4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIDAuMCwgMS4wXSk7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXSwgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgYXJndW1lbnRzWzBdLCAgICAgICAgICAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgICAgICAgICAgMC4wLCBhcmd1bWVudHNbMF1dKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50c1swXS5sZW5ndGgpIHtcclxuICAgICAgICAgIGNhc2UgOTpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoYXJndW1lbnRzWzBdKTsgICAgICAgIFxyXG4gICAgICAgICAgY2FzZSAxNjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW2FyZ3VtZW50c1swXVswXSwgYXJndW1lbnRzWzBdWzFdLCBhcmd1bWVudHNbMF1bIDJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzWzBdWzRdLCBhcmd1bWVudHNbMF1bNV0sIGFyZ3VtZW50c1swXVsgNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1bOF0sIGFyZ3VtZW50c1swXVs5XSwgYXJndW1lbnRzWzBdWzEwXV0pO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXQzOiBpbnZhbGlkIGFycmF5IHNpemUnKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgfVxyXG4gICAgY2FzZSA5OlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbM10sIGFyZ3VtZW50c1s0XSwgYXJndW1lbnRzWzVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzWzZdLCBhcmd1bWVudHNbN10sIGFyZ3VtZW50c1s4XV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMyOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuXHJcbnJnbS5tYXQ0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcclxuICB7XHJcbiAgICBjYXNlIDA6XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLjAsIDAuMCwgMC4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIDEuMCwgMC4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIDAuMCwgMC4wLCAxLjBdKTtcclxuICAgIGNhc2UgMTpcclxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWzBdLCAgICAgICAgICAwLjAsICAgICAgICAgIDAuMCwgICAgICAgICAgMC4wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsIGFyZ3VtZW50c1swXSwgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCwgICAgICAgICAgMC4wLCBhcmd1bWVudHNbMF0sICAgICAgICAgIDAuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wLCAgICAgICAgICAwLjAsICAgICAgICAgIDAuMCwgYXJndW1lbnRzWzBdXSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHNbMF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjYXNlIDk6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFthcmd1bWVudHNbMF1bMF0sIGFyZ3VtZW50c1swXVsxXSwgYXJndW1lbnRzWzBdWzJdLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1bM10sIGFyZ3VtZW50c1swXVs0XSwgYXJndW1lbnRzWzBdWzVdLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1bNl0sIGFyZ3VtZW50c1swXVs3XSwgYXJndW1lbnRzWzBdWzhdLCAwLjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAsICAgICAgICAgICAgIDAuMCwgICAgICAgICAgICAgMC4wLCAxLjBdKTtcclxuICAgICAgICAgIGNhc2UgMTY6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdDM6IGludmFsaWQgYXJyYXkgc2l6ZScpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICB9XHJcbiAgICBjYXNlIDE2OlxyXG4gICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbYXJndW1lbnRzWyAwXSwgYXJndW1lbnRzWyAxXSwgYXJndW1lbnRzWyAyXSwgYXJndW1lbnRzWyAzXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbIDRdLCBhcmd1bWVudHNbIDVdLCBhcmd1bWVudHNbIDZdLCBhcmd1bWVudHNbIDddLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1sgOF0sIGFyZ3VtZW50c1sgOV0sIGFyZ3VtZW50c1sxMF0sIGFyZ3VtZW50c1sxMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMTJdLCBhcmd1bWVudHNbMTNdLCBhcmd1bWVudHNbMTRdLCBhcmd1bWVudHNbMTVdXSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZlYzI6IGludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xyXG4gIH1cclxufVxyXG5cclxucmdtLnF1YXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxyXG4gIHtcclxuICAgIGNhc2UgMDpcclxuICAgICAgcmV0dXJuIHJnbS52ZWM0KDAsIDAsIDAsIDEpO1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICByZXR1cm4gcmdtLnZlYzQoYXJndW1lbnRzWzBdKTsgICAgIFxyXG4gICAgY2FzZSA0OlxyXG4gICAgICByZXR1cm4gcmdtLnZlYzQoW2FyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXV0pO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2ZWMyOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMnKTtcclxuICB9XHJcbn1cclxuIiwiXHJcbnJnbS5hZGQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkge1xyXG4gICAgdGhyb3cgRXJyb3IoJ2FkZDogYSBhbmQgYiBtdXN0IGJlIHRoZSBzYW1lIGRpbWVuc2lvbicpO1xyXG4gIH1cclxuICBcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IGFbaV0gKyBiW2ldO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucmdtLnN1YiA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKSB7XHJcbiAgICB0aHJvdyBFcnJvcignc3ViOiBhIGFuZCBiIG11c3QgYmUgdGhlIHNhbWUgZGltZW5zaW9uJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSAtIGJbaV07XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20ubmVnID0gZnVuY3Rpb24gKGEpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkoYS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IC1hW2ldO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucmdtLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgdmFyIHYgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgdiArPSBhW2ldICogYltpXTtcclxuICB9XHJcbiAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbnJnbS5jcm9zcyA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgaWYgKGEubGVuZ3RoICE9IDMgfHxcclxuICAgICAgYi5sZW5ndGggIT0gMykge1xyXG4gICAgdGhyb3cgRXJyb3IoJ2Nyb3NzOiBhIGFuZCBiIG11c3QgYmUgM0QnKTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gIFxyXG4gIHJbMF0gPSAoYVsxXSAqIGJbMl0pIC0gKGFbMl0gKiBiWzFdKTtcclxuICByWzFdID0gKGFbMl0gKiBiWzBdKSAtIChhWzBdICogYlsyXSk7XHJcbiAgclsyXSA9IChhWzBdICogYlsxXSkgLSAoYVsxXSAqIGJbMF0pO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20udm11bHQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkge1xyXG4gICAgdGhyb3cgRXJyb3IoJ3ZtdWx0OiBhIGFuZCBiIG11c3QgYmUgdGhlIHNhbWUgZGltZW5zaW9uJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciByID0gbmV3IEZsb2F0MzJBcnJheShhLmxlbmd0aCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICByW2ldID0gYVtpXSAqIGJbaV07XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20udnNtdWx0ID0gZnVuY3Rpb24gKHYsIHMpIHtcclxuICB2YXIgciA9IG5ldyBGbG9hdDMyQXJyYXkodi5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdi5sZW5ndGg7IGkrKykge1xyXG4gICAgcltpXSA9IHZbaV0gKiBzO1xyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxucmdtLmxlbmd0aCA9IGZ1bmN0aW9uICh2KSB7ICBcclxuICByZXR1cm4gTWF0aC5zcXJ0KHJnbS5kb3QodiwgdikpO1xyXG59XHJcblxyXG5yZ20ubm9ybWFsaXplID0gZnVuY3Rpb24gKHYpIHtcclxuICByZXR1cm4gcmdtLnZzbXVsdCh2LCAxLjAgLyByZ20ubGVuZ3RoKHYpKTtcclxufVxyXG5cclxucmdtLm1tdWx0ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICBpZiAoYS5sZW5ndGggIT0gYi5sZW5ndGgpIHtcclxuICAgIHRocm93IEVycm9yKCdtbXVsdDogYSBhbmQgYiBtdXN0IGJlIHRoZSBzYW1lIGRpbWVuc2lvbicpO1xyXG4gIH1cclxuICBcclxuICB2YXIgbiA9IE1hdGguc3FydChhLmxlbmd0aCk7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KGEubGVuZ3RoKTtcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgdmFyIHYgPSAwO1xyXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IG47IGsrKykge1xyXG4gICAgICAgIHYgPSB2ICsgYVtpKm4ra10gKiBiW2sqbitqXTtcclxuICAgICAgfVxyXG4gICAgICByW2kqbitqXSA9IHY7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20udHJhbnNwb3NlID0gZnVuY3Rpb24obSkgeyAgICBcclxuICB2YXIgbiA9IE1hdGguc3FydChtLmxlbmd0aCk7XHJcbiAgdmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KG0ubGVuZ3RoKTtcclxuICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspIHtcclxuICAgICAgcltqKm4raV0gPSBtW2kqbitqXTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS5tdm11bHQgPSBmdW5jdGlvbiAobSwgdikge1xyXG5cdHZhciBuID0gdi5sZW5ndGg7XHJcblx0dmFyIHIgPSBuZXcgRmxvYXQzMkFycmF5KG4pO1xyXG5cdFxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKVxyXG5cdHtcclxuXHRcdHJbaV0gPSAwO1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBuOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdFx0cltpXSArPSBtW2oqbitpXSAqIHZbal07XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiByO1xyXG59XHJcblxyXG5yZ20ucW11bHQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gIHZhciB3YSA9IGFbM107XHJcbiAgdmFyIHZhID0gcmdtLnZlYzMoYVswXSwgYVsxXSwgYVsyXSk7XHJcbiAgdmFyIHdiID0gYlszXTtcclxuICB2YXIgdmIgPSByZ20udmVjMyhiWzBdLCBiWzFdLCBiWzJdKTtcclxuICBcclxuICB2YXIgdyA9IHdhICogd2IgLSByZ20uZG90KHZhLCB2Yik7XHJcbiAgdmFyIHYgPSByZ20uYWRkKHJnbS5hZGQocmdtLnZzbXVsdCh2Yiwgd2EpLCByZ20udnNtdWx0KHZhLCB3YikpLCByZ20uY3Jvc3ModmEsIHZiKSk7XHJcblxyXG4gIHJldHVybiByZ20ucXVhdCh2WzBdLCB2WzFdLCB2YVsyXSwgdyk7XHJcbn1cclxuXHJcbiIsIlxyXG5cclxucmdtLnJhZGlhbnMgPSBmdW5jdGlvbihkZWdyZWVzKSB7XHJcbiAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xyXG59O1xyXG5cclxucmdtLmRlZ3JlZXMgPSBmdW5jdGlvbihyYWRpYW5zKSB7XHJcbiAgcmV0dXJuIHJhZGlhbnMgKiAxODAgLyBNYXRoLlBJO1xyXG59OyBcclxuXHJcblxyXG5yZ20ub3J0aG8gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcclxuICB2YXIgcmwgPSAocmlnaHQgLSBsZWZ0KTtcclxuICB2YXIgdGIgPSAodG9wIC0gYm90dG9tKTtcclxuICB2YXIgZm4gPSAoZmFyIC0gbmVhcik7XHJcbiAgXHJcbiAgdmFyIG0gPSByZ20ubWF0NCgpOyAgXHJcbiAgXHJcbiAgbVswXSA9IDIgLyBybDtcclxuICBtWzFdID0gMDtcclxuICBtWzJdID0gMDtcclxuICBtWzNdID0gMDtcclxuICBtWzRdID0gMDtcclxuICBtWzVdID0gMiAvIHRiO1xyXG4gIG1bNl0gPSAwO1xyXG4gIG1bN10gPSAwO1xyXG4gIG1bOF0gPSAwO1xyXG4gIG1bOV0gPSAwO1xyXG4gIG1bMTBdID0gLTIgLyBmbjtcclxuICBtWzExXSA9IDA7XHJcbiAgbVsxMl0gPSAtKGxlZnQgKyByaWdodCkgLyBybDtcclxuICBtWzEzXSA9IC0odG9wICsgYm90dG9tKSAvIHRiO1xyXG4gIG1bMTRdID0gLShmYXIgKyBuZWFyKSAvIGZuO1xyXG4gIG1bMTVdID0gMTtcclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnJnbS5mcnVzdHVtID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgem5lYXIsIHpmYXIpIHtcclxuICB2YXIgdDEgPSAyICogem5lYXI7XHJcbiAgdmFyIHQyID0gcmlnaHQgLSBsZWZ0O1xyXG4gIHZhciB0MyA9IHRvcCAtIGJvdHRvbTtcclxuICB2YXIgdDQgPSB6ZmFyIC0gem5lYXI7XHJcblxyXG4gIHZhciBtID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XHJcbiAgXHJcbiAgbVswXSA9IHQxL3QyOyBtWzRdID0gICAgIDA7IG1bIDhdID0gIChyaWdodCArIGxlZnQpIC8gdDI7IG1bMTJdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgbVsxXSA9ICAgICAwOyBtWzVdID0gdDEvdDM7IG1bIDldID0gICh0b3AgKyBib3R0b20pIC8gdDM7IG1bMTNdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgbVsyXSA9ICAgICAwOyBtWzZdID0gICAgIDA7IG1bMTBdID0gKC16ZmFyIC0gem5lYXIpIC8gdDQ7IG1bMTRdID0gKC10MSAqIHpmYXIpIC8gdDQ7XHJcbiAgbVszXSA9ICAgICAwOyBtWzddID0gICAgIDA7IG1bMTFdID0gICAgICAgICAgICAgICAgICAgLTE7IG1bMTVdID0gICAgICAgICAgICAgICAgIDA7XHJcbiAgXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbnJnbS5wZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uIChmb3Z5LCBhc3BlY3QsIHpuZWFyLCB6ZmFyKSB7XHJcbiAgdmFyIHltYXggPSB6bmVhciAqIE1hdGgudGFuKHJnbS5yYWRpYW5zKGZvdnkpKTtcclxuICB2YXIgeG1heCA9IHltYXggKiBhc3BlY3Q7XHJcbiAgcmV0dXJuIHJnbS5mcnVzdHVtKC14bWF4LCB4bWF4LCAteW1heCwgeW1heCwgem5lYXIsIHpmYXIpO1xyXG59XHJcblxyXG4vLyBOT1RFOiB0aGlzIGlzIGluZWZmaWNpZW50LCBpdCBtYXkgYmUgc2Vuc2libGUgdG8gcHJvdmlkZSBpbnBsYWNlIHZlcnNpb25zXHJcbnJnbS50cmFuc2xhdGUgPSBmdW5jdGlvbihtLCB4LCB5LCB6KSB7ICAgIFxyXG4gIHZhciByID0gcmdtLm1hdDQobSk7XHJcbiAgclsxMl0gPSBtWzBdICogeCArIG1bNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl07XHJcbiAgclsxM10gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM107XHJcbiAgclsxNF0gPSBtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XHJcbiAgclsxNV0gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV07XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnJnbS5yb3RhdGUgPSBmdW5jdGlvbiAobSwgYW5nbGUsIHgsIHksIHopIHsgIFxyXG4gIHZhciBhID0gcmdtLnJhZGlhbnMoYW5nbGUpO1xyXG4gIHZhciBjID0gTWF0aC5jb3MoYSk7XHJcbiAgdmFyIHMgPSBNYXRoLnNpbihhKTtcclxuICBcclxuICB2YXIgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG4gIHZhciBueCA9IHggLyBsO1xyXG4gIHZhciBueSA9IHkgLyBsO1xyXG4gIHZhciBueiA9IHogLyBsO1xyXG5cclxuICB2YXIgdDAgPSBueCAqICgxIC0gYyk7XHJcbiAgdmFyIHQxID0gbnkgKiAoMSAtIGMpO1xyXG4gIHZhciB0MiA9IG56ICogKDEgLSBjKTsgIFxyXG5cclxuICB2YXIgZCA9IHJnbS5tYXQ0KDEpO1xyXG4gIFxyXG4gIGRbIDBdID0gYyArIHQwICogbng7XHJcbiAgZFsgMV0gPSAwICsgdDAgKiBueSArIHMgKiBuejtcclxuICBkWyAyXSA9IDAgKyB0MCAqIG56IC0gcyAqIG55O1xyXG5cclxuICBkWyA0XSA9IDAgKyB0MSAqIG54IC0gcyAqIG56O1xyXG4gIGRbIDVdID0gYyArIHQxICogbnk7XHJcbiAgZFsgNl0gPSAwICsgdDEgKiBueiArIHMgKiBueDtcclxuXHJcbiAgZFsgOF0gPSAwICsgdDIgKiBueCArIHMgKiBueTtcclxuICBkWyA5XSA9IDAgKyB0MiAqIG55IC0gcyAqIG54O1xyXG4gIGRbMTBdID0gYyArIHQyICogbno7ICBcclxuICBcclxuICB2YXIgciA9IHJnbS5tbXVsdChtLCBkKTtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5yZ20uc2NhbGUgPSBmdW5jdGlvbihtLCB4LCB5LCB6KSB7ICAgIFxyXG4gIHZhciByID0gcmdtLm1hdDQoMSk7XHJcbiAgXHJcbiAgclsgMF0gPSBtWyAwXSAqIHg7IFxyXG4gIHJbIDFdID0gbVsgMV0gKiB4OyBcclxuICByWyAyXSA9IG1bIDJdICogeDsgXHJcbiAgclsgM10gPSBtWyAzXSAqIHg7IFxyXG4gIFxyXG4gIHJbIDRdID0gbVsgNF0gKiB5OyBcclxuICByWyA1XSA9IG1bIDVdICogeTsgXHJcbiAgclsgNl0gPSBtWyA2XSAqIHk7IFxyXG4gIHJbIDddID0gbVsgN10gKiB5OyBcclxuICBcclxuICByWyA4XSA9IG1bIDhdICogejtcclxuICByWyA5XSA9IG1bIDldICogejtcclxuICByWzEwXSA9IG1bMTBdICogejtcclxuICByWzExXSA9IG1bMTFdICogejtcclxuICBcclxuICByWzEyXSA9IG1bMTJdO1xyXG4gIHJbMTNdID0gbVsxM107XHJcbiAgclsxNF0gPSBtWzE0XTtcclxuICByWzE1XSA9IG1bMTVdO1xyXG4gIFxyXG4gIHJldHVybiByO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==