
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
