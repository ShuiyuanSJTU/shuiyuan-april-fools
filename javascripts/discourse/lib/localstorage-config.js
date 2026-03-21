// const configRaw = window.localStorage.getItem("shuiyuan-april-fools-rewind").split("|");

function getConfig() {
  return (
    window.localStorage.getItem("shuiyuan-april-fools-rewind")?.split("|") || []
  );
}

function addConfigItem(key) {
  let config = getConfig();
  if (config.indexOf(key) === -1) {
    config.push(key);
  }
  window.localStorage.setItem("shuiyuan-april-fools-rewind", config.join("|"));
}

function removeConfigItem(key) {
  let config = getConfig();
  let index = config.indexOf(key);
  if (index !== -1) {
    config.splice(index, 1);
  }
  window.localStorage.setItem("shuiyuan-april-fools-rewind", config.join("|"));
}

function clearConfig() {
  window.localStorage.removeItem("shuiyuan-april-fools-rewind");
}

function setEnabled(year, enhanced = false) {
  addConfigItem(`${year}`);
  if (enhanced) {
    addConfigItem(`${year}-enhanced`);
  } else {
    removeConfigItem(`${year}-enhanced`);
  }
}

function setOnlyEnabled(year, enhanced = false) {
  clearConfig();
  setEnabled(year, enhanced);
}

function supportsEnhanced(year) {
  return [2024, 2025, 2026].indexOf(Number(year)) !== -1;
}

function setMultiEnabled(configs = []) {
  clearConfig();
  const selectedConfig = [];

  configs.forEach(({ year, enabled, enhanced }) => {
    if (!enabled) {
      return;
    }

    const normalizedYear = Number(year);
    selectedConfig.push(`${normalizedYear}`);

    if (enhanced && supportsEnhanced(normalizedYear)) {
      selectedConfig.push(`${normalizedYear}-enhanced`);
    }
  });

  if (selectedConfig.length === 0) {
    disableAll();
    return;
  }

  window.localStorage.setItem(
    "shuiyuan-april-fools-rewind",
    selectedConfig.join("|")
  );
}

function disableAll() {
  window.localStorage.setItem("shuiyuan-april-fools-rewind", "disabled");
}

function isEnabled(year) {
  const config = getConfig();
  if (config.indexOf("disabled") !== -1) {
    return false;
  }
  if (year === new Date().getFullYear() && config.length === 0) {
    return true;
  }
  return getConfig().indexOf(year.toString()) !== -1;
}

function isEnhanced(year) {
  return isEnabled(year) && getConfig().indexOf(`${year}-enhanced`) !== -1;
}

function isDefault() {
  return (
    getConfig().length === 0 ||
    window.localStorage.getItem("shuiyuan-april-fools-rewind") ===
      new Date().getFullYear().toString()
  );
}

export {
  setEnabled,
  setOnlyEnabled,
  setMultiEnabled,
  supportsEnhanced,
  disableAll,
  isEnabled,
  isEnhanced,
  isDefault,
};
