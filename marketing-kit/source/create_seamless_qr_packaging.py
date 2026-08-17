from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
base = Image.open(ROOT / 'packaging' / 'qr-packaging-seamless-base.png').convert('RGB')
qr_src = Image.open(ROOT / 'qr' / 'shop-products-large.png').convert('L')

# Make the real QR behave like a printed ink layer: black modules become olive ink,
# while the white quiet zone remains the ivory label beneath it.
def printed_qr(size, ink=(49,64,31), opacity=0.88):
    q = qr_src.resize((size, size), Image.Resampling.NEAREST)
    # Slightly soften only the edges of the ink layer so it does not look like a pasted sticker.
    q = q.filter(ImageFilter.GaussianBlur(0.12))
    layer = Image.new('RGBA', (size, size), (*ink, 0))
    alpha = q.point(lambda p: int((255 - p) * opacity))
    layer.putalpha(alpha)
    return layer

# The AI-edited base already places subtle QR-like details in these two label areas.
# Replace them with the real encoded modules at the same visual scale.
placements = [
    # x, y, size — central glass jar label
    (1074, 960, 86),
    # saffron box label
    (1478, 974, 100),
]
for x, y, size in placements:
    overlay = printed_qr(size)
    base = base.convert('RGBA')
    base.alpha_composite(overlay, (x, y))

# Keep the final photo natural and presentation-ready.
out = ROOT / 'packaging' / 'qr-on-packaging-seamless.jpg'
base.convert('RGB').save(out, quality=96, subsampling=0)
print(out)
