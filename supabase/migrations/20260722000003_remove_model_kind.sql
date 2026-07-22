-- model 카테고리 제거 — 모델은 하네스 구성요소가 아니라 수시로 바꿔 쓰는 대상이므로 rig에 고정하지 않는다.
-- (enum 값 자체는 Postgres 특성상 제거하지 않고 미사용으로 남긴다)

delete from public.catalog_items where kind = 'model';
