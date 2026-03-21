import { tracked } from "@glimmer/tracking";
import Component, { Input } from "@ember/component";
import { action } from "@ember/object";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import {
  disableAll,
  isDefault,
  setOnlyEnabled,
} from "../../lib/localstorage-config";

export default class AprilFoolsTimeMachineModal extends Component {
  @tracked isEnhanced = false;

  get showImg() {
    return !isDefault() && this.currentStatus !== "disabled";
  }

  get imageUrl() {
    return settings.theme_uploads.daibanana;
  }

  get currentStatus() {
    return (
      window.localStorage.getItem("shuiyuan-april-fools-rewind") ||
      `${new Date().getFullYear()}`
    );
  }

  delayedReload() {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  @action
  travelTo2026() {
    setOnlyEnabled(2026, this.isEnhanced);
    this.delayedReload();
  }

  @action
  travelTo2025() {
    setOnlyEnabled(2025, this.isEnhanced);
    this.delayedReload();
  }

  @action
  travelTo2024() {
    setOnlyEnabled(2024, this.isEnhanced);
    this.delayedReload();
  }

  @action
  travelTo2022() {
    setOnlyEnabled(2022, this.isEnhanced);
    this.delayedReload();
  }

  @action
  disable() {
    disableAll();
    this.delayedReload();
  }

  <template>
    <DModal
      @title="愚人节回溯"
      @closeModal={{@closeModal}}
      class="april-fools-time-machine-modal"
    >
      <:body>
        <DButton
          @action={{this.disable}}
          @translatedLabel="我是来结束这一切的"
        />
        <DButton
          @action={{this.travelTo2026}}
          @translatedLabel="前往 2026 年"
        />
        <DButton
          @action={{this.travelTo2025}}
          @translatedLabel="前往 2025 年"
        />
        <DButton
          @action={{this.travelTo2024}}
          @translatedLabel="前往 2024 年"
        />
        <DButton
          @action={{this.travelTo2022}}
          @translatedLabel="前往 2022 年"
        />
        <br />
        <div style="margin-top: 20px;">
          <label for="enable-enhanced-mode">
            <Input
              name="enable-enhanced-mode"
              @type="checkbox"
              @checked={{this.isEnhanced}}
            />
            增强模式
          </label>
        </div>
        {{#if this.isEnhanced}}
          <p
          >启用增强模式后，将获得更多效果。你也可以打开浏览器终端调整更多配置。</p>
        {{/if}}
        {{#if this.showImg}}
          <img
            src={{this.imageUrl}}
            id="april-fools-time-machine-modal-banana"
          />
        {{/if}}
      </:body>
    </DModal>
  </template>
}
