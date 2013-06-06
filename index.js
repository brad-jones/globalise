////////////////////////////////////////////////////////////////////////////////
//                    __        ___            __   __                          
//              ____ |  |   ____\_ |__ _____  |  | |__| ______ ____             
//             / ___\|  |  /  _ \| __ \\__  \ |  | |  |/  ___// __ \            
//            / /_/  >  |_(  <_> ) \_\ \/ __ \|  |_|  |\___ \\  ___/            
//            \___  /|____/\____/|___  (____  /____/__/____  >\___  >           
//           /_____/                 \/     \/             \/     \/            
// =============================================================================
// -------- Designed and Developed by Brad Jones <brad @="bjc.id.au" /> --------
// =============================================================================
////////////////////////////////////////////////////////////////////////////////

// First up lets bring in our deps
require('classical');
var file = require('file');

/**
 * Function: Namespace
 * =============================================================================
 * We are going to add another language construct to the global scope.
 * You can use it like so:
 * 
 * brads/cool/namespace/foo.js
 * Namespace('brads.cool.namespace.foo', function(){ console.log('foo'); });
 * 
 * main.js
 * require('brads/cool/namespace/foo.js');
 * brads.cool.namespace.foo();
 * 
 * Parameters:
 * -----------------------------------------------------------------------------
 * name - the full name of the class, function or object
 * value - the class, function or object
 * 
 * Returns:
 * -----------------------------------------------------------------------------
 * void
 */
global.Namespace = function(name, value)
{
	// Add the new namespace to the global scope
	var base = global;
	
	// Split the name up
	var names = name.split('.');
	
	// Remove the last name and keep it for later
	var lastName = names.pop();
	
	// Walk the hierarchy, creating new objects where needed.
	// If the lastName was removed, then the last object is not set yet:
	for (var i = 0; i < names.length; i++)
	{
		base = base[names[i]] = base[names[i]] || {};
	}
	
	// If a value was given, set it to the last name:
	if (lastName) base = base[lastName] = value;
};

/**
 * Function: globalise.autoload
 * =============================================================================
 * Okay so this function is designed to be called for each lib directory
 * that the application wants to autoload. Please don't get confused.
 * Simply by requiring globalise it is enough to globalise all the core node
 * modules along with any installed modules int he applications node_modules
 * folder.
 * 
 * What this does is provides a PHPish way of doing autoloading.
 * You tell me where your lib folder is and assuming it contains a folder for
 * each part of the namespace and a file for the final part of the function or
 * class name we will automatically require those files for you.
 * 
 * Sorry that sounds really long winded I know...
 * 
 * Parameters:
 * -----------------------------------------------------------------------------
 * dir - the directory to autoload
 * 
 * Returns:
 * -----------------------------------------------------------------------------
 * void
 */
Namespace('globalise.autoload', function(dir)
{
	// Traverse the lib folder recursively
	file.walkSync(dir, function(start, dirs, files)
	{
		// Loop through the files that we find
		files.forEach(function(file)
		{
			// Require the file
			require(path.resolve(start+'/'+file));
		});
	});
});

// Here are all the core node modules.
// With a few exceptions that we need not worry about.
var core_modules =
[
	'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
	'crypto', 'dgram', 'dns', 'domain', 'events', 'freelist', 'fs', 'http',
	'https', 'net', 'os', 'path', 'punycode', 'querystring', 'readline',
	'repl', 'stream', 'string_decoder', 'tls', 'tty', 'url', 'util', 'vm',
	'zlib'
];

// Lets loop through all those and require them
// and add the export to the global scope.
core_modules.forEach(function(module)
{
	// Just double check it doesn't already exist
	if (typeof global[module] == 'undefined')
	{
		Namespace(module, require(module));
	}
});

// Now we need to load all the installed modules, only local to this app
fs.readdirSync('./node_modules').forEach(function(module)
{
	// We don't want to include ourselves again
	if (module != 'globalise')
	{
		// Just double check it doesn't already exist
		if (typeof global[module] == 'undefined')
		{
			// Require the module and load what it exports into the global scope
			Namespace(module, require(module));
		}
	}
});

// We also need to load modules from the directory above us
// if we have been included as a dep to some other framework,
// like for example bjnode
if (path.resolve(__dirname+'/..') != path.resolve('./node_modules'))
{
	fs.readdirSync(__dirname+'/..').forEach(function(module)
	{
		// Just double check it doesn't already exist
		if (typeof global[module] == 'undefined')
		{
			// Require the module and load what it exports into the global scope
			Namespace(module, require(module));
		}
	});
}