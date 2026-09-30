<div align="center">

# 🏛️ nhom1cnxh — Cổng Điều Hành & Bỏ Phiếu Vai Trò

**Nền tảng quản lý nhiệm vụ học tập và phân công vai trò theo thời gian thực (Realtime) dành cho Nhóm 1 — Môn Chủ nghĩa Xã hội Khoa học (CNXHKH)**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.3-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-Internal_Use-E11D48?style=for-the-badge)](#bản-quyền--license)

</div>

---

## 📖 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Tech Stack](#-tech-stack)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
  - [Bước 1: Cài đặt dependencies](#bước-1-cài-đặt-dependencies)
  - [Bước 2: Tạo project Supabase & Khởi chạy Database](#bước-2-tạo-project-supabase--khởi-chạy-database)
  - [Bước 3: Cấu hình biến môi trường](#bước-3-cấu-hình-biến-môi-trường)
  - [Bước 4: Bật tính năng Realtime](#bước-4-bật-tính-năng-realtime)
  - [Bước 5: Chạy ứng dụng](#bước-5-chạy-ứng-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
  - [1. Đăng nhập & Xác thực PIN](#1-đăng-nhập--xác-thực-pin)
  - [2. Trang Tổng quan (Dashboard)](#2-trang-tổng-quan-dashboard)
  - [3. Bỏ phiếu vai trò (Voting Page)](#3-bỏ-phiếu-vai-trò-voting-page)
  - [4. Bảng điều khiển Quản trị viên (Admin Panel)](#4-bảng-điều-khiển-quản-trị-viên-admin-panel)
- [Danh sách thành viên cố định](#-danh-sách-thành-viên-cố-định)
- [Hướng dẫn triển khai (Deployment)](#-hướng-dẫn-triển-khai-deployment)
- [Hệ thống thiết kế (Design System)](#-hệ-thống-thiết-kế-design-system)
- [Bản quyền & License](#-bản-quyền--license)

---

## 🌟 Giới thiệu

**nhom1cnxh** là ứng dụng web nội bộ được phát triển chuyên biệt phục vụ công tác điều phối, quản trị bài tập và bỏ phiếu chọn vai trò (role assignment) cho **Nhóm 1 môn học Chủ nghĩa Xã hội Khoa học**.

Hệ thống giải quyết bài toán phân chia công việc minh bạch, công bằng và tức thì, loại bỏ hoàn toàn tình trạng trùng vai, thiếu người hoặc tranh chấp vai trò qua tin nhắn thông thường.

### Điểm nhấn chính:
- **Cập nhật thời gian thực (Realtime):** Mọi thao tác chọn vai, rút lui, đổi vai hoặc khóa biểu quyết của Admin được đồng bộ ngay tức khắc tới toàn bộ thành viên mà không cần tải lại trang.
- **Hỗ trợ đa tuần (Multi-week Missions):** Quản lý linh hoạt các chặng học tập theo từng tuần với mục tiêu, mô tả, yêu cầu sản phẩm và thời hạn deadline riêng biệt.
- **Bảo mật nội bộ 9 thành viên:** Danh sách 9 thành viên được định danh cố định trong cơ sở dữ liệu. Xác thực tài khoản bằng **mã PIN 4–6 chữ số** tự tạo trong lần đăng nhập đầu tiên, loại bỏ việc đăng ký bừa bãi từ người ngoài.

---

## ⚡ Tính năng nổi bật

- 🔐 **Xác thực mã PIN an toàn:** Không cần mật khẩu rườm rà hay email phức tạp. Thành viên chọn tên mình và nhập mã PIN để xác thực phiên làm việc.
- ⏱️ **Đồng hồ đếm ngược Realtime:** Đếm ngược từng giây đến hạn chót (Deadline) của từng nhiệm vụ, tự động cảnh báo khi sắp hết hạn.
- 🗳️ **Bỏ phiếu tương tác linh hoạt:** 
  - Hiển thị trực quan số lượng vị trí tối đa (`max_slots`) của từng vai trò.
  - Hiển thị avatar cùng tên của các thành viên đang giữ slot.
  - Cho phép thành viên tự do đổi ý, rút khỏi vai trò hoặc chuyển sang vai trò khác bất cứ khi nào (khi phiên vote đang mở).
  - Tự động khóa nút chọn khi vai trò đã đủ chỉ tiêu.
- 📊 **Thanh đo tiến độ trực quan (Vote Progress):** Thống kê số lượng thành viên đã hoàn thành chọn vai trên tổng số 9 người theo thời gian thực.
- 👑 **Bảng điều khiển Quản trị viên toàn năng (Admin Drawer):** Dành riêng cho Trưởng nhóm (**Đào Đức Minh**):
  - Tạo mới, kích hoạt hoặc chỉnh sửa nhiệm vụ các tuần tiếp theo.
  - Thiết lập danh mục vai trò, số lượng slot và thứ tự ưu tiên.
  - Bật/tắt trạng thái mở cổng bình chọn (`is_voting_open`).
  - Điều phối nhanh: Gán trực tiếp hoặc di dời thành viên giữa các vai trò khi có phân công đặc biệt.
  - Reset lại toàn bộ lượt bình chọn của tuần khi cần tổ chức bầu lại.

---

## 🛠️ Tech Stack

| Công nghệ | Phiên bản | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Next.js** | `14.2.5` | Framework React hiện đại với App Router, tối ưu hóa Server Components và Client Interactivity |
| **TypeScript** | `5.x` | Hệ thống Type-safe tĩnh toàn diện, đảm bảo độ tin cậy và hạn chế lỗi runtime |
| **Tailwind CSS** | `3.4.6` | Tiện ích CSS thiết kế giao diện tối tân: Dark Cyberpunk & Glassmorphism |
| **Supabase** | `2.45.0` | Nền tảng Backend-as-a-Service: Cơ sở dữ liệu PostgreSQL và WebSockets Realtime |
| **Framer Motion** | `11.3.0` | Thư viện hoạt ảnh mượt mà cho hiệu ứng Drawer, Modal, Chuyển tab và Avatar badge |
| **React Hot Toast** | `2.4.1` | Hệ thống thông báo toast pop-up sinh động, thẩm mỹ |
| **React Icons** | `5.2.1` | Bộ icon đồ họa phong phú (HeroIcons, Lucide, FontAwesome) |
| **Date-fns** | `3.6.0` | Xử lý và định dạng ngày giờ chuẩn xác theo múi giờ Việt Nam (GMT+7) |

---

## 🚀 Hướng dẫn cài đặt

Thực hiện lần lượt các bước sau để thiết lập môi trường phát triển cục bộ:

### Bước 1: Cài đặt dependencies

Mở terminal tại thư mục gốc của dự án (`e:\project code\web cnxh`) và chạy:

```bash
npm install
```

### Bước 2: Tạo project Supabase & Khởi chạy Database

1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập hoặc đăng ký tài khoản.
2. Chọn **"New Project"**, đặt tên dự án (ví dụ: `nhom1cnxh`) và mật khẩu cơ sở dữ liệu mạnh, chọn vùng gần nhất (ví dụ: `Singapore - ap-southeast-1`).
3. Sau khi dự án khởi tạo xong, click vào biểu tượng **SQL Editor** ở thanh điều hướng bên trái.
4. Mở file `schema.sql` có sẵn trong mã nguồn dự án, sao chép toàn bộ nội dung và dán vào SQL Editor của Supabase.
5. Nhấn **Run** (hoặc `Ctrl + Enter`) để thực thi. Tập lệnh này sẽ tự động:
   - Kích hoạt extension `uuid-ossp`.
   - Tạo cấu trúc 4 bảng: `users`, `missions`, `roles`, `votes`.
   - Thiết lập các chỉ mục (indexes) tối ưu hóa truy vấn.
   - Nạp dữ liệu mẫu ban đầu: **9 thành viên cố định** và **Nhiệm vụ mẫu Tuần 4** (kèm 6 vai trò cụ thể).
   - Thiết lập chính sách bảo mật Row Level Security (RLS).
   - Thêm các bảng vào cơ chế xuất bản Realtime (`supabase_realtime`).
6. Vào **Project Settings** > **API**, sao chép 2 thông số:
   - **Project URL**
   - **Project API keys** (khóa `anon` / `public`)

### Bước 3: Cấu hình biến môi trường

1. Tạo file `.env.local` tại thư mục gốc bằng cách sao chép từ `.env.local.example`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Mở file `.env.local` và điền chính xác thông tin vừa lấy ở Bước 2:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

### Bước 4: Bật tính năng Realtime

Để tính năng bình chọn tức thì hoạt động trơn tru:
1. Trong màn hình quản trị của Supabase Dashboard, điều hướng đến **Database** > **Replication**.
2. Tìm mục **Source** (thường là bảng `supabase_realtime`).
3. Đảm bảo công tắc Realtime đã được **BẬT (Enabled)** cho 3 bảng:
   - `votes`
   - `missions`
   - `roles`
*(Lưu ý: Script `schema.sql` đã tự động cấu hình lệnh này, bạn chỉ cần kiểm tra lại để xác nhận).*

### Bước 5: Chạy ứng dụng

Khởi chạy môi trường phát triển cục bộ:

```bash
npm run dev
```

Mở trình duyệt web và truy cập địa chỉ: [http://localhost:3000](http://localhost:3000)

---

## 📁 Cấu trúc thư mục

```
web cnxh/
├── .env.local.example        # Mẫu biến môi trường kết nối Supabase
├── next.config.ts            # Cấu hình Next.js (TypeScript)
├── package.json              # Khai báo thư viện và script npm
├── postcss.config.js         # Cấu hình PostCSS cho Tailwind
├── README.md                 # Tài liệu hướng dẫn toàn diện dự án
├── schema.sql                # Toàn bộ mã nguồn DDL SQL và Seed data Supabase
├── tailwind.config.ts        # Bảng màu chủ đạo, font và hiệu ứng giao diện
├── tsconfig.json             # Cấu hình biên dịch TypeScript
└── src/
    ├── app/                  # Next.js App Router
    │   ├── globals.css       # CSS toàn cục, style thanh cuộn, hiệu ứng kính mờ
    │   ├── layout.tsx        # Root layout, tích hợp AuthProvider và Toast container
    │   ├── page.tsx          # Trang Dashboard chính (Tổng quan nhiệm vụ & tiến độ)
    │   ├── login/
    │   │   └── page.tsx      # Trang đăng nhập thành viên & xác thực mã PIN
    │   └── vote/
    │       └── page.tsx      # Màn hình bỏ phiếu vai trò thời gian thực theo nhiệm vụ
    ├── components/           # Các UI Component tái sử dụng
    │   ├── AdminDrawer.tsx   # Panel điều hành của Quản trị viên (Admin controls)
    │   ├── CountdownTimer.tsx # Bộ đếm ngược deadline thời gian thực với cảnh báo màu
    │   ├── Header.tsx        # Thanh điều hướng trên cùng, hiển thị profile và actions
    │   ├── MissionSelector.tsx # Hộp chọn tuần học và nhiệm vụ tương ứng
    │   ├── RoleCard.tsx      # Thẻ hiển thị vai trò, số slot, avatar thành viên và nút vote
    │   ├── UserAvatar.tsx    # Avatar định danh thành viên với màu gradient phong cách
    │   └── VoteProgress.tsx  # Thanh phần trăm thể hiện tiến độ hoàn thành biểu quyết
    ├── contexts/
    │   └── AuthContext.tsx   # Context React lưu trữ và kiểm soát phiên làm việc người dùng
    ├── hooks/
    │   └── useRealtimeVotes.ts # Custom hook bắt sự kiện lắng nghe Postgres Realtime
    └── lib/                  # Thư viện dùng chung
        ├── constants.ts      # Danh sách 9 thành viên khởi tạo, màu sắc và hằng số hệ thống
        ├── supabase.ts       # Đối tượng Supabase Client dùng chung
        ├── types.ts          # Định nghĩa kiểu dữ liệu TypeScript (User, Mission, Role, Vote)
        └── utils.ts          # Các hàm tiện ích hỗ trợ định dạng thời gian, chuỗi
```

---

## 💡 Hướng dẫn sử dụng

### 1. Đăng nhập & Xác thực PIN
1. Khi truy cập lần đầu, người dùng sẽ tự động được điều hướng đến trang `/login`.
2. Chọn tên của bạn trong danh sách lưới **9 thành viên**.
3. **Đăng nhập lần đầu:**
   - Hệ thống phát hiện tài khoản chưa có mã bảo vệ và hiển thị giao diện **"Khởi tạo mã PIN bảo vệ"**.
   - Nhập một mã số cá nhân (gồm **4 đến 6 chữ số**) và nhấn **"Lưu mã PIN & Đăng nhập"**.
4. **Các lần đăng nhập tiếp theo:**
   - Chọn tên và nhập chính xác mã PIN đã tạo.
   - Nhấn **"Xác nhận"** để vào hệ thống.

---

### 2. Trang Tổng quan (Dashboard)
Tại trang chủ (`/`):
- **Thông tin nhiệm vụ:** Xem tiêu đề tuần học, mô tả yêu cầu sản phẩm bàn giao (Slide, Mini-game, Outline, v.v.).
- **Đồng hồ đếm ngược:** Theo dõi sát sao thời gian còn lại đến hạn chót (Deadline).
- **Bộ chuyển tuần:** Xem lại lịch sử các tuần trước hoặc chuyển tới tuần học mới nhất.
- **Tiến độ bầu chọn:** Xem nhanh có bao nhiêu bạn trong nhóm đã chốt vai trò.
- **Nút hành động:** Nhấn **"Tham gia chọn vai trò ngay"** để chuyển sang trang bình chọn.

---

### 3. Bỏ phiếu vai trò (Voting Page)
Tại trang `/vote`:
- Danh sách các vai trò cần thiết cho nhiệm vụ được hiển thị dạng thẻ lưới (Grid Card).
- Mỗi thẻ vai trò hiển thị:
  - Tên vai trò & Mô tả công việc cụ thể.
  - Chỉ tiêu số lượng người (`Đã chọn: X / Y`).
  - Danh sách avatar và tên các bạn đang giữ vị trí đó.
- **Cách thức chọn:**
  - Nhấn nút **"Nhận vai trò này"** để đăng ký.
  - Nếu đã đăng ký và muốn đổi sang vai trò khác: Bạn có thể chọn trực tiếp vai trò mới (hệ thống sẽ tự động chuyển slot) hoặc bấm **"Hủy đăng ký"** để quay về trạng thái chưa chọn.
  - Khi vai trò đã đủ người (`Full`), nút đăng ký sẽ chuyển sang trạng thái vô hiệu hóa.
  - Khi quản trị viên đóng cổng biểu quyết, các nút bấm sẽ bị khóa và hiển thị nhãn `Bình chọn đã đóng`.

---

### 4. Bảng điều khiển Quản trị viên (Admin Panel)
*Tính năng độc quyền dành riêng cho tài khoản Quản trị viên: **Đào Đức Minh** (`user_1`)*

Khi đăng nhập bằng tài khoản Admin, trên thanh Header sẽ xuất hiện nút **"Quản trị"** kèm biểu tượng vương miện 👑:
- **Quản lý nhiệm vụ (Missions):**
  - Tạo nhiệm vụ tuần mới, nhập tiêu đề, mô tả yêu cầu và chọn hạn chót deadline.
  - Chuyển đổi nhiệm vụ đang hoạt động (`is_active`).
- **Quản lý vai trò (Roles):**
  - Thêm vai trò mới, sửa đổi tên và mô tả vai trò.
  - Cấu hình số slot giới hạn tối đa (`max_slots`) cho từng vai trò.
  - Xóa các vai trò không còn cần thiết.
- **Điều khiển cổng biểu quyết:**
  - Nút chuyển trạng thái **Mở bình chọn / Khóa bình chọn** nhanh chóng chỉ với 1 click.
- **Điều phối nhân sự trực tiếp:**
  - Cho phép Admin kéo/chuyển thành viên bất kỳ vào đúng vai trò trong trường hợp có chỉ định đặc biệt.
- **Reset biểu quyết:**
  - Làm trống toàn bộ phiếu bầu của tuần đó để tổ chức chọn lại từ đầu khi có sự thay đổi lớn.

---

## 👥 Danh sách thành viên cố định

Hệ thống được thiết kế khép kín dành cho đúng 9 thành viên của Nhóm 1 môn CNXHKH:

| Mã định danh (ID) | Họ và tên thành viên | Tên thường gọi | Vai trò trong hệ sinh thái | Quyền Quản trị |
| :---: | :--- | :--- | :--- | :---: |
| `user_1` | **Đào Đức Minh** | Đức Minh | 👑 Trưởng nhóm / Điều hành chính | **Admin (Toàn quyền)** |
| `user_2` | **Trần Hải Đăng** | Hải Đăng | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_3` | **Nguyễn Văn Nam** | Văn Nam | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_4` | **Bùi Minh Lâm** | Minh Lâm | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_5` | **Nguyễn Viết Ngọc Duy** | Ngọc Duy | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_6` | **Trần Viết Cường** | Viết Cường | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_7` | **Lưu Thế An** | Thế An | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_8` | **Đặng Quốc Khánh** | Quốc Khánh | 👤 Thành viên Nhóm 1 | Thành viên |
| `user_9` | **Nguyễn Đức Anh** | Đức Anh | 👤 Thành viên Nhóm 1 | Thành viên |

---

## 🌐 Hướng dẫn triển khai (Deployment)

### Phương án 1: Triển khai trên Vercel (Khuyên dùng)
1. Đẩy mã nguồn dự án lên kho lưu trữ GitHub cá nhân hoặc tổ chức.
2. Truy cập [Vercel Dashboard](https://vercel.com) và chọn **"Add New Project"**.
3. Nhập kho lưu trữ GitHub chứa dự án `web-cnxh`.
4. Tại phần **Environment Variables**, khai báo 2 biến môi trường:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Nhấn **Deploy**. Vercel sẽ tự động tối ưu hóa bản build và cung cấp tên miền HTTPS miễn phí tốc độ cao.

### Phương án 2: Tự lưu trữ (Self-hosted Node.js Server)
Chạy lệnh biên dịch mã nguồn production:

```bash
# 1. Biên dịch dự án tối ưu hóa
npm run build

# 2. Khởi động server production tại cổng mặc định 3000
npm run start
```

*(Có thể sử dụng PM2 hoặc Docker để quản lý tiến trình nền trên VPS).*

---

## 🎨 Hệ thống thiết kế (Design System)

Giao diện ứng dụng tuân thủ nghiêm ngặt bảng màu nhận diện hiện đại, trực quan và đậm chất công nghệ:

| Thành phần | Mã màu Hex | Ý nghĩa & Ứng dụng |
| :--- | :---: | :--- |
| **Background** | `#0A0A0F` | Nền tối sâu thẳm, dịu mắt, làm nổi bật các khối nội dung |
| **Surface** | `#1A1A2E` | Bề mặt các Card, Thẻ vai trò, Modal với hiệu ứng kính mờ Glassmorphism |
| **Border** | `#2A2A3E` | Đường viền mảnh tinh tế, phân tách các thành phần rõ ràng |
| **Primary Red** | `#E11D48` | Màu đỏ điểm nhấn thương hiệu (Rose-600), thể hiện tinh thần xung kích |
| **Accent Gold** | `#F59E0B` | Màu vàng quyền lực tượng trưng cho vương miện Admin, hạn chót deadline |
| **Text Main** | `#F1F1F1` | Chữ trắng xám sáng rõ, độ tương phản cao, dễ đọc trên nền tối |

---

## 📄 Bản quyền & License

Dự án được xây dựng phục vụ nhu cầu học tập và quản trị nội bộ của **Nhóm 1 — Môn học Chủ nghĩa Xã hội Khoa học**.

> [!NOTE]
> Nghiêm cấm phân phối thương mại khi chưa có sự đồng ý của toàn thể thành viên Nhóm 1. Mọi đóng góp cải tiến kỹ thuật vui lòng liên hệ Trưởng nhóm **Đào Đức Minh**.
