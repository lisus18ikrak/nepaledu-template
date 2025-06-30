// Advanced Animations and Effects
class AnimationManager {
    constructor() {
        this.particles = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupParticles();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupTypingAnimation();
        this.setupParallaxEffects();
        this.setupLoadingAnimations();
    }

    setupParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.createParticle(particlesContainer);
        }

        // Animate particles
        this.animateParticles();
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-white bg-opacity-30 rounded-full';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation properties
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 10;
        
        particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
        
        container.appendChild(particle);
        this.particles.push(particle);
    }

    animateParticles() {
        this.particles.forEach(particle => {
            gsap.to(particle, {
                y: -100,
                x: Math.random() * 200 - 100,
                opacity: 0,
                duration: 10 + Math.random() * 10,
                repeat: -1,
                ease: 'none',
                delay: Math.random() * 5
            });
        });
    }

    setupScrollAnimations() {
        // Initialize GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Hero section animations
        gsap.fromTo('#home h1', 
            { y: 100, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.2
            }
        );

        gsap.fromTo('#home p', 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1,
                ease: 'power3.out',
                delay: 0.5
            }
        );

        gsap.fromTo('#home button', 
            { y: 30, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.8,
                stagger: 0.2
            }
        );

        // Stats animation
        gsap.fromTo('#home .text-3xl', 
            { scale: 0, opacity: 0 },
            { 
                scale: 1, 
                opacity: 1, 
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 1.2,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '#home .text-3xl',
                    start: 'top 80%'
                }
            }
        );

        // Floating cards animation
        gsap.utils.toArray('.floating-card').forEach((card, index) => {
            gsap.fromTo(card, 
                { y: 60, opacity: 0, rotation: 5 },
                { 
                    y: 0, 
                    opacity: 1, 
                    rotation: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'bottom 15%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Features section animation
        gsap.fromTo('.floating-card .w-16', 
            { scale: 0, rotation: -180 },
            { 
                scale: 1, 
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.floating-card',
                    start: 'top 80%',
                    stagger: 0.1
                }
            }
        );

        // Quiz section animation
        gsap.fromTo('#quizContainer', 
            { scale: 0.8, opacity: 0 },
            { 
                scale: 1, 
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#quizContainer',
                    start: 'top 80%'
                }
            }
        );
    }

    setupHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.floating-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Button hover effects
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });

        // Navigation link hover effects
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    y: -2,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    y: 0,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });
    }

    setupTypingAnimation() {
        const heroTitle = document.querySelector('#home h1');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        // Start typing animation after initial fade in
        setTimeout(typeWriter, 1200);
    }

    setupParallaxEffects() {
        // Parallax effect for hero section
        gsap.to('#particles', {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '#home',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Parallax effect for background elements
        gsap.utils.toArray('.parallax').forEach(element => {
            gsap.to(element, {
                yPercent: -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    setupLoadingAnimations() {
        // Page load animation
        gsap.fromTo('body', 
            { opacity: 0 },
            { 
                opacity: 1, 
                duration: 0.5,
                ease: 'power2.out'
            }
        );

        // Loading spinner animation
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            gsap.to(spinner.querySelector('.animate-spin'), {
                rotation: 360,
                duration: 1,
                repeat: -1,
                ease: 'none'
            });
        }
    }

    // Modal animations
    animateModalIn(modalContent) {
        gsap.fromTo(modalContent,
            { 
                scale: 0.8, 
                opacity: 0,
                y: 50
            },
            { 
                scale: 1, 
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'back.out(1.7)'
            }
        );
    }

    animateModalOut(modalContent, onComplete) {
        gsap.to(modalContent, {
            scale: 0.8,
            opacity: 0,
            y: 50,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: onComplete
        });
    }

    // Progress bar animation
    animateProgressBar(progress, duration = 1) {
        gsap.to('.progress-bar', {
            width: progress + '%',
            duration: duration,
            ease: 'power2.out'
        });
    }

    // Success animation
    animateSuccess(element) {
        gsap.timeline()
            .to(element, {
                scale: 1.1,
                duration: 0.2,
                ease: 'power2.out'
            })
            .to(element, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
    }

    // Error animation
    animateError(element) {
        gsap.timeline()
            .to(element, {
                x: -10,
                duration: 0.1,
                ease: 'power2.out'
            })
            .to(element, {
                x: 10,
                duration: 0.1,
                ease: 'power2.out'
            })
            .to(element, {
                x: 0,
                duration: 0.1,
                ease: 'power2.out'
            });
    }

    // Confetti animation
    createConfetti(x, y, color = '#fbbf24') {
        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'fixed w-2 h-2 rounded-full pointer-events-none z-50';
            confetti.style.backgroundColor = color;
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            
            document.body.appendChild(confetti);
            
            gsap.to(confetti, {
                x: x + (Math.random() - 0.5) * 200,
                y: y + Math.random() * 200,
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 2 + Math.random() * 2,
                ease: 'power2.out',
                onComplete: () => confetti.remove()
            });
        }
    }

    // Ripple effect
    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'absolute bg-white bg-opacity-30 rounded-full transform scale-0 pointer-events-none';
        
        button.appendChild(ripple);
        
        gsap.to(ripple, {
            scale: 2,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
        });
    }

    // Stagger animation for lists
    animateListItems(container, delay = 0.1) {
        const items = container.querySelectorAll('li, .list-item');
        gsap.fromTo(items,
            { 
                x: -50, 
                opacity: 0 
            },
            { 
                x: 0, 
                opacity: 1,
                duration: 0.5,
                stagger: delay,
                ease: 'power2.out'
            }
        );
    }

    // Counter animation
    animateCounter(element, target, duration = 2) {
        const start = 0;
        gsap.fromTo(element,
            { textContent: start },
            {
                textContent: target,
                duration: duration,
                ease: 'power2.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    element.textContent = Math.ceil(element.textContent);
                }
            }
        );
    }

    // Morphing animation
    morphElement(fromElement, toElement, duration = 0.5) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        
        gsap.set(toElement, {
            position: 'fixed',
            top: fromRect.top,
            left: fromRect.left,
            width: fromRect.width,
            height: fromRect.height
        });
        
        gsap.to(toElement, {
            top: toRect.top,
            left: toRect.left,
            width: toRect.width,
            height: toRect.height,
            duration: duration,
            ease: 'power2.inOut'
        });
    }

    // Page transition animation
    animatePageTransition(direction = 'right') {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black z-50';
        overlay.style.transform = direction === 'right' ? 'translateX(-100%)' : 'translateX(100%)';
        
        document.body.appendChild(overlay);
        
        gsap.to(overlay, {
            x: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to(overlay, {
                    x: direction === 'right' ? '100%' : '-100%',
                    duration: 0.3,
                    ease: 'power2.inOut',
                    delay: 0.1,
                    onComplete: () => overlay.remove()
                });
            }
        });
    }

    // Floating animation for elements
    addFloatingAnimation(element, amplitude = 10, duration = 2) {
        gsap.to(element, {
            y: amplitude,
            duration: duration,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    // Pulse animation
    addPulseAnimation(element, scale = 1.1, duration = 1) {
        gsap.to(element, {
            scale: scale,
            duration: duration,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    // Shake animation
    shakeElement(element, intensity = 10) {
        gsap.timeline()
            .to(element, { x: -intensity, duration: 0.1 })
            .to(element, { x: intensity, duration: 0.1 })
            .to(element, { x: -intensity, duration: 0.1 })
            .to(element, { x: intensity, duration: 0.1 })
            .to(element, { x: 0, duration: 0.1 });
    }

    // Fade in animation for elements
    fadeInElement(element, delay = 0) {
        gsap.fromTo(element,
            { opacity: 0, y: 20 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.6,
                delay: delay,
                ease: 'power2.out'
            }
        );
    }

    // Slide in animation
    slideInElement(element, direction = 'left', delay = 0) {
        const startX = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
        const startY = direction === 'up' ? -100 : direction === 'down' ? 100 : 0;
        
        gsap.fromTo(element,
            { 
                opacity: 0, 
                x: startX,
                y: startY
            },
            { 
                opacity: 1, 
                x: 0,
                y: 0,
                duration: 0.8,
                delay: delay,
                ease: 'power3.out'
            }
        );
    }
}

// Initialize animation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes fall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }

    @keyframes glow {
        0% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
        }
        100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
        }
    }

    @keyframes bounce-gentle {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }

    .animate-glow {
        animation: glow 2s ease-in-out infinite alternate;
    }

    .animate-bounce-gentle {
        animation: bounce-gentle 2s infinite;
    }
`;
document.head.appendChild(style); 