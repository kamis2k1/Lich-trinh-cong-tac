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
document.getElementById("cities").innerHTML=C.map(c=>`<option value="${c[0]}">`).join("");

const $=id=>document.getElementById(id);
const today=new Date();const iso=d=>d.toISOString().slice(0,10);
$("d1").value=iso(new Date(today.getTime()+7*864e5));$("d2").value=iso(new Date(today.getTime()+10*864e5));

function km(a,b){const R=6371,r=Math.PI/180,dl=(b[2]-a[2])*r,dg=(b[3]-a[3])*r;
  const h=Math.sin(dl/2)**2+Math.cos(a[2]*r)*Math.cos(b[2]*r)*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
const fmtH=h=>{const H=Math.floor(h),M=Math.round((h-H)*60/5)*5;return (H?H+" giờ ":"")+(M?M+" phút":"")||"dưới 15 phút"};
const JPY2VND=170; // tỉ giá ước tính
let CUR="VND";
const money=(n,ccy)=>{ // n tính theo ccy gốc, hiển thị theo CUR
  let v=n; if(ccy!==CUR) v=ccy==="JPY"?n*JPY2VND:n/JPY2VND;
  return CUR==="JPY"?"¥"+(Math.round(v/100)*100).toLocaleString("ja-JP"):(Math.round(v/10000)*10000).toLocaleString("vi-VN")+"đ"};
const dmy=s=>s.split("-").reverse().join("/");
const wd=["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"];
const short=c=>c?(c.geo?c[0]:c[0].split(" ")[0]):"";
// Tra địa điểm bất kỳ qua OpenStreetMap, gán sân bay/tàu theo thành phố lớn gần nhất
async function geocode(q){
  try{
    const r=await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&accept-language=vi&q="+encodeURIComponent(q));
    const j=await r.json();if(!j.length)return null;
    const g=j[0],cc=((g.address&&g.address.country_code)||"").toUpperCase();
    const c=[q,"",+g.lat,+g.lon,0,cc];c.geo=true;c.acc=0;
    const near=C.filter(x=>x[5]===cc).map(x=>[x,km(c,x)]).sort((a,b)=>a[1]-b[1]);
    const ap=near.find(([x])=>x[1]);
    if(ap&&ap[1]<120){c[1]=ap[0][1];c.acc=ap[1]*1.3/45;c.apName=short(ap[0]);c.apKm=ap[1]}
    const rail=near.find(([x])=>x[4]);if(rail&&rail[1]<25)c[4]=1;
    return c;
  }catch(e){return null}
}

let cur=null;
$("f").addEventListener("submit",e=>{e.preventDefault();build()});

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
    if((A.geo||B.geo)&&!(A[4]&&B[4])) opts.push({k:"train",n:road>200?"Tàu JR + Shinkansen":"Tàu JR",t:road/(road>600?160:road>200?100:65)+.5,ccy:"JPY",p:500+road*(road>200?26:20),d:"Có thể phải đổi tàu hoặc nối xe buýt. Bấm \"Lộ trình thực tế\" bên dưới để xem giờ tàu và chỗ đổi tàu chính xác."});
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

function bookingLinks(A,B,fromT,toT,d1,d2,pax,opts){
  const e=encodeURIComponent,fN=A?short(A):fromT,tN=B?short(B):toT,L=[];
  const has=k=>opts.some(o=>o.k===k);
  const fq=A&&A[1]&&B&&B[1]?`${A[1]} to ${B[1]}`:`${fN} to ${tN}`;
  const jpDest=B&&B[5]==="JP",jpAny=(A&&A[5]==="JP")||jpDest,vnAny=(A&&A[5]==="VN")||(B&&B[5]==="VN");
  if(has("fly")||!A||!B){
    L.push(["Google Flights (so sánh giá)",`https://www.google.com/travel/flights?hl=vi&q=${e(`Flights from ${fq} on ${d1} through ${d2}`)}`]);
    if(A&&A[1]&&B&&B[1]){
      const sk=d=>d.slice(2).replace(/-/g,"");
      L.push(["Skyscanner",`https://www.skyscanner.jp/transport/flights/${A[1].toLowerCase()}/${B[1].toLowerCase()}/${sk(d1)}/${sk(d2)}/?adultsv2=${pax}&cabinclass=economy`]);
    }
    if(jpAny){L.push(["ANA","https://www.ana.co.jp/"],["JAL","https://www.jal.co.jp/"]);
      if(!vnAny) L.push(["Peach","https://www.flypeach.com/"],["Skymark","https://www.skymark.co.jp/"]);}
    if(vnAny) L.push(["Vietnam Airlines","https://www.vietnamairlines.com/"],["Vietjet Air","https://www.vietjetair.com/"]);
    if(vnAny&&!jpAny) L.push(["Bamboo Airways","https://www.bambooairways.com/"],["Traveloka",`https://www.traveloka.com/vi-vn/flight`]);
  }
  if(A&&B&&A[5]==="JP"&&B[5]==="JP"){
    L.unshift(["★ Lộ trình thực tế, giờ tàu - Google Maps",`https://www.google.com/maps/dir/?api=1&origin=${e(fromT)}&destination=${e(toT)}&travelmode=transit`]);
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
  $("err").textContent="";
  const fromT=$("from").value.trim(),toT=$("to").value.trim(),d1=$("d1").value,d2=$("d2").value,pax=+$("pax").value||1,pref=$("pref").value,note=$("note").value.trim();
  if(!fromT||!toT||!d1||!d2){$("err").textContent="Vui lòng nhập đủ 4 thông tin.";return}
  if(d2<d1){$("err").textContent="Ngày về phải sau hoặc trùng ngày đi.";return}
  if(norm(fromT)===norm(toT)&&fromT===toT){$("err").textContent="Điểm đi và điểm đến đang trùng nhau.";return}
  let A=find(fromT),B=find(toT);
  if(!A||!B){$("err").textContent="Đang tìm địa điểm...";
    if(!A)A=await geocode(fromT);if(!B){if(!A||A.geo)await new Promise(r=>setTimeout(r,1100));B=await geocode(toT)}
    $("err").textContent=(!A||!B)?"Không tìm thấy "+(!A?fromT:toT)+", thử ghi rõ hơn (VD: Sasebo, Nagasaki).":"";}
  const nights=Math.round((new Date(d2)-new Date(d1))/864e5);
  CUR=(A&&A[5]==="JP")||(!A&&B&&B[5]==="JP")?"JPY":"VND";
  const jpDest=B&&B[5]==="JP",intl=A&&B&&A[5]!==B[5];
  cur={fromT,toT,A,B,d1,d2,pax,pref,note,nights,jpDest,intl};

  let opts,dist=null;
  if(A&&B){({opts,dist}=transportOptions(A,B))}
  else opts=[{k:"fly",n:"Máy bay",t:null,p:null,d:"Chưa có dữ liệu cho địa điểm này, hãy xem giá trực tiếp ở các trang đặt vé."}];
  const ref=o=>o.ccy==="JPY"?o.p:o.p/JPY2VND;
  const score=o=>o.t==null?0:pref==="fast"?o.t:pref==="cheap"?ref(o):(o.k==="fly"?o.t*0.8:o.k==="train"&&jpDest?o.t*0.7:o.k==="car"?o.t*0.9:o.t*1.3);
  opts.sort((a,b)=>score(a)-score(b));cur.opts=opts;cur.dist=dist;
  $("opts").innerHTML=(dist?`<p class="muted">Khoảng cách đường chim bay ~${Math.round(dist)} km.${intl?` Giá quy đổi theo tỉ giá ước tính 1¥ ≈ ${JPY2VND}đ.`:""}</p>`:"")+opts.map((o,i)=>`<div class="opt"><div><b>${o.n}${i===0?'<span class="tag best">Phù hợp nhất</span>':''}</b><span class="muted">${o.d}</span></div><div style="text-align:right">${o.t!=null?`<b>${fmtH(o.t)}</b><span class="muted">~${money(o.p*pax,o.ccy)} / chiều${pax>1?` (${pax} người)`:''}</span>`:''}</div></div>`).join("");

  const L=bookingLinks(A,B,fromT,toT,d1,d2,pax,opts);
  $("links").innerHTML=L.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${l[0]} ↗</a>`).join("");

  const best=opts[0],fN=A?short(A):fromT,tN=B?short(B):toT,days=[];
  const via=best.n.replace(/\s*\(.*\)/,"");const viaL=/^[A-Z]{2}|Shinkansen/.test(via.split(" ")[0])?via:via.charAt(0).toLowerCase()+via.slice(1);
  const hub=best.k==="fly"?"sân bay":best.k==="train"?"ga":"bến xe";
  const checkin=jpDest?"15h":"14h",checkout=jpDest?"10h–11h":"12h";
  const local=jpDest?"Đi lại trong thành phố bằng tàu điện, dùng thẻ IC (Suica/ICOCA) hoặc Mobile Suica":"Đặt xe công nghệ (Grab, Xanh SM) trước giờ hẹn 30 phút để tránh kẹt xe";
  for(let i=0;i<=nights;i++){
    const dt=new Date(d1);dt.setDate(dt.getDate()+i);const label=`${wd[dt.getDay()]}, ${dmy(iso(dt))}`;let items;
    if(i===0&&nights===0) items=[`Sáng sớm khởi hành từ ${fN} bằng ${viaL}`,`Làm việc tại ${tN}`,`Chiều tối quay về ${fN}`];
    else if(i===0) items=[`Khởi hành từ ${fN} bằng ${viaL}${best.t?` (khoảng ${fmtH(best.t)})`:""}`,
      intl?"Mang hộ chiếu, kiểm tra visa/điều kiện nhập cảnh, đổi tiền hoặc mang thẻ quốc tế":`Từ ${hub} về khách sạn, nhận phòng từ ${checkin}`,
      intl?`Từ sân bay về khách sạn, nhận phòng từ ${checkin}`:"Chuẩn bị tài liệu, xác nhận lịch hẹn ngày mai"];
    else if(i===nights) items=[`Trả phòng trước ${checkout}${jpDest?", gửi hành lý ở tủ khoá (coin locker) tại ga":", gửi hành lý tại lễ tân"}`,
      `Kết thúc công việc, ra ${best.k==="fly"?`sân bay trước giờ bay ${intl?3:2} tiếng`:hub+" trước 20–30 phút"}`,`Về đến ${fN}`];
    else items=[`Ngày làm việc ${i} tại ${tN}`,local,jpDest?"Tối: tổng hợp biên bản, gửi báo cáo; nhớ danh thiếp (meishi) cho buổi hẹn":"Tối: tổng hợp biên bản, gửi báo cáo nhanh"];
    days.push({label,items});
  }
  if(note) days[Math.min(1,nights)].items.splice(1,0,"Ghi chú: "+note);
  cur.days=days;
  $("plan").innerHTML=days.map((d,i)=>`<div class="day"><h3>Ngày ${i+1} · ${d.label}</h3><ul>${d.items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`).join("");
  $("ai").textContent="";$("msg").textContent="";
  $("out").classList.remove("hidden");$("out").scrollIntoView({behavior:"smooth"});
}
function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function asText(){if(!cur)return"";return `Lịch trình công tác ${cur.fromT} → ${cur.toT} (${dmy(cur.d1)} - ${dmy(cur.d2)})\nPhương tiện: ${cur.opts[0].n}\n\n`+cur.days.map((d,i)=>`Ngày ${i+1} (${d.label})\n`+d.items.map(x=>"- "+x).join("\n")).join("\n\n")+($("ai").textContent?"\n\nGợi ý chi tiết:\n"+$("ai").textContent:"")}
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(asText());$("msg").textContent="Đã sao chép."}catch{$("msg").textContent="Trình duyệt chặn sao chép, hãy bôi đen để copy."}};

function loadSaved(){try{return JSON.parse(localStorage.getItem("trips")||"[]")}catch{return[]}}
function renderSaved(){const s=loadSaved();$("saved").innerHTML=s.length?s.map((t,i)=>`<li>${esc(t.fromT)} → ${esc(t.toT)}, ${dmy(t.d1)} - ${dmy(t.d2)} <button class="ghost" data-i="${i}">Mở</button> <button class="ghost" data-del="${i}">Xoá</button></li>`).join(""):'<li class="muted">Chưa có chuyến nào.</li>'}
$("save").onclick=()=>{const s=loadSaved();s.unshift({fromT:cur.fromT,toT:cur.toT,d1:cur.d1,d2:cur.d2,pax:cur.pax,pref:cur.pref,note:cur.note});try{localStorage.setItem("trips",JSON.stringify(s.slice(0,20)));$("msg").textContent="Đã lưu.";}catch{$("msg").textContent="Không lưu được trên trình duyệt này."}renderSaved()};
$("saved").onclick=e=>{const s=loadSaved();if(e.target.dataset.i){const t=s[e.target.dataset.i];$("from").value=t.fromT;$("to").value=t.toT;$("d1").value=t.d1;$("d2").value=t.d2;$("pax").value=t.pax;$("pref").value=t.pref;$("note").value=t.note||"";build()}
  if(e.target.dataset.del){s.splice(+e.target.dataset.del,1);try{localStorage.setItem("trips",JSON.stringify(s))}catch{}renderSaved()}};
renderSaved();

let sample=null;$("aiCard").classList.add("hidden");
(async()=>{try{if(window.claude&&claude.use){sample=await claude.use("sample");if(sample)$("aiCard").classList.remove("hidden")}}catch{}})();
$("aiBtn").onclick=async()=>{
  if(!sample||!cur)return;const btn=$("aiBtn");btn.disabled=true;$("ai").textContent="Đang soạn...";
  const where=cur.intl?"giữa Nhật Bản và Việt Nam":cur.jpDest?"ở Nhật Bản":"ở Việt Nam";
  const prompt=`Bạn là trợ lý lập kế hoạch đi công tác ${where}. Người dùng là người Việt đang sống ở Nhật. Viết bằng tiếng Việt, ngắn gọn, gạch đầu dòng theo từng ngày, không dùng markdown đậm/nghiêng. Khi nhắc tên ga, địa danh Nhật thì ghi kèm chữ Nhật.
Chuyến đi: từ ${cur.fromT} đến ${cur.toT}, đi ngày ${dmy(cur.d1)}, về ngày ${dmy(cur.d2)} (${cur.nights} đêm), ${cur.pax} người, ưu tiên: ${({fast:"nhanh",cheap:"tiết kiệm",comfort:"thoải mái"})[cur.pref]}.
Phương tiện đề xuất: ${cur.opts.map(o=>o.n).join(", ")}.
Ghi chú công việc: ${cur.note||"không có"}.
Hãy gợi ý: khung giờ khởi hành nên chọn, khu vực nên ở gần nơi làm việc, cách di chuyển từ sân bay/ga vào trung tâm và chi phí ước tính (tính bằng ${CUR==="JPY"?"yên":"đồng"}), lịch trình từng ngày, lưu ý thời tiết theo mùa${cur.intl?", giấy tờ nhập cảnh":""}, và danh sách đồ cần mang. Nói rõ giá chỉ là ước tính.`;
  try{await sample(prompt,{modelTier:"default",onText:({text})=>{$("ai").textContent=text}})}
  catch(err){$("ai").textContent=err&&err.code==="rate_limited"?"Đang quá tải, thử lại sau ít phút.":err&&err.code==="not_granted"?"Chưa được cấp quyền dùng Claude trên trang này.":"Không lấy được gợi ý: "+(err&&err.message||"lỗi")}
  btn.disabled=false};
