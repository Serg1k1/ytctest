import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import "./form.css";

type User = {
	id: number;
	username: string;
	email: string;
};

const Form: React.FC = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isValid },
	} = useForm({
		mode: "onSubmit",
	});

	const { fields, insert, remove } = useFieldArray({
		control,
		name: "users",
	});

	const [apiData, setApiData] = useState<User[]>([]);

	useEffect(() => {
		axios
			.get("https://jsonplaceholder.typicode.com/users")
			.then((response) => setApiData(response.data.slice(0, 3)));
	}, []);

	useEffect(() => {
		if (apiData.length) {
			apiData.forEach((user) =>
				insert(0, { username: user.username, email: user.email })
			);
		}
	}, [apiData]);

	const onSubmit = (data: any) => {
		console.log("Sending data:", data);
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(console.log("Data sent!"));
			}, 1000);
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="form__action">
				<h2>Users</h2>
				<button
					type="button"
					className="add-new-btn"
					onClick={() => insert(0, { username: "", email: "" })}
				>
					Add New
				</button>
			</div>

			<div className="user-list">
				{fields.map((field, index) => (
					<div key={field.id} className="user-item">
						<div className="form__item">
							<input
								{...register(`users.${index}.username`, {
									required: "Username is required",
								})}
								placeholder="user.username"
								className="input-field"
							/>
							{Array.isArray(errors?.users) && errors.users[index]?.email && (
								<p className="error">
									{errors.users[index]?.email?.message || "Required"}
								</p>
							)}
						</div>
						<div className="form__item">
							<input
								{...register(`users.${index}.email`, { required: true })}
								placeholder="user.email"
								className="input-field"
							/>
							{Array.isArray(errors?.users) && errors.users[index]?.email && (
								<p className="error">
									{errors.users[index]?.email?.message || "Required"}
								</p>
							)}
						</div>
						<button
							type="button"
							className="add-after-btn"
							onClick={() => insert(index + 1, { username: "", email: "" })}
						>
							Add after
						</button>

						<button
							type="button"
							className="delete-btn"
							onClick={() => remove(index)}
						>
							Delete
						</button>
					</div>
				))}
			</div>

			<button type="submit" className="save-changes-btn">
				Save Changes
			</button>
		</form>
	);
};

export default Form;
