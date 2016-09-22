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

describe('rest.markets.market', function() {
	describe('#GET', function() {
		let config = {
			method:'GET',
			baseUrl:lib.data.server.URL,
			json:true
		};

		let configValid = Object.assign({}, config, {
			url:'/markets/' + lib.data.markets.VALID
		});

		let configUnknown = Object.assign({}, config, {
			url:'/markets/' + lib.data.markets.UNKNOWN
		});

		lib.common.checkMissingTokenHeader(configValid);
		lib.common.checkInvalidTokenHeader(configValid);
		lib.common.checkInvalidToken(configValid);
		lib.common.checkExpiredToken(configValid, lib.data.tokens.EXPIRED_USER);

		it('should throw for unknown market', function() {
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

		it('should return market info', function() {
			return lib.deps.co(function*() {
				let response = yield lib.deps.request(Object.assign({}, configValid, {
					auth:{
						bearer:lib.data.tokens.USER
					}
				}));

				lib.deps.expect(response.statusCode).to.equal(200);
				lib.deps.expect(response.body).to.be.an('object');
				lib.deps.expect(response.body.currency).to.be.a('string');
				lib.deps.expect(response.body.asset).to.be.a('string');
				lib.deps.expect(response.body.ticker).to.be.an('object');
				lib.deps.expect(response.body.ticker.last).to.be.a('number');
				lib.deps.expect(response.body.ticker.volume).to.be.an('object');
				lib.deps.expect(response.body.ticker.volume.currency).to.be.a('number');
				lib.deps.expect(response.body.ticker.volume.asset).to.be.a('number');
				lib.deps.expect(response.body.ticker.highest).to.be.a('number');
				lib.deps.expect(response.body.ticker.lowest).to.be.a('number');
				lib.deps.expect(response.body.ticker.percentChange).to.be.a('number');
			});
		});
	});
});