import { h } from "virtual-dom";
import { isEnabled, isEnhanced } from "../localstorage-config";
import { convert, convertTextInNode } from "./chinese-convert";

export default function initializer(api) {
  if (!isEnabled(2025)) {
    return;
  }

  document.body.classList.add("shuiyuan-april-fools-2025-global");

  api.decorateWidget("post-avatar:after", () => {
    return [h("div.avatar-holo"), h("div.avatar-glow")];
  });

  api.reopenWidget("post-avatar", {
    buildClasses(attrs) {
      const classes = (this._super && this._super(attrs)) || [];
      classes.push(`trust-level-${attrs.trustLevel}`);
      return classes;
    },
  });

  api.reopenWidget("post-meta-data", {
    buildClasses(attrs) {
      const classes = (this._super && this._super(attrs)) || [];
      classes.push(`trust-level-${attrs.trustLevel}`);
      return classes;
    },
  });

  if (isEnhanced(2025)) {
    api.reopenWidget("poster-name", {
      html(attrs) {
        const originalName = attrs.name;
        attrs.name = convert(originalName || attrs.username);
        const html = this._super(attrs);
        attrs.name = originalName;
        return html;
      },
    });

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
