import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const TransitionOverlay = ({ view }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline()
                .to(overlayRef.current, {
                    y: '0%',
                    duration: 0.6,
                    ease: 'expo.inOut'
                })
                .to(overlayRef.current, {
                    y: '-100%',
                    duration: 0.6,
                    ease: 'expo.inOut',
                    delay: 0.1
                })
                .set(overlayRef.current, { y: '100%' });
        });
        return () => ctx.revert();
    }, [view]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-600 z-[100] pointer-events-none transform translate-y-full"
        />
    );
};

export default TransitionOverlay;
