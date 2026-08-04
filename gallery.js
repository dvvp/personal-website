(function () {
    var galleries = document.querySelectorAll('.project-gallery');

    galleries.forEach(function (gallery) {
        var slides = Array.prototype.slice.call(
            gallery.querySelectorAll('.project-gallery-slide')
        );
        if (slides.length === 0) return;

        // Activate the first slide
        slides[0].classList.add('is-active');

        // Single slide — no navigation needed
        if (slides.length === 1) return;

        var current = 0;

        // ── Inject nav buttons ──────────────────────────────────────
        var nav = document.createElement('div');
        nav.className = 'project-gallery-nav';
        nav.setAttribute('aria-hidden', 'true');

        var prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'project-gallery-btn project-gallery-prev';
        prevBtn.setAttribute('aria-label', 'Previous');
        prevBtn.innerHTML = '&#8249;';

        var nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'project-gallery-btn project-gallery-next';
        nextBtn.setAttribute('aria-label', 'Next');
        nextBtn.innerHTML = '&#8250;';

        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);
        gallery.appendChild(nav);

        // ── Inject dot indicators ───────────────────────────────────
        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'project-gallery-dots';
        dotsContainer.setAttribute('role', 'tablist');
        dotsContainer.setAttribute('aria-label', 'Gallery slides');

        var dots = slides.map(function (_, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'project-gallery-dot' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dotsContainer.appendChild(dot);
            return dot;
        });

        gallery.appendChild(dotsContainer);

        // ── Navigation logic ────────────────────────────────────────
        function goTo(index) {
            var leaving = slides[current];
            var video = leaving.querySelector('video');
            if (video) video.pause();
            leaving.classList.remove('is-active');
            dots[current].classList.remove('is-active');
            dots[current].setAttribute('aria-selected', 'false');

            current = ((index % slides.length) + slides.length) % slides.length;

            var entering = slides[current];
            entering.classList.add('is-active');
            dots[current].classList.add('is-active');
            dots[current].setAttribute('aria-selected', 'true');

            var enterVideo = entering.querySelector('video');
            if (enterVideo) enterVideo.play().catch(function () {});
        }

        prevBtn.addEventListener('click', function () { goTo(current - 1); });
        nextBtn.addEventListener('click', function () { goTo(current + 1); });

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { goTo(i); });
        });

        // Left/right arrow keys when focus is inside the gallery
        gallery.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
        });
    });
})();
