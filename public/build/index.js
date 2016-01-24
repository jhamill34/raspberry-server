angular.module('HomeAutomation', [])
.controller('PinController', ['$scope', '$http', function($scope, $http){
  $scope.pins = [];
  $scope.addPin = function(){
    var pin = parseInt($scope.newPin);
    if(pin){
      $scope.pins.push($scope.newPin);
    }
  };
}])
.service('PinService', ['$http', function($http){
  this.openPin = function(pinNumber){
    return $http({
      method: 'GET',
      url: '/open/' + pinNumber
    });
  };

  this.closePin = function(pinNumber){
    return $http({
      method: 'GET',
      url: '/close/' + pinNumber
    });
  };

  this.turnOn = function(pinNumber){
    return $http({
      method: 'GET',
      url: '/on/' + pinNumber
    });
  };

  this.turnOff = function(pinNumber){
    return $http({
      method: 'GET',
      url: '/on/' + pinNumber
    });
  };
}])
.controller('PinActionController', ['$scope', 'PinService', function($scope, PinService){
  $scope.active = false;
  $scope.open = false;

  $scope.toggle = function(){
    if($scope.open){
      $scope.active = !$scope.active;
      if($scope.active){
        PinService.turnOn($scope.pinNumber).success(function(res){});
      }else{
        PinService.turnOff($scope.pinNumber).success(function(res){});
      }
    }
  };

  $scope.close = function(){
    if($scope.open){
      $scope.open = false;
      PinService.closePin($scope.pinNumber).success(function(res){});
    }
  };

  $scope.openUp = function(){
    $scope.open = true;
    PinService.openPin($scope.pinNumber).success(function(res){});
  };
}])
.directive('pinAction', function(){
    var link = function(scope, element, attrs){};

    return {
      restrict: 'E',
      link: link,
      scope:{
        pinNumber : '='
      },
      templateUrl: '/templates/pinActions.html',
      controller: 'PinActionController'
    }
});
