import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as Yup from 'yup';
import {alertService,appointmentService} from '../services'

function AddEdit({history,match}){

    const {id} = match.params;
    const isAddMode = !id;
    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        location: Yup.string().required(),
      });

    const {register,handleSubmit,setValue,reset,formState,errors} = useForm({
        resolver:yupResolver(validationSchema)
    });

    function onSubmit(data){
        return isAddMode ? createAppointment(data) : editAppointment(id,data);
    }

    function createAppointment(data){
        return appointmentService.create(data).then(() => {
            alertService.success('Randevunuz oluşturuldu.',{keepAfterRouteChange:true});
            history.push('.');
        }).catch(alertService.error);
    }

    function editAppointment(id,data){
        return appointmentService.update(id,data).then(() => {
            alertService.success('Randevunuz güncellendi.',{keepAfterRouteChange:true});
            history.push('..');
        }).catch(alertService.error);
    }

    const [appointment,setAppointment] = useState({});

    useEffect(() => {
        if(!isAddMode){
            appointmentService.getById(id).then(appointment=>{
                const fields = ['userId','location','title','date'];
                console.log("useEffect:"+JSON.stringify(appointment));
                console.log("useEffect/id:"+id);
                fields.forEach(field => setValue(field,appointment[field]));
                setAppointment(appointment);
            });
        }
    },[]);

    return(
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Randevu Oluştur' : 'Randevu Güncelle' }</h1>
            <div className= "form-row">
               <div className="form-group">
                    <label>Tarih</label>
                    <input name="date" type="date" ref={register({valueAsDate: true,})} className={`form-control ${errors.date ? 'is-invalid' : ''}`}/>
                    <div className="invalid-feedback">{errors.date?.message}</div>
               </div>
            </div>
            <div className= "form-row">
               <div className="form-group">
                    <label>Mekan</label>
                    <input name="location" type="text" ref={register} className={`form-control ${errors.location ? 'is-invalid' : ''}`}/>
                    <div className="invalid-feedback">{errors.location?.message}</div>
               </div>
            </div>
            <div className= "form-row">
               <div className="form-group">
                    <label>Başlık</label>
                    <input name="title" type="text" ref={register} className={`form-control ${errors.title ? 'is-invalid' : ''}`}/>
                    <div className="invalid-feedback">{errors.title?.message}</div>
               </div>
            </div>
            <div className= "form-row">
               <div className="form-group">
                    <label>UserId</label>
                    <input name="userId" type="text" ref={register} className={`form-control ${errors.userId ? 'is-invalid' : ''}`}/>
                    <div className="invalid-feedback">{errors.userId?.message}</div>
               </div>
            </div>
            <div className= "form-row">
               <div className="form-group">
                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm"></span> }
                        Gönder
                    </button>
                    <Link to={isAddMode ? '.' : '..'} className="btn btn-link">İptal</Link>
               </div>
            </div>
        </form>
    );
}

export {AddEdit};
