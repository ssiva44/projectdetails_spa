import { Component, OnInit,ElementRef , Input} from '@angular/core';
import { APIService }  from '../api.service';
import {CommonService} from '../../common.service';
import {Router,ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'projectlists',
  templateUrl: './projectlists.component.html',
  styleUrls: ['./projectlists.component.css']
})
export class ProjectlistsComponent implements OnInit {
  loading: boolean;
  imagePath: string;
  //apiUrl: string;
  sectorheader: string;
  themeheader: string;
   apiResponse: any;
   total: any;
   @Input() searchTerm:string;
  

  @Input() buttonLink:string;
  @Input() projectDetailsPath:string;
  @Input() apiUrl:string;
  @Input() locale: string;
  @Input() mapPath: string;
  @Input() ctryCode: string;
  @Input() sectorCode: string;
  @Input() regionName: string;

  constructor(private element: ElementRef,private apiservice: APIService,
    private commonservice:CommonService,private http:HttpClient) { 
    }

  ngOnInit() {
   this.initialPage(this.searchTerm)
  }
  
  ngOnChanges() {
    this.commonservice.changesearchSummaryResults.subscribe((data:any) => {
       if(data.locale!=undefined){
      this.locale=data.locale;
    }
     this.initialPage(this.searchTerm)
    })
  }
  initialPage(txtsearch){
    
    let txtvalue=txtsearch;
    let url = this.apiUrl;
    let currentUrl = window.location.href;
    let parameters="";
    if(txtsearch!=""){
      parameters = 'searchTerm='+txtvalue;
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
      }
    url = url + '&apilang=' + this.locale + '&' + parameters;
    
      this.http.post(url,'').subscribe((response)=> {
        //localStorage.setItem('listSummary', JSON.stringify({ response: response }));
        
        this.apiResponse = response;
        let obj={
          response:response,
          locale:this.locale
        }
        this.commonservice.updatesearchSummaryResults(obj);
       // this.loading = false;
        this.total = this.apiResponse.total;
      });
    //}
    
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

    public getParameterByName(name, url) {	    
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
