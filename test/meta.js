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
		server:require('./data/server')
	}
};

describe('rest.meta', function() {
	describe('#GET', function() {
		it('should return server meta data', function() {
			return lib.deps.co(function*() {
				let response = yield lib.deps.request({
					method:'GET',
					baseUrl:lib.data.server.URL,
					url:'/meta',
					json:true
				});

				lib.deps.expect(response.statusCode).to.equal(200);
				lib.deps.expect(response.body).to.be.an('object');
				lib.deps.expect(response.body.name).to.be.a('string');
				lib.deps.expect(response.body.version).to.be.a('string');
				lib.deps.expect(response.body.token).to.be.an('object');
				lib.deps.expect(response.body.token.algorithm).to.be.a('string');
				lib.deps.expect(response.body.token.publicKey).to.be.a('string');
				lib.deps.expect(response.body.token.version).to.be.a('number');
			});
		});
	});
});
