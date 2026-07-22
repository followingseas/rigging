-- Cursor를 harness 하나로 통일 — editor 카테고리는 범용 에디터(VS Code, Zed 등) 전용.
-- 중복 등록은 카탈로그 사용자 수 통계를 가르고 등록 위치를 헷갈리게 한다.

delete from public.catalog_items where kind = 'editor' and slug = 'cursor';
