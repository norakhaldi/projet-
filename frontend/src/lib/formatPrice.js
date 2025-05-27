export function formatPrice(price, currency = 'DA') {
    const multiplied = price * 100;
    return `${multiplied.toFixed(2)} ${currency}`;
  }
  