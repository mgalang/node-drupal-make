/**
 * Nodejs Drupal Make
 */

var path = require('path'),
    drush = require('./drush'),
    fs = require('fs'),
    fse = require('fs-extra');

var DrupalMake = {};

DrupalMake.opts = {
  make_file: 'makefile',
  temp_build: '_build',
  final_build: 'build',
  site_files: 'site'
};

/**
 * Stat makefile to check if it exists
 */
DrupalMake._makefileExists = function(){
  try {
    fs.statSync(this.opts.make_file);
  } catch(e) {
    return false;
  }
  return true;
};

/**
 * Move temporary build to final build directory
 * @todo, use move instead of copy.
 */
DrupalMake.tempToFinal = function(callback){
  console.log('Finalizing build.');

  fse.removeSync(this.opts.final_build);

  try {
    fse.copySync(this.opts.temp_build, this.opts.final_build);
  } catch(e) {
    return false;
  }

  // Remove temporary build
  fse.remove(this.opts.temp_build);

  return true;
};

/**
 * Create a backup of the current build if any
 */
DrupalMake.backupBuild = function(){
  console.log('Creating a backup of current build.');

  try {
    fse.copySync(this.opts.final_build, this.opts.final_build + '_backup');
  } catch(e) {
    return false;
  }
  return true;
};

/**
 * Revert to a previous build
 */
DrupalMake.revertBuild = function() {
  console.log('Reverting to previous build.');

  try {
    fse.copySync(this.opts.final_build + '_backup', this.opts.final_build);
  } catch(e) {
    return false;
  }
  return true;
};

/**
 * Link site (themes, modules, files) from the site dir to build dir
 */
DrupalMake.linkSiteFiles = function(){
  var _theme_path = path.join(this.opts.temp_build, 'sites/all/themes'),
      _files_path = path.join(this.opts.temp_build, 'sites/default/files');
      _modules_path = path.join(this.opts.temp_build, 'sites/all/modules/custom');

  try {
    fs.accessSync(this.opts.site_files);
  } catch(e) {
    return;
  }

  console.log('Linking files');

  // Remove theme directory before linking
  fse.removeSync(_theme_path);

  // Link themes
  fs.symlinkSync(
    path.resolve(this.opts.site_files, 'themes'), _theme_path, 'dir'
  );

  // Link files
  fs.symlinkSync(
    path.resolve(this.opts.site_files, 'files'), _files_path, 'dir'
  );

  // Link modules
  fs.symlinkSync(
    path.resolve(this.opts.site_files, 'modules'), _modules_path, 'dir'
  );

  // Copy settings
  fs.linkSync(
    path.join(this.opts.site_files, 'settings.php'),
    path.join(this.opts.temp_build, 'sites/default/settings.php')
  );
};

/**
 * Execute drush updb and clear all cache
 */
DrupalMake.updateDb = function(){
  var _drush_root = this.opts.final_build;

  drush.run('updb', ['--root='+_drush_root], function(){
    drush.run('cc', ['--root='+_drush_root]);
  });
};

/**
 * Start drupal make
 */
DrupalMake.start = function(){
  var self = this,
      opts = self.opts;

  // Make sure makefile exists
  if(!self._makefileExists()){
    console.log('Error loading the makefile.');
    process.exit();
  }

  // Remove old temporary build directory if any
  console.log('Removing old build\n');
  fse.remove(opts.temp_build);

  // Execute drush make
  drush.run('make', [opts.make_file, opts.temp_build], function(err){
    if(err){
      console.log('Error during make.');
      process.exit();
    }

    self.backupBuild();

    self.linkSiteFiles();

    if(!self.tempToFinal()){
      console.error('Build failed. Could not create build directory');

      self.revertBuild();
      process.exit();
    }

    self.updateDb();

    console.log('Build complete');
  });
};

module.exports = DrupalMake;
