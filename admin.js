(() => {
  const $ = s => document.querySelector(s);
  const RSVP_KEY = "wedding_demo_rsvp_v1", WISH_KEY = "wedding_demo_wishes_v1";
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const date = s => { try { return new Date(s).toLocaleString("id-ID"); } catch { return "-"; } };
  let allRsvp = [];
  function statusClass(s) { return s === "Hadir" ? "" : s === "Tidak hadir" ? "absent" : "pending"; }
  function renderRsvp(filter = "") {
    const body = $("#rsvpRows");
    const list = allRsvp.filter(r => [r.name,r.phone,r.attendance,r.session].join(" ").toLowerCase().includes(filter.toLowerCase()));
    if (!list.length) { body.innerHTML = '<tr><td colspan="6" class="empty-cell">Tidak ada data yang cocok. Data diambil dari browser ini saja.</td></tr>'; return; }
    body.innerHTML = list.map(r => `<tr><td><strong>${esc(r.name)}</strong><br><small>${esc(date(r.createdAt))}</small></td><td>${esc(r.phone || "-")}</td><td><span class="status-pill ${statusClass(r.attendance)}">${esc(r.attendance)}</span></td><td>${esc(r.count || "1")}</td><td>${esc(r.session || "-")}</td><td>${esc(r.message || "-")}</td></tr>`).join("");
  }
  function renderWishes() {
    const wishes = read(WISH_KEY), el = $("#adminWishes");
    el.innerHTML = wishes.length ? wishes.map(w => `<article class="admin-wish"><strong>${esc(w.name)}</strong><time>${esc(date(w.createdAt))}</time><p>${esc(w.wish).replace(/\n/g,"<br>")}</p></article>`).join("") : '<p class="empty-cell">Belum ada ucapan di browser ini.</p>';
    $("#totalWishes").textContent = wishes.length;
  }
  function refresh() {
    allRsvp = read(RSVP_KEY);
    $("#totalRsvp").textContent = allRsvp.length;
    $("#totalAttending").textContent = allRsvp.filter(r => r.attendance === "Hadir").reduce((n,r) => n + (Number(r.count) || 1), 0);
    $("#totalAbsent").textContent = allRsvp.filter(r => r.attendance === "Tidak hadir").length;
    renderRsvp($("#guestSearch").value); renderWishes();
  }
  $("#guestSearch").addEventListener("input", e => renderRsvp(e.target.value));
  $("#exportCsv").addEventListener("click", () => {
    const rows = [["Nama","WhatsApp","Status","Jumlah","Sesi","Pesan","Waktu"], ...allRsvp.map(r => [r.name,r.phone,r.attendance,r.count,r.session,r.message,r.createdAt])];
    const csv = rows.map(row => row.map(v => '"' + String(v ?? "").replace(/"/g,'""') + '"').join(",")).join("\r\n");
    download("\uFEFF" + csv, "data-rsvp.csv", "text/csv;charset=utf-8");
  });
  $("#exportData").addEventListener("click", () => download(JSON.stringify({ exportedAt:new Date().toISOString(), rsvp:read(RSVP_KEY), wishes:read(WISH_KEY) },null,2), "data-undangan.json", "application/json"));
  function download(content, name, type) {
    const blob = new Blob([content], {type}), url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $("#clearWishes").addEventListener("click", () => {
    if (!confirm("Hapus semua ucapan yang tersimpan di browser ini?")) return;
    localStorage.removeItem(WISH_KEY); refresh();
  });
  refresh();
})();