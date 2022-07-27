sap.ui.define([
	"sap/ui/Device", 
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	'sap/m/IconTabBar',
	"sap/ui/core/routing/Router"

], function (Device, Filter, FilterOperator, JSONModel, BaseController, IconTabBar) {
	"use strict";

	

	return BaseController.extend("fiori.designer.controller.Master", {
		
		onInit : function () {
			BaseController.prototype.onInit.apply(this, arguments);  
			var oRouter = this.getRouter();
			oRouter.getRoute("CatalogsDetails").attachPatternMatched(this.changeTab("Catalogs"), this);
			oRouter.getRoute("GroupsDetails").attachPatternMatched(this.changeTab("Groups"), this);        
		},

		changeTab: function(sTabKey) {
		
			this.getView().byId("myTabContainer").setSelectedKey(`${sTabKey}`);
		},

		onTabSelected: function(oEvent) {
			var oItem = oEvent.getParameter("item");
			this.sTabKey = oItem.getProperty("key");
			// this.onUpdateFinished(this.sTabKey);

			this.getRouter().navTo(`${this.sTabKey}Details`) 
		},

		onPressAdd: function(){

		},

		
	});
})
