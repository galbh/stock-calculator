const INCOME_TAX = 0.35;
const PROFIT_TAX = 0.25;
const PURCHASE_VALUE = 46;

let STOCK_COUNT = null;
let STOCK_VALUE = null;
let DOLLAR_VALUE = null;

const STORAGE_KEY = 'finhub-token';

const queryParam = window.location.search.split('?token=')[1];
const finhubToken = localStorage.getItem(STORAGE_KEY) || queryParam;

const fetchStockValue = () => {
  return fetch(`https://finnhub.io/api/v1/quote?symbol=SEDG;token=${finhubToken}`)
    .then(res => res.json());
}

const fetchDollarValue = () => {
  return fetch('https://api.exchangeratesapi.io/latest?base=USD;symbols=ILS')
    .then(res => res.json());
}

const fetchData = () => {
  return fetchStockValue().then(res => STOCK_VALUE = res.c)
    .then(fetchDollarValue)
    .then(res => DOLLAR_VALUE = res.rates.ILS);
}

const setHtml = () => {
  document.querySelector('form').style = 'display:block';
  document.querySelector('.dollar-value').innerHTML = `<span>dollar value: </span>${DOLLAR_VALUE}`;
  document.querySelector('.stock-value').innerHTML = `<span>stock value: </span> ${STOCK_VALUE}`;
  document.querySelector('form input').focus();
}

const setInitialState = () => {
  if (finhubToken) {
    fetchData().then(setHtml);
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, finhubToken);
    } else {
      if (!queryParam) {
        window.location.search = `token=${finhubToken}`;
      }
    }
  } else {
    document.querySelector('.error').innerHTML = 'Finhub token is missing in url query params (?token=SECRET)'
  }
}

setInitialState();

const onSubmit = (e) => {
  e.preventDefault();
  const count = document.querySelector('.stock-count').value;
  const element = document.querySelector('.value');
  STOCK_COUNT = parseInt(count);
  const total = getTotalInShekel();
  element.style = 'display:block';
  element.innerHTML = `${total.toFixed(2)} ₪`;
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
