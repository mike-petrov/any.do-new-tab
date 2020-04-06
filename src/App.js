import React, { useState, useEffect } from 'react';

import { authUser, tasksSync } from './functions/api';
import './App.css';
import svgAdd from './img/add.svg';
import svgClose from './img/close.svg';
import svgLogo from './img/logo.svg';
import svgSettings from './img/settings.svg';
import svgSync from './img/sync.svg';
import svgNote from './img/note.svg';

const App = () => {
	const [loader, setLoader] = useState(true);
	const [popup, setPopup] = useState({ active: false, current: null });
	const [formAuth, setFormAuth] = useState({ email: '', password: '' });
	const [user, setUser] = useState({});
	const [tasks, setTasks] = useState([]);
	const [params, setParams] = useState({ columns: ['All', 'Today', 'Someday'] });
	const [note, setNote] = useState('');
	const [time, setTime] = useState(new Date().toLocaleTimeString().substr(0, 5));

	const onSync = () => {
		tasksSync(JSON.parse(localStorage.getItem('user')).auth_token).then((e) => {
			setTasks(e.models.task.items);
		});
	};

	const onUpdateTime = () => {
		setTime(new Date().toLocaleTimeString().substr(0, 5));
	};

	useEffect(() => {
		if (localStorage.getItem('user')) {
			setUser(JSON.parse(localStorage.getItem('user')));
			onSync();
		}

		if (localStorage.getItem('params')) {
			setParams(JSON.parse(localStorage.getItem('params')));
		}

		if (localStorage.getItem('note')) {
			setNote(localStorage.getItem('note'));
		}

		setInterval(onUpdateTime, 10000);
	}, []);

	useEffect(() => {
		if (tasks.length !== 0 || !localStorage.getItem('user')) {
			setLoader(false);
		}
	}, [tasks]);

	const onAuth = (e) => {
		authUser(formAuth).then((eventAuthUser) => {
			setUser(eventAuthUser);
			localStorage.setItem('user', JSON.stringify(eventAuthUser));
			onSync();
		});
		e.preventDefault();
	};

	const onExit = () => {
		localStorage.removeItem('user');
		window.location.reload();
	};

	const onPopup = (active = false, current = null) => {
		setPopup({ active, current });
	};

	const onHandleAuth = (e) => {
		if (e.target.name === 'email') {
			setFormAuth({ ...formAuth, email: e.target.value });
		} else if (e.target.name === 'password') {
			setFormAuth({ ...formAuth, password: e.target.value });
		}
	};

	const onHandleColumns = (column) => {
		const position = params.columns.indexOf(column);
		let { columns } = params;
		if (position === -1) {
			columns = columns.concat(column);
		} else {
			columns.splice(position, 1);
		}
		setParams({ ...params, columns });
		localStorage.setItem('params', JSON.stringify({ ...params, columns }));
	};

	const onHandleNote = (e) => {
		setNote(e.target.value);
		localStorage.setItem('note', e.target.value);
	};

	return (
		<>
			{popup.active && (
				<>
					{popup.current === 'settings' && (
						<div className="popup">
							<div className="popup_close_panel" onClick={() => { onPopup(); }} />
							<div className="popup_content">
								<div className="popup_title title_group">
									<span>Settings</span>
									<span className="popup_close" onClick={() => { onPopup(); }}>
										<img src={svgClose} alt="close" />
									</span>
								</div>
								<div className="popup_subtitle">Any.do</div>
								<div className="setting_block">
									{['All', 'Today', 'Someday'].map((item) => (
										<div
											key={item}
											role="menuitem"
											className={params.columns.indexOf(item) === -1 ? '' : 'active'}
											onClick={() => { onHandleColumns(item); }}
										>
											{item}
										</div>
									))}
								</div>
								<div className="popup_subtitle">Advanced</div>
								<div className="setting_block">
									{['Notes'].map((item) => (
										<div
											key={item}
											role="menuitem"
											className={params.columns.indexOf(item) === -1 ? '' : 'active'}
											onClick={() => { onHandleColumns(item); }}
										>
											{item}
										</div>
									))}
								</div>
								<div className="btn log_out" onClick={onExit}>Log out</div>
							</div>
						</div>
					)}
				</>
			)}
			{loader && (
				<div id="loader">
					<div className="loader_inner">
						<img src={svgLogo} alt="loader" />
					</div>
				</div>
			)}
			{Object.keys(user).length === 0 ? (
				<div className="container">
					<div className="card">
						<div className="card_title">Welcome</div>
						<form className="card_form" onSubmit={onAuth}>
							<input
								type="mail"
								name="email"
								placeholder="your@email.com"
								value={formAuth.email}
								onChange={onHandleAuth}
							/>
							<input
								type="password"
								name="password"
								placeholder="Password"
								value={formAuth.password}
								onChange={onHandleAuth}
							/>
							<input
								type="submit"
								className="btn"
								value="Sign in"
							/>
							<a href="https://desktop.any.do/" className="form_bottom">Create account</a>
						</form>
					</div>
				</div>
			) : (
				<div className="page">
					<div className="header">
						<div className="title_header">{`Hello, ${user.displayName}!`}</div>
						<div className="btns_group">
							<div className="time_block">
								{time}
							</div>
							<div className="btn_icon" onClick={() => { onSync(); }}>
								<img src={svgSync} alt="sync" />
							</div>
							<div className="btn_icon" onClick={() => { onPopup(true, 'settings'); }}>
								<img src={svgSettings} alt="settings" />
							</div>
						</div>
					</div>
					<div className="content">
						<div className="cards_group">
							{params.columns.indexOf('All') !== -1 && (
								<div className="card">
									<div className="card_title title_group">
										<div className="title_group">
											<span>All</span>
											<span className="tasks_count">{tasks.length}</span>
										</div>
										<div>
											<img className="btn_add" src={svgAdd} alt="add" />
										</div>
									</div>
									<div className="card_content">
										{tasks.length !== 0 && tasks.map((task) => (
											<div
												key={task.id}
												className="task_item"
											>
												{task.title}
											</div>
										))}
									</div>
								</div>
							)}
							{params.columns.indexOf('Someday') !== -1 && (
								<div className="card">
									<div className="card_title title_group">
										<div className="title_group">
											<span>Someday</span>
											<span className="tasks_count">
												{tasks !== 0 && tasks.filter((task) => task.dueDate && new Date(task.dueDate).toDateString() !== new Date().toDateString()).length}
											</span>
										</div>
										<div>
											<img className="btn_add" src={svgAdd} alt="add" />
										</div>
									</div>
									<div className="card_content">
										{tasks.length !== 0 && tasks.map((task) => (task.dueDate && new Date(task.dueDate).toDateString() !== new Date().toDateString() && (
											<div
												key={task.id}
												className="task_item"
											>
												{task.title}
											</div>
										)))}
									</div>
								</div>
							)}
							{params.columns.indexOf('Today') !== -1 && (
								<div className="card">
									<div className="card_title title_group">
										<div className="title_group">
											<span>Today</span>
											<span className="tasks_count">
												{tasks !== 0 && tasks.filter((task) => new Date(task.dueDate).toDateString() === new Date().toDateString()).length}
											</span>
										</div>
										<div>
											<img className="btn_add" src={svgAdd} alt="add" />
										</div>
									</div>
									<div className="card_content">
										{tasks.length !== 0 && tasks.map((task) => (new Date(task.dueDate).toDateString() === new Date().toDateString() && (
											<div
												key={task.id}
												className="task_item"
											>
												{task.title}
											</div>
										)))}
									</div>
								</div>
							)}
							{params.columns.indexOf('Notes') !== -1 && (
								<div className="card">
									<div className="card_title title_group">
										<span>Notes</span>
										<span>
											<img className="btn_add" src={svgNote} style={{ cursor: 'default' }} alt="add" />
										</span>
									</div>
									<div className="card_content">
										<textarea
											value={note}
											onChange={onHandleNote}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="footer">
						<div className="author_block">
							<a href="https://mikepetrov.ru/">Author</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default App;
