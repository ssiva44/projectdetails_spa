import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as moment from 'moment';

@Component({
    selector: 'abstract-details',
    templateUrl: './abstract-details.component.html',
    animations: [    	
		trigger('footNoteFadeInOut', [
			state('false', style({ height: "0px", display: "none" })),
			state('true', style({ height: "*", display: "block" })),
			transition("false <=> true", animate(200))			
		])
	]    
})

export class AbstractDetailsComponent {
    @Input() apiResponse: any; 
    @Input() projectCode: string;
    @Input() locale: string;    
        
    allLocales: any = {};        
    isResponse: boolean;
    isAbstract: boolean;    
    abstractLabel: string;
    abstract: string;
    abstractTotal: string;
    isShowMoreOrLess: boolean;
    showMoreOrLessLabel: string;
    showMoreOrLessIcon: string;
    projectDetailsLabel: string;
    keyDetailsLabel: string;
    projectIdLabel: string;    
    projectId: string;     
    countryNameLabel: string;
    countryName: string;
    isCountry: boolean;
    countryPath: string;
    regionNameLabel: string;
    regionName: string;
    isRegion: boolean;
    regionPath: string;
    statusLabel: string;
    status: string; 
    approvalDateLabel: string;
    approvalDate: string;      
    closingDateLabel: string;
    closingDate: string;
    teamLeadersLabel: string; 
    teamLeaders: string; 
    totalProjectCostLabel: string;
    totalProjectCost: string;
    commitmentAmountLabel: string;
    commitmentAmount: string;
    borrowerLabel: string;
    borrower: string;
    implementingAgencyLabel: string;
    implementingAgency: string;
    environmentalCategoryLabel: string;
    environmentalCategory: string;
    boardPresentation: string;
    disclaimers: any = {};
    disclaimerText: any;
    descriptions: string;
    footNoteAnimation: boolean = false;
	isDevObj: boolean;    
    devobjLabel: string;
    devobj: string;
	devObjHeader: string;
	lastupdateDate: string;
	lastupdateDateLabel: string;
	consultantServiceLabel: string;
    consultantService: string;
    environmentalRisk: string;
    approvalYearLabel: string;
    approvalYear: string;   
    projects: any[];
    lastStageReachedLabel: string;
    lastStageReached: string;
    parentProjectLabel: string;
    parentProject: string;
    projectLink: string;

    constructor() {        
        this.allLocales = {
            en : {
                abstract: 'Abstract*',
                projectId: 'Project ID',
                keyDetails: 'Key Details' ,
                projectDetails: 'Project Details',
                country: 'Country', 
                region: 'Region', 
                status: 'Status', 
                approvalDate: 'Approval Date', 
                closingDate: 'Closing Date', 
                teamLeader: 'Team Leader', 
                totalProjectCost: 'Total Project Cost', 
                commitmentAmount: 'Commitment Amount', 
                borrower: 'Borrower', 
                implementingAgency: 'Implementing Agency', 
                environmentalCategory: 'Environmental Category',
                boardPresentation: 'as of board presentation',
                showMore: 'Show More',
                showLess: 'Show Less',
				devobjLabel: 'Development Objective',
				lastupdateDate: 'Last Update Date',
				consultantService: 'Consultant Services required',
				environmentalRisk: 'Environmental and Social Risk',
				approvalYear: 'Approval FY',
                lastStageReached: 'Last Stage Reached' ,
                parentProject: 'Associated Projects' ,
                disclaimers: [
                    "* The project abstract is drawn from the PAD, SAR or PGD and may not accurately reflect the project's current nature",
                    //"** Total project cost includes funding from World Bank and non-bank sources in US$ millions. Active and Closed projects show commitment at Board approval. It does not reflect any cancellations. Proposed (pipeline) and dropped projects show the forecast amount. The commitment amount for projects in the pipeline is indicative and may be modified during the project preparation."
                ],
                descriptions: [
                    '* Theme Classification did not exist at the time project was approved',
                    '** Total project cost includes funding from World Bank and non-bank sources in US$ millions. Active and Closed projects show commitment at Board approval. It does not reflect any cancellations.Proposed (pipeline) and dropped projects show the forecast amount. The commitment amount for projects in the pipeline is indicative and may be modified during the project preparation.',
                    '*** Borrower refers to the Borrower of a Loan or Recipient of a Grant'
                ]
            },
            es : {
                abstract: 'Resumen*',
                projectId: 'No. de identificación del proyecto',
                keyDetails: 'Llave Detalles' ,
                projectDetails: 'Proyecto Detalles', 
                country: 'País', 
                region: 'Región', 
                status: 'Estatus', 
                approvalDate: 'Fecha de aprobación', 
                closingDate: 'Fecha de Cierre', 
                teamLeader: 'Jefe del equipo', 
                totalProjectCost: 'Costo total del proyecto', 
                commitmentAmount: 'Monto del Compromiso', 
                borrower: 'Prestatario', 
                implementingAgency: 'Organismo Ejecutor	', 
                environmentalCategory: 'Categoría Ambiental',
                boardPresentation: 'a partir de la presentación ante el Directorio',
                showMore: 'Ver Más',
                showLess: 'Ver Menos',
				devobjLabel: 'Objetivo de desarrollo',
				lastupdateDate: 'Última Fecha de Actualización',
				consultantService: 'Servicios de consultoría requeridos',
				environmentalRisk: 'Riesgo ambiental y social',
				approvalYear: 'Aprobación FY',
                lastStageReached: 'Última etapa alcanzada' ,
                parentProject: 'Associated Projects' ,
                disclaimers: [
                    "* El resumen del proyecto es elaborado sobre la base del documento de evaluación inicial, el informe de evaluación inicial preparado por el personal o el documento del programa y es posible que no refleje exactamente la índole actual del proyecto.",
                    //"** El costo total del proyecto incluye el financiamiento del Banco Mundial y otras fuentes en millones de US$. Los proyectos activos y cerrados muestran el monto del compromiso al momento de ser aprobados por el Directorio. Esto no refleja ninguna cancelación. Los proyectos propuestos (en tramitación) y los abandonados muestran el monto previsto. El monto del compromiso para los proyectos en tramitación es indicativo y podría ser modificado durante la preparación de un proyecto."
                ],
                descriptions: [
                    '* La clasificación por temas no existía al momento de la aprobación del proyecto.',
                    '** El costo total del proyecto incluye el financiamiento del Banco Mundial y otras fuentes en millones de US$. Los proyectos activos y cerrados muestran el monto del compromiso al momento de ser aprobados por el Directorio. Esto no refleja ninguna cancelación. Los proyectos propuestos (en tramitación) y los abandonados muestran el monto previsto. El monto del compromiso para los proyectos en tramitación es indicativo y podría ser modificado durante la preparación de un proyecto.',
                    '*** Borrower refers to the Borrower of a Loan or Recipient of a Grant'
                ]
            },
            fr : {
                abstract: 'Résumé*',
                projectId: 'Numéro du Projet', 
                keyDetails: 'Clé Détails' ,
                projectDetails: 'Projet Détails',
                country: 'Pays', 
                region: 'Région', 
                status: 'État', 
                approvalDate: "Date d'approbation", 
                closingDate: 'Date de clôture', 
                teamLeader: 'Chef d’équipe', 
                totalProjectCost: 'Coût total du projet', 
                commitmentAmount: 'Montant engagé',
                borrower: 'Emprunteur', 
                implementingAgency: "Organisme d'exécution", 
                environmentalCategory: 'Catégorie Environnementale',
                boardPresentation: 'à la date de présentation au Conseil',
                showMore: 'Voir plus',
                showLess: 'Voir moins',
				devobjLabel: 'Objectif de développement',
				lastupdateDate: 'Date de dernière mise à jour',
				consultantService: 'Services de consultants requis',
				environmentalRisk: 'Risque environnemental et social',
				approvalYear: 'Approbation FY',
                lastStageReached: 'Dernière étape atteinte' ,
                parentProject: 'Associated Projects' ,
                disclaimers: [
                    "* Le résumé de projet étant tiré du document d'évaluation de projet (PAD), du rapport d'évaluation (SAR) ou du document du programme (PGD), il peut ne pas refléter exactement la teneur du projet en son état actuel.",
                    //"** Le coût total du projet inclut l’ensemble des financements provenant de la Banque mondiale et d’autres sources, et est exprimé en millions de dollars. Pour les projets en cours et clos, le montant indiqué correspond à l’engagement pris à la date d’approbation par le Conseil. Il ne reflète aucune annulation. Pour les projets envisagés (en réserve) et abandonnés, le montant indiqué correspond au montant envisagé. Le montant des engagements pour les projets en réserve est donné à titre indicatif et est susceptible de changer en cours de préparation du projet."
                ],
                descriptions: [
                    "* La classification thématique n'existait pas au moment de l'approbation du projet.",
                    "** Le coût total du projet inclut l’ensemble des financements provenant de la Banque mondiale et d’autres sources, et est exprimé en millions de dollars. Pour les projets en cours et clos, le montant indiqué correspond à l’engagement pris à la date d’approbation par le Conseil. Il ne reflète aucune annulation. Pour les projets envisagés (en réserve) et abandonnés, le montant indiqué correspond au montant envisagé. Le montant des engagements pour les projets en réserve est donné à titre indicatif et est susceptible de changer en cours de préparation du projet.",
                    "*** Borrower refers to the Borrower of a Loan or Recipient of a Grant"
                ]
            },
            pt : {
                abstract: 'Resumo*',
                projectId: 'Identidade do Projeto',
                keyDetails: 'Chave Detalhes' ,
                projectDetails: 'Projeto Detalhes', 
                country: 'País', 
                region: 'Região', 
                status: 'Situação', 
                approvalDate: 'Data da aprovação', 
                closingDate: 'Data de encerramento', 
                teamLeader: 'Líder da Equipe', 
                totalProjectCost: 'Custo total do projeto', 
                commitmentAmount: 'Montante do compromisso', 
                borrower: 'Mutuário', 
                implementingAgency: 'Entidade Executora', 
                environmentalCategory: 'Categoria ambiental',
                boardPresentation: 'conforme apresentação da Diretoria Executiva',
                showMore: 'Ver mais',
                showLess: 'Ver menos',
				devobjLabel: 'Objetivo de Desenvolvimento',
				lastupdateDate: 'Data da última atualização',
				consultantService: 'Serviços de consultoria necessários',
				environmentalRisk: 'Risco Ambiental e Social',
				approvalYear: 'Aprovação FY',
                lastStageReached: 'Última etapa alcançada' ,
                parentProject: 'Associated Projects' ,
                disclaimers: [
                    "* Os resumos dos projetos são tirados do PAD, SAR ou PGD e talvez não reflitam com exatidão a natureza atual do projeto",
                    //"** O custo total de um projeto inclui financiamento do Banco Mundial e de outras fontes não bancárias em US$ milhões. Projetos ativos e encerrados indicam o compromisso na aprovação por parte da Diretoria. Isto não reflete nenhum cancelamento. Projetos propostos (em tramitação) e rejeitados mostram o montante previsto. O montante comprometido para projetos em tramitação tem caráter indicativo e pode ser alterado durante a preparação do projeto."
                ],
                descriptions: [
                    '* Não havia Classificação de Temas na época em que o projeto foi aprovado',
                    '** O custo total de um projeto inclui financiamento do Banco Mundial e de outras fontes não bancárias em US$ milhões. Projetos ativos e encerrados indicam o compromisso na aprovação por parte da Diretoria. Não reflete cancelamentos. Projetos propostos (em tramitação) e rejeitados mostram o montante previsto. O montante comprometido para projetos em tramitação tem caráter indicativo e pode ser alterado durante a preparação do projeto.',
                    '*** Mutuário refere-se ao mutuário de um empréstimo ou ao beneficiário de um subsídio'
                ]
            },
            ru : {
                abstract: 'Краткий Обзор*',
                projectId: 'Идентификационный Hомер Проекта',
                keyDetails: 'Ключ Детали' ,
                projectDetails: 'Проект Детали', 
                country: 'Страна', 
                region: 'Регион', 
                status: 'Статус', 
                approvalDate: 'Дата утверждения', 
                closingDate: 'Дата завершения', 
                teamLeader: 'Руководитель группы', 
                totalProjectCost: 'Общая стоимость проекта', 
                commitmentAmount: 'Зарезервированные средства', 
                borrower: 'Заёмщик', 
                implementingAgency: 'Учреждение-исполнитель', 
                environmentalCategory: 'Экологическая категория',
                boardPresentation: 'на дату представления Совету',
                showMore: 'Развернуть',
                showLess: 'Скрыть',
				devobjLabel: 'Цель развития',
				lastupdateDate: 'Дата последнего обновления',
				consultantService: 'Требуются услуги консультанта',
				environmentalRisk: 'Экологический и социальный риск',
				approvalYear: 'Утверждение FY',
                lastStageReached: 'Достигнут последний этап' ,
                parentProject: 'Associated Projects' ,
                disclaimers: [
                    "* Краткая информация о проекте может быть получена из PAD, SAR или PGD и может не давать полного и точного представления о характере проекта.",
                    //"** Общая сумма средств в миллионах долларов США включает финансовые ресурсы, выделенные Всемирным банком и полученные из других источников. Информация об активных и закрытых проектах включает средства, зарезервированные во время утверждения Советом. Аннулированные суммы не указаны. По планируемым и прекращенным проектам показана прогнозируемая сумма. Сумма, зарезервированная на планируемые проекты, является предварительной и может быть изменена на стадии подготовки проекта."
                ],
                descriptions: [
                    '* На момент утверждения проекта классификация проектов по темам не проводилась',
                    '** Общая сумма средств в миллионах долларов США включает финансовые ресурсы, выделенные Всемирным банком и полученные из других источников. Информация об активных и закрытых проектах включает средства, зарезервированные во время утверждения Советом. Аннулированные суммы не указаны. По планируемым и прекращенным проектам показана прогнозируемая сумма. Сумма, зарезервированная на планируемые проекты, является предварительной и может быть изменена на стадии подготовки проекта.',
                    '*** Borrower refers to the Borrower of a Loan or Recipient of a Grant'
                ]
            },
            ar : {
                abstract: 'خلاصة*',
                projectId: 'معرّف المشروع',
                keyDetails: 'تفاصيل رئيسة' ,
                projectDetails: 'تفاصيل مشروع', 
                country: 'البلد', 
                region: 'المنطقة', 
                status: 'الوضع', 
                approvalDate: 'تاريخ الموافقة', 
                closingDate: 'تاريخ الإقفال', 
                teamLeader: 'رئيس الفريق', 
                totalProjectCost: 'التكلفة الكلية للمشروع', 
                commitmentAmount: 'مبلغ الارتباط', 
                borrower: 'البلد المقترض', 
                implementingAgency: 'الهيئة المنفذة', 
                environmentalCategory: 'فئة التصنيف البيئي',
                boardPresentation: 'حتى تاريخ العرض على مجلس المديرين التنفيذيين',
                showMore: 'نتائج أكثر',
                showLess: 'نتائج أقل',
				devobjLabel: 'هدف التنمية',
				lastupdateDate: 'اخر تاريخ تحديث',
				consultantService: 'مطلوب خدمات استشارية',
				environmentalRisk: 'المخاطر البيئية والاجتماعية',
				approvalYear: 'الموافقة للسنة المالية',
                lastStageReached: 'وصلت المرحلة الأخيرة' ,
                parentProject: 'Associated Projects' ,
                disclaimers: [
                    ".خلاصة المشروع هذه مستمدة من وثيقة التقييم المسبق للمشروع، أو تقرير التقييم المُسبق الذي يعده موظفو البنك، أو وثيقة البرنامج، وقد لا تعكس بدقة الطبيعة الحالية لهذا المشروع. *",
                    //".تشمل التكلفة الكلية للمشروع التمويل المقدم من البنك الدولي وأية مصادر غير مصرفية بملايين الدولارات. وتظهر المشروعات الجارية والمقفلة قيمة الارتباط وقت موافقة المجلس عليها. ولا تُظهر أية إلغاءات. وتظهر المشروعات المقترحة (الجاري إعدادها) والمشروعات المسقطة المبلغ المتوقع. علماً بأن مبلغ الارتباط الخاص بالمشروعات الجاري إعدادها هو مبلغ تأشيري، ويمكن تعديله أثناء مرحلة إعداد المشروع. **"
                ],
                descriptions: [
                    '* لم يكن تصنيف محاور التركيز موجوداً وقت الموافقة على المشروع',
                    '** تشمل التكلفة الكلية للمشروع التمويل المقدم من البنك الدولي وأية مصادر غير مصرفية بملايين الدولارات. وتظهر المشروعات الجارية والمقفلة قيمة الارتباط وقت موافقة المجلس عليها. ولا تُظهر أية إلغاءات. وتظهر المشروعات المقترحة (الجاري إعدادها) والمشروعات المسقطة المبلغ المتوقع. علماً بأن مبلغ الارتباط الخاص بالمشروعات الجاري إعدادها هو مبلغ تأشيري، ويمكن تعديله أثناء مرحلة إعداد المشروع.',
                    '*** Borrower refers to the Borrower of a Loan or Recipient of a Grant'
                ]
            },
            zh : {
                abstract: '摘要*',
                projectId: '项目编号',
                keyDetails: '键 细节' ,
                projectDetails: '项目 细节', 
                country: '国家', 
                region: '地区', 
                status: '状况', 
                approvalDate: '批准日期', 
                closingDate: '关闭日期', 
                teamLeader: '项目经理', 
                totalProjectCost: '项目总成本', 
                commitmentAmount: '承诺额', 
                borrower: '借款人', 
                implementingAgency: '执行机构', 
                environmentalCategory: '环境类别',
                boardPresentation: '截至提交执董会之日',
                showMore: '展开',
                showLess: '收起',
				devobjLabel: '发展目标',
				lastupdateDate: '最后更新日期',
				consultantService: '需要顾问服务',
				environmentalRisk: '环境与社会风险',
				approvalYear: '批准年度',
                lastStageReached: '到达最后阶段' ,
                parentProject: 'Associated Projects' ,
                disclaimers: [
                    "* 该项目摘要来源项目评估文件，员工评估报告或项目方案文件，并不能准确反映出项目目前的性质。", 
                    //"** 对于再建项目和已完成的项目，执董会批准的承诺额以百万美元为单位显示，不包括取消的部分。准备中和取消的项目显示的是预计的金额。准备中项目的承诺额是预计的，在项目准备过程中有可能修改。"
                ],
                descriptions: [
                    '* 项目批准时尚无主题分类',
                    '** 项目总额包括来自世界银行与非世行来源的资金，单位为百万美元。再建项目和已完成项目所显示为执董会批准时的承诺额，不反映取消部分。筹备项目和取消项目所显示为预测金额。筹备项目的承诺金额为预计金额，可能在项目筹备过程中修改。',
                    '*** Borrower refers to the Borrower of a Loan or Recipient of a Grant'
                ]
            }
        }              
    }

    ngOnChanges() {                                            
        if (this.apiResponse != undefined) {
            this.isResponse = true;
            let projectDetails = this.apiResponse.projects[this.projectCode];
			this.projects = projectDetails;
                      
            this.isAbstract = projectDetails.hasOwnProperty('project_abstract') ? true : false;
            this.isCountry = projectDetails.hasOwnProperty('countryhomepageurl') ? true : false;
            this.isRegion = projectDetails.hasOwnProperty('regionhomepageurl') ? true : false; 
			this.isDevObj = projectDetails.hasOwnProperty('pdo') ? true : false;			
            this.abstractLabel = this.allLocales[this.locale].abstract;
            this.keyDetailsLabel = this.allLocales[this.locale].keyDetails;
            this.projectDetailsLabel = this.allLocales[this.locale].projectDetails;
            this.projectIdLabel = this.allLocales[this.locale].projectId;
            this.countryNameLabel = this.allLocales[this.locale].country;
            this.regionNameLabel = this.allLocales[this.locale].region;
            this.statusLabel = this.allLocales[this.locale].status;
            this.approvalDateLabel = this.allLocales[this.locale].approvalDate;
            this.closingDateLabel = this.allLocales[this.locale].closingDate;
            this.teamLeadersLabel = this.allLocales[this.locale].teamLeader;
            this.totalProjectCostLabel = this.allLocales[this.locale].totalProjectCost;
            this.commitmentAmountLabel = this.allLocales[this.locale].commitmentAmount;
            this.borrowerLabel = this.allLocales[this.locale].borrower;
            this.implementingAgencyLabel = this.allLocales[this.locale].implementingAgency;
            this.environmentalCategoryLabel = this.allLocales[this.locale].environmentalCategory;  
            this.boardPresentation = this.allLocales[this.locale].boardPresentation;  
			this.devObjHeader = this.allLocales[this.locale].devobjLabel;	
			this.lastupdateDateLabel = this.allLocales[this.locale].lastupdateDate;
			this.consultantServiceLabel = this.allLocales[this.locale].consultantService;
			this.approvalYearLabel = this.allLocales[this.locale].approvalYear;
            this.lastStageReachedLabel = this.allLocales[this.locale].lastStageReached; 
            this.parentProjectLabel = this.allLocales[this.locale].parentProject;  
            
            if (this.isAbstract) {
                this.isShowMoreOrLess = true;
                this.showMoreOrLessLabel = this.isShowMoreOrLess ? this.allLocales[this.locale].showMore : this.allLocales[this.locale].showLess;
                this.showMoreOrLessIcon = this.isShowMoreOrLess ? 'fa fa-plus' : 'fa fa-minus';
                this.abstractTotal = this.getValueOfObject(projectDetails.project_abstract);                 
                this.disclaimerText = this.allLocales[this.locale].disclaimers;                            
                this.abstract = this.limitText(this.abstractTotal);                
            }                    
            if (this.isCountry) 
                this.countryPath = projectDetails.countryhomepageurl;
            if (this.isRegion) 
                this.regionPath = projectDetails.regionhomepageurl;
            
            this.descriptions = this.allLocales[this.locale].descriptions;                
            this.projectId = projectDetails.id;               
            this.countryName = projectDetails.countryshortname;                
            this.regionName = projectDetails.regionname; 
            this.status = projectDetails.status;                                          
            this.approvalDate = projectDetails.hasOwnProperty('boardapprovaldate') ? this.getFormateDate(projectDetails.boardapprovaldate, this.locale) : 'N/A';
            this.closingDate = projectDetails.hasOwnProperty('closingdate') ? this.getFormateDate(projectDetails.closingdate, this.locale) : 'N/A';
			this.lastupdateDate = projectDetails.hasOwnProperty('proj_last_upd_date') ? this.getFormateDate(projectDetails.proj_last_upd_date, this.locale) : 'N/A';
            
            if (projectDetails.hasOwnProperty('teamleadname')) {                        
                let teamLeadDetails = projectDetails.teamleadname;                                                                                
                
                if (typeof teamLeadDetails === 'string') {
                    this.teamLeaders = teamLeadDetails;
                } else {
                    teamLeadDetails.forEach((element, index) => {
                        this.teamLeaders = this.teamLeaders == '' || this.teamLeaders == undefined ? element : this.teamLeaders + ', ' + element;   
                    });                        
                }
            } else {
                this.teamLeaders = '';
            }
            
            this.totalProjectCost =  projectDetails.hasOwnProperty('lendprojectcost') ? this.convertCurrency(projectDetails.lendprojectcost.replace(/,/g, ''), 2, this.locale) : this.convertCurrency(0, 2, this.locale);
            this.commitmentAmount = projectDetails.hasOwnProperty('totalamt') ? this.convertCurrency(projectDetails.totalamt.replace(/,/g, ''), 2, this.locale) : this.convertCurrency(0, 2, this.locale);
            this.borrower = projectDetails.hasOwnProperty('borrower') ? projectDetails.borrower : 'N/A';
            this.implementingAgency = projectDetails.hasOwnProperty('impagency') ? projectDetails.impagency : 'N/A';
            this.environmentalCategory = projectDetails.hasOwnProperty('envassesmentcategorycode') ? projectDetails.envassesmentcategorycode : 'N/A';
			this.consultantService = projectDetails.hasOwnProperty('cons_serv_reqd_ind') ? projectDetails.cons_serv_reqd_ind : 'N/A';
            this.approvalYear = projectDetails.hasOwnProperty('approvalfy') ? projectDetails.approvalfy : 'N/A';
            this.lastStageReached = projectDetails.hasOwnProperty('last_stage_reached_name') ? projectDetails.last_stage_reached_name : 'N/A';
            this.parentProject = projectDetails.hasOwnProperty('parentprojid') ? projectDetails.parentprojid : 'N/A';
            if(projectDetails.hasOwnProperty('parentprojid'))
            {
            var url = window.location.href;
            if(url.lastIndexOf("/") !== -1)
            url = url.substring(0,url.lastIndexOf("/"));
            this.projectLink = url;
            }
            
			 if(this.consultantService == 'Y')
				 this.consultantService = "Yes";
			 if(this.consultantService == 'N')
				 this.consultantService = "No";
			 if (this.isDevObj) {
				this.devobj = projectDetails.pdo;
			}
			
			if(projectDetails.hasOwnProperty('esf_flag') && projectDetails.hasOwnProperty('pidrecdbwind'))
			{
				var esfFlag = projectDetails.esf_flag;
				var pidrecdbwind = projectDetails.pidrecdbwind;
				if(esfFlag == 'Y' && pidrecdbwind == 'Y')
				{
					this.environmentalCategoryLabel = this.allLocales[this.locale].environmentalRisk; 
					this.environmentalCategory = projectDetails.hasOwnProperty('esrc_ovrl_risk_rate') ? projectDetails.esrc_ovrl_risk_rate : 'N/A';
				}
				
			}
		
        }     
    }

    onFootNotes(footNoteAnimation) {
        this.footNoteAnimation = footNoteAnimation;
    }

    getFormateDate(date, locale) {
        let m = moment.utc(date);
        let formatedDate = '';
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
         
        return formatedDate;
    }
    
    convertCurrency (currency, decimalPlaces, locale) {
        let amount = (Math.abs(Number(currency)) / 1.0e+6).toFixed(decimalPlaces);
        let formatedCurrency = '';
        if (locale === 'en') 
            formatedCurrency = 'US$ ' + amount + ' million';
        else if (locale === 'es')            
            formatedCurrency = 'US$ ' + amount + ' millones';
        else if (locale === 'fr')
            formatedCurrency = 'USD ' + amount + ' millions';
        else if (locale === 'pt')
            formatedCurrency = 'US$ ' + amount + ' milhões';
        else if (locale === 'ru')
            formatedCurrency = 'ДОЛЛ. США ' + amount + ' миллионов';
        else if (locale === 'ar')
            formatedCurrency = 'دولار أمريكي ' + amount + ' مليون';
        else if (locale === 'zh')
            formatedCurrency = amount + ' (百万美元)';

        return formatedCurrency;              
    }  
    
    getValueOfObject(value) {
        let type = '';		
		if (typeof value === 'string') {			
			type = value;
		} else {			
			for (let key in value) {								
				type = value[key];
			}
		}		
		return type;
    }

    onShowMoreOrLess(moreOrLess) {        
        this.isShowMoreOrLess = moreOrLess;        
        this.showMoreOrLessLabel = this.isShowMoreOrLess ? this.allLocales[this.locale].showMore : this.allLocales[this.locale].showLess;
        this.showMoreOrLessIcon = this.isShowMoreOrLess ? 'fa fa-plus' : 'fa fa-minus';        
        this.abstract = this.isShowMoreOrLess ? this.limitText(this.abstractTotal) : this.abstractTotal;        
    }

    limitText(value) {
        let strings = value.split(' ');
		strings = strings.filter(function(entry) { return entry.trim() != ''; });			

		let content = '';		
		for(let i=0; i < strings.length; i++) {			
			if (content.length < 450) {
				if (content == '') {
					content = strings[i];
				} else {
					content = content + ' ' + strings[i];
				}							
			} else {
                content = content.slice(-1) == ',' || content.slice(-1) == '.' ? content.slice(0, -1) + '...' : content + '...';				
				break;
			}		
		}		
		return content;
    }
}