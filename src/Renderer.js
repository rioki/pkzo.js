
pkzo.Renderer = function (canvas) {
	this.canvas = new pkzo.Canvas(canvas);
	
	var renderer = this;
	
	this.canvas.init(function (gl) {
		renderer.solidShader	 = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.SolidFrag);
		renderer.ambientShader = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.AmbientFrag);
		renderer.lightShader	 = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.LightFrag);
	});
}

pkzo.Renderer.prototype.setCamera = function (projectionMatrix, viewMatrix) {
	this.projectionMatrix = projectionMatrix;
	this.viewMatrix				= viewMatrix;
}

pkzo.Renderer.prototype.addMesh = function (transform, material, mesh) {
	this.solids.push({
		transform: transform,
		material: material, 
		mesh: mesh
	});
}

pkzo.DIRECTIONAL_LIGHT = 1;
pkzo.POINT_LIGHT			 = 2;
pkzo.SPOT_LIGHT			   = 3;

pkzo.Renderer.prototype.addDirectionalLight = function (direction, color) {
	this.lights.push({
		type: pkzo.DIRECTIONAL_LIGHT,
		direction: direction,
		color: color
	});
}

pkzo.Renderer.prototype.addPointLight = function (position, color, range) {
	this.lights.push({
		type: pkzo.POINT_LIGHT,
		position: position,
		color: color,
		range: range
	});
}

pkzo.Renderer.prototype.addSpotLight = function (position, direction, color, range, cutoff) {
	this.lights.push({
		type: pkzo.SPOT_LIGHT,
		position: position,
    direction: direction,
		color: color,
		range: range,
    cutoff: cutoff
	});
}


pkzo.Renderer.prototype.drawSolids = function (gl, shader) {
	this.solids.forEach(function (solid) {
		var norm = pkzo.multMatrix(pkzo.mat3(this.viewMatrix), pkzo.mat3(solid.transform));
				
		shader.setUniformMatrix4fv('uModelMatrix', solid.transform);
		shader.setUniformMatrix3fv('uNormalMatrix', norm);
		
		solid.material.setup(gl, shader);			
		solid.mesh.draw(gl, shader);
	});
}

pkzo.Renderer.prototype.ambientPass = function (gl, ambientLight) {
	var shader = this.ambientShader;		
	shader.bind();
	
	shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);		
	shader.setUniformMatrix4fv('uViewMatrix',				this.viewMatrix);		
	
	shader.setUniform3fv('uAmbientLight', ambientLight);		
		
	this.drawSolids(gl, shader);	
}

pkzo.Renderer.prototype.lightPass = function (gl, light) {
	var shader = this.lightShader;		
	shader.bind();
	
	shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);		
	shader.setUniformMatrix4fv('uViewMatrix',				this.viewMatrix);		
	
	shader.setUniform1i('uLightType', light.type);
	if (light.direction) {
		shader.setUniform3fv('uLightDirection', light.direction);
	}	 
	if (light.position) {
		shader.setUniform3fv('uLightPosition', light.position);
	}
	if (light.range) {
		shader.setUniform1f('uLightRange', light.range);
	}
  if (light.cutoff) {
		shader.setUniform1f('uLightCutoff', light.cutoff);
	}
	shader.setUniform3fv('uLightColor', light.color);
	
	this.drawSolids(gl, shader);	
}

pkzo.Renderer.prototype.render = function (scene) {
	var renderer = this;
	
	this.solids = [];
	this.lights = [];
	scene.enqueue(this);
	
	this.canvas.draw(function (gl) {
		
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.disable(gl.BLEND);
		
		renderer.ambientPass(gl, scene.ambientLight);
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE);
		
		renderer.lights.forEach(function (light) {
			renderer.lightPass(gl, light);
		});
	});
}
