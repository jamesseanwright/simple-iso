const clientProperty = 'window.appState';

export default {
	_objects: {},
	add: function add(object) {
		const name = object.constructor.name;
		this._objects[name] = {
			serialisation: object.serialise()
		};
	},

	update: function update(object) {
		this._objects[object.constructor.name].serialisation = object.serialise();
	},

	serialise: function serialise() {
		return `(function () { 
			${clientProperty} = ${JSON.stringify(this._objects)}
		}())`;
	},

	hydrate: function hydrate(Constructor) {
		const isNode = global.document === undefined;
		const state = isNode ? this._objects[Constructor.name] : new Function(`return ${clientProperty}['${Constructor.name}']`)();
		const instance = new Constructor(state ? state.serialisation : null);

		if (!isNode) {
			this.add(instance);
		}

		return instance;
	}
};