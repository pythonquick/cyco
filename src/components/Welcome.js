import React from 'react';
import { Box, Button } from 'grommet';

export const Welcome = () => {
  const [demoStarted, setDemoStarted] = React.useState(false);
  const buttonClicked = React.useCallback(() => {
    setDemoStarted((state) => !state);
  }, [setDemoStarted]);

  return (
    <Box>
      <h1>{demoStarted ? 'Demo started' : 'Welcome to Demo App'}</h1>
      <Box width="small">
        <Button label={demoStarted ? 'Return' : 'Start'} onClick={buttonClicked} />
      </Box>
    </Box>
  );
};
