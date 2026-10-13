/* ===========================
   HERO-VIDEO.JS
   Starts the muted hero loop and wires the pause/play toggle.
   =========================== */

const heroVideo = document.querySelector('.hero__video');
const heroVideoToggle = document.querySelector('.hero__video-toggle');

/**
 * Match the toggle's label and icon to the video's play state
 */
function syncHeroVideoToggle() {
    const isPaused = heroVideo.paused;
    heroVideoToggle.setAttribute('aria-label', isPaused ? 'Play video' : 'Pause video');
    heroVideoToggle.classList.toggle('hero__video-toggle--paused', isPaused);
}

/**
 * Autoplay unless the visitor prefers reduced motion. The video uses
 * preload="none", so reduced-motion visitors only download it if they
 * press play. A rejected play() (autoplay blocked) leaves it paused on
 * the poster with the toggle showing "Play".
 */
function initHeroVideo() {
    if (!heroVideo || !heroVideoToggle) return;

    heroVideoToggle.hidden = false;
    heroVideoToggle.addEventListener('click', () => {
        if (heroVideo.paused) {
            heroVideo.play().catch(() => {});
        } else {
            heroVideo.pause();
        }
    });
    heroVideo.addEventListener('play', syncHeroVideoToggle);
    heroVideo.addEventListener('pause', syncHeroVideoToggle);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
        heroVideo.play().catch(() => {});
    }
    syncHeroVideoToggle();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideo);
} else {
    initHeroVideo();
}
