-- =============================================================================
-- RLS (Row Level Security) para Supabase - Proyecto Econosfera
-- =============================================================================
-- Opción A (recomendada): desde el proyecto con Prisma
--   npm run db:rls
--   (usa scripts/enable-rls.js, que ejecuta estos ALTER con Prisma)
--
-- Opción B: copiar y ejecutar este SQL en Supabase → SQL Editor → New query
-- =============================================================================
-- Qué hace: habilita RLS en las tablas public para que el Security Advisor
-- no marque "RLS Disabled in Public". Prisma sigue funcionando (bypass RLS).
-- =============================================================================

-- Habilitar RLS en cada tabla del esquema public (nombres como en Prisma)
ALTER TABLE IF EXISTS public."Account"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Session"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."User"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Quiz"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Question"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Option"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."QuizAttempt"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."QuizAnswer"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Badge"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."UserBadge"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Scenario"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."VerificationToken"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ExportLog"            ENABLE ROW LEVEL SECURITY;

-- Opcional: activar RLS en todas las tablas public futuras (recomendado)
-- Descomenta el bloque siguiente si quieres que cualquier tabla nueva tenga RLS por defecto.

/*
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS EVENT_TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
    IF cmd.schema_name IS NOT NULL AND cmd.schema_name = 'public' THEN
      BEGIN
        EXECUTE format('ALTER TABLE IF EXISTS %s ENABLE ROW LEVEL SECURITY', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: RLS enabled on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed on %', cmd.object_identity;
      END;
    END IF;
  END LOOP;
END;
$$;

DROP EVENT TRIGGER IF EXISTS ensure_rls ON ddl_command_end;
CREATE EVENT TRIGGER ensure_rls
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION public.rls_auto_enable();
*/
