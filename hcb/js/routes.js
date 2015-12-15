(function() {
  var renderConfig, routeConfig;

  routeConfig = function($routeProvider, $locationProvider, configs) {
    $routeProvider.when('/', {
      templateUrl: configs.tplRoot + "/app/index.html"
    }).when('/pages', {
      action: 'pages.index',
      templateUrl: configs.tplRoot + "/pages/index.html"
    }).when('/pages/publish', {
      action: 'pages.publish',
      templateUrl: configs.tplRoot + "/pages/publish.html"
    }).when('/pages/new', {
      action: 'pages.new',
      templateUrl: configs.tplRoot + "/pages/edit.html"
    }).when('/pages/:id', {
      action: 'pages.edit',
      templateUrl: configs.tplRoot + "/pages/edit.html"
    }).when('/debug', {
      templateUrl: "debug.html"
    }).otherwise({
      redirectTo: '/'
    });
    return $locationProvider.html5Mode(false);
  };

  routeConfig.$inject = ['$routeProvider', '$locationProvider', 'configs'];

  renderConfig = function($rootScope, $location, $route, $routeParams) {
    var render;
    render = function($currentRoute, $previousRoute) {
      var belongsToCampaigns, belongsToContents, belongsToDomains, belongsToTransactions, renderAction, renderPath;
      renderAction = $route.current.action;
      if (renderAction != null) {
        renderPath = renderAction.split('.');
        belongsToCampaigns = renderPath[0] === 'campaigns';
        belongsToContents = renderPath[0] === 'contents';
        belongsToDomains = renderPath[0] === 'domains';
        belongsToTransactions = renderPath[0] === 'transactions';
        $rootScope.renderAction = renderAction;
        $rootScope.renderPath = renderPath;
        $rootScope.belongsToCampaigns = belongsToCampaigns;
        $rootScope.belongsToContents = belongsToContents;
        $rootScope.belongsToDomains = belongsToDomains;
        return $rootScope.belongsToTransactions = belongsToTransactions;
      }
    };
    return $rootScope.$on('$routeChangeSuccess', render);
  };

  renderConfig.$inject = ['$rootScope', '$location', '$route', '$routeParams', 'configs'];

  angular.module('HCB').run(renderConfig).config(routeConfig);

}).call(this);
