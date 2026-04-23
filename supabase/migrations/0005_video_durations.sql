-- =====================================================================
-- Eric Fitness · Migration 0005 · rellenar duraciones de vídeos
-- Rellena los segundos manualmente. YouTube no expone duration por
-- oembed ni por HTML scraping fiable, así que lo hacemos a mano.
--
-- Cómo usar:
--   1. Abre cada vídeo en YouTube y mira la duración (mm:ss).
--   2. Convierte a segundos (ej. 12:34 → 12*60+34 = 754).
--   3. Sustituye el null por el valor real.
-- Los vídeos sin duración muestran la card sin el badge de tiempo —
-- así que dejar null también es válido.
-- =====================================================================

update public.videos set duration_seconds = null where video_id = 'YfyePbO1940'; -- Pecho Bulk
update public.videos set duration_seconds = null where video_id = 'ioeVA0XRw2M'; -- Vlog Piernas
update public.videos set duration_seconds = null where video_id = 'qsjfNLBnxjU'; -- Espalda
update public.videos set duration_seconds = null where video_id = '6WceMgavhRg'; -- Pecho+Hombros
update public.videos set duration_seconds = null where video_id = '4X37sAePQk0'; -- Cuádriceps S5
update public.videos set duration_seconds = null where video_id = 'm86URZxFOj8'; -- Pecho S5
