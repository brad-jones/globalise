globalise
=========

Okay so firstly lets just get this out of the way, I am a PHP dev and I am
by no means a javascript expert. However I am having a play with node.js
for the first time... so please be gentle :)

To make my life more pleasurable in node I have created this
module that basically globalises everything, in effect providing
autoloading like I am used to in PHP. I hated having all these
require statements everywhere.

Feel free to send through as many death threats as you like but my new haraka
based mail server will filter them out... hahaha

How To Use
==========

	1. npm install globalise
	
	2. In your main.js:
	   require('globalise');
	
	3. Now everything is global, you can call up say
	   a path function without having to actually require path.

	   console.log(path.resolve('./'));

	   It just works!

*Okay so thats pretty neat, did I also mention we will autoload all your
installed modules but only from your applications node_modules folder.
Not from the global modules and we only go one level deep.*

What Else Do You Get
====================
So as if that wasn't enough I also include the node module "classical" for you.
You can check out it's docs for what it's all about:
https://npmjs.org/package/classical

We add on top of this and create a Namespace function. Again this is Global.

You can use it like so:

	./lib/brads/cool/namespace/foo.js - contains
	Namespace('brads.cool.namespace.foo', function(){ console.log('foo'); });

	./main.js - contains
	require('globalise');
	require('./lib/brads/cool/namespace/foo.js');
	brads.cool.namespace.foo();

But this isn't autoloaded at the moment, to do this you need to tell us where
your "lib" folder is that contains your javascript classes and functions all
nicely namespaced similar to what you might find in a PHP project.
Okay and now for the autoloading part, same example as above:

	
	./lib/brads/cool/namespace/foo.js - contains
	Namespace('brads.cool.namespace.foo', function(){ console.log('foo'); });

	./main.js - contains
	require('globalise');
	globalise.autoload('./lib');
	brads.cool.namespace.foo();

*globalise.autoload is syncronous*

**Yay no more requires ever again!!!**

The Fine Print
==============
I'll admit this probably has far reaching implications that I am unaware of
just yet. But it does seem to be working for me just fine and dandy for the
time being. I take no responsibility for the "security" or "performance"
implications this may or may not have on your application.