import iso from './build/iso';

// dummy class/prototype
class TestObject {
	serialise() {
		return {
			status: 'serialised!'
		};
	}
}

describe('the ISO module', function () {
	describe('add', function () {
		it(`should add an object's serialisation to its map`, function () {
			const instance = new TestObject();
			iso.add(instance);

			const map = iso._objects;
			map.TestObject.serialisation.should.deep.equal({ status: 'serialised!' });
		});
	});

	describe('update', function () {
		it(`should update an object's serialisation`, function () {
			const instance = new TestObject();
			iso.add(instance);

			instance.serialise = () => {
				return { 
					status: 'new serialisation!'
				};
			};

			iso.update(instance);

			const map = iso._objects;
			map.TestObject.serialisation.should.deep.equal({ status: 'new serialisation!' });
		});
	});

	describe('serialise', function () {
		it('should return a serialised IIFE representing a client-side property used for code retrieval', function () {
			const instance = new TestObject();
			iso.add(instance);

			const func = iso.serialise();
			func.should.contain(`window.appState = {"TestObject":{"serialisation":${JSON.stringify(instance.serialise())}}`);
		});
	});

	describe('hydrate', function () {
		it('should create an instance with any associated state on the server', function () {
			const instance = new TestObject();
			iso.add(instance);

			const hydratedInstance = iso.hydrate(TestObject);
			instance.serialise().should.deep.equal(hydratedInstance.serialise());
		});

		it(`should create an instance from the ISO container's serialisation data on the client`, function () {
			const instance = new TestObject();
			iso.add(instance);

			mockClient();
			const serialiseForClient = new Function(iso.serialise());
			serialiseForClient();

			const hydratedInstance = iso.hydrate(TestObject);
			instance.serialise().should.deep.equal(hydratedInstance.serialise());

			unmockClient();
		});
	});
});