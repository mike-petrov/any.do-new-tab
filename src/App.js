import React, { useState, useEffect } from 'react';

import { authUser } from './functions/api';
import { credential } from './set';

const App = () => {
	const [api, setApi] = useState('');
	const [user, setUser] = useState({});

	useEffect(() => {
		if (Object.keys(user).length !== 0) {
			api.sync().then((e) => {
				console.log(e);
			});
		}
		goAuth(credential.email, credential.password);
	}, []);

	const goAuth = (email, password) => {
		authUser({ email, password }).then((e) => {
			console.log(e);
			setApi(e);
		})
	};

	return (
		<div>1</div>
	);
}

export default App;
