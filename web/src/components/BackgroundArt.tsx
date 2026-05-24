import React from 'react';
import Sketch from 'react-p5';

interface BackgroundArtProps {
  seed?: number;
}

type P5Vector = {
  x: number;
  y: number;
  add: (vector: P5Vector) => void;
  limit: (max: number) => void;
  mult: (value: number) => void;
  setMag: (value: number) => void;
};

type P5Instance = {
  width: number;
  height: number;
  windowWidth: number;
  windowHeight: number;
  frameCount: number;
  TWO_PI: number;
  random: (max: number) => number;
  randomSeed: (seed: number) => void;
  noiseSeed: (seed: number) => void;
  noise: (x: number, y: number, z?: number) => number;
  createVector: (x?: number, y?: number) => P5Vector;
  createCanvas: (width: number, height: number) => { parent: (element: Element) => void };
  background: (r: number, g: number, b: number) => void;
  stroke: (r: number, g: number, b: number, a?: number) => void;
  strokeWeight: (weight: number) => void;
  point: (x: number, y: number) => void;
  resizeCanvas: (width: number, height: number) => void;
};

export const BackgroundArt: React.FC<BackgroundArtProps> = ({ seed = 2026 }) => {
  const particles: Particle[] = [];
  const numParticles = 100;

  class Particle {
    pos: P5Vector;
    vel: P5Vector;
    acc: P5Vector;
    maxSpeed: number;
    p5: P5Instance;

    constructor(p5: P5Instance) {
      this.p5 = p5;
      this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
      this.vel = p5.createVector(0, 0);
      this.acc = p5.createVector(0, 0);
      this.maxSpeed = 2;
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);

      if (this.pos.x > this.p5.width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = this.p5.width;
      if (this.pos.y > this.p5.height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = this.p5.height;
    }

    follow(vectors: P5Vector[], scl: number, cols: number) {
      const x = Math.floor(this.pos.x / scl);
      const y = Math.floor(this.pos.y / scl);
      const index = x + y * cols;
      const force = vectors[index];
      this.applyForce(force);
    }

    applyForce(force: P5Vector) {
      this.acc.add(force);
    }

    show() {
      this.p5.stroke(27, 94, 32, 20); // Deep green with low opacity
      this.p5.strokeWeight(1);
      this.p5.point(this.pos.x, this.pos.y);
    }
  }

  const setup = (p5: P5Instance, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.randomSeed(seed);
    p5.noiseSeed(seed);
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(p5));
    }
    p5.background(252, 252, 252); // Off-white
  };

  const draw = (p5: P5Instance) => {
    const scl = 20;
    const cols = Math.floor(p5.width / scl);
    const rows = Math.floor(p5.height / scl);
    const flowfield = new Array(cols * rows);

    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
        for (let x = 0; x < cols; x++) {
        const index = x + y * cols;
        const angle = p5.noise(xoff, yoff, p5.frameCount * 0.001) * p5.TWO_PI * 4;
        const v = p5.createVector(Math.cos(angle), Math.sin(angle));
        v.setMag(1);
        flowfield[index] = v;
        xoff += 0.1;
      }
      yoff += 0.1;
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield, scl, cols);
      particles[i].update();
      particles[i].show();
    }
  };

  const windowResized = (p5: P5Instance) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}>
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
};
