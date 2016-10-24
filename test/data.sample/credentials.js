'use strict';

/*
	Valid credentials to pass to the tokens creation endpoint.
	Those credentials are exchange specific.

	WARNING:	The trading API tests may send orders to the exchange.
				Make sure the account doesn't hold too much funds or the exchange URL points to a test instance.
*/
module.exports.VALID = {
	apiKey:'AAAAAAAA-AAAAAAAA-AAAAAAAA-AAAAAAAA',
	apiSecret:'0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
};

/*
	Duck variable to ensure that this file has been completed properly.
	Change this value to "true".
*/
module.exports.COMPLETED = false;
