sap.ui.define([
    "sap/ui/core/library"
], function(library) {
    'use strict';

    return {
        buttonIconFormatter: function(aMessages) {
            var sIcon;

			aMessages.forEach(function (sMessage) {
				switch (sMessage.type) {
					case library.MessageType.Error:
						sIcon = "sap-icon://error";
						break;
					case library.MessageType.Warning:
						sIcon = sIcon !== "sap-icon://error" ? "sap-icon://alert" : sIcon;
						break;
					case library.MessageType.Success:
						sIcon = "sap-icon://error" && sIcon !== "sap-icon://alert" ? "sap-icon://sys-enter-2" : sIcon;
						break;
					default:
						sIcon = !sIcon ? "sap-icon://information" : sIcon;
						break;
				}
			});

			return sIcon;
        },
        buttonTypeFormatter: function(aMessages) {
            var sHighestSeverityIcon;

			aMessages.forEach(function (sMessage) {
				switch (sMessage.type) {
					case library.MessageType.Error:
						sHighestSeverityIcon = "Negative";
						break;
					case library.MessageType.Warning:
						sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" ? "Critical" : sHighestSeverityIcon;
						break;
					case library.MessageType.Success:
						sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" && sHighestSeverityIcon !== "Critical" ?  "Success" : sHighestSeverityIcon;
						break;
					default:
						sHighestSeverityIcon = !sHighestSeverityIcon ? "Neutral" : sHighestSeverityIcon;
						break;
				}
			});

			return sHighestSeverityIcon;
        },
        highestSeverityMessages: function(aMessages) {
            var sHighestSeverityIconType = this.formatter.buttonTypeFormatter(aMessages);
			var sHighestSeverityMessageType;

			switch (sHighestSeverityIconType) {
				case "Negative":
					sHighestSeverityMessageType = "Error";
					break;
				case "Critical":
					sHighestSeverityMessageType = "Warning";
					break;
				case "Success":
					sHighestSeverityMessageType = "Success";
					break;
				default:
					sHighestSeverityMessageType = !sHighestSeverityMessageType ? "Information" : sHighestSeverityMessageType;
					break;
			}

			return aMessages.reduce(function(iNumberOfMessages, oMessageItem) {
				return oMessageItem.type === sHighestSeverityMessageType ? ++iNumberOfMessages : iNumberOfMessages;
			}, 0);
        }
    }
});