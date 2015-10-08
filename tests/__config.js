import chai, { should } from 'chai';
chai.use(should);

function mockClient() {
	global.window = {};
	global.document = global.window.document = {};
}

function unmockClient() {
	delete global.document;
	delete global.window;
}