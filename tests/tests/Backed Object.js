var util = require( "../assert-to-console" );
var BackedObject = require( "../../lib/BackedObject" );

console.log( JSON.stringify( { assertionCount: 11 } ) );

// The backing fails when it is commanded to fail
var failMessage;
var called = false;
function backer( object ) {
	called = object;
	if ( failMessage ) {
		return new Error( failMessage );
	}
}

var host = {};

BackedObject.attach( host, "test", {
	someProperty: null,
	someOtherProperty: "Siegfried"
}, backer );

// Set a property
host.test.someProperty = false;
util.assert( "deepEqual", called, {
	someProperty: false,
	someOtherProperty: "Siegfried"
}, "Backer was called with correct object when setting attached object property" );
util.assert( "deepEqual", host.test, {
	someProperty: false,
	someOtherProperty: "Siegfried"
}, "Backed property has the correct value" );
called = false;

// Set a random property for which there is no backing
host.test.something = 3.1415926;
util.assert( "strictEqual", called, false, "Backer was not called for non-backed property" );
util.assert( "deepEqual", host.test, {
	someProperty: false,
	someOtherProperty: "Siegfried",
	something: 3.1415926
}, "Non-backed property was attached to object" );

// Set the attached object
host.test = {
	someOtherProperty: "Gertrud"
};
util.assert( "deepEqual", called, {
	someProperty: null,
	someOtherProperty: "Gertrud"
}, "Backer was called with correct object when setting attached object" );
util.assert( "deepEqual", host.test, {
	someProperty: null,
	someOtherProperty: "Gertrud"
}, "Backed property has the correct value" );
called = false;

// Set a property of the attached object, but fail in the process
failMessage = "Failed to set member 'someProperty'";
try {
	host.test.someProperty = 12;
} catch ( anError ) {
	util.assert( "strictEqual", "" + anError, "Error: " + failMessage,
		"Backer failed with correct message when attempting to set attached object property" );
}
util.assert( "deepEqual", called, {
	someProperty: 12,
	someOtherProperty: "Gertrud"
}, "Backer was called with correct object when attempting to set attached object property" );
util.assert( "deepEqual", host.test, {
	someProperty: null,
	someOtherProperty: "Gertrud"
}, "Backed property has the correct (unchanged) value" );
failMessage = undefined;
called = false;

// Successfully set a property of the attached object
host.test.someProperty = 15;
util.assert( "deepEqual", called, {
	someProperty: 15,
	someOtherProperty: "Gertrud"
}, "Backer was called with correct object when setting attached object property" );
util.assert( "deepEqual", host.test, {
	someProperty: 15,
	someOtherProperty: "Gertrud"
}, "Backed property has the correct value" );
called = false;
