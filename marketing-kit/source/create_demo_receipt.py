from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

out = Path('/home/ubuntu/house_of_spices_audit/marketing-kit/source/demo-payment-receipt.png')
W, H = 1200, 1600
img = Image.new('RGB', (W, H), '#F7F3EA')
d = ImageDraw.Draw(img)
font_paths = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
]
font_path = next((p for p in font_paths if Path(p).exists()), None)
font_bold_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf').exists() else font_path

def f(size, bold=False):
    return ImageFont.truetype(font_bold_path if bold else font_path, size) if font_path else ImageFont.load_default()

# Border and header
olive = '#31401F'; gold = '#B69A56'; dark = '#20271A'
d.rounded_rectangle((60, 60, W-60, H-60), radius=28, outline=olive, width=6)
d.rectangle((60, 60, W-60, 300), fill=olive)
d.text((120, 105), 'بيت البهارات', font=f(58, True), fill='#F7F3EA')
d.text((120, 190), 'إيصال اختبار — DEMO ONLY', font=f(34, True), fill=gold)

rows = [
    ('الحالة', 'للاختبار فقط — غير صالح للدفع'),
    ('المستفيد', 'أحمد عبده'),
    ('البنك', 'بنك الكريمي للتمويل الأصغر الإسلامي'),
    ('رقم الحساب / الهاتف', '+967777000000'),
    ('المبلغ', '٨٬١١١ ر.ي'),
    ('رقم العملية التجريبي', 'DEMO-IBB-2026-001'),
]
y = 390
for label, value in rows:
    d.text((140, y), label, font=f(28, True), fill=olive)
    d.text((140, y+52), value, font=f(32), fill=dark)
    d.line((140, y+120, W-140, y+120), fill='#B69A5688', width=2)
    y += 180

# Watermark warning
d.rounded_rectangle((130, 1320, W-130, 1480), radius=18, fill='#F3D3C9', outline='#B44636', width=4)
d.text((205, 1370), 'DEMO ONLY — NOT A REAL PAYMENT', font=f(34, True), fill='#8D2D20')
img.save(out)
print(out)
