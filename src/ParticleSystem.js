
pkzo.ParticleSystem = function (opts) {
  pkzo.Entity.call(this); 

  for (var a in opts) { 
    this[a] = opts[a]; 
  }
  
  this.lastSpawn = Date.now();
  this.spawnTime = (this.lifetime * 1000.0) / this.count;
  
  this.particles = [];
}

pkzo.ParticleSystem.prototype = Object.create(pkzo.Entity.prototype);
pkzo.ParticleSystem.prototype.constructor = pkzo.ParticleSystem;

pkzo.ParticleSystem.prototype.animate = function () {
  var now = Date.now();
  
  if (now > this.lastSpawn + this.spawnTime) {
    var particle = new pkzo.Particle({
      created:      now,
      texture:      this.texture,      
      color:        this.color,
      transparency: this.transparency,
      size:         this.size,
      lifetime:     this.lifetime
    });
    particle.parent = this;
    if (this.onSpawn) {
      this.onSpawn(particle);
    }
    this.particles.push(particle);
    this.lastSpawn = now;
  }
  
  var i = 0;
  while (i < this.particles.length) {
    var particle = this.particles[i];
    if (now > particle.created + (particle.lifetime * 1000.0)) {
      this.particles.splice(i, 1);
    }
    else {
      i++;
    }
  }
  
  if (this.onUpdate) {
    this.particles.forEach(function (particle) {    
      this.onUpdate(particle);
    }, this);
  }
}

pkzo.ParticleSystem.prototype.enqueue = function (renderer) {
  // TODO actuall implement animate in the renderer
  this.animate();
  
  this.particles.forEach(function (particle) {
    particle.enqueue(renderer);
  });
}
