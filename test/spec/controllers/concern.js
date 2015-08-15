'use strict';

describe('Controller: ConcernCtrl', function () {

  // load the controller's module
  beforeEach(module('starChamberUiApp'));

  var ConcernCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConcernCtrl = $controller('ConcernCtrl', {
      $scope: scope
    });
  }));

});
