
pkzo.DirectionalLight = function () {
  pkzo.Entity.call(this);
	
	this.color = rgm.vec3(0.5, 0.5, 0.5);
}

pkzo.DirectionalLight.prototype = Object.create(pkzo.Entity.prototype);
pkzo.DirectionalLight.prototype.constructor = pkzo.DirectionalLight;

pkzo.DirectionalLight.prototype.enqueue = function (renderer) {
	var dir = rgm.neg(this.getZVector());
	renderer.addDirectionalLight(dir, this.color);
}
