import { Component,OnInit,ElementRef } from '@angular/core';
import { APIService }  from '../api.service';
import {CommonService} from '../../common.service';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [    	
		trigger('footNoteFadeInOut', [
			state('hide', style({
        height: '0px',
        opacity: '0',
        overflow: 'hidden',
        // display: 'none'
    })),
    state('show', style({
        height: '*',
        opacity: '1',
        // display: 'block'
    })),
    transition('hide => show', animate('200ms ease-in')),
    transition('show => hide', animate('200ms ease-out'))			
		])
	]  
})
export class ProjectAppComponent implements OnInit {
  loading: boolean;
  imagePath: string;
  apiUrl: string;
  sectorheader: string;
  themeheader: string;
  isdata:boolean=false;
  apiResponse: any;
  locale: string;
  buttonLink: string;
  projectDetailsPath: string;
  ctryCode: string;
  isShow:string="hide";
  sectorCode: string;
  regionName: string;
  mapPath: string;
  total: any;
  summaryrouting:any;
  projectrouting:string;
  isFootNotes:boolean=false;
  disclaimerText: string;	 
	 disclaimerTextGroup: any = {}; 
	 footNoteAnimation: boolean = false;
  constructor(private element: ElementRef,private apiservice: APIService,
    private commonservice:CommonService,private http:HttpClient){
      this.disclaimerTextGroup = {
        en : {
            
            descriptions: [
                '** Total project cost includes funding from World Bank and non-bank sources in US$ millions. Active and Closed projects show commitment at Board approval. It does not reflect any cancellations.Proposed (pipeline) and dropped projects show the forecast amount. The commitment amount for projects in the pipeline is indicative and may be modified during the project preparation.',
                '*** Borrower refers to the Borrower of a Loan or Recipient of a Grant'
            ]
        },
        es : {
            descriptions: [
                '* Para los proyectos activos y cerrados, el monto del compromiso al momento de ser aprobados por el Directorio está en millones de US$. Esto no refleja ninguna cancelación. Los proyectos propuestos (en tramitación) y abandonados muestran el monto previsto. El monto del compromiso para los proyectos en tramitación es indicativo y podría ser modificado durante la preparación de un proyecto.',
            ]
        },
        fr : {
            descriptions: [
                "*Pour les projets en cours ou achevés, le montant des engagements approuvé par le Conseil est indiqué en millions de dollars, et ne reflète aucune annulation. Pour les projets envisagés (en réserve) et abandonnés, le montant indiqué correspond au montant envisagé. Le montant des engagements pour les projets en réserve est donné à titre indicatif et est susceptible de changer en cours de préparation du projet."
            ]
        },
        pt : {
            descriptions: [
                '* No caso de projetos ativos e encerrados, o montante comprometido na aprovação por parte da Diretoria Executiva figura em US$ milhões. Isto não reflete nenhum cancelamento. Projetos propostos (em tramitação) e rejeitados mostram o montante previsto. O montante comprometido para projetos em tramitação tem caráter indicativo e pode ser alterado durante a preparação do projeto.'
            ]
        },
        ru : {
            
            descriptions: [
                '* По активным и закрытым проектам зарезервированная сумма указана в миллионах долларов США. Аннулированные суммы не указаны. По планируемым и прекращенным проектам показана прогнозируемая сумма. Сумма, зарезервированная на планируемые проекты, является предварительной и может быть изменена на стадии подготовки проекта.'
            ]
        },
        ar : {
            
            descriptions: [
                '*بالنسبة للمشروعات الجارية والمقفلة، يظهر مبلغ الارتباطات بملايين الدولارات وقت موافقة المجلس عليها. ولا يُظهر ذلك أية إلغاءات. وتظهر المشروعات المقترحة (الجاري إعدادها) والمشروعات المسقطة المبلغ المتوقع. علماً بأن مبلغ الارتباط الخاص بالمشروعات الجاري إعدادها هو مبلغ تأشيري، ويمكن تعديله أثناء مرحلة إعداد المشروع.'
            ]
        },
        zh : {
            descriptions: [
                '* 对于再建项目和已完成的项目，执董会批准的承诺额以百万美元为单位显示，不包括取消的部分。准备中和取消的项目显示的是预计的金额。准备中项目的承诺额是预计的，在项目准备过程中有可能修改。'
            ]
        }
    }   

    
    commonservice.changeClosingallStatus.subscribe((val:any) => {
      if (val) {
      
      this.loading = true;
  this.imagePath = val.summary_imagePath;
  this.locale = val.summary_locale;
  this.apiUrl=val.list_summary_apiUrl ;
  this.buttonLink = val.list_summary_buttonLink;;
  this.projectDetailsPath = val.list_summary_projectDetailsPath;
  this.ctryCode = val.list_summary_ctryCode  ;
  this.sectorCode = val.list_summary_sectorCode ;
  this.regionName = val.list_summary_regionName;
  this.mapPath = val.list_summary_mapPath ;
  this.summaryrouting=val.summary_routing;
  this.projectrouting=val.projectlist_routing;
      this.initialPage("search",val.searchTerm,val)
      }
    },
    error=>{
      this.loading = false; 
    });

    //this.initialPage("","")
  //this.sanitizer.bypassSecurityTrustResourceUrl(this.mapPath);
   }  
   
initialPage(txt,txtsearch,val){
  

  
let url = this.apiUrl;
let currentUrl = window.location.href;
// let parameters = location.search.substring(1);  
let parameters="";
if(txt=="search"){
  if(txtsearch!=undefined){
    parameters = 'searchTerm='+txtsearch;
  }else{
    parameters="";
  }

}else{
parameters = location.search.substring(1);
}      
this.buttonLink = this.buttonLink + (parameters == '' ? parameters : '?' + parameters);
if (parameters.indexOf('searchTerm=') != -1) {
  let qterm = this.getParameterByName('searchTerm', '?' + parameters);
  parameters = this.removeURLParameter(parameters, 'searchTerm');
  parameters = (parameters == '' ? parameters : parameters + '&') + 'qterm=' + (qterm == null ? '' : qterm);
} 
let locale="";
  if(this.locale!=undefined){
    locale=this.locale
  }else{
    locale=val.summary_locale;
  } 
url = url + '&apilang=' + this.locale + '&' + parameters;

this.disclaimerText= this.disclaimerTextGroup[locale].descriptions;

  this.isdata=false;
  
  this.http.post(url,'').subscribe((response)=> {
    this.loading = false;
    this.isdata=true;
    
    let locale="";
    debugger
    if(this.locale!=undefined){
      locale=this.locale
    }else{
      locale=val.summary_locale;
    }
    this.apiResponse = response;
    let obj={
      response:response,
      locale:locale
    }
    this.commonservice.updatesearchSummaryResults(obj);
    this.loading = false;
    this.total = this.apiResponse.total;
  },
  error=>{
    this.loading = false; 
  }); 


if(this.ctryCode)
{

if(this.ctryCode.indexOf("3A")!== -1)
{
this.mapPath = this.mapPath + "&region=Africa";
}
else
{
this.mapPath = this.mapPath + "&country="+this.ctryCode;
}

}
if(this.sectorCode)
{
this.mapPath = this.mapPath + "&sector="+this.sectorCode;
}
if(this.regionName)
{
this.regionName = this.regionName.replace("and","And");
this.mapPath = this.mapPath + "&region="+this.regionName;
}
}

  ngOnInit() {
    //if($('#projectslist')!=undefined){
      $('#projectslist').removeClass('active');
    //}
   // if($('#projectsummary')!=undefined){
      $('#projectsummary').removeClass('active');
    //}
    $('#projectsummary').addClass('active');
  }
  public getParameterByName(name, url) {	    
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  // onFootNotes() {
  //   //this.footNoteAnimation = footNoteAnimation;
  //     setTimeout(()=>{
  //       this.isFootNotes=!this.isFootNotes;
  //  },200)
   
  //  }
  hideFootnotes(){
    this.isFootNotes=!this.isFootNotes;
  }
   onFootNotes(footNoteAnimation) {
    this.footNoteAnimation = footNoteAnimation;
  }
  public removeURLParameter(url, parameter) {		
    var prefix = encodeURIComponent(parameter) + '=';
    var pars= url.split(/[&;]/g);
    
    for (var i= pars.length; i-- > 0;) {    
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
        pars.splice(i, 1);
      }
    }
    return pars.join('&');					
  }
}
