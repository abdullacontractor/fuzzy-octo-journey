import Route from '@ember/routing/route';
import fetch from 'fetch';

// const ECOSYSTEM_URL = 'https://gist.githubusercontent.com/abdullacontractor/e602389520e733759d41057d2ea1a761/raw/f3661ef04d7131418cec347c8370e6a042323f5c/tg-ecosystem.json';
const ECOSYSTEM_URL = '/tg-ecosystem.json';

export default class FullRoute extends Route {
  async model() {
    let response = await fetch(ECOSYSTEM_URL);
    return response.json();
  }
}
