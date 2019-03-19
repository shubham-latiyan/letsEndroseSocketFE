import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class LoginService {
  socket = io('https://backend-ogvqteuntw.now.sh');

  constructor(private http: HttpClient, private router: Router) { }
  singupUser(obj){
    return this.http.post('https://backend-ogvqteuntw.now.sh/api/usersSignUp', obj)
  }

  loginUser(obj){
    return this.http.post('https://backend-ogvqteuntw.now.sh/api/usersSignIn', obj)
  }
  getuser(obj){
    return this.http.post('https://backend-ogvqteuntw.now.sh/api/getUser', {id: obj})
  }
  
  loggedOut() {
    const observable = new Observable(observer => {
      this.socket.on('userDisconnected', (data) => {
        console.log('userDisconnected', data);
        this.router.navigate([' '])
        observer.next(data);
      });
      // return () => { this.socket.disconnect(); };
    });
    return observable;
  }
}