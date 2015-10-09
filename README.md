# Simple Iso

A lightweight container for consistently sharing state between servers and browsers.

## Installation
```
npm i simple-iso --save
```

## Usage
In order for an object to be hydratable (have its state stored and reused elsewhere at a later time), it must implement a `serialise` method. This represents the data that one wishes to share with the browser:

```
class ImageRepository {
	constructor(images) {
		this._images = images || [];
	}

	serialise() {
		return this._images;
	}
}
```

In your server code, import the container and `add` any references that you'll require across the server and client. Then pass the container's serialisation, using `iso.serialise()` in your response. For example, when using Express:

```
import express from 'express';
import iso from 'simple-iso';
import ImageRepository from './images/ImageRepository';
const app = express();

[...]
/* adding a mapping for the ImageRepository
 * prototype and its associated serialisation */
iso.add(new ImageRepository());

app.get('/', (req, res) => {
	res.status(200).render('images.handlebars', {
		appState: iso.serialise(); // gets the latest serialisation of ALL objects added to the container
	});
});
```

In the above example, `images.handlebars` should inject the state into a script tag:

```
[...]

<script>
{{{ appState }}}
</script>
```

Then, to retrieve a new instance with the injected state in the browser, call `iso.hydrate` on the type:
```
// FYI - I'm using Browserify and Babel for generating my client-side code
import iso from 'simple-iso';
import ImageRepository from './images/ImageRepository';

const repository = iso.hydrate(ImageRepository);
```

Whenever an instance added to the store receives new data, one should invoke `iso.update` to ensure that the server and client are both synchronised with the latest updates. Thus, in the hypothetical `ImageRepository`:
```
class ImageRepository {
	[...]

	onNewImage(image) {
		this._images.push(image);
		iso.update(this);
	}
}
```

## Examples
Consult my [fashion-timeline](https://github.com/jamesseanwright/fashion-timeline) project for an example of integrating Simple Iso. Alternatively, check out my [breaking-news](https://github.com/jamesseanwright/breaking-news) repo. This doesn't use the library explicitly, but contains the intitial implementation of the container, and it honours the same contract.