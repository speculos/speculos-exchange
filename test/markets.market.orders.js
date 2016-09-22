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
		tokens:require('./data/tokens'),
		markets:require('./data/markets')
	},
	common:{
		checkMissingTokenHeader:require('./common/checkMissingTokenHeader'),
		checkInvalidTokenHeader:require('./common/checkInvalidTokenHeader'),
		checkInvalidToken:require('./common/checkInvalidToken'),
		checkExpiredToken:require('./common/checkExpiredToken')
	}
};

describe('rest.markets.market.orders', function() {
	describe('#GET', function() {
		let config = {
			method:'GET',
			baseUrl:lib.data.server.URL,
			json:true
		};

		let configValid = Object.assign({}, config, {
			url:'/markets/' + lib.data.markets.VALID + '/orders'
		});

		let configUnknown = Object.assign({}, config, {
			url:'/markets/' + lib.data.markets.UNKNOWN + '/orders'
		});

		lib.common.checkMissingTokenHeader(configValid);
		lib.common.checkInvalidTokenHeader(configValid);
		lib.common.checkInvalidToken(configValid);
		lib.common.checkExpiredToken(configValid, lib.data.tokens.EXPIRED_USER);

		it.skip('should throw for unknown market', function() {
			return lib.deps.co(function*() {
				let response = yield lib.deps.request(Object.assign({}, configUnknown, {
					auth:{
						bearer:lib.data.tokens.USER
					}
				}));

				lib.deps.expect(response.statusCode).to.equal(404);
				lib.deps.expect(response.body).to.be.an('object');
				lib.deps.expect(response.body.code).to.equal('market.notFound');
				lib.deps.expect(response.body.message).to.be.a('string');
			});
		});

		it('should return orders', function() {
			return lib.deps.co(function*() {
				let depth = 10;
				let response = yield lib.deps.request(Object.assign({}, configValid, {
					url:configValid.url + '?depth=' + depth,
					auth:{
						bearer:lib.data.tokens.USER
					}
				}));

				lib.deps.expect(response.statusCode).to.equal(200);
				lib.deps.expect(response.body).to.be.an('object');
				lib.deps.expect(response.body.asks).to.be.an('array');
				lib.deps.expect(response.body.asks.length).to.equal(depth);
				lib.deps.expect(response.body.bids).to.be.an('array');
				lib.deps.expect(response.body.bids.length).to.equal(depth);

				for(let order of response.body.asks) {
					lib.deps.expect(order).to.be.an('object');
					lib.deps.expect(order.rate).to.be.a('number');
					lib.deps.expect(order.amount).to.be.a('number');
				}

				for(let order of response.body.bids) {
					lib.deps.expect(order).to.be.an('object');
					lib.deps.expect(order.rate).to.be.a('number');
					lib.deps.expect(order.amount).to.be.a('number');
				}
			});
		});
	});
});