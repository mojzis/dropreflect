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
    .when('/styles', {
      templateUrl: 'partials/styles.html',
      controller: 'StylesCtrl'
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
  $scope.menu = ['about', 'fields', 'ents', 'hooks','modules','styles'];
}

function AboutCtrl($rootScope, $scope, Drupal) {
  
}

function HooksCtrl($rootScope, $scope, Drupal) {}

function EntsCtrl($rootScope, $scope, Drupal) {
  $scope.ents = Drupal.query({what: 'ents'});
  $scope.selectRow = function(index) {
    $scope.selrow = $scope.ents[index];
  }
}

function StylesCtrl($rootScope, $scope, Drupal) {
  $scope.styles = Drupal.query({what: 'styles'});
  $scope.selectRow = function(index) {
    $scope.selectedRow = index;
    $scope.selrowProps = new Object();
    angular.extend($scope.selrowProps, $scope.styles[index]);
    $scope.selrowEffects = new Object();
    angular.forEach($scope.selrowProps.effects, function(eff) {
      $scope.selrowEffects[eff.label] = eff.data
    })
    
    delete $scope.selrowProps.effects;
  }  
}

function FieldsCtrl($rootScope, $scope, Drupal) {
  $scope.selectedRow = 0;
  $scope.fields = Drupal.query({what: 'fields'});
  $scope.selectRow = function(index) {
    $scope.selectedRow = index;
    $scope.selrowProps = new Object();
    // todo : find a way for the other data to be cleared on each row, too (selrowCols ...)
    // or do a transform immediately upon receiving the data ?
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