import {useState} from "react";

const data = [
	{title: 'First', id: 0, checked: false},
	{title: 'Second', id: 1, checked: false},
	{title: 'Third', id: 2, checked: false},
	{title: 'Fourth', id: 3, checked: false},
];

function App() {
	const [originalTasks, setOriginalTasks] = useState(data)
	const [secondTasks, setSecondTasks] = useState([])

	const checkedFromOriginalList = (e) => {
		const updatedTasks = originalTasks?.map(task => {
			if (task.id == e.target.id) {
				return {
					...task,
					checked: !task.checked
				}
			} else {
				return task
			}
		})

		setOriginalTasks(updatedTasks)
	}

	const transferList = (e) => {
		if (e.target.id === "left") {
			const checkedFromRight = secondTasks.filter(task => task.checked)

			setSecondTasks(secondTasks.filter(task => !task.checked))
			setOriginalTasks(prevState => {

				return [...prevState, ...checkedFromRight]
					.map(task => ({...task, checked: false}))
			})
		}

		if (e.target.id === "right") {
			const checkedFromLeft = originalTasks.filter(task => task.checked);
			setOriginalTasks(originalTasks.filter(task => !task.checked))
			setSecondTasks(prevState => {

				return [...prevState, ...checkedFromLeft]
					.map(task => ({...task, checked: false}))
			})
		}
	}

	const checkedFromSecondaryList = (e) => {
		const updatedTasks = secondTasks?.map(task => {
			if (task.id == e.target.id) {
				return {
					...task,
					checked: !task.checked
				}
			} else {
				return task
			}
		})

		setSecondTasks(updatedTasks)
	}

	return (
		<div className="p-2 m-2">
			<div className="flex justify-around">
				<ul className="flex flex-col p-4 space-y-4 border shadow">
					{originalTasks?.map(task =>
						<li key={task.id} id={task.id}
						    className={task.checked ? "text-red-500" : undefined}
						    onClick={checkedFromOriginalList}>{task.title}
						</li>
					)}
				</ul>

				<div className="flex flex-col justify-around">
					<button id="left" className="border outline rounded-xl" onClick={transferList}>&lt;-</button>
					<button id="right" className="border outline rounded-xl" onClick={transferList}>-&gt;</button>
				</div>

				<ul className="flex flex-col p-4 space-y-4 border shadow">
					{secondTasks?.map(task =>
						<li key={task.id} id={task.id}
						    className={task.checked ? "text-red-500" : undefined}
						    onClick={checkedFromSecondaryList}>{task.title}</li>
					)}
				</ul>
			</div>
		</div>
	);
}

export default App;
