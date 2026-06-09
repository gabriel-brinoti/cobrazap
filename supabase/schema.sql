-- CobraZap - Supabase schema

create extension if not exists "pgcrypto";

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  telefone text not null,
  observacao text,
  created_at timestamptz not null default now()
);

create table if not exists public.cobrancas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  descricao text,
  valor numeric(12,2) not null check (valor >= 0),
  vencimento date not null,
  status text not null default 'pendente' check (status in ('pendente', 'enviado', 'pago', 'cancelado')),
  mensagem_customizada text,
  created_at timestamptz not null default now()
);

alter table public.clientes enable row level security;
alter table public.cobrancas enable row level security;

create policy "clientes_select_own" on public.clientes for select using (auth.uid() = user_id);
create policy "clientes_insert_own" on public.clientes for insert with check (auth.uid() = user_id);
create policy "clientes_update_own" on public.clientes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "clientes_delete_own" on public.clientes for delete using (auth.uid() = user_id);

create policy "cobrancas_select_own" on public.cobrancas for select using (auth.uid() = user_id);
create policy "cobrancas_insert_own" on public.cobrancas for insert with check (auth.uid() = user_id);
create policy "cobrancas_update_own" on public.cobrancas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cobrancas_delete_own" on public.cobrancas for delete using (auth.uid() = user_id);

create or replace function public.set_user_id()
returns trigger as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_clientes_user_id on public.clientes;
create trigger set_clientes_user_id
before insert on public.clientes
for each row execute function public.set_user_id();

drop trigger if exists set_cobrancas_user_id on public.cobrancas;
create trigger set_cobrancas_user_id
before insert on public.cobrancas
for each row execute function public.set_user_id();

create index if not exists idx_clientes_user_id on public.clientes(user_id);
create index if not exists idx_cobrancas_user_id on public.cobrancas(user_id);
create index if not exists idx_cobrancas_cliente_id on public.cobrancas(cliente_id);
create index if not exists idx_cobrancas_status on public.cobrancas(status);
