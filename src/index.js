import React from 'react';
import { createRoot } from 'react-dom/client';
import { Welcome } from './components/Welcome.js';
import './cypress/component.js'

const Index = () => {
  console.log('Index');
  return <Welcome />;
};

const root = createRoot(document.getElementById('root'));
root.render(<Index />);
