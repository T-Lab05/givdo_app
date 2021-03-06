import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { QuizPage } from '../quiz/quiz';
import { ActivityPage } from '../activity/activity';
import { ProfilePage } from '../profile/profile';
import { FriendsPage } from '../friends/friends';
import { NotificationsPage } from '../notifications/notifications';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  quizTab = QuizPage;
  friendsTab = FriendsPage;
  profileTab = ProfilePage;
  activityTab = ActivityPage;
  notificationTab = NotificationsPage;

  constructor(private nav: NavController) {
  }

  ionViewCanEnter() {
    // Check if user is logged in
    // it gets called before all events
  }
}
