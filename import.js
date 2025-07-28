document.addEventListener("DOMContentLoaded", () => {
  const ZONES = {
    leftBar: document.querySelector('[zone="leftBar"]'),
    topBar: document.querySelector('[zone="topBar"]'),
    brandCorner: document.querySelector('[zone="brandCorner"]')
  };

  const TEMPLATE = ZONES.leftBar.querySelector('[element="dropdown"]');
  if (!TEMPLATE) return;

  fetch("https://insightetoolsportal.netlify.app/test.json")
    .then(res => res.json())
    .then(data => {
      const grouped = { leftBar: [], topBar: [], brandCorner: [] };

      data.forEach(item => {
        if (grouped[item.location]) grouped[item.location].push(item);
      });

      Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => a.sortOrder - b.sortOrder);
      });

      // Clear leftBar but keep 1 template
      ZONES.leftBar.innerHTML = "";
      ZONES.leftBar.appendChild(TEMPLATE);

      const createIcon = src => {
        const wrapper = document.createElement("div");
        wrapper.setAttribute("element", "icon");
        wrapper.className = "menuicon w-embed";
        wrapper.innerHTML = `<img src="${src}" width="18" height="18" />`;
        return wrapper;
      };

      grouped.leftBar.forEach(item => {
        const clone = TEMPLATE.cloneNode(true);
        const toggle = clone.querySelector('[element="toggle"]');
        const label = clone.querySelector('.menulabel');
        const link = toggle.querySelector('[element="link"]');
        const icon = toggle.querySelector('[element="icon"]');

        label.textContent = item.label || "Menu";
        if (link && item.route) link.href = item.route;
        if (icon) icon.replaceWith(createIcon(item.icon));

        const submenuWrapper = clone.querySelector('[element="submenu"]');
        const submenuList = submenuWrapper?.querySelector('.submenu');
        const submenuHeader = submenuWrapper?.querySelector('.submenuheader');

        if (Array.isArray(item.subMenus) && item.subMenus.length > 0) {
          submenuList.innerHTML = "";
          item.subMenus.sort((a, b) => a.sortOrder - b.sortOrder).forEach(sub => {
            const subLink = document.createElement("a");
            subLink.setAttribute("element", "link");
            subLink.href = sub.route || "#";
            subLink.className = "dropdown-link w-dropdown-link";
            subLink.textContent = sub.label;
            submenuList.appendChild(subLink);
          });
          if (submenuHeader) submenuHeader.textContent = item.label;
        } else {
          if (submenuWrapper) submenuWrapper.style.display = "none";
        }

        ZONES.leftBar.appendChild(clone);
      });

      grouped.topBar.forEach(item => {
        const button = document.createElement("div");
        button.setAttribute("element", "button");
        button.className = "headerbutton";
        button.innerHTML = `
          <div element="icon" class="headerbuttonicon w-embed">
            <img src="${item.icon}" width="18" height="18" />
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
        link.innerHTML = `<img src="${item.icon}" class="insight-logo" />`;
        ZONES.brandCorner.appendChild(link);
      });
    })
    .catch(err => console.error("Failed to load JSON:", err));
});
