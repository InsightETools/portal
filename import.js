document.addEventListener("DOMContentLoaded", () => {
  const ZONES = {
    leftBar: document.querySelector('[zone="leftBar"]'),
    topBar: document.querySelector('[zone="topBar"]'),
    brandCorner: document.querySelector('[zone="brandCorner"]')
  };

  const TEMPLATE = ZONES.leftBar.querySelector('[element="link"]');
  if (!TEMPLATE) return;

  const menuTemplate = TEMPLATE.cloneNode(true);
  TEMPLATE.remove();

  fetch("https://insightetoolsportal.netlify.app/test.json")
    .then(res => res.json())
    .then(data => {
      const grouped = { leftBar: [], topBar: [], brandCorner: [] };
      data.forEach(item => {
        if (grouped[item.location]) grouped[item.location].push(item);
      });
      Object.values(grouped).forEach(arr => arr.sort((a, b) => a.sortOrder - b.sortOrder));

      const createIcon = src => {
        const wrapper = document.createElement("div");
        wrapper.setAttribute("element", "icon");
        wrapper.className = "menuicon w-embed";
        wrapper.innerHTML = `<img src="${src}" width="18" height="18">`;
        return wrapper;
      };

      grouped.leftBar.forEach(item => {
        const clone = menuTemplate.cloneNode(true);
        const label = clone.querySelector('.menulabel');
        const icon = clone.querySelector('[element="icon"]');
        const link = clone;

        label.textContent = item.label || "Menu";
        link.href = item.route || "#";
        clone.href = item.route || "#";
        if (icon) icon.replaceWith(createIcon(item.icon));

        const submenuWrapper = clone.querySelector('[element="submenu"]');
        const submenuHeader = submenuWrapper?.querySelector('.submenulabel');
        const submenuZone = submenuWrapper?.querySelector('.submenuzone');

        if (Array.isArray(item.subMenus) && item.subMenus.length > 0) {
          submenuWrapper.style.display = "none"; // Hide by default
          submenuWrapper.style.display = "none";
          submenuHeader.textContent = item.label;
          submenuZone.innerHTML = "";

@@ -73,7 +72,6 @@
          submenuWrapper.style.display = "none";
        }

        // ✅ Append regardless of submenu
        ZONES.leftBar.appendChild(clone);
      });

@@ -97,36 +95,38 @@
        link.className = "logolink w-inline-block";
        link.innerHTML = `<img src="${item.icon}" class="insight-logo">`;
        ZONES.brandCorner.appendChild(link);
        const toggleDiv = document.getElementById("editorSize");
  const editorPanel = document.getElementById("editorPanel");
  const collapseMenu = document.getElementById("collapseMenu");
  const expandMenu = document.getElementById("expandMenu");
  const settingsElement = document.getElementById("settingsElement");
  const textBlocks = document.querySelectorAll(".menulabel");
  const submenuHeader = document.querySelectorAll(".submenuheader");
  
  expandMenu.style.display = "none";

  if (!toggleDiv || !editorPanel || !collapseMenu || !expandMenu) return;

  toggleDiv.addEventListener("click", () => {
    const isCollapsed = editorPanel.classList.contains("collapsed");

    if (isCollapsed) {
      editorPanel.classList.remove("collapsed");
      textBlocks.forEach(el => el.classList.remove("collapsed"));
      collapseMenu.style.display = "block";
      });

      // ✅ MOVE collapse toggle logic HERE (after menu is built)
      const toggleDiv = document.getElementById("editorSize");
      const editorPanel = document.getElementById("editorPanel");
      const collapseMenu = document.getElementById("collapseMenu");
      const expandMenu = document.getElementById("expandMenu");
      const settingsElement = document.getElementById("settingsElement");

      if (!toggleDiv || !editorPanel || !collapseMenu || !expandMenu || !settingsElement) return;

      expandMenu.style.display = "none";
      settingsElement.classList.remove("collapsed");
    } else {
      editorPanel.classList.add("collapsed");
      textBlocks.forEach(el => el.classList.add("collapsed"));
      collapseMenu.style.display = "none";
      expandMenu.style.display = "block";
      settingsElement.classList.add("collapsed");
    }
  });

      toggleDiv.addEventListener("click", () => {
        const isCollapsed = editorPanel.classList.contains("collapsed");
        const textBlocks = document.querySelectorAll(".menulabel");

        if (isCollapsed) {
          editorPanel.classList.remove("collapsed");
          textBlocks.forEach(el => el.classList.remove("collapsed"));
          collapseMenu.style.display = "block";
          expandMenu.style.display = "none";
          settingsElement.classList.remove("collapsed");
        } else {
          editorPanel.classList.add("collapsed");
          textBlocks.forEach(el => el.classList.add("collapsed"));
          collapseMenu.style.display = "none";
          expandMenu.style.display = "block";
          settingsElement.classList.add("collapsed");
        }
      });

    })
    .catch(err => console.error("Failed to load JSON:", err));
});
