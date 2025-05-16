
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    // Theme-based settings
    const getThemeSettings = () => {
      switch (currentTheme) {
        case 'cyberpunk':
          return {
            particleCount: 100,
            particleColor: ['#ff00ff', '#00ffff', '#ff3380'],
            bgColor: 'rgba(24, 24, 54, 0)',
            lineColor: 'rgba(255, 0, 255, 0.2)',
            minSize: 1,
            maxSize: 3,
            speed: 0.8,
            connectDistance: 150,
            interactive: true
          };
        case 'neon':
          return {
            particleCount: 80,
            particleColor: ['#00ff66', '#00ffff', '#ff00ff'],
            bgColor: 'rgba(10, 10, 15, 0)',
            lineColor: 'rgba(0, 255, 102, 0.2)',
            minSize: 1,
            maxSize: 3,
            speed: 0.5,
            connectDistance: 120,
            interactive: true
          };
        case 'retro':
          return {
            particleCount: 70,
            particleColor: ['#ff61d8', '#5e02ff', '#00e5ff'],
            bgColor: 'rgba(30, 16, 47, 0)',
            lineColor: 'rgba(94, 2, 255, 0.2)',
            minSize: 1,
            maxSize: 3,
            speed: 0.4,
            connectDistance: 100,
            interactive: true
          };
        case 'aurora':
          return {
            particleCount: 60,
            particleColor: ['#00ffbb', '#0088ff', '#aa44ff'],
            bgColor: 'rgba(15, 22, 36, 0)',
            lineColor: 'rgba(0, 136, 255, 0.2)',
            minSize: 1,
            maxSize: 3,
            speed: 0.3,
            connectDistance: 150,
            interactive: true
          };
        case 'dark':
          return {
            particleCount: 50,
            particleColor: ['#ffffff', '#aaaaaa', '#666666'],
            bgColor: 'rgba(10, 10, 10, 0)',
            lineColor: 'rgba(255, 255, 255, 0.1)',
            minSize: 1,
            maxSize: 2,
            speed: 0.2,
            connectDistance: 120,
            interactive: true
          };
        default:
          return {
            particleCount: 40,
            particleColor: ['#333333', '#555555', '#777777'],
            bgColor: 'rgba(255, 255, 255, 0)',
            lineColor: 'rgba(0, 0, 0, 0.05)',
            minSize: 1,
            maxSize: 2,
            speed: 0.1,
            connectDistance: 100,
            interactive: false
          };
      }
    };
    
    const settings = getThemeSettings();
    
    // Create particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];
    
    for (let i = 0; i < settings.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: settings.minSize + Math.random() * (settings.maxSize - settings.minSize),
        speedX: (Math.random() - 0.5) * settings.speed,
        speedY: (Math.random() - 0.5) * settings.speed,
        color: settings.particleColor[Math.floor(Math.random() * settings.particleColor.length)]
      });
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (settings.interactive) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        
        setTimeout(() => {
          isMouseMoving = false;
        }, 500);
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Mouse interaction
        if (settings.interactive && isMouseMoving) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            const angle = Math.atan2(dy, dx);
            const pushForce = (120 - dist) / 120;
            
            particle.speedX -= Math.cos(angle) * pushForce * 0.02;
            particle.speedY -= Math.sin(angle) * pushForce * 0.02;
          }
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Connect particles with lines
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < settings.connectDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = settings.lineColor;
            ctx.lineWidth = (settings.connectDistance - dist) / settings.connectDistance;
            ctx.stroke();
          }
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [currentTheme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
