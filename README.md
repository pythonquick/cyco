Demo App with Cypress Component Test

# Steps to start app

1. Run `npm install`
2. Run `npm start`

# Start Cypress Component Test

1. Run `npx cypress open`
2. In Cypress test runner choose "Component Testing"
3. Choose the Chrome browser and click "Start Component Testing in Chrome"
4. Click the first (and only) component test to run: "Welcome.cy.js"

Currently fails when attempting to import script `cypress/support/component.js`:

```
Cannot use import statement outside a module
```
