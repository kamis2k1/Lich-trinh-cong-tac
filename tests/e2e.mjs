// Kiểm thử tự động toàn bộ tình huống nhập liệu (Playwright, trình duyệt Chrome thật)
// Chạy: npx http-server . -p 8080 -s & node tests/e2e.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:8080/";
const GEO = { // dữ liệu giả cho OpenStreetMap
  "sasebo station": { lat: 33.166, lon: 129.724, cc: "jp", ja: "佐世保駅" },
  "sasebo": { lat: 33.18, lon: 129.72, cc: "jp", ja: "佐世保市" },
  "imabari station": { lat: 34.066, lon: 132.998, cc: "jp", ja: "今治駅" },
  "hakone": { lat: 35.23, lon: 139.02, cc: "jp", ja: "箱根町" },
  "paris": { lat: 48.85, lon: 2.35, cc: "fr", ja: "パリ" },
  "sasebo eki": { lat: 33.1661, lon: 129.7241, cc: "jp", ja: "佐世保駅" },
};
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const day = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

const results = [];
let browser;

async function newPage(opt = {}) {
  const ctx = await browser.newContext({ viewport: opt.viewport || { width: 390, height: 844 }, colorScheme: opt.dark ? "dark" : "light", isMobile: !!opt.mobile, hasTouch: !!opt.mobile });
  const page = await ctx.newPage();
  page.geoCalls = 0; page.errors = [];
  page.on("pageerror", e => page.errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !/fonts|ERR_FAILED|net::/.test(m.text())) page.errors.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.route(/nominatim\.openstreetmap\.org/, async r => {
    page.geoCalls++;
    const q = decodeURIComponent(new URL(r.request().url()).searchParams.get("q") || "").toLowerCase().trim();
    if (q === "netfail") return r.abort();
    const g = GEO[q];
    await r.fulfill({ contentType: "application/json", headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(g ? [{ lat: String(g.lat), lon: String(g.lon), address: { country_code: g.cc }, namedetails: { name: g.ja, "name:ja": g.ja } }] : []) });
  });
  if (opt.noStorage) await page.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
  await page.goto(BASE);
  return page;
}

async function search(page, v) {
  const set = async (sel, val) => { if (val !== undefined) await page.fill(sel, String(val)); };
  await set("#from", v.from); await set("#to", v.to);
  if (v.d1 !== undefined) await page.$eval("#d1", (e, x) => { e.value = x; e.dispatchEvent(new Event("change")); }, v.d1);
  if (v.d2 !== undefined) await page.$eval("#d2", (e, x) => { e.value = x; }, v.d2);
  if (v.m1) await page.selectOption("#m1", v.m1);
  if (v.t1) await page.fill("#t1", v.t1);
  if (v.pax !== undefined || v.note !== undefined) await page.$eval("#more", e => e.open = true);
  if (v.pax !== undefined) await page.$eval("#pax", (e, x) => { e.value = x; }, String(v.pax));
  if (v.note !== undefined) await page.fill("#note", v.note);
  await page.click("button[type=submit]");
  await page.waitForFunction(() => !document.querySelector("button[type=submit]").disabled &&
    (document.getElementById("err").textContent.trim() && !/Đang/.test(document.getElementById("err").textContent) || !document.getElementById("out").classList.contains("hidden")), null, { timeout: 8000 });
  return {
    err: (await page.textContent("#err")).trim(),
    shown: !(await page.$eval("#out", e => e.classList.contains("hidden"))),
    plan: await page.textContent("#plan"),
    opts: await page.textContent("#opts"),
  };
}

async function test(name, fn, opt) {
  let page;
  try { page = await newPage(opt); await fn(page); if (page.errors.length) throw new Error("Lỗi JS: " + page.errors.join(" | ")); results.push([true, name]); }
  catch (e) { results.push([false, name, e.message.split("\n")[0]]); }
  finally { if (page) await page.context().close(); }
}
const ok = (c, m) => { if (!c) throw new Error(m); };
const invalid = (p, id) => p.$eval("#" + id, e => e.getAttribute("aria-invalid") === "true");
const noOverflow = p => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
const T = { from: "Tokyo", to: "Osaka", d1: day(7), d2: day(9) };

browser = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });

// 1. Bỏ trống / thiếu dữ liệu
await test("Bỏ trống tất cả → báo thiếu, đánh dấu ô lỗi", async p => {
  const r = await search(p, { from: "", to: "", d1: "", d2: "" });
  ok(/điểm đi, điểm đến, ngày đi, ngày về/.test(r.err), r.err); ok(!r.shown, "vẫn hiện kết quả");
  ok(await invalid(p, "from"), "ô điểm đi chưa đánh dấu lỗi");
  ok(await p.evaluate(() => document.activeElement.id) === "from", "chưa đưa con trỏ về ô lỗi");
});
await test("Chỉ nhập điểm đi → báo thiếu điểm đến", async p => { const r = await search(p, { ...T, to: "" }); ok(/điểm đến/.test(r.err), r.err); });
await test("Chỉ toàn dấu cách → coi như bỏ trống", async p => { const r = await search(p, { ...T, from: "    " }); ok(/điểm đi/.test(r.err), r.err); });
await test("Chỉ ký tự đặc biệt (!!!) → không hợp lệ", async p => { const r = await search(p, { ...T, from: "!!!" }); ok(/không hợp lệ/.test(r.err), r.err); });

// 2. Ngày tháng
await test("Ngày về trước ngày đi → báo lỗi", async p => { const r = await search(p, { ...T, d1: day(9), d2: day(7) }); ok(/Ngày về/.test(r.err), r.err); ok(await invalid(p, "d2"), "ô ngày về chưa đánh dấu"); });
await test("Ngày đi trong quá khứ → báo lỗi", async p => { const r = await search(p, { ...T, d1: day(-1), d2: day(2) }); ok(/đã qua/.test(r.err), r.err); });
await test("Ngày đi là hôm nay → hợp lệ", async p => { const r = await search(p, { ...T, d1: day(0), d2: day(1) }); ok(r.shown && !r.err, r.err); });
await test("Đi về trong ngày → lịch trình 1 ngày", async p => { const r = await search(p, { ...T, d2: day(7) }); ok(r.shown, r.err); ok((r.plan.match(/Ngày \d/g) || []).length === 1, r.plan.slice(0, 80)); });
await test("Chuyến dài hơn 60 ngày → báo lỗi", async p => { const r = await search(p, { ...T, d2: day(80) }); ok(/60 ngày/.test(r.err), r.err); });
await test("Ngày đi quá 1 năm → báo lỗi", async p => { const r = await search(p, { ...T, d1: day(400), d2: day(402) }); ok(/1 năm/.test(r.err), r.err); });
await test("Ngày sai định dạng → báo lỗi", async p => { await p.$eval("#d1", e => e.type = "text"); const r = await search(p, { ...T, d1: "2026-02-30" }); ok(/không hợp lệ/.test(r.err), r.err); });
await test("Đổi ngày đi sau ngày về → ngày về tự dời theo", async p => {
  await p.$eval("#d1", (e, x) => { e.value = x; e.dispatchEvent(new Event("change")); }, day(20));
  ok(await p.$eval("#d2", e => e.value) === day(20), "ngày về không tự dời");
  ok(await p.$eval("#d2", e => e.min) === day(20), "chưa chặn chọn ngày về sớm hơn");
});
await test("Số đêm và thứ trong tuần đúng", async p => {
  const r = await search(p, { ...T, d1: day(7), d2: day(10) });
  ok((r.plan.match(/Ngày \d/g) || []).length === 4, "số ngày sai");
  const d = new Date(); d.setDate(d.getDate() + 7);
  const wd = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][d.getDay()];
  ok(r.plan.includes(wd), "thứ trong tuần sai: cần " + wd);
});

// 3. Địa điểm
await test("Điểm đi trùng điểm đến (giống hệt)", async p => { const r = await search(p, { ...T, to: "Tokyo" }); ok(/trùng/.test(r.err), r.err); });
await test("Trùng khác cách viết: tokyo / Tokyo 東京", async p => { const r = await search(p, { ...T, from: "tokyo", to: "Tokyo 東京" }); ok(/trùng/.test(r.err), r.err); });
await test("Trùng khác cách viết: Hà Nội / ha noi", async p => { const r = await search(p, { ...T, from: "Hà Nội", to: "ha noi" }); ok(/trùng/.test(r.err), r.err); });
await test("Trùng khác chữ: 東京 / Tokyo", async p => { const r = await search(p, { ...T, from: "東京", to: "Tokyo" }); ok(/trùng/.test(r.err), r.err); });
await test("Trùng sau khi tra bản đồ: Sasebo station / Sasebo eki", async p => { const r = await search(p, { ...T, from: "Sasebo station", to: "Sasebo eki" }); ok(/trùng/.test(r.err), r.err); });
await test("Gõ chữ Hán 東京 → 大阪 → có Shinkansen", async p => { const r = await search(p, { ...T, from: "東京", to: "大阪" }); ok(r.shown, r.err); ok(/Shinkansen/.test(r.opts), r.opts); });
await test("Không dấu / viết tắt: hcm → ha noi → tính bằng đồng", async p => { const r = await search(p, { ...T, from: "hcm", to: "da nang" }); ok(r.shown, r.err); ok(/đ/.test(r.opts) && !/¥/.test(r.opts), r.opts); });
await test("Địa điểm ngoài danh sách (Sasebo station → Imabari station) → đi tàu, không gợi ý máy bay", async p => {
  const r = await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  ok(r.shown, r.err); ok(/Tàu JR \+ Shinkansen/.test(r.opts), r.opts); ok(!/Máy bay/.test(r.opts), "vẫn gợi ý máy bay");
});
await test("Không tìm thấy địa điểm → báo rõ, không hiện kết quả", async p => { const r = await search(p, { ...T, to: "Xyzabc" }); ok(/Không tìm thấy "Xyzabc"/.test(r.err), r.err); ok(!r.shown, "vẫn hiện kết quả"); ok(await invalid(p, "to"), "ô chưa đánh dấu"); });
await test("Mất mạng khi tra bản đồ → báo lỗi kết nối", async p => { const r = await search(p, { ...T, to: "netfail" }); ok(/kết nối/.test(r.err), r.err); ok(await p.$eval("button[type=submit]", b => !b.disabled), "nút bị khoá"); });
await test("Địa điểm ngoài Nhật/Việt (Paris) → báo chưa hỗ trợ", async p => { const r = await search(p, { ...T, to: "Paris" }); ok(/chỉ hỗ trợ/.test(r.err), r.err); });
await test("Chặng quốc tế Osaka → Hà Nội → chỉ máy bay, ẩn mục giờ tàu", async p => {
  const r = await search(p, { ...T, from: "Osaka", to: "Hà Nội" });
  ok(/Máy bay quốc tế/.test(r.opts), r.opts); ok(await p.$eval("#legCard", e => e.classList.contains("hidden")), "vẫn hiện giờ tàu Nhật");
  ok(/hộ chiếu/.test(r.plan), "thiếu nhắc hộ chiếu");
});
await test("Nhập rất dài (500 ký tự) → cắt còn 100, không vỡ giao diện", async p => {
  await p.fill("#from", "A".repeat(500)); ok((await p.$eval("#from", e => e.value.length)) <= 100, "không giới hạn độ dài");
  const r = await search(p, { ...T, from: undefined }); ok(r.err, "không báo lỗi"); ok(await noOverflow(p), "tràn ngang");
});

// 4. Bảo mật: chèn mã
await test("Chèn mã HTML/JS vào điểm đến → hiện dạng chữ, không chạy", async p => {
  const r = await search(p, { ...T, to: '<img src=x onerror="window.__x=1">' });
  ok(r.err.includes("<img"), "không hiện nguyên văn"); ok(!(await p.evaluate(() => window.__x)), "mã đã chạy!");
});
await test("Chèn mã vào ghi chú → hiện dạng chữ, không chạy", async p => {
  const r = await search(p, { ...T, note: '<img src=x onerror="window.__y=1"><b>x</b>' });
  ok(r.shown, r.err); ok(r.plan.includes("<b>x</b>"), "ghi chú bị hiểu là HTML"); ok(!(await p.evaluate(() => window.__y)), "mã đã chạy!");
});

// 5. Số người
for (const [v, good] of [["0", false], ["-1", false], ["10", false], ["2.5", false], ["", true], ["3", true]])
  await test(`Số người = "${v}" → ${good ? "hợp lệ" : "báo lỗi"}`, async p => {
    const r = await search(p, { ...T, pax: v });
    if (good) ok(r.shown && !r.err, r.err); else { ok(/1 đến 9/.test(r.err), r.err); ok(await invalid(p, "pax"), "ô chưa đánh dấu"); }
  });

// 6. Giờ đi / đến
await test("Chọn 'Đến nơi trước 13:00' → giờ đến 13:00, link Yahoo đúng ngày giờ và kiểu", async p => {
  const r = await search(p, { ...T, from: "Sasebo station", to: "Imabari station", m1: "arr", t1: "13:00" });
  ok(/đến Imabari station khoảng 13:00/.test(r.plan), r.plan.slice(0, 200));
  const href = await p.$eval("#legs .leg a", a => a.href);
  const [y, m, d] = T.d1.split("-");
  ok(href.includes(`y=${y}&m=${m}&d=${d}&hh=13&m1=0&m2=0&type=4`), href);
  ok(href.includes("shin=1") && href.includes(encodeURIComponent("佐世保駅")), href);
});
await test("Link Yahoo lượt về dùng ngày về và đảo chiều", async p => {
  await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  const href = await p.$$eval("#legs .leg", ls => ls[1].querySelector("a").href);
  const [, m, d] = T.d2.split("-");
  ok(href.includes(`from=${encodeURIComponent("今治駅")}&to=${encodeURIComponent("佐世保駅")}`) && href.includes(`&m=${m}&d=${d}&`), href);
});
await test("Đến trước 03:00 với chặng dài → ghi rõ khởi hành hôm trước", async p => { const r = await search(p, { ...T, from: "Tokyo", to: "Fukuoka", m1: "arr", t1: "03:00" }); ok(/hôm trước/.test(r.plan), r.plan.slice(0, 150)); });

// 7. Thao tác
await test("Bấm Tìm liên tục 3 lần → chỉ tra bản đồ 1 lần mỗi địa điểm", async p => {
  await p.fill("#from", "Hakone"); await p.fill("#to", "Tokyo");
  await Promise.all([p.click("button[type=submit]"), p.click("button[type=submit]", { force: true }), p.click("button[type=submit]", { force: true })]);
  await p.waitForSelector("#out:not(.hidden)"); ok(p.geoCalls === 1, "gọi " + p.geoCalls + " lần");
});
await test("Nhấn Enter ở ô điểm đến → tìm luôn", async p => { await p.fill("#from", "Tokyo"); await p.fill("#to", "Osaka"); await p.press("#to", "Enter"); await p.waitForSelector("#out:not(.hidden)", { timeout: 3000 }); });
await test("Nút ⇅ đổi chiều đi/đến", async p => { await p.fill("#from", "A1"); await p.fill("#to", "B2"); await p.click("#swap"); ok(await p.inputValue("#from") === "B2" && await p.inputValue("#to") === "A1", "chưa đổi"); });
await test("Địa điểm gần đây hiện thành nút, bấm là điền", async p => {
  await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  await p.reload(); await p.click('#toRecent .chip[data-v="Sasebo station"]'); ok(await p.inputValue("#to") === "Sasebo station", "chưa điền");
});
await test("Tra lại địa điểm cũ → dùng bộ nhớ, không gọi bản đồ lần nữa", async p => {
  await search(p, { ...T, from: "Hakone", to: "Tokyo" }); const n = p.geoCalls;
  await search(p, { ...T, from: "Hakone", to: "Osaka" }); ok(p.geoCalls === n, "gọi lại bản đồ");
});
await test("Lưu chuyến → còn sau khi tải lại → mở lại đúng → xoá được", async p => {
  await search(p, { ...T, m1: "arr", t1: "11:30" }); await p.click("#save"); await p.reload();
  ok((await p.textContent("#saved")).includes("Tokyo → Osaka"), "không thấy chuyến đã lưu");
  await p.click("#saved button[data-i='0']"); await p.waitForSelector("#out:not(.hidden)");
  ok(await p.inputValue("#t1") === "11:30" && await p.inputValue("#m1") === "arr", "không khôi phục giờ");
  await p.click("#saved button[data-del='0']"); ok((await p.textContent("#saved")).includes("Chưa có"), "chưa xoá");
});
await test("Trình duyệt chặn bộ nhớ (chế độ riêng tư) → vẫn dùng được", async p => { const r = await search(p, T); ok(r.shown, r.err); await p.click("#save"); }, { noStorage: true });
await test("Lỗi sau khi đã có kết quả → ẩn kết quả cũ", async p => { await search(p, T); const r = await search(p, { ...T, to: "Tokyo" }); ok(!r.shown, "kết quả cũ còn hiện"); });
await test("Sao chép lịch trình có giờ đi/về", async p => {
  await p.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await search(p, T); await p.click("#copy"); const t = await p.evaluate(() => navigator.clipboard.readText());
  ok(/Lượt đi: \d\d:\d\d/.test(t) && /Ngày 1/.test(t), t.slice(0, 120));
});

// 8. Giao diện & truy cập
for (const [name, opt] of [["Điện thoại 360px", { viewport: { width: 360, height: 740 }, mobile: true }], ["iPhone 390px nền tối", { viewport: { width: 390, height: 844 }, mobile: true, dark: true }], ["Máy tính bảng 768px", { viewport: { width: 768, height: 1024 } }], ["Máy tính 1366px", { viewport: { width: 1366, height: 768 } }]])
  await test(`${name}: không tràn ngang, chữ ô nhập ≥16px, nút đủ lớn`, async p => {
    ok(await noOverflow(p), "form tràn ngang");
    await search(p, { ...T, from: "Sasebo station", to: "Imabari station" }); ok(await noOverflow(p), "kết quả tràn ngang");
    const small = await p.$$eval("input,select,textarea", es => es.filter(e => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.id));
    ok(!small.length, "chữ nhỏ hơn 16px (iPhone sẽ tự phóng to): " + small);
    const tiny = await p.$$eval("button,.btns a,.list a", es => es.filter(e => e.offsetParent && e.getBoundingClientRect().height < 32).map(e => e.textContent.trim().slice(0, 20)));
    ok(!tiny.length, "nút quá nhỏ: " + tiny);
  }, opt);
await test("Mọi ô nhập đều có nhãn (đọc được bằng trình đọc màn hình)", async p => {
  const miss = await p.$$eval("input,select,textarea", es => es.filter(e => !e.labels?.length && !e.getAttribute("aria-label")).map(e => e.id));
  ok(!miss.length, "thiếu nhãn: " + miss);
});
await test("Mọi link ngoài mở tab mới an toàn và là link http(s) hợp lệ", async p => {
  await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  const bad = await p.$$eval("#out a", as => as.filter(a => a.target !== "_blank" || !/noopener/.test(a.rel) || !/^https:\/\//.test(a.href) || /undefined|NaN|null/.test(a.href)).map(a => a.href));
  ok(!bad.length, "link lỗi: " + bad.slice(0, 3));
});

// 9. Chốt giờ thật từ Yahoo
const YAHOO_TXT = "ルート1\n早楽\n08:06発→13:34着5時間28分（乗車4時間35分）\n乗換：2回\nIC優先：18,070円（乗車券12,100円　特別料金5,970円）\n08:06 発 佐世保\nＪＲ特急みどり10号\n博多\nＪＲ新幹線のぞみ20号\n福山\n高速バス・瀬戸内しまなみリーディング・しまなみライナー";
await test("Dán kết quả Yahoo → tự điền giờ 08:06/13:34, giá 18070, tên tàu", async p => {
  await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  await p.click('.leg[data-leg="go"] summary'); await p.fill('.leg[data-leg="go"] .rpaste', YAHOO_TXT);
  ok(await p.inputValue('.leg[data-leg="go"] .rdep') === "08:06", "giờ đi"); ok(await p.inputValue('.leg[data-leg="go"] .rarr') === "13:34", "giờ đến");
  ok(await p.inputValue('.leg[data-leg="go"] .rfare') === "18070", "giá"); ok(/みどり/.test(await p.inputValue('.leg[data-leg="go"] .rline')), "tên tàu");
});
await test("Lưu giờ thật → lịch trình, phần đầu trang dùng đúng giờ Yahoo, còn sau khi tải lại", async p => {
  await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  await p.click('.leg[data-leg="go"] summary'); await p.fill('.leg[data-leg="go"] .rpaste', YAHOO_TXT); await p.click('.leg[data-leg="go"] .rsave');
  await p.waitForSelector('.leg[data-leg="go"].done');
  let plan = await p.textContent("#plan"); ok(/08:06\s*khởi hành từ Sasebo station/.test(plan) && /lúc 13:34/.test(plan), plan.slice(0, 160));
  const hero = await p.textContent("#hero"); ok(/08:06/.test(hero) && /13:34/.test(hero) && /Giờ thật/.test(hero) && /18,070/.test(hero), hero);
  await p.reload(); const r = await search(p, { ...T, from: "Sasebo station", to: "Imabari station" }); ok(/lúc 13:34/.test(r.plan), "mất sau khi tải lại");
  await p.click('.leg[data-leg="go"] summary'); await p.click('.leg[data-leg="go"] .rclear'); await p.waitForSelector('.leg[data-leg="go"]:not(.done)');
  ok(!/lúc 13:34/.test(await p.textContent("#plan")), "chưa xoá giờ thật");
});
await test("Lượt về chốt giờ riêng, không ảnh hưởng lượt đi", async p => {
  await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  await p.click('.leg[data-leg="back"] summary'); await p.fill('.leg[data-leg="back"] .rdep', "15:10"); await p.fill('.leg[data-leg="back"] .rarr', "20:45"); await p.click('.leg[data-leg="back"] .rsave');
  await p.waitForSelector('.leg[data-leg="back"].done'); const plan = await p.textContent("#plan");
  ok(/15:10\s*khởi hành về.*lúc 20:45/.test(plan), plan.slice(-160)); ok(!(await p.$('.leg[data-leg="go"].done')), "lượt đi bị đánh dấu");
});
await test("Chốt giờ thiếu hoặc giá vé có chữ → báo lỗi, không lưu", async p => {
  await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  await p.click('.leg[data-leg="go"] summary'); await p.fill('.leg[data-leg="go"] .rdep', "08:06"); await p.click('.leg[data-leg="go"] .rsave');
  ok(/giờ đi và giờ đến/.test(await p.textContent('.leg[data-leg="go"] .rerr')), "không báo thiếu giờ");
  await p.fill('.leg[data-leg="go"] .rarr', "13:34"); await p.fill('.leg[data-leg="go"] .rfare', "abc"); await p.click('.leg[data-leg="go"] .rsave');
  ok(/chữ số/.test(await p.textContent('.leg[data-leg="go"] .rerr')), "không báo giá sai"); ok(!(await p.$(".leg.done")), "vẫn lưu");
});
await test("Tên tuyến chèn mã → hiện dạng chữ", async p => {
  await search(p, { ...T, from: "Sasebo station", to: "Imabari station" });
  await p.click('.leg[data-leg="go"] summary'); await p.fill('.leg[data-leg="go"] .rdep', "08:06"); await p.fill('.leg[data-leg="go"] .rarr', "13:34");
  await p.fill('.leg[data-leg="go"] .rline', '<img src=x onerror="window.__z=1">'); await p.click('.leg[data-leg="go"] .rsave'); await p.waitForSelector(".leg.done");
  ok(!(await p.evaluate(() => window.__z)), "mã đã chạy!");
});

await browser.close();
const pass = results.filter(r => r[0]).length;
for (const r of results) console.log((r[0] ? "✓ " : "✗ ") + r[1] + (r[2] ? "  → " + r[2] : ""));
console.log(`\n${pass}/${results.length} đạt`);
process.exit(pass === results.length ? 0 : 1);
