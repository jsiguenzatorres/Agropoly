-- ============================================================
-- AGROPOLY BFA — Initial Schema
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- TABLE: profiles (auth users metadata)
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid        primary key references auth.users on delete cascade,
  display_name text       not null default 'Jugador',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Jugador'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- TABLE: game_sessions
-- ─────────────────────────────────────────────────────────────
create table public.game_sessions (
  id                uuid        primary key default uuid_generate_v4(),
  room_id           text        not null,
  player_count      int         not null check (player_count between 2 and 6),
  ai_count          int         not null default 0,
  educational_mode  boolean     not null default false,
  winner_id         uuid        references public.profiles(id) on delete set null,
  winner_name       text,
  final_turn_count  int,
  duration_seconds  int,
  completed         boolean     not null default false,
  created_at        timestamptz not null default now(),
  ended_at          timestamptz
);

alter table public.game_sessions enable row level security;

create policy "Sessions readable by all authenticated users"
  on public.game_sessions for select using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────
-- TABLE: game_players (per-session player records)
-- ─────────────────────────────────────────────────────────────
create table public.game_players (
  id          uuid        primary key default uuid_generate_v4(),
  session_id  uuid        not null references public.game_sessions(id) on delete cascade,
  profile_id  uuid        references public.profiles(id) on delete set null,
  name        text        not null,
  token_id    text        not null,
  is_ai       boolean     not null default false,
  difficulty  text        not null default 'easy',
  final_rank  int,
  final_balance     int  default 0,
  final_net_worth   int  default 0,
  properties_owned  int  default 0,
  went_bankrupt     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.game_players enable row level security;

create policy "Players readable by all authenticated users"
  on public.game_players for select using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────
-- TABLE: education_events (educational mode tracking)
-- ─────────────────────────────────────────────────────────────
create table public.education_events (
  id          uuid        primary key default uuid_generate_v4(),
  session_id  uuid        not null references public.game_sessions(id) on delete cascade,
  player_name text        not null,
  concept     text        not null,
  mascot_id   text        not null,
  turn_number int         not null,
  understood  boolean,
  created_at  timestamptz not null default now()
);

alter table public.education_events enable row level security;

create policy "Education events readable by authenticated users"
  on public.education_events for select using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────
-- TABLE: leaderboard (materialized view for dashboard)
-- ─────────────────────────────────────────────────────────────
create view public.leaderboard as
  select
    gp.name         as player_name,
    gp.token_id,
    max(gp.final_net_worth) as best_net_worth,
    count(*)        as games_played,
    count(*) filter (where gs.winner_name = gp.name) as games_won,
    round(count(*) filter (where gs.winner_name = gp.name)::numeric / count(*) * 100, 1) as win_rate,
    max(gs.created_at) as last_played
  from public.game_players gp
  join public.game_sessions gs on gp.session_id = gs.id
  where gs.completed = true and gp.is_ai = false
  group by gp.name, gp.token_id
  order by best_net_worth desc;

-- ─────────────────────────────────────────────────────────────
-- TABLE: voice_cache (ElevenLabs audio cache metadata)
-- ─────────────────────────────────────────────────────────────
create table public.voice_cache (
  id            uuid    primary key default uuid_generate_v4(),
  cache_key     text    not null unique,  -- sha256 of mascot+text+emotion
  mascot_id     text    not null,
  emotion       text    not null,
  text_hash     text    not null,
  storage_path  text    not null,         -- path in 'voice-cache' bucket
  duration_ms   int,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null default (now() + interval '7 days')
);

create index on public.voice_cache (cache_key);
create index on public.voice_cache (expires_at);

alter table public.voice_cache enable row level security;

create policy "Voice cache readable by service role only"
  on public.voice_cache for select using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────
-- Storage buckets (run after creating project)
-- ─────────────────────────────────────────────────────────────
-- insert into storage.buckets (id, name, public)
-- values ('voice-cache', 'voice-cache', false);
