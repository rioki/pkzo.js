
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
  
  var projectionMatrix = rgm.perspective(this.yfov, aspect, this.znear, this.zfar);
  
  var p = this.getPosition();
  var x = this.getXVector();
  var y = this.getYVector();
  var z = this.getZVector();
  
  var viewMatrix = rgm.mat4([x[0], x[1], x[2], 0,
                             y[0], y[1], y[2], 0,
                             z[0], z[1], z[2], 0,
                                0,    0,    0, 1]);
  viewMatrix = rgm.transpose(viewMatrix); // use inverse
  viewMatrix = rgm.translate(viewMatrix, -p[0], -p[1], -p[2]);  
  
  renderer.setCamera(projectionMatrix, viewMatrix);
}
