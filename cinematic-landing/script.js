// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("hero-video");
    
    // Create subtle stars background
    createStars();

    // Fade in video initially
    gsap.to(video, { opacity: 1, duration: 2, ease: "power2.inOut" });

    // Ensure the video metadata is loaded before creating ScrollTrigger
    // If it's already loaded, call directly. Otherwise wait for event.
    if (video.readyState >= 1) {
        setupScrollAnimation(video);
    } else {
        video.addEventListener("loadedmetadata", () => {
            setupScrollAnimation(video);
        });
    }
});

function setupScrollAnimation(video) {
    // If video has no duration, fallback to an arbitrary 5s
    // To ensure full playback, we use video.duration
    const duration = video.duration || 5; 
    
    // Create the scrub animation timeline spanning the height of .spacer-section
    const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1, // Smooth scrubbing
            // markers: false, // Turn on for debugging
        }
    });

    // 1. Sync video time
    // We animate a proxy object and apply it to the video to avoid jank
    let videoProxy = { currentTime: 0 };
    tl.to(videoProxy, {
        currentTime: duration,
        onUpdate: () => {
            if (video.readyState >= 2) {
                // To avoid performance bottlenecks, using requestAnimationFrame here is generally handled well by GSAP's ticker, 
                // but direct assignment to video.currentTime is standard for scrubbing.
                video.currentTime = videoProxy.currentTime;
            }
        }
    }, 0);

    // 2. Fade out text in hero section
    gsap.to(".hero-section .fade-text", {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: -50,
        opacity: 0
    });

    // 5. Fade in end text
    gsap.fromTo(".end-section .fade-text", 
        { opacity: 0, y: 50 },
        {
            scrollTrigger: {
                trigger: ".end-section",
                start: "top center",
                end: "center center",
                scrub: true
            },
            opacity: 1,
            y: 0
        }
    );
}

// Generate subtle floating stars in the background
function createStars() {
    const container = document.getElementById("stars-container");
    const numStars = 60;
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        
        // Randomize size, position, and animation duration
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(star);
    }
}
