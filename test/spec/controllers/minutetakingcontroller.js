'use strict';

describe('Controller: MinutetakingcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('starChamberUiApp'));

  var MinutetakingcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MinutetakingcontrollerCtrl = $controller('MinutetakingcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
