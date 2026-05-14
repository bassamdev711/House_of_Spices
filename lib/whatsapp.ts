
export interface OrderData {
  productName: string;
  price: string;
  code: string;
  selectedColor?: string;
  selectedSize?: string;
  productUrl: string;
}

export const buildWhatsAppMessage = (data: OrderData): string => {
  const { productName, price, code, selectedColor, selectedSize, productUrl } = data;

  const message = `مرحباً، أريد طلب هذا المنتج الفاخر من طيف:

🌟 *الاسم:* ${productName}
💰 *السعر:* ${price}
🔢 *الكود:* ${code}
${selectedColor ? `🎨 *اللون:* ${selectedColor}` : ""}
${selectedSize ? `📏 *الحجم:* ${selectedSize}` : ""}

🔗 *رابط المنتج:*
${productUrl}

من فضلك التواصل معي لإكمال الطلب.`;

  return encodeURIComponent(message);
};

export const WHATSAPP_NUMBER = "967780500363"; // تم إضافة كود الدولة لضمان العمل عالمياً
