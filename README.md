# star-chamber-ui

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

# Requirement
For proper Angular JS dev and test, following module are needed:
  * NodeJs: Execution environment
  
  * Npm: package manager
  
  * Grunt: Javascript task runner.
  
  * Yeoman: Code generator , this project use generator-angular code generator.

  * Karma:Unit testing runner for javascript 
  * Jasmine: Unit test framework for javascript
  
#Help
  * Folder
    - App folder contain all the app's AngularJS component such as services,controllers,views
    - (Optional)bower_component: bower modules installed during compile and code scaffolding , do not commit this.
    - (Optional)node_modules: npm modules installed during compile and code scaffolding , do not commit this.
    - test: contain the Jasmine javascript test suits. When using 'yo angular:<component>' , a test suit file will automatically be generated in the corresponding subfolder inside test/spec
  
  Read each folder's readme for more information

  * File:
    - package.json:defining the package need , needed for nodeJS compiler.Also describe scripts to run when compile and build.
    - .travis.yml: Another build script. For YAML build engine only
    - .jshintrc: config file for JSHint plugin
    - .gitignore: contain all the folder/file need to be ignore when push
    - GruntFile.js: contain the build scripts/ procedure when run 'grunt serve' or 'grunt test
    -  others .file: generated during code scaffolding. Do not modify. Run command specific to modify instead 
    - (Optional)Starchamber.iml: another intelliJ generated file. Delete at will if don't use intelliJ
