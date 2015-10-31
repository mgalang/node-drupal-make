# Node Drupal Make

A simple automation tool built with Node.js for building/making a Drupal site. Used for simple automation of drupal site deploys or local development builds.

## Installation
    Clone this repository, and install:
    $ npm install -g

## Usage

First create your site's directory structure

    my_site/
        makefile
        site/
            themes/
            files/
            modules/
            settings.php

Note: The makefile should be a drush makefile (See http://www.drush.org/en/master/make/)

Then run node-drupal-make command inside your site's directory

    $ node-drupal-make
    
The node-drupal-make command will generate your drupal site to the /build directory and will link your themes, files, modules and settings. 

## Todo
* Tests
* CLI arguments
* Add database sync

## License

The MIT License (MIT)

Copyright (c) 2015 Marc Galang
