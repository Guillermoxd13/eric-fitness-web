-- Optional seed for local/dev testing. Uses a YouTube video as placeholder.
-- Run only if you want sample rows. Safe to skip or delete in production.

insert into public.videos (title, description, thumbnail_url, duration_seconds, category, provider, video_id, is_locked, position)
values
  ('Bienvenida · Cómo funciona el método', 'Vídeo introductorio gratuito para todos.', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 180, 'Intro', 'youtube', 'dQw4w9WgXcQ', false, 1),
  ('Fuerza total · Semana 1', 'Rutina premium de fuerza para principiantes.',      'https://i.ytimg.com/vi/ScMzIvxBSi4/maxresdefault.jpg', 2400, 'Fuerza', 'youtube', 'ScMzIvxBSi4', true,  2),
  ('HIIT 20 min · Quema grasa',            'Alta intensidad, solo suscriptores.',    'https://i.ytimg.com/vi/ml6cT4AZdqI/maxresdefault.jpg', 1200, 'HIIT',   'youtube', 'ml6cT4AZdqI', true,  3),
  ('Movilidad diaria · 10 min',            'Rutina corta gratuita para todos.',      'https://i.ytimg.com/vi/L_xrDAtykMI/maxresdefault.jpg',  600, 'Movilidad','youtube', 'L_xrDAtykMI', false, 4)
on conflict do nothing;
