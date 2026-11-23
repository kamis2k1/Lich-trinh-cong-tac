# Lịch trình công tác

Web lên lịch trình đi công tác cho chặng trong Nhật Bản, trong Việt Nam và Nhật ⇄ Việt Nam.

- Nhập điểm đi, điểm đến, ngày đi, ngày về.
- Gợi ý phương tiện (máy bay, Shinkansen/tàu, xe buýt, ô tô) với thời gian và giá ước tính.
- Lịch trình theo ngày, sao chép hoặc lưu lại trong trình duyệt.
- Liên kết mở sẵn trang đặt vé và khách sạn (Google Flights, Skyscanner, smart EX, Eki-net, NAVITIME, Rakuten Travel, Jalan, Booking.com, Agoda...).

Trang tĩnh (HTML + JS), chạy trên GitHub Pages: https://kamis2k1.github.io/lich-trinh-cong-tac/

## Kiểm thử

52 tình huống tự động chạy trên Chrome thật (Playwright): bỏ trống, ngày sai/quá khứ/quá xa, điểm đi trùng điểm đến (nhiều cách viết), địa điểm không tồn tại, mất mạng, chèn mã HTML/JS, số người không hợp lệ, giờ đi/đến, bấm liên tục, lưu/mở/xoá chuyến, chặn bộ nhớ, giao diện điện thoại/máy tính bảng/máy tính, nền tối, nhãn truy cập, link ngoài.

```
npm install
npm run serve &   # mở http://127.0.0.1:8080
npm test
```
