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
-- SEED DATA: Sample Mission (Week 4)
-- =============================================
INSERT INTO missions (id, week_number, title, description, deadline, is_active, is_voting_open) VALUES
  ('00000000-0000-0000-0000-000000000001', 4, 'NHIỆM VỤ 4: DÂN CHỦ XÃ HỘI CHỦ NGHĨA & BẢN CHẤT DÂN CHỦ XHCN',
   'Mục tiêu: Phân tích bản chất của nền dân chủ XHCN và so sánh với dân chủ tư sản.\nYêu cầu: Thuyết trình nhóm 15 phút + Slide + Mini-game tương tác.\nSản phẩm bàn giao: File slide (.pptx), kịch bản MC, bộ câu hỏi quiz.',
   '2026-10-05T17:00:00+07:00', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Sample Roles for Week 4
-- =============================================
INSERT INTO roles (mission_id, title, description, max_slots, order_index) VALUES
  ('00000000-0000-0000-0000-000000000001', 'MC Điều phối', 'Dẫn chương trình thuyết trình, điều phối phần Q&A và mini-game. Đảm bảo đúng thời lượng 15 phút.', 1, 1),
  ('00000000-0000-0000-0000-000000000001', 'Kịch bản & Câu hỏi', 'Viết kịch bản MC, soạn bộ câu hỏi quiz/mini-game tương tác cho lớp.', 2, 2),
  ('00000000-0000-0000-0000-000000000001', 'Nghiên cứu Nội dung', 'Nghiên cứu lý thuyết về dân chủ XHCN, tổng hợp tài liệu, viết outline nội dung thuyết trình.', 2, 3),
  ('00000000-0000-0000-0000-000000000001', 'Thiết kế Slide', 'Thiết kế slide PowerPoint chuyên nghiệp, trực quan, đúng guideline nhóm.', 2, 4),
  ('00000000-0000-0000-0000-000000000001', 'Kỹ thuật Game', 'Lập trình/thiết kế mini-game tương tác (Kahoot/Quizizz hoặc web game đơn giản).', 1, 5),
  ('00000000-0000-0000-0000-000000000001', 'Hậu cần & Tổng hợp', 'Kiểm tra chất lượng sản phẩm, tổng hợp file, chuẩn bị thiết bị trình chiếu, backup plan.', 1, 6)
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
