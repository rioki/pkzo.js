
pkzo.Entity = function () {
  this.transform = rgm.mat4(1);
}

pkzo.Entity.prototype.translate = function (x, y, z) {
	this.transform = rgm.translate(this.transform, x, y, z);
}

pkzo.Entity.prototype.rotate = function (angle, x, y, z) {
	this.transform = rgm.rotate(this.transform, angle, x, y, z);
}

pkzo.Entity.prototype.getXVector = function () {
	return rgm.vec3(this.transform[0], this.transform[1], this.transform[2]);
}

pkzo.Entity.prototype.getYVector = function () {
	return rgm.vec3(this.transform[4], this.transform[5], this.transform[6]);
}

pkzo.Entity.prototype.getZVector = function () {
	return rgm.vec3(this.transform[8], this.transform[9], this.transform[10]);
}

pkzo.Entity.prototype.getPosition = function () {
  return rgm.vec3(this.transform[12], this.transform[13], this.transform[14]);
}

pkzo.Entity.prototype.getWorldPosition = function () {
  if (this.parent) {
    // TODO parent rotation
    return rgm.add(this.parent.getWorldPosition(), this.getPosition());
  }
  else {
    return this.getPosition();
  }  
}

pkzo.Entity.prototype.setPosition = function (value) {
  this.transform[12] = value[0];
  this.transform[13] = value[1];
  this.transform[14] = value[2];
}

pkzo.Entity.prototype.lookAt = function (target, up) {
  var position = this.getPosition();
  var forward  = rgm.normalize(rgm.sub(target, position));
  var right    = rgm.normalize(rgm.cross(forward, up));
  var upn      = rgm.normalize(rgm.cross(right, forward));
  
  // TODO scaling
  this.transform[0] = right[0];
  this.transform[1] = right[1];
  this.transform[2] = right[2];
  
  this.transform[4] = upn[0];
  this.transform[5] = upn[1];
  this.transform[6] = upn[2];
  
  this.transform[8] = forward[0];
  this.transform[9] = forward[1];
  this.transform[10] = forward[2];
}
