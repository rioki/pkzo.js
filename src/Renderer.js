
pkzo.Renderer = function (canvas) {
  this.canvas = new pkzo.Canvas(canvas);
  
  var renderer = this;
  
  this.canvas.init(function (gl) {
    renderer.sykBoxShader   = new pkzo.Shader(gl, pkzo.Inverse + pkzo.Transpose + pkzo.SkyBoxVert, pkzo.SkyBoxFrag);
    renderer.ambientShader  = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.AmbientFrag);
    renderer.lightShader    = new pkzo.Shader(gl, pkzo.SolidVert, pkzo.LightFrag);   
    renderer.particleShader = new pkzo.Shader(gl, pkzo.ParticleVert, pkzo.ParticleFrag);

    renderer.screenPlane   = pkzo.Mesh.plane(2, 2);
  });
}

pkzo.Renderer.prototype.setCamera = function (projectionMatrix, viewMatrix) {
  this.projectionMatrix = projectionMatrix;
  this.viewMatrix       = viewMatrix;
}

pkzo.Renderer.prototype.addMesh = function (transform, material, mesh) {
  this.solids.push({
    transform: transform,
    material: material, 
    mesh: mesh
  });
}

pkzo.Renderer.prototype.addSkyBox = function (cubeMap) {
  this.skyBox = cubeMap;
}

pkzo.DIRECTIONAL_LIGHT = 1;
pkzo.POINT_LIGHT       = 2;
pkzo.SPOT_LIGHT        = 3;

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

pkzo.Renderer.prototype.addParticle = function (position, size, texture, color, transparency) {
  this.particles.push({
    position:     position,
    size:         size,
    texture:      texture,
    color:        color,
    transparency: transparency
  });
}

pkzo.Renderer.prototype.drawSkyBox = function (gl) {
  if (this.skyBox) {
    var shader = this.sykBoxShader;
    
    shader.bind();
    shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
    shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);
    
    this.skyBox.bind(gl, 0);
    shader.setUniform1i('uCubemap', 0);
    
    this.screenPlane.draw(gl, shader);
  }
}

pkzo.Renderer.prototype.drawSolids = function (gl, shader) {
  this.solids.forEach(function (solid) {
    var norm = rgm.mmult(rgm.mat3(this.viewMatrix), rgm.mat3(solid.transform));
        
    shader.setUniformMatrix4fv('uModelMatrix', solid.transform);
    shader.setUniformMatrix3fv('uNormalMatrix', norm);
    
    solid.material.setup(gl, shader);     
    solid.mesh.draw(gl, shader);
  }, this);
}

pkzo.Renderer.prototype.ambientPass = function (gl, ambientLight) {
  var shader = this.ambientShader;    
  shader.bind();
  
  shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
  shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);   
  
  shader.setUniform3fv('uAmbientLight', ambientLight);    
    
  this.drawSolids(gl, shader);  
}

pkzo.Renderer.prototype.lightPass = function (gl, light) {
  var shader = this.lightShader;    
  shader.bind();
  
  shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
  shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);   
  
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

pkzo.Renderer.prototype.drawParticles = function (gl) {
  
  var shader = this.particleShader;
  shader.bind();
  shader.setUniformMatrix4fv('uProjectionMatrix', this.projectionMatrix);   
  shader.setUniformMatrix4fv('uViewMatrix',       this.viewMatrix);
  
  // size!
  this.particles.forEach(function (particle) {
    
    var modelMatrix = rgm.mat4();
    modelMatrix = rgm.translate(modelMatrix, particle.position[0], particle.position[1], particle.position[2]);
    shader.setUniformMatrix4fv('uModelMatrix', modelMatrix);
    
    // TODO material?
    shader.setUniform3fv('uColor', particle.color);
    shader.setUniform1f('uSize', particle.size * 0.5);
    shader.setUniform1f('uTransparency', particle.transparency);
    
    if (particle.texture && particle.texture.loaded) {
      shader.setUniform1i('uHasTexture', 1);
      particle.texture.bind(gl, 0)
      shader.setUniform1i('uTexture', 0);
    }
    else {
      shader.setUniform1i('uHasTexture', 0);
    }
    
    this.screenPlane.draw(gl, shader);
  }, this);
}

pkzo.Renderer.prototype.render = function (scene) {
  var renderer = this;
  
  this.solids    = [];
  this.lights    = [];
  this.skyBox    = null;
  this.particles = [];
  scene.enqueue(this);
  
  this.canvas.draw(function (gl) {
    
    gl.disable(gl.BLEND);
    gl.depthMask(false);
    gl.disable(gl.DEPTH_TEST);
    renderer.drawSkyBox(gl);
    
    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    renderer.ambientPass(gl, scene.ambientLight);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    
    renderer.lights.forEach(function (light) {
      renderer.lightPass(gl, light);
    });
    
    //gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    renderer.drawParticles(gl);
  });
}
