'use strict';

describe('Controller: SensorsCtrl', function () {

  // load the controller's module
  beforeEach(module('nodeServerApp'));

  var SensorsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SensorsCtrl = $controller('SensorsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
