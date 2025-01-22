
module.exports = (ctx, amount) => {
  ctx.replyWithInvoice(
    "Пожертвования", // Product title
    `Пожертвовать ${amount} звезд`, // Product description
    "{}", // Product payload, not required for now
    "XTR", // Stars Currency
    [{ amount, label: `${amount} Звезд` }],
  );
};
