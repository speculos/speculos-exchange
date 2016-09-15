# Speculos - Exchange

This repository holds the abstract [REST](REST.md) and [WS](WS.md) interfaces of a typical [Speculos](https://github.com/speculos/speculos) exchange.

## Implementation

Speculos is built around a component-based approach, so the implementation is entirely left to the contributor. The only requirement is the common REST and WS interfaces.

Nonetheless, here are some implementation concern that could be of help:
- The exchange module has the responsibility to create new JWTs to allow clients to interact with the **private** API (account and trading endpoints). Make sure the users can configure the private key used to sign the issued tokens.
- It is highly encouraged to allow an HTTPS/WSS exposition of your API to enforce security. In this case, make sure the user can fully customize the secure layer (private key, certificate and root CAs).
- Most exchanges have two communication modes. Make sure to bind the appropriate communication modes to the exposed REST and WS endpoints to ensure the best efficiency:
	- Fire-and-forget: Usually plain HTTP(S) requests to access historical data (trades), tickers and private APIs (account and trading). Bind them to the REST API endpoints.
	- Live data: Usually a WebSocket to receive live markets data (trades and order book). Bind it to the WS endpoints.

## Known exchange modules

- [speculos-exchanges-poloniex](https://github.com/speculos/speculos-exchanges-poloniex): Official exchange module that supports the [Poloniex](https://poloniex.com) exchange.

## Contributions

If you want to add a new Speculos exchange module to the previous list, just make a pull request with the modified version of this file containing a link to your repository. Your module will be reviewed to ensure full compliance before being added to this page.