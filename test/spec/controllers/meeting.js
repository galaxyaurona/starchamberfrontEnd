'use strict';

describe('Controller: MeetingctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('starChamberUiApp'));

  var MeetingctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MeetingctrlCtrl = $controller('MeetingctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
