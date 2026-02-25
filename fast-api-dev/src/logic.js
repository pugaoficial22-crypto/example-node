const calculateValue = (price, stock) => {
	if (price < 0 || stock < 0) return 0;
	return price * stock;
};

// Validación adicional 1: verificar si hay stock
const hasStock = (stock) => {
	return stock > 0;
};

// Validación adicional 2: aplicar descuento
const applyDiscount = (price, discountPercent) => {
	if (discountPercent < 0 || discountPercent > 100) return price;
	return price - (price * discountPercent) / 100;
};

module.exports = {
	calculateValue,
	hasStock,
	applyDiscount
};
