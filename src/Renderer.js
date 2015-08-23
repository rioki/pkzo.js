
pkzo.Renderer = function (canvas) {
  this.canvas = new pkzo.Canvas(canvas);
  
  var renderer = this;
  
  this.canvas.init(function (gl) {
    renderer.solidShader = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.SolidFrag);
  });
}

pkzo.Renderer.prototype.render = function (scene, camera) {
	var renderer = this;
	
  this.canvas.draw(function (gl) {
    
		var shader = renderer.solidShader;		
		shader.bind();
		
		camera.aspect = gl.width / gl.height;
		camera.update();
		shader.setUniformMatrix4fv('uProjectionMatrix', camera.projectionMatrix);		
		shader.setUniformMatrix3fv('uNormalMatrix', camera.normalMatrix);		
		
		var modelViewMatrix = pkzo.mat4(camera.viewMatrix);		
		
		if (scene.entities) {
			scene.entities.forEach(function (entity) {
				if (entity.draw) {
					entity.draw(gl, shader, modelViewMatrix);
				}				
			});
		}
		
  });
}
