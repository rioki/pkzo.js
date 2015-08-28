
pkzo.SkyBox = function (cubeMap) {
  pkzo.Entity.call(this);
  
  this.cubeMap = cubeMap;
}

pkzo.SkyBox.prototype = Object.create(pkzo.Entity.prototype);
pkzo.SkyBox.prototype.constructor = pkzo.SkyBox;

pkzo.SkyBox.prototype.enqueue = function (renderer) {
  renderer.addSkyBox(this.cubeMap);
}

