'use strict';

describe('Service: Values', function () {

  // load the service's module
  beforeEach(module('nodeServerApp'));

  // instantiate service
  var values;
  beforeEach(inject(function (_values_) {
    values = _values_;
  }));

  it('should do something', function () {
    expect(!!values).toBe(true);
  });

});
