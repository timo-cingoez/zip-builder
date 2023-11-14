# ZipBuilder

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# TODO
* fix API :)
* parse commit files to FileData, maybe get the required info from api (extension, size) ?
* find a way to call py script for commits from project or fetch the commits with JS (would also make parsing easier)
* make custom logo that includes P4N
* add inputs for commit since/until
* fix zip/reset btn styling, add icons
* add toast messages for actions
* add input for final zip name (+api)
* show ignored dirs
* add unselectFile from searchedFiles (this means replace it with click handler)
* auto-highlight commits if all corresponding files are selected
* MAKE THE FIRST RELEASE!!!
* far future: port to electron
* far future: display files as tree? (probably useless / wont fit on screen)
