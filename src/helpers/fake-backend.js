export function configureFakeBackEnd(){
    console.log(localStorage.getItem('appointments'));
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [{
        id: 1,
        title: 'Doğum Günü Partisi',
        date: '2020-12-21',
		location: 'Garden Palace',
		userId: 1
    },
	{
        id: 2,
        title: 'Mehmet Bey ile İş Yemeği',
        date: '2020-12-21',
		location: 'Nusret',
		userId: 1
    },
	{
	    id: 3,
        title: 'İş görüşmesi',
        date: '2020-12-22',
		location: 'Loodos',
		userId: 2
    },
	{
        id: 4,
        title: 'Veli Toplantısı',
        date: '2020-12-23',
		location: 'Ataşehir İlköğretim okulu',
		userId: 3
    },
	{
        id: 5,
        title: 'Doktor Randevusu',
        date: '2020-12-30',
		location: 'Medical Park',
		userId: 2
    }
	];


let users = JSON.parse(localStorage.getItem('users')) || [{
        id: 1,
        email: 'ygtegeyvz@gmail.com',
        password: '123456789'
    },
	{
        id: 2,
        email: 'ygtegeyvz@hotmail.com',
        password: '123sdsa456789'
    },
	{
        id: 3,
        email: 'egeyavuz@gmail.com',
        password: '12sadas456789'
    }
    ];

    let realFetch = window.fetch;
    window.fetch = function(url,opts) {
        const isLoggedIn = opts.headers['Authorization'] === 'Bearer fake-jwt-token';

        return new Promise((resolve,reject) => {
            setTimeout(handleRoute,500);
            function handleRoute(){
                console.log('opts'+JSON.stringify(opts));
                const {method} = opts ? opts : '';
                switch (true) {
                    case url.endsWith('/appointments') && method === 'GET':
                        return getAppointments();
                    case url.match(/\/appointments\/\d+$/) && method === 'GET':
                        return getAppointmentsById();
                    case url.endsWith('/appointments') && method === 'POST':
                        return createAppointments();
                    case url.match(/\/appointments\/\d+$/) && method === 'PUT':
                        return updateAppointments();
                    case url.match(/\/appointments\/\d+$/) && method === 'DELETE':
                        return deleteAppointments();
                    case url.endsWith('/users/authenticate') && method === 'POST':
                        return userAuth();
                    case url.endsWith('/users') && method === 'GET':
                        return getUsers();
                    case url.endsWith('/users') && method === 'POST':
                        return createUsers();
                    case url.match(/\/users\/\d+$/) && method === 'PUT':
                        return updateUsers();
                    case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUsers();
                    default:
                        return realFetch(url,opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            function userAuth() {
                console.log('user auth : ' + opts.body)
                const params = JSON.parse(JSON.parse(opts.body));
                console.log('params : ' + params.email + ' ' + params.password)
                const user = users.find(x => x.email === params.email && x.password === params.password);
                if(!user) {
                    console.log('user not found')
                    return error('Email ya da şifre yanlış');
                }
                return ok({
                    id: user.id,
                    email: user.email,
                    token: 'fake-jwt-token'
                })
            }

            function getAppointments(){
                if(!isLoggedIn) return unauthorised();

                return ok(appointments);
            }

            function getAppointmentsById(){
                if(!isLoggedIn) return unauthorised();

                let userAppointments = appointments.find(x => x.id === idFromUrl());
                return ok(userAppointments);
            }

            function createAppointments(){
                if(!isLoggedIn) return unauthorised();

                const appointment = body();

                if(appointments.find(x => x.date === appointment.date && x.userId === appointment.userId)){
                    return error('Zaten bu tarihe verilmiş bir randevu bulunmaktadır.');
                }
                appointment.id = newAppointmentId();
                appointments.push(appointment);
                localStorage.setItem('appointments',JSON.stringify(appointments));
                return ok();
            }

            function updateAppointments() {
                if(!isLoggedIn) return unauthorised();

                const params = body();
                let appointment = appointments.find(x => x.id === idFromUrl());
                Object.assign(appointment, params);
                localStorage.setItem('appointments',JSON.stringify(appointment));

                return ok();
            }

            function deleteAppointments(){
                if(!isLoggedIn) return unauthorised();

                let appointment = appointments.filter(x => x.id !== idFromUrl());
                localStorage.setItem('appointments',JSON.stringify(appointment));
                console.log("delete:" +localStorage.getItem('appointments'));
                return ok();
            }

            function getUsers(){
                if(!isLoggedIn) return unauthorised();
                return ok(users);
            }

            function createUsers(){
            }

            function updateUsers(){
            }

            function deleteUsers(){
            }

            function ok(body){
                resolve({ok: true, text:()=> Promise.resolve(JSON.stringify(body))});
            }

            function error(message){
                resolve({status: 400, text:()=> Promise.resolve(JSON.stringify(message))});
            }

            function unauthorised() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorised' })) })
            }

            function body(){
                return opts.body && JSON.parse(opts.body);
            }

            function idFromUrl(){
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length-1]);
            }

            function newAppointmentId(){
                return appointments.lenght ? Math.max(...appointments.map(x => x.id)) + 1 : 1;
            }
        });
    }
}
