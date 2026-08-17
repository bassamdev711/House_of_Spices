-- Commerce query indexes for catalog, checkout, tracking and admin reporting.
CREATE INDEX "Product_isActive_stock_idx" ON "Product"("isActive", "stock");
CREATE INDEX "Product_collectionId_isActive_idx" ON "Product"("collectionId", "isActive");
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX "ProductVariant_stock_idx" ON "ProductVariant"("stock");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_status_paymentStatus_idx" ON "Order"("status", "paymentStatus");
CREATE INDEX "Order_customerPhone_idx" ON "Order"("customerPhone");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");
