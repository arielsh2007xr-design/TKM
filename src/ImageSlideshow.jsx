import { useState, useEffect } from "react";

// Crossfading image slideshow.
// - images:          array of src strings
// - isHovered:       applies a subtle zoom on hover
// - objectPosition:  default object-position for every image
// - positions:       optional parallel array; positions[i] overrides objectPosition per image
export default function ImageSlideshow({ images, isHovered, objectPosition = "bottom", positions }) {
    const [activeImg, setActiveImg] = useState(0);
    const [loaded, setLoaded] = useState({});

    useEffect(() => {
        if (images.length < 2) return;
        const timer = setInterval(() => setActiveImg(a => (a + 1) % images.length), 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <>
            {images.map((src, i) => (
                <div key={src} style={{
                    position: "absolute", inset: 0, overflow: "hidden",
                    opacity: i === activeImg ? 1 : 0,
                    transition: "opacity 1.4s ease",
                    transform: isHovered ? "scale(1.06)" : "scale(1.0)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: "1.4s, 0.6s",
                    transitionTimingFunction: "ease, cubic-bezier(0.16, 1, 0.3, 1)",
                }}>
                    <img
                        src={src}
                        alt=""
                        onLoad={() => setLoaded(prev => ({ ...prev, [i]: true }))}
                        onError={() => setLoaded(prev => ({ ...prev, [i]: false }))}
                        style={{
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            objectPosition: positions?.[i] || objectPosition,
                            display: "block",
                        }}
                    />
                    {loaded[i] === false && (
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, #1a0a0a 0%, #2a1010 50%, #1a0a0a 100%)",
                        }} />
                    )}
                </div>
            ))}
        </>
    );
}
