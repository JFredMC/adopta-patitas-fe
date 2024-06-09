import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, ForgotPasswordComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export default class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
