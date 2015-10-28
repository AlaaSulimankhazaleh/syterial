# syterial
A Material Design CSS Framework and Angular directives

**WARNING:** This repo is under heavily development. The current status is far from a productional usage.

## Build

To build the Javascript- and CSS-files simple run

	grunt

The standard primary color and accent color are brown and amber.
If you want to use other colors, use something like this:

	lessc --modify-var="primaryColor=@indigo" --modify-var="accentColor=@pink" less\syterial.less [path\to\your\project]

	