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

CypressInstance.onSpecWindow(window, importsToLoad);

CypressInstance.on('test:before:run', () => {});

// Make usage of node test plugins possible
window.global = window;
window.process = typeof process !== 'undefined' ? process : {};
