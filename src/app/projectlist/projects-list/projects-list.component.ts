import { Component, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DataTableDirective } from 'angular-datatables';
import {HttpClient} from '@angular/common/http'
  import { Subject } from 'rxjs';
import { DataService } from '../services/data.service';
import { ExcelService } from "../services/excel.service";
import { PagerService } from '../services/pager.service';
import * as moment from 'moment';
import { Options, LabelType } from 'ng5-slider';
import {Router,ActivatedRoute } from '@angular/router';
import {CommonService} from '../../common.service';

declare function projectsListAnalyticParams(parameters: any, sterm: any, sresults: any, sortby: any, pagination: any): any;

@Component({  
	selector: 'projects-list', 	
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
    providers: [ DataService, ExcelService, PagerService ],
    animations: [
    	trigger('fadeInOut', [
      		transition('void => *', [style({opacity:0}), animate(500, style({opacity:1}))]),
      		transition('* => void', [animate(500, style({opacity:0}))])
    	]),		
  	]
})

export class ProjectsListComponent {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    @Input() locale: string;
    @Input() projectsApi: string;	
    @Input() projectDetailsPage: string;	
    @Output() updateLoader = new EventEmitter<boolean>();	
    @Input() excelFile: string;
@Input() summaryrouting:string
    @Input() downloadExcelFile: string;
    @Input() listrouting: string;
    allLocales: any = {}; 
    url: string;
    inputParameters: string; 
    qterm: string;  	         
    rows: number;  
    allFacets: string;    
    facets: any;
    projectTitle: string;
    projectHeaders: any[] = [];
    projectHeadersProperties: any[] = [];
    projects: any[] = [];    
    isProjects: boolean = true;
    showingDetails: string;
    isLoadMore: boolean;
    isCollapsed: boolean = true;
    isFacetsCollapsed: boolean = false;
    isScrollToTop: boolean = false;	
    refineBy: string;	   
    filter: string;
    clearAll: string;
    download: string;
    noData: string;
    sideBarArrow: string;
    leftArrow: string;
	rightArrow: string;
    page: number;
    totalPages: any[];	
	pager: any = {};
    pagedItems: any[];
    sortType:string = 'asc'; 
    sortedColumns: any[] = [];
    selectedFacets: string;
    selectedTimeframe: string;    
    selectedDates: string;
    sortBy: string;    
    sortByLabel: string;
    isModal:boolean=false; 
    isLoading:boolean=false;
    isTotal:string;
    downloadAll:boolean = false;   
    excelLimit: number;
    total: number;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    value: number = 0;
  options: Options = {
    floor: 0, ceil: 0
  
  };
  rangeValue1:number=0;
  maxValue1:number=0;
  rangeValue2:number=0;
  value1: number = 0;
  options1: Options = {
   floor:0,
   ceil: 0
  };
  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
    constructor(private dataService: DataService,private http:HttpClient, 
      private excelService: ExcelService, private pagerService: PagerService,
      private route:Router,private activatedRoute:ActivatedRoute,private commonservice:CommonService) {         
        this.allLocales = {
            en : {
                projectTitle : 'Projects List',    
                projectHeaders : ['Project Title', 'Country', 'Project ID', 'Commitment Amount', 'Status', 'Approval Date','Last updated Date'],               
                facets : {
                    projectfinancialtype_exact : 'Financing Type',
                    status_exact : 'Status',
                    regionname_exact : 'Region',
                    sector_exact : 'Sector',
                    theme_exact : 'Theme',
                    countryshortname_exact : 'Country',
                    cons_serv_reqd_ind_exact:'Consultant Services Required',
                    esrc_ovrl_risk_rate_exact:'Environmental and Social Risk Use'
                },                
                refineBy : 'REFINE BY',
                filter : 'Filter',
                clearAll : 'Clear All',
                noData : 'Sorry, there are no results that match your search. <a href="/">Please try again.</a>',                
                download : 'Download',
                sortBy: 'Sort By'                                                          
            },
            es : {
                projectTitle : 'Proyectos Lista',    
                projectHeaders : ['Nombre del Proyecto', 'País', 'No. de identificación del proyecto', 'Monto del Compromiso Amount', 'Estatus', 'Fecha de aprobación','Fecha de última actualización'],
                facets : {
                    projectfinancialtype_exact : 'Tipo de financiamiento',
                    status_exact : 'Estatus',
                    regionname_exact : 'Región',
                    sector_exact : 'Sector',
                    theme_exact : 'Tema',
                    countryshortname_exact : 'País' ,
                    cons_serv_reqd_ind_exact:'Servicios de consultoría requeridos',
                    esrc_ovrl_risk_rate_exact:'Uso de riesgos ambientales y sociales'                                     
                },               
                refineBy : 'REFINAR POR',
                filter : 'filtrar',
                clearAll : 'Claro Todas',
                noData : 'Disculpe, no hay resultados que coincidan con su búsqueda. <a href="/">Por favor, intente de nuevo.</a>',                
                download : 'Exportar',
                sortBy: 'Ordenar por'               
            },
            fr : {
                projectTitle : 'Projets liste',    
                projectHeaders : ['Intitulé du Projet', 'Pays', 'Numéro du Projet', 'Montant engagé', 'État', "Date d'approbation",'Date de dernière mise à jour'],
                facets : {
                    projectfinancialtype_exact : 'Type de financement',
                    status_exact : 'État',
                    regionname_exact : 'Région',
                    sector_exact : 'Secteur',
                    theme_exact : 'Thème',
                    countryshortname_exact : 'Pays' ,
                    cons_serv_reqd_ind_exact:'Services de consultants requis',
                    esrc_ovrl_risk_rate_exact:'Utilisation des risques environnementaux et sociaux'                                       
                },               
                refineBy : 'FILTRER PAR',
                filter : 'filtre',
                clearAll : 'Clair Tout',
                noData : 'Sorry, there are no results that match your search. Please try again',                
                download : 'Télécharger',
                sortBy: 'Trier par'
            },
            pt : {
                projectTitle : 'Projetos Lista',    
                projectHeaders : ['Título do projeto', 'País', 'Identidade do Projeto', 'Montante do compromisso', 'Situação', 'Data da aprovação','Data da última atualização'],
                facets : {
                    projectfinancialtype_exact : 'Tipo de financiamento',
                    status_exact : 'Situação',
                    regionname_exact : 'Região',
                    sector_exact : 'Setor',
                    theme_exact : 'Tema',
                    countryshortname_exact : 'País',
                    cons_serv_reqd_ind_exact:'Serviços de consultoria necessários',
                    esrc_ovrl_risk_rate_exact:'Uso de risco ambiental e social'                                       
                },               
                refineBy : 'FILTRAR POR',
                filter : 'filtro',
                clearAll : 'Limpar Tudo',
                noData : 'Sorry, there are no results that match your search. Please try again',                
                download : 'Baixar',
                sortBy: 'Ordenar por'
            },  
            ru : {
                projectTitle : 'Проекты Список',    
                projectHeaders : ['Название Проекта', 'Страна', 'Идентификационный номер проекта', 'Зарезервированные средства', 'Статус', 'Дата утверждения','Дата последнего обновления'],
                facets : {
                    projectfinancialtype_exact : 'Тип финансирования',
                    status_exact : 'Статус',
                    regionname_exact : 'Регион',
                    sector_exact : 'Сектор',
                    theme_exact : 'Тема',
                    countryshortname_exact : 'Страна' ,
                    cons_serv_reqd_ind_exact:'Требуются услуги консультанта',
                    esrc_ovrl_risk_rate_exact:'Использование экологических и социальных рисков'                                       
                },               
                refineBy : 'УТОЧНИТЬ ПО',
                filter : 'Фильтр',
                clearAll : 'Очистить Все',
                noData : 'Sorry, there are no results that match your search. Please try again',                
                download : 'Загрузить',
                sortBy: 'Сортировать по'
            },
            ar : {
                projectTitle : 'المشاريع قائمة',    
                projectHeaders : ['اسم المشروع', 'البلد', 'معرّف المشروع', 'مبلغ الارتباط', 'الوضع', 'تاريخ الموافقة','تاريخ آخر تحديث'],
                facets : {
                    projectfinancialtype_exact : 'نوع التمويل',
                    status_exact : 'الوضع',
                    regionname_exact : 'المنطقة',
                    sector_exact : 'القطاع',
                    theme_exact : 'محور التركيز',
                    countryshortname_exact : 'البلد' ,
                    cons_serv_reqd_ind_exact:'مطلوب خدمات استشارية',
                    esrc_ovrl_risk_rate_exact:'استخدام المخاطر البيئية والاجتماعي'                                     
                },               
                refineBy : 'التحديد حسب  ',
                filter : 'منقي',
                clearAll : 'واضح الكل',
                noData : 'Sorry, there are no results that match your search. Please try again',                
                download : 'تحميل',
                sortBy: 'التصنيف حسب'
            },
            zh : {
                projectTitle : '项目 名單',    
                projectHeaders : ['项目名称', '国家', '项目编号', '承诺额', '状况', '批准日期','最後更新日期'],
                facets : {
                    projectfinancialtype_exact : '贷款类型',
                    status_exact : '状况',
                    regionname_exact : '地区',
                    sector_exact : '部门',
                    theme_exact : '主题',
                    countryshortname_exact : '国家' ,
                    cons_serv_reqd_ind_exact:'需要顧問服務',
                    esrc_ovrl_risk_rate_exact:'環境和社會風險使用'                                       
                },                
                refineBy : '重新定义',
                filter : '过滤',
                clearAll : '明确 所有',
                noData : 'Sorry, there are no results that match your search. Please try again',                
                download : '下载',
                sortBy: '排序'
            }
        }
        this.projectHeadersProperties = ['project_name', 'countryshortname', 'id', 'totalcommamt_srt', 'status', 'boardapprovaldate','proj_last_upd_date'];        
   
   
    }
    
    ngOnInit(): void {        
       // if(this.isLoading){
            this.initialPage("","");
         // }
    }

    ngOnChanges() {
        debugger
        this.dtOptions = {
            paging: false,            
            info: false,
            searching: false,            
            order: []
        };
        this.isModal=false;
        this.isLoading=false;
        
       this.commonservice.changeSearchResults.subscribe((val:any) => {
        if (val) {
            this.isModal=false;
           // this.updateLoader.emit(false);
          this.initialPage("search",val);
        }
      });
      
     
      this.isLoading=false;
       // setTimeout(() => {
        
       

       // $('#projectslist').removeClass('active');
          $('#projectsummary').removeClass('active');
      
        $('#projectslist').addClass('active');
    }
initialPage(txt,val:any){
    
   let txtvalue= val.searchTerm;
    let locales="";
    locales=val.summary_locale;
    if(locales==undefined || locales==""){
        locales="en";
    }
    debugger
    if(this.projectsApi==undefined){
        this.projectsApi=val.list_project_list_api;
    }
  
  this.sortBy = 'boardapprovaldate';
  let locale="";
  if(this.locale!=undefined){
    locale=this.locale
  }else{
    locale=locales;
  }
  this.locale = locale;

        this.refineBy = this.allLocales[this.locale].refineBy;
        this.filter = this.allLocales[this.locale].filter;
        this.clearAll = this.allLocales[this.locale].clearAll;
        this.download = this.allLocales[this.locale].download;
        this.noData = this.allLocales[this.locale].noData;
        this.sortByLabel = this.allLocales[this.locale].sortBy;
        this.sideBarArrow = this.locale == 'ar' ? 'fa fa-angle-right' : 'fa fa-angle-left';
        this.leftArrow = this.locale == 'ar' ? 'fa fa-angle-right' : 'fa fa-angle-left';
		this.rightArrow = this.locale == 'ar' ? 'fa fa-angle-left' : 'fa fa-angle-right';

        this.url = this.projectsApi + '&apilang=' + this.locale;
        this.projectTitle = this.allLocales[this.locale].projectTitle;
        this.projectHeaders = this.allLocales[this.locale].projectHeaders; 
        this.rows = Number(this.getParameterByName('rows', this.url));
        this.allFacets = this.getParameterByName('fct', this.url); 
        
        let currentUrl = window.location.href;
        let parameters="";
        if(txt=="search"){
          parameters = 'searchTerm='+txtvalue;
        }else{
          parameters = location.search.substring(1);
        }
         
        
        if (parameters.indexOf('searchTerm=') != -1) {
            this.qterm = this.getParameterByName('searchTerm', '?' + parameters);
            parameters = this.removeURLParameter(parameters, 'searchTerm') + '&qterm=' + (this.qterm == null ? '' : this.qterm);
        }
        
        this.inputParameters = parameters;
        this.url = this.url + (this.inputParameters == '' ? '' : '&' + this.inputParameters) + '&os=0';
       // this.isProjects = false;
      
        this.http.post(this.url,'').subscribe((response:any)=> {
          this.projects=[];
            let facetsResponse = response.facets;                   
            let facetKeys = ['projectfinancialtype_exact', 'status_exact', 'countryshortname_exact', 'regionname_exact', 'sector_exact', 'theme_exact','cons_serv_reqd_ind_exact','esrc_ovrl_risk_rate_exact'];

            if (Object.keys(facetsResponse).length > 0) {
              this.isProjects = true;
                let orderedFacets = [], facets = [], term = '', approvalDate,proj_last_upd_date;
              //  if (facetsResponse.hasOwnProperty("facetKey")) {
                   
                facetKeys.forEach(facetKey => {                    
                    orderedFacets.push({[facetKey] : facetsResponse[facetKey]});
                });
              //  }

                orderedFacets.forEach(facet => {
                    let facetName = Object.keys(facet)[0];
                
                    if (facetName == 'countryshortname_exact') {
                        term = this.getParameterByName('countrycode_exact', currentUrl);
                    } else if (facetName == 'sector_exact') {
                        term = this.getParameterByName('sectorcode_exact', currentUrl);
                    } else if (facetName == 'theme_exact') {
                        term = this.getParameterByName('mjthemecode_exact', currentUrl);
                    } else {
                        term = this.getParameterByName(facetName, currentUrl);    
                    }
                    
                   if (term == null || term == '') {                        
                        let facetLabel = this.allLocales[this.locale].facets[facetName] == undefined ? facetName : this.allLocales[this.locale].facets[facetName];
                        
                        if(facetsResponse[facetName]!=undefined){
                            facets.push({
                                facetLabel: facetLabel,
                                facetName: facetName, 
                                facetItems: facetsResponse[facetName]
                            });
                        }
                        
                    }                    
                });                
                this.facets = facets;

                Object.keys(response.projects).forEach((element) => {                    
                    let project = response.projects[element];                 
                    
                    if (project.hasOwnProperty('boardapprovaldate')) {                        
                        approvalDate = this.getFormateDate(project.boardapprovaldate, this.locale, false);                                               
                    } else {
                        approvalDate = '';
                    }
                    if (project.hasOwnProperty('proj_last_upd_date')) {                        
                        proj_last_upd_date = this.getFormateDate(project.proj_last_upd_date, this.locale, false);                                               
                    } else {
                        proj_last_upd_date = '';
                    }
                    let totalAmount = project.totalamt == 0 ? project.totalcommamt : project.totalamt;
                    this.projects.push({
                        url: project.url,
                        projectName: project.project_name,
                        country: project.countryshortname,
                        projectId: project.id,
                        commitmentAmount: this.convertCurrency(totalAmount),
                        status: project.status,                        
                        approvalDate: approvalDate,
                        projlastupddate:proj_last_upd_date

                    });
                });
                this.page = 1;
               
                this.total = response.total;
                this.downloadAll = false;
                if(this.total>=10000){
                    this.isModal=false;
                    this.downloadAll = true;
                }
                this.getShowingDetails(this.page, response.total, this.qterm); 
                this.pagination(this.page, response.total);
                // this.dtTrigger.next();                
            }else {               
                this.isProjects = false;
            }
            this.updateLoader.emit(false);  
        },
        error=>{
            if(this.projects.length==0){
                this.isProjects = false;
            }
            this.updateLoader.emit(false); 
        });
       
        //this.updateLoader.emit(false);
      
           
         
      //}, 1000);
}
    goToDetail(value) {
      let obj={
        isProj:true,
        value:value
      }
     this.commonservice.updateIsSummary(obj);
    }
    public setPage(page: number) {		
        this.url = this.removeURLParameter(this.url, 'os') + '&os=' + (page - 1) * 20;
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.updateProjects();
    }

    public pagination(page, total) {
        // total pages
        let range = [];
        for(let i = 1; i <= total; i++) {
            range.push(i);
        }  					
        this.totalPages = range;           				

        // get pager object from service
        this.pager = this.pagerService.getPager(this.totalPages.length, page);

        // get current page of items
        this.pagedItems = this.totalPages.slice(this.pager.startIndex, this.pager.endIndex + 1);        
    }

    public updateTimeframe(timeframe) { 
        this.selectedTimeframe = timeframe;
        if (this.url.indexOf('tf=') == -1) {
          this.url = this.url + '&' + timeframe;
        } else {
          this.url = this.removeURLParameter(this.url, 'tf') + '&' + timeframe;
        }            
        let modifiedUrl = this.removeURLParameter(this.url, 'rows');
        this.url = modifiedUrl + '&rows=' + this.rows; 
        this.url = this.removeURLParameter(this.url, 'os') + '&os=0';
        this.updateProjects();
    }
    
    public updateDates(dates) {  
        this.selectedDates = dates;        
        if (this.url.indexOf('strdate=') == -1 || this.url.indexOf('enddate=') == -1) {
            this.url = this.url + '&' + dates;
        } else {
            this.url = this.removeURLParameter(this.url, 'strdate');
            this.url = this.removeURLParameter(this.url, 'enddate') + '&' + dates;
        }       
        let modifiedUrl = this.removeURLParameter(this.url, 'rows');
        this.url = modifiedUrl + '&rows=' + this.rows; 
        this.url = this.removeURLParameter(this.url, 'os') + '&os=0';
        
        this.updateProjects();
    }
    
    public updateFacets(facets) {
        this.selectedFacets = facets;
        
        this.allFacets.split(",").forEach(facetName => {
            if (facetName == 'countryshortname_exact') {
                this.url = this.removeURLParameter(this.removeURLParameter(this.url, 'countryshortname_exact'), 'countrycode_exact');
            } else if (facetName == 'sector_exact') {
                this.url = this.removeURLParameter(this.removeURLParameter(this.url, 'sector_exact'), 'sectorcode_exact');
            } else {                
                this.url = this.removeURLParameter(this.url, facetName);
            }               
        });

        if (this.url.indexOf('qterm=') != -1) 
            this.url = this.removeURLParameter(this.url, 'qterm'); 
            
        let modifiedUrl = this.removeURLParameter(this.url, 'rows');
        this.url = modifiedUrl + '&rows=' + this.rows; 
       
        this.url = this.url + (this.inputParameters == '' ? '' : '&' + this.inputParameters) + '&' + facets;
        this.url = this.url.slice(-1) == '&' ? this.url.slice(0, -1) : this.url;
        this.url = this.removeURLParameter(this.url, 'os') + '&os=0';
        
      //  setTimeout(() => {
         // window.history.pushState("", "","?" + (this.inputParameters == '' ? '' : '&' + this.inputParameters) + '&' + facets);
        //}, 100);
         
     
     
    // this.route.navigate([this.listrouting], { queryParams: { params: (this.inputParameters == '' ? '' : '&' + this.inputParameters) + '&' + facets  }});
      this.updateProjects();
     
         
    }  
    
    public loadMore() {           
        let numberOfRows = this.rows + Number(this.getParameterByName('rows', this.url));
        let modifiedUrl = this.removeURLParameter(this.url, 'rows');
        this.url = modifiedUrl + '&rows=' + numberOfRows; 
        this.updateProjects();      
    }
    
    public onSort(property, sortType) {
        this.sortBy = property;
        
		if (this.sortedColumns.indexOf(property) === -1) {
			this.sortedColumns.push(property);
			this.sortType = 'asc';
		} else {
			this.sortedColumns.splice(this.sortedColumns.indexOf(property), 1);
			this.sortType = sortType == 'asc' ? 'desc' : 'asc';
        }

        let modifiedUrl = this.removeURLParameter(this.url, 'srt');
        modifiedUrl = this.removeURLParameter(modifiedUrl, 'order');
        this.url = modifiedUrl + '&srt=' + property + '&order=' + this.sortType; 

        this.updateProjects(); 
    }
    
    public updateProjects() { 
        this.updateLoader.emit(true);
       // this.queryParameters = this.getQueryParams(document.location.search);
       this.isProjects = false;
       // window.history.pushState("", "", "?" + queryArr.join("&"));
       this.http.post(this.url,'').subscribe((response:any)=> {                        
            this.projects = [];
            let approvalDate;
            let proj_last_upd_date;
            if (Object.keys(response.projects).length > 0) {
                this.isProjects = true;
                
                Object.keys(response.projects).forEach((element) => {                    
                    let project = response.projects[element];                 
                    
                    if (project.hasOwnProperty('boardapprovaldate')) {                        
                        approvalDate = this.getFormateDate(project.boardapprovaldate, this.locale, false);                                               
                    } else {
                        approvalDate = '';
                    }
                    if (project.hasOwnProperty('proj_last_upd_date')) {                        
                        proj_last_upd_date = this.getFormateDate(project.proj_last_upd_date, this.locale, false);                                               
                    } else {
                        proj_last_upd_date = '';
                    }
                    let totalAmount = project.totalamt == 0 ? project.totalcommamt : project.totalamt;
                    debugger
                    this.projects.push({
                        // url: project.url,
                        projectName: project.project_name,
                        country: project.countryshortname,
                        projectId: project.id,
                        commitmentAmount: this.convertCurrency(totalAmount),
                        status: project.status,                        
                        approvalDate: approvalDate,
                        projlastupddate:proj_last_upd_date
                    });
                });
                
                let os = this.getParameterByName('os', this.url);
                if (os == null) {
                    this.page = 1;
                } else {     
                    this.page = (+os / 20) + 1;               
                }
                this.total = response.total;
                this.downloadAll = false;
                if(this.total>=10000){
                    this.isModal=false;
                    this.downloadAll = true;
                }
                this.pagination(this.page, response.total);
                this.getShowingDetails(this.page, response.total, this.qterm); 

                // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                //     // Destroy the table first
                //     dtInstance.destroy();
                //     // Call the dtTrigger to rerender again
                //     this.dtTrigger.next();
                // });
                
                let sterm = this.qterm == undefined || this.qterm == '' ? '' : this.qterm;    
                let facets = this.selectedFacets == undefined || this.selectedFacets == '' ? '' : this.selectedFacets;
                let timeframe = this.selectedTimeframe == undefined || this.selectedTimeframe == '' ? '' : this.selectedTimeframe;
                let dates = this.selectedDates == undefined || this.selectedDates == '' ? '' : this.selectedDates;
                let sortBy = this.sortBy == undefined || this.sortBy == '' ? '' : this.sortBy;
                let searchParameters = '';                
                searchParameters = searchParameters + (facets == '' ? '' : '&' + facets) + (timeframe == '' ? '' : '&' + timeframe) + (dates == '' ? '' : '&' + dates);
                
               // projectsListAnalyticParams(searchParameters, sterm, response.total, sortBy, this.page); 
            } else {                
                this.isProjects = false;
            }            
            this.updateLoader.emit(false);
        },
        error=>{
            if(this.projects.length==0){
                this.isProjects = false;
            }
            this.updateLoader.emit(false); 
        }); 
    }

    public updateIsCollapsed(collapse: any) {			
        this.isCollapsed = collapse;
    }

    public updateFacetsCollapsed(facetsCollapsed: any) {    	
    	this.isFacetsCollapsed = facetsCollapsed;
    	this.sideBarArrow = this.sideBarArrow == 'fa fa-angle-left' ? 'fa fa-angle-right' : 'fa fa-angle-left';		
    }

    @HostListener("window:scroll", [])
	onScroll(): void {	
		if (window.scrollY > 50) {
	        this.isScrollToTop = true;
	    } else {
	    	this.isScrollToTop = false;
	    }
    }
    
    public onScrollToTop() {
		window.scrollTo(0, 0);		
	}
      
    public getShowingDetails(page, total, qterm) {                      
        let showingFrom = page == 1 ? 1 : ((page - 1) * 20) + 1;
        let showingTo = page * 20 > total ? total : page * 20;

        showingFrom = this.toCurrency(showingFrom);	
        showingTo = this.toCurrency(showingTo);	
        total = this.toCurrency(Number(total));		
        qterm = qterm == undefined || qterm == null ? '' : qterm;						
        
        if (this.locale == 'en') {
            this.showingDetails = 'Showing ' + showingFrom + ' - '+ showingTo + ' of ' + total + ' projects matching the search criteria - ' + qterm;   
        } else if (this.locale == 'es') {
            this.showingDetails = 'Mostrar ' + showingFrom + ' - '+ showingTo + ' de ' + total + ' proyectos que coinciden con el criterio de búsqueda - ' + qterm;   
        } else if (this.locale == 'fr') {
            this.showingDetails = 'Affiche ' + showingFrom + ' - '+ showingTo + ' sur ' + total + ' projets correspondant aux critères de recherche - ' + qterm;
        } else if (this.locale == 'pt') {
            this.showingDetails = 'Mostrando ' + showingFrom + ' - '+ showingTo + ' de ' + total + ' projetos que igualam os critérios de busca - ' + qterm;
        } else if (this.locale == 'ru') {
            this.showingDetails = 'Показывает ' + showingFrom + ' - '+ showingTo + ' из ' + total + ' проекты, соответствующие заданным критериям поиска - ' + qterm;
        } else if (this.locale == 'ar') {            
            this.showingDetails = ' إظهار ' + showingFrom + ' - ' + showingTo + '	خاصة بـ ' + total + '  مشروعات تتفق مع معايير البحث ' + ' - ' + qterm;
        } else if (this.locale == 'zh') {
            this.showingDetails = '显示 ' + showingFrom +' - '+ showingTo + ' / ' + total + ' 项目符合搜索条件 - ' + qterm;
        } else {	
            this.showingDetails = '';
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

    public getFormateDate(date, locale, isExcel) {
        let m = moment.utc(date);
        let formatedDate = '';
        if (isExcel) {
            formatedDate = m.format('YYYY-MM-DD');
        } else {
            if (locale === 'en') 
                formatedDate = m.locale(locale).format('MMMM D, YYYY');
            else if (locale === 'es' || locale === 'pt')            
                formatedDate = m.locale(locale).format('D [de] MMMM [de] YYYY');
            else if (locale === 'fr')
                formatedDate = m.locale(locale).format('D MMMM YYYY');
            else if (locale === 'ru')
                formatedDate = m.locale(locale).format('D MMMM YYYY [года]');
            else if (locale === 'ar')            
                formatedDate = m.format('YYYY[/]MM[/]DD');
            else if (locale === 'zh')            
                formatedDate = m.format('YYYY[年]M[月]D[日]');
        }                 
        return formatedDate;
    }   

    public convertCurrency(currency) {        
        if (currency !== undefined) {
            if (currency.indexOf(',') === -1) {
                return (Math.abs(Number(currency)) / 1.0e+6).toFixed(2);
            } else {
                currency = currency.replace(/\,/g,'');
                return (Math.abs(Number(currency)) / 1.0e+6).toFixed(2);
            }   
        }                                       
    }

    public toCurrency(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    getdownloadExcel(obj){
        
        let projectsExcel: any[] = [];
        let url=""; 
       
             url = this.removeURLParameter(this.projectsApi, 'fct');
            url = this.removeURLParameter(url, 'rows') + '&rows=500&os='+obj.index+'&apilang=' + this.locale;
            
            if (this.qterm != undefined && this.qterm != '') {
                url = url + '&qterm=' + this.qterm;
            }
            
            this.updateLoader.emit(true);
        this.dataService.getResponse(url).subscribe((response:any)=> {  
                       
            Object.keys(response.projects).forEach((element) => {                    
                let project = response.projects[element];                 
                let totalAmount = project.totalamt == 0 ? project.totalcommamt : project.totalamt;

                projectsExcel.push({                        
                    'Project Name': project.project_name,
                    'Country': project.countryshortname,
                    'Project Id': project.id,
                    'Commitment Amount': this.convertCurrency(totalAmount),
                    'Status': project.status,                        
                    'Approval Date': project.boardapprovaldate
                });
            });
            
            this.excelService.exportAsExcelFile(projectsExcel, 'Search Results', 'Search Results');        
            this.updateLoader.emit(false);
        });
    }
    public onDownloadExcel() { 
       
       
            this.setRangeValues();
            this.isModal=true; 
       // }   
         
    }

    setRangeValues(){
   
        let totals:any;
        let totalValues:any;
        let lastdigits:any;
    
        if(this.total>50000){
            totals = 50000;
            totalValues = 10000;
        }else{
            if(this.total>=10000){
                totals = this.total;
                totals = totals.slice(0,1)+"0000";
            }else{
                totals =0;
            }
    
            totalValues = this.total;
            if(totalValues.length>3){
              //  this.maxValue1 = this.total;
                if(this.total<=9999){
                    lastdigits = totalValues.slice(1);
                }else{
                    totalValues = totalValues.slice(1);
                    lastdigits = totalValues.slice(1);
                }
                totalValues = totalValues.slice(0,1)+"000";
                if(lastdigits>=500){
                    lastdigits =1000;
                }else{
                    lastdigits =500;
                }
                totalValues = parseInt(totalValues)+lastdigits;
            }else{
               // this.maxValue1 = this.total;
                if(totalValues>=500){
                    totalValues =1000;
                }else{
                    totalValues =500;
                }
            }
    
        }
        // this.isTotal1 = totals;
        // this.isTotal2 = totals;
        let fulltotal:any;
        if(totals==10000){
            fulltotal = totals;
        }else{
            fulltotal =totals-10000;
        }
        this.options ={
            floor:0,
            ceil:totals,
            step:10000,
            maxLimit:fulltotal,
            showTicks:true,
            showTicksValues:true
        }
    
        this.options1 ={
            floor:0,
            ceil:totalValues,
            maxLimit:totalValues-500,
            step:500,
            showTicks:true,
            showTicksValues:true
        }
        this.manualRefresh.emit();
        totals="";
    }

    getTotalArray(){
        var start = 0, end =500, count =0, obj = [];
        for(var i=0;i<=50000;i++) {
            if (!obj[start + '-' + end]) {
                let multple:number;
                if(i==0){
                    multple =0;
                }else{
                    multple =count*10;
                }
                obj[start + '-' + end] = ({'index': multple, 'label': end});
                }
            if((start <= i) && (i < end)) {
    
            } else {
            count++;
            start += 500;
            end += 500;
            }
        }
        
        const valuesPolyfill = function values (object) {
        return Object.keys(object).map(key => object[key]);
        };
              
         const values = Object.values || valuesPolyfill;
        return values(obj);
        }
        closeModal(){
            this.isModal=false; 
        }
        onSubmitModal(){
            this.isModal=false; 
            let total:any;
            let rangeValue1=0;
            let rangeValue2=0;
           // rangeValue1 = this.rangeValue1;
            rangeValue2 = this.rangeValue2;
            total = rangeValue2;
            if(rangeValue2==0 ){
                total = 500;
            }else{
                total = total+500;
            }
            //rangeValue1+
           
            this.isTotal=total;
            
            let arrayValues = this.getTotalArray();
            let objResult = arrayValues.filter(data => data.label === total);
            this.rangeValue1=0;
           // this.rangeValue2=0;
            //if(rangeValue2!=0 ){
                if(objResult[0]!=undefined && objResult[0].length!=0){
                this.getdownloadExcel(objResult[0]);
                }
            //}
          
        }


}
