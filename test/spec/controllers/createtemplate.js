'use strict';

describe('Controller: CreatetemplateCtrl', function () {

  // load the controller's module
  beforeEach(module('starChamberUiApp'));

  var CreatetemplateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreatetemplateCtrl = $controller('CreatetemplateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
