
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

