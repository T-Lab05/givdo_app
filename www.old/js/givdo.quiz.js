(function () {
  'use strict';

  angular
    .module('givdo.quiz', [
      'givdo.api',
      'givdo.util',
      'givdo.facebook',
      'jett.ionic.filter.bar'
    ])
    .config(config)
    .directive('gameScore', gameScore)
    .service('QuizRound', QuizRound)
    .service('Survey', Survey)
    .controller('SponsorCtrl', SponsorCtrl)
    .controller('SurveyCtrl', SurveyCtrl)
    .controller('ShowGameCtrl', ShowGameCtrl)
    .controller('NewGameCtrl', NewGameCtrl)
    .controller('ChallengeFriendCtrl', ChallengeFriendCtrl)
    .controller('TriviaCtrl', TriviaCtrl)
    .controller('GameHistoryCtrl', GameHistoryCtrl);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
      $stateProvider
        .state('game-history', {
          url: '/game-history',
          parent: 'app',
          views: {
            'quiz-content': {
              templateUrl: 'templates/quiz/game-history.html',
              controller: 'GameHistoryCtrl'
            }
          }
        })
        .state('play', {
          url: '/play',
          parent: 'app',
          data: { protected: true },
          views: {
            'quiz-content': {
              templateUrl: 'templates/quiz/new-game.html',
              controller: 'NewGameCtrl'
            }
          }
        })
        .state('challenge', {
          url: '/challenge',
          parent: 'app',
          views: {
            'quiz-content': {
              templateUrl: 'templates/quiz/challenge.html',
              controller: 'ChallengeFriendCtrl'
            }
          }
        })
        .state('sponsor', {
          url: '/sponsor',
          parent: 'app',
          views: {
            'quiz-content': {
              templateUrl: 'templates/quiz/sponsor.html',
              controller: 'SponsorCtrl'
            }
          },
          resolve: {
            game: function(QuizRound) { return QuizRound.game(); }
          }
        })
        .state('survey', {
          url: '/survey',
          parent: 'app',
          views: {
            'quiz-content': {
              templateUrl: 'templates/quiz/survey.html',
              controller: 'SurveyCtrl'
            }
          }
        })
        .state('show-game', {
          url: '/game',
          parent: 'app',
          views: {
            'quiz-content': {
              templateUrl: 'templates/quiz/show-game.html',
              controller: 'ShowGameCtrl'
            }
          },
          resolve: {
            game: function(QuizRound) { return QuizRound.game(); }
          }
        })
        .state('trivia', {
          url: '/trivia',
          parent: 'app',
          cache: false,
          views: {
            'quiz-content': {
              templateUrl: 'templates/quiz/trivia.html',
              controller: 'TriviaCtrl'
            }
          },
          resolve: {
            trivia: function(QuizRound) { return QuizRound.trivia(); },
            game: function(QuizRound) { return QuizRound.game(); }
          }
        });
    }

    function gameScore() {
      return {
        restrict: 'E',
        scope: {
          game: '=game',
          eventHandler: '&ngClick'
        },
        templateUrl: 'templates/quiz/directives/game-score.html',
        link: function (scope, element) {
          scope.players = scope.game.relation('players');
        }
      };
    }

    QuizRound.$inject = ['$state', '$q', 'givdo', 'OrganizationPicker'];

    function QuizRound($state, $q, givdo, OrganizationPicker) {
      var currentGame, currentTrivia, currentPlayer;

      var setCurrentGame = function(game) {
        currentGame = game;
        currentTrivia = game.relation('trivia');
        currentPlayer = game.relation('player');
      };

      var revealAnser = function(answer) {
        (currentTrivia.relation('options') || []).forEach(function (option) {
          option.attributes.correct = option.id == answer.attr('correct_option_id');
        });
      };

      var asPromised = function(value) {
        if (value) {
          return $q.resolve(value);
        }
        return $q.reject();
      };

      var savePlayerOrganization = function(organization) {
        return givdo.game.playFor(currentGame, organization);
      };

      var self = {
        trivia: function() {
          return asPromised(currentTrivia);
        },
        game: function() {
          return asPromised(currentGame);
        },
        continue: function(newGame) {
          if (newGame) {
            setCurrentGame(newGame);
          }
          if (currentPlayer.attr('finished?')) {
            $state.go('sponsor', {}, { reload: true });
          } else if (currentPlayer.attr('organization')) {
            $state.go('trivia', {}, {reload: true});
          } else {
            OrganizationPicker.open().then(savePlayerOrganization).then(self.continue);
          }
        },
        answer: function(option) {
          return givdo.game.answer(currentGame, currentTrivia, option).then(function (answer) {
            revealAnser(answer);
            setCurrentGame(answer.relation('game'));
            return answer;
          });
        }
      };

      return self;
    }

    SponsorCtrl.$inject = ['$state', '$scope', '$stateParams', 'game'];

    function SponsorCtrl($state, $scope, $stateParams, game) {
      $scope.winner = game.relation('player').attr('winner?');
      $scope.players = game.relation('players');
      $scope.showResult = function () {
        $state.go('show-game', {}, {reload: true});
      };
    }

    SurveyCtrl.$inject = ['$state', '$scope', '$stateParams', '$http', 'GivdoApiURL'];

    function SurveyCtrl($state, $scope, $stateParams, $http, GivdoApiURL) {
      $scope.survey = [];

      $scope.like_app = [
        'Playing trivia',
        'Playing against friends',
        'Knowing my points are donated to charity',
        'Swiping and learning about nonprofits',
        'Winning badges',
        'Being able to log in easily with FaceBook',
        'The look of the app',
        'Being able to see my total giving across orgs'
      ]

      $scope.surveyForm = function(survey) {
        $scope.survey = {
          difficulty:        survey.difficulty,
          play:              survey.play,
          nonprofit:         survey.nonprofit,
          questions:         survey.questions,
          back_to_play:      survey.back_to_play,
          length_play:       survey.length_play,
          like_app:          survey.like_app,
          sponsor:           survey.sponsor,
          bugs:              survey.bugs,
          recommend_frinend: survey.recommend_frinend
        };

        $http
          .post(GivdoApiURL + '/api/v1/surveys', { answers: $scope.survey })
          .then(function () {
            $state.go('play', {}, { reload: true });
          });
      };
    }

    ShowGameCtrl.$inject = [
      '$scope',
      '$stateParams',
      'game',
      'facebook',
      'givdo',
      'QuizRound'
    ];

    function ShowGameCtrl($scope, $stateParams, game, facebook, givdo, QuizRound) {
      $scope.winner = game.relation('player').attr('winner?');
      $scope.players = game.relation('players');
      $scope.points = game.relation('player').attr('score');
      $scope.playSingle = function () {
        givdo.game.singlePlayer().then(QuizRound.continue);
      };
    }

    Survey.$inject = ['$cordovaInAppBrowser'];

    function Survey($browser) {
      var service = {
        show: show,
      };

      return service;

      function show() {
        var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'yes'
        };

        return $browser.open('https://givdo.typeform.com/to/vZf8Nq', '_blank', options);
      }
    }

    NewGameCtrl.$inject = ['$state', '$scope', 'facebook', 'givdo', 'QuizRound', 'Survey'];

    function NewGameCtrl($state, $scope, facebook, givdo, QuizRound, Survey) {
      $scope.playSingle = function () {
        givdo.game.singlePlayer()
        .then(QuizRound.continue)
        .catch(Survey.show);
      };
    }

    ChallengeFriendCtrl.$inject = ['$scope', 'facebook', 'givdo', 'QuizRound', 'Survey'];

    function ChallengeFriendCtrl($scope, facebook, givdo, QuizRound, Survey) {
      givdo.user.friends().then(function (friends) {
        $scope.friends = friends.relation('users');
      });

      $scope.invite = facebook.invite;

      $scope.challenge = function (friend) {
        givdo.game.versus(friend)
          .then(QuizRound.continue)
          .catch(Survey.show);
      };
    }

    TriviaCtrl.$inject = [
      '$scope',
      '$ionicLoading',
      '$ionicNavBarDelegate',
      '$interval',
      'QuizRound',
      'trivia',
      'game'
    ];

    function TriviaCtrl($scope, $ionicLoading, $ionicNavBarDelegate, $interval, QuizRound, trivia, game) {
      $scope.progressval = 0;
      $scope.timer = 12;
      $scope.stopinterval = null;

      $scope.updateProgressbar = function()
      {
        startprogress();
      }

      function startprogress()
      {
        $scope.class = 'play';
        $scope.progressval = 0;

        if ($scope.stopinterval)
        {
          $interval.cancel($scope.stopinterval);
        }

        $scope.stopinterval = $interval(function() {
          $scope.progressval = $scope.progressval + 1;

          if($scope.progressval >= $scope.timer) {
            $interval.cancel($scope.stopinterval);

            $ionicLoading.show();

            QuizRound.answer('').then(function () {
              $scope.answer.submitted = true;
              $ionicLoading.hide();
            });

            return;
          }

        }, 1000);
      }

      function stopProgress()
      {
        $scope.progressval = 0;
        $interval.cancel($scope.stopinterval);
        $scope.class = 'pause';
      }

      startprogress();

      $ionicNavBarDelegate.showBackButton(false);

      $scope.submitAnswer = function () {
        $ionicLoading.show();

        QuizRound.answer($scope.answer.option).then(function () {
          stopProgress()

          $scope.answer.submitted = true;
          $ionicLoading.hide();
        });
      };

      $scope.answer = {};
      $scope.next = QuizRound.continue;
      $scope.trivia = trivia;
      $scope.options = trivia.relation('options');
      $scope.players = game.relation('players');
    }

    GameHistoryCtrl.$inject = ['$scope', 'givdo', 'QuizRound'];

    function GameHistoryCtrl($scope, givdo, QuizRound) {
      givdo.game.query().then(function (games) {
        $scope.games = games;
      });
      $scope.openGame = QuizRound.continue;
    }
})();
