(function () {
  "use strict";

  var WA_NUMBER = "6282168061333"; // WhatsApp utama (+62 821-6806-1333)

  /* ---------- Navbar ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }
  burger.addEventListener("click", function () {
    setMenu(!menu.classList.contains("is-open"));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Menu aktif saat scroll ---------- */
  var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ("IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("is-active"); });
          var a = map[entry.target.id];
          if (a) a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---------- Lightbox galeri ---------- */
  var box = document.getElementById("lightbox");
  var boxImg = document.getElementById("lightboxImg");
  var boxCap = document.getElementById("lightboxCap");
  var thumbs = Array.prototype.slice.call(document.querySelectorAll("#gallery img"));
  var current = 0;

  function show(i) {
    current = (i + thumbs.length) % thumbs.length;
    boxImg.src = thumbs[current].src;
    boxImg.alt = thumbs[current].alt;
    boxCap.textContent = thumbs[current].alt + "  (" + (current + 1) + "/" + thumbs.length + ")";
  }
  function openBox(i) {
    show(i);
    if (typeof box.showModal === "function") box.showModal();
    else box.setAttribute("open", "");
  }
  function closeBox() {
    if (typeof box.close === "function") box.close();
    else box.removeAttribute("open");
  }

  document.getElementById("gallery").addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-index]");
    if (btn) openBox(parseInt(btn.dataset.index, 10));
  });
  box.querySelector(".lightbox__close").addEventListener("click", closeBox);
  box.querySelector(".lightbox__prev").addEventListener("click", function () { show(current - 1); });
  box.querySelector(".lightbox__next").addEventListener("click", function () { show(current + 1); });
  box.addEventListener("click", function (e) {
    if (e.target === box) closeBox(); // klik area gelap
  });
  document.addEventListener("keydown", function (e) {
    if (!box.open) return;
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* ---------- Form booking -> WhatsApp ---------- */
  var form = document.getElementById("bookingForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var nama = (d.get("nama") || "").toString().trim();
    var tanggal = d.get("tanggal");
    var tglText = "belum ditentukan";
    if (tanggal) {
      var dt = new Date(tanggal + "T00:00:00");
      tglText = dt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }

    var lines = [
      "Halo Miltar Kost, saya ingin booking kamar.",
      "",
      "Nama: " + (nama || "-"),
      "Lokasi: " + d.get("lokasi"),
      "Durasi sewa: " + d.get("durasi"),
      "Tanggal masuk: " + tglText,
      "Jumlah penghuni: " + (d.get("jumlah") || 1),
      "",
      "Mohon info ketersediaan kamar. Terima kasih."
    ];
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  /* ---------- Tahun footer ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
