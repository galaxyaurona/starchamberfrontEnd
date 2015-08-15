'use strict';

describe('Service: RESTService', function () {

  // load the service's module
  beforeEach(module('starChamberUiApp'));

  // instantiate service
  var RESTService;
  beforeEach(inject(function (_RESTService_) {
    RESTService = _RESTService_;
  }));

  it('should do something', function () {
    expect(!!RESTService).toBe(true);
  });

});
