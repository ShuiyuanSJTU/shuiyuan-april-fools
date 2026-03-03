import { isEnabled, isEnhanced, setEnabled } from "../localstorage-config";
import { printHint1, printHint2 } from "./console";
import Icons from "./icons";
import { getTextNodes, randomSwap } from "./utils";

const discourseLater = (fn, time) => setTimeout(fn, time);

export default function initializer(api) {
  if (!settings.enable_easter_egg_2024 || !isEnabled(2024)) {
    return;
  }

  // add switch function to window
  window.IWantMore = () => {
    setEnabled(2024, true);
    window.location.reload();
  };
  window.IWantLess = () => {
    setEnabled(2024, false);
    window.location.reload();
  };

  const currentUser = api.getCurrentUser();
  const inGroup = isEnhanced(2024);
  const isMobleDevice = api._lookupContainer("service:site").isMobileDevice;
  if (!inGroup) {
    // not in group, but it's April Fools' Day or forced
    // enable global easter egg
    document.body.classList.add("shuiyuan-april-fools-2024-global");
    api.container
      .lookup("service:keyboard-shortcuts")
      .unbind({ ["ctrl+shift+i"]: null, ["f12"]: null });
    if (!isMobleDevice) {
      discourseLater(printHint1, 5000);
    }
    // do nothing if not in group
    return;
  }

  document.body.classList.add("shuiyuan-april-fools-2024");

  api.registerValueTransformer(
    "post-avatar-template",
    ({ value: avatarUrl, context }) => {
      if (
        // eslint-disable-next-line no-bitwise
        (((context.post.id ^ currentUser.id) * 7) % 100) / 100 <
        settings.avatar_replace_probability_2024
      ) {
        return currentUser.avatar_template;
      }
      return avatarUrl;
    }
  );

  api.decorateCookedElement(
    (elem) => {
      if (Math.random() > settings.post_content_shuffle_probability_2024) {
        return;
      }
      const textNodes = getTextNodes(elem);
      textNodes.forEach((node) => {
        node.textContent = randomSwap(
          node.textContent,
          settings.post_content_shuffle_pairwise_probability_2024
        );
      });
    },
    { id: "shuiyuan-april-fools-2024", onlyStream: true }
  );

  api.onPageChange(() => {
    if (Math.random() < settings.icon_shuffle_probability_2024) {
      Icons.shuffleIcons();
    } else {
      Icons.restoreIcons();
    }
  });

  if (!isMobleDevice) {
    discourseLater(printHint2, 3000);
  }
}
