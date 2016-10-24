# Speculos - Exchange - WS

The WebSocket interface exposed by the exchange module:
- **MUST** be accessible via an `upgrade` request to the REST API server.
- **MUST** provide the full commands described bellow.
- **CAN** expose extra commands. In this case, the extra commands documentation **MUST** be provided along with the exchange module.

## Endpoints

The following endpoints can be upgraded to obtain a corresponding live data stream:
- `/markets/{market}/trades`: Live atomic trades.
- `/markets/{market}/orders`: Order book updates (buy/sell intents modification/removal). The first returned entries initialize the order book to its current state on the exchange.
