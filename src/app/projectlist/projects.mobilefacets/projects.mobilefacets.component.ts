import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IMyDpOptions, IMyDate } from '../my-date-picker/interfaces';

@Component({  
	selector: 'projects-mobilefacets', 	
	templateUrl: './projects.mobilefacets.component.html',
	providers: [],
	animations: [    	
		trigger('refineFadeInOut', [
			state('true', style({ height: "0px", display: "none", opacity: 0 })),
			state('false', style({ height: "*", display: "block", opacity: 1 })),
			transition("* => *", animate(300))
		]),
		trigger('flyInOut', [
			state('in', style({transform: 'translateX(0)'})),
			transition('void => *', [
			  	style({transform: 'translateX(-100%)'}),//
			  	animate(100)
			]),
			transition('* => void', [
			 	animate(100, style({transform: 'translateX(100%)'}))
			])
		])
	]
})

export class ProjectsMobileFacetsComponent {
	@Input() isCollapsed: boolean;
	@Input() locale: any;
	@Input() facetsIn: any;	
	@Input() searchIn: any;	
	@Input() apiLanguage: string;	
		
	@Output() isCollapsedOut = new EventEmitter<boolean>();
	@Output() selectedTimeframe = new EventEmitter<any>();
	@Output() deselectedTimeframe = new EventEmitter<any>();
	@Output() selectedDateRange = new EventEmitter<any>();	
	@Output() selectedFacet = new EventEmitter<any>();
	@Output() deselectedFacet = new EventEmitter<any>();

	allLocales: any = {};
	isAllFacets: boolean = false;
	isDate: boolean = true;
	isFacets: boolean = true;		
	timeFrames: any[];
	selectedTimeFrame: string; 
	specificDateRange: string;
	startDateLabel: string;
	endDateLabel: string;
	startDate: string = '';
	endDate: string = '';	
	dateIcon: string;	
	facets: any = [];
	limitFacets: any[] = [];
	selectedFacets: any[] = [];
	seeMore: string;
	seeLess: string;
	back: string;
	facetName: string;	
	datePlaceholder: string = 'mm/dd/yyyy';		

	constructor() { 
		this.allLocales = {
			en : {                               
				specificDateRange: "Specific Date Range",
				startDate: "Start Date",
				endDate: "End Date",
				seeMore: "See More +",
				seeLess: "See Less -",
				back: 'Back'       
            },
            es : {
				specificDateRange: "Rango de fechas específico",
				startDate: "Fecha de inicio",
				endDate: "Fecha final",
				seeMore: "Ver Más +",
				seeLess: "Ver Menos -",
				back: 'Espalda' 
            },
            fr : {
                specificDateRange: "Recherche par date",
				startDate: "Du",
				endDate: "Au",
				seeMore: "Voir plus +",
				seeLess: "Voir moins -",
				back: 'Arrière'
            },
            pt : {
				specificDateRange: "Por datas específicas",
				startDate: "Data de início",
				endDate: "Data de encerramento",
				seeMore: "Ver mais +",
				seeLess: "Ver menos -",
				back: 'Costas'
            },  
            ru : {
                specificDateRange: "Конкретные даты",
				startDate: "Дата начала",
				endDate: "Дата завершения",
				seeMore: "Развернуть +",
				seeLess: "Скрыть -",
				back: 'Hазад'
            },
            ar : {
				specificDateRange: "المدة الزمنية",
				startDate: "تاريخ البدء",
				endDate: "تاريخ الانتهاء",
				seeMore: "نتائج أكثر +",
				seeLess: "نتائج أقل -",
				back: 'الى الخلف'
            },
            zh : {
                specificDateRange: "具体日期范围",
				startDate: "起始日期",
				endDate: "终止日期",
				seeMore: "展开 +",
				seeLess: "收起 -",
				back: '背部'
            }
		}				
	}

	ngOnChanges() {				
		if (this.facetsIn != undefined) {
			this.facets = this.facetsIn;			
		}           
		this.specificDateRange = this.allLocales[this.locale].specificDateRange;	
		this.startDateLabel = this.allLocales[this.locale].startDate;	
		this.endDateLabel = this.allLocales[this.locale].endDate;	
		this.seeMore = this.allLocales[this.locale].seeMore;
		this.seeLess = this.allLocales[this.locale].seeLess;
		this.back = this.allLocales[this.locale].back;		
		this.dateIcon = this.locale == 'ar' ? 'fa fa-caret-left' : 'fa fa-caret-right';		
    }
    /* Timeframe start */
    public getTimeframes(timeFrames: any[]) {			
	  	this.timeFrames = timeFrames;
	};

	public getSelectedTimeframe(timeFrame: string) {			  	
	  	this.selectedTimeFrame = timeFrame;
	};
    
	public onSelectTimeFrame(value) {						
		//this.collapseAll();
		this.selectedTimeframe.emit(value);			
    };		
    /* Timeframe End */

    /* Date Range start */
	public onStartDateChanged(dateChanged: any) {		
		this.startDate = dateChanged.formatted;				
	}

	public onEndDateChanged(dateChanged: any) {		
		this.endDate = dateChanged.formatted;		
	}

	startDateOptions: IMyDpOptions = {	
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        editableDateField: true,
        openSelectorOnInputClick: true,
        showClearDateBtn: false,
        disableUntil: <IMyDate>{},
		disableSince: <IMyDate>{},
		selectorWidth: '191px',
        selectorHeight: '200px'
    };

    endDateOptions: IMyDpOptions = {	
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        editableDateField: true,
        openSelectorOnInputClick: true,
        showClearDateBtn: false,
        disableUntil: <IMyDate>{},
		disableSince: <IMyDate>{},
		selectorWidth: '191px',
        selectorHeight: '200px'
    };
   	 
    public replaceAll(str, find, replace) {
    	return str.replace(new RegExp(find, 'g'), replace);
	}

	public onSeletedDates(startDate, endDate) {				
		this.startDate = startDate;
		this.endDate = endDate;	
	}
	
	public onDateRange() {		
		//this.collapseAll();				
		this.selectedDateRange.emit({ startDate: this.startDate, endDate: this.endDate });
    }    
    /* Date Range End */

    /* Facets Start */    
	public onSeeMore(index) {
		this.limitFacets.push(index);		
    };

	public onSeeLess (index) {
		let i = this.limitFacets.indexOf(index, 0);
		if (i > -1) {
		   this.limitFacets.splice(i, 1);
		}				
    };

    public onFacetItem(facet, itemName) {
    	//this.collapseAll();
    	this.selectedFacet.emit({ facet: facet, itemName: itemName });
    }
    
	public getSelectedFacets(selectedFacets) {		
		this.selectedFacets = selectedFacets;				
    }
	/* Facets End */

    public onSelectDate() {
		this.isAllFacets = true;
    	this.isFacets = true;    	
    	this.isDate = false;
    }

    public onSelectFacetName(facetName) {    	
    	this.facetName = facetName;
    	this.isAllFacets = true;
    	this.isFacets = false;    	
    }

    public onBack() {			
    	this.isAllFacets = false;
    	this.isFacets = true;
    	this.isDate = true;
    }

    public collapseAll() {
    	this.isCollapsed = true;
    	this.isAllFacets = false;
    	this.isFacets = true;
    	this.isDate = true;    	
    	this.isCollapsedOut.emit(this.isCollapsed);
    }

    public uniqueArray(array) {
	  	return array.filter(function(elem, pos, arr) {
	    	return arr.indexOf(elem) == pos;
	  	});
	};	
}
