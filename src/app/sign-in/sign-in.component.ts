import { Component ,NgZone,OnInit} from '@angular/core';
import { Route, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/authentication.service';
import { AppComponent } from '../app.component';

import { CognitoUserPool ,CognitoUser,AuthenticationDetails} from "amazon-cognito-identity-js";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  isLoading: boolean=false;
  HasError=false;
  ErrorMessage=false;
  hide=true;

  loginForm: FormGroup;

  constructor(
    public fb:FormBuilder,
    private router:Router,
    private ngZone:NgZone,
    private authenticationservice:AuthenticationService,
    private appComponent:AppComponent
  ){}

 ngOnInit(): void {
   this.initializeForm();
 }

 initializeForm(){
  this.loginForm=this.fb.group({
    username:["CTS",[Validators.required,Validators.minLength(5),Validators.maxLength(30)],],
    password:["",[Validators.required,Validators.minLength(5),Validators.maxLength(30)],],
  });

  window.sessionStorage.clear();
 }

 public handleError=(controlName:string,errorName:string)=>{ return this.loginForm.controls[controlName].hasError(errorName);
};

onSignIn(){
  this.appComponent.toggleProgressBar(true);

}
}