import { isEnabled, isEnhanced } from "../localstorage-config";
import { convert, convertTextInNode } from "./chinese-convert";

export default function initializer(api) {
  if (!isEnabled(2025)) {
    return;
  }

  document.body.classList.add("shuiyuan-april-fools-2025-global");

  api.renderAfterWrapperOutlet(
    "post-avatar",
    <template>
      <div class="avatar-holo" />
      <div class="avatar-glow" />
    </template>
  );

  api.registerValueTransformer("post-avatar-class", ({ value, context }) => {
    const { post } = context;
    return [...(value || []), `trust-level-${post.trust_level}`];
  });

  api.registerValueTransformer("post-meta-data-class", ({ value, context }) => {
    const { post } = context;
    return [...(value || []), `trust-level-${post.trust_level}`];
  });

  if (isEnhanced(2025)) {
    api.modifyClass(
      "component:post/meta-data/poster-name",
      (Superclass) =>
        class extends Superclass {
          get name() {
            return convert(super.name);
          }
        }
    );

    if (window.localStorage.getItem("shuiyuan-april-fools-2025-mars-all")) {
      api.decorateCookedElement((node) => convertTextInNode(node));
      window.leaveMars = () => {
        window.localStorage.removeItem("shuiyuan-april-fools-2025-mars-all");
        window.location.reload();
      };
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log("If you see this, you are a Martian!");
        // eslint-disable-next-line no-console
        console.log("Run leaveMars() to leave Mars.");
      }, 3000);
    } else {
      window.enterMars = () => {
        window.localStorage.setItem(
          "shuiyuan-april-fools-2025-mars-all",
          "true"
        );
        window.location.reload();
      };
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log("Run enterMars() to enter Mars.");
      }, 3000);
    }
  }
}
