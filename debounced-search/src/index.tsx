// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LocationSearch from './components/LocationSearch';

const App = () => (
    <div className="App">
        <LocationSearch />
    </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
