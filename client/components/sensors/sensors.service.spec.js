'use strict';

describe('Service: sensors', function () {

  // load the service's module
  beforeEach(module('nodeServerApp'));

  // instantiate service
  var sensors;
  beforeEach(inject(function (_sensors_) {
    sensors = _sensors_;
  }));

  it('should do something', function () {
    expect(!!sensors).toBe(true);
  });

});
