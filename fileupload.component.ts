import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  IntervalType: string = '';
  IntervalValue: string = '';
  files: File[] = [];

  items = [
    {
      value: "",
      text: "--Select Intervel--"
    },
    {
      value: "y",
      text: "Yearly"
    },
    {
      value: "m",
      text: "Monthly"
    },
    {
      value: "w",
      text: "Weekly"
    },
    {
      value: "d",
      text: "Daily"
    }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.IntervalType ="";
    this.IntervalValue ="";
  }

  onFileSelect(event: { addedFiles: any; }) {
    console.log(event);
    if(this.files.length > 0) {
      this.files.splice(0, 1);
    }
    this.files.push(...event.addedFiles);
    console.log(this.files);
  }
  
  onFileRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  onProcessFile() {
    let formData = new FormData();
    formData.append('files', this.files[0]);
    formData.append('IntervalType', this.IntervalType);
    formData.append('IntervalValue', this.IntervalValue);

    this.http.post<any>('http://localhost:5000/upload', formData).subscribe(
      (response) => {
        console.log(response);
        // handle response here
        console.log(response);
        sessionStorage.setItem("graph_info", JSON.stringify(response));
        this.router.navigate(['/result']);
      },
      (error) => {
        console.error(error);
        // handle error here
      }
    );
  }
}
