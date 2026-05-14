// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("bg-video");
    
    // We want to make sure we have access to the video's duration
    // Once metadata is loaded, we can initiate the scroll animations
    if (video.readyState >= 1) {
        initScrollAnimations(video);
    } else {
        video.addEventListener("loadedmetadata", () => {
            initScrollAnimations(video);
        });
    }

    // Force video to load for smoother scrubbing initially
    video.load();
});

function initScrollAnimations(video) {
    // Determine the duration. Note: If the video duration is infinite or NaN, provide a fallback.
    const duration = video.duration || 10; 

    /* 
       --- 1. SCROLL-BOUND VIDEO PLAYBACK ---
       This creates the "3D animation" scroll effect.
       As the user scrolls down `.scroll-track`, the video plays forward.
       If they stop, the video stops. If they scroll up, it reverses.
    */
    
    // Create an object to tween. Tweening the actual video object directly can cause jank.
    let proxy = { currentTime: 0 };
    
    // The ScrollTrigger that spans the entire page
    ScrollTrigger.create({
        trigger: ".scroll-track",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // 1.5 seconds smoothing gives it a very fluid, cinematic feel when they stop scrolling
        animation: gsap.to(proxy, {
            currentTime: duration,
            ease: "none",
            onUpdate: () => {
                // Ensure video is ready to have time dynamically updated
                if (video.readyState >= 2) {
                    video.currentTime = proxy.currentTime;
                }
            }
        })
    });

    /* 
       --- 2. TEXT ANIMATIONS ---
       Fade and move each step block into view as it comes into the viewport
    */
    const steps = gsap.utils.toArray('.step .content-block');

    steps.forEach((step, i) => {
        // We use a timeline for each step to give it enter and exit animations
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: `.step:nth-child(${i + 1})`,
                // Trigger points based on its absolute position on scroll track
                start: "top center+=20%", 
                end: "bottom top", 
                scrub: true,
                // markers: true // uncomment to see trigger lines for debugging
            }
        });

        // Intro: fade in and move up smoothly
        tl.to(step, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        })
        // Hold for a moment to be readable (relative to scroll distance)
        .to({}, {duration: 0.5}) 
        // Outro: fade out and move up slightly
        .to(step, {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: "power2.in"
        });
    });
    
    // Specific animation for the first block (it should be visible on load)
    gsap.to(steps[0], {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5 // small delay after page load
    });
}
