
# Levels of Achievements

i. “Giver” $1 (100 givcoins)

ii. “Samaritan” $5 (500 givcoins)

iii. “Patron” $250 (25,000 givcoins)

iV. “Altruist” $25 (2500 givcoins)

v. “Benefactor” $100 (10,000 givcoins)

vi. “Grantor” $500 (50,000 givcoins)

vii. “Philanthropist” $1,000 (100,000 givcoins)

# Givdo App Status as of December, 2017

The original Givdo app was built with the Ionic v.1 framework with AngularJS, utilizing a Ruby
on Rails backend API server. When Ionic v.2 was released using Angular (as opposed to the
former AngularJS), the original developers planned to migrate the app to Ionic v.2, and they
abandoned the old v.1 codebase. They created a new Givdo v.2 application and gave it a user
interface with basic page templates filled with static data, which they meant to serve as
placeholders until the rest of the code could be added. However, the developers did not finish
the migration process, and at some point the old codebase stopped working due to
configuation changes and lack of maintenance.

So now, what we have is the basic Givdo v.2 app created in the beginning of the migration
process (which contains static data hardcoded into the pages), as well as the old, originally
working AngularJS code. We are in the process of rewriting the app functionality using the old
v.1 code, and adding this functionality to the Givdo v.2 app.

You can start the app server with any of several Ruby on Rails commands, but I usually use
'rails server -b 0.0.0.0'. This will start Rails in development mode and instruct it to bind
to all IP addresses on your machine, using the default port of 3000. So to view the running
server you can navigate to http://0.0.0.0:3000. (If Rails starts the server on a port other than
3000, it probably means you have duplicate servers running and you should close them out and
start over.)

With the server running, you can start the app using simply 'ionic serve –lab', which will
start the app in the Ionic lab on your default browser. However, since Angular was developed by
Google, there are a lot of Angular development tools available within Google Chrome which
you cannot find in other browsers. It is therefore usually preferable to work within Chrome for
development purposes. If you have a default browser other than Chrome, you can tell Ionic to
start the app in Chrome by using 'ionic serve --lab -w Chrome'. If you have problems with
this command, you can also try the following:

$ ionic serve --lab --browser "google chrome"
$ ionic serve --lab --browser chrome

Alternatively, you can just open Chrome manually and navigate the address where it is running
the app.

To start the Google development tools, press 'Ctrl + Shif + I' within Chrome and dock the
window where you want it (usually at the bottom of the screen).

# STRUCTURE OF THE APP

Ionic v.1 required source code to be placed in a folder of the app called /www, while Ionic v.2 - v.3
provides a folder called /src for this. In Ionic 2 and 3, the /www folder is not used by developers
and contains code generated by the transpiler at runtime (any code placed in /www will be
overwritten by the system). Because of this, the old devs decided to place the old code in a
folder of the new app called /www.old, where it currently resides in the givdo-app repository.
The app consists of five main pages: Activity, Friends, Notifications, Profile, and Quiz. These
pages are all accessable through Ionic tabs (and within Ionic, 'tabs' itself is a page, which
contains references to the user-created pages). There is also an organization modal through
which you can select your charitable organization, and v.1 contains code for various utililty
pages which have mostly be consoldated elsewhere, so we don't have to worry about making
separate pages for them in v.2. In the v.2 app, all of the pages are located in the /src/pages
folder. In v.1, the models/logic for each page (.js files) are in /www.old/js/, while the
corresponding views (.html files) are in /www.old/templates.

# CONTROLLERS

Consistent with the Model-View-Controller format to which Ionic apps conform, each of view in
the app also has a corresponding controller. Each controller is responsible for updating a view,
which is typically a page of the application. We will need to extract the controller logic from the
old code in www.old, translate it to the new Angular, and incorporate it into the .ts files for the
corresponding page to which it belongs in new app.
In the original version of the Givdo app, there are 18 separate controllers located in 10 diferent
files. The locations of these files are as follows:

/www.old/js/activities/activities.controller.js
/www.old/js/notifications/notifications.controller.js
/www.old/js/welcome/welcome.controller.js
/www.old/js/friends/friends.controller.js

The file friends.controller.js holds the controller for the Friends page and updates the view at
/www.old/js/friends/index.html, however, we also have a separate controller for seeing
information about an individual friend:
/www.old/js/friends/friend.controller.js
This controller updates the view at /www.old/js/friends/show.html.

There is also code for multiple controllers in each of the following locations:

/www.old/js/givdo.quiz.js (This is the code for the Quiz page; contains 7 controllers)
/www.old/js/givdo.user.js (Most of this is relevant to the Profile page.)
/www.old/js/givdo.auth.js (Authorization code, already implemented in v.2)
/www.old/js/givdo.util.js (For choosing charitable organization)
/www.old/js/givdo.js (App entry point; provides a menu)

All the controller code in these files will be preceeded by '.controller' headings.
The above mentioned files represent the locations of all the controllers in our application. A
concise listing of each controller and the view it updates is given here (all are located in
/www.old):

js/activities/activities.controller.js > templates/activities/index.html
js/notifications/notifications.controller.js > templates/notifications/index.html
js/welcome/welcome.controller.js > templates/welcome/index.html
js/friends/friends.controller.js > js/friends/index.html
js/friends/friend.controller.js > js/friends/show.html

/www.old/js/givdo.quiz.js:
SponsorCtrl > templates/quiz/sponsor.html
SurveyCtrl > templates/quiz/survey.html
ShowGameCtrl > templates/quiz/show-game.html
NewGameCtrl > templates/quiz/new-game.html
ChallengeFriendCtrl > templates/quiz/challenge.html
TriviaCtrl > templates/quiz/trivia.html
GameHistoryCtrl > templates/quiz/game-history.html
/www.old/js/givdo.user.js:
ActivityCtrl > n/a, just calculates scores, wins and losses and stores them
ProfileCtrl > templates/user/profile.html
ModalCausesCtrl > templates/util/choose-cause.html
/www.old/js/givdo.auth.js:
FacebookLoginCtrl > templates/auth/login.html
/www.old/js/givdo.util.js:
ChooseOrganizationCtrl > templates/util/choose-organization.html
/www.old/js/givdo.js:
MenuBarCtrl > templates/menu.html

# IMPORTANT FILES

Besides controllers, several of the files mentioned above also contain essential game logic and
user data which needs to be translated and added to the appropriate place in the new app.
These are as follows:
/www.old/js/givdo.quiz.js (Quiz implementation: needs to go in /src/pages/quiz.)
/www.old/js/givdo.user.js (Profile data, for /src/pages/profile.)
/www.old/js/givdo.auth.js (Authorization code, already implemented in v.2.)
/www.old/js/givdo.util.js (/src/pages/organization-modal)

# FACTORIES AND SERVICES

In AngularJS, a factory is a specific type of service, which is simply an object where you can
store data and pass it between diferent parts of the app. With factories and services, you define
some attribute or attributes and give them a value, ofen also performing operations on the
data. The original Givdo app has factories at the following locations that should be noted:

/www.old/js/auth/session.interceptor.js
/www.old/js/auth/session.service.js
/www.old/js/givdo.api.js
/www.old/js/givdo.auth.js
/www.old/js/givdo.facebook.js
/www.old/js/givdo.notifications.js
/www.old/js/givdo.util.js
We also have additional services here:
/www.old/js/auth/auth.service.js
/www.old/js/givdo.quiz.js

In general, the factories and services in the old app need to be converted to Ionic 2 providers.
Providers perform the same function as services, but are implemented as objects, so they store
information as simple class instance data. This can be accomplished by creating a new provider
with the Ionic command line using the following:
ionic g provider provider_name
This will create a new file in /src/providers, into which the functionality can be added. (As
mentioned already, the Facebook authorization has been handled already and so the auth
services will not need to be converted. They are included in this listing only for completeness.)

# REPOSITORIES

The way in which the v.1 app handles database communication is through the use of
repositories, which the original developers built using factories. Repositories act as an
intermediate layer between the app logic and the data source, i.e. the database. For data that
needs to go into the database for persistent storage, repositories are a staging ground where
the data is stored temporarily before it is added to the database using our server api. First, user
and game data is stored in a local object, then it is passed to the repository. In the case of data
needing to be retrieved from the database, the repository handles the retrieval before passing
the data into an object that can be used by the app. In both cases, it is the repository that
interacts with the database.

The following is a list of the repositories in use by the app:
/www.old/js/api/cause.repository.js
/www.old/js/api/device.repository.js
/www.old/js/api/game.repository.js
/www.old/js/api/oauth.repository.js
/www.old/js/api/organization.repository.js
/www.old/js/api/user.repository.js
/www.old/js/api/notification.repository.js
The following files interact with the repositories:
/www.old/js/givdo.ap1.js
/www.old/js/givdo.user.js

In order to have any means of communicating with the database, the repositories need to be
implemented in the v.2 app.

# NEXT STEPS

In conclusion, to continue rewriting the app, we currently need to focus on three things:
1) Transfer the controllers, game logic, and user implementation code to the appropriate
pages in the new app.
2) Replace factories and services with Ionic 2 providers.
3) Implement the repositories in the new app.


--------------
OLD INSTRUCTIONS:

# Givdo App

[![CircleCI](https://circleci.com/gh/Givdo/givdo_app.svg?style=svg)](https://circleci.com/gh/Givdo/givdo_app)

## Getting started
### Installation

> Before proceeding with the installation make sure that [givdo_api_server](https://github.com/Givdo/givdo_api_server) is setup and running.

1) [Install yarn](https://yarnpkg.com/en/docs/install)

2) Clone or update your working copy:

```
$ git clone git@github.com:Givdo/givdo_app.git && cd givdo_app
```

3) Run the following commands to get your environment set up:

```
$ yarn
$ ionic state reset
```

4) Edit `dev.ts` to tune configurations for development.

**Facebook IDs**

| Environment | ID |
| ------------ | ----------------- |
| Production | 536213639869188 |
| Development/Staging | 2103443323006031 |


### Running on a simulator

To run the app on a simulator, make sure you have the [server](https://github.com/Givdo/givdo_api_server) running on `localhost:3000`. To start the simulator run:

```
$ ionic run ios
```

### Running on a device

If you want to run on a device, make sure to update the configuration at `www/js/core/constants.js` as described in the section [Installation](#Installation). To start the on a device run:

```
$ ionic run ios
```

### Running the tests

To run the specs, first install the `karma-cli` tool globally.

```
$ npm install -g karma-cli
```

Depending on your setup, you might need to run the above with `sudo`.

Then running the specs should be as simple as:

```
$ karma start karma.conf.js
```

### Troubleshooting

In case of Ionic issues try `ionic state reset`.
