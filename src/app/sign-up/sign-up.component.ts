import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  obj: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  loading = false;

  constructor(private ls: LoginService, private router: Router) { }

  ngOnInit(){
    if(localStorage.getItem('token') !== null){
      this.router.navigate(['/login'])
    }
  }

  register() {
    console.log('slll', this.obj);
    this.ls.singupUser(this.obj).subscribe((da: any) => {
      console.log('da:', da)
      if(da.success){
        localStorage.setItem('token', JSON.stringify(da.data));
        this.router.navigate(['/login']);
      }

    })
  }
}
