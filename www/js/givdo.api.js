(function () {
  'use strict';

  angular.module('givdo.api', ['json-api-client', 'givdo.config'])
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
    }])

    .factory('Oauth', ['repository', 'GivdoApiURL', function (repository, GivdoApiURL) {
      return repository({
        callback: {url: GivdoApiURL + '/oauth/{{provider}}/callback', method: 'POST', auth: false}
      });
    }])

    .factory('UserRepo', ['repository', 'GivdoApiURL', function (repository, GivdoApiURL) {
      return repository({
        friends: {url: GivdoApiURL + '/friends', method: 'GET'}
      });
    }])

    .factory('GameRepo', ['repository', 'GivdoApiURL', function (repository, GivdoApiURL) {
      var GameRepo = repository({
        singlePlayer: {url: GivdoApiURL + '/games/single'},
        versus: {url: GivdoApiURL + '/games/versus/{{uid}}', params: false},
        query: {url: GivdoApiURL + '/games'}
      });

      GameRepo.answer = function (game, trivia, option) {
        return game.load('answers', {data: {trivia_id: trivia.id, trivia_option_id: option.id}, method: 'POST'});
      };

      GameRepo.playFor = function (game, organization) {
        return game.load('player', {data: {organization_id: organization.id}, method: 'PATCH'});
      };

      return GameRepo;
    }])

    .factory('OrganizationRepo', ['repository', 'GivdoApiURL', function (repository, GivdoApiURL) {
      return repository({
        query: {url: GivdoApiURL + '/organizations'}
      });
    }])

    .factory('givdo', ['Oauth', 'UserRepo', 'GameRepo', 'OrganizationRepo', function (Oauth, UserRepo, GameRepo, OrganizationRepo) {
      return {
        oauth: Oauth,
        user: UserRepo,
        game: GameRepo,
        organizations: OrganizationRepo
      };
    }]);
})();
