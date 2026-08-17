from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageColor

ROOT = Path(__file__).resolve().parents[1]
FONT = '/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf'
BOLD = '/usr/share/fonts/truetype/noto/NotoKufiArabic-Medium.ttf'
OLIVE = '#31401F'
GOLD = '#B69A56'
IVORY = '#F7F3EA'


def f(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)

# QR modules are composited as a single-color ink layer, so the label remains the quiet zone.
def qr_ink(path, size, ink=OLIVE):
    src = Image.open(path).convert('L').resize((size, size), Image.Resampling.NEAREST)
    ink_rgb = ImageColor.getrgb(ink)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    p = out.load(); s = src.load()
    for y in range(size):
        for x in range(size):
            if s[x, y] < 145:
                p[x, y] = (*ink_rgb, 255)
    return out

base = Image.open(ROOT / 'packaging' / 'shopping-bag-products-branded-base.png').convert('RGBA')
d = ImageDraw.Draw(base)
qr_store = ROOT / 'qr' / 'store-home-large.png'
qr_catalog = ROOT / 'qr' / 'shop-products-large.png'

# Main shopping bag: brand lockup at the top of the ivory label, medium QR below it.
d.text((365, 815), 'HOUSE OF SPICES', font=f(27, True), fill=GOLD, anchor='mm')
d.text((365, 880), 'بيت البهارات', font=f(49, True), fill=OLIVE, anchor='mm')
base.alpha_composite(qr_ink(qr_store, 150), (290, 985))
d.text((365, 1165), 'امسح لزيارة المتجر', font=f(20, True), fill=OLIVE, anchor='mm')
d.text((365, 1212), 'إب - شارع العدين', font=f(19), fill=OLIVE, anchor='mm')

# Glass jar: product name and a small-but-readable catalog QR centered within the label panel.
d.text((595, 1570), 'هيل فاخر', font=f(25, True), fill=OLIVE, anchor='mm')
base.alpha_composite(qr_ink(qr_catalog, 72), (559, 1620))
d.text((595, 1710), 'امسح للكتالوج', font=f(12, True), fill=OLIVE, anchor='mm')

# White spice pouch: same system, using the larger panel for a product title and medium QR.
d.text((1090, 1580), 'زعتر بلدي', font=f(27, True), fill=OLIVE, anchor='mm')
base.alpha_composite(qr_ink(qr_catalog, 82), (1049, 1635))
d.text((1090, 1745), 'بيت البهارات', font=f(15, True), fill=GOLD, anchor='mm')

# Saffron box: product name only, with the catalog QR kept inside the ivory ornamental panel.
d.text((1455, 1570), 'زعفران فاخر', font=f(22, True), fill=OLIVE, anchor='mm')
base.alpha_composite(qr_ink(qr_catalog, 66), (1422, 1630))

out = ROOT / 'packaging' / 'shopping-bag-products-branded.jpg'
base.convert('RGB').save(out, quality=96, subsampling=0)
print(out)
