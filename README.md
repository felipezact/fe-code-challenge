# Code Challenge

Hello ! Welcome to the code challenge 🤩. We are looking forward to seeing what you will come up with!

Let us know if you have any questions and refer to the instructions sent to you. This readme contains mostly the install steps to get up and running with the application in its initial state.

### Prerequisites

- Install [Node.js](https://nodejs.org/) which includes [Node Package Manager][npm](https://www.npmjs.com/get-npm)
- Run `npm install` to install the node packages

## Introduction

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Development decisions
In order to provide a solution capable of rendering static data with fast performance, several decisions were made:

#### - Singleton Service:
Using a singleton service, I managed to simplify the architecture and increase maintainability. It also allowed for simple communication between components.

#### -  View Calculations:
Removing calculations from the view assisted in rendering. Since we were dealing with static data, it was imperative that calculations should be done only on push. Therefore, I decided to remove any calculations from loops inside the view.

#### -  Pagination:
An infinite scroll was implemented to display the data in batches, meeting the requirement for pagination.

#### - UI Decisions:
Any other UI decisions that might stand out were made with the intention of having fun and enhancing the user experience.
