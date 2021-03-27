sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./Popover1", "./Dialog3", "./Popover2", "./Dialog2",
    "./utilities",
    "sap/ui/core/routing/History",
    'sap/ui/model/Sorter',
    'sap/ui/model/Filter',
    "../model/formatter",
    'sap/m/TablePersoController',
    './DemoPersoService',
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet'
], function (BaseController, MessageBox, Popover1, Dialog3, Popover2, Dialog2, Utilities, History, Sorter, Filter, formatter, TablePersoController, DemoPersoService, JSONModel, Export, ExportTypeCSV, exportLibrary, Spreadsheet) {
    "use strict";
    var dialogAcesso = "";
    var userName = "";
    var userAdm = "";
    var EdmType = exportLibrary.EdmType;
    return BaseController.extend("com.sap.build.standard.consolidado.controller.Page1", {
        formatter: formatter,
        handleRouteMatched: function (oEvent) {
            //    var sAppId = "App5f7b6d3bbe6e506fcc9b7eb8";

            //    var oParams = {};

            //    if (oEvent.mParameters.data.context) {
            //        this.sContext = oEvent.mParameters.data.context;

            //    } else {
            //        if (this.getOwnerComponent().getComponentData()) {
            //            var patternConvert = function (oParam) {
            //                if (Object.keys(oParam).length !== 0) {
            //                    for (var prop in oParam) {
            //                       if (prop !== "sourcePrototype" && prop.includes("Set")) {
            //                           return prop + "(" + oParam[prop][0] + ")";
            //                       }
            //                   }
            //               }
            //           };

            //           this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

            //       }
            //   }

            //   var oPath;

            //   if (this.sContext) {
            //       oPath = {
            //           path: "/" + this.sContext,
            //           parameters: oParams
            //       };
            //       this.getView().bindObject(oPath);
            //    }

            if (!this.DialogCadastroCnpj) {
                this.DialogCadastroCnpj = this.DialogCadastroCnpj = sap.ui.xmlfragment(
                    "DialogCadastroCnpj",
                    "com.sap.build.standard.consolidado.view.DialogCadastroCnpj",
                    this
                );
                //to get access to the global model
                this.getView().addDependent(this.DialogCadastroCnpj);
            }
            if (dialogAcesso == "") {
                dialogAcesso = "X";
                // abre o value help dialog filtrando pelo input value
                //this.DialogCadastroCnpj.open();
            }
        },
        _onTableItemPress: function (oEvent) {

            var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

            return new Promise(function (fnResolve) {
                this.doNavigate("Page2", oBindingContext, fnResolve, "");
            }.bind(this)).catch(function (err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },
        doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
            var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
            var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

            var sEntityNameSet;
            if (sPath !== null && sPath !== "") {
                if (sPath.substring(0, 1) === "/") {
                    sPath = sPath.substring(1);
                }
                sEntityNameSet = sPath.split("(")[0];
            }
            var sNavigationPropertyName;
            var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

            if (sEntityNameSet !== null) {
                sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
            }
            if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
                if (sNavigationPropertyName === "") {
                    this.oRouter.navTo(sRouteName, {
                        context: sPath,
                        masterContext: sMasterContext
                    }, false);
                } else {
                    oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
                        if (bindingContext) {
                            sPath = bindingContext.getPath();
                            if (sPath.substring(0, 1) === "/") {
                                sPath = sPath.substring(1);
                            }
                        } else {
                            sPath = "undefined";
                        }

                        // If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
                        if (sPath === "undefined") {
                            this.oRouter.navTo(sRouteName);
                        } else {
                            this.oRouter.navTo(sRouteName, {
                                context: sPath,
                                masterContext: sMasterContext
                            }, false);
                        }
                    }.bind(this));
                }
            } else {
                this.oRouter.navTo(sRouteName);
            }

            if (typeof fnPromiseResolve === "function") {
                fnPromiseResolve();
            }

        },
        _onLinkPress: function (oEvent) {

            var sPopoverName = "Popover1";
            this.mPopovers = this.mPopovers || {};
            var oPopover = this.mPopovers[sPopoverName];

            if (!oPopover) {
                oPopover = new Popover1(this.getView());
                this.mPopovers[sPopoverName] = oPopover;

                oPopover.getControl().setPlacement("Auto");

                // For navigation.
                oPopover.setRouter(this.oRouter);
            }

            var oSource = oEvent.getSource();

            oPopover.open(oSource);

        },
        _onLinkPress1: function (oEvent) {

            var sPopoverName = "Popover1";
            this.mPopovers = this.mPopovers || {};
            var oPopover = this.mPopovers[sPopoverName];

            if (!oPopover) {
                oPopover = new Popover1(this.getView());
                this.mPopovers[sPopoverName] = oPopover;

                oPopover.getControl().setPlacement("Auto");

                // For navigation.
                oPopover.setRouter(this.oRouter);
            }

            var oSource = oEvent.getSource();

            oPopover.open(oSource);

        },
        _onTableItemPress1: function (oEvent) {

            var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
            var oObject = oEvent.getParameter("listItem").getBindingContext().getObject();

            var oComponent = this.getOwnerComponent();
            oComponent.setModel(new JSONModel(oObject), "detailData");
            return new Promise(function (fnResolve) {
                this.doNavigate("Page2", oBindingContext, fnResolve, "");
            }.bind(this)).catch(function (err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },
        _onOverflowToolbarButtonPress: function (oEvent) {

            var sDialogName = "Dialog2";
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sDialogName];
            if (!oDialog) {
                oDialog = new Dialog2(this.getView());
                this.mDialogs[sDialogName] = oDialog;

                // For navigation.
                oDialog.setRouter(this.oRouter);
            }

            var context = oEvent.getSource().getBindingContext();
            oDialog._oControl.setBindingContext(context);
            this.getView().byId("woValue").setValue("");
            this.getView().byId("woDateValue").setValue("");
            oDialog.open();

        },
        _onLinkPress2: function (oEvent) {

            var oBindingContext = oEvent.getSource().getBindingContext();

            return new Promise(function (fnResolve) {

                this.doNavigate("Page2", oBindingContext, fnResolve, "");
            }.bind(this)).catch(function (err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },
        _onLinkPress3: function (oEvent) {

            var sPopoverName = "Popover2";
            this.mPopovers = this.mPopovers || {};
            var oPopover = this.mPopovers[sPopoverName];

            if (!oPopover) {
                oPopover = new Popover2(this.getView());
                this.mPopovers[sPopoverName] = oPopover;

                oPopover.getControl().setPlacement("Auto");

                // For navigation.
                oPopover.setRouter(this.oRouter);
            }

            var oSource = oEvent.getSource();
            oSource.getText();
            this.getView().byId("idEPO").setText(oSource.getText());
            oPopover.open(oSource);

        },
        _onIconPress: function (oEvent) {

            var sDialogName = "Dialog3";
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sDialogName];
            if (!oDialog) {
                oDialog = new Dialog3(this.getView());
                this.mDialogs[sDialogName] = oDialog;

                // For navigation.
                oDialog.setRouter(this.oRouter);
            }

            var context = oEvent.getSource().getBindingContext();
            var path = context.sPath;
            var woArray = path.split("'");
            woArray[1] = woArray[1].replace("%7C", "|");
            // oDialog._oControl.setBindingContext(context);
            // var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
            //var oObject = oEvent.getParameter("listItem").getBindingContext().getObject();
            //var oComponent = this.getOwnerComponent();
            // var oContainer = oObject.getProperty("/");


            var oTable = this.byId("errosTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                aFilters = [];
            var oFilter = new sap.ui.model.Filter("workOrderID_workOrderID", sap.ui.model.FilterOperator.EQ, woArray[1]);
            aFilters.push(oFilter);
            var that = this;
            if (oBinding) {
                oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                oBinding.filter(aFilters);
            } else {
                var oModel = this.getView().getModel();
                oModel.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                var oListBinding = oModel.bindList("/ErrosMaterial", undefined, undefined, undefined, { $select: "*" });
                oListBinding.requestContexts().then(function (aContexts) {
                    var oTable = that.byId("errosTable"),
                        oBinding = oTable.getBinding("items"),
                        aFilters = [];
                    var oFilter = new sap.ui.model.Filter("workOrderID_workOrderID", sap.ui.model.FilterOperator.EQ, woArray[1]);
                    aFilters.push(oFilter);
                    oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                    oBinding.filter(aFilters);
                });
            }
            oDialog.open();

        },
        _onLinkPress4: function (oEvent) {

            var oBindingContext = oEvent.getSource().getBindingContext();

            return new Promise(function (fnResolve) {

                this.doNavigate("Page2", oBindingContext, fnResolve, "");
            }.bind(this)).catch(function (err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },
        _onButtonPress: function () {
            return new Promise(function (fnResolve) {
                var sTargetPos = "";
                sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
                sap.m.MessageToast.show("Ítems enviados para Baixa", {
                    onClose: fnResolve,
                    duration: 0 || 3000,
                    at: sTargetPos,
                    my: sTargetPos
                });
            }).catch(function (err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            this.oRouter.getTargetHandler().setCloseDialogs(false);
            var oView = this.getView();
            var oModel = new sap.ui.model.odata.v4.ODataModel({
                groupId: "$direct",
                synchronizationMode: "None",
                serviceUrl: "/comsapbuildstandardconsolidado/work-order/",
            });
            //var oModelWo = new sap.ui.model.odata.v4.ODataModel({
            //    groupId: "$direct",
            //    synchronizationMode: "None",
            //    serviceUrl: "/comsapbuildstandardconsolidado/work-order/",
            //});
            oView.setModel(oModel);
            //oView.setModel(oModelWo, "woData");
            oView.getController().setHeaderContext();
            var that = this;

            var oModel2 = new sap.ui.model.json.JSONModel();

            /* Load the data */
            oModel2.loadData("/comsapbuildstandardconsolidado/getuserinfo");
            var userRoles = "";
            /* Add a completion handler to log the json and any errors*/
            oModel2.attachRequestCompleted(function onCompleted(oEvent) {
                if (oEvent.getParameter("success")) {
                    userRoles = this.getData()["xs.system.attributes"]["xs.rolecollections"];
                    var foundValue = userRoles.filter(obj => obj === 'AdminConsolidacao');
                    if (foundValue[0] === 'AdminConsolidacao') {
                        userAdm = "admin";
                    }
                    //userName = this.getData();
                    //    userRoles = this.getData()["xs.system.attributes"]["xs.rolecollections"];
                    //   var foundValue = userRoles.filter(obj => obj === 'AdminConsolidacao');
                    //    if (foundValue[0] === 'AdminConsolidacao') {
                    //alert("Achou a role");
                    //        userAdm = "X";
                    //      var oTable = that.byId("woTable"),
                    //        mParams = oEvent.getParameters(),
                    //      oBinding = oTable.getBinding("items"),
                    //    aFilters = [];
                    //var oFilter = new sap.ui.model.Filter("user", sap.ui.model.FilterOperator.EQ, "admin");
                    //aFilters.push(oFilter);
                    //oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                    // oBinding.filter(aFilters);
                    //that.getView().byId("homePage").setVisible(true);
                    //   } else {
                    var oListBinding = oModel.bindList("/LoginTecnico", undefined, undefined, undefined, { $select: "*" });
                    //var count = 0;
                    oListBinding.requestContexts().then(function (aContexts) {

                        if (aContexts.length == 0) {
                            if (userAdm === "admin") {

                                that.onSendCnpj();
                            } else {
                                that.DialogCadastroCnpj.open();
                            }
                        } else {
                            that.getView().byId("homePage").setVisible(true);
                        }

                    });
                    // }
                } else {
                }
            });
            this.mGroupFunctions = {
                idTecnico: function (oContext) {
                    var name = oContext.getProperty("idTecnico");
                    return {
                        key: name,
                        text: name
                    };
                },
                fornecedorSAP: function (oContext) {
                    var name = oContext.getProperty("fornecedorSAP");
                    return {
                        key: name,
                        text: name
                    };
                }
            };
            this._oTPC = new TablePersoController({
                table: this.byId("woTable"),
                //specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                componentName: "wo",
                persoService: DemoPersoService
            }).activate();
        },
        setHeaderContext: function () {
            var oView = this.getView();
            oView.byId("titleCount").setBindingContext(
                oView.byId("woTable").getBinding("items").getHeaderContext());
        },
        onPersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
            this._oTPC.attachPersonalizationsDone(this, this.onPerscoDonePressed.bind(this));
        },
        onPerscoDonePressed: function (oEvent) {
            this._oTPC.savePersonalizations();
        },
        onTablePersoRefresh: function () {
            DemoPersoService.resetPersData();
            this._oTPC.refresh();
        },

        onTableGrouping: function (oEvent) {
            this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
        },
        handleSortButtonPressed: function () {
            //	this.getViewSettingsDialog("com.sap.build.standard.consolidado.view.SortDialog")
            //		.then(function (oViewSettingsDialog) {
            //			oViewSettingsDialog.open();
            //		});
            if (!this.DialogSort) {
                this.DialogSort = this.DialogSort = sap.ui.xmlfragment(
                    "DialogSort",
                    "com.sap.build.standard.consolidado.view.SortDialog",
                    this
                );
                //to get access to the global model
                this.getView().addDependent(this.DialogSort);
            }
            // abre o value help dialog filtrando pelo input value
            this.DialogSort.open();
        },

        handleSortDialogConfirm: function (oEvent) {
            var oTable = this.byId("woTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                aSorters = [];

            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));
            oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
            // apply the selected sort and group settings
            oBinding.sort(aSorters);
        },

        handleFilterButtonPressed: function () {
            if (!this.DialogFilter) {
                this.DialogFilter = this.DialogFilter = sap.ui.xmlfragment(
                    "DialogFilter",
                    "com.sap.build.standard.consolidado.view.FilterDialog",
                    this
                );
                //to get access to the global model
                this.getView().addDependent(this.DialogFilter);
            }
            // abre o value help dialog filtrando pelo input value
            this.DialogFilter.open();
        },

        handleFilterDialogConfirm: function (oEvent) {
            var oTable = this.byId("woTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                aFilters = [];

            //  if (userAdm === "X") {
            //     var oFilter = new sap.ui.model.Filter("user", sap.ui.model.FilterOperator.EQ, "admin");
            //      aFilters.push(oFilter);
            //   }
            mParams.filterItems.forEach(function (oItem) {
                //	var aSplit = oItem.getKey(),
                //		sPath = aSplit[0],
                //		sOperator = aSplit[1],
                //		sValue1 = aSplit[2],
                //		sValue2 = aSplit[3],
                if (oItem.getKey() == "dataAtendimento") {
                    var isoDate = new Date(oItem.getText()).toISOString().split("T");
                    var newDate = isoDate[0];
                    var oFilter = new sap.ui.model.Filter(oItem.getKey(), sap.ui.model.FilterOperator.EQ, newDate);
                } else if (oItem.getKey() == "status") {
                    if (oItem.getText() == "Com erro") {
                        var oFilter = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "true");
                    } else {
                        var oFilter = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "false");
                    }
                } else {
                    var oFilter = new sap.ui.model.Filter(oItem.getKey(), sap.ui.model.FilterOperator.EQ, oItem.getText());
                }
                //	oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
                aFilters.push(oFilter);
            });
            // apply filter settings
            oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
            oBinding.filter(aFilters);

            // update filter bar
            this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
            this.byId("vsdFilterLabel").setText(mParams.filterString);
        },

        handleGroupButtonPressed: function () {
            if (!this.DialogGroup) {
                this.DialogGroup = this.DialogGroup = sap.ui.xmlfragment(
                    "DialogGroup",
                    "com.sap.build.standard.consolidado.view.GroupDialog",
                    this
                );
                //to get access to the global model
                this.getView().addDependent(this.DialogGroup);
            }
            // abre o value help dialog filtrando pelo input value
            this.DialogGroup.open();
        },

        handleGroupDialogConfirm: function (oEvent) {
            var oTable = this.byId("woTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                vGroup,
                aGroups = [];

            if (mParams.groupItem) {
                sPath = mParams.groupItem.getKey();
                bDescending = mParams.groupDescending;
                vGroup = this.mGroupFunctions[sPath];
                aGroups.push(new Sorter(sPath, bDescending, vGroup));
                // apply the selected group settings
                oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                oBinding.sort(aGroups);
            } else if (this.groupReset) {
                oBinding.sort();
                this.groupReset = false;
            }
        },
        resetGroupDialog: function (oEvent) {
            this.groupReset = true;
        },
        onSearch: function (oEvent) {

            var oTable = this.byId("woTable"),
                oBinding = oTable.getBinding("items"),
                valueTecnico = this.getView().byId("tecnicoFilter").getValue(),
                valueTipoWo = this.getView().byId("tipoWoFilter").getValue(),
                valueAtendimento = this.getView().byId("atendimentoFilter").getValue(),
                valueMunicipio = this.getView().byId("municipioFilter").getValue(),
                oFilter = "",
                aFilters = [];

            //  if (userAdm === "X") {
            //       var oFilter = new sap.ui.model.Filter("user", sap.ui.model.FilterOperator.EQ, "admin");
            //       aFilters.push(oFilter);
            //   }

            if (valueTecnico !== "") {
                oFilter = new sap.ui.model.Filter("idTecnico", sap.ui.model.FilterOperator.EQ, valueTecnico);
                aFilters.push(oFilter);
            }
            if (valueTipoWo !== "") {
                oFilter = new sap.ui.model.Filter("tipoWo", sap.ui.model.FilterOperator.EQ, valueTipoWo);
                aFilters.push(oFilter);
            }
            if (valueAtendimento !== "") {
                oFilter = new sap.ui.model.Filter("dataAtendimento", sap.ui.model.FilterOperator.EQ, valueAtendimento);
                aFilters.push(oFilter);
            }
            if (valueMunicipio !== "") {
                oFilter = new sap.ui.model.Filter("municipio", sap.ui.model.FilterOperator.EQ, valueMunicipio);
                aFilters.push(oFilter);
            }

            if (aFilters !== []) {
                // apply filter settings
                oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                oBinding.filter(aFilters);
            }
        },
        onCreate: function () {
            var oData = [];
            var rowItems = this.getView().byId("woTable").getSelectedItems();
            var exiteErro = "";
            if (rowItems.length > 0) {
                for (var i = 0; i < rowItems.length; i++) {
                    var item = rowItems[i];
                    var itemAux = [];
                    var indexAux = 0;
                    var CellsAux = [];
                    if(i !== 0){
                       indexAux = i - 1;
                       itemAux = rowItems[indexAux];
                       CellsAux = itemAux.getCells();
                    }

                    var Cells = item.getCells();
                    if (Cells[1].getColor() == "red") {
                        exiteErro = "woError";
                        break;
                    }else if(i !== 0){
                        if(Cells[5].getText() !== CellsAux[5].getText() ){
                            exiteErro = "fornecedorError";
                            break;
                        }
                    }
                    oData.push(Cells[2].getText());
                }
                if (exiteErro == "woError") {
                    sap.m.MessageBox.show(
                        "Uma ou mais WO selecionadas contém erros, clique no icone da coluna Status para verificar",
                        sap.m.MessageBox.Icon.ERROR,
                        "Erro ao efetuar baixa"
                    );
                } else if (exiteErro == "fornecedorError") {
                    sap.m.MessageBox.show(
                        "Por favor selecione apenas WOs do mesmo fornecedor",
                        sap.m.MessageBox.Icon.ERROR,
                        "Erro ao efetuar baixa"
                    );
                } else {

                    var oList = this.getView().byId("baixaTable"),
                        oBinding = oList.getBinding("items"),
                        that = this;
                    var oGlobalBusyDialog = new sap.m.BusyDialog();
                    oGlobalBusyDialog.open();
                    sap.ui.getCore().getMessageManager().removeAllMessages();
                    oBinding.attachCreateCompleted(function (oEvent) {
                        oGlobalBusyDialog.close();
                        if (oEvent.getParameter("success")) {
                            MessageBox.show(
                                "Dados atualizados com sucesso", {
                                icon: MessageBox.Icon.SUCCESS,
                                title: "Dados gravados!",
                                onClose: function (oAction) {
                                    var oTable = that.byId("woTable"),
                                        oBinding = oTable.getBinding("items"),
                                        aFilters = [];
                                    //      if (userAdm === "X") {
                                    //         var oFilter = new sap.ui.model.Filter("user", sap.ui.model.FilterOperator.EQ, "admin");
                                    //         aFilters.push(oFilter);
                                    //    }
                                    oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                                    oBinding.filter(aFilters);
                                }
                            }
                            );
                        } else {
                            sap.m.MessageBox.show(
                                sap.ui.getCore().getMessageManager().getMessageModel().getData()[0].message,
                                sap.m.MessageBox.Icon.ERROR,
                                "Erro ao efetuar baixa"
                            );
                            that.byId("baixaTable").getBinding("items").resetChanges();
                            //   sap.ui.getCore().getMessageManager().removeAllMessages();
                        }
                    }.bind(this));
                    var oContext = oBinding.create({
                        "consolidado": "Baixa de WOS",
                        "wos": oData//["25666|24672", "25666|24663"]
                    }, true);
                    //    oContext.created().then(function () {

                    //   }, function (oError, oResponse) {

                    // handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted 
                    //  });
                    //     oList.getItems().some(function (oItem) {
                    //       if (oItem.getBindingContext() === oContext) {
                    //            oItem.focus();
                    //          oItem.setSelected(true);
                    //    that.getView().getController().onSave();
                    //          return true;
                    //      }
                    //   });
                    this.onSave();
                }
            } else {
                sap.m.MessageBox.show(
                    "Antes de realizar a baixar selecione os itens",
                    sap.m.MessageBox.Icon.ERROR,
                    "Erro ao efetuar baixa"
                );
            }
        },
        onSave: function () {
            var that = this;
            var fnSuccess = function (aErrorResponses) {

                //   sap.m.MessageBox.show(
                //"Dados atualizados com sucesso",
                //       sap.m.MessageBox.Icon.SUCCESS,
                //       "Dados gravados!"
                //    );
                MessageBox.show(
                    "Dados atualizados com sucesso", {
                    icon: MessageBox.Icon.SUCCESS,
                    title: "Dados gravados!",
                    onClose: function (oAction) {
                        var oTable = that.byId("woTable"),
                            oBinding = oTable.getBinding("items"),
                            aFilters = [];
                        //     if (userAdm === "x") {
                        //        var oFilter = new sap.ui.model.Filter("user", sap.ui.model.FilterOperator.EQ, "admin");
                        //        aFilters.push(oFilter);
                        //   }
                        oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                        oBinding.filter(aFilters);
                    }
                }
                );

                //      that.getView().getController().setHeaderContext();
            }.bind(this);

            var fnError = function (oError) {

                sap.m.MessageBox.show(
                    "Tente novamente.",
                    sap.m.MessageBox.Icon.ERROR,
                    "Erro ao atualizar os dados"
                );
            }.bind(this);

            //this._setBusy(true); // Lock UI until submitBatch is resolved.
            //   this.getView().getModel("woData").SubmitMode = sap.ui.model.odata.v4.SubmitMode.API;
            this.getView().getModel().submitBatch("BaixaGroup");
            //this._bTechnicalErrors = false; // If there were technical errors, a new save resets them.
        },
        onSendCnpj: function (oEvent) {
            var oModel = this.getView().getModel();
            var oListBinding = oModel.bindList("/LoginTecnico", undefined, undefined, undefined, { $$updateGroupId: "loginGroup" });
            var that = this;
            var oGlobalBusyDialog = new sap.m.BusyDialog();
            oGlobalBusyDialog.open();
            sap.ui.getCore().getMessageManager().removeAllMessages();

            oListBinding.attachCreateCompleted(function (oEvent) {
                oGlobalBusyDialog.close();
                if (oEvent.getParameter("success")) {
                    if (userAdm === "") {
                        MessageBox.show(
                            "Dados atualizados com sucesso", {
                            icon: MessageBox.Icon.SUCCESS,
                            title: "Dados gravados!",
                            onClose: function (oAction) {
                                var oTable = that.getView().byId("woTable"),
                                    oBinding = oTable.getBinding("items"),
                                    aFilters = [];
                                oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                                oBinding.filter(aFilters);
                                that.getView().byId("homePage").setVisible(true);
                                that.DialogCadastroCnpj.close();
                            }
                        }
                        );
                    } else {
                        var oTable = that.getView().byId("woTable"),
                            oBinding = oTable.getBinding("items"),
                            aFilters = [];
                        oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                        oBinding.filter(aFilters);
                        that.getView().byId("homePage").setVisible(true);
                    }
                } else {
                    sap.m.MessageBox.show(
                        sap.ui.getCore().getMessageManager().getMessageModel().getData()[0].message,
                        sap.m.MessageBox.Icon.ERROR,
                        "Erro ao efetuar baixa"
                    );
                    //  sap.ui.getCore().getMessageManager().removeAllMessages();
                    oListBinding.resetChanges();
                }
            }.bind(this));

            if (userAdm !== "") {
                var CodFornecedorSAPValue = userAdm;
                var CNPJValue = "ClaroAdm";
            } else {
                var CodFornecedorSAPValue = sap.ui.core.Fragment.byId("DialogCadastroCnpj", "CodFornecedorSAP").getValue();
                var CNPJValue = sap.ui.core.Fragment.byId("DialogCadastroCnpj", "CNPJ").getValue();
            }
            var oContext = oListBinding.create({
                // "loginTecnico": userName,
                "CodFornecedorSAP": CodFornecedorSAPValue,
                "CNPJ": CNPJValue
            }, true);
            this.getView().getModel().submitBatch("loginGroup");
            //this.getView().byId("titleCount").setText(this.getView().byId("woTable").getBinding("items").getLength());

        },
        createColumnConfig: function () {
            var aCols = [];

            aCols.push({
                // label: 'Tipo de Inst.',
                property: 'workOrderID_workOrderID',
                type: EdmType.String
            });

            aCols.push({
                //  label: 'ID Tipo de OS',
                property: 'material',
                type: EdmType.String
            });

            aCols.push({
                property: 'tipo',
                type: EdmType.String
            });

            aCols.push({
                // label: 'Cód.Mat. SAP',
                property: 'erro',
                type: EdmType.String
            });

            return aCols;
        },
        onDataExportExcel: function () {
            var aCols, oRowBinding, oSettings, oSheet, oTable;

            if (!this._oTable) {
                this._oTable = this.byId('errosTable');
            }

            oTable = this._oTable;
            oRowBinding = oTable.getBinding('items');

            aCols = this.createColumnConfig();

            var oModel = oRowBinding.getModel();

            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: {
                    type: 'odata',
                    dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
                    serviceUrl: this._sServiceUrl,
                    headers: oModel.getHttpHeaders ? oModel.getHttpHeaders() : null,
                    count: oRowBinding.getLength ? oRowBinding.getLength() : null,
                    useBatch: true // Default for ODataModel V2
                },
                fileName: 'Erros por WO.xlsx',
                worker: false // We need to disable worker because we are using a MockServer as OData Service
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        }
    });
}, /* bExport= */ true);
