const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

// Sidebar toggle işlemi
menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});


function adjustSidebar() {
  if (window.innerWidth <= 576) {
    sidebar.classList.add("hide");
    sidebar.classList.remove("show");
  } else {
    sidebar.classList.remove("hide");
    sidebar.classList.add("show");
  }
}


window.addEventListener("load", adjustSidebar);
window.addEventListener("resize", adjustSidebar);

// Dark Mode Switch
const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});


