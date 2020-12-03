import { Component, OnInit,ElementRef } from '@angular/core';
import {CommonService} from '../../common.service';
@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loading: boolean;
  imagePath: string;
  locale: string;
  projectsApi: string;  
  projectDetailsPage: string;
  excelFile: string;
  downloadExcelFile: string;
  listrouting:string;
  summaryrouting:string;
  
  constructor(private element: ElementRef,private commonservice:CommonService){
    commonservice.changeClosingallStatus.subscribe((val:any) => {
      if (val) {
        
       this.loading = true;
        this.imagePath = val.summary_imagePath;
        this.locale = val.summary_locale;
        this.projectsApi = val.list_project_list_api;    
        this.projectDetailsPage = val.list_project_details_page; 
        this.excelFile = val.list_excel_file;    
        this.downloadExcelFile = val.list_download_excel;
        this.listrouting = val.projectlist_routing;
        this.summaryrouting=val.summary_routing;
      }
    });
  }

  ngOnInit() {
    
  }
  public updateLoader(loading) {
    this.loading = loading;
  }  
  
}
