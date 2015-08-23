
pkzo.Renderer = function (canvas) {
  this.canvas = new pkzo.Canvas(canvas);
  
  var renderer = this;
  
  this.canvas.init(function (gl) {
    renderer.solidShader = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.SolidFrag);
  });
}

pkzo.Renderer.prototype.addMesh = function (transform, material, mesh) {
	this.solids.push({
		transform: transform,
		material: material, 
		mesh: mesh
	});
}

pkzo.Renderer.prototype.render = function (scene, camera) {
	var renderer = this;
	
	this.solids = [];
	scene.enqueue(this);
	
  this.canvas.draw(function (gl) {
    
		gl.enable(gl.DEPTH_TEST);
		
		var shader = renderer.solidShader;		
		shader.bind();
		
		camera.aspect = gl.width / gl.height;
		camera.update();
		shader.setUniformMatrix4fv('uProjectionMatrix', camera.projectionMatrix);		
		shader.setUniformMatrix4fv('uViewMatrix',       camera.viewMatrix);		
		shader.setUniformMatrix3fv('uNormalMatrix',     camera.normalMatrix);		
		
		
		renderer.solids.forEach(function (solid) {
			shader.setUniformMatrix4fv('uModelMatrix', solid.transform);		
			solid.material.setup(gl, shader);			
			solid.mesh.draw(gl, shader);
		});
  });
}
