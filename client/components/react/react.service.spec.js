'use strict';

describe('Service: react', function () {

  // load the service's module
  beforeEach(module('nodeServerApp'));

  // instantiate service
  var react;
  beforeEach(inject(function (_react_) {
    react = _react_;
  }));

  it('should do something', function () {
    expect(!!react).toBe(true);
  });

});
