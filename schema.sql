-- =============================================
-- NHOM1CNXH - Role Voting & Management Portal
-- Supabase PostgreSQL Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: users
-- Fixed 9 members, no registration allowed
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  pin_code TEXT DEFAULT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: missions (multi-week support)
-- =============================================
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  deadline TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  is_voting_open BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: roles
-- =============================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  max_slots INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: votes
-- Each user can only vote once per mission
-- =============================================
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mission_id, user_id)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_roles_mission ON roles(mission_id);
CREATE INDEX IF NOT EXISTS idx_votes_mission ON votes(mission_id);
CREATE INDEX IF NOT EXISTS idx_votes_role ON votes(role_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(is_active);

-- =============================================
-- SEED DATA: 9 Fixed Users
-- =============================================
INSERT INTO users (id, full_name, short_name, is_admin) VALUES
  ('user_1', 'Đào Đức Minh', 'Đức Minh', TRUE),
  ('user_2', 'Trần Hải Đăng', 'Hải Đăng', FALSE),
  ('user_3', 'Nguyễn Văn Nam', 'Văn Nam', FALSE),
  ('user_4', 'Bùi Minh Lâm', 'Minh Lâm', FALSE),
  ('user_5', 'Nguyễn Viết Ngọc Duy', 'Ngọc Duy', FALSE),
  ('user_6', 'Trần Viết Cường', 'Viết Cường', FALSE),
  ('user_7', 'Lưu Thế An', 'Thế An', FALSE),
  ('user_8', 'Đặng Quốc Khánh', 'Quốc Khánh', FALSE),
  ('user_9', 'Nguyễn Đức Anh', 'Đức Anh', FALSE)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED DATA: Sample Missions (Week 4 Archived, Week 5 Active)
-- =============================================
INSERT INTO missions (id, week_number, title, description, deadline, is_active, is_voting_open) VALUES
  ('00000000-0000-0000-0000-000000000001', 4, 'NHIỆM VỤ 4: DÂN CHỦ XÃ HỘI CHỦ NGHĨA & BẢN CHẤT DÂN CHỦ XHCN',
   'Mục tiêu: Phân tích bản chất của nền dân chủ XHCN và so sánh với dân chủ tư sản.\nYêu cầu: Thuyết trình nhóm 15 phút + Slide + Mini-game tương tác.\nSản phẩm bàn giao: File slide (.pptx), kịch bản MC, bộ câu hỏi quiz.',
   '2026-10-05T17:00:00+07:00', FALSE, FALSE),
  ('00000000-0000-0000-0000-000000000002', 5, 'NHIỆM VỤ 5: TÌM HIỂU VỀ LIÊN MINH GIAI CẤP',
   'Mục tiêu: Mỗi nhóm thiết kế 1 sản phẩm infographic về liên minh giai cấp (tính tất yếu của liên minh, nội dung liên minh, nguyên tắc liên minh...). Web tương tác: https://cnxh-week5-nhom1.vercel.app/\nHạn nộp: Trước 17:00 ngày 12/10/2026.',
   '2026-10-12T17:00:00+07:00', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Roles for Week 5
-- =============================================
INSERT INTO roles (mission_id, title, description, max_slots, order_index) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Xuất file Infographic Master (Ảnh PNG 4K & PDF in ấn)', 'Dùng extension GoFullPage (hoặc công cụ chụp full-page) cuộn từ đầu đến cuối web để xuất ra 1 file ảnh PNG dài độ phân giải cao và 1 file PDF nét căng (không vỡ hạt, không lệch font) làm file nộp chính.', 1, 0),
  ('00000000-0000-0000-0000-000000000002', 'Soát lỗi học thuật & Chuẩn hóa thuật ngữ', 'Đọc rà soát từng dòng chữ trên web cnxh-week5-nhom1.vercel.app, đối chiếu trực tiếp với Giáo trình CNXHKH (Chương 5): bắt lỗi chính tả, dấu câu, kiểm tra xem có câu chữ nào lệch chuẩn lý luận không để báo lại chỉnh sửa.', 1, 1),
  ('00000000-0000-0000-0000-000000000002', 'Viết bản Thuyết minh học thuật (1 - 2 trang A4 Docs)', 'Viết văn bản giải thích ý đồ cấu trúc Infographic: Luận giải cơ cấu 4 giai cấp/tầng lớp; Phân tích sâu tính tất yếu (góc độ kinh tế & chính trị - xã hội); 3 trụ cột nội dung (nhấn mạnh kinh tế là quyết định nhất) và 3 nguyên tắc bất biến; Phân tích mô hình thực tiễn chuỗi liên kết "4 Nhà" tại Việt Nam. Xuất PDF kẹp chung vào bài nộp Padlet.', 2, 2),
  ('00000000-0000-0000-0000-000000000002', 'QA & Test tương tác đa thiết bị', 'Mở web trên nhiều dòng máy (iPhone Safari, Android Chrome, iPad, Laptop màn hình nhỏ), test bấm thử toàn bộ các tab, toggle switch trên widget macOS, kiểm tra xem có chỗ nào bị tràn chữ (overflow) hay giật lag không.', 1, 3),
  ('00000000-0000-0000-0000-000000000002', 'Quay video Teaser / Screen Record Showcase (30 - 45s)', 'Quay màn hình máy tính chất lượng 1080p/60fps: cuộn mượt mà từ Hero → phần đổi nền sáng → thao tác bấm chuyển đổi trên Widget Alliance OS → chân trang. Xuất video MP4 để đính kèm link Drive vào Padlet.', 1, 4),
  ('00000000-0000-0000-0000-000000000002', 'Tạo QR Code Hub & Đóng gói Poster bìa', 'Tạo 1 mã QR chuẩn dẫn thẳng về https://cnxh-week5-nhom1.vercel.app/. Chèn mã QR này vào góc trên cùng của file ảnh Infographic (kèm dòng chữ: "Quét mã QR để trải nghiệm bản Infographic Tương tác Số hóa").', 1, 5),
  ('00000000-0000-0000-0000-000000000002', 'Soạn kịch bản thuyết trình 2 phút & Nộp Padlet', 'Viết sẵn 1 dàn ý nói nhanh 2 phút (để nếu lên lớp cô yêu cầu nhóm đứng dậy trình bày 1-2 phút về sản phẩm thì có người đại diện nói ngay). Soạn nội dung bài đăng, tải toàn bộ file (Ảnh + PDF + Thuyết minh + Link web) nộp lên Padlet trước hạn 17h ngày 12/10.', 1, 6)
ON CONFLICT DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for this internal tool
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to missions" ON missions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to roles" ON roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to votes" ON votes FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- REALTIME PUBLICATION
-- Enable realtime for votes, missions, roles tables
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
ALTER PUBLICATION supabase_realtime ADD TABLE missions;
ALTER PUBLICATION supabase_realtime ADD TABLE roles;
