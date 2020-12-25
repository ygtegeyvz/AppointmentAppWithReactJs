import React, {useState, useEffect}  from 'react'
import {Link} from 'react-router-dom'
import {appointmentService} from '../services'


function List({ match }) {
    const {path} = match;
    const [appointments, setAppointments] = useState(null);

    useEffect(() => {
        appointmentService.getAll().then(x => setAppointments(x));
    },[]);

    function deleteAppointment(id){
      setAppointments(appointments.map(x => {
          if(x.id === id){
              x.isDeleting = true;
          }
          return x;
      }));
      appointmentService.delete(id).then(()=> {
          setAppointments(appointments => appointments.filter(x => x.id !== id));
      });
    }
    return(
        <div>
            <h1>Appointments</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Randevu Ekle</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{width:'30%'}} >Date</th>
                        <th style={{width:'30%'}} >Title</th>
                        <th style={{width:'30%'}} >Location</th>
                        <th style={{width:'10%'}} ></th>
                    </tr>
                </thead>
                <tbody>
                    {appointments && appointments.length > 0 && appointments.map(appointment =>
                        <tr key={appointment.id}>
                            <td>{appointment.date}</td>
                            <td>{appointment.title}</td>
                            <td>{appointment.location}</td>
                            <td style={{whiteSpace:'nowrap'}}>
                            {console.log("linkto"+JSON.stringify(appointment))}
                                <Link to={`${path}/edit/${appointment.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button className="btn btn-sm btn-danger btn-delete-user" onClick={()=> deleteAppointment(appointment.id)} disabled={appointment.isDeleting}>
                                    {appointment.isDeleting ? <span className="spinner-border spinner-border-sm"></span> : <span>Sil</span> }
                                </button>
                            </td>
                        </tr>
                    )}

                    { !appointments &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    { appointments && !appointments.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">
                                    Randevu bulunamadı..
                                </div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export {List};
