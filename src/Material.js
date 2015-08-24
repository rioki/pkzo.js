
pkzo.Material = function (opts) {	
	if (opts.color) {
		this.color = opts.color;
	}
	else {
		this.color = pkzo.vec3(1, 1, 1);
	}	
	if (opts.texture) {
		this.texture = opts.texture;
	}	
}

pkzo.Material.prototype.setup = function (gl, shader) {
	
	shader.setUniform3fv('uColor', this.color);
	
	if (this.texture && this.texture.loaded) {
		shader.setUniform1i('uHasTexture', 1);
		this.texture.bind(gl, 0)
		shader.setUniform1i('uTexture', 0);
	}
	else {
		shader.setUniform1i('uHasTexture', 0);
	}
	
}
