let displayMath = 1;

if (displayMath) {
	import('./modules/maths.js').then(function (maths) {
		console.log(maths.square(7));
		console.log(maths.cube(4));
	});
}
