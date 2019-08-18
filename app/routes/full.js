import Route from '@ember/routing/route';
import fetch from 'fetch';

const ECOSYSTEM_URL = 'https://gist.githubusercontent.com/abdullacontractor/e602389520e733759d41057d2ea1a761/raw/01641bf803d12ab6b0fb89e6ec5b6fd6e034decf/tg-ecosystem.json';

export default class FullRoute extends Route {
  async model() {
    let response = await fetch(ECOSYSTEM_URL);
    return response.json();
  }
}
