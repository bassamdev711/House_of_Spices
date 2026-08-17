from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import qrcode

ROOT = Path(__file__).resolve().parents[1]
QR_DIR = ROOT / 'qr'
LABEL_DIR = ROOT / 'labels'
BROCHURE_DIR = ROOT / 'brochures'
PACK_DIR = ROOT / 'packaging'

URL_HOME = 'https://house-of-spices-linl.vercel.app/'
URL_PRODUCTS = URL_HOME + 'products'

OLIVE = '#334814'
OLIVE_DARK = '#26370e'
IVORY = '#F8F3E8'
GOLD = '#B69A56'
TERRACOTTA = '#B85E3D'
INK = '#1E2416'
MUTED = '#7B806E'

FONT_PATHS = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
]
BOLD_PATHS = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
]

def font(size, bold=False):
    paths = BOLD_PATHS if bold else FONT_PATHS
    for p in paths:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def qr_png(value: str, out: Path, box=18):
    qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=box, border=4)
    qr.add_data(value)
    qr.make(fit=True)
    img = qr.make_image(fill_color=OLIVE_DARK, back_color='white').convert('RGB')
    img.save(out, quality=100)
    return img

def fit_text(draw, text, xy, max_width, f, fill, anchor='ra'):
    # Arabic remains exact in the source and vector deliverables; PIL uses the installed font for preview rendering.
    draw.text(xy, text, font=f, fill=fill, anchor=anchor)

def draw_brand(draw, x, y, scale=1, dark=False):
    color = IVORY if dark else OLIVE
    accent = GOLD
    draw.text((x, y), 'TIF', font=font(int(52*scale), True), fill=accent, anchor='ma')
    draw.text((x, y+int(55*scale)), 'بيت البهارات', font=font(int(27*scale), True), fill=color, anchor='ma')

def save_label(name, spice, subtitle, color, qr_img, out_png, out_svg):
    W, H = 1400, 1900
    img = Image.new('RGB', (W, H), IVORY)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((18, 18, W-18, H-18), radius=60, outline=GOLD, width=8, fill=IVORY)
    d.rounded_rectangle((18, 18, W-18, 360), radius=60, fill=color)
    d.rectangle((18, 300, W-18, 360), fill=color)
    d.polygon([(260, 360), (700, 510), (1140, 360)], fill=color)
    draw_brand(d, W//2, 90, 1.25, dark=True)
    fit_text(d, spice, (W//2, 700), W-180, font(108, True), OLIVE_DARK, anchor='mm')
    fit_text(d, subtitle, (W//2, 805), W-180, font(42), MUTED, anchor='mm')
    d.line((190, 880, W-190, 880), fill=GOLD, width=5)
    # ingredient illustration using simple, editable circles and spice shapes
    cx, cy = W//2, 1110
    d.ellipse((cx-230, cy-230, cx+230, cy+230), fill='#E9DFC9', outline=GOLD, width=4)
    for i, (dx, dy, r, fill) in enumerate([
        (-100,-80,44,'#8B6B2B'), (40,-120,36,'#C08B35'), (112,-10,48,'#6D3B2A'),
        (-60,65,54,'#5A6A2E'), (75,90,40,'#A05B32'), (-150,20,30,'#2D3C1B')]):
        d.ellipse((cx+dx-r, cy+dy-r, cx+dx+r, cy+dy+r), fill=fill)
    qr_size = 310
    qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    img.paste(qr_resized, (W-qr_size-110, H-qr_size-110))
    d.rounded_rectangle((W-qr_size-125, H-qr_size-125, W-95, H-95), radius=18, outline=OLIVE_DARK, width=5)
    fit_text(d, 'امسح للشراء', (180, H-190), 500, font(42, True), OLIVE_DARK, anchor='lm')
    fit_text(d, 'نقاء يُطلب… ونكهة تُتذكّر', (W//2, H-82), W-200, font(30), MUTED, anchor='mm')
    img.save(out_png, quality=95)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1900" viewBox="0 0 1400 1900"><rect width="1400" height="1900" rx="60" fill="{IVORY}"/><rect x="18" y="18" width="1364" height="1864" rx="60" fill="none" stroke="{GOLD}" stroke-width="8"/><path d="M18 78Q18 18 78 18H1322Q1382 18 1382 78V360H18Z" fill="{color}"/><text x="700" y="145" text-anchor="middle" fill="{GOLD}" font-family="sans-serif" font-weight="700" font-size="76">TIF</text><text x="700" y="230" text-anchor="middle" fill="{IVORY}" font-family="sans-serif" font-weight="700" font-size="38">بيت البهارات</text><text x="700" y="745" text-anchor="middle" fill="{OLIVE_DARK}" font-family="sans-serif" font-weight="700" font-size="108">{spice}</text><text x="700" y="825" text-anchor="middle" fill="{MUTED}" font-family="sans-serif" font-size="42">{subtitle}</text><line x1="190" y1="880" x2="1210" y2="880" stroke="{GOLD}" stroke-width="5"/><circle cx="700" cy="1110" r="230" fill="#E9DFC9" stroke="{GOLD}" stroke-width="4"/><rect x="980" y="1440" width="310" height="310" fill="white" stroke="{OLIVE_DARK}" stroke-width="5"/><text x="180" y="1735" fill="{OLIVE_DARK}" font-family="sans-serif" font-weight="700" font-size="42">امسح للشراء</text><text x="700" y="1820" text-anchor="middle" fill="{MUTED}" font-family="sans-serif" font-size="30">نقاء يُطلب… ونكهة تُتذكّر</text></svg>'''
    out_svg.write_text(svg, encoding='utf-8')

def brochure_front(background, qr_img, out):
    W, H = 1748, 2480
    bg = Image.open(background).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
    overlay = Image.new('RGBA', (W,H), (38,55,14,0))
    od = ImageDraw.Draw(overlay)
    od.rectangle((0,0,W,H), fill=(38,55,14,110))
    od.rounded_rectangle((90,120,1658,2350), radius=52, fill=(248,243,232,245))
    bg = Image.alpha_composite(bg.convert('RGBA'), overlay)
    d = ImageDraw.Draw(bg)
    draw_brand(d, W//2, 230, 1.55, dark=False)
    d.text((W//2, 560), 'حوّل كل عبوة إلى نقطة بيع', font=font(86, True), fill=OLIVE_DARK, anchor='mm', align='center')
    d.text((W//2, 700), 'متجر إلكتروني فاخر لعلامات البهارات التي تريد أن تُرى… وتُشترى', font=font(40), fill=MUTED, anchor='mm', align='center')
    d.line((260, 820, W-260, 820), fill=GOLD, width=7)
    claims = ['واجهة تحمل قيمة المنتج', 'باركود على العبوة يفتح المتجر فوراً', 'سلة وطلبات وتتبع من الجوال', 'عروض وخصومات تعيد العميل للشراء']
    y = 980
    for claim in claims:
        d.ellipse((280,y-18,322,y+24), fill=TERRACOTTA)
        d.text((370,y), claim, font=font(43, True), fill=INK, anchor='lm')
        y += 125
    qr_size = 400
    qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    bg.paste(qr_resized, (W//2-qr_size//2, 1700))
    d.text((W//2, 2180), 'امسح الآن وشاهد التجربة الحية', font=font(45, True), fill=OLIVE_DARK, anchor='mm')
    d.text((W//2, 2260), URL_HOME, font=font(27), fill=MUTED, anchor='mm')
    bg.convert('RGB').save(out, quality=95)

def brochure_back(qr_products, out):
    W,H=1748,2480
    img=Image.new('RGB',(W,H),IVORY); d=ImageDraw.Draw(img)
    d.rectangle((0,0,W,330), fill=OLIVE)
    draw_brand(d,W//2,105,1.35,dark=True)
    d.text((W//2,520),'من الرف إلى الطلب… في ثلاث خطوات',font=font(72,True),fill=OLIVE_DARK,anchor='mm')
    steps=[('١','اعرض','ضع QR واضحاً على كل عبوة أو رف.'),('٢','اجذب','دع العميل يرى الصور والمنتجات والعروض.'),('٣','بع','استقبل الطلب وتابع حالته من مكان واحد.')]
    y=760
    for n,title,body in steps:
        d.ellipse((250,y-70,410,y+90),fill=TERRACOTTA)
        d.text((330,y+10),n,font=font(76,True),fill='white',anchor='mm')
        d.text((500,y-10),title,font=font(50,True),fill=OLIVE_DARK,anchor='lm')
        d.text((500,y+55),body,font=font(34),fill=MUTED,anchor='lm')
        y += 330
    qr_size=330; qr_products=qr_products.resize((qr_size,qr_size),Image.Resampling.NEAREST)
    img.paste(qr_products,(W-qr_size-190,H-qr_size-190))
    d.rounded_rectangle((W-qr_size-205,H-qr_size-205,W-175,H-175),radius=18,outline=OLIVE_DARK,width=5)
    d.text((240,H-300),'ابدأ من الكتالوج الحقيقي',font=font(38,True),fill=OLIVE_DARK,anchor='lm')
    d.text((240,H-235),URL_PRODUCTS,font=font(25),fill=MUTED,anchor='lm')
    img.save(out,quality=95)

QR_DIR.mkdir(parents=True, exist_ok=True)
LABEL_DIR.mkdir(parents=True, exist_ok=True)
BROCHURE_DIR.mkdir(parents=True, exist_ok=True)
qr_home = qr_png(URL_HOME, QR_DIR/'store-home.png')
qr_products = qr_png(URL_PRODUCTS, QR_DIR/'shop-products.png')
(qr_home.resize((1200,1200),Image.Resampling.NEAREST)).save(QR_DIR/'store-home-large.png',quality=100)
(qr_products.resize((1200,1200),Image.Resampling.NEAREST)).save(QR_DIR/'shop-products-large.png',quality=100)
save_label('زعتر فاخر','زعتر فاخر','خلطة يومية بنكهة البيت',OLIVE,qr_products,LABEL_DIR/'label-zaatar.png',LABEL_DIR/'label-zaatar.svg')
save_label('زعفران فاخر','زعفران فاخر','خيوط مختارة بعناية',TERRACOTTA,qr_home,LABEL_DIR/'label-saffron.png',LABEL_DIR/'label-saffron.svg')
brochure_front(PACK_DIR/'countertop-lineup.jpg',qr_home,BROCHURE_DIR/'retailer-a5-front.png')
brochure_back(qr_products,BROCHURE_DIR/'retailer-a5-back.png')
print('Generated QR, labels, and brochures in', ROOT)
