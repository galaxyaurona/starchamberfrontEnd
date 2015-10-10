'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:CreatetemplateCtrl
 * @description
 * # CreatetemplateCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('CreateTemplateCtrl', function ($scope,template,templateRESTService) {
    $scope.helloWorld = "Hello world";
    $scope.fontOptions = ['Times new roman','Helvetica','Courier'];
    $scope.items = {};
    console.log(template.data);
    angular.forEach(template.data.templateValues,function(value,key){
      $scope.items[value.textType] ={"font-family":"Helvetica"};
    })

    $scope.printDebug = function(){
      angular.forEach(template.data.templateValues,function(value,key){
        var originalData = $scope.items[value.textType];
        var font = "";
        switch (originalData["font-family"]){
          case "Times new roman": font = "TIMES";break;
          default: font=originalData["font-family"].toUpperCase();
        }
        var bold = originalData["font-weight"] == "bold" ? "T" : "F";
        var italic = originalData["font-style"] == "italic" ? "T" : "F";
        var fontSize = originalData["font-size"] == undefined ? 10 : originalData["font-size"];
        var color = originalData["color"] == undefined ? "255,255,255": originalData["color"].substring(4,originalData["color"].length-1);
        value.formatString = font+","+bold+","+italic+","+fontSize+","+color;
      })
      template.title= $scope.template.name;
      template.description = $scope.template.description;
      template.status = undefined;
      template.templateValues = template.data.templateValues;
      template.id = template.data.id;
      template.board = template.data.board;
      template.data = undefined ;

      templateRESTService.updateTemplate(template,function(response){
        alert(response);
      })
      console.log(template);
    }
  });
