'use strict';

const lib = {
	data:{
		server:require('./data/server'),
		tokens:require('./data/tokens'),
		markets:require('./data/markets'),
		credentials:require('./data/credentials')
	}
};

describe('!data', function() {
	it('configuration files must be checked', function() {
		for(let name in lib.data) {
			if(!lib.data[name].COMPLETED) {
				throw new Error('Test data file [' + name + '] not properly completed, please recheck it.');
			}
		}
	});
});
