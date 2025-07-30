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
        if (icon) icon.replaceWith(createIcon(item.icon));

        const submenuWrapper = clone.querySelector('[element="submenu"]');
        const submenuHeader = submenuWrapper?.querySelector('.submenulabel');
        const submenuZone = submenuWrapper?.querySelector('.submenuzone');

        if (Array.isArray(item.subMenus) && item.subMenus.length > 0) {
          submenuWrapper.style.display = "none"; // Hide by default
          submenuHeader.textContent = item.label;
          submenuZone.innerHTML = "";

          item.subMenus
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .forEach(sub => {
              const subWrap = document.createElement("div");
              subWrap.setAttribute("element", "link");
              subWrap.className = "dropdown-link";

              const p = document.createElement("p");
              p.className = "paragraph";
              p.textContent = sub.label;

              subWrap.appendChild(p);
              submenuZone.appendChild(subWrap);
            });

          clone.addEventListener("mouseover", () => {
            submenuWrapper.style.display = "block";
          });

          clone.addEventListener("mouseout", () => {
            submenuWrapper.style.display = "none";
          });
        } else {
          submenuWrapper.style.display = "none";
        }

        // ✅ Append regardless of submenu
        ZONES.leftBar.appendChild(clone);
      });

      grouped.topBar.forEach(item => {
        const button = document.createElement("div");
        button.setAttribute("element", "button");
        button.className = "headerbutton";
        button.innerHTML = `
          <div element="icon" class="headerbuttonicon w-embed">
            <img src="${item.icon}" width="18" height="18">
          </div>
          <div element="label" class="headerbuttonlabel">${item.label}</div>
        `;
        if (item.menuId) button.id = item.menuId;
        ZONES.topBar.appendChild(button);
      });

      grouped.brandCorner.forEach(item => {
        const link = document.createElement("a");
        link.href = item.route || "#";
        link.className = "logolink w-inline-block";
        link.innerHTML = `<img src="${item.icon}" class="insight-logo">`;
        ZONES.brandCorner.appendChild(link);
      });
    })
    .catch(err => console.error("Failed to load JSON:", err));
});
