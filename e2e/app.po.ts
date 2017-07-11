import { browser, by, element } from 'protractor';

export class InstrumentPlatformPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
