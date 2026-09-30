<div align="center">

# 🏛️ nhom1cnxh — Cổng Điều Hành & Bỏ Phiếu Vai Trò

**Nền tảng quản trị nhiệm vụ học tập & phân công vai trò theo thời gian thực (Realtime) dành cho Nhóm 1 — Môn Chủ nghĩa Xã hội Khoa học (CNXHKH)**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.3-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Status](https://img.shields.io/badge/Status-Production_Ready-10b981?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-Internal_Use-E11D48?style=for-the-badge)](#bản-quyền--license)

</div>

---

## 📖 Mục lục

- [Giới thiệu dự án](#-giới-thiệu-dự-án)
- [Bối cảnh & Mục tiêu dài hạn](#-bối-cảnh--mục-tiêu-dài-hạn)
- [Tính năng hệ thống](#-tính-năng-hệ-thống)
  - [1. Cơ chế quản lý đa tuần (Multi-week Architecture)](#1-cơ-chế-quản-lý-đa-tuần-multi-week-architecture)
  - [2. Đấu trường bỏ phiếu vai trò thời gian thực](#2-đấu-trường-bỏ-phiếu-vai-trò-thời-gian-thực)
  - [3. Quyền hạn Quản trị viên (Nhóm trưởng)](#3-quyền-hạn-quản-trị-viên-nhóm-trưởng)
  - [4. Đồng hồ đếm ngược Deadline từng giây](#4-đồng-hồ-đếm-ngược-deadline-từng-giây)
  - [5. Hệ thống xác thực mã PIN bảo mật](#5-hệ-thống-xác-thực-mã-pin-bảo-mật)
- [Danh sách 9 thành viên cố định](#-danh-sách-9-thành-viên-cố-định)
- [Kiến trúc công nghệ (Tech Stack)](#-kiến-trúc-công-nghệ-tech-stack)
- [Ngôn ngữ thiết kế & Trải nghiệm thị giác](#-ngôn-ngữ-thiết-kế--trải-nghiệm-thị-giác)
- [Bản quyền & License](#-bản-quyền--license)

---

## 🌟 Giới thiệu dự án

**nhom1cnxh** là Cổng thông tin điều hành và phân công vai trò trực tuyến thời gian thực (Role Voting & Management Portal) được phát triển riêng biệt cho **Nhóm 1 gồm 9 sinh viên Công nghệ thông tin theo học học phần Chủ nghĩa Xã hội Khoa học**.

Hệ thống số hóa toàn diện quy trình giao nhận bài tập nhóm, giải quyết triệt để vấn đề phân chia công việc:
- **Minh bạch & Công bằng:** Bỏ phiếu giành vai trò công khai, slot hiển thị trực quan theo thời gian thực.
- **Tức thì (Realtime 100%):** Khi một thành viên trên điện thoại bấm nhận vai trò, màn hình máy tính của tất cả thành viên còn lại lập tức nhảy số và hiện tên người nhận mà không cần tải lại trang (F5).
- **Trải nghiệm đẳng cấp:** Phong cách Cyber-Academic viễn tưởng kết hợp Dark Mode cao cấp với sắc đỏ son Ruby (`#E11D48`) và vàng hoàng gia (`#F59E0B`).

---

## 🎯 Bối cảnh & Mục tiêu dài hạn

- **Vòng đời sử dụng:** Website không phải là giải pháp dùng 1 lần, mà được **sử dụng xuyên suốt cả học kỳ** qua nhiều tuần học và nhiệm vụ khác nhau (Nhiệm vụ tuần 4, tuần 5, tuần 6... cho đến khi kết thúc môn học).
- **Chu trình vận hành hàng tuần:**
  1. Giảng viên công bố chủ đề và bài tập mới.
  2. Nhóm trưởng (Admin) khởi tạo nhiệm vụ tuần, đặt mục tiêu, mô tả sản phẩm cần bàn giao, ấn định thời hạn nộp (Deadline) và thiết lập cơ cấu các vai trò.
  3. 8 thành viên đăng nhập bằng mã PIN cá nhân để tham gia biểu quyết chọn vai trò phù hợp nhất với năng lực.
  4. Sau khi hoàn thành tuần học, dữ liệu được tự động lưu trữ (Archive) và mở ra tuần mới tinh.

---

## ⚡ Tính năng hệ thống

### 1. Cơ chế quản lý đa tuần (Multi-week Architecture)
- **Bộ chuyển tuần linh hoạt (Mission Selector):** Cho phép xem lại lịch sử các tuần cũ và tuần đang hoạt động (Active Week).
- **Lưu trữ nhiệm vụ (Archive):** Dữ liệu phân công và kết quả vote của tuần cũ được đóng băng và lưu trữ an toàn trong cơ sở dữ liệu.
- **Khởi tạo tuần mới tức thì:** Nhóm trưởng có thể mở nhiệm vụ tuần tiếp theo với tiêu đề, tóm tắt yêu cầu, hạn chót deadline và bộ vai trò hoàn toàn mới.

### 2. Đấu trường bỏ phiếu vai trò thời gian thực
- **Bento Grid trực quan:** Mỗi vai trò được thiết kế dạng thẻ công nghệ cao (Role Card) hiển thị:
  - Tên vai trò (MC Điều phối, Kịch bản & Câu hỏi, Kỹ thuật Game, Thiết kế Slide, Nghiên cứu nội dung...).
  - Mô tả chi tiết trách nhiệm và sản phẩm cụ thể cần bàn giao (DoD - Definition of Done).
  - Slot trực quan: Vòng tròn đại diện hiển thị Avatar định danh + Tên ngắn của những bạn đã xí chỗ (`[Đức Minh] [Trống] (1/2)`).
- **Quy tắc phân công công bằng:**
  - Mỗi thành viên chỉ được nhận **1 vai trò duy nhất** trong tuần đang mở.
  - Tự động khóa nút đăng ký (`Disabled`) kèm nhãn **"ĐÃ ĐỦ NGƯỜI"** khi số lượng đăng ký đạt mức tối đa (`current_slots == max_slots`).
  - Thành viên có quyền tự do đổi ý: Chuyển sang vai trò còn chỗ trống khác bất kỳ lúc nào trước khi hết hạn hoặc trước khi đóng cổng vote.
- **Thanh đo tiến độ nhận việc (Vote Progress):**
  - Tỷ lệ hoàn thành trực quan đếm chuẩn xác trên **8 thành viên** (ví dụ: `8/8 ĐÃ NHẬN VIỆC`).
  - Thanh đo hiệu ứng Shimmer phát sáng chuyển màu gradient từ đỏ sang vàng.
  - Hàng avatar thành viên đã đăng ký với hiệu ứng động mượt mà.

### 3. Quyền hạn Quản trị viên (Nhóm trưởng)
*Dành riêng và duy nhất cho Trưởng nhóm: **Đào Đức Minh** (`user_1`)*

- 👑 **Miễn trừ bình chọn:** Tài khoản Nhóm trưởng giữ vai trò điều phối tối cao, không cần tham gia vote chiếm slot của nhóm.
- ✏️ **Chỉnh sửa chi tiết vai trò trực tiếp (Inline Editing):**
  - Bấm nút **"Sửa"** ngay trên từng thẻ vai trò để chỉnh sửa tức thì Tên vai trò, Mô tả công việc, Số lượng slot (`max_slots`).
  - Lưu trực tiếp vào Database trong nền mà **không làm tải lại trang hay gián đoạn giao diện**.
- 🖐️ **Kéo thả 2D sắp xếp thứ tự vai trò (Native 2D Drag & Drop):**
  - Giữ chuột vào biểu tượng `⋮⋮` trên bất kỳ thẻ nào để kéo thả đổi vị trí trực tiếp trong lưới 2 chiều.
  - Thẻ bám dính theo chuột mượt mà, thẻ đích tự động bật viền đỏ Neon Ruby báo hiệu vị trí thả.
  - Tích hợp 2 nút mũi tên **`◀`** và **`▶`** để hoán đổi vị trí nhanh chỉ với 1 cú click hoặc chạm tay trên điện thoại.
  - Thứ tự mới (`order_index`) được lưu duy nhất 1 lần khi thả chuột (onDrop).
- 🔄 **Điều phối nhân sự tối cao (Override):**
  - Rê chuột vào avatar của thành viên trong ô slot để bấm nút **`✕`** hủy vai trò nếu bạn đó vote nhầm.
  - Chọn bất kỳ thành viên nào trong nhóm để chuyển họ sang một vai trò chỉ định trong bảng điều khiển.
- 🔒 **Đóng / Mở cổng bình chọn:** Khóa hoặc mở quyền nhận vai trò bất cứ lúc nào chỉ với 1 click.
- ⚠️ **Reset biểu quyết:** Xóa toàn bộ phiếu bầu của nhiệm vụ tuần hiện tại khi cần tổ chức phân công lại.

### 4. Đồng hồ đếm ngược Deadline từng giây
- **Công nghệ Number Ticker độc lập:**
  - Tách biệt từng chữ số hàng chục và hàng đơn vị thành các ô định vị đồng tâm (`absolute inset-0`).
  - Số giây nhảy mượt mà từng giây mà chữ số hàng chục không bị rung lắc hay đè lồng nét chữ lên nhau.
- **Cảnh báo hạn chót:** Đếm ngược chính xác đến từng giây (Ngày : Giờ : Phút : Giây) và tự động kích hoạt trạng thái **"HẾT HẠN"** viền đỏ neon khi chạm mốc thời gian quy định.

### 5. Hệ thống xác thực mã PIN bảo mật
- **Không cần email rườm rà:** Hệ thống định danh đúng 9 thành viên nội bộ.
- **Khởi tạo lần đầu:** Thành viên chọn tên mình, hệ thống nhận diện và yêu cầu tạo mã PIN cá nhân (4–6 số).
- **Đăng nhập những lần sau:** Nhập đúng mã PIN để mở khóa phiên làm việc.
- **Quản lý phiên:** Tự động lưu session trên trình duyệt, hỗ trợ nút chuyển đổi tài khoản linh hoạt.

---

## 👥 Danh sách 9 thành viên cố định

Hệ thống được cấu hình khép kín dành riêng cho 9 thành viên Nhóm 1, không cho phép người ngoài đăng ký:

| Mã ID | Họ và tên đầy đủ | Tên hiển thị ngắn | Vai trò trong hệ thống | Quyền hạn |
| :---: | :--- | :---: | :--- | :---: |
| `user_1` | **Đào Đức Minh** | **Đức Minh** | 👑 Nhóm trưởng / Điều hành chính | **Admin (Tối cao)** |
| `user_2` | **Trần Hải Đăng** | **Hải Đăng** | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_3` | **Nguyễn Văn Nam** | **Văn Nam** | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_4` | **Bùi Minh Lâm** | **Minh Lâm** | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_5` | **Nguyễn Viết Ngọc Duy** | **Ngọc Duy** | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_6` | **Trần Viết Cường** | **Viết Cường** | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_7` | **Lưu Thế An** | **Thế An** | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_8` | **Đặng Quốc Khánh** | **Quốc Khánh** | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_9` | **Nguyễn Đức Anh** | **Đức Anh** | 👤 Thành viên Nhóm 1 | Thành viên |

*Quy tắc hiển thị: Tên gọi ngắn gọn được hiển thị trên thẻ và avatar, rê chuột (Tooltip) sẽ hiển thị đầy đủ Họ và tên.*

---

## 🛠️ Kiến trúc công nghệ (Tech Stack)

| Lớp kiến trúc | Công nghệ | Chi tiết ứng dụng |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router)** | Kiến trúc React Server Components kết hợp Client Components tối ưu hiệu năng |
| **Ngôn ngữ** | **TypeScript 5.x** | Kiểm soát kiểu dữ liệu tĩnh nghiêm ngặt (Type-safe), loại trừ lỗi runtime |
| **Styling & Theme** | **Tailwind CSS 3.4** | Hệ thống utility-first tùy biến bảng màu Dark Mode, Glassmorphism, Neon glow |
| **Cơ sở dữ liệu & Realtime** | **Supabase (PostgreSQL)** | Lưu trữ quan hệ, quản lý bảo mật Row Level Security (RLS) và WebSockets Realtime Channel |
| **Animation Engine** | **Framer Motion 11.3** | Vật lý lò xo (Spring physics), Layout animations, Number ticker, Stagger list |
| **Thông báo** | **React Hot Toast** | Hệ thống thông báo toast pop-up một lần (Single Instance, chống spam) |
| **Icons** | **Lucide React** | Bộ icon vector tối giản, sắc sảo chuẩn công nghệ hiện đại |
| **Nền tảng Cloud** | **Vercel** | Triển khai Edge Network toàn cầu với HTTPS tự động và CI/CD tức thì |

---

## 🎨 Ngôn ngữ thiết kế & Trải nghiệm thị giác

Ứng dụng được thiết kế theo phong cách **Futuristic Cyber-Academic** độc đáo, kết hợp tinh thần học thuật cách mạng của môn học với ngôn ngữ thị giác công nghệ tương lai:

### Bảng màu nhận diện thương hiệu
- **Onyx Space Background (`#07070D` - `#0A0A0F`):** Không gian đen huyền bí, tạo chiều sâu thị giác vô cực.
- **Crimson / Ruby Red (`#E11D48`):** Sắc đỏ son rực rỡ, biểu tượng cho nhiệt huyết cách mạng và tinh thần xung kích của Nhóm 1.
- **Imperial Gold (`#F59E0B`):** Vàng ánh kim sang trọng tượng trưng cho quyền năng Nhóm trưởng, hạn chót deadline và trạng thái đã xác nhận.
- **Emerald Green (`#10B981`):** Xanh ngọc phát sáng báo hiệu vị trí còn trống và trạng thái hệ thống hoạt động ổn định.

### Hiệu ứng hình ảnh đa tầng (Multi-layer Atmospheric Effects)
- **Khối cầu Cực quang Hơi thở (Floating Aurora Orbs):** Các quả cầu ánh sáng đỏ Ruby 650px và vàng hoàng gia 550px chuyển động trôi chậm và phập phồng ở các góc màn hình với độ nhòe sâu (`blur-[140px]`).
- **Chùm sáng vòm đỉnh (Top Cyber Spotlight):** Vệt sáng tỏa rộng 1200px chiếu từ đỉnh trang tạo hiệu ứng sân khấu điện ảnh.
- **Ma trận lưới vi mạch (Cyber Grid & Dots):** Hệ thống lưới công nghệ 48px với tâm sáng tập trung ở giữa, mờ dần về các góc (`radial-gradient mask`).
- **Bụi sao Cyber lơ lửng (Floating Particles):** Các hạt photon đỏ và vàng trôi dạt ngẫu nhiên, tự động nhấp nháy tạo bầu không khí sống động.
- **Glassmorphism cao cấp:** Thẻ nội dung làm mờ nền kính (`backdrop-blur-xl`), viền sáng mảnh phản chiếu ánh neon tinh tế.

---

## 📄 Bản quyền & License

Dự án **nhom1cnxh** được phát triển và vận hành phục vụ nội bộ **Nhóm 1 — Môn học Chủ nghĩa Xã hội Khoa học**.

> [!IMPORTANT]
> Toàn bộ bản quyền kiến trúc và giao diện thuộc về Nhóm 1. Mọi thắc mắc và đóng góp kỹ thuật xin vui lòng liên hệ Trưởng nhóm **Đào Đức Minh**.
