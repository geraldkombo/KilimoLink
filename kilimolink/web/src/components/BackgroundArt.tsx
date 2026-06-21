import { useRef, useEffect } from 'react';

interface BackgroundArtProps {
  seed?: number;
}

export const BackgroundArt: React.FC<BackgroundArtProps> = ({ seed = 2026 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const c2d: CanvasRenderingContext2D = ctx;
    const cvs: { width: number; height: number } = canvasEl;
    let animationId = 0;
    const particles: Particle[] = [];
    const numParticles = 80;
    let frameCount = 0;

    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      x: number;
      y: number;
      vx = 0;
      vy = 0;
      ax = 0;
      ay = 0;
      maxSpeed = 2;

      constructor() {
        this.x = Math.random() * cvs.width;
        this.y = Math.random() * cvs.height;
      }

      update() {
        this.vx += this.ax;
        this.vy += this.ay;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
          this.vx = (this.vx / speed) * this.maxSpeed;
          this.vy = (this.vy / speed) * this.maxSpeed;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.ax = 0;
        this.ay = 0;

        if (this.x > cvs.width) this.x = 0;
        if (this.x < 0) this.x = cvs.width;
        if (this.y > cvs.height) this.y = 0;
        if (this.y < 0) this.y = cvs.height;
      }

      follow(angle: number) {
        this.ax += Math.cos(angle);
        this.ay += Math.sin(angle);
      }

      draw() {
        c2d.fillStyle = 'rgba(27, 94, 32, 0.15)';
        c2d.beginPath();
        c2d.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        c2d.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const noise2D = (x: number, y: number, t: number) => {
      const n = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) * 0.5 + 0.5;
      return n;
    };

    const draw = () => {
      frameCount++;
      c2d.clearRect(0, 0, cvs.width, cvs.height);

      const scl = 30;
      const cols = Math.floor(cvs.width / scl) + 1;
      const rows = Math.floor(cvs.height / scl) + 1;

      let yoff = 0;
      for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
          const angle = noise2D(xoff, yoff, frameCount * 0.002) * Math.PI * 8;
          const idx = y * cols + x;
          if (particles[idx]) {
            particles[idx].follow(angle);
          }
          xoff += 0.5;
        }
        yoff += 0.5;
      }

      for (const p of particles) {
        p.update();
        p.draw();
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.7,
      }}
    />
  );
};
