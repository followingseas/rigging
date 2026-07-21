-- Rigging 초기 스키마: profiles / catalog_items / rig_items / follows + RLS + 트리거 + 뷰

create type public.catalog_kind as enum
  ('harness', 'model', 'mcp', 'skill', 'editor', 'terminal');

create table public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  username     text unique not null,
  display_name text,
  avatar_url   text,
  tagline      text check (char_length(tagline) <= 120),
  github_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.catalog_items (
  id         uuid primary key default gen_random_uuid(),
  kind       public.catalog_kind not null,
  name       text not null,
  slug       text not null,
  url        text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  unique (kind, slug)
);

create table public.rig_items (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_items (id) on delete cascade,
  note            text check (char_length(note) <= 140),
  is_primary      boolean not null default false,
  position        int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, catalog_item_id)
);

create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

create index rig_items_user_idx on public.rig_items (user_id);
create index rig_items_catalog_idx on public.rig_items (catalog_item_id);
create index follows_followee_idx on public.follows (followee_id);

-- RLS
alter table public.profiles      enable row level security;
alter table public.catalog_items enable row level security;
alter table public.rig_items     enable row level security;
alter table public.follows       enable row level security;

create policy "profiles_select_all"  on public.profiles for select using (true);
create policy "profiles_update_own"  on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own"  on public.profiles for delete using (auth.uid() = id);

create policy "catalog_select_all"   on public.catalog_items for select using (true);
create policy "catalog_insert_auth"  on public.catalog_items for insert
  with check (auth.uid() is not null and created_by = auth.uid());

create policy "rig_select_all"       on public.rig_items for select using (true);
create policy "rig_insert_own"       on public.rig_items for insert with check (auth.uid() = user_id);
create policy "rig_update_own"       on public.rig_items for update using (auth.uid() = user_id);
create policy "rig_delete_own"       on public.rig_items for delete using (auth.uid() = user_id);

create policy "follows_select_all"   on public.follows for select using (true);
create policy "follows_insert_own"   on public.follows for insert with check (auth.uid() = follower_id);
create policy "follows_delete_own"   on public.follows for delete using (auth.uid() = follower_id);

-- 신규 가입 시 프로필 자동 생성 (GitHub 메타데이터 사용)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url, github_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', 'user-' || left(new.id::text, 8)),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    case when new.raw_user_meta_data ->> 'user_name' is not null
         then 'https://github.com/' || (new.raw_user_meta_data ->> 'user_name') end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger rig_items_set_updated_at before update on public.rig_items
  for each row execute function public.set_updated_at();

-- rig 변경 시 프로필 updated_at 갱신 (랜딩 "최근 업데이트" 정렬용)
create or replace function public.touch_profile_updated_at()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set updated_at = now()
  where id = coalesce(new.user_id, old.user_id);
  return coalesce(new, old);
end;
$$;

create trigger rig_items_touch_profile
  after insert or update or delete on public.rig_items
  for each row execute function public.touch_profile_updated_at();

-- 카탈로그 사용자 수 뷰 (invoker 권한 = RLS 적용)
create view public.catalog_usage
with (security_invoker = true) as
select ci.id, ci.kind, ci.name, ci.slug, ci.url,
       count(distinct ri.user_id)::int as user_count
from public.catalog_items ci
left join public.rig_items ri on ri.catalog_item_id = ci.id
group by ci.id;
