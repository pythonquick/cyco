window.cypressTest = true;
const CypressInstance = (window.Cypress = window.parent.Cypress);
const devServerPublicPathRoute = CypressInstance.config('devServerPublicPathRoute');

const importsToLoad = [];

const { relative } = CypressInstance.spec;

importsToLoad.push({
  relativeUrl: '/cytest/cypress/support/component.js',
});

importsToLoad.push({
  relativeUrl: `${devServerPublicPathRoute}/${relative}`,
});

// trigger loading the imports
CypressInstance.onSpecWindow(window, importsToLoad);

CypressInstance.on('test:before:run', () => {});

// then start the test process
CypressInstance.action('app:window:before:load', window)

// Make usage of node test plugins possible
window.global = window;
window.process = typeof process !== 'undefined' ? process : {};
