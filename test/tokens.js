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
		credentials:require('./data/credentials')
	},
	common:{
		checkMissingTokenHeader:require('./common/checkMissingTokenHeader'),
		checkInvalidTokenHeader:require('./common/checkInvalidTokenHeader'),
		checkInvalidToken:require('./common/checkInvalidToken'),
		checkExpiredToken:require('./common/checkExpiredToken')
	}
};

describe('rest.tokens', function() {
	describe('#POST', function() {
		let config = {
			method:'POST',
			baseUrl:lib.data.server.URL,
			url:'/tokens',
			json:true
		};

		lib.common.checkMissingTokenHeader(config);
		lib.common.checkInvalidTokenHeader(config);
		lib.common.checkInvalidToken(config);
		lib.common.checkExpiredToken(config, lib.data.tokens.EXPIRED_USER);

		it('should throw for missing or invalid credentials', function() {
			return lib.deps.co(function*() {
				let response = yield lib.deps.request(Object.assign({}, config, {
					auth:{
						bearer:lib.data.tokens.USER
					}
				}));

				lib.deps.expect(response.statusCode).to.equal(409);
				lib.deps.expect(response.body).to.be.an('object');
				lib.deps.expect(response.body.code).to.equal('validation');
				lib.deps.expect(response.body.message).to.be.a('string');
			});
		});

		it('should return exchange token', function() {
			return lib.deps.co(function*() {
				let response = yield lib.deps.request(Object.assign({}, config, {
					auth:{
						bearer:lib.data.tokens.USER
					},
					json:lib.data.credentials.VALID
				}));

				lib.deps.expect(response.statusCode).to.equal(200);
				lib.deps.expect(response.body).to.be.an('object');
				lib.deps.expect(response.body.token).to.be.a('string');
			});
		});
	});
});
