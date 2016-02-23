var fs    = require('graceful-fs');
var path  = require('path');
var mout  = require('mout');

/**
 * Resolve and load files and directories from multiple filesystem search paths
 * @param  {array|string}   basepath    The search paths
 * @param  {string}         encoding    The encoding to use when loading files
 * @return {function}                   The loader instance
 */
function loader(basepath, encoding) {

    var ret = {};

    encoding = encoding || 'utf8';

    if (typeof basepath == 'string')
        basepath = [basepath];

    if (basepath && typeof basepath !== 'object')
        basepath = [];

    basepath = (basepath) ? basepath.map(function(search) {

        return path.normalize(search);

    }) : null;

    /**
     * Resolve file or directory path from the filesystem
     * @param  {string}         to      The path to resolve
     * @param  {array|string}   from    The search path(s)
     * @return {string}                 The resolved path
     */
    ret.resolve = function (to, from) {

        if (basepath) {

            from = basepath;

            if (typeof basepath == 'object') {

                var resolve = [];

                basepath.forEach(function(from) {
                    if (typeof to == 'object') {
                        to.forEach(function(to) {
                            resolve.push(path.resolve(from, to));
                        });
                        return true;
                    }
                    resolve.push(path.resolve(from, to));
                });

                resolve = mout.array.unique(resolve);

                var template;

                mout.array.forEach(resolve, function(file) {

                    template = false;

                    try {
                        template = fs.readdirSync(file);
                        resolve = file;
                    }
                    catch(e) {}

                    try {
                        template = fs.readFileSync(file, encoding);
                        resolve = file;
                    } catch(e) {}

                    if (template)
                        return false;
                });

                if ( ! template)
                    throw new Error("No such file or directory: " + resolve.join(', '));

                return resolve;

            }

        } else {
            from = (from) ? path.dirname(from) : process.cwd();
        }

        return path.resolve(from, to);
    };

    /**
     * Resolve a file path on the filesystem and load the resolved file contents
     * @param  {string}   identifier    The file path
     * @param  {Function} cb            Callback, when provided the file will be read asynchronously
     * @return {string}                 The resolved file contents
     */
    ret.load = function (identifier, cb) {
        if (!fs || (cb && !fs.readFile) || !fs.readFileSync) {
            throw new Error('Unable to find file ' + identifier + ' because there is no filesystem to read from.');
        }

        identifier = ret.resolve(identifier);

        if (typeof identifier == 'object') {

            identifier = mout.array.unique(identifier);

            var template;

            mout.array.forEach(identifier, function(file) {
                template = false;
                try {
                    template = fs.readFileSync(file, encoding);
                }
                catch(e) {}
                if (template) return false;
            });

            return template;
        }

        if (cb) {
            fs.readFile(identifier, encoding, cb);
            return;
        }
        return fs.readFileSync(identifier, encoding);
    };

    return ret;
}

module.exports = loader;