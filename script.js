(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const STORE = { rsvp: "wedding_demo_rsvp_v1", wishes: "wedding_demo_wishes_v1" };
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function readStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { showToast("Penyimpanan browser penuh atau tidak tersedia."); return false; }
  }
  function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  }

  // Nama tamu bisa diisi dengan URL: ?to=Nama%20Tamu
  const params = new URLSearchParams(location.search);
  const guest = params.get("to");
  if (guest && $("#guestName")) $("#guestName").textContent = guest.replace(/[<>]/g, "").slice(0, 100);
  if (guest && $("#rsvpName")) $("#rsvpName").value = guest.replace(/[<>]/g, "").slice(0, 100);

  const nav = $("#mainNav"), menuToggle = $("#menuToggle");
  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
  });
  $$("#mainNav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.textContent = "☰";
  }));
  $("#openInvitation")?.addEventListener("click", () => {
    $("#intro")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    document.body.classList.remove("locked");
    showToast("Selamat datang di undangan Alya & Raka");
  });

  // Musik hanya akan berjalan jika file assets/music.mp3 tersedia dan browser mengizinkan.
  const audio = $("#bgMusic"), musicToggle = $("#musicToggle"), musicIndicator = $("#musicIndicator");
  function updateMusic() {
    const playing = audio && !audio.paused;
    if (musicToggle) musicToggle.textContent = playing ? "Ⅱ" : "♫";
    if (musicIndicator) musicIndicator.innerHTML = playing ? "♫ <span>Musik diputar</span>" : "♫ <span>Musik mati</span>";
  }
  musicToggle?.addEventListener("click", async () => {
    if (!audio) return;
    try { if (audio.paused) await audio.play(); else audio.pause(); }
    catch { showToast("Tambahkan file assets/music.mp3 untuk mengaktifkan musik."); }
    updateMusic();
  });
  audio?.addEventListener("play", updateMusic); audio?.addEventListener("pause", updateMusic);

  // Countdown ke tanggal lokal Indonesia.
  const target = new Date("2026-11-22T08:00:00+07:00").getTime();
  function countdown() {
    const remaining = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => { const el = $("#" + id); if (el) el.textContent = String(value).padStart(2, "0"); });
    if (remaining === 0 && $("#countdown")) $("#countdown").setAttribute("aria-label", "Hari pernikahan telah tiba");
  }
  countdown(); setInterval(countdown, 1000);
  $("#calendarButton")?.addEventListener("click", () => {
    const event = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Undangan Alya Raka//ID","BEGIN:VEVENT",
      "UID:alya-raka-wedding-20261122@example.invalid","DTSTAMP:20260101T000000Z","DTSTART:20261122T010000Z","DTEND:20261122T070000Z",
      "SUMMARY:Pernikahan Alya & Raka","LOCATION:Cirebon, Jawa Barat","DESCRIPTION:Akad nikah dan resepsi Alya & Raka","END:VEVENT","END:VCALENDAR"].join("\r\n");
    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" }), url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pernikahan-alya-raka.ics"; a.click(); URL.revokeObjectURL(url);
    showToast("File kalender berhasil disiapkan.");
  });

  // RSVP lokal: data hanya ada di browser ini, bukan terkirim ke admin/server.
  $("#rsvpForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.currentTarget, data = Object.fromEntries(new FormData(form).entries());
    data.createdAt = new Date().toISOString();
    if (!data.name.trim() || !data.attendance) return;
    const records = readStore(STORE.rsvp);
    const existing = records.findIndex(r => r.name.toLowerCase() === data.name.trim().toLowerCase());
    if (existing >= 0) records[existing] = data; else records.unshift(data);
    if (writeStore(STORE.rsvp, records)) {
      $("#rsvpMessage").textContent = "Terima kasih! Konfirmasi tersimpan di browser ini.";
      showToast("Konfirmasi kehadiran tersimpan."); form.reset();
      if (guest && $("#rsvpName")) $("#rsvpName").value = guest;
    }
  });

  function renderWishes() {
    const list = $("#wishesList"); if (!list) return;
    const wishes = readStore(STORE.wishes);
    if (!wishes.length) { list.innerHTML = '<p class="wish-empty">Belum ada ucapan. Jadilah yang pertama mengirim doa baik ♡</p>'; return; }
    list.innerHTML = wishes.slice(0, 30).map(w => `<article class="wish-card"><h3>${safeText(w.name)}</h3><time>${new Date(w.createdAt).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}</time><p>${safeText(w.wish).replace(/\n/g, "<br>")}</p></article>`).join("");
  }
  $("#wishForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.currentTarget, data = Object.fromEntries(new FormData(form).entries());
    if (!data.name.trim() || !data.wish.trim()) return;
    const wishes = readStore(STORE.wishes);
    wishes.unshift({ name: data.name.trim(), wish: data.wish.trim(), createdAt: new Date().toISOString() });
    if (writeStore(STORE.wishes, wishes.slice(0, 200))) {
      $("#wishMessage").textContent = "Terima kasih atas doa baiknya.";
      form.reset(); renderWishes(); showToast("Ucapan berhasil ditambahkan.");
    }
  });
  renderWishes();

  $$("[data-copy]").forEach(button => button.addEventListener("click", async () => {
    const value = button.dataset.copy || "";
    try { await navigator.clipboard.writeText(value); showToast("Berhasil disalin."); }
    catch {
      const input = document.createElement("textarea"); input.value = value; document.body.appendChild(input);
      input.select(); const ok = document.execCommand("copy"); input.remove();
      showToast(ok ? "Berhasil disalin." : "Silakan salin secara manual: " + value);
    }
  }));

  const galleryDialog = $("#galleryDialog");
  $$("[data-gallery]").forEach(button => button.addEventListener("click", () => {
    const n = button.dataset.gallery, art = $("#dialogArt");
    art.className = "dialog-art gallery-" + ["", "a", "b", "c", "d", "e", "f"][Number(n)];
    $("#dialogCaption").textContent = "Momen bahagia " + n + " · Ganti ilustrasi dengan foto Anda";
    if (galleryDialog?.showModal) galleryDialog.showModal();
  }));
  $("#closeGallery")?.addEventListener("click", () => galleryDialog.close());
  galleryDialog?.addEventListener("click", e => { if (e.target === galleryDialog) galleryDialog.close(); });
})();