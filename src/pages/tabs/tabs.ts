import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = LoginPage;
  tab2Root: any = AboutPage;

  constructor() {

  }
}
