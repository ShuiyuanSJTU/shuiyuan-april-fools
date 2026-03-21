import DButton from "discourse/components/d-button";
import { isEnabled, isEnhanced, setEnabled } from "../localstorage-config";
import displayOverlay from "./agent-overlay";
import LLMTypeWriter from "./llm_type_writer";

export default function initializer(api) {
  if (!settings.enable_easter_egg_2026 || !isEnabled(2026)) {
    return;
  }

  const enhancedMode = isEnhanced(2026);
  const rawToggleProbability = Number(settings.show_toggle_probability_2026);
  const showToggleProbability = Number.isFinite(rawToggleProbability)
    ? Math.min(1, Math.max(0, rawToggleProbability))
    : 0.5;

  if (Math.random() < showToggleProbability || enhancedMode) {
    const openAgentSpace = () => {
      const onExit = () => {
        setEnabled(2026, false);
        if (enhancedMode) {
          setTimeout(() => window.location.reload(), 100);
        }
      };
      const onLinkStart = () => {
        setEnabled(2026, true);
      };
      displayOverlay(onExit, onLinkStart);
    };
    api.headerIcons.add(
      "shuiyuan-april-fools-2026-toggle",
      <template>
        <li class="header-dropdown-toggle">
          <DButton
            @icon="robot"
            class="icon btn-flat"
            @action={{openAgentSpace}}
          />
        </li>
      </template>,
      { before: "user-menu" }
    );
  }
  document.body.classList.add("shuiyuan-april-fools-2026-global");

  if (enhancedMode) {
    api.decorateCookedElement((node) => {
      LLMTypeWriter.observe(node);
    });
    api.modifyClass(
      "component:post/meta-data/poster-name",
      (Superclass) =>
        class extends Superclass {
          get name() {
            return `Agent_${getHash(super.name)}`;
          }

          get shouldDisplaySecondName() {
            return false;
          }

          get userTitle() {
            if (!super.userTitle) {
              return null;
            }
            return `g/${getHash(super.userTitle)}`;
          }
        }
    );
  }
}

function getHash(str) {
  let hash = 5381;
  let i = str.length;

  while (i) {
    // hash * 33 + charCode
    // eslint-disable-next-line no-bitwise
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  // eslint-disable-next-line no-bitwise
  return (hash >>> 0).toString(16).padEnd(6, "0").substring(0, 6);
}
