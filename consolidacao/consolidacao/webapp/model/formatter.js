sap.ui.define(function() {
	"use strict";

	return  {

		slaFormat :  function (fsla) {
				if (fsla < 0) {
					return "Error";
				} else if (fsla < 2) {
					return "Warning";
				} else {
					return "None";
				}		
		},

		statusFormart :  function (fstatus) {
				if (fstatus === "2" || fstatus === "3") {
					return "sap-icon://warning2";
				} else if (fstatus === "1") {
					return "sap-icon://accept";
				}	
		},

		statusFormartColor :  function (fstatus) {
				if (fstatus === "3") {
					return "red";
				} else if (fstatus === "2") {
					return "yellow";	
				} else if (fstatus === "1") {
					return "green";
				}	
		},

		erroFormart :  function (frro) {
				if (frro !== "") {
					return "sap-icon://warning2";
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
		},

		erroMatFormat :  function (frro) {
				if (frro === "3") {
					return "sap-icon://error";
				} else if (frro === "2") {
					return "sap-icon://message-warning";
				} else {
					return "sap-icon://accept";
                }	
                frro = "";
		},

		erroMatColor :  function (frro) {
				if (frro === "3") {
					return "red";
				} else if (frro === "2") {
					return "yellow";
				} else {
					return "green";
				}	
                frro = "";
		}
	};

	//return Formatter;

}, /* bExport= */ true);
