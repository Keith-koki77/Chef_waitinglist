import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true,
    onEnter,
    onExit,
  } = options;

  const elementRef = useRef(null);
  const observerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!once || !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            
            const targets = entry.target.querySelectorAll('[data-animate]');
            
            animate({
              targets: Array.from(targets),
              opacity: [0, 1],
              translateY: [30, 0],
              translateX: (el) => {
                const dir = el.dataset.animateX || '0';
                return [dir === 'left' ? -30 : dir === 'right' ? 30 : 0, 0];
              },
              scale: (el) => el.dataset.animateScale ? [0.9, 1] : [1, 1],
              duration: 800,
              easing: 'easeOutExpo',
              delay: stagger(100, { start: 100 }),
              complete: () => {
                if (onEnter) onEnter(entry.target);
              }
            });
          }
        } else if (!once && onExit) {
          onExit(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, once, onEnter, onExit]);

  return elementRef;
}

export function useParallax(speed = 0.5) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * speed;
      
      element.style.transform = `translate3d(0, ${rate}px, 0)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return elementRef;
}

export function useScrollProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = scrollTop / docHeight;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progressRef;
}