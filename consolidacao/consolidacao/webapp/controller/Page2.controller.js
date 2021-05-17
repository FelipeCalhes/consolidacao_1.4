sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./Dialog1",
    "./utilities",
    "sap/ui/core/routing/History",
    'sap/ui/model/Filter',
    'sap/m/TablePersoController',
    './DemoPersoService',
    'sap/ui/model/Sorter',
    "../model/formatter",
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet'
], function (BaseController, MessageBox, Dialog1, Utilities, History, Filter, TablePersoController, DemoPersoService, Sorter, formatter, Export, ExportTypeCSV, exportLibrary, Spreadsheet) {
    "use strict";
    var EdmType = exportLibrary.EdmType;
    return BaseController.extend("com.sap.build.standard.consolidado.controller.Page2", {
        formatter: formatter,
        handleRouteMatched: function (oEvent) {
            var sAppId = "App5f7b6d3bbe6e506fcc9b7eb8";

            var oParams = {};

            if (oEvent.mParameters.data.context) {
                this.sContext = oEvent.mParameters.data.context;

            } else {
                if (this.getOwnerComponent().getComponentData()) {
                    var patternConvert = function (oParam) {
                        if (Object.keys(oParam).length !== 0) {
                            for (var prop in oParam) {
                                if (prop !== "sourcePrototype" && prop.includes("Set")) {
                                    return prop + "(" + oParam[prop][0] + ")";
                                }
                            }
                        }
                    };

                    this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

                }
            }

            var oPath;

            if (this.sContext) {
                oPath = {
                    path: "/" + this.sContext,
                    parameters: oParams
                };
                this.getView().bindObject(oPath);
            }

        },
        _onPageNavButtonPress: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            var oQueryParams = this.getQueryParameters(window.location);
            this.onResetChanges();
            if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("default", true);
            }

        },
        getQueryParameters: function (oLocation) {
            var oQuery = {};
            var aParams = oLocation.search.substring(1).split("&");
            for (var i = 0; i < aParams.length; i++) {
                var aPair = aParams[i].split("=");
                oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
            }
            return oQuery;

        },
        _onButtonPress: function (oEvent) {

            var sDialogName = "Dialog1";
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sDialogName];
            if (!oDialog) {
                oDialog = new Dialog1(this.getView());
                this.mDialogs[sDialogName] = oDialog;

                // For navigation.
                oDialog.setRouter(this.oRouter);
            }

            var context = oEvent.getSource().getBindingContext();
            oDialog._oControl.setBindingContext(context);

            oDialog.open();

        },
        _onButtonPress1: function () {
            return new Promise(function (fnResolve) {
                var sTargetPos = "";
                sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
                sap.m.MessageToast.show("Dados gravados", {
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
            this.oRouter.getTarget("Page2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            var oView = this.getView();
            var oModel = new sap.ui.model.odata.v4.ODataModel({
                groupId: "$direct",
                synchronizationMode: "None",
                serviceUrl: "/Consolidacaohtml5.comsapbuildstandardconsolidado/work-order/",
            });
            oView.setModel(oModel);
            var that = this;
            //var oListBinding = oModel.bindList("/WorkOrder", undefined, undefined, undefined, { $select: "*", $expand: "*" });
            oView.addEventDelegate({
                onBeforeShow: function () {
                    var oTable = this.byId("materialTable"),
                        oBinding = oTable.getBinding("items"),
                        aFilters = [];
                    var oContainer = that.getOwnerComponent().getModel("detailData").getProperty("/");
                    // var oData = [];
                    // oData.push(oContainer);
                    //  var oModelDetail = new sap.ui.model.json.JSONModel({
                    //       "results": oData
                    //  });
                    //  oView.setModel(oModelDetail, "detailData");
                    this.byId("workOrderID").setText(oContainer.workOrderID);
                    this.byId("tipoWo").setText(oContainer.tipoWo);
                    this.byId("sla").setText(oContainer.sla + " Dias");
                    this.byId("municipio").setText(oContainer.municipio);
                    this.byId("idTecnico").setText(oContainer.idTecnico);
                    this.byId("fornecedorSAP").setText(oContainer.fornecedorSAP);
                    this.byId("dataAtendimento").setText(oContainer.dataAtendimento);
                    var oFilter = new sap.ui.model.Filter("workOrderID_workOrderID", sap.ui.model.FilterOperator.EQ, oContainer.workOrderID);
                    aFilters.push(oFilter);
                    oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                    oBinding.filter(aFilters);

                    this.mGroupFunctions = {
                        material: function (oContext) {
                            var name = oContext.getProperty("material");
                            return {
                                key: name,
                                text: name
                            };
                        }
                    };
                }.bind(this)
            });

            this._oTPC = new TablePersoController({
                table: this.byId("materialTable"),
                //specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                componentName: "mat",
                persoService: DemoPersoService
            }).activate();
        },
        _onTableItemPress1: function (oEvent) {

            var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
            var oObject = oEvent.getParameter("listItem").getBindingContext().getObject();

            //	var oComponent = this.getOwnerComponent();
            //	oComponent.setModel(new JSONModel(oObject), "detailData");
            //   return new Promise(function (fnResolve) {
            //       this.doNavigate("Page2", oBindingContext, fnResolve, "");
            //   }.bind(this)).catch(function (err) {
            //      if (err !== undefined) {
            //         MessageBox.error(err.message);
            //}
            //  });

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
            if (!this.DialogSortPage2) {
                this.DialogSortPage2 = this.DialogSortPage2 = sap.ui.xmlfragment(
                    "DialogSortPage2",
                    "com.sap.build.standard.consolidado.view.SortDialogPage2",
                    this
                );
                //to get access to the global model
                this.getView().addDependent(this.DialogSortPage2);
            }
            // abre o value help dialog filtrando pelo input value
            this.DialogSortPage2.open();
        },

        handleSortDialogConfirm: function (oEvent) {
            var oTable = this.byId("materialTable"),
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
            if (!this.DialogFilter2) {
                this.DialogFilter2 = this.DialogFilter2 = sap.ui.xmlfragment(
                    "DialogFilter2",
                    "com.sap.build.standard.consolidado.view.FilterDialogPage2",
                    this
                );
                //to get access to the global model
                this.getView().addDependent(this.DialogFilter2);
            }
            // abre o value help dialog filtrando pelo input value
            this.DialogFilter2.open();
        },

        handleFilterDialogConfirm: function (oEvent) {
            var oTable = this.byId("materialTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                aFilters = [];

            mParams.filterItems.forEach(function (oItem) {
                //	var aSplit = oItem.getKey(),
                //		sPath = aSplit[0],
                //		sOperator = aSplit[1],
                //		sValue1 = aSplit[2],
                //		sValue2 = aSplit[3],
                var oFilter = new sap.ui.model.Filter(oItem.getKey(), sap.ui.model.FilterOperator.Contains, oItem.getText());

                //	oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
                aFilters.push(oFilter);
            });
            var oFilter = new sap.ui.model.Filter("workOrderID_workOrderID", sap.ui.model.FilterOperator.EQ, this.byId("workOrderID").getText());
            aFilters.push(oFilter);
            // apply filter settings
            oBinding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
            oBinding.filter(aFilters);

            // update filter bar
            this.byId("vsdFilterBarPage2").setVisible(aFilters.length > 0);
            this.byId("vsdFilterLabelPage2").setText(mParams.filterString);
        },

        handleGroupButtonPressed: function () {
            if (!this.DialogGroup2) {
                this.DialogGroup2 = this.DialogGroup2 = sap.ui.xmlfragment(
                    "DialogGroup2",
                    "com.sap.build.standard.consolidado.view.GroupDialogPage2",
                    this
                );
                //to get access to the global model
                this.getView().addDependent(this.DialogGroup2);
            }
            // abre o value help dialog filtrando pelo input value
            this.DialogGroup2.open();
        },

        handleGroupDialogConfirm: function (oEvent) {
            var oTable = this.byId("materialTable"),
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
        onSave: function () {
            var that = this;
            var quantidadeEmBraco = false;
            var oList = this.getView().byId("materialTable"),
                oBinding = oList.getBinding("items");
            $.each(oList.getItems(), function (index, value) {
                var quantidade = oList.getItems()[index].getCells()[4].getValue();
                if (quantidade == "" || quantidade == 0) {
                    quantidadeEmBraco = true;
                }
            });
            if (quantidadeEmBraco) {
                sap.m.MessageBox.show(
                    "Um ou mais materiais estão com a quantidade vazia, favor verifique e tente novamente.",
                    sap.m.MessageBox.Icon.ERROR,
                    "Erro ao gravar os dados"
                );

            } else {
                var fnSuccess = function () {

                    sap.m.MessageBox.show(
                        "Dados atualizados com sucesso",
                        sap.m.MessageBox.Icon.SUCCESS,
                        "Dados gravados!"
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
                this.getView().getModel().submitBatch("MaterialGroup").then(fnSuccess, fnError);
                //this._bTechnicalErrors = false; // If there were technical errors, a new save resets them.

            }
        },
        onChange: function (oEvent) {
            var quantidade = oEvent.getSource().getParent().getBindingContext().getProperty("quantidade");
            var quantiadeBom = oEvent.getSource().getParent().getBindingContext().getProperty("quantidadeBOM");
            var diferencaNew = quantiadeBom - quantidade;
            if (diferencaNew < 0) {
                diferencaNew = 0;
            }
            oEvent.getSource().getParent().getBindingContext().setProperty("difQuant", diferencaNew.toString());
        },
        onResetChanges: function () {
            this.byId("materialTable").getBinding("items").resetChanges();
        },
        handleValueHelpMat: function (oEvent) {
            var oModel = new sap.ui.model.odata.v4.ODataModel({
                groupId: "$direct",
                synchronizationMode: "None",
                serviceUrl: "/Consolidacaohtml5.comsapbuildstandardconsolidado/motor-de-regras/",
            });
            this.inputId = oEvent.getSource().getId();
            // cria o value help dialog
            if (!this.DialogMateriais) {
                this.DialogMateriais = this.DialogMateriais = sap.ui.xmlfragment(
                    "DialogMateriais",
                    "com.sap.build.standard.consolidado.view.DialogMateriais",
                    this
                );
                //to get access to the global model
                this.getView().addDependent(this.DialogMateriais);
                sap.ui.core.Fragment.byId("DialogMateriais", "List").setModel(oModel);
            } else {
                var aFilters = []
                var oBind = sap.ui.core.Fragment.byId("DialogMateriais", "List").getBinding("items");
                oBind.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                oBind.filter(aFilters, sap.ui.model.FilterType.Application);
            }
            //var oJsonModel = new sap.ui.model.json.JSONModel();
            // abre o value help dialog filtrando pelo input value
            this.DialogMateriais.open();
            //	oGlobalBusyDialog.open();
        },
        _handleValueHelpCloseMateriais: function (evt) {
            var oSelectedItem = evt.getParameter("selectedItem");
            var that = this;
            if (oSelectedItem) {
                var materialExists = false;
                //var arrayId = that.inputId.split("TpOS");
                // var idTpOs = arrayId[0] + "TpOS";
                // that.getView().byId(that.inputId).setValue(oSelectedItem.getDescription());
                //that.getView().byId("CodMatSAP").setValue(oSelectedItem.getTitle());
                var that = this;
                var oList = this.getView().byId("materialTable"),
                    oBinding = oList.getBinding("items");
                $.each(oList.getItems(), function (index, value) {
                    var material = oList.getItems()[index].getCells()[1].getTitle();
                    if (material == oSelectedItem.getTitle()) {
                        materialExists = true;
                    }
                });
                if (materialExists == false) {
                    var oContext = oBinding.create({
                        "material": oSelectedItem.getTitle(),
                        "descMaterial": oSelectedItem.getDescription(),
                        "workOrderID_workOrderID": that.byId("workOrderID").getText()
                    });

                    //this._setUIChanges();
                    //this.getView().getModel("appView").setProperty("/usernameEmpty", true);

                    oList.getItems().some(function (oItem) {
                        if (oItem.getBindingContext() === oContext) {
                            oItem.focus();
                            oItem.setSelected(true);
                            //    that.getView().getController().onSave();
                            return true;
                        }
                    });
                } else {
                    sap.m.MessageBox.show(
                        "Material já existente na WO",
                        sap.m.MessageBox.Icon.ERROR,
                        "Erro ao adicionar o material."
                    );
                }
            }
            //evt.getSource().getBinding("items").filter([]);
        },
        _handleValueHelpSearchMateriais: function (evt) {
            var sValue = evt.getParameter("value").toUpperCase();
            var filter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter("descMaterial", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("material", sap.ui.model.FilterOperator.Contains, sValue)
                ],
                and: false
            })
            //var FilterdescMaterial = new sap.ui.model.Filter("descMaterial", sap.ui.model.FilterOperator.Contains, sValue);
            var oBind = sap.ui.core.Fragment.byId("DialogMateriais", "List").getBinding("items");
            oBind.sOperationMode = sap.ui.model.odata.OperationMode.Server;
            oBind.filter(filter, sap.ui.model.FilterType.Application);
            //evt.getSource().getBinding("items").filter([FilterdescricaoOs]);
        },
        onDelete: function (oEvent) {
            //var oSelected = this.byId("bomTable").getSelectedItem();
            var oList = oEvent.getSource(),
                oItem = oEvent.getParameter("listItem");
            var that = this;

            MessageBox.warning("Tem certeza que deseja excluir o registro? Essa ação não poderá ser desfeita.", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction == "OK") {
                        if (oItem) {
                            oItem.getBindingContext().delete("$auto").then(function () {
                                //   window.alert("deu certo");
                                sap.m.MessageBox.show(
                                    "Registro excluido com sucesso!",
                                    sap.m.MessageBox.Icon.SUCCESS,
                                    "Dados gravados!"
                                );
                                that.getView().getController().setHeaderContext();
                            }.bind(this), function (oError) {
                                //  window.alert("deu erro");
                                sap.m.MessageBox.show(
                                    "Tente novamente.",
                                    sap.m.MessageBox.Icon.ERROR,
                                    "Erro ao deletar o registro."
                                );
                            });
                        }
                    }
                }
            })
        },
        createColumnConfig: function () {
            var aCols = [];

            aCols.push({
                // label: 'Tipo de Inst.',
                property: 'erro',
                type: EdmType.String
            });

            aCols.push({
                //  label: 'ID Tipo de OS',
                property: 'material',
                type: EdmType.String
            });

            aCols.push({
                property: 'descMaterial',
                type: EdmType.String
            });

            aCols.push({
                // label: 'Cód.Mat. SAP',
                property: 'quantidadeBOM',
                type: EdmType.String
            });

            aCols.push({
                // label: 'Cód.Mat. SAP',
                property: 'quantidade',
                type: EdmType.String
            });

            aCols.push({
                // label: 'Cód.Mat. SAP',
                property: 'difQuant',
                type: EdmType.String
            });

            return aCols;
        },
        onExport: function () {
            var aCols, oRowBinding, oSettings, oSheet, oTable;

            if (!this._oTable) {
                this._oTable = this.byId('materialTable');
            }

            oTable = this._oTable;
            oRowBinding = oTable.getBinding('items');

            aCols = this.createColumnConfig();

            var oModel = oRowBinding.getModel();
            var fileName = "Materiais da WO " + this.byId("workOrderID").getText() + ".xlsx"
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
                fileName: fileName,
                worker: false // We need to disable worker because we are using a MockServer as OData Service
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        }
    });
}, /* bExport= */ true);
