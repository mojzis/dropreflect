'use strict';

angular.module('drupal', ['ngResource'])
  .factory('Drupal', function($resource){
    var Drupal = $resource('http://osmna/admin/structure/holmes/:what');
    return Drupal;
    } );
// todo:
// add a "global" list of sites (saved in the browser)
// the default testdata will be added into it
// show the selected site from a dropdown
// allow to add a new site from the form
// check : 
// - if that site is accessible
// - if holmes module is installed
// - if the options return proper values (change the manifest of this ?)
// then load all the data, one per one, compare them to eventual previous version, mark the change


// TODO: connect menu and route provider in one 
// TODO: set header according to router second answer :
// http://stackoverflow.com/questions/12506329/how-to-dynamically-change-header-based-on-angularjs-partial-view
// TODO: assign active class in menu
// TODO: create a google analytics service, listening to routeChangeSuccess
// TODO: find a way of putting the name o the selected field into the adress, too
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
  // TODO: put some effects data into the basic list (first effect ? , size ...)
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
