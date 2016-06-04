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

  this.turnOn = function(pinNumber){
    return $http({
      method: 'GET',
      url: '/on/' + pinNumber
    });
  };

  this.turnOff = function(pinNumber){
    return $http({
      method: 'GET',
      url: '/off/' + pinNumber
    });
  };
}])
.controller('PinActionController', ['$scope', 'PinService', function($scope, PinService){
  $scope.active = false;
  $scope.open = true;

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
