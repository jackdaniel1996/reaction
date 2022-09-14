window.onload = function WindowLoad(event) {
    // animation
    const tl = gsap.timeline({default: {ease: "power2.out"}})

    tl.to('#headline, .animationContainer', {
        x: '0vw', 
        duration: 0.5,
        stagger: 0.25
    });
}