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

describe('rest.markets.market.trades', function() {
	describe('#GET', function() {
		let config = {
			method:'GET',
			baseUrl:lib.data.server.URL,
			json:true
		};

		let configValid = Object.assign({}, config, {
			url:'/markets/' + lib.data.markets.VALID + '/trades'
		});

		let configUnknown = Object.assign({}, config, {
			url:'/markets/' + lib.data.markets.UNKNOWN + '/trades'
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

		it('should return trades', function() {
			return lib.deps.co(function*() {
				let startDate = Math.round((Date.now() - 1000 * 60 * 5) / 1000) * 1000;
				let endDate = Math.round(Date.now() / 1000) * 1000;
				let response = yield lib.deps.request(Object.assign({}, configValid, {
					url:configValid.url + '?startDate=' + startDate + '&endDate=' + endDate,
					auth:{
						bearer:lib.data.tokens.USER
					}
				}));

				lib.deps.expect(response.statusCode).to.equal(200);
				lib.deps.expect(response.body).to.be.an('array');

				for(let trade of response.body) {
					let tradeDate = new Date(trade.date);

					lib.deps.expect(trade).to.be.an('object');
					lib.deps.expect(trade.id).to.be.a('string');
					lib.deps.expect(trade.date).to.be.a('string');
					lib.deps.expect(tradeDate.toString()).to.equal(trade.date);
					lib.deps.expect(tradeDate.getTime()).to.be.at.least(startDate);
					lib.deps.expect(tradeDate.getTime()).to.be.at.most(endDate);
					lib.deps.expect(trade.type).to.be.oneOf(['BUY', 'SELL']);
					lib.deps.expect(trade.rate).to.be.a('number');
					lib.deps.expect(trade.amount).to.be.a('number');
				}
			});
		});
	});
});
