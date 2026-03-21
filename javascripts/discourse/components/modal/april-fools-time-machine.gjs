import { tracked } from "@glimmer/tracking";
import Component, { Input } from "@ember/component";
import { fn } from "@ember/helper";
import { action } from "@ember/object";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import {
  disableAll,
  isDefault,
  setMultiEnabled,
  setOnlyEnabled,
  supportsEnhanced,
} from "../../lib/localstorage-config";

const YEAR_OPTIONS = [2026, 2025, 2024, 2022].map((year) => ({
  year,
  label: `${year} 年`,
  canEnhanced: supportsEnhanced(year),
}));

export default class AprilFoolsTimeMachineModal extends Component {
  @tracked isEnhanced = this.getInitialEnhancedState();
  @tracked isAdvancedMode = false;
  @tracked advancedConfig = this.buildAdvancedConfigFromStatus();

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

  get currentStatusItems() {
    return this.currentStatus.split("|");
  }

  get activeYears() {
    if (this.currentStatus === "disabled") {
      return [];
    }

    const activeSet = new Set(
      this.currentStatusItems.filter((item) => /^\d{4}$/.test(item))
    );
    return YEAR_OPTIONS.map(({ year }) => year).filter((year) =>
      activeSet.has(`${year}`)
    );
  }

  get activeYearSet() {
    return new Set(this.activeYears);
  }

  get currentModeText() {
    if (this.activeYears.length === 0) {
      return "未启用";
    }

    const enhancedYears = this.activeYears.filter(
      (year) =>
        supportsEnhanced(year) &&
        this.currentStatusItems.includes(`${year}-enhanced`)
    );

    if (enhancedYears.length === 0) {
      return "全部关闭";
    }

    return enhancedYears.map((year) => `${year} 年`).join("、");
  }

  get activeYearText() {
    if (this.activeYears.length === 0) {
      return "未启用";
    }

    return this.activeYears.map((year) => `${year} 年`).join("、");
  }

  get quickYearButtons() {
    return YEAR_OPTIONS.map(({ year }) => {
      const enabled = this.activeYearSet.has(year);

      return {
        year,
        buttonLabel: `前往 ${year} 年`,
        buttonClass: enabled ? "btn-primary" : "",
      };
    });
  }

  get advancedYears() {
    return YEAR_OPTIONS.map((yearOption) => ({
      ...yearOption,
      ...(this.advancedConfig[yearOption.year] || {
        enabled: false,
        enhanced: false,
      }),
    }));
  }

  buildAdvancedConfigFromStatus() {
    const disabled = this.currentStatus === "disabled";
    const statusItems = this.currentStatusItems;

    return YEAR_OPTIONS.reduce((result, { year, canEnhanced }) => {
      result[year] = {
        enabled: !disabled && statusItems.includes(`${year}`),
        enhanced:
          !disabled && canEnhanced && statusItems.includes(`${year}-enhanced`),
      };
      return result;
    }, {});
  }

  getAdvancedYearConfig(year) {
    return this.advancedConfig[year] || { enabled: false, enhanced: false };
  }

  updateAdvancedYearConfig(year, patch) {
    this.advancedConfig = {
      ...this.advancedConfig,
      [year]: {
        ...this.getAdvancedYearConfig(year),
        ...patch,
      },
    };
  }

  getInitialEnhancedState() {
    const status =
      window.localStorage.getItem("shuiyuan-april-fools-rewind") ||
      `${new Date().getFullYear()}`;
    if (status === "disabled") {
      return false;
    }
    return status.split("|").some((item) => /^\d{4}-enhanced$/.test(item));
  }

  delayedReload() {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  @action
  travelToYear(year) {
    setOnlyEnabled(year, this.isEnhanced);
    this.delayedReload();
  }

  @action
  disable() {
    disableAll();
    this.delayedReload();
  }

  @action
  toggleAdvancedMode() {
    const nextMode = !this.isAdvancedMode;
    this.isAdvancedMode = nextMode;
    if (nextMode) {
      this.advancedConfig = this.buildAdvancedConfigFromStatus();
    }
  }

  @action
  toggleAdvancedYear(year) {
    const currentConfig = this.getAdvancedYearConfig(year);
    const nextEnabled = !currentConfig.enabled;
    this.updateAdvancedYearConfig(year, {
      enabled: nextEnabled,
      enhanced: nextEnabled ? currentConfig.enhanced : false,
    });
  }

  @action
  toggleAdvancedEnhanced(year) {
    if (!supportsEnhanced(year)) {
      return;
    }

    const currentConfig = this.getAdvancedYearConfig(year);
    this.updateAdvancedYearConfig(year, {
      enabled: true,
      enhanced: !currentConfig.enhanced,
    });
  }

  @action
  applyAdvancedMode() {
    const nextConfig = YEAR_OPTIONS.map(({ year, canEnhanced }) => {
      const currentConfig = this.getAdvancedYearConfig(year);
      return {
        year,
        enabled: currentConfig.enabled,
        enhanced:
          canEnhanced && currentConfig.enabled && currentConfig.enhanced,
      };
    });

    setMultiEnabled(nextConfig);
    this.delayedReload();
  }

  <template>
    <DModal
      @title="愚人节回溯"
      @closeModal={{@closeModal}}
      class="april-fools-time-machine-modal"
    >
      <:body>
        <div class="april-fools-time-machine-modal__actions">
          <DButton
            @action={{this.disable}}
            @translatedLabel="我是来结束这一切的"
            class="btn-danger"
          />
          {{#each this.quickYearButtons as |quickYear|}}
            <DButton
              @action={{fn this.travelToYear quickYear.year}}
              @translatedLabel={{quickYear.buttonLabel}}
              class={{quickYear.buttonClass}}
            />
          {{/each}}
        </div>

        <div class="april-fools-time-machine-modal__enhanced">
          <label
            for="enable-enhanced-mode"
            class="april-fools-time-machine-modal__enhanced-label"
          >
            <Input
              name="enable-enhanced-mode"
              id="enable-enhanced-mode"
              @type="checkbox"
              @checked={{this.isEnhanced}}
            />
            增强模式
          </label>
          {{#if this.isEnhanced}}
            <p class="april-fools-time-machine-modal__enhanced-hint">
              启用增强模式后，将获得更多效果。你也可以打开浏览器终端调整更多配置。
            </p>
          {{/if}}
        </div>

        {{#if this.showImg}}
          <img
            src={{this.imageUrl}}
            id="april-fools-time-machine-modal-banana"
            alt="又要重复吗，绝望的轮回"
          />
        {{/if}}

        <div class="april-fools-time-machine-modal__advanced-switch">
          <DButton
            @action={{this.toggleAdvancedMode}}
            @translatedLabel={{if
              this.isAdvancedMode
              "收起高级模式"
              "高级模式"
            }}
          />
          <span class="april-fools-time-machine-modal__advanced-hint">
            可混合启用多个年份，并分别控制增强模式。
          </span>
        </div>

        {{#if this.isAdvancedMode}}
          <p class="april-fools-time-machine-modal__advanced-warning">
            注意：启用多个效果可能产生冲突，导致页面无法正常工作。
          </p>
          <div class="april-fools-time-machine-modal__advanced-panel">
            {{#each this.advancedYears as |yearConfig|}}
              <div class="april-fools-time-machine-modal__advanced-row">
                <div class="april-fools-time-machine-modal__advanced-year">
                  <span>{{yearConfig.label}}</span>
                  <span class="april-fools-time-machine-modal__advanced-state">
                    {{if yearConfig.enabled "已启用" "未启用"}}
                  </span>
                </div>
                <div class="april-fools-time-machine-modal__advanced-controls">
                  <DButton
                    @action={{fn this.toggleAdvancedYear yearConfig.year}}
                    @translatedLabel={{if yearConfig.enabled "关闭" "启用"}}
                  />
                  {{#if yearConfig.canEnhanced}}
                    <DButton
                      @action={{fn this.toggleAdvancedEnhanced yearConfig.year}}
                      @translatedLabel={{if
                        yearConfig.enhanced
                        "增强：开"
                        "增强：关"
                      }}
                      @disabled={{if yearConfig.enabled false true}}
                    />
                  {{else}}
                    <span
                      class="april-fools-time-machine-modal__advanced-unsupported"
                    >
                      不支持增强
                    </span>
                  {{/if}}
                </div>
              </div>
            {{/each}}
            <div class="april-fools-time-machine-modal__advanced-footer">
              <DButton
                @action={{this.applyAdvancedMode}}
                @translatedLabel="确认应用"
                class="btn-primary"
              />
            </div>
          </div>
        {{/if}}

        <p class="april-fools-time-machine-modal__status">
          <span>当前启用：{{this.activeYearText}}</span>
          <span class="april-fools-time-machine-modal__status-divider" />
          <span>增强模式：{{this.currentModeText}}</span>
        </p>
      </:body>
    </DModal>
  </template>
}
