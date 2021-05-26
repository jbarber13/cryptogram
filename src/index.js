import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'; //load before App.js
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import { Route, IndexRoute } from 'react-router';
import { BrowserRouter } from 'react-router-dom';




//const store = configureStore()

//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
	<Provider store= {configureStore()}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>		
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
