'use strict';

const lib = {
	node:{
		url:require('url')
	},
	deps:{
		co:require('co'),
		request:require('co-request'),
		expect:require('chai').expect
	},
	data:{
		server:require('./data/server'),
		tokens:require('./data/tokens')
	},
	common:{
		checkMissingTokenHeader:require('./common/checkMissingTokenHeader'),
		checkInvalidTokenHeader:require('./common/checkInvalidTokenHeader'),
		checkInvalidToken:require('./common/checkInvalidToken'),
		checkExpiredToken:require('./common/checkExpiredToken')
	}
};

describe('rest.parameters', function() {
	describe('#GET', function() {
		let config = {
			method:'GET',
			baseUrl:lib.data.server.URL,
			url:'/parameters',
			json:true
		};

		lib.common.checkMissingTokenHeader(config);
		lib.common.checkInvalidTokenHeader(config);
		lib.common.checkInvalidToken(config);
		lib.common.checkExpiredToken(config, lib.data.tokens.EXPIRED_USER);

		it('should return exchange parameters', function() {
			return lib.deps.co(function*() {
				let response = yield lib.deps.request(Object.assign({}, config, {
					auth:{
						bearer:lib.data.tokens.USER
					}
				}));

				lib.deps.expect(response.statusCode).to.equal(200);
				lib.deps.expect(response.body).to.be.an('object');
				lib.deps.expect(response.body.minimalAmount).to.be.a('number');
				lib.deps.expect(response.body.fees).to.be.an('object');
				lib.deps.expect(response.body.fees.strategy).to.be.oneOf(['MAKER_TAKER', 'BUY_SELL', 'FIXED']);

				switch(response.body.fees.strategy) {
					case 'MAKER_TAKER':
						lib.deps.expect(response.body.fees.maker).is.a('number');
						lib.deps.expect(response.body.fees.taker).is.a('number');
					break;
					case 'BUY_SELL':
						lib.deps.expect(response.body.fees.buy).is.a('number');
						lib.deps.expect(response.body.fees.sell).is.a('number');
					break;
					case 'FIXED':
						lib.deps.expect(response.body.fees.value).is.a('number');
					break;
				}
			});
		});
	});
});