# Side-by-sides: left = the original render (romance/interiors shots, or the ux-pass "before" for the rooftop), right = restored.
from PIL import Image, ImageDraw, ImageFont
import os
R = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(R, '..')
PAIRS = {
  'park': 'interiors/shots/park.png', 'shop-street': 'romance/shots/shop-street.png', 'rail-crossing': 'romance/shots/rail-crossing.png',
  'crossing-night': 'romance/shots/crossing-night.png', 'street-day': 'romance/shots/street-day.png', 'street-dusk': 'romance/shots/street-dusk.png',
  'rooftop': 'ux-pass/A/03-rooftop-rooftop_2.png', 'apartment': 'interiors/shots/apartment.png', 'sitting-room': 'interiors/shots/sitting-room.png',
  'cup-stamp': 'interiors/shots/sitting-room.png', 'bedroom': 'interiors/shots/bedroom.png', 'cellar': 'interiors/shots/cellar.png',
  'cellar-jars': 'interiors/shots/cellar-jars.png', 'genkan-v2': 'interiors/shots/genkan-v2.png',
}
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 34)
except OSError: font = ImageFont.load_default()
os.makedirs(os.path.join(R, 'shots', 'sbs'), exist_ok=True)
for name, ref in PAIRS.items():
  a = Image.open(os.path.join(S, ref)).convert('RGB').resize((960, 540))
  b = Image.open(os.path.join(R, 'shots', name + '.png')).convert('RGB').resize((960, 540))
  out = Image.new('RGB', (1920, 600), (20, 12, 28)); out.paste(a, (0, 60)); out.paste(b, (960, 60))
  d = ImageDraw.Draw(out)
  left = 'BEFORE (ux-pass)' if ref.startswith('ux-pass') else 'ORIGINAL ' + ref.split('/')[0]
  d.text((16, 12), f'{left}: {os.path.basename(ref)}', fill=(255, 200, 225), font=font)
  d.text((976, 12), f'RESTORED: {name}', fill=(200, 255, 210), font=font)
  out.save(os.path.join(R, 'shots', 'sbs', name + '.png'), optimize=True)
  print(name)
