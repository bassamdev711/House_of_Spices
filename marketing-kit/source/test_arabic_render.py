from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display
im=Image.new('RGB',(1400,500),'white')
d=ImageDraw.Draw(im)
font=ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoKufiArabic-Medium.ttf',42)
text='بيت البهارات — إب — شارع العدين'
d.text((40,80), text, font=font, fill='#31401F')
d.text((40,210), arabic_reshaper.reshape(text), font=font, fill='#B69A56')
d.text((40,340), get_display(arabic_reshaper.reshape(text)), font=font, fill='#B85E3D')
im.save('/home/ubuntu/house_of_spices_audit/marketing-kit/source/test_arabic_render.png')
