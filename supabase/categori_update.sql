ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_category_check;

ALTER TABLE public.products 
ADD CONSTRAINT products_category_check 
CHECK (category IN (
  'outerwear','dresses','tailoring','basics','bottoms',
  'shirts','tshirts','trousers','shorts','pants',
  'skirts','blouses','frocks','sarees','lehenga',
  'kids_sets','kids_tops','kids_bottoms',
  'accessories','caps','sunglasses','shoes',
  'slippers','sandals','bags','belts',
  'watches','jewellery','scarves'
));