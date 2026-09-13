/**
 * script.js — Hamid Rafique portfolio ("Signal Discipline")
 * Vanilla JS, no build step. Every feature degrades gracefully if a
 * selector is missing or a browser API is unsupported.
 */
(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var root = document.documentElement;

    /* ----------------------------------------------------------------
       0. Theme system — localStorage + OS preference, no flash
       (the blocking inline script in <head> already set the class
       before first paint; this wires up the toggle buttons)
       ---------------------------------------------------------------- */
    function applyTheme(theme) {
        if (theme === "light") {
            root.classList.add("theme-light");
        } else {
            root.classList.remove("theme-light");
        }
        try { localStorage.setItem("theme", theme); } catch (e) { /* storage unavailable */ }

        var toggle = document.getElementById("theme-toggle");
        if (toggle) {
            toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
            toggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
        }
        var mobileToggle = document.getElementById("mobile-theme-toggle");
        if (mobileToggle) {
            var label = mobileToggle.querySelector("span");
            var icon = mobileToggle.querySelector("i");
            if (label) label.textContent = theme === "light" ? "Light mode" : "Dark mode";
            if (icon) icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    }

    function currentTheme() {
        return root.classList.contains("theme-light") ? "light" : "dark";
    }

    function toggleTheme() {
        applyTheme(currentTheme() === "light" ? "dark" : "light");
    }

    document.addEventListener("DOMContentLoaded", function () {
        var toggle = document.getElementById("theme-toggle");
        var mobileToggle = document.getElementById("mobile-theme-toggle");
        if (toggle) toggle.addEventListener("click", toggleTheme);
        if (mobileToggle) mobileToggle.addEventListener("click", toggleTheme);
        // Sync label state with whatever the inline head-script already applied.
        applyTheme(currentTheme());

        /* ----------------------------------------------------------------
           1. Footer year
           ---------------------------------------------------------------- */
        var yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());

        /* ----------------------------------------------------------------
           2. Mobile nav — overlay, Escape key, scroll lock
           ---------------------------------------------------------------- */
        var mobileBtn = document.getElementById("mobile-menu-btn");
        var mobileOverlay = document.getElementById("mobile-nav-overlay");

        function closeMobileNav() {
            if (!mobileOverlay || !mobileBtn) return;
            mobileOverlay.classList.remove("active");
            mobileOverlay.setAttribute("aria-hidden", "true");
            mobileBtn.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }
        function openMobileNav() {
            if (!mobileOverlay || !mobileBtn) return;
            mobileOverlay.classList.add("active");
            mobileOverlay.setAttribute("aria-hidden", "false");
            mobileBtn.setAttribute("aria-expanded", "true");
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        }

        if (mobileBtn && mobileOverlay) {
            mobileBtn.addEventListener("click", function () {
                var isOpen = mobileOverlay.classList.contains("active");
                if (isOpen) { closeMobileNav(); } else { openMobileNav(); }
            });
            mobileOverlay.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", closeMobileNav);
            });
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape") closeMobileNav();
            });
        }

        /* ----------------------------------------------------------------
           3. Active section indicator in nav (IntersectionObserver)
           ---------------------------------------------------------------- */
        var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav .nav-link"));
        var sections = navLinks
            .map(function (link) {
                var id = link.getAttribute("href");
                return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
            })
            .filter(Boolean);

        if ("IntersectionObserver" in window && sections.length) {
            var byId = {};
            navLinks.forEach(function (link) { byId[link.getAttribute("href")] = link; });

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var link = byId["#" + entry.target.id];
                    if (!link) return;
                    if (entry.isIntersecting) {
                        navLinks.forEach(function (l) { l.classList.remove("is-active"); });
                        link.classList.add("is-active");
                    }
                });
            }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

            sections.forEach(function (s) { observer.observe(s); });
        }

        /* ----------------------------------------------------------------
           4. Header hide-on-scroll-down / show-on-scroll-up
           ---------------------------------------------------------------- */
        var header = document.getElementById("site-header");
        if (header) {
            var lastScroll = window.scrollY;
            var ticking = false;
            window.addEventListener("scroll", function () {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(function () {
                    var current = window.scrollY;
                    if (current > lastScroll && current > 160) {
                        header.classList.add("is-hidden");
                    } else {
                        header.classList.remove("is-hidden");
                    }
                    lastScroll = current;
                    ticking = false;
                });
            }, { passive: true });
        }

        /* ----------------------------------------------------------------
           5. Hero entrance — one orchestrated reveal, CSS-driven
           ---------------------------------------------------------------- */
        var hero = document.querySelector(".hero-section");
        var heroTypingContainer = document.getElementById("hero-typing-container");

        if (hero && !prefersReducedMotion) {
            requestAnimationFrame(function () {
                hero.classList.add("reveal-armed");
                
                if (heroTypingContainer) {
                    var accessibleSpan = heroTypingContainer.querySelector(".hero-title-accessible");
                    if (accessibleSpan) {
                        var t1 = "I study how systems break, ";
                        var t2 = "so I can build the ones that notice.";
                        var i1 = 0, i2 = 0;
                        function typeChar() {
                            if (i1 < t1.length) {
                                i1++;
                                accessibleSpan.textContent = t1.substring(0, i1);
                                setTimeout(typeChar, 18);
                            } else if (i2 < t2.length) {
                                i2++;
                                accessibleSpan.textContent = "";
                                accessibleSpan.appendChild(document.createTextNode(t1));
                                var lineSpan = document.createElement("span");
                                lineSpan.className = "hero-title-line";
                                lineSpan.textContent = t2.substring(0, i2);
                                accessibleSpan.appendChild(lineSpan);
                                setTimeout(typeChar, 18);
                            }
                        }
                        typeChar();
                    }
                }

                requestAnimationFrame(function () { hero.classList.add("reveal-in"); });
            });
        }

        /* ----------------------------------------------------------------
           6. Credential filters
           ---------------------------------------------------------------- */
        var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
        var credRows = Array.prototype.slice.call(document.querySelectorAll(".cred-row"));
        var emptyState = document.getElementById("credentials-empty");

        /* ----------------------------------------------------------------
           6b. Scroll-triggered section reveals
           ---------------------------------------------------------------- */
        if ("IntersectionObserver" in window && !prefersReducedMotion) {
            var scrollSections = document.querySelectorAll(".about-section, .capabilities-section, .flagship-section, .record-section, .credentials-section, .contact-section");
            
            scrollSections.forEach(function(sec) {
                sec.classList.add("scroll-armed");
            });

            var revealObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            scrollSections.forEach(function(sec) {
                revealObserver.observe(sec);
            });
        }

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (c) { c.classList.remove("is-active"); });
                chip.classList.add("is-active");
                var filter = chip.getAttribute("data-filter");
                var visibleCount = 0;
                credRows.forEach(function (row) {
                    var match = filter === "all" || row.getAttribute("data-category") === filter;
                    row.classList.toggle("is-hidden", !match);
                    if (match) visibleCount++;
                });
                if (emptyState) emptyState.hidden = visibleCount !== 0;
            });
        });

        /* ----------------------------------------------------------------
           7. Custom cursor (desktop, fine pointer only)
           ---------------------------------------------------------------- */
        var hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        var cursor = document.getElementById("custom-cursor");
        if (cursor && hasFinePointer && !prefersReducedMotion) {
            var mouseX = 0, mouseY = 0, curX = 0, curY = 0;
            var raf = null;

            window.addEventListener("mousemove", function (e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                if (!raf) raf = requestAnimationFrame(update);
            });

            function update() {
                curX += (mouseX - curX) * 0.25;
                curY += (mouseY - curY) * 0.25;
                cursor.style.transform = "translate(" + curX + "px," + curY + "px)";
                if (Math.abs(mouseX - curX) > 0.5 || Math.abs(mouseY - curY) > 0.5) {
                    raf = requestAnimationFrame(update);
                } else {
                    raf = null;
                }
            }

            document.querySelectorAll("a, button, [role='button']").forEach(function (el) {
                el.addEventListener("mouseenter", function () { cursor.classList.add("hovering"); });
                el.addEventListener("mouseleave", function () { cursor.classList.remove("hovering"); });
            });
        } else if (cursor) {
            cursor.style.display = "none";
        }

        /* ----------------------------------------------------------------
           8. Signal trace — single SVG path, redrawn on scroll (rAF-throttled)
              Conceptually: a signal settling out of noise as you move
              through the page — ties directly to the SOC/CTF "find the
              real signal" theme. Cheap: one path recompute per scroll
              tick, no canvas, no continuous animation loop.
           ---------------------------------------------------------------- */
        var tracePath = document.getElementById("signal-trace-path");
        var traceSvg = document.getElementById("signal-trace");
        if (tracePath && traceSvg && !prefersReducedMotion && window.innerWidth > 768) {
            var traceTicking = false;

            function buildTrace() {
                var docHeight = Math.max(document.body.scrollHeight, window.innerHeight);
                traceSvg.setAttribute("viewBox", "0 0 1440 " + docHeight);

                var scrollY = window.scrollY;
                var progress = scrollY / (docHeight - window.innerHeight || 1);
                var amplitude = 90 - progress * 40; // settles as you scroll further = "less noise"
                var points = [];
                var steps = 24;
                for (var i = 0; i <= steps; i++) {
                    var y = (docHeight / steps) * i;
                    var localNoise = Math.sin(i * 0.9 + progress * 6) * amplitude * (1 - progress * 0.5);
                    var x = 1440 * 0.92 + localNoise;
                    points.push(x.toFixed(1) + " " + y.toFixed(1));
                }
                tracePath.setAttribute("d", "M " + points.join(" L "));
            }

            function onScrollOrResize() {
                if (traceTicking) return;
                traceTicking = true;
                requestAnimationFrame(function () {
                    buildTrace();
                    traceTicking = false;
                });
            }

            buildTrace();
            window.addEventListener("scroll", onScrollOrResize, { passive: true });
            window.addEventListener("resize", onScrollOrResize);
        } else if (traceSvg) {
            traceSvg.style.display = "none";
        }
    });
})();
