import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { ResultComponent } from './result/result.component';
import { GraphComponent } from './graph/graph.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'fileupload', component: FileuploadComponent },
  {path:'result',component: ResultComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    FileuploadComponent,
    ResultComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxDropzoneModule,
    [RouterModule.forRoot(routes)],
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
