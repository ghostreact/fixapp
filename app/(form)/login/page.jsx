"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const LoginPage = () => {
	const router = useRouter();
	const { register, handleSubmit } = useForm();

	const onSubmit = async (data) => {
		

		const result = await signIn("credentials", {
			redirect: false,
			username: data.username,
			password: data.password,
		});

		if (result?.ok) {
			router.push("/Dashboard");
		} else {
			alert("Authentication failed!");
		}
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="card">
				<div className="card-body">
					<div className="card-header flex justify-center">
						<div className="flex flex-col gap-2">
							<h2 className="text-center text-2xl font-semibold">Sign In</h2>
							<p className="mx-auto max-w-xs text-sm text-content2">
								Sign in to your account to continue.
							</p>
						</div>
					</div>
					<section>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="form-group">
								<div className="form-field">
									<label htmlFor="email" className="form-label">
										Email address
									</label>
									<input
										id="email"
										placeholder="Type here"
										type="text"
										name="username"
										className="input max-w-full"
										{...register("username")}
									/>
									<span className="form-label-alt">
										Please enter a valid username.
									</span>
								</div>

								<div className="form-field">
									<label htmlFor="password" className="form-label">
										<span>Password</span>
									</label>
									<div className="form-control">
										<input
											id="password"
											placeholder="Type here"
											type="password"
											name="password"
											className="input max-w-full"
											{...register("password")}
										/>
									</div>
								</div>

								<div className="form-field">
									<div className="form-control justify-between">
										<label className="flex items-center">
											<input type="checkbox" className="checkbox" />
											<span className="ml-2">Remember me</span>
										</label>
										<a
											href="#"
											className="link link-underline-hover link-primary text-sm"
										>
											Forgot your password?
										</a>
									</div>
								</div>

								<div className="form-field pt-5">
									<div className="form-control justify-between">
										<button type="submit" className="btn btn-primary w-full">
											Sign in
										</button>
									</div>
								</div>
							</div>
						</form>
					</section>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
