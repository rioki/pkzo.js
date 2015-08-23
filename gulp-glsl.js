'use strict';

// Copyright (c) 2015 bricebroussolle

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt) {
  if (!file) {
    throw new PluginError('gulp-glsl', 'Missing file option for gulp-glsl');
  }
  opt = opt || {};

  var fileName;
  var newBuffer;
  var firstFile;

  if (typeof file === 'string') {
    fileName = file;
  } else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
  } else {
    throw new PluginError('gulp-glsl', 'Missing path in file options for gulp-glsl');
  }
    
  /**
   *
   * @param file
   * @returns {Buffer}
   */
  function makeLines(file) {
    var content = file.contents;    
    var filePath = ((file.base && file.path) ? file.relative : file.path).split('.')[0];    
      
    var sep = '"';
    var end = ";\n";
    
    if (opt.ns) {
      var prefix = opt.ns + '.' ;
    }
    else {
      var prefix = "var ";
    }
    
    
    var suffix = " = ";
    var startLine = new Buffer(prefix + filePath + suffix + sep);
    var endLine = new Buffer(sep + end);

    var raw = file.contents.toString();
    raw = raw.replace(/(\n|\r|(\r\n))/g, '\\n');
    content = new Buffer(raw);

    return Buffer.concat([startLine, content, endLine]);
  }

  function bufferContents(file, enc, cb) {
        
    if (file.isNull()) {
      cb();
      return;
    }

    if (!firstFile) {
      firstFile = file;
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-glsl-concat',  'Streaming not supported'));
      cb();
      return;
    }

    if (!newBuffer) {
      newBuffer = new Buffer(0);
    }

    var nLine = makeLines(file);
    newBuffer = Buffer.concat([newBuffer, nLine]);

    cb();
  }

  function endStream(cb) {    
    var newFile;

    if (typeof file === 'string') {
      newFile = firstFile.clone({contents: false});
      newFile.path = path.join(firstFile.base, file);
    } else {
      newFile = firstFile;
    }
    
    newFile.contents = newBuffer;

    this.push(newFile);

    cb();
  }

  return through.obj(bufferContents, endStream);
};