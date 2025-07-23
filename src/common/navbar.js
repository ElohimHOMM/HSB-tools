function includeNavbar() {
  $("#navbar-container").html(`<nav id="navbar-top" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">HSB Tools</a>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Calculators
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/calculators/magicfind">Magic Find</a></li>        
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Lists</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/lists/sacks">Sacks</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
    </nav>`);
}
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

function includeFooter() {
  $("#footer-container").html(
    `<ul class="nav justify-content-center border-bottom pb-3 mb-3">
            <li>
                <a href="#" class="px-2">Top of Page</a>
            </li>
            <li>
                <a href="#" class="px-2">About</a>
            </li>
            <li>
                <a href="https://discord.gg/EC3bpJEdet" target="_blank" rel="noopener noreferrer" class="px-2">Discord</a>
            </li>
            <li>
                <a href="mailto:support@skyblock-tools.com" target="_blank" rel="noopener noreferrer" class="px-2">Contact</a>
            </li>
        </ul> 
        <p class="text-center">© 2025 - _.intothevoid._</p> </footer>`);
}