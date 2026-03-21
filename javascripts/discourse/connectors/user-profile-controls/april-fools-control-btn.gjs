import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import AprilFoolsTimeMachineModal from "../../components/modal/april-fools-time-machine";
import { shouldEnableComponent } from "../../lib/utils";

export default class AprilFoolsControlBtn extends Component {
  static shouldRender() {
    return shouldEnableComponent();
  }

  @service modal;

  @action
  openModal() {
    this.modal.show(AprilFoolsTimeMachineModal);
  }

  <template>
    <li class="user-profile-controls-outlet april-fools-control-btn">
      <DButton
        class="btn-default april-fools-profile-btn"
        @action={{this.openModal}}
        @translatedLabel="???"
        @icon="far-clock"
      />
    </li>
  </template>
}
