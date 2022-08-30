import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface IFormData {
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    password1: string;
    extraError?: string;
}

function ToDoList() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IFormData>({
        defaultValues: {
            email: "@naver.com",
        },
    });
    const onValid = (data: IFormData) => {
        if (data.password !== data.password1) {
            setError(
                "password1",
                { message: "Password are not the same" },
                { shouldFocus: true }
            );
        }
        // setError("extraError", { message: "Server offline." });
    };
    console.log(errors);

    return (
        <div>
            <form
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={handleSubmit(onValid)}
            >
                <input
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Za-z0-9._%+-]+@naver\.com$/,
                            message: "Only naver.com emails allowed",
                        },
                    })}
                    placeholder="Email"
                />
                <span>{errors?.email?.message}</span>
                <input
                    {...register("firstname", {
                        required: "First name is required",
                        validate: {
                            noAdmin: (value) =>
                                value.includes("admin")
                                    ? "'Admin' can't be used"
                                    : true,
                            noJune: (value) =>
                                value.includes("june")
                                    ? "june is not allowed"
                                    : true,
                        },
                    })}
                    placeholder="First Name"
                />
                <span>{errors?.firstname?.message}</span>
                <input
                    {...register("lastname", {
                        required: "Last name is required",
                    })}
                    placeholder="Last Name"
                />
                <span>{errors?.lastname?.message}</span>
                <input
                    {...register("username", {
                        required: "Username is required",
                        minLength: 10,
                    })}
                    placeholder="Username"
                />
                <span>{errors?.username?.message}</span>
                <input
                    {...register("password", {
                        required: "Password is required",
                        minLength: 5,
                    })}
                    placeholder="Password"
                />
                <span>{errors?.password?.message}</span>
                <input
                    {...register("password1", {
                        required: "Password is required",
                        minLength: {
                            value: 5,
                            message: "Your password is too short.",
                        },
                    })}
                    placeholder="Password1"
                />
                <span>{errors?.password1?.message}</span>
                <button>Add</button>
                <span>{errors?.extraError?.message}</span>
            </form>
        </div>
    );
}

// function ToDoList() {

//     const [toDo, setToDo] = useState("");
//     const onChange = (event: React.FormEvent<HTMLInputElement>) => {
//         const {
//             currentTarget: { value },
//         } = event;
//         setToDo(value);
//     };
//     const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         console.log(toDo);
//     };
//     return (
//         <div>
//             <form onSubmit={onSubmit}>
//                 <input
//                     value={toDo}
//                     onChange={onChange}
//                     placeholder="Write a to do"
//                 />
//                 <button>Add</button>
//             </form>
//         </div>
//     );
// }
export default ToDoList;
