
function FlyController(entity, domElement) {
  this.entity        = entity;
  this.domElement    = (domElement !== undefined) ? domElement : document;
  this.pitch         = 90.0;
  this.yaw           = 0.0;
  this.lastX         = 0.0;
  this.lastY         = 0.0;  
  this.rotate        = false;  
  this.position      = pkzo.vec3(0, 0, 10); 
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
      controller.pitch += dy;
      
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
  
  var dv  = pkzo.vec3(0, 0, 0);
  if (this.moveForward) {
    dv = pkzo.add(dv, pkzo.neg(pkzo.multVectorScalar(this.entity.getZVector(), this.speed * dt)));
  }
  if (this.moveBackwards) {
    dv = pkzo.add(dv, pkzo.multVectorScalar(this.entity.getZVector(), this.speed * dt));
  }
  if (this.moveLeft) {
    dv = pkzo.add(dv, pkzo.neg(pkzo.multVectorScalar(this.entity.getXVector(), this.speed * dt)));
  }
  if (this.moveRight) {
    dv = pkzo.add(dv, pkzo.multVectorScalar(this.entity.getXVector(), this.speed * dt));
  }
  this.position = pkzo.add(this.position, dv);
  
  var t = pkzo.mat4(1);  
  
  t = pkzo.translate(t, this.position[0], this.position[1], this.position[2]);  
  t = pkzo.rotate(t, this.pitch, 1, 0, 0);  
  t = pkzo.rotate(t, this.yaw, 0, 0, 1);
  
  
  this.entity.transform = t;
}
  
