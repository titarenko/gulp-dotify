var dotify = require('../');
var gutil = require('gulp-util');

describe('gulp-dotify', function () {
	it('should process files with default options just as expected :)', function (done) {
		var stream = dotify();

		stream.on('data', function (file) {
			file.contents.toString().should.equal('JST["name"] = function anonymous(it) {\nvar out=\'\';return out;\n};');
		});
		stream.once('end', function () {
			done();
		});

		var file = new gutil.File({
			path: 'name.html',
			cwd: './',
			base: './',
			contents: new Buffer('')
		});
		stream.write(file);
		stream.end();
	});
});
