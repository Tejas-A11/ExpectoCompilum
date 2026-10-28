import { useForm } from "react-hook-form" //to handle state variables in input form without using useState hook
import {zodResolver} from "@hookform/resolvers/zod"  //we need this library to use zod 
import {z} from "zod";

const loginSchema = z.object({
    emailId : z.string().email(),
    password : z.string().min(8, "*password should contain atleast 8 characters")
})


export default function Login(){
    const {register, handleSubmit, formState : {errors}} = useForm({resolver : zodResolver(loginSchema), mode:"onChange"}); 
    const submitted = (data) =>{
        console.log(data);
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
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="john@example.com" className={`input input-bordered ${errors.emailId && 'input-error'}`} {...register('emailId')} />
                            {errors.emailId && (<span className="text-error">{errors.emailId.message}</span>)} 
                            {/* above line shows the invalid email error message and fancy visual errors are shown by daisyui input-error format */}
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
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}