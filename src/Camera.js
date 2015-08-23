
pkzo.Camera = function (opt) {
  pkzo.Entity.call(this);
	
	var o = opt ? opt : {};
	
	this.yfov   = o.yfov ? o.yfov : 45.0;
	this.znear  = o.znear ? o.znear : 0.1;
	this.zfar   = o.zfar ? o.zfar : 100.0;
}

pkzo.Camera.prototype = Object.create(pkzo.Entity.prototype);
pkzo.Camera.prototype.constructor = pkzo.Camera;

pkzo.Camera.prototype.enqueue = function (renderer) {
	var aspect = renderer.canvas.gl.width / renderer.canvas.gl.height;
	
	var projectionMatrix = pkzo.perspective(this.yfov, aspect, this.znear, this.zfar);
	
	var viewMatrix   = pkzo.mat4(1);
	var normalMatrix = pkzo.mat3(1);
	
	renderer.setCamera(projectionMatrix, viewMatrix, normalMatrix);
}
