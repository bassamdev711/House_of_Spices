from pathlib import Path
import cv2

ROOT = Path(__file__).resolve().parents[1]
detector = cv2.QRCodeDetector()
expected = {
    'store-home.png': 'https://house-of-spices-linl.vercel.app/',
    'store-home-large.png': 'https://house-of-spices-linl.vercel.app/',
    'shop-products.png': 'https://house-of-spices-linl.vercel.app/products',
    'shop-products-large.png': 'https://house-of-spices-linl.vercel.app/products',
}
for name, target in expected.items():
    path = ROOT / 'qr' / name
    image = cv2.imread(str(path))
    value, points, _ = detector.detectAndDecode(image)
    print(f'{name}: decoded={value!r} expected={target!r} pass={value == target}')
    if value != target:
        raise SystemExit(1)
