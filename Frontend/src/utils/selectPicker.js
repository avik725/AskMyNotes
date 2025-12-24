function destroySelectpickers(identifier) {
  $(identifier).selectpicker("destroy");
}

function renderSelectpickers(identifier) {
  $(identifier).selectpicker("render");
}

function refreshSelectpickers(identifier) {
  $(identifier).selectpicker("refresh");
}

export { destroySelectpickers, renderSelectpickers, refreshSelectpickers };
