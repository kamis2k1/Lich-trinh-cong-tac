// [tên, mã sân bay gần nhất, vĩ độ, kinh độ, có tàu cao tốc/Thống Nhất (1/0), quốc gia]
const C=[
["Hà Nội","HAN",21.03,105.85,1,"VN"],["TP. Hồ Chí Minh","SGN",10.78,106.70,1,"VN"],["Đà Nẵng","DAD",16.05,108.20,1,"VN"],
["Hải Phòng","HPH",20.86,106.68,1,"VN"],["Huế","HUI",16.46,107.59,1,"VN"],["Nha Trang","CXR",12.24,109.19,1,"VN"],
["Cần Thơ","VCA",10.03,105.78,0,"VN"],["Quy Nhơn","UIH",13.78,109.22,1,"VN"],["Đà Lạt","DLI",11.94,108.44,0,"VN"],
["Vinh","VII",18.68,105.68,1,"VN"],["Phú Quốc","PQC",10.22,103.96,0,"VN"],["Thanh Hóa","THD",19.81,105.78,1,"VN"],
["Buôn Ma Thuột","BMV",12.67,108.04,0,"VN"],["Pleiku","PXU",13.98,108.0,0,"VN"],["Hạ Long","VDO",20.95,107.07,0,"VN"],
["Đồng Hới","VDH",17.47,106.62,1,"VN"],["Tuy Hòa","TBB",13.09,109.30,1,"VN"],["Rạch Giá","VKG",10.01,105.08,0,"VN"],
["Cà Mau","CAH",9.18,105.15,0,"VN"],["Điện Biên Phủ","DIN",21.39,103.02,0,"VN"],["Quảng Ngãi","VCL",15.12,108.80,1,"VN"],
["Phan Thiết","",10.93,108.10,1,"VN"],["Vũng Tàu","",10.35,107.08,0,"VN"],["Biên Hòa","",10.95,106.82,1,"VN"],
["Bắc Ninh","",21.18,106.07,0,"VN"],["Nam Định","",20.42,106.17,1,"VN"],["Ninh Bình","",20.25,105.97,1,"VN"],
["Sa Pa","",22.34,103.84,0,"VN"],["Lào Cai","",22.48,103.97,1,"VN"],["Hội An","",15.88,108.33,0,"VN"],
["Bình Dương","",11.0,106.65,0,"VN"],["Long An","",10.54,106.41,0,"VN"],
["Tokyo 東京","TYO",35.68,139.77,1,"JP"],["Osaka 大阪","OSA",34.70,135.50,1,"JP"],["Nagoya 名古屋","NGO",35.17,136.88,1,"JP"],
["Kyoto 京都","OSA",35.01,135.76,1,"JP"],["Yokohama 横浜","TYO",35.47,139.62,1,"JP"],["Kobe 神戸","UKB",34.69,135.20,1,"JP"],
["Fukuoka 福岡","FUK",33.59,130.42,1,"JP"],["Sapporo 札幌","CTS",43.06,141.35,0,"JP"],["Sendai 仙台","SDJ",38.26,140.88,1,"JP"],
["Hiroshima 広島","HIJ",34.40,132.48,1,"JP"],["Okayama 岡山","OKJ",34.67,133.92,1,"JP"],["Kanazawa 金沢","KMQ",36.58,136.65,1,"JP"],
["Niigata 新潟","KIJ",37.91,139.06,1,"JP"],["Okinawa (Naha) 那覇","OKA",26.21,127.68,0,"JP"],["Kagoshima 鹿児島","KOJ",31.58,130.54,1,"JP"],
["Kumamoto 熊本","KMJ",32.79,130.69,1,"JP"],["Shizuoka 静岡","FSZ",34.97,138.39,1,"JP"],["Nagano 長野","",36.64,138.19,1,"JP"],
["Matsuyama 松山","MYJ",33.84,132.75,0,"JP"],["Takamatsu 高松","TAK",34.35,134.05,0,"JP"],["Aomori 青森","AOJ",40.83,140.73,1,"JP"],
["Morioka 盛岡","HNA",39.70,141.14,1,"JP"],["Utsunomiya 宇都宮","",36.56,139.90,1,"JP"],["Chiba 千葉","TYO",35.61,140.12,0,"JP"],
["Saitama 埼玉","TYO",35.86,139.65,1,"JP"],["Nagasaki 長崎","NGS",32.75,129.87,1,"JP"],["Hakodate 函館","HKD",41.77,140.73,1,"JP"]
];
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z0-9]/g,"");
const alias={hcm:"TP. Hồ Chí Minh",tphcm:"TP. Hồ Chí Minh",saigon:"TP. Hồ Chí Minh",hochiminh:"TP. Hồ Chí Minh",sg:"TP. Hồ Chí Minh",hn:"Hà Nội",hanoi:"Hà Nội",dn:"Đà Nẵng",
  naha:"Okinawa (Naha) 那覇",okinawa:"Okinawa (Naha) 那覇",tokio:"Tokyo 東京",osaca:"Osaka 大阪"};
function find(q){q=q.trim();const n=norm(q);const a=alias[n]||alias[n.replace(/^(tp|thanhpho)/,"")];
  return C.find(c=>(n&&(norm(c[0])===n||norm(c[0].split(" ")[0])===n||c[1].toLowerCase()===n))||(a&&c[0]===a))
    ||C.find(c=>/[^\x00-\u024f]/.test(q)&&c[0].includes(q))
    ||C.find(c=>n.length>2&&norm(c[0]).includes(n))}


const $=id=>document.getElementById(id);
// Ngày theo giờ địa phương (không dùng UTC để tránh lệch ngày ở Nhật trước 9h sáng)
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const addDays=(s,n)=>{const [y,m,d]=s.split("-").map(Number);return iso(new Date(y,m-1,d+n))};
const todayStr=()=>iso(new Date());
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&addDays(s,0)===s;
const dayDiff=(a,b)=>{const [y1,m1,d1]=a.split("-").map(Number),[y2,m2,d2]=b.split("-").map(Number);return Math.round((Date.UTC(y2,m2-1,d2)-Date.UTC(y1,m1-1,d1))/864e5)};
$("d1").value=addDays(todayStr(),7);$("d2").value=addDays(todayStr(),10);
const isOW=()=>!!(document.querySelector('input[name=trip][value=ow]')||{}).checked;
const setTrip=ow=>{const r=document.querySelector(`input[name=trip][value=${ow?"ow":"rt"}]`);if(r)r.checked=true;$("f").classList.toggle("ow",!!ow)};
document.addEventListener("change",e=>{if(e.target.name==="trip"){setTrip(e.target.value==="ow");setErr("")}});
$("d1").min=todayStr();$("d2").min=$("d1").value;
$("d1").addEventListener("change",()=>{const v=$("d1").value;if(validDate(v)){$("d2").min=v;if($("d2").value&&$("d2").value<v)$("d2").value=v}});

function km(a,b){const R=6371,r=Math.PI/180,dl=(b[2]-a[2])*r,dg=(b[3]-a[3])*r;
  const h=Math.sin(dl/2)**2+Math.cos(a[2]*r)*Math.cos(b[2]*r)*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
const fmtH=h=>{const t=Math.round(h*60/5)*5,H=Math.floor(t/60),M=t%60;return (H?H+" giờ ":"")+(M?M+" phút":"")||"dưới 15 phút"};
const JPY2VND=170; // tỉ giá ước tính
let CUR="VND";
const money=(n,ccy)=>{ // n tính theo ccy gốc, hiển thị theo CUR
  let v=n; if(ccy!==CUR) v=ccy==="JPY"?n*JPY2VND:n/JPY2VND;
  return CUR==="JPY"?"¥"+(Math.round(v/100)*100).toLocaleString("ja-JP"):(Math.round(v/10000)*10000).toLocaleString("vi-VN")+"đ"};
const dmy=s=>s.split("-").reverse().join("/");
const wd=["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"];
const jaName=(c,txt)=>{ // tên tiếng Nhật cho trang tra tàu Nhật
  if(!c)return txt;let n=c.geo?c.ja:(c[0].match(/[\u3040-\u30ff\u4e00-\u9fff]+$/)||[""])[0];
  if(!n||/[a-z]/i.test(n))return txt;if(!/station|駅|\bga\b/i.test(txt))n=n.replace(/(市|町|村)$/,"");if(/station|駅|\bga\b/i.test(txt)&&!/駅$/.test(n))n+="駅";return n};
const toMin=t=>{const [h,m]=(t||"08:00").split(":").map(Number);return h*60+m};
const hhmm=m=>{const d=Math.floor(m/1440),r=((m%1440)+1440)%1440;return String(Math.floor(r/60)).padStart(2,"0")+":"+String(r%60).padStart(2,"0")+(d>0?" (hôm sau)":d<0?" (hôm trước)":"")};
function legTimes(mode,t,hours){const m=toMin(t),L=Math.round((hours||0)*12)*5;return mode==="arr"?{dep:hhmm(m-L),arr:hhmm(m)}:{dep:hhmm(m),arr:hhmm(m+L)}}
function routeLinks(from,to,fromJa,toJa,date,mode,t,legH){
  const e=encodeURIComponent,[y,mo,d]=date.split("-"),[h,mi]=(t||"08:00").split(":");
  // Google Maps chỉ nhận giờ khởi hành: nếu chọn "đến trước", lùi giờ theo thời gian đi ước tính
  let gm=toMin(t);if(mode==="arr")gm=((gm-Math.round((legH||0)*12)*5-30)%1440+1440)%1440;
  const H=Math.floor(gm/60),ap=H>=12?"pm":"am",h12=(H%12)||12,gmi=String(gm%60).padStart(2,"0");
  return [
    ["★ Yahoo!乗換案内 (giờ tàu chính xác)",`https://transit.yahoo.co.jp/search/result?from=${e(fromJa)}&to=${e(toJa)}&y=${y}&m=${mo}&d=${d}&hh=${h}&m1=${mi[0]}&m2=${mi[1]}&type=${mode==="arr"?4:1}&ticket=ic&expkind=1&ws=3&s=0&al=1&shin=1&ex=1&hb=1&lb=1&sr=1`],
    // App Google Maps trên điện thoại chỉ nhận link api=1 (không có giờ); máy tính dùng link có giờ
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      ?["Google Maps (chỉnh giờ trong app)",`https://www.google.com/maps/dir/?api=1&origin=${e(from)}&destination=${e(to)}&travelmode=transit`]
      :["Google Maps",`https://www.google.com/maps/dir/?saddr=${e(from)}&daddr=${e(to)}&dirflg=r&ttype=dep&date=${mo}%2F${d}%2F${y.slice(2)}&time=${h12}%3A${gmi}${ap}`]
  ]}
const short=c=>c?(c.geo?c[0]:c[0].split(" ")[0]):"";
// Tra địa điểm bất kỳ qua OpenStreetMap, gán sân bay/tàu theo thành phố lớn gần nhất
const MEM={};const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch{return k in MEM?MEM[k]:null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{MEM[k]=v}}};
// Địa điểm đã nhập gần đây
function recentPlaces(){return store.get("places")||[]}
function addPlaces(...ps){let r=recentPlaces();for(const p of ps){if(!p)continue;r=r.filter(x=>x.toLowerCase()!==p.toLowerCase());r.unshift(p)}store.set("places",r.slice(0,12));renderPlaces()}
function renderPlaces(){
  const r=recentPlaces();
  document.getElementById("cities").innerHTML=[...r,...C.map(c=>c[0]).filter(n=>!r.includes(n))].map(n=>`<option value="${esc(n)}">`).join("");
  for(const id of ["from","to"]){const box=document.getElementById(id+"Recent");if(!box)continue;
    box.innerHTML=r.length?r.slice(0,6).map(p=>`<button type="button" class="chip" data-f="${id}" data-v="${esc(p)}">${esc(p)}</button>`).join(""):""}
}
document.addEventListener("click",e=>{const b=e.target.closest(".chip");if(b){document.getElementById(b.dataset.f).value=b.dataset.v}
  if(e.target.id==="swap"){const f=document.getElementById("from"),t=document.getElementById("to");[f.value,t.value]=[t.value,f.value]}});
async function geocode(q){
  try{
    const key="geo:"+q.trim().toLowerCase();let g=store.get(key);
    if(!g){
      let r;try{r=await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&namedetails=1&accept-language=vi&q="+encodeURIComponent(q));}catch(e){throw new Error("net")}
      if(!r.ok)throw new Error("net");
      const j=await r.json();if(!j.length)return null;const x=j[0];
      g={lat:+x.lat,lon:+x.lon,cc:((x.address&&x.address.country_code)||"").toUpperCase(),ja:(x.namedetails&&(x.namedetails["name:ja"]||x.namedetails.name))||""};
      store.set(key,g);
    }
    const cc=g.cc,c=[q,"",g.lat,g.lon,0,cc];c.geo=true;c.acc=0;c.ja=g.ja;
    const near=C.filter(x=>x[5]===cc).map(x=>[x,km(c,x)]).sort((a,b)=>a[1]-b[1]);
    const ap=near.find(([x])=>x[1]);
    if(ap&&ap[1]<120){c[1]=ap[0][1];c.acc=ap[1]*1.3/45;c.apName=short(ap[0]);c.apKm=ap[1]}
    const rail=near.find(([x])=>x[4]);if(rail&&rail[1]<25)c[4]=1;
    return c;
  }catch(e){if(e.message==="net")throw e;return null}
}

let cur=null;
$("f").addEventListener("submit",e=>{e.preventDefault();build()});
const FIELDS=["from","to","d1","d2","t1","t2","pax"];
function setErr(msg,ids=[]){
  $("err").textContent=msg;
  for(const id of FIELDS)$(id).removeAttribute("aria-invalid");
  for(const id of ids)$(id).setAttribute("aria-invalid","true");
  if(msg){$("out").classList.add("hidden");$("st1").className="on";$("st2").className=$("st3").className="";if(ids[0]&&$(ids[0]).focus)$(ids[0]).focus({preventScroll:true});$("err").scrollIntoView&&$("err").scrollIntoView({block:"center",behavior:"smooth"})}
}
const clean=s=>s.replace(/[\u0000-\u001f\u007f]/g,"").replace(/\s+/g," ").trim().slice(0,100);
let busy=false;
document.addEventListener("click",e=>{if(e.target.id==="editTrip"){$("f").classList.remove("compact");$("from").focus()}});
// ===== NAVITIME (RapidAPI, gói Basic miễn phí) =====
const navKey=()=>{try{return localStorage.getItem("navKey")||""}catch{return MEM.navKey||""}};
function setNavKey(v){try{v?localStorage.setItem("navKey",v):localStorage.removeItem("navKey")}catch{v?MEM.navKey=v:delete MEM.navKey}renderNav()}
function renderNav(){const k=navKey();$("navState").innerHTML=k?'<span class="okb">Đã kết nối</span> Bấm "Tìm chuyến NAVITIME" trong mục Giờ tàu thật để xem các chuyến.':"Chưa kết nối. Khi kết nối, web tự tìm các chuyến tàu (tuyến, chỗ đổi tàu, giá vé) ngay trong trang.";$("navKey").value=k?"••••••••"+k.slice(-4):""}
const MOVE={superexpress_train:"🚄",ultraexpress_train:"🚆",sleeper_ultraexpress:"🚆",express_train:"🚆",rapid_train:"🚃",local_train:"🚃",semiexpress_train:"🚃",domestic_flight:"✈️",shuttle_bus:"🚌",highway_bus:"🚌",local_bus:"🚌",ferry:"⛴️",walk:"🚶"};
const tHM=s=>(s||"").slice(11,16);
function navRoutes(j){
  return (j.items||[]).map(it=>{const mv=(it.summary&&it.summary.move)||{},f=mv.fare||{},rf=mv.reference_fare||{};
    const secs=(it.sections||[]).filter(x=>x.type==="move"&&x.move!=="walk");
    return {dep:tHM(mv.from_time),arr:tHM(mv.to_time),time:mv.time||0,tr:mv.transit_count||0,
      fare:rf.lowest_total_ic||rf.lowest_total_ticket||f.unit_48||f.unit_0||0,
      parts:secs.map(x=>({ic:MOVE[x.move]||"🚃",name:(x.transport&&(x.transport.self_name||x.transport.name))||x.line_name||"",from:tHM(x.from_time),to:tHM(x.to_time)}))}}).filter(r=>r.dep&&r.arr);
}
async function navSearch(q){
  const key="nav:"+JSON.stringify(q),hit=store.get(key);if(hit)return hit;
  const p=new URLSearchParams({start:q.s.join(","),goal:q.g.join(","),limit:"5",datum:"wgs84",coord_unit:"degree",lang:"ja"});
  p.set(q.mode==="arr"?"goal_time":"start_time",`${q.date}T${q.tm}:00`);
  let r;try{r=await fetch("https://navitime-route-totalnavi.p.rapidapi.com/route_transit?"+p,{headers:{"X-RapidAPI-Key":navKey(),"X-RapidAPI-Host":"navitime-route-totalnavi.p.rapidapi.com"}})}catch(e){throw new Error("Không kết nối được NAVITIME. Kiểm tra mạng rồi thử lại.")}
  if(r.status===401||r.status===403)throw new Error("Mã RapidAPI không đúng hoặc chưa đăng ký gói Basic của NAVITIME.");
  if(r.status===429)throw new Error("Đã hết lượt tra NAVITIME (500 lượt/tháng) hoặc tra quá nhanh. Thử lại sau.");
  if(!r.ok)throw new Error("NAVITIME báo lỗi ("+r.status+"). Thử lại sau.");
  const rs=navRoutes(await r.json());store.set(key,rs);return rs;
}
document.addEventListener("click",async e=>{
  const b=e.target.closest(".navbtn");if(b){
    const box=b.closest(".leg"),out=box.querySelector(".nres"),q=JSON.parse(b.dataset.q);
    b.disabled=true;const tx=b.textContent;b.textContent="Đang tìm chuyến…";out.innerHTML="";
    try{const rs=await navSearch(q);
      out.innerHTML=rs.length?rs.map((r,i)=>`<div class="nr"><div class="tt">${esc(r.dep)} → ${esc(r.arr)} <span class="muted">· ${fmtH(r.time/60)} · đổi ${r.tr} lần${r.fare?` · ¥${Number(r.fare).toLocaleString("ja-JP")}`:""}</span></div><div class="ln">${r.parts.map(x=>`${x.ic} ${esc(x.name)}${x.from?` ${esc(x.from)}`:""}`).join(" → ")}</div><button type="button" class="primary npick" data-i="${i}">Chọn chuyến này</button></div>`).join("")+`<p class="note">Giờ NAVITIME (bản miễn phí) tính theo thời gian chạy trung bình, có thể lệch vài phút. Chưa có xe buýt cao tốc. Đối chiếu Yahoo rồi chốt giờ thật nếu cần.</p>`
        :'<p class="muted">NAVITIME không tìm thấy chuyến phù hợp.</p>';
      out._rs=rs;
    }catch(err){out.innerHTML=`<div class="err" role="alert">${esc(err.message)}</div>`}
    finally{b.disabled=false;b.textContent=tx}
    return}
  const pk=e.target.closest(".npick");if(pk&&cur){
    const box=pk.closest(".leg"),r=box.querySelector(".nres")._rs[+pk.dataset.i],data=store.get(realKey(cur))||{};
    data[box.dataset.leg]={dep:r.dep,arr:r.arr,fare:r.fare||0,line:r.parts.map(x=>x.name).filter(Boolean).slice(0,4).join("→").slice(0,80),src:"navitime"};
    store.set(realKey(cur),data);await build();return}
  if(e.target.id==="navSave"){const v=$("navKey").value.trim();
    if(v.startsWith("••"))return;
    if(!/^[A-Za-z0-9_-]{20,80}$/.test(v)){$("navErr").textContent="Mã không đúng định dạng (chỉ gồm chữ và số, khoảng 50 ký tự).";return}
    $("navErr").textContent="";setNavKey(v);$("navSetup").open=false;if(cur)build()}
  if(e.target.id==="navDel"){setNavKey("");$("navErr").textContent="";if(cur)build()}
});
const realKey=c=>`real:${c.fromT.toLowerCase()}|${c.toT.toLowerCase()}|${c.d1}|${c.ow?"ow":c.d2}`;
function parseYahoo(t){
  t=(t||"").replace(/[０-９：，]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0));
  const m=t.match(/(\d{1,2}:\d{2})\s*発?\s*[→～~\-－]+\s*(\d{1,2}:\d{2})/)||t.match(/(\d{1,2}:\d{2})[\s\S]*?(\d{1,2}:\d{2})/);
  const f=t.match(/(?:IC優先|きっぷ優先|現金優先)?[：:\s]*([\d,]{3,9})\s*円/);
  const pad=x=>x.padStart(5,"0");
  const names=[...t.matchAll(/(?:ＪＲ|JR)[^\s]+|(?:特急|新幹線|快速|高速バス|空港バス)[^\s]*/g)].map(x=>{let v=x[0].replace(/^(ＪＲ|JR)/,"");if(/バス/.test(v)&&v.includes("・"))v=v.split("・").pop();return v.replace(/^新幹線/,"")}).filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,4);
  return {dep:m?pad(m[1]):"",arr:m?pad(m[2]):"",fare:f?f[1].replace(/,/g,""):"",line:names.join("→"),segs:parseSegments(t)};
}
// Đọc từng chặng (tàu/xe, ga lên–xuống, giờ, sân ga, giá) từ chữ copy của 1 tuyến Yahoo
function parseSegments(t){
  t=(t||"").replace(/[０-９Ａ-Ｚａ-ｚ：，（）［］]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0));
  const L=t.split("\n").map(s=>s.replace(/\t/g," ").replace(/\s+/g," ").trim()).filter(Boolean);
  const st=s=>s.replace(/(?:時刻表|出口|地図|\s)+$/,"").slice(0,40),pad=x=>x.padStart(5,"0");
  const T=/^(\d{1,2}:\d{2})$/,SKIP=/^(その他|きっぷ購入|PR|ルート保存|定期券|ルート共有|印刷する|乗車位置|IC優先|現金優先|きっぷ優先|乗換|早|楽|安)/;
  let i=L.findIndex((s,k)=>(T.test(s)&&/^発 /.test(L[k+1]||""))||/^\d{1,2}:\d{2} 発 \S/.test(s));
  if(i<0)return[];
  const segs=[];let cur=null;
  const node=(arr,dep,name)=>{name=st(name);if(cur){cur.arr=arr||cur.arr;cur.to=name;segs.push(cur);cur=null}if(dep)cur={dep,from:name,line:"",dest:"",pf:"",pt:"",stops:0,fares:[],note:""}};
  for(;i<L.length&&segs.length<12;i++){const s=L[i];let m;
    if(T.test(s)&&(m=(L[i+1]||"").match(/^(発|着) (.+)/))){const tm=pad(s);m[1]==="発"?node("",tm,m[2]):node(tm,"",m[2]);i++;if(m[1]==="着")break;continue}
    if((m=s.match(/^(\d{1,2}:\d{2}) (発|着) (.+)/))){const tm=pad(m[1]);m[2]==="発"?node("",tm,m[3]):node(tm,"",m[3]);if(m[2]==="着")break;continue}
    if((m=s.match(/^(\d{1,2}:\d{2})着$/))&&(L[i+1]||"").match(/^(\d{1,2}:\d{2})発$/)&&L[i+2]){node(pad(m[1]),pad(L[i+1].slice(0,-1)),L[i+2]);i+=2;continue}
    if(!cur||SKIP.test(s))continue;
    if(!cur.line){cur.line=s.slice(0,60);continue}
    if((m=s.match(/^\[発\]\s*(.*?)\s*→\s*\[着\]\s*(.*)$/))){const f=x=>/情報なし/.test(x)?"":x.slice(0,20);cur.pf=f(m[1]);cur.pt=f(m[2]);continue}
    if((m=s.match(/^(\d{1,3})駅$/))){cur.stops=+m[1];continue}
    if((m=s.match(/^(?:(自由席|指定席|グリーン|特急券|座席)[^：:]*[：:])?\s*([\d,]{3,9})円$/))){cur.fares.push({k:m[1]||"",v:+m[2].replace(/,/g,"")});continue}
    if((m=s.match(/^注記\s*(.+)/))){cur.note=m[1].slice(0,40);continue}
    if(/行$/.test(s)&&!cur.dest){cur.dest=s.replace(/^当駅始発/,"").slice(0,30);continue}
  }
  return segs.map(g=>({...g,line:g.line.replace(/^JR/,"JR ").trim(),kind:segKind(g.line)}));
}
function segKind(n){return /^徒歩/.test(n)?"walk":/新幹線/.test(n)?"shin":/空路|航空|ANA|JAL|ピーチ|ジェットスター|スカイマーク/.test(n)?"fly":/高速バス|夜行バス/.test(n)?"hbus":/フェリー|汽船|高速船|航路/.test(n)?"ferry":/バス/.test(n)?"bus":/特急|ライナー|エクスプレス/.test(n)?"ltd":"train"}
const SEG_IC={walk:"🚶",shin:"🚄",ltd:"🚆",train:"🚃",hbus:"🚌",bus:"🚌",fly:"✈️",ferry:"⛴️"};
// tên ngắn để hiển thị: bỏ JR, lấy tên chuyến xe buýt
const segName=g=>{let v=g.line.replace(/^JR\s*/,"");if(/バス/.test(v)&&v.includes("・"))v=v.split("・").pop();return v};
// Cách đặt vé cho từng loại chặng
const BK={smartex:["smart EX (EX予約)","https://smart-ex.jp/"],ekinet:["えきねっと (JR東日本)","https://www.eki-net.com/"],e5489:["e5489 (JR西日本・四国)","https://www.jr-odekake.net/goyoyaku/"],kyushu:["JR九州ネット予約","https://train.yoyaku.jrkyushu.co.jp/"]};
const KYUSHU=/みどり|ハウステンボス|かもめ|ソニック|きらめき|にちりん|ひゅうが|きりしま|ゆふ|有明|あそ|かわせみ|指宿|36ぷらす3|いさぶろう|海幸山幸/,EAST=/ひたち|ときわ|あずさ|かいじ|踊り子|成田エクスプレス|しおさい|わかしお|さざなみ|草津|つがる|いなほ|日光|きぬがわ|富士回遊|はちおうじ|おうめ|湘南/,
  EAST_SHIN=/はやぶさ|はやて|やまびこ|なすの|こまち|つばさ|とき|たにがわ|かがやき|はくたか|あさま|つるぎ/;
function bookingFor(g){
  const n=g.line,fr=g.fares.find(f=>f.k)||null,note=g.note?` Yahoo ghi chú: ${g.note}.`:"";
  const q=encodeURIComponent(segName(g)+" 予約");
  if(g.kind==="shin"){
    if(EAST_SHIN.test(n))return{need:"Nên đặt trước",how:"Đặt chỗ trên えきねっと (vé điện tử, quẹt thẻ IC qua cửa) hoặc mua ở máy 指定席券売機 / quầy みどりの窓口.",links:[BK.ekinet]};
    if(/かもめ/.test(n))return{need:"Nên đặt trước",how:"西九州新幹線 かもめ: đặt trên JR九州ネット予約 hoặc mua ở ga.",links:[BK.kyushu]};
    return{need:fr&&fr.k==="自由席"?"Không bắt buộc (自由席)":"Nên đặt trước",how:`Đặt chỗ trên smart EX (vé điện tử, dùng thẻ IC qua cửa, rẻ hơn vé giấy một chút) hoặc mua ở máy 指定席券売機 / quầy みどりの窓口. ${fr&&fr.k==="自由席"?"Giá Yahoo đang tính ghế tự do (自由席): có thể lên tàu không cần đặt chỗ, nhưng giờ cao điểm nên đặt 指定席.":""}`.trim(),links:[BK.smartex]};
  }
  if(g.kind==="ltd"){
    const reg=KYUSHU.test(n)?[BK.kyushu]:EAST.test(n)?[BK.ekinet]:[BK.e5489,BK.ekinet];
    return{need:fr&&fr.k==="自由席"?"Không bắt buộc (có ghế tự do)":"Nên đặt trước",how:`Tàu tốc hành (特急) cần thêm vé 特急券 ngoài vé đi tàu. Đặt online trên ${reg.map(x=>x[0]).join(" hoặc ")}, hoặc mua ở máy 指定席券売機 tại ga trước giờ tàu.${fr&&fr.k==="自由席"?" Ghế tự do (自由席) mua tại ga là lên được.":""}`,links:reg};
  }
  if(g.kind==="hbus")return{need:/予約/.test(g.note)?"Nên đặt trước":"Nên đặt trước",how:`Xe buýt cao tốc: đặt chỗ trên trang của nhà xe hoặc 発車オーライネット / 高速バスネット, thanh toán online hoặc trả tiền khi lên xe tuỳ tuyến. Ra bến${g.pf?` ${g.pf}`:""} trước 10 phút.${note}`,links:[["Tìm trang đặt "+segName(g),"https://www.google.com/search?q="+q],["発車オーライネット","https://secure.j-bus.co.jp/hon"],["高速バスネット","https://www.kousokubus.net/"]]};
  if(g.kind==="fly")return{need:"Phải đặt trước",how:"Đặt vé máy bay trên trang hãng hoặc Google Flights; có mặt ở sân bay trước 60 phút (nội địa).",links:[["Google Flights","https://www.google.com/travel/flights?hl=vi"]]};
  if(g.kind==="ferry")return{need:"Tuỳ tuyến",how:`Tàu thuỷ/phà: phần lớn mua vé ở bến; tuyến đông khách nên đặt trước trên trang hãng.${note}`,links:[["Tìm trang "+segName(g),"https://www.google.com/search?q="+q]]};
  if(g.kind==="bus")return{need:"Không cần đặt",how:"Xe buýt thường: quẹt thẻ IC (Suica/ICOCA…) hoặc trả tiền mặt khi xuống xe.",links:[]};
  return{need:"Không cần đặt",how:"Tàu thường: quẹt thẻ IC (Suica/ICOCA…) hoặc mua vé ở máy bán vé. Nếu chặng này nối với tàu JR tốc hành, có thể mua chung 1 vé đi tàu (乗車券) cho cả quãng.",links:[]};
}
// Các bước đi cụ thể của 1 lượt
function segSteps(segs){
  const out=[];const mm=(a,b)=>((toMin(b)-toMin(a))%1440+1440)%1440;
  segs.forEach((g,k)=>{const nx=segs[k+1],pv=segs[k-1];
    if(g.kind==="walk"){const w=nx&&nx.dep?mm(g.arr,nx.dep):0;out.push({ic:"🚶",t:g.dep,txt:`Đi bộ từ ${g.from} sang ${g.to} (~${mm(g.dep,g.arr)||1} phút)${nx?`, chờ ${w} phút${nx.pf?` ở ${nx.pf}`:""}`:""}`});return}
    if(pv&&pv.kind!=="walk"&&pv.arr)out.push({ic:"🔁",t:"",txt:`Đổi tàu tại ${g.from}: có ${mm(pv.arr,g.dep)} phút${pv.pt&&g.pf?`, từ sân ${pv.pt} sang ${g.pf}`:g.pf?`, sang ${g.pf}`:""}`,chg:true});
    out.push({ic:SEG_IC[g.kind]||"🚃",t:g.dep,txt:`Lên ${segName(g)}${g.dest?` (đi ${g.dest.replace(/行$/,"")})`:""} tại ${g.from}${g.pf?` · ${g.pf}`:""}`,seg:k});
    out.push({ic:"⬇",t:g.arr,txt:`Xuống tại ${g.to}${g.pt?` · ${g.pt}`:""}${g.stops?` (${g.stops} ga)`:""}`});
  });
  return out;
}
// Mẹo mua chung vé JR cho các chặng JR liền nhau
function jrTip(segs){const j=segs.map((g,k)=>/^JR/.test(g.line)?k:-1).filter(k=>k>=0);if(j.length<2)return"";
  const a=segs[j[0]].from,b=segs[j[j.length-1]].to;
  return `Các chặng JR từ ${a} đến ${b} đi liền nhau: chỉ cần 1 vé đi tàu (乗車券) ${a}→${b} cộng vé tốc hành (特急券) cho từng tàu. Cách dễ nhất: ra máy 指定席券売機 hoặc quầy みどりの窓口 ở ga ${a}, đưa màn hình kế hoạch này để mua một lần.`}
document.addEventListener("input",e=>{if(!e.target.classList.contains("rpaste"))return;const box=e.target.closest(".leg"),r=parseYahoo(e.target.value);box._segs=r.segs;
  if(r.dep)box.querySelector(".rdep").value=r.dep;if(r.arr)box.querySelector(".rarr").value=r.arr;if(r.fare)box.querySelector(".rfare").value=r.fare;if(r.line&&!box.querySelector(".rline").value)box.querySelector(".rline").value=r.line});
document.addEventListener("click",e=>{
  const sv=e.target.closest(".rsave"),cl=e.target.closest(".rclear");if(!(sv||cl)||!cur)return;
  const box=e.target.closest(".leg"),key=box.dataset.leg,data=store.get(realKey(cur))||{};
  if(cl){delete data[key]}
  else{const dep=box.querySelector(".rdep").value,arr=box.querySelector(".rarr").value,fareS=box.querySelector(".rfare").value.replace(/[,\s¥円]/g,""),line=clean(box.querySelector(".rline").value).slice(0,80),err=box.querySelector(".rerr");
    const okT=t=>/^([01]\d|2[0-3]):[0-5]\d$/.test(t);
    if(!okT(dep)||!okT(arr)){err.textContent="Nhập đủ giờ đi và giờ đến (dạng 08:06).";return}
    if(fareS&&!/^\d{1,7}$/.test(fareS)){err.textContent="Giá vé chỉ gồm chữ số.";return}
    const old=data[key],ps=box._segs&&box._segs.length?box._segs:old&&old.segs,segOk=ps&&ps.length&&ps[0].dep===dep&&ps[ps.length-1].arr===arr;
    data[key]={dep,arr,fare:fareS?Number(fareS):0,line};if(segOk)data[key].segs=ps}
  store.set(realKey(cur),data);
  build().then(()=>{const el=document.querySelector(`.leg[data-leg="${key}"]`);el&&el.scrollIntoView({block:"center"})});
});

function transportOptions(A,B){
  const opts=[];const dist=km(A,B);
  const jp=A[5]==="JP"&&B[5]==="JP",vn=A[5]==="VN"&&B[5]==="VN";
  if(!jp&&!vn){ // quốc tế Nhật ⇄ Việt Nam
    opts.push({k:"fly",n:"Máy bay quốc tế",t:dist/800+4,ccy:"JPY",p:35000+dist*12,
      d:`Bay thẳng ~${fmtH(dist/800+.3)}, cần ra sân bay trước 3 tiếng. Hãng bay thẳng: Vietnam Airlines, Vietjet, ANA, JAL.`});
    return {opts,dist};
  }
  const road=dist*1.3;
  if(jp){
    const acc=(A.acc||0)+(B.acc||0),accOk=(A.acc||0)<1.6&&(B.acc||0)<1.6;
    const accTxt=acc>0.3?` Cộng thêm ~${fmtH(acc)} đi từ/đến sân bay gần nhất${A.apName&&A.geo?` (${A.apName})`:""}${B.apName&&B.geo?` (${B.apName})`:""}.`:"";
    if(A[1]&&B[1]&&A[1]!==B[1]&&dist>(A.geo||B.geo?500:350)&&accOk) opts.push({k:"fly",n:"Máy bay (ANA/JAL/Peach)",t:dist/700+2.2+acc,ccy:"JPY",p:9000+dist*14,d:`Bay ~${fmtH(dist/700+.3)}, cộng khoảng 2 giờ làm thủ tục.`+accTxt});
    if((A.geo||B.geo)&&!(A[4]&&B[4])) opts.push({k:"train",n:road>200?"Tàu JR + Shinkansen":"Tàu JR",t:road/(road>600?160:road>200?100:65)+(road>200?1.2:.6),ccy:"JPY",p:800+road*(road>600?27:road>200?40:22),d:"Đã cộng ~1 giờ đổi tàu và chờ xe. Bấm Yahoo!乗換案内 bên dưới để xem giờ tàu, giá và chỗ đổi tàu chính xác."});
    else if(A[4]&&B[4]) opts.push({k:"train",n:"Shinkansen",t:road/200+.4,ccy:"JPY",p:1500+road*24,d:"Tàu cao tốc, đến thẳng ga trung tâm. Đặt chỗ ngồi chỉ định trên smart EX hoặc Eki-net."});
    else if(road<700&&!(A.geo||B.geo)) opts.push({k:"train",n:"Tàu JR tốc hành",t:road/85+.3,ccy:"JPY",p:800+road*22,d:"Tàu tốc hành (limited express), mua vé trên app JR hoặc tại ga."});
    if(road<1000) opts.push({k:"bus",n:"Xe buýt đường dài (Willer, JR Bus)",t:road/70,ccy:"JPY",p:1500+road*9,d:road>350?"Có chuyến chạy đêm, tiết kiệm tiền khách sạn.":"Rẻ, nhưng có thể chậm do kẹt xe cao tốc."});
    if(road<300) opts.push({k:"car",n:"Thuê xe tự lái",t:road/65,ccy:"JPY",p:9000+road*2*35,d:"Cần bằng lái quốc tế (IDP) hoặc bằng Nhật. Có phí cao tốc."});
  }else{
    if(A[1]&&B[1]&&dist>250) opts.push({k:"fly",n:"Máy bay",t:dist/750+2.5,ccy:"VND",p:900000+dist*1100,d:`Bay ~${fmtH(dist/750+.3)}, cộng khoảng 2 giờ làm thủ tục và di chuyển ra sân bay.`});
    if(A[4]&&B[4]) opts.push({k:"train",n:"Tàu hoả",t:road/50,ccy:"VND",p:150000+road*850,d:"Tàu Thống Nhất, nên chọn giường nằm khoang 4 nếu đi đêm."});
    if(road<900) opts.push({k:"bus",n:"Xe khách / limousine",t:road/55,ccy:"VND",p:80000+road*550,d:road>350?"Có xe giường nằm chạy đêm, tiết kiệm một đêm khách sạn.":"Limousine 9 chỗ đón trả tận nơi."});
    if(road<450) opts.push({k:"car",n:"Ô tô riêng / thuê xe",t:road/60,ccy:"VND",p:road*2*(road<150?12000:9000),d:"Chủ động giờ giấc, hợp khi đi nhóm hoặc làm việc nhiều điểm."});
  }
  return {opts,dist};
}

function bookingLinks(A,B,fromT,toT,d1,d2,pax,opts){const ow=!d2;if(ow)d2=addDays(d1,1);
  const e=encodeURIComponent,fN=A?short(A):fromT,tN=B?short(B):toT,L=[];
  const has=k=>opts.some(o=>o.k===k);
  const fq=A&&A[1]&&B&&B[1]?`${A[1]} to ${B[1]}`:`${fN} to ${tN}`;
  const jpDest=B&&B[5]==="JP",jpAny=(A&&A[5]==="JP")||jpDest,vnAny=(A&&A[5]==="VN")||(B&&B[5]==="VN");
  if(has("fly")||!A||!B){
    L.push(["Google Flights (so sánh giá)",`https://www.google.com/travel/flights?hl=vi&q=${e(ow?`One way flights from ${fq} on ${d1}`:`Flights from ${fq} on ${d1} through ${d2}`)}`]);
    if(A&&A[1]&&B&&B[1]){
      const sk=d=>d.slice(2).replace(/-/g,"");
      L.push(["Skyscanner",`https://www.skyscanner.jp/transport/flights/${A[1].toLowerCase()}/${B[1].toLowerCase()}/${sk(d1)}/${ow?"":sk(d2)+"/"}?adultsv2=${pax}&cabinclass=economy`]);
    }
    if(jpAny){L.push(["ANA","https://www.ana.co.jp/"],["JAL","https://www.jal.co.jp/"]);
      if(!vnAny) L.push(["Peach","https://www.flypeach.com/"],["Skymark","https://www.skymark.co.jp/"]);}
    if(vnAny) L.push(["Vietnam Airlines","https://www.vietnamairlines.com/"],["Vietjet Air","https://www.vietjetair.com/"]);
    if(vnAny&&!jpAny) L.push(["Bamboo Airways","https://www.bambooairways.com/"],["Traveloka",`https://www.traveloka.com/vi-vn/flight`]);
  }
  if(A&&B&&A[5]==="JP"&&B[5]==="JP"){
    L.push(["Tra lộ trình tàu - NAVITIME",`https://www.navitime.co.jp/transfer/searchlist?orvStationName=${e(fromT.replace(/\s*(station|駅|ga)$/i,""))}&dnvStationName=${e(toT.replace(/\s*(station|駅|ga)$/i,""))}`]);
    if(has("train")) L.push(["Vé Shinkansen Tokaido/Sanyo - smart EX","https://smart-ex.jp/"],["Vé JR Đông - Eki-net","https://www.eki-net.com/"],["Vé JR Tây - e5489","https://e5489.jr-odekake.net/"]);
    if(has("bus")) L.push(["Xe buýt đường dài - Willer","https://travel.willer.co.jp/"],["Xe buýt - Kosoku Bus","https://www.kosokubus.com/"]);
  }
  if(A&&B&&A[5]==="VN"&&B[5]==="VN"){
    if(has("train")) L.push(["Vé tàu - Đường sắt Việt Nam","https://dsvn.vn/"]);
    if(has("bus")) L.push(["Vé xe khách - Vexere","https://vexere.com/vi-VN"]);
  }
  if(jpDest) L.push(["Khách sạn - Rakuten Travel","https://travel.rakuten.co.jp/"],["Khách sạn - Jalan","https://www.jalan.net/"]);
  L.push(["Khách sạn - Booking.com",`https://www.booking.com/searchresults.vi.html?ss=${e(tN)}&checkin=${d1}&checkout=${d2}&group_adults=${pax}&no_rooms=1`]);
  L.push(["Khách sạn - Agoda",`https://www.agoda.com/vi-vn/search?textToSearch=${e(tN)}&checkIn=${d1}&checkOut=${d2}&adults=${pax}&rooms=1`]);
  if(!(A&&B&&A[5]!==B[5])&&!(A&&A[5]==="JP"&&B&&B[5]==="JP")) L.push(["Chỉ đường - Google Maps",`https://www.google.com/maps/dir/?api=1&origin=${e(fN)}&destination=${e(tN)}&travelmode=${A&&A[5]==="JP"?"transit":"driving"}`]);
  return L;
}

async function build(){
  if(busy)return;
  setErr("");
  const m1=$("m1").value==="arr"?"arr":"dep",m2=$("m2").value==="arr"?"arr":"dep";
  const okT=t=>/^([01]\d|2[0-3]):[0-5]\d$/.test(t);
  const t1=okT($("t1").value)?$("t1").value:"08:00",t2=okT($("t2").value)?$("t2").value:"17:00";
  const ow=isOW(),fromT=clean($("from").value),toT=clean($("to").value),d1=$("d1").value,d2=ow?d1:$("d2").value,note=clean($("note").value+"").slice(0,300);
  const pref=["fast","cheap","comfort"].includes($("pref").value)?$("pref").value:"fast";
  const miss=[];if(!fromT)miss.push("from");if(!toT)miss.push("to");if(!d1)miss.push("d1");if(!d2)miss.push("d2");
  const NAME={from:"điểm đi",to:"điểm đến",d1:"ngày đi",d2:"ngày về"};
  if(miss.length)return setErr("Vui lòng nhập "+miss.map(k=>NAME[k]).join(", ")+".",miss);
  if(!validDate(d1))return setErr("Ngày đi không hợp lệ.",["d1"]);
  if(!validDate(d2))return setErr("Ngày về không hợp lệ.",["d2"]);
  if(d1<todayStr())return setErr("Ngày đi đã qua, hãy chọn từ hôm nay trở đi.",["d1"]);
  if(d2<d1)return setErr("Ngày về phải sau hoặc trùng ngày đi.",["d2"]);
  if(dayDiff(d1,d2)>60)return setErr("Chuyến đi dài tối đa 60 ngày.",["d2"]);
  if(dayDiff(todayStr(),d1)>365)return setErr("Chỉ lập lịch trong vòng 1 năm tới.",["d1"]);
  const paxRaw=($("pax").value+"").trim(),pax=paxRaw===""?1:Number(paxRaw);
  if(!Number.isInteger(pax)||pax<1||pax>9){$("more").open=true;return setErr("Số người phải từ 1 đến 9.",["pax"])}
  if(!/[\p{L}\p{N}]/u.test(fromT))return setErr("Điểm đi không hợp lệ.",["from"]);
  if(!/[\p{L}\p{N}]/u.test(toT))return setErr("Điểm đến không hợp lệ.",["to"]);
  let A=find(fromT),B=find(toT);
  const same=()=>A&&B&&(A===B||km(A,B)<1.5);
  if(norm(fromT)&&norm(fromT)===norm(toT)||fromT===toT||same())return setErr("Điểm đi và điểm đến đang trùng nhau.",["to"]);
  if(!A||!B){
    busy=true;const btn=$("f").querySelector("button[type=submit]");btn.disabled=true;const bt=btn.textContent;btn.textContent="Đang tìm địa điểm…";
    try{
      if(!A)A=await geocode(fromT);
      if(!B){if(!A||A.geo)await new Promise(r=>setTimeout(r,1100));B=await geocode(toT)}
    }catch(e){return setErr("Không kết nối được dịch vụ bản đồ. Kiểm tra mạng rồi thử lại.")}
    finally{busy=false;btn.disabled=false;btn.textContent=bt}
    if(!A)return setErr(`Không tìm thấy "${fromT}". Thử ghi rõ hơn, VD: "Sasebo station" hoặc "佐世保".`,["from"]);
    if(!B)return setErr(`Không tìm thấy "${toT}". Thử ghi rõ hơn, VD: "Imabari station" hoặc "今治".`,["to"]);
    if(same())return setErr("Điểm đi và điểm đến đang trùng nhau.",["to"]);
  }
  const OK=["JP","VN"];
  if(!OK.includes(A[5])||!OK.includes(B[5]))return setErr("Hiện chỉ hỗ trợ địa điểm ở Nhật Bản và Việt Nam.",[!OK.includes(A[5])?"from":"to"]);
  if(A&&B)addPlaces(fromT,toT);
  const nights=ow?0:dayDiff(d1,d2);
  CUR=(A&&A[5]==="JP")||(!A&&B&&B[5]==="JP")?"JPY":"VND";
  const jpDest=B&&B[5]==="JP",intl=A&&B&&A[5]!==B[5];
  cur={fromT,toT,A,B,d1,d2,pax,pref,note,nights,jpDest,intl,m1,t1,m2,t2,ow};
  store.set("last",{fromT,toT,d1,d2,pax,pref,note,m1,t1,m2,t2,ow});

  let opts,dist=null;
  if(A&&B){({opts,dist}=transportOptions(A,B))}
  else opts=[{k:"fly",n:"Máy bay",t:null,p:null,d:"Chưa có dữ liệu cho địa điểm này, hãy xem giá trực tiếp ở các trang đặt vé."}];
  const ref=o=>o.ccy==="JPY"?o.p:o.p/JPY2VND;
  const score=o=>o.t==null?0:pref==="fast"?o.t:pref==="cheap"?ref(o):(o.k==="fly"?o.t*0.8:o.k==="train"&&jpDest?o.t*0.7:o.k==="car"?o.t*0.9:o.t*1.3);
  opts.sort((a,b)=>score(a)-score(b));cur.opts=opts;cur.dist=dist;
  const IC={fly:"✈️",train:"🚄",bus:"🚌",car:"🚗"};
  $("opts").innerHTML=(dist?`<p class="muted" style="margin:0">Đường chim bay ~${Math.round(dist)} km${intl?` · 1¥ ≈ ${JPY2VND}đ`:""}</p>`:"")+opts.map((o,i)=>`<div class="opt${i===0?" best":""}"><div class="ic">${IC[o.k]||"🧭"}</div><div><b>${o.n}${i===0?'<span class="tag">Phù hợp nhất</span>':''}</b><span class="muted">${o.d}</span></div><div class="r">${o.t!=null?`<b>${fmtH(o.t)}</b><div class="muted">~${money(o.p*pax,o.ccy)}${pax>1?` · ${pax} người`:''}</div>`:''}</div></div>`).join("");

  const L=bookingLinks(A,B,fromT,toT,d1,ow?null:d2,pax,opts);
  const real=store.get(realKey(cur))||{};cur.real=real;
  let legHtml="";const best0=opts[0];
  if(A&&B&&A[5]==="JP"&&B[5]==="JP"){
    const fj=jaName(A,fromT),tj=jaName(B,toT);
    const leg=(key,lbl,f,t,fJ,tJ,date,mode,tm)=>{const r=real[key];const [yy,mm,dd]=date.split("-").map(Number);return `<div class="leg${r?" done":""}" data-leg="${key}"><div class="h">${lbl} · ${wd[new Date(yy,mm-1,dd).getDay()]}, ${dmy(date)} <small>(${mode==="arr"?"đến trước":"đi lúc"} ${tm})</small></div>`+
      (r?`<div class="realbox">${r.src==="navitime"?"≈ Giờ NAVITIME (trung bình)":"✓ Đã chọn"}: <b>${esc(r.dep)} → ${esc(r.arr)}</b>${r.line?` · ${esc(r.line)}`:""}${r.fare?` · ¥${Number(r.fare).toLocaleString("ja-JP")}`:""}${okSegs(r)?`<div class="chg">${esc(chgLine(r.segs))}</div>`:`<div class="chg muted">Muốn biết đổi tàu ở đâu, sân ga, cách đặt vé? Dán toàn bộ 1 tuyến Yahoo vào ô bên dưới, hoặc dùng nút 📥 trên trang Yahoo.</div>`}</div>`:"")+
      `<div class="btns">${routeLinks(f,t,fJ,tJ,date,mode,tm,best0.t).map((l,k)=>`<a class="${k===0?"pri":""}" href="${l[1]}" target="_blank" rel="noopener">${k===0?"Mở Yahoo xem chuyến ↗":l[0]}</a>`).join("")}</div>`+
      `${r?`<details class="repick"><summary>Đổi chuyến khác</summary>`:""}<div class="pick"><div class="lbl2">${r?"Gõ lại giờ chuyến mới:":"Gõ giờ chuyến bạn chọn:"}</div>
        <div class="g3"><label class="lab">Giờ đi<input type="time" class="rdep" value="${r?esc(r.dep):""}"></label><label class="lab">Giờ đến<input type="time" class="rarr" value="${r?esc(r.arr):""}"></label><button type="button" class="primary rsave">Lưu</button></div>
        <div class="rerr err" role="alert"></div>
        <details class="fix"><summary>Thêm giá vé, tên tàu, hoặc dán kết quả Yahoo</summary>
          <label class="lab">Dán kết quả copy từ Yahoo (tự điền giờ, giá, tên tàu)<textarea class="rpaste" rows="2" placeholder="VD: 08:06発→13:34着 5時間28分 18,070円"></textarea></label>
          <div class="g2"><label class="lab">Giá vé (¥)<input type="text" inputmode="numeric" class="rfare" maxlength="7" value="${r&&r.fare?esc(String(r.fare)):""}"></label><label class="lab">Tên tàu (tuỳ chọn)<input type="text" class="rline" maxlength="80" placeholder="みどり→のぞみ→バス" value="${r&&r.line?esc(r.line):""}"></label></div>
        </details>
        ${r?'<button type="button" class="ghost rclear">Xoá giờ đã chọn</button>':""}
      </div>${r?"</details>":""}`+
      (navKey()?`<button type="button" class="ghost navbtn" data-q="${esc(JSON.stringify({s:[f===fromT?A[2]:B[2],f===fromT?A[3]:B[3]],g:[f===fromT?B[2]:A[2],f===fromT?B[3]:A[3]],date,mode,tm}))}">🔎 Tìm chuyến NAVITIME</button>`:"")+`<div class="nres"></div></div>`};
    legHtml=leg("go",ow?"➡️ Chuyến đi (một chiều)":"🚩 Lượt đi",fromT,toT,fj,tj,d1,m1,t1)+(ow?"":leg("back","🏠 Lượt về",toT,fromT,tj,fj,d2,m2,t2));
  }
  $("legs").innerHTML=legHtml;$("legCard").classList.toggle("hidden",!legHtml);
  // Nhật: ước tính chỉ là phụ (thu gọn); chặng khác: đây là bước 2
  $("optWrap").open=!legHtml;$("optSum").textContent=legHtml?"🚆 Xem ước tính các phương tiện":"🚆 Phương tiện gợi ý";
  const grp={route:[],ticket:[],hotel:[]};
  for(const l of L){(/Khách sạn/.test(l[0])?grp.hotel:/NAVITIME|Chỉ đường|lộ trình/i.test(l[0])?grp.route:grp.ticket).push(l)}
  const glist=(t,a)=>a.length?`<div class="grp"><div class="lbl">${t}</div><div class="list">${a.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${l[0].replace(/^Khách sạn - /,"")}</a>`).join("")}</div></div>`:"";
  $("links").innerHTML=glist("Vé tàu, xe, máy bay",grp.ticket)+glist("Khách sạn",grp.hotel)+glist("Tra đường",grp.route);

  const best=opts[0],fN=A?short(A):fromT,tN=B?short(B):toT,days=[];
  const via=best.n.replace(/\s*\(.*\)/,"");const viaL=/^[A-Z]{2}|Shinkansen/.test(via.split(" ")[0])?via:via.charAt(0).toLowerCase()+via.slice(1);
  const hub=best.k==="fly"?"sân bay":best.k==="train"?"ga":"bến xe";
  const checkin=jpDest?"15h":"14h",checkout=jpDest?"10h–11h":"12h";
  const local=jpDest?"Đi lại trong thành phố bằng tàu điện, dùng thẻ IC (Suica/ICOCA) hoặc Mobile Suica":"Đặt xe công nghệ (Grab, Xanh SM) trước giờ hẹn 30 phút để tránh kẹt xe";
  const go=legTimes(m1,t1,best.t),back=legTimes(m2,t2,best.t);
  if(real.go)Object.assign(go,{dep:real.go.dep,arr:real.go.arr,real:true});
  if(real.back&&!ow)Object.assign(back,{dep:real.back.dep,arr:real.back.arr,real:true});
  const est=go.real?"":best.t?" (giờ đến là ước tính)":"";
  const viaGo=real.go&&real.go.line?real.go.line:viaL,viaBack=real.back&&real.back.line?` (${real.back.line})`:"";
  const aGo=go.real?"lúc":"khoảng",aBack=back.real?"lúc":"khoảng";
  cur.go=go;cur.back=back;
  for(let i=0;i<=nights;i++){
    const ds=addDays(d1,i),[yy,mm,dd]=ds.split("-").map(Number),dt=new Date(yy,mm-1,dd);const label=`${wd[dt.getDay()]}, ${dmy(ds)}`;let items;
    if(ow) items=[`${go.dep} khởi hành từ ${fN} bằng ${viaGo}, đến ${tN} ${aGo} ${go.arr}${est}`,`Đến ${tN}${jpDest?", dùng thẻ IC (Suica/ICOCA) đi lại trong thành phố":""}`,`Làm việc tại ${tN}`];
    else if(i===0&&nights===0) items=[`${go.dep} khởi hành từ ${fN} bằng ${viaGo}, đến ${tN} ${aGo} ${go.arr}${est}`,`Làm việc tại ${tN}`,`${back.dep} khởi hành về${viaBack}, đến ${fN} ${aBack} ${back.arr}`];
    else if(i===0) items=[`${go.dep} khởi hành từ ${fN} bằng ${viaGo}, đến ${tN} ${aGo} ${go.arr}${go.real?" ✓":best.t?` (đi ~${fmtH(best.t)})`:""}`,
      intl?"Mang hộ chiếu, kiểm tra visa/điều kiện nhập cảnh, đổi tiền hoặc mang thẻ quốc tế":`Từ ${hub} về khách sạn, nhận phòng từ ${checkin}`,
      intl?`Từ sân bay về khách sạn, nhận phòng từ ${checkin}`:"Chuẩn bị tài liệu, xác nhận lịch hẹn ngày mai"];
    else if(i===nights) items=[`Trả phòng trước ${checkout}${jpDest?", gửi hành lý ở tủ khoá (coin locker) tại ga":", gửi hành lý tại lễ tân"}`,
      `Kết thúc công việc, ra ${best.k==="fly"?`sân bay trước giờ bay ${intl?3:2} tiếng`:hub+" trước 20–30 phút"}`,`${back.dep} khởi hành về${viaBack}, đến ${fN} ${aBack} ${back.arr}${back.real?" ✓":""}`];
    else items=[`Ngày làm việc ${i} tại ${tN}`,local,jpDest?"Tối: tổng hợp biên bản, gửi báo cáo; nhớ danh thiếp (meishi) cho buổi hẹn":"Tối: tổng hợp biên bản, gửi báo cáo nhanh"];
    days.push({label,items});
  }
  const chgItem=r=>okSegs(r)&&r.segs.filter(g=>g.kind!=="walk").length>1?`Đổi tàu/xe: ${chgLine(r.segs)} (chi tiết ở mục Kế hoạch di chuyển)`:"";
  {const a=chgItem(real.go);if(a)days[0].items.splice(1,0,a);const b=ow?"":chgItem(real.back);if(b){const it=days[nights].items;it.push(b)}}
  if(note) days[Math.min(1,nights)].items.splice(1,0,"Ghi chú: "+note);
  cur.days=days;
  $("plan").innerHTML=days.map((d,i)=>`<div class="day"><h3>Ngày ${i+1} · ${d.label}</h3><ul class="tl">${d.items.map(x=>{const m=x.match(/^(\d\d:\d\d)\s+(.*)$/);return m?`<li class="tt"><span class="when">${m[1]}</span>${esc(m[2])}</li>`:`<li>${esc(x)}</li>`}).join("")}</ul></div>`).join("");
  const nReal=(real.go?1:0)+(real.back&&!ow?1:0),need=ow?1:2,jpLeg=!!legHtml;
  $("moveCard").classList.toggle("hidden",!jpLeg);$("move").innerHTML=jpLeg?moveHtml("go",ow?"➡️ Chuyến đi":"🚩 Lượt đi",d1,fromT,toT)+(ow?"":moveHtml("back","🏠 Lượt về",d2,toT,fromT)):"";
  $("st1").className="done";$("st2").className=!jpLeg||nReal===need?"done":"on";$("st3").className=!jpLeg||nReal===need?"on":"";
  // 2 hero
  const bt=best.t!=null;
  $("hero").innerHTML=`<div class="od">${esc(fromT)} → ${esc(toT)}</div><div class="sub">${ow?`${dmy(d1)} · một chiều`:`${dmy(d1)} – ${dmy(d2)} · khứ hồi · ${nights?nights+" đêm":"trong ngày"}`} · ${pax} người</div>`+
    (bt?`<div class="big"><span class="t">${go.dep.slice(0,5)}</span><div class="line"><span>${(IC[best.k]||"")} ${go.real?fmtH(((toMin(go.arr)-toMin(go.dep))%1440+1440)%1440/60):fmtH(best.t)}</span></div><span class="t">${go.arr.slice(0,5)}</span></div><div class="sub">${go.real?`<span class="okb">${real.go.src==="navitime"?"≈ NAVITIME":"✓ Giờ thật"}</span> ${real.go.line?esc(real.go.line)+" · ":""}${real.go.fare?"¥"+Number(real.go.fare*pax).toLocaleString("ja-JP"):""}`:`Lượt đi bằng ${esc(best.n)} · ~${money(best.p*pax,best.ccy)} · giờ là ước tính, chọn giờ thật ở bước 2`}</div>`:"")+(jpLeg?`<div class="hstat${nReal===need?" ok":""}">${nReal===need?(ow?"✓ Đã chọn giờ tàu":"✓ Đã chọn giờ tàu cả lượt đi và lượt về"):nReal===1?"Còn 1 lượt chưa chọn giờ tàu (bước 2)":"Bước tiếp theo: chọn giờ tàu ở bước 2 bên dưới"}</div>`:"");
  $("ai").textContent="";$("msg").textContent="";
  $("out").classList.remove("hidden");
  $("csumT").textContent=`${fromT} → ${toT}`;$("csumD").textContent=`${ow?dmy(d1)+" · một chiều":dmy(d1)+" – "+dmy(d2)+" · khứ hồi"} · ${pax} người`;$("f").classList.add("compact");
  $("out").scrollIntoView({behavior:"smooth"});
}
const okSegs=r=>!!(r&&Array.isArray(r.segs)&&r.segs.length&&r.segs.every(g=>g&&typeof g.dep==="string"&&typeof g.line==="string"));
// "07:18 佐世保 → [đổi] 博多 09:15 → 福山駅前 11:05 → 今治 12:34"
function chgLine(segs){const v=segs.filter(g=>g.kind!=="walk");if(!v.length)return"";
  return [`${v[0].from} ${v[0].dep} ${segName(v[0])}`,...v.slice(1).map(g=>`đổi ở ${g.from} ${g.dep} ${segName(g)}`),`đến ${segs[segs.length-1].to} ${segs[segs.length-1].arr}`].join(" → ")}
// Thông tin đổi tàu / chờ sau chặng k (đi bộ gộp vào)
function afterSeg(segs,k){const mm=(a,b)=>((toMin(b)-toMin(a))%1440+1440)%1440,g=segs[k];let j=k+1,walk=null;
  if(segs[j]&&segs[j].kind==="walk"){walk=segs[j];j++}
  const nx=segs[j];
  if(!nx){const last=segs[segs.length-1];return{ic:"🏁",txt:`Đến ${last.to} ${last.arr}${walk?` (đi bộ ~${mm(walk.dep,walk.arr)||1} phút)`:""}`,end:true}}
  const w=mm(walk?walk.arr:g.arr,nx.dep);
  if(walk)return{ic:"🚶",txt:`Đi bộ ~${mm(walk.dep,walk.arr)||1} phút sang ${nx.from}${nx.pf?` (${nx.pf})`:""}, chờ ${w} phút`};
  return{ic:"🔁",txt:`Đổi tàu tại ${nx.from}, có ${mm(g.arr,nx.dep)} phút${g.pt&&nx.pf?`: sân ${g.pt} → ${nx.pf}`:nx.pf?`: sang ${nx.pf}`:""}`};
}
function moveHtml(key,lbl,date,f,t){const r=cur&&cur.real&&cur.real[key];
  const h=`<h3>${lbl} · ${dmy(date)}${r?` · <span class="t">${esc(r.dep)} → ${esc(r.arr)}</span>`:""}</h3>`;
  if(!r)return `<div class="mv">${h}<p class="muted">Chưa chọn chuyến. Chọn giờ tàu ở bước 2 để có kế hoạch chi tiết.</p></div>`;
  if(!okSegs(r))return `<div class="mv">${h}<p class="muted">Mới có giờ đi/đến${r.line?` (${esc(r.line)})`:""}. Để biết đổi tàu ở đâu, sân ga và cách đặt vé từng chặng: bấm nút 📥 trên trang Yahoo, hoặc copy toàn bộ 1 tuyến trên Yahoo rồi dán vào ô "Dán kết quả" ở bước 2.</p></div>`;
  const segs=r.segs,v=segs.map((g,k)=>[g,k]).filter(([g])=>g.kind!=="walk"),tip=jrTip(segs),last=segs[segs.length-1];
  // dải tuyến nằm ngang: ga — tàu — ga
  const nodes=[],mm=(a,b)=>((toMin(b)-toMin(a))%1440+1440)%1440;
  v.forEach(([g,k],i)=>{
    if(i===0)nodes.push(`<div class="nd"><b>${esc(g.dep)}</b><span>${esc(g.from)}</span></div>`);
    nodes.push(`<div class="lk k-${esc(g.kind)}"><span>${SEG_IC[g.kind]||"🚃"} ${esc(segName(g))}</span></div>`);
    const nx=v[i+1];
    if(nx){const wk=segs[k+1]&&segs[k+1].kind==="walk";
      nodes.push(`<div class="nd chg"><b>${esc(g.arr)}</b><span>${esc(g.to)}</span>${wk?`<i>🚶 ${mm(segs[k+1].dep,segs[k+1].arr)||1}′</i>`:""}<b class="d">${esc(nx[0].dep)}</b>${wk?`<span>${esc(nx[0].from)}</span>`:""}</div>`)}
    else nodes.push(`<div class="nd end"><b>${esc(last.arr)}</b><span>${esc(last.to)}</span></div>`);
  });
  const rows=v.map(([g,k])=>{const b=bookingFor(g),fr=g.fares.find(x=>x.k),af=afterSeg(segs,k);
    return `<div class="sg"><div class="c-n">${SEG_IC[g.kind]||"🚃"} <b>${esc(segName(g))}</b>${g.dest?`<small>đi ${esc(g.dest.replace(/行$/,""))}</small>`:""}</div>
      <div class="c-d"><span class="lbm">Lên</span><b>${esc(g.dep)}</b> ${esc(g.from)}${g.pf?` <span class="pf">${esc(g.pf)}</span>`:""}</div>
      <div class="c-a"><span class="lbm">Xuống</span><b>${esc(g.arr)}</b> ${esc(g.to)}${g.pt?` <span class="pf">${esc(g.pt)}</span>`:""}</div>
      <div class="c-c${af.end?" end":""}">${af.ic} ${esc(af.txt)}</div>
      <div class="c-b"><span class="need${/Không/.test(b.need)?" no":""}">${esc(b.need)}</span>${fr?` <small>${esc(fr.k)} ¥${Number(fr.v).toLocaleString("ja-JP")}</small>`:""}
        ${b.links.length?`<div class="bkl">${b.links.map(l=>`<a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])} ↗</a>`).join("")}</div>`:""}
        <details class="how"><summary>Cách đặt</summary>${esc(b.how)}</details></div></div>`}).join("");
  return `<div class="mv">${h}<div class="sub muted">${esc(f)} → ${esc(t)} · đổi ${Math.max(0,v.length-1)} lần${r.fare?` · ¥${Number(r.fare).toLocaleString("ja-JP")}/người`:""}</div>
    <div class="strip" role="list">${nodes.join("")}</div>
    <div class="segt"><div class="sg hd"><div>Tàu / xe</div><div>Lên</div><div>Xuống</div><div>Sau đó</div><div>Đặt vé</div></div>${rows}</div>
    ${tip?`<p class="tip">💡 ${esc(tip)}</p>`:""}</div>`}
function moveText(){if(!cur||!cur.real)return"";let o="";
  for(const [k,l] of cur.ow?[["go","Chuyến đi"]]:[["go","Lượt đi"],["back","Lượt về"]]){const r=cur.real[k];if(!okSegs(r))continue;
    o+=`\n\n=== Kế hoạch di chuyển ${l} (${r.dep} → ${r.arr}) ===\n`+segSteps(r.segs).map(x=>`${x.t||"     "} ${x.txt}`).join("\n")+`\n${r.segs[r.segs.length-1].arr} Đến ${r.segs[r.segs.length-1].to}\n\nCách đặt vé:\n`;
    const tip=jrTip(r.segs);if(tip)o+=`* ${tip}\n`;
    o+=r.segs.filter(g=>g.kind!=="walk").map(g=>{const b=bookingFor(g);return `- ${segName(g)} (${g.from} ${g.dep} → ${g.to} ${g.arr}): ${b.need}. ${b.how}${b.links.length?" "+b.links.map(x=>x[1]).join(" "):""}`}).join("\n")}
  return o}
function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function asText(){if(!cur)return"";return `Lịch trình công tác ${cur.fromT} → ${cur.toT} (${cur.ow?dmy(cur.d1)+", một chiều":dmy(cur.d1)+" - "+dmy(cur.d2)+", khứ hồi"})\nPhương tiện: ${cur.opts[0].n}\nLượt đi: ${cur.go.dep} → ${cur.go.arr}${cur.go.real?" (giờ thật)":" (ước tính)"}\n${cur.ow?"":`Lượt về: ${cur.back.dep} → ${cur.back.arr}${cur.back.real?" (giờ thật)":" (ước tính)"}\n`}\n`+cur.days.map((d,i)=>`Ngày ${i+1} (${d.label})\n`+d.items.map(x=>"- "+x).join("\n")).join("\n\n")+moveText()+($("ai").textContent?"\n\nGợi ý chi tiết:\n"+$("ai").textContent:"")}
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(asText());$("msg").textContent="Đã sao chép."}catch{$("msg").textContent="Trình duyệt chặn sao chép, hãy bôi đen để copy."}};

function loadSaved(){try{return JSON.parse(localStorage.getItem("trips")||"[]")}catch{return[]}}
function renderSaved(){const s=loadSaved();$("saved").innerHTML=s.length?s.map((t,i)=>`<li><div class="s"><b>${esc(t.fromT)} → ${esc(t.toT)}</b><span class="muted">${t.ow?dmy(t.d1)+" · một chiều":dmy(t.d1)+" – "+dmy(t.d2)}</span></div><button class="ghost" data-i="${i}">Mở</button><button class="ghost" data-del="${i}" aria-label="Xoá">✕</button></li>`).join(""):'<li class="muted">Chưa có chuyến nào.</li>'}
$("save").onclick=()=>{const s=loadSaved();s.unshift({fromT:cur.fromT,toT:cur.toT,d1:cur.d1,d2:cur.d2,m1:cur.m1,t1:cur.t1,m2:cur.m2,t2:cur.t2,pax:cur.pax,pref:cur.pref,note:cur.note,ow:!!cur.ow});try{localStorage.setItem("trips",JSON.stringify(s.slice(0,20)));$("msg").textContent="Đã lưu.";}catch{$("msg").textContent="Không lưu được trên trình duyệt này."}renderSaved()};
$("saved").onclick=e=>{const s=loadSaved();if(e.target.dataset.i){const t=s[e.target.dataset.i];$("from").value=t.fromT;$("to").value=t.toT;$("d1").value=t.d1;$("d2").value=t.d2;if(t.t1){$("m1").value=t.m1;$("t1").value=t.t1;$("m2").value=t.m2;$("t2").value=t.t2}$("pax").value=t.pax;$("pref").value=t.pref;$("note").value=t.note||"";setTrip(t.ow);build()}
  if(e.target.dataset.del){s.splice(+e.target.dataset.del,1);try{localStorage.setItem("trips",JSON.stringify(s))}catch{}renderSaved()}};
renderSaved();renderPlaces();renderNav();
// ===== Nhận chuyến gửi từ trang Yahoo (nút bookmark) =====
const BM=`javascript:(()=>{var p=new URL(location.href).searchParams,t=document.body.innerText,c=t.split(/\\nルート\\d+\\n/).filter(x=>/\\d{1,2}:\\d{2}発→\\d{1,2}:\\d{2}着/.test(x)).slice(0,5).map(x=>{x=x.replace(/\\n乗車位置：[^\\n]*/g,'');var i=x.search(/\\t着\\t/),j=i>0?x.indexOf('\\n',i):-1;return(j>0?x.slice(0,j):x).slice(0,3000)});if(!/transit\\.yahoo\\.co\\.jp/.test(location.host)||!c.length){alert('Hãy mở trang KẾT QUẢ tìm đường của Yahoo!乗換案内 rồi bấm lại.');return}var z=n=>('0'+n).slice(-2);location.href='${location.origin+location.pathname}\\x23yahoo='+encodeURIComponent(JSON.stringify({d:p.get('y')+'-'+z(p.get('m'))+'-'+z(p.get('d')),f:p.get('from')||'',t:p.get('to')||'',r:c}))})()`;
$("bmLink").href=BM;
$("bmLink").addEventListener("click",e=>{e.preventDefault();$("bmMsg").textContent="Đừng bấm nút ở đây. Hãy kéo nút lên thanh dấu trang (Favorites bar), rồi bấm nó khi đang ở trang kết quả Yahoo.";$("bmMsg").style.color="#d93025"});
$("bmCopy").onclick=async()=>{try{await navigator.clipboard.writeText(BM);$("bmMsg").textContent="Đã copy mã nút."}catch{$("bmMsg").textContent="Không copy được, hãy giữ lâu vào nút để copy link."}};
async function receiveYahoo(){
  const h=location.hash;if(!h.startsWith("#yahoo="))return;
  history.replaceState(null,"",location.pathname+location.search);
  let y;try{y=JSON.parse(decodeURIComponent(h.slice(7)))}catch{return setErr("Dữ liệu gửi từ Yahoo bị lỗi, hãy bấm nút lại.")}
  if(!y||!Array.isArray(y.r)||!/^\d{4}-\d{2}-\d{2}$/.test(y.d||""))return setErr("Dữ liệu gửi từ Yahoo bị lỗi, hãy bấm nút lại.");
  const routes=y.r.slice(0,6).map(t=>parseYahoo(String(t).slice(0,4000))).filter(r=>r.dep&&r.arr);
  const L=store.get("last");
  if(!L)return setErr("Hãy lập lịch trình trên web trước, rồi mới gửi chuyến từ Yahoo về.");
  $("from").value=L.fromT;$("to").value=L.toT;$("d1").value=L.d1;$("d2").value=L.d2;$("pax").value=L.pax;$("pref").value=L.pref;$("note").value=L.note||"";$("m1").value=L.m1;$("t1").value=L.t1;$("m2").value=L.m2;$("t2").value=L.t2;setTrip(L.ow);
  await build();if(!cur)return;
  const n=x=>(x||"").replace(/(駅|市|町|村)$/,"");
  let leg=cur.ow?(y.d===cur.d1?"go":""):y.d===cur.d2&&y.d!==cur.d1?"back":y.d===cur.d1&&y.d!==cur.d2?"go":"";
  if(!leg&&y.d===cur.d1){const fj=document.querySelector('.leg[data-leg="back"] .btns a');leg=fj&&n(new URL(fj.href).searchParams.get("from"))===n(y.f)?"back":"go"}
  const box=document.querySelector(`.leg[data-leg="${leg}"]`);
  if(!box)return setErr(`Chuyến Yahoo ngày ${dmy(y.d)} không khớp ${cur.ow?`ngày đi (${dmy(cur.d1)})`:`ngày đi (${dmy(cur.d1)}) hay ngày về (${dmy(cur.d2)})`} của lịch trình.`);
  const out=box.querySelector(".nres")||box.insertBefore(Object.assign(document.createElement("div"),{className:"nres"}),box.querySelector(".fix"));
  out._rs=routes.map(r=>({...r,parts:[],yahoo:true}));
  out.innerHTML=`<div class="realbox">📥 Nhận ${routes.length} chuyến từ Yahoo (${esc(y.f)} → ${esc(y.t)}, ${dmy(y.d)}). Chọn chuyến bạn sẽ đi:</div>`+
    routes.map((r,i)=>`<div class="nr"><div class="tt">${esc(r.dep)} → ${esc(r.arr)}${r.fare?` <span class="muted">· ¥${Number(r.fare).toLocaleString("ja-JP")}</span>`:""}</div><div class="ln">${esc(r.segs.length?chgLine(r.segs):r.line||"")}</div><button type="button" class="primary ypick" data-i="${i}">Chọn chuyến này</button></div>`).join("");
  box.scrollIntoView({block:"start"});
}
document.addEventListener("click",async e=>{const pk=e.target.closest(".ypick");if(!pk||!cur)return;
  const box=pk.closest(".leg"),r=box.querySelector(".nres")._rs[+pk.dataset.i],data=store.get(realKey(cur))||{};
  data[box.dataset.leg]={dep:r.dep,arr:r.arr,fare:r.fare?Number(r.fare):0,line:(r.line||"").slice(0,80)};if(r.segs&&r.segs.length)data[box.dataset.leg].segs=r.segs;
  store.set(realKey(cur),data);await build();const el=document.querySelector(`.leg[data-leg="${box.dataset.leg}"]`);el&&el.scrollIntoView({block:"center"})});
receiveYahoo();
window.addEventListener("hashchange",receiveYahoo);

let sample=null;$("aiCard").classList.add("hidden");
(async()=>{try{if(window.claude&&claude.use){sample=await claude.use("sample");if(sample)$("aiCard").classList.remove("hidden")}}catch{}})();
$("aiBtn").onclick=async()=>{
  if(!sample||!cur)return;const btn=$("aiBtn");btn.disabled=true;$("ai").textContent="Đang soạn...";
  const where=cur.intl?"giữa Nhật Bản và Việt Nam":cur.jpDest?"ở Nhật Bản":"ở Việt Nam";
  const prompt=`Bạn là trợ lý lập kế hoạch đi công tác ${where}. Người dùng là người Việt đang sống ở Nhật. Viết bằng tiếng Việt, ngắn gọn, gạch đầu dòng theo từng ngày, không dùng markdown đậm/nghiêng. Khi nhắc tên ga, địa danh Nhật thì ghi kèm chữ Nhật.
Chuyến đi: từ ${cur.fromT} đến ${cur.toT}, ${cur.ow?`đi một chiều ngày ${dmy(cur.d1)}`:`đi ngày ${dmy(cur.d1)}, về ngày ${dmy(cur.d2)} (${cur.nights} đêm)`}, ${cur.pax} người, ưu tiên: ${({fast:"nhanh",cheap:"tiết kiệm",comfort:"thoải mái"})[cur.pref]}.
Phương tiện đề xuất: ${cur.opts.map(o=>o.n).join(", ")}.
Ghi chú công việc: ${cur.note||"không có"}.
Hãy gợi ý: khung giờ khởi hành nên chọn, khu vực nên ở gần nơi làm việc, cách di chuyển từ sân bay/ga vào trung tâm và chi phí ước tính (tính bằng ${CUR==="JPY"?"yên":"đồng"}), lịch trình từng ngày, lưu ý thời tiết theo mùa${cur.intl?", giấy tờ nhập cảnh":""}, và danh sách đồ cần mang. Nói rõ giá chỉ là ước tính.`;
  try{await sample(prompt,{modelTier:"default",onText:({text})=>{$("ai").textContent=text}})}
  catch(err){$("ai").textContent=err&&err.code==="rate_limited"?"Đang quá tải, thử lại sau ít phút.":err&&err.code==="not_granted"?"Chưa được cấp quyền dùng Claude trên trang này.":"Không lấy được gợi ý: "+(err&&err.message||"lỗi")}
  btn.disabled=false};

// Giao diện sáng / tối: Tự động (theo máy) → Sáng → Tối
(()=>{const b=$("theme"),L={auto:"🌓 Tự động",light:"☀️ Sáng",dark:"🌙 Tối"};let t="auto";try{t=localStorage.getItem("theme")||"auto"}catch{}
  const apply=()=>{if(t==="auto")delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=t;b.textContent=L[t]||L.auto;b.title="Giao diện: "+(L[t]||L.auto).slice(3)+" (bấm để đổi)"};
  b.onclick=()=>{t=t==="auto"?"light":t==="light"?"dark":"auto";try{t==="auto"?localStorage.removeItem("theme"):localStorage.setItem("theme",t)}catch{}apply()};apply()})();
