sap.ui.define([
    "./BaseController",
    'sap/ui/model/json/JSONModel',  
	'sap/ui/model/FilterOperator',
	'sap/ui/model/Filter',
    'sap/m/StandardListItem'
], function (BaseController,JSONModel,FilterOperator,Filter,StandardListItem) {
    "use strict";

    return BaseController.extend("fiori.roles.controller.Details", {

        _listConfigs:  [
            {
                id: 'idCatalogList',
                bindingPath: '/RoleCatalog',
                filterProperty: 'roleId',
                dispalyProprty: 'catalogId'
            },
            {
                id: 'idGroupList',
                bindingPath: '/RoleGroup',
                filterProperty: 'roleId',
                dispalyProprty: 'groupId'
            },
            {
                id: 'idUserList',
                bindingPath: '/RoleUser',
                filterProperty: 'roleId',
                dispalyProprty: 'userId'
            }
        ],

        onInit: function () {
            this.getRouter().getRoute('Details').attachPatternMatched(this._onRouteMatch, this);
        },

        _onRouteMatch: function(oEvent) {
            var oArguments = oEvent.getParameter('arguments');
            var oViewModel = new JSONModel({
                isEdit: false
            });

            this._listConfigs.forEach(function(config) {
                var oList = this.byId(config.id);

                oList.bindItems({
                    path: config.bindingPath,
                    filters: [
                        new Filter(config.filterProperty, FilterOperator.EQ, oArguments.path)
                    ],
                    template: new StandardListItem({
                        title: '{' + config.dispalyProprty + '}'
                    })
                });
            }.bind(this));

            this.getView().setModel(oViewModel, 'view');
            this.getView().bindElement("/Roles('" + oArguments.path + "')");
        },

        onEdit: function(oEvent) {
            this.getView().getModel('view').setProperty('/isEdit', true);
        },

        onSave: function(oEvent) {
            this.getView().getModel('view').setProperty('/isEdit', false);
        }
    });
});
