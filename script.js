const INCOME_TAX = 0.35;
const PROFIT_TAX = 0.2;
const PURCHASE_VALUE = 46;

let STOCK_COUNT = null;
let STOCK_VALUE = null;
let DOLLAR_VALUE = null;

const getStockValue = () => {
  return fetch(`https://finnhub.io/api/v1/quote?symbol=SEDG;token=${window.FINHUB_TOKEN}`)
    .then(res => res.json());
}

const getDollarValue = () => {
  return fetch('https://api.exchangeratesapi.io/latest?base=USD;symbols=ILS')
    .then(res => res.json());
}

getStockValue().then(res => STOCK_VALUE = res.c)
  .then(getDollarValue)
  .then(res => DOLLAR_VALUE = res.rates.ILS);

const onSubmit = (e) => {
  e.preventDefault();
  const count = document.querySelector('.stock-count').value;
  const element = document.querySelector('.value');
  STOCK_COUNT = parseInt(count);
  const total = getTotalInShekel();
  element.style = 'display:block';
  element.innerHTML = `${total.toFixed(2)}₪`;
}

const getTotalValue = () => STOCK_COUNT * STOCK_VALUE

const getProfit = () => (STOCK_VALUE - PURCHASE_VALUE) * STOCK_COUNT

const getReducedTax = () => {
  const profit = getProfit();
  const profitTaxReduced = profit - (profit * PROFIT_TAX);
  const rest = getTotalValue() - profit;
  const restTaxReduced = rest - (rest * INCOME_TAX);
  return profitTaxReduced + restTaxReduced;
}

const getTotalInShekel = () => getReducedTax() * DOLLAR_VALUE;
