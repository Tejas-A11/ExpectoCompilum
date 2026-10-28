// import { useState } from "react"; 


import { useForm } from "react-hook-form" //to handle state variables in input form without using useState hook
import {zodResolver} from "@hookform/resolvers/zod"  //we need this library to use zod 
import {minLength, z} from "zod";

//SchemaValidation for signup form using zod

const signupSchema = z.object({
    firstName : z.string().min(2, "*name should contain atleast 2 characters").max(30, "name should contain less than 30 characters"), //these error strings gets stored in errors in message attribute
    emailId : z.string().email("*invalid email address"), //by defaut error hota hai har ek field ke liye, explicitly likhne ki zarurat nahi hai, just write error if need a custom error
    password : z.string().min(8, "*password is too weak")
})


export default function Signup(){
    const {register, handleSubmit, formState : {errors}} = useForm({resolver : zodResolver(signupSchema), mode:"onChange"}); // mode means when to validate schema or show errors if any, by default it is set as onSubmit
    //the error above means that red alert under input field that comes if it is invalid input 
    // error object looks like =>
    //     const errors = {
    //         firstName : {
    //             type : minLength,
    //             message : 'minimum characters must be 3'
    //         }
    //         emailId : undefined (if no error)
    //         password :{

    //         }
    //     }

    const submitted = (data) =>{
        console.log(data);  //data is already converted into json format by useForm hook
    }

    return(
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-3xl">ExpectoCompilum</h2>
                    <form onSubmit={handleSubmit(submitted)}>
                        {/* <div className="alert alert-error">
                        <span>If this is red, DaisyUI is working!</span>
                        </div>
                        <button className="btn btn-error">Test Button</button> */}
                        <div className="form-control">
                            <label className="label mb-1">
                                <span className="label-text">First name</span>
                            </label>
                            <input type="text" placeholder="John" className={`input input-bordered ${errors.firstName && 'input-error'}`} {...register('firstName')} />
                            {errors.firstName && (<span className="text-error">{errors.firstName.message}</span>)}
                        </div>
                        <div className="form-control mt-4">
                            <label className="label mb-1">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="john@example.com" className={`input input-bordered ${errors.emailId && 'input-error'}`} {...register('emailId')} />
                            {errors.emailId && (<span className="text-error">{errors.emailId.message}</span>)}
                        </div>
                        <div className="form-control mt-4">
                            <label className="label mb-1">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="●●●●●●●●" className={`input input-bordered ${errors.password && 'input-error'}`} {...register('password')} />
                            {errors.password && (<span className="text-error">{errors.password.message}</span>)}
                        </div>
                        <div className="form-control mt-6 flex justify-center">
                            <button type="submit" className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
    // return(<>
    //     <form onSubmit={handleSubmit(submitted)} className="flex flex-col justify-center items-center gap-y-3 min-h-screen">
    //         <input placeholder="enter name" {...register('firstName')} className="text-center" />
    //         {errors.firstName && (<span className=" text-red-600">{errors.firstName.message}</span>)}
    //         {/* in JS, if first condition in && is true, it returns the second condition, not true or false, and if first condition is false, it itself is returned */}
    //         <input placeholder="enter email" {...register('emailId')} className="text-center"/>
    //         {errors.emailId && (<span className=" text-red-600">{errors.emailId.message}</span>)}
    //         {/* OR {errors.emailId ? (<span>{errors.emailId.message}</span>) : null} */}
    //         <input placeholder="enter password" type="password" {...register('password')} className="text-center" />
    //         {errors.password && (<span className=" text-red-600">{errors.password.message}</span>)}
    //         {/* useForm does not define type, we need to explicitly define type = "password" */}
    //         <button type="submit" className="btn btn-secondary">submit</button>
    //     </form>
    // </>)







    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [pass, setPass] = useState('');
    
    // const handleSubmit = (e) =>{
    //     e.preventDefault();
    //     console.log(name, email, pass);
    // }
    // return(<>
    //     {/* <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-4">
    //         <input type="text" value={name} placeholder="enter your name"  onChange={(e)=>setName(e.target.value)} className="text-center"/>
    //         <input type="email" value={email} placeholder="enter your email"  onChange={(e)=>setEmail(e.target.value)} className="text-center"/>
    //         <input type="password" value={pass} placeholder="enter your pass"  onChange={(e)=>setPass(e.target.value)} className="text-center"/>
    //         <button type="submit" className="btn btn-primary">Submit</button>
    //     </form> */}
    // </>)
}