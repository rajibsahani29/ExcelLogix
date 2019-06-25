(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("notificationsController", ["DataService", "$scope", "$rootScope", "$location", "SMAAlertFactory", "ProjectConstants", notificationsController]);

    function notificationsController(DataService, $scope, $rootScope, $location, SMAAlertFactory, ProjectConstants) {
        var notiC = this;

        notiC.showToast = showToast;
        notiC.notificationmessage = "";
        return notiC;
        
        //function showToast(notificationmessage, iconUrl) {
        function showToast() {
            if (typeof Windows !== 'undefined' &&
                typeof Windows.UI !== 'undefined' &&
                typeof Windows.UI.Notifications !== 'undefined') {
                var iconUrl = 'https://iaspire.iaspirebusiness.com/assets/images/iAspire-logo-2.png';
                var notifications = Windows.UI.Notifications;
                var template = notifications.ToastTemplateType.toastImageAndText01;
                var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
                var toastTextElements = toastXml.getElementsByTagName("text");
                toastTextElements[0].appendChild(toastXml.createTextNode(notiC.notificationmessage));
                var toastImageElements = toastXml.getElementsByTagName("image");
                var newAttr = toastXml.createAttribute("src");
                newAttr.value = iconUrl;
                var altAttr = toastXml.createAttribute("alt");
                altAttr.value = "toast graphic";
                var attribs = toastImageElements[0].attributes;
                attribs.setNamedItem(newAttr);
                attribs.setNamedItem(altAttr);
                var toast = new notifications.ToastNotification(toastXml);
                var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
                toastNotifier.show(toast);
            }
        }

        function updateTile(message, imgUrl, imgAlt) {
            if (typeof Windows !== 'undefined' &&
                typeof Windows.UI !== 'undefined' &&
                typeof Windows.UI.Notifications !== 'undefined') {
                var date = new Date();
                var notifications = Windows.UI.Notifications,
                    tile = notifications.TileTemplateType.tileSquare150x150PeekImageAndText01,
                    tileContent = notifications.TileUpdateManager.getTemplateContent(tile),
                    tileText = tileContent.getElementsByTagName('text');
                tileText[0].appendChild(tileContent.createTextNode(message || date.toTimeString()));
                var tileImage = tileContent.getElementsByTagName('image');
                var newAttr = tileContent.createAttribute("src");
                newAttr.value = imgUrl || 'https://unsplash.it/150/150/?random';
                var altAttr = tileContent.createAttribute("alt");
                altAttr.value = imgAlt || 'Random demo image';
                var attribs = tileImage[0].attributes;
                attribs.setNamedItem(newAttr);
                attribs.setNamedItem(altAttr);
                var tileNotification = new notifications.TileNotification(tileContent);
                var currentTime = new Date();
                tileNotification.expirationTime = new Date(currentTime.getTime() + 600 * 1000);
                notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
            }
        }


    }

})();