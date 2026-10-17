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
-- SEED DATA: Sample Missions (Week 4, 5 Archived; Week 6 Active)
-- =============================================
INSERT INTO missions (id, week_number, title, description, deadline, is_active, is_voting_open) VALUES
  ('00000000-0000-0000-0000-000000000001', 4, 'NHIỆM VỤ 4: DÂN CHỦ XÃ HỘI CHỦ NGHĨA & BẢN CHẤT DÂN CHỦ XHCN',
   'Mục tiêu: Phân tích bản chất của nền dân chủ XHCN và so sánh với dân chủ tư sản.\nYêu cầu: Thuyết trình nhóm 15 phút + Slide + Mini-game tương tác.\nSản phẩm bàn giao: File slide (.pptx), kịch bản MC, bộ câu hỏi quiz.',
   '2026-10-05T17:00:00+07:00', FALSE, FALSE),
  ('00000000-0000-0000-0000-000000000002', 5, 'NHIỆM VỤ 5: TÌM HIỂU VỀ LIÊN MINH GIAI CẤP',
   'Mục tiêu: Mỗi nhóm thiết kế 1 sản phẩm infographic về liên minh giai cấp (tính tất yếu của liên minh, nội dung liên minh, nguyên tắc liên minh...). Web tương tác: https://cnxh-week5-nhom1.vercel.app/\nHạn nộp: Trước 17:00 ngày 12/10/2026.',
   '2026-10-12T17:00:00+07:00', FALSE, FALSE),
  ('00000000-0000-0000-0000-000000000003', 6, 'NHIỆM VỤ 6: DÂN TỘC, TÔN GIÁO & GIA ĐÌNH TRONG TIẾN TRÌNH XÂY DỰNG CNXH',
   'Mục tiêu: Xây dựng 1 video kịch hoàn chỉnh (nhóm tự xây dựng kịch bản, diễn viên, đạo cụ phục trang, lồng tiếng, âm thanh, dung lượng tối thiểu 15 phút).\nHạn nộp: Trước 17:00 ngày 26/10/2026 (có 2 tuần để thực hiện).',
   '2026-10-26T17:00:00+07:00', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Roles for Week 6 (8 vai diễn cho 8 thành viên)
-- =============================================
INSERT INTO roles (mission_id, title, description, max_slots, order_index) VALUES
  ('00000000-0000-0000-0000-000000000003', '[VAI 1] – Anh Họ Cả (Host phòng họp / Kỹ sư IT & Người dẫn chuyện)', 'Tính cách & Nhiệm vụ: Điềm tĩnh, sắc sảo. Đảm nhận lời dẫn mở đầu và đúc kết lý luận cuối phim (kiểu phim tài liệu Netflix); chủ trì phòng Google Meet và trực tiếp chia sẻ màn hình "bóc phốt" tên thầy bói lừa đảo.\nĐạo cụ tại nhà: Áo sơ mi tối màu, đèn bàn vàng ấm, 1 ảnh biên bản xử phạt giả lập để Share Screen.', 1, 0),
  ('00000000-0000-0000-0000-000000000003', '[VAI 2] – Ông Bố (Gia trưởng, nghiêm khắc, nặng tư tưởng truyền thống)', 'Tính cách & Nhiệm vụ: Nhân vật trung tâm tạo xung đột. Phản đối gay gắt chuyện con trai lấy vợ người dân tộc thiểu số và khác tôn giáo; cuối phim có màn chuyển biến tâm lý xúc động khi nghe bí mật trong gia phả.\nĐạo cụ tại nhà: Áo sơ mi/polo đứng tuổi, 1 chén trà đặt trên bàn.', 1, 1),
  ('00000000-0000-0000-0000-000000000003', '[VAI 3] – Người Con Trai (Kỹ sư trẻ làm việc xa nhà)', 'Tính cách & Nhiệm vụ: Trẻ trung, giàu tình cảm nhưng kiên định. Đấu tranh bảo vệ tình yêu, quyền tự do hôn nhân tiến bộ và bình đẳng giới trong gia đình mới.\nĐạo cụ tại nhà: Áo lịch sự, ngồi trước laptop và điện thoại.', 1, 2),
  ('00000000-0000-0000-0000-000000000003', '[VAI 4] – Anh Trai Nhà Gái (Y’Duy – Trí thức trẻ người Ê-đê, theo đạo Tin Lành)', 'Tính cách & Nhiệm vụ: Điềm đạm, tự trọng, có học thức (Thạc sĩ nông nghiệp). Thay mặt gia đình nhà gái ở Đắk Lắk đối thoại đanh thép, bảo vệ bản sắc văn hóa dân tộc và đức tin tôn giáo chân chính ("tốt đời đẹp đạo").\nĐạo cụ tại nhà: Áo sơ mi lịch sự (có thể khoác thêm khăn hoặc chi tiết thổ cẩm).', 1, 3),
  ('00000000-0000-0000-0000-000000000003', '[VAI 5] – Chú Bảy (Ông chú họ cả tin, mê tín)', 'Tính cách & Nhiệm vụ: Lo sợ chuyện "khác đạo làm động mồ động mả, tuyệt tự". Chính là người rước thầy bói online vào phòng họp và hối thúc chuyển tiền giải hạn. Tạo nét diễn đời thường, sinh động.\nĐạo cụ tại nhà: Áo ở nhà lịch sự, cầm quạt tay hoặc chuỗi hạt.', 1, 4),
  ('00000000-0000-0000-0000-000000000003', '[VAI 6] – "Thầy" Huyền Thông (Thầy bói online trục lợi)', 'Tính cách & Nhiệm vụ: Vai phản diện gây ấn tượng mạnh. Ngồi phòng tối, đeo kính đen, giọng ngân nga bí hiểm, phán bừa "xung khắc tôn giáo - dân tộc" để đòi chuyển khoản 35 triệu giải hạn; lúc bị vạch mặt thì luống cuống thoát khỏi phòng họp.\nĐạo cụ tại nhà: Kính râm đen, đèn đỏ/vàng hắt từ dưới lên, 1 ảnh lá số + mã QR giả lập để Share Screen.', 1, 5),
  ('00000000-0000-0000-0000-000000000003', '[VAI 7] – Chú Tư (Cán bộ Ủy ban Mặt trận Tổ quốc xã)', 'Tính cách & Nhiệm vụ: Đĩnh đạc, chuẩn mực. Nhân vật đại diện cho lý trí và pháp luật, trực tiếp phân tích đường lối của Đảng và Nhà nước về bình đẳng dân tộc, tự do tín ngưỡng tôn giáo và bài trừ mê tín dị đoan.\nĐạo cụ tại nhà: Áo sơ mi trắng chỉnh tề, đeo kính, sổ tay cán bộ.', 1, 6),
  ('00000000-0000-0000-0000-000000000003', '[VAI 8] – Bác Cả Trưởng Tộc (Người giữ gia phả dòng họ)', 'Tính cách & Nhiệm vụ: Trầm ổn, uy nghiêm. Nhân vật nắm giữ "cú twist" lấy nước mắt ở cao trào Hồi 3: Mở cuốn gia phả năm 1968 kể lại chuyện ông nội từng được một gia đình người Ê-đê theo đạo Tin Lành cứu mạng ở chiến trường Tây Nguyên.\nĐạo cụ tại nhà: Áo tối màu trang nghiêm, kính lão, 1 cuốn sổ bìa dày giả làm Gia phả.', 1, 7)
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
