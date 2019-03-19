import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as io from 'socket.io-client';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  socket = io.connect('https://backend-ogvqteuntw.now.sh/');
  flag: boolean = false;
  obj: any = {
    email: '',
    password: ''
  };
  isloggedIn: boolean = false;
  firstName: '';
  lastName: '';
  email: '';

  constructor(private ls: LoginService, private router: Router, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    const helper = new JwtHelperService();
    let token = await localStorage.getItem("token");
    const decodedToken = await helper.decodeToken(token);
    if(decodedToken != null){
      await this.getData(decodedToken.userId)
    }
    else {
      this.flag = true;
    }

    this.socket.on('userDisconnected', (data) => {
      console.log('userDisconnected', data);
      this.router.navigate(['/signup'])
    });
  }

  async login() {
    // console.log('slll', this.obj);
    await localStorage.removeItem('token');
    this.ls.loginUser(this.obj).subscribe(async (da: any) => {
      if (da.success) {
        console.log('da:', da)
        this.firstName = da.data.firstName;
        this.lastName = da.data.lastName;
        this.email = da.data.email;
        this.socket.emit('userConnected', da.data.email);
        await localStorage.setItem('token', JSON.stringify(da.token));
      }
      this.isUserLoggedIn();
    })
  }
  isUserLoggedIn() {
    if (localStorage.getItem('token') === null) {
      this.router.navigate(['/signup'])
    }
    else {
      this.isloggedIn = true;
      console.log("LOGINNNNNNNNN");
      return false;
    }
  }
  getData(obj) {
    this.ls.getuser(obj).subscribe((da: any) => {
      if (da.success) {
        this.isloggedIn = true;
        this.flag = true;
        this.socket.emit('userConnected', da.data.email);
        this.firstName = da.data.firstName;
        this.lastName = da.data.lastName;
        this.email = da.data.email;
      }
    })
  }

  async logOut() {
    this.socket.emit('userDisconnected', 'logOut');
    localStorage.removeItem('token');
    this.isloggedIn = false;
    this.ls.loggedOut().subscribe((da) => {
      console.log('loogg', da);
      this.router.navigate(['/signup'])
    })
    this.cdr.detectChanges();


  }
}
