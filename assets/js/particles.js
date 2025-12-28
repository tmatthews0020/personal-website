// Particle Background Animation
class Particle {
	constructor(canvas) {
		this.canvas = canvas;
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.vx = (Math.random() - 0.5) * 0.5;
		this.vy = (Math.random() - 0.5) * 0.5;
		this.radius = Math.random() * 2 + 1;
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;

		if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
		if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
		ctx.fill();
	}
}

class ParticleSystem {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		if (!this.canvas) return;

		this.ctx = this.canvas.getContext('2d');
		this.particles = [];
		this.particleCount = 80;
		this.maxDistance = 150;

		this.resize();
		this.init();
		this.animate();

		window.addEventListener('resize', () => this.resize());
	}

	resize() {
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
	}

	init() {
		this.particles = [];
		for (let i = 0; i < this.particleCount; i++) {
			this.particles.push(new Particle(this.canvas));
		}
	}

	connectParticles() {
		for (let i = 0; i < this.particles.length; i++) {
			for (let j = i + 1; j < this.particles.length; j++) {
				const dx = this.particles[i].x - this.particles[j].x;
				const dy = this.particles[i].y - this.particles[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < this.maxDistance) {
					const opacity = (1 - distance / this.maxDistance) * 0.3;
					this.ctx.beginPath();
					this.ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
					this.ctx.lineWidth = 2;
					this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
					this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
					this.ctx.stroke();
				}
			}
		}
	}

	animate() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.particles.forEach(particle => {
			particle.update();
			particle.draw(this.ctx);
		});

		this.connectParticles();

		requestAnimationFrame(() => this.animate());
	}
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	new ParticleSystem('particle-canvas');
});
