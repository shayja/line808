// Contact-link assembly, GA4 click events, YouTube facade, floating WhatsApp
// button and reveal fade. Without this file the page still renders, but contact
// CTAs keep their placeholder href="#" - the real WhatsApp/email links only
// exist at runtime.

document.documentElement.classList.add("js");

// Contact details are assembled at runtime, in parts, so the phone number and
// email address never appear in the static HTML that crawlers index.
(function () {
  const cc = "972",
    p1 = "50",
    p2 = "521",
    p3 = "2151";
  const msg = "Hi Line808, I'd like to talk about a booking";
  const waHref =
    "https://wa.me/" + cc + p1 + p2 + p3 + "?text=" + encodeURIComponent(msg);
  document.querySelectorAll(".wa-link").forEach((a) => {
    a.href = waHref;
  });

  const user = "dj" + "line808";
  const domain = "gmail" + ".com";
  const subject = encodeURIComponent("Booking inquiry - DJ Line808");
  document.querySelectorAll(".email-link").forEach((a) => {
    a.href = "mailto:" + user + "@" + domain + "?subject=" + subject;
  });

  // Add contact details to the JSON-LD so crawlers that render JS (Google) see
  // them, while keeping them out of the static HTML.
  const ld = document.querySelector('script[type="application/ld+json"]');
  if (ld) {
    try {
      const data = JSON.parse(ld.textContent);
      if (data["@type"] === "MusicGroup") {
        data.telephone = "+" + cc + p1 + p2 + p3;
        data.email = user + "@" + domain;
        ld.textContent = JSON.stringify(data);
      }
    } catch {
      // Malformed JSON-LD - leave it untouched.
    }
  }
})();

// GA4: report contact + listen clicks (no-op when analytics is blocked).
(function () {
  const send = (name, params) => {
    if (typeof gtag === "function") gtag("event", name, params || {});
  };
  document.querySelectorAll(".wa-link").forEach((a) => {
    a.addEventListener("click", () => send("whatsapp_click"));
  });
  document.querySelectorAll(".email-link").forEach((a) => {
    a.addEventListener("click", () => send("email_click"));
  });
  document.querySelectorAll(".nav-cta").forEach((a) => {
    a.addEventListener("click", () => send("book_now_click"));
  });
  document.querySelectorAll(".listen-link").forEach((a) => {
    a.addEventListener("click", () =>
      send("click_listen", {
        platform: a.dataset.platform,
        mix_title: a.dataset.mix,
        href: a.href,
      }),
    );
  });
})();

// YouTube facade: swap the thumbnail for the real iframe only on demand, so no
// YouTube JS loads with the page.
document.querySelectorAll(".yt-facade").forEach((box) => {
  const btn = box.querySelector(".yt-play");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube.com/embed/" + box.dataset.ytId + "?autoplay=1";
    iframe.title = "DJ Line808 - Forge TLV Sessions 001 (techno mix)";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    box.replaceChildren(iframe);
    if (typeof gtag === "function")
      gtag("event", "click_listen", {
        platform: "youtube",
        mix_title: "Forge TLV Sessions 001",
      });
  });
});

// Floating WhatsApp button - appears after scrolling past the hero.
const hero = document.querySelector(".hero");
const waFloat = document.querySelector(".wa-float");

if (hero && waFloat && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    waFloat.classList.toggle("visible", !entry.isIntersecting);
  }).observe(hero);
}

// Subtle fade-in for sections (respects prefers-reduced-motion via CSS).
const revealed = document.querySelectorAll(".reveal");

if (revealed.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  revealed.forEach((el) => io.observe(el));
} else {
  revealed.forEach((el) => el.classList.add("in"));
}

// Scroll progress bar + scroll-spy nav highlighting.
(function () {
  const bar = document.querySelector(".scroll-progress");
  if (bar) {
    let ticking = false;
    let max = 0;
    const measure = () => {
      max = document.documentElement.scrollHeight - innerHeight;
      update();
    };
    const update = () => {
      bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
      ticking = false;
    };
    measure();
    addEventListener("resize", measure, { passive: true });
    addEventListener("load", measure);
    addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }

  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = links
    .map((a) => document.querySelector(a.hash))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            links.forEach((a) =>
              a.classList.toggle("active", a.hash === "#" + e.target.id),
            );
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => spy.observe(s));
  }
})();
