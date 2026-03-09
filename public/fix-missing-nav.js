/**
 * fix-missing-nav.js
 * 
 * Some pages (login.html, register.html, payment.html, etc.) use a different
 * header structure (<div class="header">) instead of the standard
 * <header> with <div class="header-container">. This script replaces
 * their existing non-standard header with the full standard navbar,
 * so the hamburger menu works universally.
 */

const fs = require('fs');
const path = require('path');

const dir = 'd:\\VS CODE SNIPPETS\\inest\\inest-backend\\public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const STANDARD_HEADER = `<header>
    <div class="header-container">
      <div class="logo">
        <a href="./index.html"><img src="./images/logo.png" alt="iNest Logo"></a>
      </div>
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
      </div>
    </div>
  </header>`;

let fixedCount = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');

  // Skip pages that already have mobile-menu-toggle (they already work)
  if (content.includes('mobile-menu-toggle')) {
    continue;
  }

  console.log(`Fixing: ${file}`);

  // Strategy: Find the non-standard header and replace it with the standard one.
  // These pages use patterns like:
  //   <div class="header">...</div>   (login, register, payment, qr)
  //   or completely lack a header     (admin-dashboard, filter, etc.)

  // Pattern 1: <div class="header">...</div>
  const headerDivRegex = /<div\s+class="header"[^>]*>[\s\S]*?<\/div>\s*(?=\n\s*(?:<\!--|<div|<section|<main|<form))/;
  const match = content.match(headerDivRegex);

  if (match) {
    content = content.replace(match[0], STANDARD_HEADER);
  } else {
    // Pattern 2: No recognizable header at all - inject right after <body...>
    const bodyMatch = content.match(/<body[^>]*>/);
    if (bodyMatch) {
      const bodyTag = bodyMatch[0];
      content = content.replace(bodyTag, bodyTag + '\n' + STANDARD_HEADER);
    }
  }

  // Ensure navbar.css is included
  if (!content.includes('navbar.css')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="./navbar.css">\n</head>');
  }

  // Ensure navbar.js is included
  if (!content.includes('navbar.js')) {
    content = content.replace('</body>', '  <script src="./navbar.js"></script>\n</body>');
  }

  // Ensure font-awesome is included
  if (!content.includes('font-awesome')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>');
  }

  fs.writeFileSync(fp, content);
  fixedCount++;
}

console.log(`\nDone! Fixed ${fixedCount} files.`);
