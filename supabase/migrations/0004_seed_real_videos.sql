-- =====================================================================
-- Eric Fitness · Migration 0004 · seed de vídeos reales del canal de
-- Erickson Zambrano. Sustituye el vídeo de prueba inicial.
-- Run in Supabase → SQL Editor.
-- =====================================================================

-- Defensivo: si la tabla legada dejó columna cloudflare_id NOT NULL, la quitamos.
alter table public.videos drop column if exists cloudflare_id;

-- Limpia el vídeo placeholder que usamos durante las pruebas iniciales.
-- Si prefieres conservarlo, comenta esta línea antes de ejecutar.
delete from public.videos where title = 'Montando el Servidor (SupraPixel)';

-- Inserta el catálogo inicial. Últimos 2 gratuitos; los otros 4 Premium.
-- duration_seconds queda en NULL (YouTube no lo expone por oembed).
-- Eric puede editarlo a mano después en Table Editor si quiere mostrar duraciones.
insert into public.videos (
  title, description, thumbnail_url, duration_seconds, category,
  provider, video_id, is_locked, position
)
values
  (
    'Así voy a hacer crecer mi pecho · Rutina de pecho (Bulk season)',
    'Rutina completa de pecho para hipertrofia en temporada de volumen.',
    'https://i.ytimg.com/vi/YfyePbO1940/maxresdefault.jpg',
    null, 'Pecho', 'youtube', 'YfyePbO1940', true, 1
  ),
  (
    'Vlog · Día de piernas',
    'Vlog de un entrenamiento completo de piernas con Erickson.',
    'https://i.ytimg.com/vi/ioeVA0XRw2M/maxresdefault.jpg',
    null, 'Piernas', 'youtube', 'ioeVA0XRw2M', true, 2
  ),
  (
    'Ponte en forma con mi rutina de espalda',
    'Rutina de espalda completa para desarrollar amplitud y grosor.',
    'https://i.ytimg.com/vi/qsjfNLBnxjU/maxresdefault.jpg',
    null, 'Espalda', 'youtube', 'qsjfNLBnxjU', true, 3
  ),
  (
    'Rutina de pecho + hombros (resultados reales)',
    'Sesión combinada de pecho y hombros para un torso completo.',
    'https://i.ytimg.com/vi/6WceMgavhRg/maxresdefault.jpg',
    null, 'Pecho + Hombros', 'youtube', '6WceMgavhRg', true, 4
  ),
  (
    'Rutina de piernas · Cuádriceps · Semana 5',
    'Entrenamiento enfocado en cuádriceps de la semana 5 del programa.',
    'https://i.ytimg.com/vi/4X37sAePQk0/maxresdefault.jpg',
    null, 'Piernas', 'youtube', '4X37sAePQk0', false, 5
  ),
  (
    'Rutina de pecho · Semana 5',
    'Entrenamiento completo de pecho de la semana 5 del programa.',
    'https://i.ytimg.com/vi/m86URZxFOj8/maxresdefault.jpg',
    null, 'Pecho', 'youtube', 'm86URZxFOj8', false, 6
  );
