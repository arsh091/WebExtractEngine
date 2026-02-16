import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export const animateHero = (element) => {
    gsap.fromTo(element,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
};

export const animateResults = (container) => {
    if (!container) return;
    gsap.fromTo(container.children,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: container,
                start: 'top 85%',
            }
        }
    );
};

export const parallaxScroll = (element, distance = 100) => {
    gsap.to(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        y: distance,
        ease: 'none'
    });
};

export const buttonHoverEffect = (element) => {
    if (!element) return;
    element.addEventListener('mouseenter', () => {
        gsap.to(element, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    });
    element.addEventListener('mouseleave', () => {
        gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
};

export const smoothScrollTo = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};
