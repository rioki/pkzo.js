
pkzo.Renderer = function (canvas) {
  this.canvas = new pkzo.Canvas(canvas);
  
  var renderer = this;
  
  this.canvas.init(function (gl) {
    renderer.solidShader = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.SolidFrag);
  });
}

pkzo.Renderer.prototype.setCamera = function (projectionMatrix, viewMatrix, normalMatrix) {
	this.projectionMatrix = projectionMatrix;
	this.viewMatrix      = viewMatrix;
	this.normalMatrix    = normalMatrix;
}

pkzo.Renderer.prototype.addMesh = function (transform, material, mesh) {
	this.solids.push({
		transform: transform,
		material: material, 
		mesh: mesh
	});
}

pkzo.Renderer.prototype.render = function (scene) {
	var renderer = this;
	
	this.solids = [];
	scene.enqueue(this);
	
  this.canvas.draw(function (gl) {
    
		gl.enable(gl.DEPTH_TEST);
		
		var shader = renderer.solidShader;		
		shader.bind();
		
		shader.setUniformMatrix4fv('uProjectionMatrix', renderer.projectionMatrix);		
		shader.setUniformMatrix4fv('uViewMatrix',       renderer.viewMatrix);		
		shader.setUniformMatrix3fv('uNormalMatrix',     renderer.normalMatrix);		
		
		
		renderer.solids.forEach(function (solid) {
			shader.setUniformMatrix4fv('uModelMatrix', solid.transform);		
			solid.material.setup(gl, shader);			
			solid.mesh.draw(gl, shader);
		});
  });
}
