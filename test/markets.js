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

describe('rest.markets', function() {
	describe('#GET', function() {
		let config = {
			method:'GET',
			baseUrl:lib.data.server.URL,
			url:'/markets',
			json:true
		};

		lib.common.checkMissingTokenHeader(config);
		lib.common.checkInvalidTokenHeader(config);
		lib.common.checkInvalidToken(config);
		lib.common.checkExpiredToken(config, lib.data.tokens.EXPIRED_USER);

		it('should return available markets', function() {
			return lib.deps.co(function*() {
				let response = yield lib.deps.request(Object.assign({}, config, {
					auth:{
						bearer:lib.data.tokens.USER
					}
				}));

				lib.deps.expect(response.statusCode).to.equal(200);
				lib.deps.expect(response.body).to.be.an('array');

				for(let market of response.body) {
					lib.deps.expect(market).to.be.an('object');
					lib.deps.expect(market.currency).to.be.a('string');
					lib.deps.expect(market.asset).to.be.a('string');
					lib.deps.expect(market.types).to.be.an('array');

					for(let type of market.types) {
						lib.deps.expect(type).to.be.oneOf(['EXCHANGE', 'MARGIN']);
					}
				}
			});
		});
	});
});