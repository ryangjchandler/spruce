# Changelog

All notable changes to this project will be documented in this file.

## v0.2.0

### Added

* Added a new experimental config API that allows developers to enable usage of a global $store variable, without needing components to subscribe through the x-subscribe directive (see bottom of [README](README.md) for more info).

## v0.1.2

### Fixed

* Fixed not being able to set data to null or undefined post startup

## v0.1.1

### Fixed

* Fixed bug where null or undefined values on start would throw a TypeError since they can't be converted to objects. (closes #1)

## v0.1.0

### Added

* Better documentation.
* Better ES integration.

## v0.0.1

### Added

* Initial release

