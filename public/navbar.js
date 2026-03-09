document.addEventListener('DOMContentLoaded', () => {
    // 0. Mobile Hamburger Menu Logic
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navBar = document.querySelector('.nav-bar');
    
    if (mobileToggle && navBar) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            mobileToggle.classList.toggle('active');
            navBar.classList.toggle('mobile-open');
        });
    }

    // 1. Dropdown Logic
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (!trigger) return;
        
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            // Close others
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            dropdown.classList.toggle('active');
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    // 2. Auth Session Logic replacement
    const navUser = document.getElementById('nav-user');
    const authSection = document.getElementById('nav-auth-section');
    
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (navUser) {
            if (user && user.name) {
                if (authSection) authSection.style.display = 'none';
                navUser.style.display = 'block';
                navUser.innerHTML = `
                    <span style="color: #FFD700; font-weight: bold; margin-right: 10px;">${user.name}</span>
                    <button id="nav-logout-btn" style="padding:6px 12px; border-radius:4px; background:#dc3545; color:white; border:none; cursor:pointer; font-size:13px;">Logout</button>
                `;
                
                const logoutBtn = document.getElementById('nav-logout-btn');
                if (logoutBtn) {
                    logoutBtn.onclick = function () {
                        localStorage.removeItem('user');
                        localStorage.removeItem('authToken');
                        window.location.href = 'login.html';
                    };
                }
            } else {
                if (authSection) authSection.style.display = 'block';
                navUser.style.display = 'none';
                navUser.innerHTML = '';
            }
        }
    } catch (err) {
        console.error("Error parsing user from localStorage", err);
    }
});
