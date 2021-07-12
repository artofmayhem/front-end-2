import React, { useState, useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import {signUpFormSchema} from "../validation/schema";
import {connect} from "react-redux";
import {
    displayErrors,
} from "../formHelpers";
import { SIGNED_UP } from "../../../userState/accountStatus";
import { postLogIn, postSignUp, } from "../../../userState/userActions";
import { STUDENT,INSTRUCTOR } from "../../../state/reducers/accountStatus";
import {  handleFormSubmit, initForm, stopSubmitting } from "../../../formState/formActions";
//import FitnessThree from "../../../assets/fitnessThree.jpg"; //bread crumbs if we get lost

const initialValues = {
    name: "",
    email: "",
    password: "",
    isOverEighteen: false,
    is_instructor: false,
};

function SignUpForm(props) {
    const {
        accountStatus,
        initForm,
        isValid,
        postLogIn,
        postSignUp,
        formErrors,
        isSubmitting,
        stopSubmitting,
        handleFormSubmit
    } = props;
    const [formValues,setFormValues] = useState(initialValues);
    const history = useHistory();

    useEffect(()=>{
        initForm();
    },[initForm])


    useEffect(()=>{
        // if the api call is successful, the accountStatus will be updated
        // a change in accountStatus will trigger this useEffect
        // redirect based on the accountStatus
        if(accountStatus===STUDENT){
          history.push('/classes');
        }
        else if(accountStatus===INSTRUCTOR){
          history.push('/instructors')
        }
        else{
          stopSubmitting()
        }
      },[accountStatus, history, stopSubmitting]);


    useEffect(()=>{
        // if the api call is successful, the accountStatus will be updated
        // a change in accountStatus will trigger this useEffect
        // redirect based on the accountStatus
        if(accountStatus===STUDENT){
          history.push('/classes');
        }
        else if(accountStatus===INSTRUCTOR){
          history.push('/instructors')
        }
        else if(accountStatus===SIGNED_UP){
            // when postSignUp is successful, accountStatus will be changed to SIGNED_UP
            postLogIn({
                email:formValues.email,
                password:formValues.password
            });
        }
        else{
            stopSubmitting();
        }
      },[
          accountStatus,
          initForm,
          postLogIn,
          formValues,
          stopSubmitting,
          history
        ]);
    useEffect(()=>{
        // the handleFormSubmit has run and isSubmitting changed to true
        if(isSubmitting){
          // post the login
          postSignUp(formValues);
        }
      },[isSubmitting,postSignUp,formValues]);
      useEffect(()=>{
        // after handleFormSubmit has run,
        // if there is no error in form, formReducer will set isSubmitting to true
        // this change will trigger this useEffect to run and post the sign up to the backend
        // this is done by calling the postSignUp action in the userActions.js
        // if successful, it will change the accountStatus to SIGNED_UP
    
        // if isSubmitting is true, the 'Enter' button will be disable to prevent multiple log ins.
        if(isSubmitting){
          // post the sign up
          postSignUp(formValues);
        }
      },[isSubmitting,postSignUp,formValues]);
    const handleChange=(e)=>{
        const {name, value, checked, type} = e.target;
        const inputValue = type === 'checkbox' ? checked:value;
        setFormValues({...formValues,[name]:inputValue});
    };
    return (
        <div className={"parallax-wrapper3"} style={{marginTop: '40vh'}}>
            <div className={"content1"}>
                <form
                    className={
                        "d-flex flex-column flex-wrap justify-content-center align-content-center form-style"
                    }
                    style={{padding: '0 10vw'}}
                    onSubmit={handleFormSubmit}
                >
                    <div className={"d-flex flex-column justify-content-center align-items-center input-style"}>
                        <h2 style={{color: "white"}}>Sign Up</h2>
                        <label style={{padding: '.5rem'}}>
                            Name:{" "}
                            <input
                                id="sign-up-form-name"
                                type="text"
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                            />
                        </label>
                        <label style={{padding: '.5rem'}}>
                            Email:{" "}
                            <input
                                id="sign-up-form-email"
                                type="text"
                                name="email"
                                value={formValues.email}
                                onChange={handleChange}
                            />
                        </label>
                        <label style={{fontSize: '1rem', padding: '.5rem'}}>
                            Password:
                            <input
                                id="sign-up-form-password"
                                type="password"
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}

                            />
                        </label>

                        <label >
                            Are you older than 18?</label>
                        <input
                            id="sign-up-form-18-plus"
                            type="checkbox"
                            name="isOverEighteen"
                            checked={formValues.isOverEighteen}
                            onChange={handleChange}
                            style={{margin: '2vh auto', alignSelf: 'center'}}
                        />

                        <label>are you an instructor</label>
                        <input
                            id="sign-up-form-instructor"
                            type="checkbox"
                            name="is_instructor"
                            checked={formValues.is_instructor}
                            onChange={handleChange}
                            style={{margin: '2vh auto', alignSelf: 'center'}}
                        />


                        <button id="sign-up-form-submit" type="submit" disabled={!isValid} style={{
                            width: '250px',
                            alignSelf: 'center',
                            borderRadius: '50px',
                            margin: '3vh 0',
                            fontSize: '1.5rem'
                        }}>
                            Sign Up
                        </button>
                        {displayErrors(formErrors)}{" "}
                        <h5 style={{marginTop: "3vh"}}>
                            <em>
                                Already have an account? <br/>
                            </em>
                        </h5>{" "}
                        <Link
                            to="login"
                            style={{
                                marginBottom: "5vh",
                                color: "#aaa",
                                textDecoration: "none",
                                fontSize: "1.5rem",
                            }}
                        >
                            Login{" "}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        accountStatus: state.userState.accountStatus,
        isSubmitting: state.logInFormState.isSubmitting,
        formValues: state.logInFormState.formValues,
        formErrors: state.logInFormState.formErrors,
        isValid: state.logInFormState.isValid
    };
};
const SIGN_UP_FORM = "SIGN_UP_FORM"; //name of the form for the reducer
const mapDispatchToProps = (dispatch) => {
    return {
        postLogIn: (formValues) => dispatch(postLogIn(formValues)),
        postSignUp: (formValues) => dispatch(postSignUp(formValues)),
        initForm: () => dispatch(initForm(signUpFormSchema,initialValues,SIGN_UP_FORM)),
        handleFormSubmit: (event)=> {
          event.preventDefault();
          dispatch(handleFormSubmit(SIGN_UP_FORM));
        },
        stopSubmitting: ()=>dispatch(stopSubmitting(SIGN_UP_FORM))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
