const fs = require('fs');
const path = require('path');

const dir = 'd:\\\\VS CODE SNIPPETS\\\\inest\\\\inest-backend\\\\public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newRightSection = `
      <div class="right-section">
        <!-- Desktop Nav -->
        <nav class="nav-bar" aria-label="Primary navigation">
          <ul>
            <li><a href="./index.html">Home</a></li>
            
            <li class="dropdown">
              <a href="#" class="dropdown-trigger">Housing</a>
              <div class="dropdown-content">
                <a href="./PG page.html"><i class="fas fa-bed"></i> PG & Hostels</a>
                <a href="./House.html"><i class="fas fa-home"></i> Houses</a>
                <a href="./Flats page.html"><i class="fas fa-building"></i> Flats</a>
              </div>
            </li>

            <li class="dropdown">
              <a href="#" class="dropdown-trigger">Services</a>
              <div class="dropdown-content">
                <a href="./home-foods.html"><i class="fas fa-utensils"></i> Home Foods</a>
                <a href="./laundry.html"><i class="fas fa-tshirt"></i> Laundry</a>
                <a href="./medical-support.html"><i class="fas fa-stethoscope"></i> Medical Support</a>
              </div>
            </li>

            <li class="dropdown">
              <a href="./cityy.html" class="dropdown-trigger">📍 Cities</a>
              <div class="dropdown-content">
                <a href="./cityy.html">Hyderabad</a>
                <a href="./cityy.html">Chennai</a>
                <a href="./cityy.html">Bangalore</a>
                <a href="./cityy.html">New Delhi</a>
              </div>
            </li>

            <li class="dropdown">
              <a href="#" class="dropdown-trigger">Community</a>
              <div class="dropdown-content">
                <a href="./chat page.html"><i class="fas fa-comments"></i> Chat & Connect</a>
                <a href="./community.html"><i class="fas fa-users"></i> Community Hub</a>
                <a href="./report-box.html"><i class="fas fa-flag"></i> Report Issues</a>
              </div>
            </li>

            <li class="dropdown">
              <a href="#" class="dropdown-trigger">More</a>
              <div class="dropdown-content">
                <a href="./payment.html"><i class="fas fa-credit-card"></i> Payment</a>
                <a href="./Booking_confirmation.html"><i class="fas fa-check-circle"></i> Booking Status</a>
                <a href="./qr.html"><i class="fas fa-qrcode"></i> QR Code</a>
                <a href="./admin-dashboard.html"><i class="fas fa-tachometer-alt"></i> Admin Dashboard</a>
              </div>
            </li>

            <li class="dropdown search-dropdown-container">
              <a href="#" class="dropdown-trigger" aria-label="Search"><i class="fas fa-search"></i></a>
              <div class="dropdown-content search-dropdown">
                <div class="search-bar-dropdown">
                  <input type="text" placeholder="Search by City, Area, Landmark">
                  <button>Search</button>
                </div>
              </div>
            </li>

            <li class="dropdown get-nest-container" id="nav-auth-section">
              <a href="#" class="dropdown-trigger get-nest-btn">Get Nest</a>
              <div class="dropdown-content">
                <a href="./login.html"><i class="fas fa-sign-in-alt"></i> Login</a>
                <a href="./register.html"><i class="fas fa-user-plus"></i> Sign Up</a>
              </div>
            </li>

            <li id="nav-user" style="display: none;"></li>
          </ul>
        </nav>

        <button class="mobile-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav">
          <span class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>`;

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');

  const startIdx = content.indexOf('<div class="right-section">');
  if (startIdx !== -1) {
    let openDivs = 0;
    let endIdx = -1;
    for (let i = startIdx; i < content.length; i++) {
      if (content.substring(i, i+4) === '<div') {
        openDivs++;
      } else if (content.substring(i, i+6) === '</div>') {
        openDivs--;
        if (openDivs === 0) {
          endIdx = i + 6;
          break;
        }
      }
    }
    
    if (endIdx !== -1) {
      content = content.substring(0, startIdx) + newRightSection + content.substring(endIdx);
    }
  }

  // Fix the literal \n injected previously
  content = content.split('\\n</head>').join('\n</head>');
  content = content.split('\\n</body>').join('\n</body>');

  // Wrap logo in anchor tag for homepage redirect
  content = content.replace(/<div class="logo">\s*<img([^>]*)>\s*<\/div>/g, '<div class="logo">\n          <a href="./index.html"><img$1></a>\n        </div>');

  if (!content.includes('navbar.css')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="./navbar.css">\n</head>');
  }

  if (!content.includes('navbar.js')) {
    content = content.replace('</body>', '  <script src="./navbar.js"></script>\n</body>');
  }

  if (!content.includes('font-awesome')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>');
  }

  content = content.replace(/\.dropdown>a:after\s*\{[^}]*\}/g, '/* Removed dropdown arrow */');

  fs.writeFileSync(fp, content);
}

console.log('Modified all HTML files successfully.');
