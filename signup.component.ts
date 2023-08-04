import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent{
  public signupForm !: FormGroup;
  constructor(private formBuilder : FormBuilder,private http:HttpClient,private router:Router){}
  ngOnInit():void{
    this.signupForm = this.formBuilder.group({
      username:[''],
      email:[''],
      password:[''],
      con_pass:['']
    })
  }
signUp(){

  if(!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(this.signupForm.value.password)) {
    alert("Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters.");
    return;
  }
  
  // check if username is valid
const usernamePattern = /^[a-zA-Z0-9_]{6,30}$/;
if(!usernamePattern.test(this.signupForm.value.username)) {
  alert("Invalid username. The username should be in the mixture of alphanumeric characters and underscores (_) and it can consists of 6 to 30 characters inclusive.");
  return;
}

// check if username already exists
this.http.get<any>("http://localhost:3000/signupusers?username=" + this.signupForm.value.username)
  .subscribe(res=>{
    if(res.length > 0) {
      alert("Username already exists");
      return;
    }
    // ... rest of the code
  }, err=>{
    alert("Something went wrong");
  });

  // check if password and confirm password match
  if(this.signupForm.value.password !== this.signupForm.value.con_pass) {
    alert("Password and confirm password do not match");
    return;
  }

  // validate email format
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if(!emailPattern.test(this.signupForm.value.email)) {
    alert("Invalid email format");
    return;
  }

  // check if username already exists
  this.http.get<any>("http://localhost:3000/signupusers?username=" + this.signupForm.value.username)
    .subscribe(res=>{
      if(res.length > 0) {
        alert("Username already exists");
        return;
      }
      
      // check if email already exists
      this.http.get<any>("http://localhost:3000/signupusers?email=" + this.signupForm.value.email)
        .subscribe(res=>{
          if(res.length > 0) {
            alert("Email already exists");
            return;
          }
          
          // register user
          this.http.post<any>("http://localhost:3000/signupusers", this.signupForm.value)
            .subscribe(res=>{
              alert("Registration is successful");
              this.signupForm.reset();
              this.router.navigate(['login']);
            }, err=>{
              alert("Something went wrong");
            });
        }, err=>{
          alert("Something went wrong");
        });
    }, err=>{
      alert("Something went wrong");
    });
}
}