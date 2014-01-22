var through = require('through2');
var dot = require('dot');
var gutil = require('gulp-util');
var _ = require('lodash');
var path = require('path');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-templatify';

function getTemplateName(root, name, extension, separator) {
	var parts = name.split(path.sep);
	var i = parts.indexOf(root);
	parts = parts.slice(i + 1);
	i = parts.length - 1;
	parts[i] = path.basename(parts[i], extension);
	return parts.join(separator);
}

function getTemplateCode(content) {
	return dot.template(content).toString();
}

function readStream(stream, done) {
	var buffer = '';
	stream.on('data', function (chunk) {
		buffer += chunk;
	}).on('end', function () {
		done(null, buffer);
	}).on('error', function (error) {
		done(error);
	});
}

function gulpDotify(options) {
	options = options || {};
	_.defaults(options, {
		root: 'views',
		separator: '-',
		extension: '.html',
		dictionary: 'JST'
	});
	var stream = through.obj(function (file, enc, callback) {
		var complete = function (error, contents) {
			if (error) {
				throw new PluginError(PLUGIN_NAME, error);
			}
			
			var name = getTemplateName(options.root, file.path, options.extension, options.separator);
			var code = getTemplateCode(contents);
			file.contents = new Buffer([options.dictionary, '["', name, '"] = ', code, ';'].join(''));
			
			this.push(file);
			return callback();
		}.bind(this);

		if (file.isBuffer()) {
			complete(null, file.contents.toString());
		} else if (file.isStream()) {
			readStream(file.contents, complete);
		}
	});
	return stream;
};

module.exports = gulpDotify;
