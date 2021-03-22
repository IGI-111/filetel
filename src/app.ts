import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
  public router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.title = 'file.tel';
    config.map([
      {
        route: '*path',
        name: 'download',
        moduleId: PLATFORM.moduleName('./download'),
      },
      {
        route: '',
        name: 'upload',
        moduleId: PLATFORM.moduleName('./upload'),
      },
    ]);
  }
}
