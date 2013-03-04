'use strict';

angular.module('drupal', ['ngResource'])
  .factory('Drupal', function($resource){
    var Drupal = $resource('http://osmna/admin/structure/holmes/:what');
    return Drupal;
    } );


var dropMeta = angular.module('dropMeta', ['drupal'])
dropMeta.config(function ($routeProvider) {
  $routeProvider
    .when('/fields', {
      templateUrl: 'partials/fields.html',
      controller: 'FieldsCtrl'
    })
    .when('/ents', {
      templateUrl: 'partials/ents.html',
      controller: 'EntsCtrl'
    })      
    .when('/about', {
      templateUrl: 'partials/about.html',
      controller: 'AboutCtrl'
    })      
    .when('/hooks', {
      templateUrl: 'partials/hooks.html',
      controller: 'HooksCtrl'
    })      
    .otherwise({
      redirectTo: '/about'
    });
});

dropMeta.directive('dmPropTable', function(){
  return {
    restrict: 'E',
    scope: {
      props : '@',
      properties: '=prp',
    },
    template:
    '<table><tr ng-repeat="(name, val) in properties"><td>{{name}}</td><td>{{val}}</td></tr></table>'
  }
});


function MainMenu($scope) {
  $scope.menu = ['about', 'fields', 'ents', 'hooks','modules']
}

function AboutCtrl($rootScope, $scope, Drupal) {
  
}

function HooksCtrl($rootScope, $scope, Drupal) {}

function EntsCtrl($rootScope, $scope, Drupal) {
    $scope.ents = Drupal.query({what: 'ents'});
    $scope.selectRow = function(index) {
      $scope.selrow = $scope.ents[index];
      console.log(index);
    }
  }

function FieldsCtrl($rootScope, $scope, Drupal) {
    $scope.selectedRow = 0;
    $scope.rowClass = new Object();
    $scope.fields = Drupal.query({what: 'fields'});
    $scope.selectRow = function(index) {
      $scope.selectedRow = index;
      $scope.selrowProps = new Object();
      angular.extend($scope.selrowProps, $scope.fields[index]);
      $scope.selrowStore = $scope.selrowProps.storage;
      if($scope.selrowProps.storage) {
        $scope.selrowStoreDet = $scope.selrowProps.storage.details;
        delete $scope.selrowStore.details;
      }
      $scope.selrowCols = $scope.selrowProps.columns;
      $scope.selrowSet = $scope.selrowProps.settings;
      $scope.selrowDet = $scope.selrowProps.details;
      delete $scope.selrowProps.storage;
      delete $scope.selrowProps.columns;
      delete $scope.selrowProps.settings;
      delete $scope.selrowProps.details;
    }
  };
