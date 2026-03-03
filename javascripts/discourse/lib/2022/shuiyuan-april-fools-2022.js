/* eslint-disable no-unused-vars */
/* eslint-disable no-new */
import { isEnabled } from "../localstorage-config";
import { BugController, SpiderController } from "./bugs";

export default function initializer(api) {
  if (!settings.enable_easter_egg_2022) {
    return;
  }
  if (!isEnabled(2022)) {
    return;
  }

  let $maxFlies = settings.max_number_fruit_flies_2022;
  let $maxSpiders = settings.max_number_spiders_2022;
  let $minDelay = settings.delay_start_2022;
  let $maxDelay = settings.delay_start_2022;
  let $mouseOver = settings.mouseover_action_2022;
  let $canInteract = settings.bugs_can_interact_2022;

  let $flySprite = settings.theme_uploads.fly;
  let $spiderSprite = settings.theme_uploads.spider;

  if (settings.show_bugs_2022) {
    new BugController({
      minBugs: 1,
      maxBugs: $maxFlies,
      mouseOver: $mouseOver,
      minDelay: $minDelay,
      maxDelay: $maxDelay,
      imageSprite: $flySprite,
      canInteract: $canInteract,
    });
    new SpiderController({
      minBugs: 1,
      maxBugs: $maxSpiders,
      mouseOver: $mouseOver,
      minDelay: $minDelay,
      maxDelay: $maxDelay,
      imageSprite: $spiderSprite,
      zoom: 4,
      canInteract: $canInteract,
    });
  }
}
