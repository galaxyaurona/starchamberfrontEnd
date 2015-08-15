'use strict';

describe('Service: concernService', function () {

  // load the service's module
  beforeEach(module('starChamberUiApp'));

  // instantiate service
  var concernService;
  beforeEach(inject(function (_concernService_) {
    concernService = _concernService_;
  }));

  it('should do something', function () {
    expect(!!concernService).toBe(true);
  });

});
