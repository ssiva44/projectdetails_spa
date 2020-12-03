import { Component, OnInit , Input} from '@angular/core';

import { Observable } from 'rxjs';
import {Router,ActivatedRoute } from '@angular/router';
import {CommonService} from '../../common.service';

@Component({
  selector: 'ctrysearchprjs',
  templateUrl: './ctrysearchprjs.component.html',
  styleUrls: ['./ctrysearchprjs.component.css']
})
export class CtrysearchprjsComponent implements OnInit {
  isResponse : boolean;
  public arrayOfKeys;
  projectsarr:any[]=[];
  len:any;
  project_name:string;
  boardapprovaldate:Date;
  countryname:string; 
  value:any;
  titleLocales:any;
  projectListLocales: any;
  prjsTit: string;
  buttonVal:string;
  projecHeaderLocales: any;
  projectHeaders: any[] = [];
  divClass: string;
  @Input() summaryrouting:string
  @Input() buttonLink:string;
  @Input() projectDetailsPath:string;
  @Input() apiResponse:string;
  @Input() locale: string;
  @Input() mapPath: string;
  @Input() ctryCode: string;
  @Input() sectorCode: string;
  @Input() regionName: string;
  @Input() projectrouting:string;
  constructor( private route:Router,private activatedRoute:ActivatedRoute,private commonservice:CommonService) {
   // this.locale="en"
    this.titleLocales = { 
      en: 'RECENTLY APPROVED PROJECTS', 
      es: 'PROYECTOS APROBADOS RECIENTEMENTE', 
      fr: 'PROJETS RÉCEMMENT APPROUVÉS', 
      pt: 'PROJETOS RECÉM-APROVADOS', 
      ru: 'НЕДАВНО ОДОБРЕННЫЕ ПРОЕКТЫ', 
      ar: 'الإخطارات المنشورة حديثا', 
      zh: '近期发布的通知' 
    }; 
    
    this.projectListLocales = { 
      en: 'full project list', 
      es: 'proyecto lista', 
      fr: 'projet liste', 
      pt: 'projeto Lista', 
      ru: 'проект список', 
      ar: 'قائمة المشاريع', 
      zh: '项目清单'
    }; 

    this.projecHeaderLocales = { 
      en: ['Country', 'Project Title', 'Approval Date'], 
      es: ['País', 'Nombre del Proyecto', 'Fecha de aprobación'], 
      fr: ['Pays', 'Intitulé du Projet', "Date d'approbation"], 
      pt: ['País', 'Título do projeto', 'Data da aprovação'], 
      ru: ['Страна', 'Название Проекта', 'Дата утверждения'], 
      ar: ['البلد', 'اسم المشروع', 'تاريخ الموافقة'], 
      zh: ['国家', '项目名称', '批准日期']
    }; 
   }

  ngOnInit() {
  }
goToDetail(value) {
  debugger
    let obj={
    isProj:true,
    value:value
    }
    this.commonservice.updateIsSummary(obj);
}
getprojectlist(){
  
  let obj={
    searchTerm:"",
    summary_locale:this.locale,
    list_project_list_api:this.projectDetailsPath,
    
  }
 // window.location.href=window.location.origin+'/'+this.projectrouting
  this.route.navigate([this.projectrouting]);
  this.commonservice.updateSearchResults(obj);
}
  ngOnChanges() {  
    if(this.ctryCode || this.sectorCode || this.regionName)
    {
      this.divClass = "col-lg-7 col-md-7 col-sm-12 col-xs-12";
    }
  if(this.ctryCode == undefined && this.sectorCode == undefined && this.regionName == undefined)
  {
     this.divClass = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
  }
  this.commonservice.changesearchSummaryResults.subscribe((data:any) => {
 
    let apiResponse=data.response;
    if(data.locale!=undefined){
      this.locale=data.locale;
    }
    this.projectHeaders = this.projecHeaderLocales[this.locale];
    if (apiResponse!=false && apiResponse != undefined) {
      
      this.projectsarr=[];
     //this.locale="en";
      this.isResponse = true;
      this.prjsTit = this.titleLocales[this.locale];
      this.buttonVal = this.projectListLocales[this.locale];
     
      let  resources = apiResponse.projects;
      this.len=Object.keys(resources).length;
      this.arrayOfKeys = Object.keys(resources);
        
         for(var key in resources) {
           //console.log(key);
           if(resources.hasOwnProperty(key)) {
  
             this.projectsarr.push(resources[key]);
            
           }
          
      }    
    
         
  }
},
error=>{
 
});
  
 }
}
