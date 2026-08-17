from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
FONT = '/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf'
BOLD = '/usr/share/fonts/truetype/noto/NotoKufiArabic-Medium.ttf'

def rtl(text):
    # Pillow with the installed Arabic font renders joined Arabic glyphs correctly.
    return text

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)

OLIVE = '#31401F'
GOLD = '#B69A56'
IVORY = '#F7F3EA'
CHARCOAL = '#20271A'
TERRACOTTA = '#B85E3D'

# Real QR, treated as a flat one-color ink print without a pasted white card.
def qr_ink(path, size, ink=OLIVE):
    src = Image.open(path).convert('L').resize((size, size), Image.Resampling.NEAREST)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pix = out.load(); s = src.load()
    for y in range(size):
        for x in range(size):
            if s[x, y] < 150:
                pix[x, y] = (*ImageColor.getrgb(ink), 255)
    return out

from PIL import ImageColor
QR = ROOT / 'qr' / 'store-home-large.png'

# 1) Branded shopping-bag mockup: apply typography and a medium QR directly to the ivory panel.
bag = Image.open(ROOT / 'packaging' / 'shopping-bag-mockup.png').convert('RGBA')
d = ImageDraw.Draw(bag)
# Main left bag ivory panel, scaled to the generated mockup.
# Add a quiet brand lockup and a medium, print-like QR (not a sticker).
d.text((360, 700), rtl('بيت البهارات'), font=font(54, True), fill=OLIVE, anchor='mm')
d.text((360, 770), 'HOUSE OF SPICES', font=font(20, True), fill=GOLD, anchor='mm')
q = qr_ink(QR, 156)
bag.alpha_composite(q, (282, 910))
d.text((360, 1100), rtl('امسح للمتجر'), font=font(23, True), fill=OLIVE, anchor='mm')
d.text((360, 1150), rtl('إب - شارع العدين'), font=font(21), fill=OLIVE, anchor='mm')
# Smaller lockup on the ivory bag in the foreground, still balanced and not oversized.
d.text((920, 1250), rtl('بيت البهارات'), font=font(32, True), fill=OLIVE, anchor='mm')
d.text((920, 1310), 'HOUSE OF SPICES', font=font(14, True), fill=GOLD, anchor='mm')
q2 = qr_ink(QR, 98)
bag.alpha_composite(q2, (871, 1370))
d.text((920, 1490), rtl('إب - شارع العدين'), font=font(15), fill=OLIVE, anchor='mm')
bag.convert('RGB').save(ROOT / 'packaging' / 'shopping-bag-branded.jpg', quality=96, subsampling=0)

# 2) Print-ready store cards: exact content, clean hierarchy, medium QR.
def card_canvas(fill, out_path, front=True):
    im = Image.new('RGB', (1050, 600), fill)
    dr = ImageDraw.Draw(im)
    if front:
        dr.rounded_rectangle((22,22,1028,578), radius=20, outline=GOLD, width=4)
        dr.text((525, 120), rtl('بيت البهارات'), font=font(62, True), fill=IVORY, anchor='mm')
        dr.text((525, 188), 'HOUSE OF SPICES', font=font(22, True), fill=GOLD, anchor='mm')
        dr.line((275, 230, 775, 230), fill=GOLD, width=2)
        dr.text((525, 310), rtl('نكهة تشترى. علامة تتذكر.'), font=font(26), fill=IVORY, anchor='mm')
        q = qr_ink(QR, 148, ink=IVORY)
        im.paste(q, (451, 365), q)
        dr.text((525, 548), rtl('امسح لزيارة المتجر'), font=font(18, True), fill=GOLD, anchor='mm')
    else:
        dr.rounded_rectangle((22,22,1028,578), radius=20, outline=GOLD, width=4)
        dr.text((525, 92), rtl('معلومات المتجر'), font=font(30, True), fill=GOLD, anchor='mm')
        dr.text((525, 178), rtl('إب - شارع العدين'), font=font(31, True), fill=IVORY, anchor='mm')
        dr.text((525, 242), rtl('متجر إلكتروني للبهارات والتوابل'), font=font(23), fill=IVORY, anchor='mm')
        dr.line((260, 292, 790, 292), fill=GOLD, width=2)
        dr.text((525, 355), rtl('اطلب منتجاتك من الهاتف'), font=font(25, True), fill=IVORY, anchor='mm')
        dr.text((525, 410), 'house-of-spices-linl.vercel.app', font=font(19), fill=GOLD, anchor='mm')
        dr.text((525, 500), rtl('بيت البهارات — إب'), font=font(19, True), fill=IVORY, anchor='mm')
    im.save(out_path, quality=96)

card_canvas(OLIVE, ROOT / 'cards' / 'store-card-front.png', front=True)
card_canvas(CHARCOAL, ROOT / 'cards' / 'store-card-back.png', front=False)

# 3) Apply the print-ready card artwork into the generated stationery mockup for the deck.
mock = Image.open(ROOT / 'packaging' / 'store-card-mockup.png').convert('RGBA')
front = Image.open(ROOT / 'cards' / 'store-card-front.png').convert('RGB').resize((620, 354), Image.Resampling.LANCZOS)
back = Image.open(ROOT / 'cards' / 'store-card-back.png').convert('RGB').resize((650, 371), Image.Resampling.LANCZOS)
# The generated mockup has a front-facing upright card on the right and a dark card in the foreground.
mock.alpha_composite(front.convert('RGBA'), (1380, 170))
mock.alpha_composite(back.convert('RGBA'), (1030, 1030))
mock.convert('RGB').save(ROOT / 'packaging' / 'store-card-branded.jpg', quality=96, subsampling=0)
print('Created branded bag, print-ready cards, and stationery mockup.')
