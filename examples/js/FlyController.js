
function FlyController(entity, domElement) {
  this.entity        = entity;
  this.domElement    = (domElement !== undefined) ? domElement : document;
  this.pitch         = 90.0;
  this.yaw           = 0.0;
  this.lastX         = 0.0;
  this.lastY         = 0.0;  
  this.rotate        = false;  
  this.position      = rgm.vec3(0, 0, 0); 
  this.moveForward   = false;
  this.moveBackwards = false;
  this.moveLeft      = false;
  this.moveRight     = false;
  this.lastSync      = Date.now();
  this.speed         = 4.0;
  
  var controller  = this;  

  var onMouseMove = function (e) {    
    var dx = e.clientX - controller.lastX;
    var dy = e.clientY - controller.lastY;
    controller.lastX = e.clientX;
    controller.lastY = e.clientY;
    
    if (controller.rotate) {
      controller.yaw -= dx;
      controller.pitch -= dy;
      
      controller.sync();
    }
  }
  
  var onMouseDown = function (e) {
    if (e.button == 0) {
      controller.rotate = true;
    }
  }
  
  var onMouseUp = function (e) {
    if (e.button == 0) {
      controller.rotate = false;
    }
  }
  
  var onKeyDown = function (e) {   
    switch (e.keyCode) {
      case 87: // w
        controller.moveForward = true;
        break;
      case 83: // s
        controller.moveBackwards = true;
        break;
      case 65: // a
        controller.moveLeft = true;
        break;
      case 68: // d
        controller.moveRight = true;
        break;
    }
  }
  
  var onKeyUp = function (e) {
    switch (e.keyCode) {
      case 87: // w
        controller.moveForward = false;
        break;
      case 83: // s
        controller.moveBackwards = false;
        break;
      case 65: // a
        controller.moveLeft = false;
        break;
      case 68: // d
        controller.moveRight = false;
        break;
    }
  }
  
  this.domElement.addEventListener('mousemove', onMouseMove, false);
  this.domElement.addEventListener('mousedown', onMouseDown, false);
  this.domElement.addEventListener('mouseup', onMouseUp, false);
  this.domElement.addEventListener('keydown', onKeyDown, false);
  this.domElement.addEventListener('keyup', onKeyUp, false);  
  
  this.sync();
}

FlyController.prototype.sync = function () {
  
  var now = Date.now();
  var dt  = (now - this.lastSync) / 1000.0;
  this.lastSync = now;
  
  var dv  = rgm.vec3(0, 0, 0);
  if (this.moveForward) {
    dv = rgm.add(dv, rgm.neg(rgm.vsmult(this.entity.getZVector(), this.speed * dt)));
  }
  if (this.moveBackwards) {
    dv = rgm.add(dv, rgm.vsmult(this.entity.getZVector(), this.speed * dt));
  }
  if (this.moveLeft) {
    dv = rgm.add(dv, rgm.neg(rgm.vsmult(this.entity.getXVector(), this.speed * dt)));
  }
  if (this.moveRight) {
    dv = rgm.add(dv, rgm.vsmult(this.entity.getXVector(), this.speed * dt));
  }
  this.position = rgm.add(this.position, dv);
  
  var t = rgm.mat4(1);  
  
  t = rgm.translate(t, this.position[0], this.position[1], this.position[2]);  
  t = rgm.rotate(t, this.pitch, 1, 0, 0);  
  t = rgm.rotate(t, this.yaw, 0, 0, 1);
  
  
  this.entity.transform = t;
}
  
