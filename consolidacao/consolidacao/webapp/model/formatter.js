sap.ui.define(function() {
	"use strict";

	return  {

		slaFormat :  function (fsla) {
				if (fsla < 2) {
					return "None";
				} else if (fsla < 10) {
					return "Warning";
				} else {
					return "Error";
				}		
		},

		statusFormart :  function (fstatus) {
				if (fstatus === "1") {
					return "sap-icon://error";
				} else if (fstatus === "0") {
					return "sap-icon://accept";
				}	
		},

		statusFormartColor :  function (fstatus) {
				if (fstatus === "1") {
					return "red";
				} else if (fstatus === "0") {
					return "green";
				}	
		},

		erroFormart :  function (frro) {
				if (frro !== "") {
					return "sap-icon://error";
				} else {
					return "sap-icon://accept";
				}	
		},

		erroFormartColor :  function (frro) {
				if (frro !== "") {
					return "red";
				} else if (frro === "") {
					return "green";
				}	
		}
	};

	//return Formatter;

}, /* bExport= */ true);
