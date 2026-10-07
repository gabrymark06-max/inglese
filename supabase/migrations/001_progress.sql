create table if not exists public.learning_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null,
 revision bigint not null default 1,
 updated_at timestamptz not null default now(),
 constraint progress_size check (octet_length(data::text) < 3000000),
 constraint progress_version check (data->>'version' = '1')
);
alter table public.learning_progress enable row level security;
create policy "Read own progress" on public.learning_progress for select to authenticated using ((select auth.uid()) = user_id);
-- Writes only through an atomic revision check; prevents stale devices overwriting data.
revoke all on public.learning_progress from anon, authenticated;
grant select on public.learning_progress to authenticated;
create or replace function public.save_learning_progress(payload jsonb, expected_revision bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare result bigint; uid uuid := auth.uid();
begin
 if uid is null then raise exception 'Authentication required'; end if;
 if expected_revision = 0 then
   insert into public.learning_progress(user_id,data) values(uid,payload)
   on conflict do nothing returning revision into result;
 else
   update public.learning_progress set data=payload, revision=revision+1, updated_at=now()
   where user_id=uid and revision=expected_revision returning revision into result;
 end if;
 if result is null then raise exception 'PROGRESS_CONFLICT'; end if;
 return result;
end $$;
revoke all on function public.save_learning_progress(jsonb,bigint) from public;
grant execute on function public.save_learning_progress(jsonb,bigint) to authenticated;
