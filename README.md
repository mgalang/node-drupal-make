# Node Drupal Make

An simple automation tool built with Node.js for building/making a Drupal site. Used for simple automation of drupal site deploys and local development builds.

## Installation
    Clone this repository, and install:
    $ npm install -g

## Site project directory structure
    my_site_project/
        makefile
        site/
            themes/
            files/
            modules/
            settings.php

Makefile - Drush makefile (See http://www.drush.org/en/master/make/)

## Usage
Run make command inside site project directory

    $ node-drupal-make

## Todo
* Tests
* CLI arguments
* Add database sync

## License

The MIT License (MIT)

Copyright (c) 2015 Marc Galang
