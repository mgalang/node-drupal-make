/**
 * Simple drush helper module
 */

'use strict';

var spawn = require('child_process').spawn,
    exec = require('child_process').exec;

var drush = module.exports = {};

/**
 * Output drush data to console
 *
 * @param {object} data
 */
drush._log = function(data){
  process.stdout.write(data.toString('utf8'));
}

/**
 * Run a drush command
 *
 * @param {String}
 *    Drush command
 * @param {Array} args
 *    Drush command arguments
 * @param {Function} callback
 */
drush.run = function(cmd, args, callback){
  // Make sure that we have drush
  exec('which drush', function(err, stdout, stderr){
    if(err !== null){
      console.log('Drush not found');
      process.exit();
    }

    // Init spawn arguments and set drush command as first argument.
    var _args = [cmd];

    // Append drush arguments to spawn arguments.
    if(Array.isArray(args)){
      _args = _args.concat(args);
    }

    // Execute the drush command with arguments
    var proc = spawn('drush', _args);

    // Write drush output to console
    proc.stdout.on('data', drush._log);
    // Drush also outputs non-error messages to STDERR
    proc.stderr.on('data', drush._log);

    // Execute callback and pass boolean error value
    proc.on('close', function(code, signal){
      if(typeof(callback) === 'function'){
        callback(code !== 0);
      }
    })
  });
}
