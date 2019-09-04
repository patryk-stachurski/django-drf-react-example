import React from 'react'
import {render} from '@testing-library/react';

import App from './../App';


test('App is rendered without errors', async () => {
    render(<App/>);
});

