import React, {useState, useEffect} from 'react';
import {yupResolver} from '@hookform/resolvers/yup'
import * as Yup from 'yup';
import {useForm} from 'react-hook-form'
import {authenticationService} from "../services";

function Home(history) {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        authenticationService.currentUser.subscribe(x => setCurrentUser(x));
    })

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("email is invalid").required(),
        password: Yup.string().transform(x => x === '' ? undefined : x)
            .concat(Yup.string().required('Password is required'))
            .min(6, 'Password must be at least 6 characters'),
      });

    const {register,handleSubmit,setValue,reset,formState,errors} = useForm({
        resolver:yupResolver(validationSchema)
      });

    const onSubmit = (data) => {
        authenticationService.login(data.email, data.password).then(user => {
         const {from} = window.location.state || {from: {pathname: "/"}};
         history.push(from);
        })
    }

    return (
        <div>
        {currentUser && <div>
            <h1>Selam {currentUser.email} </h1>
            <p>Menu'den randevularına erişebilirsin</p>
        </div> }
        {!currentUser && <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <h1 className="text-align-center">Giriş Yap</h1>
        <div className= "form-row justify-content-center">
           <div className="form-group">
                <label>E-Mail</label>
                <input name="email"  type="text" ref={register} className={`form-control ${errors.email ? 'is-invalid' : ''}`}/>
                <div className="invalid-feedback">{errors.email?.message}</div>
           </div>
        </div>
        <div className= "form-row justify-content-center">
           <div className="form-group">
                <label>Parola</label>
                <input name="password" type="password" ref={register} className={`form-control ${errors.password ? 'is-invalid' : ''}`}/>
                <div className="invalid-feedback">{errors.password?.message}</div>
           </div>
        </div>
        <div className= "form-row justify-content-center">
           <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm"></span> }
                    Gönder
                </button>
           </div>
        </div>
    </form> }
        </div>
    );

}



export {Home};
