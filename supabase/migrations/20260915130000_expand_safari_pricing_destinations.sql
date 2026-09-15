-- Extend the Safari Builder pricing controls to every destination in the public catalogue.
-- Existing admin-edited rows are preserved with ON CONFLICT DO NOTHING.
insert into public.safari_pricing_settings
  (destination_slug, accommodation_per_night, park_fee_adult_per_day, park_fee_child_per_day, guide_vehicle_per_day, meals_adult_per_day, meals_child_per_day, pricing_mode)
values
  ('samburu',16500,3000,1500,10000,3200,1600,'manual'),
  ('lake-nakuru',15000,2500,1250,9000,3000,1500,'manual'),
  ('naivasha-hells-gate',14500,2000,1000,8500,3000,1500,'manual'),
  ('mount-kenya',16000,3000,1500,9500,3200,1600,'manual'),
  ('serengeti',23000,4500,2250,14000,4000,2000,'manual'),
  ('ngorongoro',24000,5000,2500,14500,4000,2000,'manual'),
  ('tarangire',19000,4000,2000,13000,3500,1750,'manual'),
  ('zanzibar',17000,1000,500,7000,3000,1500,'manual'),
  ('queen-elizabeth',18000,3000,1500,12000,3500,1750,'manual'),
  ('bwindi',22000,5000,2500,13000,4000,2000,'manual'),
  ('murchison-falls',18000,3000,1500,12000,3500,1750,'manual'),
  ('akagera',18000,3000,1500,11000,3500,1750,'manual')
on conflict (destination_slug) do nothing;
