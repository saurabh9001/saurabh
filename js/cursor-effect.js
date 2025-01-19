// AI-themed cursor effect
class AIParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.life = 1;
    }

    update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < 60) {
            const force = (60 - distance) / 60;
            this.speedX += (dx / distance) * force * 0.1;
            this.speedY += (dy / distance) * force * 0.1;
        }

        const maxSpeed = 1.5;
        const currentSpeed = Math.hypot(this.speedX, this.speedY);
        if (currentSpeed > maxSpeed) {
            this.speedX = (this.speedX / currentSpeed) * maxSpeed;
            this.speedY = (this.speedY / currentSpeed) * maxSpeed;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        this.life -= 0.01;
    }

    draw(ctx) {
        const opacity = this.life * 0.2;
        ctx.fillStyle = `rgba(${Math.random() < 0.5 ? '255, 46, 99' : '0, 240, 255'}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class AICursorEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.maxParticles = 15;
        this.lastTime = 0;
        this.init();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        document.body.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (this.particles.length < this.maxParticles) {
                this.particles.push(new AIParticle(this.mouseX, this.mouseY));
            }
        });

        this.animate();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.scale(dpr, dpr);
    }

    animate(currentTime) {
        if (!this.lastTime) this.lastTime = currentTime;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(particle => {
            particle.update(this.mouseX, this.mouseY);
            particle.draw(this.ctx);
            return particle.life > 0;
        });

        requestAnimationFrame((time) => this.animate(time));
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new AICursorEffect();
});
