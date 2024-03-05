import './commands';
import { mount } from 'cypress/react18';

const Cypress = (window.Cypress = window.parent.Cypress);
Cypress.Commands.add('mount', mount);
Cypress.Commands.add('hike', mount);
