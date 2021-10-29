const dr = require("./lib_dr/dataOrganizer");
dr.gateStartOrganize({
  channel: "futures.candlesticks",
  event: "subscribe",
  timeFrame: "1m",
  coinPaire: "BTC_USD",
  coin: "BTC",
  exchangeName: "gateio",
});
dr.gateStartOrganize({
  channel: "futures.candlesticks",
  event: "subscribe",
  timeFrame: "5m",
  coinPaire: "BTC_USD",
  coin: "BTC",
  exchangeName: "gateio",
});
