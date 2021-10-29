var WebSocketClient = require("websocket").client;
const logWriter = require("../lib_log/logWriter");
var client = new WebSocketClient();
const baseUrl = "wss://fx-ws-testnet.gateio.ws/v4/ws/btc";
var socketConnection = null;
var gateio = {
  connect: (param, candelCallBack) => {
    client.on("connectFailed", function (error) {
      logWriter.wr(param.exchangeName, "Connect Error: " + error.toString());
    });

    client.on("connect", function (connection) {
      socketConnection = connection;
      logWriter.wr(param.exchangeName, "WebSocket Client Connected");
      connection.on("error", function (error) {
        logWriter.wr(param.exchangeName, "Connection Error: " + error.toString());
      });
      connection.on("close", function () {
        logWriter.wr(param.exchangeName, "echo-protocol Connection Closed");
      });
      connection.on("message", function (message) {
        console.log(message);
        var candel = JSON.parse(message.utf8Data);
        if (candel.event == "subscribe") {
          candelCallBack({
            status:"successfull",
            candel: candel.result,
            coinPaire: `${param.coinPaire}`,
            timeFrame: `${param.timeFrame}`,
            exchangeName:'gateio',
            type:"futures",
            coin:param.coin
          });
        } else {
          for (item in candel.result) {
            if (candel.result[item].n) {
              candelCallBack({
                status: "successfull",
                candel: candel.result[item],
                coinPaire: `${param.coinPaire}`,
                timeFrame: candel.result[item].n.substring(0, 2),
                exchangeName: "gateio",
                type: "futures",
                coin: param.coin,
                objEntry: param,
              });
            }
          }
        }
      });

      function runProgram() {
        if (connection.connected) {
          connection.sendUTF(
            `{"time" : ${param.time}, "channel" : "${param.channel}", "event": "${param.event}", "payload" :["${param.timeFrame}", "${param.coinPaire}"] }`
          );
        }
      }
      runProgram();
    });
    if (socketConnection == null || socketConnection.connected == false) client.connect(baseUrl);
    else
      socketConnection.sendUTF(
        `{"time" : ${param.time}, "channel" : "${param.channel}", "event": "${param.event}", "payload" :["${param.timeFrame}", "${param.coinPaire}"] }`
      );
  },
};
module.exports = gateio;
