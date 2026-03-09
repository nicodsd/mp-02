export const sendWhatsAppOrder = (phone: string, cart: any[], total: number) => {
    // 1. Estructuramos el mensaje con emojis para que quede pro
    let message = `*🍕 Nuevo Pedido - QMenu*\n`;
    message += `--------------------------\n`;

    cart.forEach((item) => {
        message += `• ${item.quantity}x ${item.nombre} - $${item.precio * item.quantity}\n`;
        if (item.observaciones) {
            message += `  _Nota: ${item.observaciones}_\n`;
        }
    });

    message += `--------------------------\n`;
    message += `*Total: $${total}*\n\n`;
    message += `¿Me confirman el pedido? 🙏`;

    // 2. Limpiamos el número (solo números, sin símbolos)
    const cleanPhone = phone.replace(/\D/g, "");

    // 3. Creamos el link final
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // 4. Abrimos en una pestaña nueva
    window.open(url, "_blank");
};