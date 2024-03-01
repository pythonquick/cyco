import { defineConfig } from 'cypress';

async function devServer({ specs, cypressConfig, devServerEvents }) {
  const port = 3000;
  const close = () => console.log('supposed to be closing');
  return {
    port,
    close,
  };
}

export default defineConfig({
  component: {
    devServerPublicPathRoute: '/cytest',
    devServer,
  },
});
