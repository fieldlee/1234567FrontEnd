import { InstrumentPlatformPage } from './app.po';

describe('instrument-platform App', () => {
  let page: InstrumentPlatformPage;

  beforeEach(() => {
    page = new InstrumentPlatformPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
