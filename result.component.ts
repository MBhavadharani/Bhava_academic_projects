import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit{
  htmlString: SafeHtml | undefined;
  accuracy:number | undefined;
  rmse:number | undefined;
  graph: string | undefined;
  constructor(private http: HttpClient, private router: Router,private sanitizer: DomSanitizer) {}
  ngOnInit(){
    var res=sessionStorage.getItem("graph_info")||"{}";
    var result=JSON.parse(res);
    this.accuracy=result.accuracy;
    this.rmse=result.rmse;
    // debugger;
    // this.htmlString = this.sanitizer.bypassSecurityTrustHtml(result.graph_data);
    // this.http.get<any>('http://localhost:5000/result').subscribe(
    //   (response) => {
    //     console.log(response);
    //     this.accuracy=response['accuracy'];
    //     this.rmse=response['rmse'];
    //     this.graph = 'data:image/svg;base64,' + response.graph;
    //   },
    //   (error) => {
    //     console.error(error);
    //     // handle error here
    //   }
    // );
  }
  public getIframeContent(): SafeHtml {
    var res=sessionStorage.getItem("graph_info")||"{}";
    var result=JSON.parse(res);
    return this.sanitizer.bypassSecurityTrustHtml(result.graph_data);
  }
}


