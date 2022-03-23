# JavaScript-Filters
MATLAB Filters re-written in JS for use on NodeJS. All files are module JavaScript files since I prefer the import {} style syntax over require() & I like keeping my fuctions in separate files.

In our project they provided 98% similarity in our results to what the MATLAB filters were giving.

These were filters that were used in my Senior Design CPR App. Couldn't run MATLAB scripts natively on Android so I re-wrote the fuctions from scratch to be able to be ran in our React-Native project.

# Dependencies:
-MathJS (handles our complex numbers in the butterworth)

# Installation
-in the main JavaScript-Filters folder do: `npm install mathjs` to initiate the folder as a node project and to install math.js.

# Test.mjs
Module JavaScript file, this the data that was ran during our testing trials. This can be ran as a test file, average value (2nd to last) should come out as roughly 2.17 (inches).
