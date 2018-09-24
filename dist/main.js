(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<router-outlet> </router-outlet>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = /** @class */ (function () {
    function AppComponent(service, router) {
        var _this = this;
        this.service = service;
        this.router = router;
        this.title = 'app';
        this.router.events.subscribe(function (x) {
            if (x instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__["NavigationEnd"]) {
                window.scroll(0, 0);
                if (localStorage.getItem('adminId') === null) {
                    if (!((_this.router.url === '/login') || (_this.router.url === '/forgotPassword'))) {
                        _this.router.navigate(['/login']);
                    }
                }
                else {
                    if (_this.router.url === '/login') {
                        _this.router.navigate(['/dashboard']);
                    }
                }
            }
        });
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var mydatepicker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! mydatepicker */ "./node_modules/mydatepicker/index.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _pages_login_login_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/login/login.component */ "./src/app/pages/login/login.component.ts");
/* harmony import */ var _pages_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/forgot-password/forgot-password.component */ "./src/app/pages/forgot-password/forgot-password.component.ts");
/* harmony import */ var _app_routing__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app.routing */ "./src/app/app.routing.ts");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _pages_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pages/dashboard/dashboard.component */ "./src/app/pages/dashboard/dashboard.component.ts");
/* harmony import */ var ngx_pagination__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-pagination */ "./node_modules/ngx-pagination/dist/ngx-pagination.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _pages_user_details_user_details_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./pages/user-details/user-details.component */ "./src/app/pages/user-details/user-details.component.ts");
/* harmony import */ var _pages_edit_user_detail_edit_user_detail_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./pages/edit-user-detail/edit-user-detail.component */ "./src/app/pages/edit-user-detail/edit-user-detail.component.ts");
/* harmony import */ var _pages_business_business_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./pages/business/business.component */ "./src/app/pages/business/business.component.ts");
/* harmony import */ var _pages_edit_business_detail_edit_business_detail_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./pages/edit-business-detail/edit-business-detail.component */ "./src/app/pages/edit-business-detail/edit-business-detail.component.ts");
/* harmony import */ var ng2_ckeditor__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ng2-ckeditor */ "./node_modules/ng2-ckeditor/lib/ng2-ckeditor.js");
/* harmony import */ var ng2_ckeditor__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(ng2_ckeditor__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _pages_side_menu_side_menu_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./pages/side-menu/side-menu.component */ "./src/app/pages/side-menu/side-menu.component.ts");
/* harmony import */ var _pages_view_business_detail_view_business_detail_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./pages/view-business-detail/view-business-detail.component */ "./src/app/pages/view-business-detail/view-business-detail.component.ts");
/* harmony import */ var _pages_content_management_content_management_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./pages/content-management/content-management.component */ "./src/app/pages/content-management/content-management.component.ts");
/* harmony import */ var _pages_content_management_edit_content_management_edit_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./pages/content-management-edit/content-management-edit.component */ "./src/app/pages/content-management-edit/content-management-edit.component.ts");
/* harmony import */ var _pages_content_management_view_content_management_view_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./pages/content-management-view/content-management-view.component */ "./src/app/pages/content-management-view/content-management-view.component.ts");
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ngx-cookie-service */ "./node_modules/ngx-cookie-service/index.js");
/* harmony import */ var _pages_event_management_event_management_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./pages/event-management/event-management.component */ "./src/app/pages/event-management/event-management.component.ts");
/* harmony import */ var _pages_transaction_management_transaction_management_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./pages/transaction-management/transaction-management.component */ "./src/app/pages/transaction-management/transaction-management.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"],
                _pages_login_login_component__WEBPACK_IMPORTED_MODULE_7__["LoginComponent"],
                _pages_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_8__["ForgotPasswordComponent"],
                _pages_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_11__["DashboardComponent"],
                _pages_user_details_user_details_component__WEBPACK_IMPORTED_MODULE_15__["UserDetailsComponent"],
                _pages_edit_user_detail_edit_user_detail_component__WEBPACK_IMPORTED_MODULE_16__["EditUserDetailComponent"],
                _pages_business_business_component__WEBPACK_IMPORTED_MODULE_17__["BusinessComponent"],
                _pages_edit_business_detail_edit_business_detail_component__WEBPACK_IMPORTED_MODULE_18__["EditBusinessDetailComponent"],
                _pages_side_menu_side_menu_component__WEBPACK_IMPORTED_MODULE_20__["SideMenuComponent"],
                _pages_view_business_detail_view_business_detail_component__WEBPACK_IMPORTED_MODULE_21__["ViewBusinessDetailComponent"],
                _pages_content_management_content_management_component__WEBPACK_IMPORTED_MODULE_22__["ContentManagementComponent"],
                _pages_content_management_edit_content_management_edit_component__WEBPACK_IMPORTED_MODULE_23__["ContentManagementEditComponent"],
                _pages_content_management_view_content_management_view_component__WEBPACK_IMPORTED_MODULE_24__["ContentManagementViewComponent"],
                _pages_event_management_event_management_component__WEBPACK_IMPORTED_MODULE_26__["EventManagementComponent"],
                _pages_transaction_management_transaction_management_component__WEBPACK_IMPORTED_MODULE_27__["TransactionManagementComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                ngx_toastr__WEBPACK_IMPORTED_MODULE_13__["ToastrModule"].forRoot(),
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(_app_routing__WEBPACK_IMPORTED_MODULE_9__["routes"]),
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["BrowserAnimationsModule"],
                ngx_pagination__WEBPACK_IMPORTED_MODULE_12__["NgxPaginationModule"],
                mydatepicker__WEBPACK_IMPORTED_MODULE_5__["MyDatePickerModule"],
                ng2_ckeditor__WEBPACK_IMPORTED_MODULE_19__["CKEditorModule"]
            ],
            providers: [_providers_mainService__WEBPACK_IMPORTED_MODULE_10__["MainService"], ngx_cookie_service__WEBPACK_IMPORTED_MODULE_25__["CookieService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.routing.ts":
/*!********************************!*\
  !*** ./src/app/app.routing.ts ***!
  \********************************/
/*! exports provided: routes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony import */ var _pages_login_login_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/login/login.component */ "./src/app/pages/login/login.component.ts");
/* harmony import */ var _pages_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/forgot-password/forgot-password.component */ "./src/app/pages/forgot-password/forgot-password.component.ts");
/* harmony import */ var _pages_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/dashboard/dashboard.component */ "./src/app/pages/dashboard/dashboard.component.ts");
/* harmony import */ var _pages_user_details_user_details_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/user-details/user-details.component */ "./src/app/pages/user-details/user-details.component.ts");
/* harmony import */ var _pages_edit_user_detail_edit_user_detail_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/edit-user-detail/edit-user-detail.component */ "./src/app/pages/edit-user-detail/edit-user-detail.component.ts");
/* harmony import */ var _pages_business_business_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/business/business.component */ "./src/app/pages/business/business.component.ts");
/* harmony import */ var _pages_edit_business_detail_edit_business_detail_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/edit-business-detail/edit-business-detail.component */ "./src/app/pages/edit-business-detail/edit-business-detail.component.ts");
/* harmony import */ var _pages_view_business_detail_view_business_detail_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/view-business-detail/view-business-detail.component */ "./src/app/pages/view-business-detail/view-business-detail.component.ts");
/* harmony import */ var _pages_content_management_content_management_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/content-management/content-management.component */ "./src/app/pages/content-management/content-management.component.ts");
/* harmony import */ var _pages_content_management_edit_content_management_edit_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pages/content-management-edit/content-management-edit.component */ "./src/app/pages/content-management-edit/content-management-edit.component.ts");
/* harmony import */ var _pages_content_management_view_content_management_view_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pages/content-management-view/content-management-view.component */ "./src/app/pages/content-management-view/content-management-view.component.ts");
/* harmony import */ var _pages_event_management_event_management_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pages/event-management/event-management.component */ "./src/app/pages/event-management/event-management.component.ts");
/* harmony import */ var _pages_transaction_management_transaction_management_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pages/transaction-management/transaction-management.component */ "./src/app/pages/transaction-management/transaction-management.component.ts");













var routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        component: _pages_login_login_component__WEBPACK_IMPORTED_MODULE_0__["LoginComponent"]
    },
    {
        path: 'forgotPassword',
        component: _pages_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_1__["ForgotPasswordComponent"]
    },
    {
        path: 'dashboard',
        component: _pages_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_2__["DashboardComponent"]
    },
    {
        path: 'business-management',
        component: _pages_business_business_component__WEBPACK_IMPORTED_MODULE_5__["BusinessComponent"]
    },
    {
        path: 'userDetails',
        component: _pages_user_details_user_details_component__WEBPACK_IMPORTED_MODULE_3__["UserDetailsComponent"]
    },
    {
        path: 'editUserDetail',
        component: _pages_edit_user_detail_edit_user_detail_component__WEBPACK_IMPORTED_MODULE_4__["EditUserDetailComponent"]
    },
    {
        path: 'editBusinessDetail',
        component: _pages_edit_business_detail_edit_business_detail_component__WEBPACK_IMPORTED_MODULE_6__["EditBusinessDetailComponent"]
    },
    {
        path: 'businessDetails',
        component: _pages_view_business_detail_view_business_detail_component__WEBPACK_IMPORTED_MODULE_7__["ViewBusinessDetailComponent"]
    },
    {
        path: 'editBusinessDetail',
        component: _pages_edit_business_detail_edit_business_detail_component__WEBPACK_IMPORTED_MODULE_6__["EditBusinessDetailComponent"]
    },
    {
        path: 'content-management',
        component: _pages_content_management_content_management_component__WEBPACK_IMPORTED_MODULE_8__["ContentManagementComponent"]
    },
    {
        path: 'content-edit',
        component: _pages_content_management_edit_content_management_edit_component__WEBPACK_IMPORTED_MODULE_9__["ContentManagementEditComponent"]
    },
    {
        path: 'content-view',
        component: _pages_content_management_view_content_management_view_component__WEBPACK_IMPORTED_MODULE_10__["ContentManagementViewComponent"]
    },
    {
        path: 'event-management',
        component: _pages_event_management_event_management_component__WEBPACK_IMPORTED_MODULE_11__["EventManagementComponent"]
    },
    {
        path: 'transactions',
        component: _pages_transaction_management_transaction_management_component__WEBPACK_IMPORTED_MODULE_12__["TransactionManagementComponent"]
    }
];


/***/ }),

/***/ "./src/app/pages/business/business.component.css":
/*!*******************************************************!*\
  !*** ./src/app/pages/business/business.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/business/business.component.html":
/*!********************************************************!*\
  !*** ./src/app/pages/business/business.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mainbox main-modify\">\n    <app-side-menu></app-side-menu>\n    <div class=\"right-section\">\n        <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n        <div class=\"right-inner\">\n\n            <h1 class=\"heading\">BUSINESS MANAGEMENT</h1>\n            <div class=\"filter-block\">\n                <fieldset class=\"global-fieldset\">\n                    <legend>User Board</legend>\n                    <div class=\"filter-content\">\n                        <div class=\"row\">\n                            <div class=\"col-sm-6\">\n                                    <form [formGroup]=\"BusinessForm\" > \n                                <div class=\"form-group\">\n                                    <div class=\"pull-left\">\n                                        <div class=\"col-sm-6\">\n                                            <div class=\"form-group d-inline-block\">\n                                                <div class=\"show-entries mb0\">\n                                                    <select class=\"form-control\"  (change)='filter()' formControlName=\"sort\">\n                                                        <option value=''>STATUS</option>\n                                                        <option value='ACTIVE'>ACTIVE</option>\n                                                        <option value='BLOCK'>BLOCK</option>\n                                                    </select>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class=\"search-icon pull-right\" align=\"right\">\n                                        <input type=\"text\" (keyup)=\"filter()\" class=\"form-control max-wt-300 search-input\" placeholder=\"Search by name/email\" formControlName=\"search\">\n                                        <i class=\"fa fa-search\" aria-hidden=\"true\"></i>\n                                    </div>\n                                </div>\n                                </form>\n                            </div>\n                            <div class=\"col-sm-6\">\n                            </div>\n                        </div>\n\n                        <div class=\"box box-blue\">\n                            <div class=\"box-body\">\n                                <div class=\"custom-table table-responsive\">\n                                    <table class=\"table table-striped table-border\">\n                                        <thead>\n                                            <tr>\n                                                <th>SNo.</th>\n                                                <th>Full Name</th>\n                                                <th>Business Name</th>\n                                                <th>Email</th>\n                                                <th>Gender</th>\n                                                <th>Country</th>\n                                                <th>Action</th>\n                                                <th>Activate</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n\n                                            <tr *ngFor=\"let item of modified | paginate: { itemsPerPage: 10, currentPage: pageNo, totalItems: paginationData.total };index as i\">\n                                                <td>{{(i+1)+srNo}}</td>\n                                                <td>{{item.name}}</td>\n                                                <td>{{item.businessName}}</td>\n                                                <td>{{item.email}}</td>\n                                                <td>{{item.gender}}</td>\n                                                <td>{{item.country}}</td>\n                                                <td>\n                                                    <div class=\"action-btn\">\n                                                        <a class=\"btn btn-sm btn-success\" (click)=\"view(i)\">\n                                                            <i class=\"fa fa-eye\"></i> View</a>\n                                                        <a class=\"btn btn-sm btn-primary\" (click)=\"edit(i)\">\n                                                            <i class=\"fa fa-edit\"></i> Edit</a>\n                                                        <a class=\"btn btn-sm btn-danger\" (click)=\"userdel(i)\">\n                                                            <i class=\"fa fa-trash\"></i> Delete</a>\n                                                    </div>\n                                                </td>\n                                                <td>\n                                                        <label class=\"switch\">\n                                                                <input type=\"checkbox\" name=\"active\" (click)=\"userStatus(item)\" value='item.status' [(ngModel)]=\"item.status\">\n                                                                <span class=\"slider round\"></span>\n                                                            </label>\n                                                </td>\n                                            </tr>\n                                            <tr *ngIf=\"modified.length==0\">\n                                                <span>No record found</span>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                                </div>\n\n                            </div>\n                        </div>\n                    </div>\n                </fieldset>\n            </div>\n\n\n            <div *ngIf=\"paginationData.total >\n                paginationData.limit\">\n           <pagination-controls (pageChange)=\"changePage($event)\"></pagination-controls>\n\n           </div>\n        </div>\n    </div>\n</div>\n\n<div id=\"delete\" class=\"modal fade\" data-easein=\"bounceIn\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content common-detail-modal\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    ×\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                <p class=\"modal-inner-text\">\n                    Are you sure you want to delete user ?\n                </p>\n\n                <div class=\"button-box mt20\">\n                    <a class=\"btn btn-red mr10\" (click)=delete(i)>Yes</a>\n                    <a class=\"btn btn-danger\" data-dismiss=\"modal\">No</a>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/pages/business/business.component.ts":
/*!******************************************************!*\
  !*** ./src/app/pages/business/business.component.ts ***!
  \******************************************************/
/*! exports provided: BusinessComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BusinessComponent", function() { return BusinessComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/@angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/@angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var BusinessComponent = /** @class */ (function () {
    function BusinessComponent(router, service, fb) {
        this.router = router;
        this.service = service;
        this.fb = fb;
        this.pageNo = 1;
        this.collection = [];
        this.business = [];
        this.id = '';
        this.paginationData = {};
        this.modified = [];
        this.BusinessForm = this.fb.group({
            'search': [''],
            'sort': [''],
            'pageNumber': ['']
        });
        for (var i = 1; i <= 15; i++) {
            this.collection.push("item " + i);
        }
    }
    BusinessComponent.prototype.ngOnInit = function () {
        this.search();
    };
    BusinessComponent.prototype.changePage = function (page) {
        this.pageNo = page;
        this.search();
    };
    BusinessComponent.prototype.filter = function () {
        this.pageNo = 1;
        this.search();
    };
    BusinessComponent.prototype.view = function (l) {
        localStorage.setItem('_id of business', this.business[l]._id);
        this.router.navigate(['./businessDetails']);
    };
    BusinessComponent.prototype.edit = function (l) {
        localStorage.setItem('_id of business', this.business[l]._id);
        this.router.navigate(['./editBusinessDetail']);
    };
    BusinessComponent.prototype.userdel = function (l) {
        localStorage.setItem('_id of business', this.business[l]._id);
        $('#delete').modal('show');
    };
    BusinessComponent.prototype.delete = function (l) {
        var _this = this;
        var delData = { '_id': localStorage.getItem('_id of business'),
            "userType": "BUSINESS" };
        this.service.postApi("admin/deleteUser", delData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                localStorage.removeItem('_id of business');
                _this.search();
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
        $('#delete').modal('hide');
    };
    BusinessComponent.prototype.userStatus = function (item) {
        var _this = this;
        this.status = item.status;
        if (this.status == "ACTIVE" || "BLOCK") {
            var delData = { '_id': item._id };
            this.service.postApi("admin/blockUser", delData, 1).subscribe(function (response) {
                if (response['response_code'] == 200) {
                }
                else {
                    _this.modified = [];
                }
            }, function (error) {
                _this.service.toastErr('Something Went Wrong');
            });
        }
    };
    BusinessComponent.prototype.search = function () {
        var _this = this;
        var postData = {
            search: this.BusinessForm.controls['search'].value,
            status: this.BusinessForm.controls['sort'].value,
            userType: "BUSINESS",
            pageNumber: this.pageNo
        };
        for (var val in postData) {
            if (postData[val] == '') {
                delete postData[val];
            }
        }
        this.service.postApi("user/searchCustomerFilter", postData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.business = response['result'];
                _this.modified = _this.business;
                for (var i = 0; i < _this.business.length; i++) {
                    if (_this.business[i].status == 'ACTIVE') {
                        _this.modified[i].status = true;
                    }
                    else if (_this.business[i].status == 'BLOCK') {
                        _this.modified[i].status = false;
                    }
                }
                _this.paginationData = response['paginationData'];
                _this.srNo = (_this.pageNo - 1) * _this.paginationData.limit;
            }
            else {
                _this.paginationData = { total: 0, limit: 10 };
                _this.modified = [];
            }
        }, function (error) {
        });
        // }
    };
    BusinessComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-business',
            template: __webpack_require__(/*! ./business.component.html */ "./src/app/pages/business/business.component.html"),
            styles: [__webpack_require__(/*! ./business.component.css */ "./src/app/pages/business/business.component.css")]
        }),
        __metadata("design:paramtypes", [_node_modules_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _providers_mainService__WEBPACK_IMPORTED_MODULE_2__["MainService"], _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"]])
    ], BusinessComponent);
    return BusinessComponent;
}());



/***/ }),

/***/ "./src/app/pages/content-management-edit/content-management-edit.component.css":
/*!*************************************************************************************!*\
  !*** ./src/app/pages/content-management-edit/content-management-edit.component.css ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/content-management-edit/content-management-edit.component.html":
/*!**************************************************************************************!*\
  !*** ./src/app/pages/content-management-edit/content-management-edit.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mainbox main-modify\">\n  <app-side-menu></app-side-menu>\n  <div class=\"right-section\">\n    <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n    <div class=\"right-inner\">\n              <div class=\"filter-block\">\n                <form [formGroup]='editForm' >\n                <fieldset class=\"global-fieldset\" >\n                   <legend>{{controls}}</legend>\n                    <div class=\"filter-content\">\n                        \n                         <div class=\"common-detail-box\">\n                                <ckeditor formControlName='data'\n                                [(ngModel)]=\"mycontent\" #myckeditor [config]=\"ckeConfig\" debounce=\"500\" >\n                                </ckeditor>\n                            \n                            <div class=\"table-button text-center mt30\">\n                               <button class=\"btn btn-red\" (click)='save()'>Save </button>\n                               <button  class=\"btn btn-danger\" [routerLink]='([\"/content-management\"])' >Back</button>\n                            </div>\n                         </div>\n  \n                    </div>\n                </fieldset>\n              </form>\n              </div>        \n          </div>  \n        </div>\n  </div>\n  \n"

/***/ }),

/***/ "./src/app/pages/content-management-edit/content-management-edit.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/pages/content-management-edit/content-management-edit.component.ts ***!
  \************************************************************************************/
/*! exports provided: ContentManagementEditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentManagementEditComponent", function() { return ContentManagementEditComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/@angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/@angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ContentManagementEditComponent = /** @class */ (function () {
    function ContentManagementEditComponent(service, route, formBuilder) {
        this.service = service;
        this.route = route;
        this.formBuilder = formBuilder;
        this.editorValue = '';
        this.editForm = this.formBuilder.group({
            data: ['']
        });
    }
    ContentManagementEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.controls = localStorage.getItem('control');
        this.controls = localStorage.getItem('control-edit');
        this.service.getApi("static/getStaticContent", 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                if (_this.controls == 'About Us') {
                    _this.viewData = response['result'][0].aboutUs;
                }
                else if (_this.controls == 'Terms And Conditions') {
                    _this.viewData = response['result'][0].termsAndConditions;
                }
                else if (_this.controls == 'Privacy Policy') {
                    _this.viewData = response['result'][0].privacyPolicy;
                }
                _this.editForm.patchValue({
                    data: _this.viewData
                });
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    ContentManagementEditComponent.prototype.save = function () {
        var _this = this;
        var postData;
        if (localStorage.getItem('control-edit') == "Terms And Conditions") {
            postData = {
                "termsAndConditions": this.editForm.value.data,
            };
        }
        else if (localStorage.getItem('control-edit') == "Privacy Policy") {
            postData = {
                "privacyPolicy": this.editForm.value.data,
            };
        }
        else if (localStorage.getItem('control-edit') == "About Us") {
            postData = {
                "aboutUs": this.editForm.value.data,
            };
        }
        this.service.postApi('static/updateStatic', postData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.route.navigate(['/content-management']);
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    ContentManagementEditComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-content-management-edit',
            template: __webpack_require__(/*! ./content-management-edit.component.html */ "./src/app/pages/content-management-edit/content-management-edit.component.html"),
            styles: [__webpack_require__(/*! ./content-management-edit.component.css */ "./src/app/pages/content-management-edit/content-management-edit.component.css")]
        }),
        __metadata("design:paramtypes", [_providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"], _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"]])
    ], ContentManagementEditComponent);
    return ContentManagementEditComponent;
}());



/***/ }),

/***/ "./src/app/pages/content-management-view/content-management-view.component.css":
/*!*************************************************************************************!*\
  !*** ./src/app/pages/content-management-view/content-management-view.component.css ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/content-management-view/content-management-view.component.html":
/*!**************************************************************************************!*\
  !*** ./src/app/pages/content-management-view/content-management-view.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mainbox main-modify\">\n  <app-side-menu></app-side-menu>\n<div class=\"right-section\">\n  <div class=\"copyrights\">Copyright © 2018 App name All Rights Reserved.</div>\n  <div class=\"right-inner\">\n            <div class=\"filter-block\" style=\"font-family: -webkit-body;\">\n              <fieldset class=\"global-fieldset\">\n                 <legend>{{controls}}</legend>\n                  <div class=\"filter-content\">\n                      \n                       <div class=\"common-detail-box\">\n                         <div [innerHtml]=\"viewData\"></div>                                     \n                          <div class=\"table-button text-center mt30\">\n                             <button  class=\"btn btn-danger\" [routerLink]='([\"/content-management\"])' >Back</button>\n                          </div>\n                       </div>\n\n                  </div>\n              </fieldset>\n            </div>        \n        </div>  \n      </div>\n</div>\n\n\n\n\n\n"

/***/ }),

/***/ "./src/app/pages/content-management-view/content-management-view.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/pages/content-management-view/content-management-view.component.ts ***!
  \************************************************************************************/
/*! exports provided: ContentManagementViewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentManagementViewComponent", function() { return ContentManagementViewComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ContentManagementViewComponent = /** @class */ (function () {
    function ContentManagementViewComponent(service, sanitizer) {
        this.service = service;
        this.sanitizer = sanitizer;
    }
    ContentManagementViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.controls = localStorage.getItem('control');
        this.service.getApi("static/getStaticContent", 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                if (_this.controls == 'About Us') {
                    _this.viewData = response['result'][0].aboutUs;
                }
                else if (_this.controls == 'Terms And Conditions') {
                    _this.viewData = response['result'][0].termsAndConditions;
                }
                else if (_this.controls == 'Privacy Policy') {
                    _this.viewData = response['result'][0].privacyPolicy;
                }
                _this.viewData = _this.sanitizer.bypassSecurityTrustHtml(_this.viewData);
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    ContentManagementViewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-content-management-view',
            template: __webpack_require__(/*! ./content-management-view.component.html */ "./src/app/pages/content-management-view/content-management-view.component.html"),
            styles: [__webpack_require__(/*! ./content-management-view.component.css */ "./src/app/pages/content-management-view/content-management-view.component.css")]
        }),
        __metadata("design:paramtypes", [_providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"]])
    ], ContentManagementViewComponent);
    return ContentManagementViewComponent;
}());



/***/ }),

/***/ "./src/app/pages/content-management/content-management.component.css":
/*!***************************************************************************!*\
  !*** ./src/app/pages/content-management/content-management.component.css ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/content-management/content-management.component.html":
/*!****************************************************************************!*\
  !*** ./src/app/pages/content-management/content-management.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mainbox main-modify\">\n  <app-side-menu></app-side-menu>\n  <div class=\"right-section\">\n    <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n    <div class=\"right-inner\">\n\n      <h1 class=\"heading\">STATIC CONTENT MANAGEMENT</h1>\n\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n      <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\">\n      <br>\n      <form style=\"margin-left: 25%; margin-right: 25%\">\n          <div class=\"table-responsive\"> \n        <table ng-controller=\"employeeDataCtrl\" border=\"1\" class=\"table table-bordered\">\n\n          <thead>\n            <tr>\n              <th>S.No</th>\n              <th>Page Name</th>\n              <th>Action</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>01</td>\n              <td>About Us</td>\n              <td>\n                <a class=\"btn btn-sm btn-success\" (click)='view(\"About Us\")'>\n                  <i class=\"fa fa-eye\"></i> View</a>&nbsp; &nbsp;\n              <a class=\"btn btn-sm btn-primary\" (click)=\"edit('About Us')\">\n                  <i class=\"fa fa-edit\"></i> Edit</a>\n              </td>\n            </tr>\n            <tr>\n              <td>02</td>\n              <td>Terms And Conditions</td>\n              <td>\n                <a class=\"btn btn-sm btn-success\" (click)='view(\"Terms And Conditions\")'>\n                  <i class=\"fa fa-eye\"></i> View</a>&nbsp; &nbsp;\n              <a class=\"btn btn-sm btn-primary\" (click)=\"edit('Terms And Conditions')\">\n                  <i class=\"fa fa-edit\"></i> Edit</a>\n              </td>\n            </tr>\n            <tr>\n              <td>03</td>\n              <td>Privacy Policy</td>\n              <td>\n                <a class=\"btn btn-sm btn-success\" (click)='view(\"Privacy Policy\")'>\n                  <i class=\"fa fa-eye\"></i> View</a>&nbsp; &nbsp;\n              <a class=\"btn btn-sm btn-primary\" (click)=\"edit('Privacy Policy')\">\n                  <i class=\"fa fa-edit\"></i> Edit</a>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n       </div>\n\n\n\n      </form>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/pages/content-management/content-management.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/pages/content-management/content-management.component.ts ***!
  \**************************************************************************/
/*! exports provided: ContentManagementComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentManagementComponent", function() { return ContentManagementComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/@angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ContentManagementComponent = /** @class */ (function () {
    function ContentManagementComponent(route) {
        this.route = route;
    }
    ContentManagementComponent.prototype.ngOnInit = function () {
    };
    ContentManagementComponent.prototype.view = function (v) {
        localStorage.setItem('control', v);
        this.route.navigate(['/content-view']);
    };
    ContentManagementComponent.prototype.edit = function (e) {
        localStorage.setItem('control-edit', e);
        this.route.navigate(['/content-edit']);
    };
    ContentManagementComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-content-management',
            template: __webpack_require__(/*! ./content-management.component.html */ "./src/app/pages/content-management/content-management.component.html"),
            styles: [__webpack_require__(/*! ./content-management.component.css */ "./src/app/pages/content-management/content-management.component.css")]
        }),
        __metadata("design:paramtypes", [_node_modules_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], ContentManagementComponent);
    return ContentManagementComponent;
}());



/***/ }),

/***/ "./src/app/pages/dashboard/dashboard.component.css":
/*!*********************************************************!*\
  !*** ./src/app/pages/dashboard/dashboard.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* \n$height : 40px;\n$width: 70px;\n.switch {\n  position: relative;\n  display: inline-block;\n  width: $width;\n  height: $height;\n  \n  input[type=\"checkbox\"]{\n    display:none;\n  }\n  input:checked + .knob {\n    animation: colorChange 0.4s linear forwards;\n   \n  }\n  input:checked + .knob:before {\n    animation: turnON 0.4s linear forwards;\n   \n  }\n  \n}\n\n@keyframes colorChange {\n  from { background-color: #ccc;}\n  50%{ background-color: #A4D9AD;}\n  to {background-color: #4BD663;}\n}\n@keyframes turnON {\n  from { transform: translateX(0px);  }\n  to {  transform: translateX($width - ($height*0.99) );  box-shadow: -10px 0px 44px 0px #434343;}\n}\n\n.knob{\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  border-radius: $height;  \n}\n\n.knob:before {\n  position:absolute;\n  background-color: white;\n  content:\"\";\n  left: $height*0.10;\n  top: $height*0.10;\n  width: ($height*0.80);\n  height: ($height*0.80);\n  border-radius: 50%;\n} */"

/***/ }),

/***/ "./src/app/pages/dashboard/dashboard.component.html":
/*!**********************************************************!*\
  !*** ./src/app/pages/dashboard/dashboard.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mainbox main-modify\">\n    <app-side-menu></app-side-menu>\n    <div class=\"right-section\">\n        <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n        <div class=\"right-inner\">\n\n            <h1 class=\"heading\">USER MANAGEMENT</h1>\n            <div class=\"filter-block\">\n                <fieldset class=\"global-fieldset\">\n                    <legend>User Board</legend>\n                    <div class=\"filter-content\">\n                        <div class=\"row\">\n                            <div class=\"col-sm-6\">\n                                <form [formGroup]=\"dashboardForm\" > \n                                    <div class=\"form-group\">\n                                        <div class=\"pull-left\">\n                                            <div class=\"col-sm-6\">\n                                                <div class=\"form-group d-inline-block\">\n                                                    <div class=\"show-entries mb0\">\n                                                        <select class=\"form-control\"  (change)='filter()' formControlName=\"sort\">\n                                                            <option value=''>STATUS</option>\n                                                            <option value='ACTIVE'>ACTIVE</option>\n                                                            <option value='BLOCK'>BLOCK</option>\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                        </div>\n                                        <div class=\"search-icon pull-right\" align=\"right\">\n                                            <input type=\"text\" (keyup)=\"filter()\" class=\"form-control max-wt-300 search-input\" placeholder=\"Search by name/email\" formControlName=\"search\">\n                                            <i class=\"fa fa-search\" aria-hidden=\"true\"></i>\n                                        </div>\n                                    </div>\n                                </form>\n                            </div>\n                            <div class=\"col-sm-6\">\n                            </div>\n                        </div>\n\n                        <div class=\"box box-blue\">\n                            <div class=\"box-body\">\n                                <div class=\"custom-table table-responsive\">\n                                    <table class=\"table table-striped table-border\">\n                                        <thead>\n                                            <tr>\n                                                <th>SNo.</th>\n                                                <th>Name</th>\n                                                <th>Email</th>\n                                                <th>MobileNo.</th>\n                                                <th>Address</th>\n                                                <th>Action</th>\n                                                <th>&nbsp;&nbsp;&nbsp;&nbsp;Activate</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n\n        <tr *ngFor=\"let item of modified | paginate: { itemsPerPage: 10, currentPage: pageNo, totalItems: paginationData.total };index as i\">\n                                                <td>{{(i+1)+srNo}}</td>\n                                                <td>{{item.name}}</td>\n                                                <td>{{item.email}}</td>\n                                                <td>{{item.mobile_no}}</td>\n                                                <td>{{item.address}}</td>\n                                                <td>\n                                                    <div class=\"action-btn\">\n                                                        <a class=\"btn btn-sm btn-success\" (click)=\"view(i)\">\n                                                            <i class=\"fa fa-eye\"></i> View</a>\n                                                        <a class=\"btn btn-sm btn-primary\" (click)=\"edit(i)\">\n                                                            <i class=\"fa fa-edit\"></i> Edit</a>\n                                                        <a class=\"btn btn-sm btn-danger\" (click)=\"userdel(i)\">\n                                                            <i class=\"fa fa-trash\"></i> Delete</a>\n                                                    </div>\n                                                </td>\n                                                <td>\n                                                    <label class=\"switch\">\n                                                        <input type=\"checkbox\" name=\"active\" (click)=\"userStatus(item)\" value='item.status' [(ngModel)]=\"item.status\">\n                                                        <span class=\"slider round\"></span>\n                                                    </label>\n                                                </td>\n                                            </tr>\n                                            <tr *ngIf=\"modified.length==0\">\n                                                <span>No record found</span>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                                </div>\n\n                            </div>\n                        </div>\n                    </div>\n                </fieldset>\n            </div>\n\n\n                    <div *ngIf=\"paginationData.total >\n                         paginationData.limit\">\n                    <pagination-controls (pageChange)=\"changePage($event)\"></pagination-controls>\n       \n                    </div>\n\n        </div>\n    </div>\n</div>\n\n<div id=\"delete\" class=\"modal fade\" data-easein=\"bounceIn\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content common-detail-modal\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    ×\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                <p class=\"modal-inner-text\">\n                    Are you sure you want to delete user ?\n                </p>\n\n                <div class=\"button-box mt20\">\n                    <a class=\"btn btn-red mr10\" (click)=\"delete(i)\">Yes</a>\n                    <a class=\"btn btn-danger\" data-dismiss=\"modal\">No</a>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/pages/dashboard/dashboard.component.ts":
/*!********************************************************!*\
  !*** ./src/app/pages/dashboard/dashboard.component.ts ***!
  \********************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/@angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(router, service, fb) {
        this.router = router;
        this.service = service;
        this.fb = fb;
        this.pageNo = 1;
        this.collection = [];
        this.customer = [];
        this.id = '';
        this.paginationData = {};
        this.obj = {};
        this.modified = [];
        this.dashboardForm = this.fb.group({
            'search': [''],
            'sort': [''],
            'pageNumber': ['']
        });
        for (var i = 1; i <= 10; i++) {
            this.collection.push("item " + i);
        }
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.search();
    };
    DashboardComponent.prototype.view = function (l) {
        localStorage.setItem('_id of customer', this.customer[l]._id);
        this.router.navigate(['/userDetails']);
    };
    DashboardComponent.prototype.userStatus = function (item) {
        var _this = this;
        this.status = item.status;
        if (this.status == "ACTIVE" || "BLOCK") {
            var delData = { '_id': item._id };
            this.service.postApi("admin/blockUser", delData, 1).subscribe(function (response) {
                if (response['response_code'] == 200) {
                }
                else {
                    _this.service.toastErr(response['response_message']);
                }
            }, function (error) {
                _this.service.toastErr('Something Went Wrong');
            });
        }
    };
    DashboardComponent.prototype.edit = function (l) {
        localStorage.setItem('_id of customer', this.customer[l]._id);
        this.router.navigate(['./editUserDetail']);
    };
    DashboardComponent.prototype.userdel = function (l) {
        localStorage.setItem('_id of customer', this.customer[l]._id);
        $('#delete').modal('show');
    };
    DashboardComponent.prototype.delete = function (l) {
        var _this = this;
        var delData = { '_id': localStorage.getItem('_id of customer') };
        this.service.postApi("admin/deleteUser", delData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                localStorage.removeItem('_id of customer');
                _this.search();
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
        $('#delete').modal('hide');
    };
    DashboardComponent.prototype.search = function () {
        var _this = this;
        var postData = {
            search: this.dashboardForm.controls['search'].value,
            status: this.dashboardForm.controls['sort'].value,
            userType: "CUSTOMER",
            pageNumber: this.pageNo
        };
        for (var val in postData) {
            if (postData[val] == '') {
                delete postData[val];
            }
        }
        this.service.postApi("user/searchCustomerFilter", postData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.customer = response['result'];
                _this.modified = _this.customer;
                for (var i = 0; i < _this.customer.length; i++) {
                    if (_this.customer[i].status == 'ACTIVE') {
                        _this.modified[i].status = true;
                    }
                    else if (_this.customer[i].status == 'BLOCK') {
                        _this.modified[i].status = false;
                    }
                }
                _this.paginationData = response['paginationData'];
                _this.srNo = (_this.pageNo - 1) * _this.paginationData.limit;
            }
            else {
                _this.paginationData = { total: 0, limit: 10 };
                _this.modified = [];
            }
        }, function (error) {
        });
    };
    DashboardComponent.prototype.filter = function () {
        this.pageNo = 1;
        this.search();
    };
    DashboardComponent.prototype.changePage = function (page) {
        this.pageNo = page;
        this.search();
    };
    DashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/pages/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.css */ "./src/app/pages/dashboard/dashboard.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"], _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/pages/edit-business-detail/edit-business-detail.component.css":
/*!*******************************************************************************!*\
  !*** ./src/app/pages/edit-business-detail/edit-business-detail.component.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mt30{\n    margin-right: 85px;\n}\n"

/***/ }),

/***/ "./src/app/pages/edit-business-detail/edit-business-detail.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/pages/edit-business-detail/edit-business-detail.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n\n<div class=\"mainbox main-modify\">\n    <app-side-menu></app-side-menu>\n    <div class=\"right-section\">\n      <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n      <div class=\"right-inner\">\n                <div class=\"filter-block\">\n                  <fieldset class=\"global-fieldset\">\n                     <legend>Edit Business</legend>\n                      <div class=\"filter-content\">\n                          <form class=\"login_box_outer\" [formGroup]=\"editForm\">\n                           <div class=\"common-detail-box\">\n                            <div style=\"margin-left: 45%;margin-right: 25%; font-size:20%;\"><img [src]=\"imageUrl\" style=\"width: 200px;\" ></div>                            \n                            <br><br> \n                               <div class=\"textmanagment\">\n                              <div class=\"form-group row\">\n                                 <label class=\"col-sm-4 label-right label-top\">Name :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>\n                                 <div class=\"col-sm-8 label-left label-top\">  \n                                   <input type=\"text\" name=\"fname\" id=\"fname\" placeholder= \"Name\" class=\"form-control \" formControlName='name' maxlength=\"30\">\n                                    <div class=\"errMsg\" *ngIf=\"editForm.get('name').dirty && editForm.get('name').invalid\"> \n                                        <span style='color:red' [ngClass]=\"{error:editForm.get('name').hasError('required')}\" *ngIf=\"editForm.get('name').hasError('required')\">*Please enter name.</span>\n                                        <span style='color:red' [ngClass]=\"{error:editForm.get('name').hasError('pattern')}\" *ngIf=\"editForm.get('name').hasError('pattern')\">*Please enter valid name.</span>\n                                    </div>\n                                 </div>\n                              </div>\n\n                              <div class=\"form-group row\">\n                                  <label class=\"col-sm-4 label-right label-top\">Business Name :</label>\n                                  <div class=\"col-sm-8 label-left label-top\">  \n                                    <input type=\"text\" name=\"name\" id=\"name\" placeholder= \"Business Name\" class=\"form-control \" formControlName='bname' maxlength=\"30\">\n                                     <div class=\"errMsg\" *ngIf=\"editForm.get('bname').dirty && editForm.get('bname').invalid\"> \n                                        <span style='color:red' [ngClass]=\"{error:editForm.get('bname').hasError('required')}\" *ngIf=\"editForm.get('bname').hasError('required')\">*Please enter business name.</span>\n                                        <span style='color:red' [ngClass]=\"{error:editForm.get('bname').hasError('pattern')}\" *ngIf=\"editForm.get('bname').hasError('pattern')\">*Please enter valid business name.</span>\n                                    </div>\n                                  </div>\n                               </div>\n\n                              <div class=\"form-group row\">\n                                 <label class=\"col-sm-4 label-right label-top\">Email :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>\n                                 <div class=\"col-sm-8 label-left label-top\">\n                                    {{business?.email}}\n                                 </div>\n                              </div>\n                              \n                              <div class=\"form-group row\">\n                                <label class=\"col-sm-4 label-right label-top\">Gender :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>\n                                <div class=\"col-sm-8 label-left label-top\"> \n                                   <select  placeholder= \"gender\" class=\"form-control \" formControlName='gender'>\n                                       <option value=\"\">Select Gender</option>\n                                       <option  value=\"Male\" >Male</option>\n                                       <option  value=\"Female\" >Female</option>\n                                   </select>\n                                   <div class=\"errMsg\" *ngIf=\"editForm.get('gender').dirty && editForm.get('gender').invalid\"> \n                                </div>\n                                 \n                                </div>\n                             </div>\n                              <div class=\"form-group row\">\n                                 <label class=\"col-sm-4 label-right label-top\">Date of birth:&nbsp;&nbsp;&nbsp;&nbsp;</label>\n                                <div class=\"col-sm-8 label-left label-top\">  \n                                    <my-date-picker  placeholder= \"Date of birth ( YYYY - MM- DD )\" name=\"mydate\" id=\"DOB\"  [options]=\"myDatePickerOptions\"    formControlName='DOB' ></my-date-picker>\n                                  <div class=\"errMsg\" *ngIf=\"editForm.get('DOB').dirty && editForm.get('DOB').invalid\"> \n                                </div>\n                                 \n\n\n                                \n                                </div>\n                             </div>\n                             </div>\n                              <div class=\"table-button text-center mt30\">\n\n                                    <button  class=\"btn btn-red\" (click)='save()'  [disabled]='editForm.invalid' >Save </button>\n                                    <button  class=\"btn btn-danger\" (click)='cancel()' >Cancel</button>\n\n                                \n                              </div>\n                           </div>\n                           </form>\n  \n                      </div>\n                  </fieldset>\n                </div>        \n            </div>  \n          </div>\n       </div>\n  \n  \n  <div id=\"costumModal10\" class=\"modal fade\" data-easein=\"bounceIn\"  tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\" aria-hidden=\"true\">\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content common-detail-modal\">\n                    <div class=\"modal-header\">\n                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                            ×\n                        </button>\n                    </div>\n                    <div class=\"modal-body\">\n                        <p class=\"modal-inner-text\">\n                           Are you sure you want to delete this token ?\n                        </p>\n  \n                        <div class=\"button-box mt20\">\n                           <a class=\"btn btn-success mr10\" (click)=\"logout()\" data-dismiss=\"modal\">yes</a>\n                           <a class=\"btn btn-danger\" href=\"\">No</a>\n                        </div>\n                    </div>\n                    <div class=\"modal-footer\">\n                        \n                    </div>\n                </div>\n            </div>\n        </div>\n  "

/***/ }),

/***/ "./src/app/pages/edit-business-detail/edit-business-detail.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/pages/edit-business-detail/edit-business-detail.component.ts ***!
  \******************************************************************************/
/*! exports provided: EditBusinessDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditBusinessDetailComponent", function() { return EditBusinessDetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/@angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/@angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var EditBusinessDetailComponent = /** @class */ (function () {
    function EditBusinessDetailComponent(service, route, formBuilder) {
        this.service = service;
        this.route = route;
        this.formBuilder = formBuilder;
        this.Id = '';
        this.DOB = '';
        this.myDatePickerOptions = {
            dateFormat: 'yyyy-mm-dd',
            editableDateField: false,
            openSelectorOnInputClick: false,
            disableSince: { year: 0, month: 0, day: 0 }
        };
        this.editForm = formBuilder.group({
            name: ['', _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(/^[a-zA-Z ]{2,40}$/), _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(2)])],
            bname: ['', _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(/^[^\s][a-zA-Z\s]*$/)])],
            gender: [''],
            DOB: ['']
        });
        this.onDateChanged();
    }
    EditBusinessDetailComponent.prototype.ngOnInit = function () {
        this.Id = localStorage.getItem('_id of business');
        this.viewParticularbusiness();
    };
    //==========================================================VIEW PARTICULAR business API ====================================================================
    EditBusinessDetailComponent.prototype.viewParticularbusiness = function () {
        var _this = this;
        this.service.getApi("admin/viewDetail/" + this.Id, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.business = response["result"];
                _this.editForm.patchValue({
                    name: _this.business.name || '',
                    bname: _this.business.businessName || '',
                    gender: _this.business.gender || '',
                    DOB: _this.business.dateOfBirth || '',
                });
                _this.business = response["result"];
                if (response['result'].profilePic) {
                    _this.imageUrl = _this.business.profilePic;
                }
                else {
                    _this.imageUrl = 'assets/img/default_profile_image.png';
                }
                if (response['result'].dateOfBirth) {
                    _this.DOB = _this.business.dateOfBirth.formatted;
                }
                else {
                    _this.DOB = "";
                }
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    EditBusinessDetailComponent.prototype.save = function () {
        var _this = this;
        var postData = {
            "_id": this.Id,
            "userType": "BUSINESS",
            "name": this.editForm.get('name').value,
            "businessName": this.editForm.get('bname').value,
            "gender": this.editForm.get('gender').value,
            "dateOfBirth": this.editForm.get('DOB').value
        };
        this.service.postApi('admin/edit/', postData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                console.log("view particular user " + response);
                _this.route.navigate(['/business-management']);
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    EditBusinessDetailComponent.prototype.cancel = function () {
        this.route.navigate(['/business-management']);
    };
    EditBusinessDetailComponent.prototype.onDateChanged = function () {
        var d = new Date();
        var copy1 = this.getCopyOfOptions();
        copy1.disableSince = { year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate() };
        this.myDatePickerOptions = copy1;
    };
    EditBusinessDetailComponent.prototype.getCopyOfOptions = function () {
        return JSON.parse(JSON.stringify(this.myDatePickerOptions));
    };
    EditBusinessDetailComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-edit-business-detail',
            template: __webpack_require__(/*! ./edit-business-detail.component.html */ "./src/app/pages/edit-business-detail/edit-business-detail.component.html"),
            styles: [__webpack_require__(/*! ./edit-business-detail.component.css */ "./src/app/pages/edit-business-detail/edit-business-detail.component.css")]
        }),
        __metadata("design:paramtypes", [_providers_mainService__WEBPACK_IMPORTED_MODULE_2__["MainService"], _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], EditBusinessDetailComponent);
    return EditBusinessDetailComponent;
}());



/***/ }),

/***/ "./src/app/pages/edit-user-detail/edit-user-detail.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/pages/edit-user-detail/edit-user-detail.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#append_wrapper>.row:first-child {display:none;}"

/***/ }),

/***/ "./src/app/pages/edit-user-detail/edit-user-detail.component.html":
/*!************************************************************************!*\
  !*** ./src/app/pages/edit-user-detail/edit-user-detail.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n\n<div class=\"mainbox main-modify\">\n    <app-side-menu></app-side-menu>\n  <div class=\"right-section\">\n    <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n    <div class=\"right-inner\">\n              <div class=\"filter-block\">\n                <fieldset class=\"global-fieldset\">\n                   <legend>User board</legend>\n                    <div class=\"filter-content\">\n                        <form class=\"login_box_outer\" [formGroup]=\"editForm\">\n                         <div class=\"common-detail-box\">\n                      \n                            <div style=\"margin-left: 45%;margin-right: 25%; font-size:20%;\"><img [src]=\"imageUrl\" style=\"width: 250px\" /></div>                            \n                            <br>                         \n                            <div class=\"form-group row\">\n                               <label class=\"col-sm-4 label-right label-top\">Name :</label>\n                               <div class=\"col-sm-8 label-left label-top\">  \n                                 <input type=\"text\" name=\"fname\" id=\"fname\" placeholder= \"Name\" class=\"form-control \" formControlName='name' maxlength=\"30\">\n                                 <div class=\"errMsg\" *ngIf=\"editForm.get('name').dirty && editForm.get('name').invalid\"> \n                                    <span style='color:red' [ngClass]=\"{error:editForm.get('name').hasError('required')}\" *ngIf=\"editForm.get('name').hasError('required')\">*Please enter name.</span>\n                                    <span style='color:red' [ngClass]=\"{error:editForm.get('name').hasError('pattern')}\" *ngIf=\"editForm.get('name').hasError('pattern')\">*Please enter valid name.</span>\n                                </div>\n                             </div>\n                          </div>\n                            <div class=\"form-group row\">\n                               <label class=\"col-sm-4 label-right label-top\">Email :</label>\n                               <div class=\"col-sm-8 label-left label-top\">\n                                  {{customer?.email}}\n                               </div>\n                            </div>\n                            \n                            <div class=\"form-group row\">\n                              <label class=\"col-sm-4 label-right label-top\">Address :</label>\n                              <div class=\"col-sm-8 label-left label-top\"> \n                                 <input type=\"text\" name=\"address\" id=\"address\" placeholder= \"Address\" class=\"form-control \" formControlName='address' maxlength=\"100\">\n                                 <div class=\"errMsg\" *ngIf=\"editForm.get('address').dirty && editForm.get('address').invalid\"> \n                                        <span style='color:red' [ngClass]=\"{error:editForm.get('name').hasError('required')}\" *ngIf=\"editForm.get('name').hasError('required')\">*Address required*</span>\n\n                                    <span style='color:red' [ngClass]=\"{error:editForm.get('address').hasError('required')}\" *ngIf=\"editForm.get('address').hasError('required')\">*Please provide address.</span>\n                                </div>\n                             </div>\n                          </div>\n                            <div class=\"form-group row\">\n                               <label class=\"col-sm-4 label-right label-top\">Phone No:</label>\n                              <div class=\"col-sm-8 label-left label-top\">  \n                                <input type=\"text\" placeholder= \"Phone_no\" name=\"phone_no\" id=\"phone_no\"  class=\"form-control \" formControlName='phone'  maxlength=\"14\">\n                                <div class=\"errMsg\" *ngIf=\"editForm.get('phone').dirty && editForm.get('phone').invalid\"> \n                                        <span style='color:red' [ngClass]=\"{error:editForm.get('phone').hasError('pattern')}\" *ngIf=\"editForm.get('phone').hasError('pattern')\">*Please provide valid phone number.</span>\n                                    </div>\n                               \n                              </div>\n                           </div>\n                            <div class=\"table-button text-center mt30\">\n                               <button  class=\"btn btn-red\" (click)='save()' [disabled]='editForm.invalid'  >Save </button>\n                               <button  class=\"btn btn-danger\" (click)='cancel()' >Cancel</button>\n                            </div>\n                         </div>\n                         </form>\n\n                    </div>\n                </fieldset>\n              </div>        \n          </div>  \n        </div>\n     </div>\n\n\n<div id=\"costumModal10\" class=\"modal fade\" data-easein=\"bounceIn\"  tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\" aria-hidden=\"true\">\n          <div class=\"modal-dialog\">\n              <div class=\"modal-content common-detail-modal\">\n                  <div class=\"modal-header\">\n                      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                          ×\n                      </button>\n                  </div>\n                  <div class=\"modal-body\">\n                      <p class=\"modal-inner-text\">\n                         Are you sure you want to delete this token ?\n                      </p>\n\n                      <div class=\"button-box mt20\">\n                         <a class=\"btn btn-success mr10\" (click)=\"logout()\" data-dismiss=\"modal\">yes</a>\n                         <a class=\"btn btn-danger\" href=\"\">No</a>\n                      </div>\n                  </div>\n                  <div class=\"modal-footer\">\n                      \n                  </div>\n              </div>\n          </div>\n      </div>\n"

/***/ }),

/***/ "./src/app/pages/edit-user-detail/edit-user-detail.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/pages/edit-user-detail/edit-user-detail.component.ts ***!
  \**********************************************************************/
/*! exports provided: EditUserDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditUserDetailComponent", function() { return EditUserDetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/@angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/@angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var EditUserDetailComponent = /** @class */ (function () {
    function EditUserDetailComponent(service, route, formBuilder) {
        this.service = service;
        this.route = route;
        this.formBuilder = formBuilder;
        this.Id = '';
        this.editForm = formBuilder.group({
            name: ['', _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern(/^[a-zA-Z ]{2,40}$/), _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].minLength(2)])],
            address: ['', _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required])],
            phone: ['', _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].pattern(/^[1-9][0-9]{6,13}$/)])]
        });
    }
    EditUserDetailComponent.prototype.ngOnInit = function () {
        this.Id = localStorage.getItem('_id of customer');
        this.viewParticularCustomer();
    };
    //==========================================================VIEW PARTICULAR CUSTOMER API ====================================================================
    EditUserDetailComponent.prototype.viewParticularCustomer = function () {
        var _this = this;
        this.service.getApi("admin/viewDetail/" + this.Id, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.customer = response["result"];
                _this.editForm.patchValue({
                    name: _this.customer.name || '',
                    address: _this.customer.address || '',
                    phone: _this.customer.mobile_no || '',
                });
                if (response['result'].profilePic) {
                    _this.imageUrl = _this.customer.profilePic;
                }
                else {
                    _this.imageUrl = 'assets/img/default_profile_image.png';
                }
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    EditUserDetailComponent.prototype.save = function () {
        var _this = this;
        var postData = {
            "_id": this.Id,
            "userType": "CUSTOMER",
            "name": this.editForm.get('name').value,
            "mobile_no": this.editForm.get('phone').value,
            "address": this.editForm.get('address').value
        };
        this.service.postApi('admin/edit/', postData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.route.navigate(['/dashboard']);
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    EditUserDetailComponent.prototype.cancel = function () {
        this.route.navigate(['/dashboard']);
    };
    EditUserDetailComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-edit-user-detail',
            template: __webpack_require__(/*! ./edit-user-detail.component.html */ "./src/app/pages/edit-user-detail/edit-user-detail.component.html"),
            styles: [__webpack_require__(/*! ./edit-user-detail.component.css */ "./src/app/pages/edit-user-detail/edit-user-detail.component.css")]
        }),
        __metadata("design:paramtypes", [_providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"], _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"]])
    ], EditUserDetailComponent);
    return EditUserDetailComponent;
}());



/***/ }),

/***/ "./src/app/pages/event-management/event-management.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/pages/event-management/event-management.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/event-management/event-management.component.html":
/*!************************************************************************!*\
  !*** ./src/app/pages/event-management/event-management.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mainbox main-modify\">\n    <app-side-menu></app-side-menu>\n    <div class=\"right-section\">\n        <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n        <div class=\"right-inner\">\n\n            <h1 class=\"heading\">EVENT MANAGEMENT</h1>\n            <div class=\"filter-block\">\n                <fieldset class=\"global-fieldset\">\n                    <legend>User Board</legend>\n                    <div class=\"filter-content\">\n                        <div class=\"row\">\n                            <div class=\"col-sm-6\">\n                                <form [formGroup]=\"eventForm\">\n                                    <div class=\"form-group\">\n                                        <div class=\"search-icon pull-left\" align=\"left\">\n                                            <input type=\"text\" (keyup)=\"filter()\" class=\"form-control max-wt-300 search-input\" placeholder=\"Search by Event/Business\"\n                                                formControlName=\"search\">\n                                            <i class=\"fa fa-search\" aria-hidden=\"true\"></i>\n                                        </div>\n\n\n                                    </div>\n                                </form>\n                            </div>\n                            <div class=\"col-sm-6\">\n                      \n                            </div>\n                        </div>\n                        <br>\n\n                        <div class=\"box box-blue\">\n                            <div class=\"box-body\">\n                                <div class=\"custom-table table-responsive\">\n                                    <table class=\"table table-striped table-border\">\n                                        <thead>\n                                            <tr>\n                                                <th>SNo.</th>\n                                                <th>Event Name</th>\n                                                <th>Business Name</th>\n                                                <th>User Name</th>\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n                                            <tr *ngFor=\"let item of Event | paginate: { itemsPerPage: 10, currentPage: pageNo, totalItems: paginationData.total };index as i\">\n\n                                                <td>{{(i+1)+srNo}}</td>\n                                                <td>{{item.eventName}}</td>\n                                                <td>{{item.businessName}}</td>\n                                                <td>{{item.userId.name}}</td>\n\n                                            </tr>\n                                            <tr *ngIf=\"Event.length==0\">\n                                                <span>No record found</span>\n                                            </tr>\n                                        </tbody>\n                                    </table>\n                                   \n                                </div>\n\n                            </div>\n                        </div>\n                    </div>\n                </fieldset>\n            </div>\n\n            <div *ngIf=\"paginationData.total > paginationData.limit\">\n                <pagination-controls (pageChange)=\"changePage($event)\"></pagination-controls>\n            </div>\n            \n        </div>\n    </div>\n</div>\n\n<!-- Modal-blocked -->\n<div id=\"delete\" class=\"modal fade\" data-easein=\"bounceIn\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content common-detail-modal\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    ×\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                <p class=\"modal-inner-text\">\n                    Are you sure you want to delete user ?\n                </p>\n\n                <div class=\"button-box mt20\">\n                    <a class=\"btn btn-red mr10\">Yes</a>\n                    <a class=\"btn btn-danger\" data-dismiss=\"modal\">No</a>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/pages/event-management/event-management.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/pages/event-management/event-management.component.ts ***!
  \**********************************************************************/
/*! exports provided: EventManagementComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventManagementComponent", function() { return EventManagementComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/@angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EventManagementComponent = /** @class */ (function () {
    function EventManagementComponent(fb, service) {
        this.fb = fb;
        this.service = service;
        this.paginationData = {};
        this.Event = [];
        this.pageSize = {};
        this.pageNo = 1;
        this.eventForm = fb.group({
            'search': ['']
        });
    }
    EventManagementComponent.prototype.ngOnInit = function () {
        this.getAllEvent();
    };
    //****************************GET ALL Events *************************************** */
    EventManagementComponent.prototype.changePage = function (page) {
        this.pageNo = page;
        this.getAllEvent();
    };
    EventManagementComponent.prototype.filter = function () {
        this.pageNo = 1;
        this.getAllEvent();
    };
    EventManagementComponent.prototype.getAllEvent = function () {
        var _this = this;
        var postData = {
            search: this.eventForm.controls['search'].value,
            pageNumber: this.pageNo,
        };
        this.service.postApi("event/getAllEvents", postData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.Event = response["result"];
                _this.paginationData = response["paginationData"];
                _this.limit = response["paginationData"].limit;
                _this.srNo = (_this.pageNo - 1) * _this.paginationData.limit;
            }
            else {
                _this.Event = [];
                _this.paginationData = { total: 0, limit: 10 };
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    EventManagementComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-event-management',
            template: __webpack_require__(/*! ./event-management.component.html */ "./src/app/pages/event-management/event-management.component.html"),
            styles: [__webpack_require__(/*! ./event-management.component.css */ "./src/app/pages/event-management/event-management.component.css")]
        }),
        __metadata("design:paramtypes", [_node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _providers_mainService__WEBPACK_IMPORTED_MODULE_2__["MainService"]])
    ], EventManagementComponent);
    return EventManagementComponent;
}());



/***/ }),

/***/ "./src/app/pages/forgot-password/forgot-password.component.css":
/*!*********************************************************************!*\
  !*** ./src/app/pages/forgot-password/forgot-password.component.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/forgot-password/forgot-password.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/pages/forgot-password/forgot-password.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header class=\"beforelogin\">\n  <div class=\"logo\">\n    <a href=\"javascript:void(0)\">\n      <img src=\"../assets/img/logo-mobile.png\">\n    </a>\n  </div>\n</header>\n<div class=\"before-login-wrapper\">\n  <div class=\"inner-content clearfix\">\n    <div class=\"login-main-content\">\n      <div class=\"before-login-logo\">\n\n      </div>\n      <form class=\"login_box_outer\" [formGroup]=\"forgotForm\" (ngSubmit)=\"forgot(forgotForm.value)\">\n        <div class=\"login-content-box\">\n          <h2 class=\"heading\">Forgot Password</h2>\n          <div class=\"form-group\">\n            <label>Email Address\n              <span class=\"require\">*</span>\n            </label>\n            <input type=\"text\" class=\"form-control\" placeholder=\"Email\" [formControl]=\"forgotForm.controls['email']\" maxlength=\"50\">\n            <div class=\"error-block\" *ngIf=\"forgotForm.controls['email'].dirty && forgotForm.controls['email'].invalid\">\n              <span style='color:red' [ngClass]=\"{error:forgotForm.controls['email'].hasError('required')}\" *ngIf=\"forgotForm.controls['email'].hasError('required')\">*Please enter an email.</span>\n              <span style='color:red' [ngClass]=\"{error: forgotForm.controls['email'].hasError('pattern')}\" *ngIf=\"forgotForm.controls['email'].hasError('pattern')\">*Please enter valid email.</span>\n              <span style='color:red' [ngClass]=\"{error: forgotForm.controls['email'].hasError('maxlength') && forgotForm.controls['email'].dirty}\"\n                *ngIf=\"forgotForm.controls['email'].hasError('maxlength') && ! forgotForm.controls['email'].hasError('pattern')\">*Please enter valid email.</span>\n            </div>\n          </div>\n          <div></div>\n\n\n          <div class=\"table-button text-center mt20\">\n            <button class=\"btn btn-red\" [disabled]=\"forgotForm.invalid\">SEND </button>\n            <button class=\"btn btn-danger\" [routerLink]=\"['/login']\">BACK</button>\n          </div>\n\n        </div>\n\n      </form>\n    </div>\n  </div>\n</div>\n\n<div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>"

/***/ }),

/***/ "./src/app/pages/forgot-password/forgot-password.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/pages/forgot-password/forgot-password.component.ts ***!
  \********************************************************************/
/*! exports provided: ForgotPasswordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForgotPasswordComponent", function() { return ForgotPasswordComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ForgotPasswordComponent = /** @class */ (function () {
    function ForgotPasswordComponent(router, formBuilder, service) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.service = service;
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
        this.forgotForm = this.formBuilder.group({
            'email': ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(/^[A-Z0-9_]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,3})+$/i), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(50)])],
        });
        $(function () {
            $('#email,#pass').on('keypress', function (e) {
                if (e.which == 32)
                    return true;
            });
        });
    };
    ForgotPasswordComponent.prototype.forgot = function (val) {
        var _this = this;
        var forgotData = {
            'email': val.email
        };
        this.service.postApi('user/forgotPassword', forgotData, 0).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.service.showSuccess(response['response_message']);
                _this.router.navigate(['/login']);
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr(error);
        });
    };
    ForgotPasswordComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-forgot-password',
            template: __webpack_require__(/*! ./forgot-password.component.html */ "./src/app/pages/forgot-password/forgot-password.component.html"),
            styles: [__webpack_require__(/*! ./forgot-password.component.css */ "./src/app/pages/forgot-password/forgot-password.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"]])
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());



/***/ }),

/***/ "./src/app/pages/login/login.component.css":
/*!*************************************************!*\
  !*** ./src/app/pages/login/login.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#append_wrapper>.row:first-child {display:none;}\n"

/***/ }),

/***/ "./src/app/pages/login/login.component.html":
/*!**************************************************!*\
  !*** ./src/app/pages/login/login.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header class=\"beforelogin\">\n\n  <div class=\"left-header\">\n    <div class=\"logo\">\n      <a>\n        <img src=\"../assets/img/logo-mobile.png\">\n      </a>\n    </div>\n  </div>\n</header>\n<div class=\"before-login-wrapper\">\n  <div class=\"inner-content clearfix\">\n    <div class=\"login-main-content\">\n      <div class=\"before-login-logo\">\n\n      </div>\n      <form class=\"login_box_outer\" [formGroup]=\"loginForm\" (ngSubmit)=\"login(loginForm.value)\" novalidate>\n        <div class=\"login-content-box\">\n          <h2 class=\"heading\">Login</h2>\n              <div class=\"form-group\">\n                <label>Email Address\n                  <span class=\"require\">*</span>\n                </label>\n                <input type=\"text\" class=\"form-control\" placeholder=\"Email\"  [formControl]=\"loginForm.controls['email']\" maxlength=\"50\">\n                <div class=\"error-block\" *ngIf=\"loginForm.controls['email'].dirty && loginForm.controls['email'].invalid\">\n\n                  <span style='color:red' [ngClass]=\"{error:loginForm.controls['email'].hasError('required')}\" *ngIf=\"loginForm.controls['email'].hasError('required')\">*Please enter an email.</span>\n                  <span style='color:red' [ngClass]=\"{error: loginForm.controls['email'].hasError('pattern')}\" *ngIf=\"loginForm.controls['email'].hasError('pattern')\">*Please enter valid email.</span>\n                  <span style='color:red' [ngClass]=\"{error: loginForm.controls['email'].hasError('maxlength') && loginForm.controls['email'].dirty}\"\n                    *ngIf=\"loginForm.controls['email'].hasError('maxlength') && ! loginForm.controls['email'].hasError('pattern')\">*Please enter valid email.</span>\n\n\n                </div>\n              </div>\n\n          <div class=\"form-group\">\n            <label>Password <span class=\"require\">*</span></label>\n            <input type=\"password\" name=\"pass\" class=\"form-control\" placeholder=\"Password\"  [formControl]=\"loginForm.controls['pass']\"\n              maxlength=\"16\">\n            <div class=\"error-block\" *ngIf=\"loginForm.controls['pass'].dirty && loginForm.controls['pass'].invalid\">\n              <span style='color:red' [ngClass]=\"{error:loginForm.controls['pass'].hasError('required')}\" *ngIf=\"loginForm.controls['pass'].hasError('required')\">*Please enter Password.</span>\n              <span style='color:red' [ngClass]=\"{error:loginForm.controls['pass'].hasError('minlength')}\" *ngIf=\"loginForm.controls['pass'].hasError('minlength')\">*Password must be between 8 to 16 characters</span>\n                 <span  style='color:red' [ngClass]=\"{error:loginForm.controls['pass'].hasError('pattern')}\" *ngIf=\"loginForm.controls['pass'].hasError('pattern')\">*Please enter valid password.</span>\n            </div>\n          </div> \n\n          <div class=\"remeberme-block  clearfix \">\n            <div class=\"pull-left\">\n              <input type=\"checkbox\" id=\"remberMe\" value=\"remberMe\"  [formControl]=\"loginForm.controls['remberMe']\">\n              <label for=\"remberMe\">Remember me</label>\n            </div>\n            <div class=\"pull-right\">\n              <a class=\"forget-pass\" [routerLink]=\"['/forgotPassword']\">Forgot Password?</a>\n            </div>\n          </div>\n          <div class=\"button-box\" align=\"center\">\n            <button type=\"submit\" class=\"btn btn-red width100\"  [disabled]=\"loginForm.invalid\">LOGIN</button>\n         \n          </div>\n        </div>\n\n\n      </form>\n    </div>\n  </div>\n</div>\n\n<div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n"

/***/ }),

/***/ "./src/app/pages/login/login.component.ts":
/*!************************************************!*\
  !*** ./src/app/pages/login/login.component.ts ***!
  \************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-cookie-service */ "./node_modules/ngx-cookie-service/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LoginComponent = /** @class */ (function () {
    function LoginComponent(router, formBuilder, service, cookieService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.service = service;
        this.cookieService = cookieService;
        this.remberMe = [];
        this.responseData = {};
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.loginForm = this.formBuilder.group({
            'email': ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(/^[A-Z0-9_]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,3})+$/i), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(50)])],
            'pass': ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(16), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(8)])],
            'remberMe': [false]
        });
        $(function () {
            $('#email,#pass').on('keypress', function (e) {
                if (e.which == 32)
                    return true;
            });
        });
        this.loginForm.patchValue({
            email: this.cookieService.get('email'),
            pass: this.cookieService.get('password'),
            remberMe: this.cookieService.check('remberMe')
        });
    };
    LoginComponent.prototype.login = function (dataa) {
        var _this = this;
        var loginData = {
            "email": dataa.email,
            "password": dataa.pass,
            "userType": "SUPERADMIN"
        };
        this.service.postApi('user/login', loginData, 0).subscribe(function (response) {
            _this.responseData = response;
            if (response['response_code'] == 200) {
                _this.service.showSuccess(response['response_message']);
                localStorage.setItem('token', _this.responseData.token);
                localStorage.setItem('adminId', _this.responseData.result._id);
                _this.router.navigate(['/dashboard']);
                localStorage.token = response["token"];
                localStorage.adminId = response["result"]["_id"];
                if (_this.loginForm.controls['remberMe'].value == true) {
                    _this.cookieService.set('email', _this.loginForm.controls['email'].value);
                    _this.cookieService.set('password', _this.loginForm.controls['pass'].value);
                    _this.cookieService.set('remberMe', _this.loginForm.controls['remberMe'].value);
                }
                else {
                    _this.cookieService.delete('email');
                    _this.cookieService.delete('password');
                    _this.cookieService.delete('remberMe');
                }
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr("Something went wrong");
        });
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/pages/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/pages/login/login.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"], ngx_cookie_service__WEBPACK_IMPORTED_MODULE_4__["CookieService"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/pages/side-menu/side-menu.component.css":
/*!*********************************************************!*\
  !*** ./src/app/pages/side-menu/side-menu.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/side-menu/side-menu.component.html":
/*!**********************************************************!*\
  !*** ./src/app/pages/side-menu/side-menu.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"headeres\">\n    <nav class=\"navbar navbar-default\">\n      <div class=\"navbar-headeres\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#profile-collapse\" aria-expanded=\"false\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        </button>\n      </div>\n    </nav>\t\n  </div>\n  <div class=\"left-section\">\n    <div class=\"menubox\">\n      <div class=\"mobmenu\">\n        <span></span>\n        <span></span>\n        <span></span>\n      </div>\n    </div>\n    <div class=\"left-headeres\">\n      <div class=\"logo\"><a><img src=\"../assets/img/logo-mobile.png\"></a></div>\n    </div>\n        <div class=\"user-panel\">\n  \n            <span class=\"view-inline user_name\">Admin Panel</span>\n        </div>\n    <div class=\"left-menu\">\n      <ul class=\"nav\">\n        <li><a [ngClass]=\"{'active': isActive == 'dashboard'}\" (click)=\"tabManag('dashboard')\"><i class=\"fa fa-users\"></i>USER MANAGEMENT</a></li>\n        <li><a [ngClass]=\"{'active': isActive == 'business-management'}\" (click)=\"tabManag('business-management')\"><i class=\"fa fa-angellist\"></i>BUSINESS MANAGEMENT</a></li>\n        <li><a [ngClass]=\"{'active': isActive == 'transactions'}\" (click)=\"tabManag('transactions')\"><i class=\"fa fa-product-hunt\"></i>TRANSACTIONS</a></li>\n        <li><a [ngClass]=\"{'active': isActive == 'event-management' }\" (click)=\"tabManag('event-management')\"><i class=\"fa fa-lastfm\"></i>EVENT MANAGEMENT</a></li>\n        <li><a [ngClass]=\"{'active': isActive == 'content-management' }\" (click)=\"tabManag('content-management')\"><i class=\"fa fa-lastfm\"></i>CONTENT MANAGEMENT</a></li>\n        <li><a [ngClass]=\"{'active': isActive == 'logout'}\" data-toggle=\"modal\" data-target=\"#logout\"  ><i class=\"fa fa-sign-out\"></i>LOGOUT</a></li>\n      </ul>\n    </div>\n  </div>\n  \n\n\n\n<div id=\"logout\" class=\"modal fade\" data-easein=\"bounceIn\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content common-detail-modal\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    ×\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                <p class=\"modal-inner-text\">\n                    Are you sure you want to logout ?\n                </p>\n\n                <div class=\"button-box mt20\">\n                    <a class=\"btn btn-red mr10\" (click)=\"logoutYes()\">yes</a>\n                    <a class=\"btn btn-danger\" data-dismiss=\"modal\">No</a>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n\n            </div>\n        </div>\n    </div>\n</div>\n\n\n\n\n\n\n"

/***/ }),

/***/ "./src/app/pages/side-menu/side-menu.component.ts":
/*!********************************************************!*\
  !*** ./src/app/pages/side-menu/side-menu.component.ts ***!
  \********************************************************/
/*! exports provided: SideMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SideMenuComponent", function() { return SideMenuComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SideMenuComponent = /** @class */ (function () {
    function SideMenuComponent(router) {
        this.router = router;
    }
    SideMenuComponent.prototype.ngOnInit = function () {
        this.isActive = event;
        var url = window.location.href.split('/');
        var page = url[url.length - 1];
        this.isActive = page;
    };
    SideMenuComponent.prototype.tabManag = function (event) {
        this.isActive = event;
        var url = window.location.href.split('/');
        var page = url[url.length - 1];
        this.isActive = page;
        this.router.navigate(['/' + event]);
    };
    SideMenuComponent.prototype.logoutYes = function () {
        localStorage.removeItem('adminId');
        localStorage.removeItem('token');
        localStorage.removeItem('_id of customer');
        localStorage.removeItem('_id of business');
        localStorage.removeItem('control-edit');
        localStorage.removeItem('control');
        this.router.navigate(['/login']);
        $('#logout').modal('hide');
    };
    SideMenuComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-side-menu',
            template: __webpack_require__(/*! ./side-menu.component.html */ "./src/app/pages/side-menu/side-menu.component.html"),
            styles: [__webpack_require__(/*! ./side-menu.component.css */ "./src/app/pages/side-menu/side-menu.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], SideMenuComponent);
    return SideMenuComponent;
}());



/***/ }),

/***/ "./src/app/pages/transaction-management/transaction-management.component.css":
/*!***********************************************************************************!*\
  !*** ./src/app/pages/transaction-management/transaction-management.component.css ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/transaction-management/transaction-management.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/pages/transaction-management/transaction-management.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mainbox main-modify\">\n    <app-side-menu></app-side-menu>\n    <div class=\"right-section\">\n        <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n        <div class=\"right-inner\">\n\n            <h1 class=\"heading\">TRANSACTION LISTS</h1>\n            <div class=\"filter-block\">\n                <fieldset class=\"global-fieldset\">\n                    <legend>Transaction Board</legend>\n                    <div class=\"filter-content\">\n                        <div class=\"row\">\n                            <div class=\"col-sm-6\">\n                                <form [formGroup]=\"transantionForm\">\n                                    <div class=\"form-group\">\n                                        <div class=\"search-icon pull-left\" align=\"left\">\n                                            <input type=\"text\" class=\"form-control max-wt-300 search-input\"  placeholder=\"Search by Event/Business/Customer\"\n                                                formControlName=\"search\" (keyup)='filter(1)'>\n                                            <i class=\"fa fa-search\" aria-hidden=\"true\"></i>\n                                        </div>\n                                        <div class=\"pull-left\">\n                                            <div class=\"col-sm-6\">\n                                                <div class=\"form-group d-inline-block\">\n                                                    <div class=\"show-entries mb0\">\n                                                                <select class=\"form-control\" formControlName=\"sort\" (change)='filter(2)' >\n\n                                                            <option value=''>STATUS</option>\n                                                            <option value='PENDING'>PENDING</option>\n                                                            <option value='CANCELLED'>CANCELLED</option>\n                                                            <option value='CONFIRMED'>CONFIRMED</option>\n                                                            <option value='COMPLETED'>COMPLETED</option>\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-sm-4 label-left label-top\">From:</label>\n                                           <div class=\"col-sm-4 label-right label-top\"></div>  \n                                               <my-date-picker  placeholder= \"YYYY - MM- DD \" name=\"from\" id=\"from\"  [options]=\"fromDate\"    formControlName='from' (dateChanged)=\"onFromDate($event)\"></my-date-picker>                                             \n                                           </div>\n\n                                           <div class=\"form-group row\">\n                                            <label class=\"col-sm-4 label-left label-top\">To:</label>\n                                           <div class=\"col-sm-4 label-right label-top\"></div>  \n                                               <my-date-picker [disabled]='beDisable' placeholder= \"YYYY - MM- DD \" name=\"to\" id=\"todate\"  [options]=\"toDate\"   formControlName='to' (dateChanged)=\"onToDate($event)\"></my-date-picker>                                           \n                                           </div>                                 \n                                    </div>\n                                    \n                                </form>\n                            </div>\n                            <div class=\"col-sm-6\">\n                           \n                            </div>\n                        </div>\n\n                        <div class=\"box box-blue\">\n                            <div class=\"box-body\">\n                                <div class=\"custom-table table-responsive\">\n                                    <table class=\"table table-striped table-border\">\n                                        <thead>\n                                            <tr>\n                                                <th>SNo.</th>\n                                                <th>Event Name</th>\n                                                <th>Business Name</th>\n                                                <th>Customer Name</th>\n                                                <th>Transaction Date</th>\n                                                <th>Transaction time</th>\n                                                <th>status</th>\n                                                <th>Amount(USD)</th>\n\n                                            </tr>\n                                        </thead>\n                                        <tbody>\n\n                                            <tr *ngFor=\"let item of Transaction | paginate: { itemsPerPage: 10, currentPage: pageNo, totalItems: paginationData.total };index as i\">\n                                                <td>{{(i+1)+srNo}}</td>\n                                                <td>{{item.eventName}}</td>\n                                                <td>{{item.businessName}}</td>\n                                                <td>{{item.userId.name}}</td>\n                                                <td>{{item.transactionDate}}</td>\n                                                <td>{{item.transactionTime}}</td>\n                                                <td>{{item.bookingStatus}}</td>\n                                                <td>{{item.eventPrice}}</td>\n                                            </tr>\n                                            <tr *ngIf=\"Transaction.length==0\">\n                                                    <span>No record found</span>\n                                                </tr>\n                                        </tbody>\n                                    </table>\n                                </div>\n\n                            </div>\n                        </div>\n                    </div>\n                </fieldset>\n            </div>\n            \n            <div *ngIf=\"paginationData.total > paginationData.limit\">\n                <pagination-controls (pageChange)=\"changePage($event)\"></pagination-controls>\n            </div>\n            \n\n        </div>\n    </div>\n</div>\n\n\n<div id=\"delete\" class=\"modal fade\" data-easein=\"bounceIn\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content common-detail-modal\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    ×\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                <p class=\"modal-inner-text\">\n                    Are you sure you want to delete user ?\n                </p>\n\n                <div class=\"button-box mt20\">\n                    <a class=\"btn btn-red mr10\">Yes</a>\n                    <a class=\"btn btn-danger\" data-dismiss=\"modal\">No</a>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/pages/transaction-management/transaction-management.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/pages/transaction-management/transaction-management.component.ts ***!
  \**********************************************************************************/
/*! exports provided: TransactionManagementComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransactionManagementComponent", function() { return TransactionManagementComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/@angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TransactionManagementComponent = /** @class */ (function () {
    function TransactionManagementComponent(fb, service) {
        this.fb = fb;
        this.service = service;
        this.paginationData = {};
        this.modified = [];
        this.Transaction = [];
        this.pageSize = {};
        this.pageNo = 1;
        this.beDisable = true;
        this.fromDate = {
            dateFormat: 'yyyy-mm-dd',
            editableDateField: false,
            openSelectorOnInputClick: false,
            disableUntil: { year: 0, month: 0, day: 0 }
        };
        this.toDate = {
            dateFormat: 'yyyy-mm-dd',
            editableDateField: false,
            openSelectorOnInputClick: false,
            disableUntil: { year: 0, month: 0, day: 0 }
        };
        this.transantionForm = fb.group({
            'search': [''],
            'from': [null],
            'to': [null],
            'sort': [''],
        });
    }
    TransactionManagementComponent.prototype.ngOnInit = function () {
        this.getAllTransaction();
    };
    //**************************** GET ALL transaction *************************************** */
    TransactionManagementComponent.prototype.changePage = function (page) {
        this.pageNo = page;
        this.getAllTransaction();
    };
    TransactionManagementComponent.prototype.filter = function (num) {
        var _this = this;
        this.pageNo = 1;
        setTimeout(function () {
            _this.getAllTransaction();
        }, 300);
    };
    TransactionManagementComponent.prototype.getAllTransaction = function () {
        var _this = this;
        if (!(this.transantionForm.value.from && this.transantionForm.value.to)) {
            this.beDisable = true;
            this.transantionForm.patchValue({
                'to': null,
                'from': null
            });
        }
        var postData = {
            search: this.transantionForm.controls['search'].value,
            bookingStatus: this.transantionForm.controls['sort'].value,
            fromDate: this.transantionForm.value.from ? this.transantionForm.value.from.formatted : '',
            toDate: this.transantionForm.value.to ? this.transantionForm.value.to.formatted : '',
            pageNumber: this.pageNo
        };
        this.service.postApi("event/transactionManagementFilter", postData, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.modified = response["result"];
                _this.Transaction = _this.modified;
                for (var i = 0; i < _this.modified.length; i++) {
                    if (_this.modified[i].bookingStatus == 'CANCELLED') {
                        _this.paginationData = response["paginationData"];
                        _this.srNo = (_this.pageNo - 1) * _this.paginationData.limit;
                    }
                    else if (_this.modified[i].bookingStatus == 'CONFIRMED') {
                        _this.paginationData = response["paginationData"];
                        _this.srNo = (_this.pageNo - 1) * _this.paginationData.limit;
                    }
                }
                _this.paginationData = response["paginationData"];
                _this.srNo = (_this.pageNo - 1) * _this.paginationData.limit;
            }
            else {
                _this.Transaction = [];
                _this.paginationData = { total: 0, limit: 10 };
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    TransactionManagementComponent.prototype.onFromDate = function (event) {
        if (event.formatted) {
            this.beDisable = false;
            var d = new Date(event.jsdate.getTime());
            d.setDate(d.getDate() - 1);
            var copy = this.getCopyOfToDateOpt();
            copy.disableUntil = { year: d.getFullYear(),
                month: d.getMonth() + 1,
                day: d.getDate()
            };
            this.toDate = copy;
        }
        else {
            this.beDisable = true;
            this.transantionForm.patchValue({
                'to': null,
                'from': null
            });
            this.getAllTransaction();
        }
    };
    TransactionManagementComponent.prototype.getCopyOfToDateOpt = function () {
        return JSON.parse(JSON.stringify(this.toDate));
    };
    TransactionManagementComponent.prototype.onToDate = function (event) {
        var _this = this;
        if (event.formatted) {
            setTimeout(function () {
                if (_this.transantionForm.controls['to'].value.formatted && _this.transantionForm.controls['from'].value.formatted) {
                    _this.filter(3);
                }
                else {
                    _this.transantionForm.patchValue({
                        'to': null
                    });
                }
            }, 300);
        }
    };
    TransactionManagementComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-transaction-management',
            template: __webpack_require__(/*! ./transaction-management.component.html */ "./src/app/pages/transaction-management/transaction-management.component.html"),
            styles: [__webpack_require__(/*! ./transaction-management.component.css */ "./src/app/pages/transaction-management/transaction-management.component.css")]
        }),
        __metadata("design:paramtypes", [_node_modules_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _providers_mainService__WEBPACK_IMPORTED_MODULE_2__["MainService"]])
    ], TransactionManagementComponent);
    return TransactionManagementComponent;
}());



/***/ }),

/***/ "./src/app/pages/user-details/user-details.component.css":
/*!***************************************************************!*\
  !*** ./src/app/pages/user-details/user-details.component.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#append_wrapper>.row:first-child {display:none;}\n.mt30{\n    margin-right: 85px;\n}"

/***/ }),

/***/ "./src/app/pages/user-details/user-details.component.html":
/*!****************************************************************!*\
  !*** ./src/app/pages/user-details/user-details.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<head>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\">\n</head>\n<div class=\"mainbox main-modify\">\n    <app-side-menu></app-side-menu>\n    <div class=\"right-section\">\n        <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n        <div class=\"right-inner\">\n            <div class=\"filter-block\">\n                <fieldset class=\"global-fieldset\">\n                    <legend>User board</legend>\n                    <div class=\"filter-content\">\n                        <div class=\"common-detail-box\">      \n                            <div style=\"margin-left: 15%;margin-right: 25%; font-size:20%;\"><img [src]=\"imageUrl\" style=\"width: 250px;\"/></div>                            \n                            <br>\n                            <div class=\"form-group row\">\n                                <label class=\"col-sm-4 label-right label-top\">Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>\n                                <div class=\"col-sm-8 label-left label-top\">{{customer?.name}}\n                                </div>\n                            </div>\n                            <div class=\"form-group row\">\n                                <label class=\"col-sm-4 label-right label-top\">Email: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>\n                                <div class=\"col-sm-8 label-left label-top\">\n                                    {{customer?.email}}\n                                </div>\n                            </div>\n                            <div class=\"form-group row\">\n                                <label class=\"col-sm-4 label-right label-top\">Address: &nbsp;&nbsp;&nbsp;</label>\n                                <div class=\"col-sm-8 label-left label-top\">\n                                    {{customer?.address}}\n                                </div>\n                            </div>\n                            <div class=\"form-group row\">\n                                <label class=\"col-sm-4 label-right label-top\">Phone No:</label>\n                                <div class=\"col-sm-8  label-left label-top\">\n                                    {{customer?.mobile_no}}\n                                </div>\n                            </div>\n                            <div class=\"table-button text-center mt10\" style=\"margin-left: -30%\">\n                                <a class=\"btn btn-red\" (click)=\"edit()\">Edit </a>\n                                <a class=\"btn btn-danger\" (click)=\"cancel()\">Cancel</a>\n                            </div>\n                        </div>\n\n                    </div>\n                </fieldset>\n            </div>\n        </div>\n    </div>\n</div>\n\n\n<!-- Modal-blocked -->\n<div id=\"costumModal10\" class=\"modal fade\" data-easein=\"bounceIn\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content common-detail-modal\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    ×\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                <p class=\"modal-inner-text\">\n                    Are you sure you want to delete this token ?\n                </p>\n\n                <div class=\"button-box mt20\">\n                    <a class=\"btn btn-success mr10\" (click)=\"logout()\" data-dismiss=\"modal\">yes</a>\n                    <a class=\"btn btn-danger\" href=\"\">No</a>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/pages/user-details/user-details.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/pages/user-details/user-details.component.ts ***!
  \**************************************************************/
/*! exports provided: UserDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserDetailsComponent", function() { return UserDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UserDetailsComponent = /** @class */ (function () {
    function UserDetailsComponent(service, route) {
        this.service = service;
        this.route = route;
        this.Id = '';
    }
    UserDetailsComponent.prototype.ngOnInit = function () {
        this.Id = localStorage.getItem('_id of customer');
        this.viewParticularCustomer();
    };
    //==========================================================VIEW PARTICULAR CUSTOMER API ====================================================================
    UserDetailsComponent.prototype.viewParticularCustomer = function () {
        var _this = this;
        this.service.getApi("admin/viewDetail/" + this.Id, 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.customer = response["result"];
                if (response['result'].profilePic) {
                    _this.imageUrl = _this.customer.profilePic;
                }
                else {
                    _this.imageUrl = 'assets/img/default_profile_image.png';
                }
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    UserDetailsComponent.prototype.edit = function () {
        this.route.navigate(['/editUserDetail']);
    };
    UserDetailsComponent.prototype.cancel = function () {
        this.route.navigate(['/dashboard']);
    };
    UserDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-user-details',
            template: __webpack_require__(/*! ./user-details.component.html */ "./src/app/pages/user-details/user-details.component.html"),
            styles: [__webpack_require__(/*! ./user-details.component.css */ "./src/app/pages/user-details/user-details.component.css")]
        }),
        __metadata("design:paramtypes", [_providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], UserDetailsComponent);
    return UserDetailsComponent;
}());



/***/ }),

/***/ "./src/app/pages/view-business-detail/view-business-detail.component.css":
/*!*******************************************************************************!*\
  !*** ./src/app/pages/view-business-detail/view-business-detail.component.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mt30{\n    margin-right: 85px;\n}"

/***/ }),

/***/ "./src/app/pages/view-business-detail/view-business-detail.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/pages/view-business-detail/view-business-detail.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div class=\"mainbox main-modify\">\n    <app-side-menu></app-side-menu>\n  <div class=\"right-section\">\n    <div class=\"copyrights\">Copyright © 2018 Aqua Ludus All Rights Reserved.</div>\n    <div class=\"right-inner\">\n              <div class=\"filter-block\">\n                <fieldset class=\"global-fieldset\">\n                   <legend>View Business</legend>\n                    <div class=\"filter-content\">\n                         <div class=\"common-detail-box\">\n                            <div style=\"margin-left: 25%;margin-right: 25%; font-size:20%;\"><img [src]=\"imageUrl\" width=\"200px\"/></div>                            \n                            <br><br> <br>\n                            <div class=\"form-group row\">\n                               <label class=\"col-sm-4 label-right label-top\">Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</label>\n                               <div class=\"col-sm-8 label-left label-top\">{{business?.name}}\n                               </div>\n                            </div>\n                            <div class=\"form-group row\">\n                                <label class=\"col-sm-4 label-right label-top\">Business Name:</label>\n                                <div class=\"col-sm-8 label-left label-top\">\n                                   {{business?.businessName}}\n                                </div>\n                             </div>\n                            <div class=\"form-group row\">\n                               <label class=\"col-sm-4 label-right label-top\">Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</label>\n                               <div class=\"col-sm-8 label-left label-top\">\n                                  {{business?.email}}\n                               </div>\n                            </div>\n                            <div class=\"form-group row\">\n                               <label class=\"col-sm-4 label-right label-top\">Gender&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</label>\n                               <div class=\"col-sm-8 label-left label-top\">\n                                {{business?.gender}}\n                               </div>\n                            </div>\n                            <div class=\"form-group row\">\n                               <label class=\"col-sm-4 label-right label-top\">Date of birth&nbsp;&nbsp;&nbsp;&nbsp;:</label>\n                               <div class=\"col-sm-8  label-left label-top\">\n                                  {{business?.dateOfBirth.formatted}}\n                               </div>\n                            </div>\n                            <div class=\"table-button text-center mt30\">\n                               <a class=\"btn btn-red\" (click)=\"edit()\">Edit </a>\n                               <a class=\"btn btn-danger\" (click)=\"cancel()\">Cancel</a>\n                            </div>\n                         </div>\n\n                    </div>\n                </fieldset>\n              </div>        \n          </div>  \n        </div>\n     </div>\n\n\n<div id=\"costumModal10\" class=\"modal fade\" data-easein=\"bounceIn\"  tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"costumModalLabel\" aria-hidden=\"true\">\n          <div class=\"modal-dialog\">\n              <div class=\"modal-content common-detail-modal\">\n                  <div class=\"modal-header\">\n                      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                          ×\n                      </button>\n                  </div>\n                  <div class=\"modal-body\">\n                      <p class=\"modal-inner-text\">\n                         Are you sure you want to delete this token ?\n                      </p>\n\n                      <div class=\"button-box mt20\">\n                         <a class=\"btn btn-success mr10\" (click)=\"logout()\" data-dismiss=\"modal\">yes</a>\n                         <a class=\"btn btn-danger\" href=\"\">No</a>\n                      </div>\n                  </div>\n                  <div class=\"modal-footer\">\n                      \n                  </div>\n              </div>\n          </div>\n      </div>\n"

/***/ }),

/***/ "./src/app/pages/view-business-detail/view-business-detail.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/pages/view-business-detail/view-business-detail.component.ts ***!
  \******************************************************************************/
/*! exports provided: ViewBusinessDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewBusinessDetailComponent", function() { return ViewBusinessDetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_mainService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../providers/mainService */ "./src/app/providers/mainService.ts");
/* harmony import */ var _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/@angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ViewBusinessDetailComponent = /** @class */ (function () {
    function ViewBusinessDetailComponent(service, route) {
        this.service = service;
        this.route = route;
        this.Id = '';
    }
    ViewBusinessDetailComponent.prototype.ngOnInit = function () {
        this.Id = localStorage.getItem('_id of business');
        this.viewParticularBusiness();
    };
    //==========================================================VIEW PARTICULAR CUSTOMER API ====================================================================
    ViewBusinessDetailComponent.prototype.viewParticularBusiness = function () {
        var _this = this;
        this.service.getApi("admin/viewDetail/" + localStorage.getItem('_id of business'), 1).subscribe(function (response) {
            if (response['response_code'] == 200) {
                _this.business = response["result"];
                if (response['result'].profilePic) {
                    _this.imageUrl = _this.business.profilePic;
                }
                else {
                    _this.imageUrl = 'assets/img/default_profile_image.png';
                }
            }
            else {
                _this.service.toastErr(response['response_message']);
            }
        }, function (error) {
            _this.service.toastErr('Something Went Wrong');
        });
    };
    ViewBusinessDetailComponent.prototype.edit = function () {
        this.route.navigate(['/editBusinessDetail']);
    };
    ViewBusinessDetailComponent.prototype.cancel = function () {
        this.route.navigate(['/business-management']);
    };
    ViewBusinessDetailComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-view-business-detail',
            template: __webpack_require__(/*! ./view-business-detail.component.html */ "./src/app/pages/view-business-detail/view-business-detail.component.html"),
            styles: [__webpack_require__(/*! ./view-business-detail.component.css */ "./src/app/pages/view-business-detail/view-business-detail.component.css")]
        }),
        __metadata("design:paramtypes", [_providers_mainService__WEBPACK_IMPORTED_MODULE_1__["MainService"], _node_modules_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ViewBusinessDetailComponent);
    return ViewBusinessDetailComponent;
}());



/***/ }),

/***/ "./src/app/providers/mainService.ts":
/*!******************************************!*\
  !*** ./src/app/providers/mainService.ts ***!
  \******************************************/
/*! exports provided: MainService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainService", function() { return MainService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MainService = /** @class */ (function () {
    function MainService(http, toastr) {
        this.http = http;
        this.toastr = toastr;
        // baseUrl =  'http://172.16.6.74:8000/api/v1/';
        //    >>>>staging URL>>
        //   baseUrl = 'http://162.222.32.20:1406/api/v1/';
        this.baseUrl = window.location.origin + '/api/v1/';
    }
    MainService.prototype.postApi = function (url, data, isHeader) {
        if (isHeader == 0) {
            var httpOptions;
            httpOptions = {
                headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
                    "Content-Type": "application/json",
                })
            };
            return this.http.post((this.baseUrl + url), data, httpOptions);
        }
        else if (isHeader == 1) {
            var httpOptions;
            httpOptions = {
                headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
                    "Content-Type": "application/json",
                    "token": localStorage.getItem("token"),
                    "_id": localStorage.getItem("adminId"),
                })
            };
            return this.http.post((this.baseUrl + url), data, httpOptions);
        }
    };
    MainService.prototype.getApi = function (url, isHeader) {
        if (isHeader == 0) {
            var httpOptions;
            httpOptions = {
                headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
                    "Content-Type": "application/json"
                })
            };
            return this.http.get((this.baseUrl + url), httpOptions);
        }
        else if (isHeader == 1) {
            var httpOptions;
            httpOptions = {
                headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
                    "Content-Type": "application/json",
                    "token": localStorage.getItem("token"),
                    "_id": localStorage.getItem("adminId"),
                })
            };
            return this.http.get((this.baseUrl + url), httpOptions);
        }
    };
    MainService.prototype.showSuccess = function (msg) {
        this.toastr.success(msg);
    };
    MainService.prototype.toastErr = function (msg) {
        this.toastr.error(msg);
    };
    MainService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"]])
    ], MainService);
    return MainService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/admin/Desktop/jet ski/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map