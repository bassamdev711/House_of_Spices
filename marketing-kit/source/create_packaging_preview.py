from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
base = Image.open(ROOT / 'packaging' / 'countertop-lineup.jpg').convert('RGB')
qr = Image.open(ROOT / 'qr' / 'shop-products-large.png').convert('RGB')
font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
bold_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def f(size, bold=False):
    return ImageFont.truetype(bold_path if bold else font_path, size)

def add_qr(img, xy, size, title):
    x, y = xy
    card = Image.new('RGB', (size + 44, size + 110), 'white')
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0,0,size+43,size+109), radius=18, outline='#334814', width=5, fill='white')
    q = qr.resize((size,size), Image.Resampling.NEAREST)
    card.paste(q, (22, 18))
    cd.text(((size+44)//2, size+77), title, font=f(22, True), fill='#26370e', anchor='mm')
    img.paste(card, (x,y))

# Jar label: a small, high-contrast QR that remains separate from the product photograph.
add_qr(base, (1045, 790), 170, 'امسح للشراء')
# Saffron box label: second retail placement example.
add_qr(base, (1470, 820), 150, 'تسوّق الآن')
# A presentation-safe callout in the intentionally empty right-side space.
d = ImageDraw.Draw(base)
d.rounded_rectangle((1660, 80, 2255, 440), radius=28, fill=(248,243,232), outline='#B69A56', width=5)
d.text((1955, 155), 'كل عبوة\nتفتح باباً', font=f(54, True), fill='#334814', anchor='mm', align='center')
d.text((1955, 330), 'QR → متجر إلكتروني → طلب مباشر', font=f(25), fill='#7B806E', anchor='mm')
base.save(ROOT / 'packaging' / 'qr-on-packaging-preview.jpg', quality=95)
print(ROOT / 'packaging' / 'qr-on-packaging-preview.jpg')
