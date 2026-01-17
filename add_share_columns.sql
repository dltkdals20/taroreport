-- tarot_reports 테이블에 share_url 컬럼 추가

-- share_url 컬럼 추가 (전체 공유 링크 URL)
ALTER TABLE tarot_reports 
ADD COLUMN IF NOT EXISTS share_url TEXT;

-- share_url에 인덱스 추가 (선택사항, URL로 조회할 경우)
CREATE INDEX IF NOT EXISTS idx_tarot_reports_share_url 
ON tarot_reports(share_url);

-- 주석 추가 (선택사항)
COMMENT ON COLUMN tarot_reports.share_url IS '전체 공유 링크 URL';
