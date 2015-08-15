'use strict';

describe('Service: minuteService', function () {

  // load the service's module
  beforeEach(module('starChamberUiApp'));

  // instantiate service
  var minuteService;
  beforeEach(inject(function (_minuteService_) {
    minuteService = _minuteService_;
  }));

  it('should do something', function () {
    expect(!!minuteService).toBe(true);
  });

});
