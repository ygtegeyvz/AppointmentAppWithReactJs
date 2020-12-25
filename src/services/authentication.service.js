import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '../helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const baseUrl = '/api';

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
};

function login(email, password) {
    console.log('login : ' + email + ' ' + password);
    return fetchWrapper.postLogin(`${baseUrl}/users/authenticate`, JSON.stringify({ email, password }))
        .then(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
