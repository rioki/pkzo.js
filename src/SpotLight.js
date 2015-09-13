
pkzo.SpotLight = function () {
  pkzo.Entity.call(this);
	
	this.color  = rgm.vec3(0.5, 0.5, 0.5);
  this.range  = 10.0;
  this.cutoff = 25.0;
}

pkzo.SpotLight.prototype = Object.create(pkzo.Entity.prototype);
pkzo.SpotLight.prototype.constructor = pkzo.SpotLight;

pkzo.SpotLight.prototype.enqueue = function (renderer) {
  var dir = rgm.neg(this.getZVector());
	renderer.addSpotLight(this.getPosition(), dir, this.color, this.range, this.cutoff);
}
