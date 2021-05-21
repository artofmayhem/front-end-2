import React, {useState, useEffect} from 'react';
import {signUpFormSchema} from '../validation/schema';
import {validateForm} from '../validation/validationHelpers';
import {displayErrors, handleChangeHelper, handleSubmitHelper} from '../formHelpers'; //bread crumbs if we get lost 
const initialValues = {
    personName:'',
    email:'',
    isOverEighteen:false,
    password:'',
    isInstructor:false
};
const initialErrorValues = Object.keys(initialValues).reduce((acc,key)=>{acc[key]='';return acc;},{});
function LogInForm(){
    // state variables
    const [isValid,setIsValid] = useState(true);
    const [formValues,setFormValues] = useState(initialValues);
    const [formErrors,setFormErrors] = useState(initialErrorValues);
    // useEffect
    useEffect(()=>{
        // validateForm whenever the component is mounted
        validateForm(signUpFormSchema,formValues,setIsValid); //check if form is valid using schema.validate
    },[]);
    // function declarations
    const handleChange=(event)=>{
        handleChangeHelper({
            event,
            schema:signUpFormSchema,
            formValues,
            setFormValues,
            formErrors,
            setFormErrors,
            setIsValid
        });
    };
    const handleSubmit=(event)=>{
        handleSubmitHelper(event);
    };
    return(
        <form onSubmit={handleSubmit}>
            <label>
                Name
                <input type='text' name='personName' value={formValues.personName} onChange={handleChange}></input>
            </label>
            <label>
                Email
                <input type='text' name='email' value={formValues.email} onChange={handleChange}></input>
            </label>
            <label>
                Password
                <input type='password' name='password' value={formValues.password} onChange={handleChange}></input>
            </label>
            <label>
                Are you older than 18?
                <input type='checkbox' name='isOverEighteen' checked={formValues.isOverEighteen} onChange={handleChange}></input>
            </label>
            <label>
                Are you an instructor?
                <input type='checkbox' name='isInstructor' checked={formValues.isInstructor} onChange={handleChange}></input>
            </label>
            <button type='submit' disabled={!isValid}>Sign Up</button>
            {displayErrors(formErrors)}
        </form>
    );
}
export default LogInForm;