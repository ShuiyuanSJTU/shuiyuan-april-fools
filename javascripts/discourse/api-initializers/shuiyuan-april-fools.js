import { apiInitializer } from "discourse/lib/api";
import AprilFoolsTimeMachineModal from "../components/modal/april-fools-time-machine";
import apiInitializer2022 from "../lib/2022/shuiyuan-april-fools-2022";
import apiInitializer2024 from "../lib/2024/shuiyuan-april-fools-2024";
import apiInitializer2025 from "../lib/2025/shuiyuan-april-fools-2025";
import apiInitializer2026 from "../lib/2026/shuiyuan-april-fools-2026";
import { shouldEnableComponent } from "../lib/utils";

export default apiInitializer((api) => {
  window.showAprilFoolsModal = () => {
    if (!shouldEnableComponent()) {
      // eslint-disable-next-line no-console
      console.warn(
        "Component is not enabled, your may need to enable it with `forceEnableAprilFools()` first."
      );
      window.forceEnableAprilFools = () => {
        window.localStorage.setItem("shuiyuan-april-fools-force", "true");
        // eslint-disable-next-line no-console
        console.log("Component is enabled now.");
      };
    }
    api._lookupContainer("service:modal").show(AprilFoolsTimeMachineModal);
  };

  if (!shouldEnableComponent()) {
    return;
  }

  apiInitializer2026(api);
  apiInitializer2025(api);
  apiInitializer2024(api);
  apiInitializer2022(api);
});
