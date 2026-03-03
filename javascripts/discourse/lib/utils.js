function isAprilFools() {
  const today = new Date();
  return today.getMonth() === 3 && today.getDate() === 1;
}

function shouldEnableComponent() {
  return (
    isAprilFools() ||
    settings.force_global_easter_egg ||
    window.localStorage.getItem("shuiyuan-april-fools-force")
  );
}

export { isAprilFools, shouldEnableComponent };
