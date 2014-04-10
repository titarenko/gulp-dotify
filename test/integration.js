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

	it('should not throw errors inside a stream', function (done) {
		var stream = dotify();

		stream.on('end', function () {
			done();
		});

		stream.on('error', function (e) {
			e.message.should.eql('Unexpected token =');
			done();
		});

		var file = new gutil.File({
			path: 'name.html',
			cwd: './',
			base: './',
			contents: new Buffer('<div>{{!= it.name }}</div>')
		});
		stream.write(file);

		stream.end();
	});
});
