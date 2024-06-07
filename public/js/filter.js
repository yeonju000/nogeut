document.addEventListener('DOMContentLoaded', function() {
    // Event listener for main nav items
    document.getElementById('a').addEventListener('click', function(event) {
        event.preventDefault();
        ensureDropdownVisible('a-dropdown');
    });

    // Event listener for A dropdown items (서울)
    document.querySelectorAll('.a-seoul').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            toggleSelectedItem(item);
        });

        item.addEventListener('mouseover', function(event) {
            ensureDropdownVisible('seoul-dropdown');
        });

        item.addEventListener('mouseleave', function(event) {
            hideDropdownWithDelay('seoul-dropdown', 'a-seoul');
        });
    });

    // Event listener for A dropdown items (경기)
    document.querySelectorAll('.a-gyeonggi').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            toggleSelectedItem(item);
        });

        item.addEventListener('mouseover', function(event) {
            ensureDropdownVisible('gyeonggi-dropdown');
        });

        item.addEventListener('mouseleave', function(event) {
            hideDropdownWithDelay('gyeonggi-dropdown', 'a-gyeonggi');
        });
    });

    // Event listener for A dropdown child items (서울의 구/동)
    document.querySelectorAll('.seoul-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            toggleSelectedItem(item);
            ensureDropdownVisible('b-dropdown');
        });
    });

    // Event listener for A dropdown child items (경기의 구/동)
    document.querySelectorAll('.gyeonggi-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            toggleSelectedItem(item);
            ensureDropdownVisible('b-dropdown');
        });
    });

    // Event listener for B dropdown items
    document.querySelectorAll('.b-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            toggleSelectedItem(item);
            ensureDropdownVisible('c-dropdown');
        });
    });

        // Event listener for C dropdown items
        document.querySelectorAll('.c-item').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                toggleSelectedItem(item);
                ensureDropdownVisible('d-dropdown');
            });
        });
    
        // Event listener for D dropdown items
        document.querySelectorAll('.d-item').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                toggleSelectedItem(item);
                ensureDropdownVisible('e-dropdown');
            });
        });
    
        // Event listener for E dropdown items
        document.querySelectorAll('.e-item').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                toggleSelectedItem(item);
                ensureDropdownVisible('f-dropdown');
            });
        });
    
        // Event listener for F dropdown items
        document.querySelectorAll('.f-item').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                toggleSelectedItem(item);
                ensureDropdownVisible('g-dropdown');
            });
        });
    
        // Event listener for G dropdown items
        document.querySelectorAll('.g-item').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                toggleSelectedItem(item);
            });
        });
    
        // Adding mouseover and mouseleave for seoul-dropdown
        const seoulDropdown = document.getElementById('seoul-dropdown');
        if (seoulDropdown) {
            seoulDropdown.addEventListener('mouseover', function(event) {
                ensureDropdownVisible('seoul-dropdown');
            });
    
            seoulDropdown.addEventListener('mouseleave', function(event) {
                hideDropdownWithDelay('seoul-dropdown', 'a-seoul');
            });
        }
    
        // Adding mouseover and mouseleave for gyeonggi-dropdown
        const gyeonggiDropdown = document.getElementById('gyeonggi-dropdown');
        if (gyeonggiDropdown) {
            gyeonggiDropdown.addEventListener('mouseover', function(event) {
                ensureDropdownVisible('gyeonggi-dropdown');
            });
    
            gyeonggiDropdown.addEventListener('mouseleave', function(event) {
                hideDropdownWithDelay('gyeonggi-dropdown', 'a-gyeonggi');
            });
        }
    
        function toggleDropdown(id) {
            const dropdown = document.getElementById(id);
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        }
    
        function ensureDropdownVisible(id) {
            const dropdown = document.getElementById(id);
            if (dropdown) {
                const otherDropdownsVisible = Array.from(document.querySelectorAll('.dropdown.show'))
                    .filter(dd => dd.id !== id && dd.children.length > 0).length > 0;
                if (otherDropdownsVisible) {
                    dropdown.classList.add('show');
                } else {
                    dropdown.classList.toggle('show');
                }
            }
        }
    
        function hideDropdown(id) {
            const dropdown = document.getElementById(id);
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
    
        function toggleSelectedItem(item) {
            item.classList.toggle('nav-selected');
        }
    
        function hideDropdownWithDelay(id, triggerClass) {
            setTimeout(() => {
                const dropdown = document.getElementById(id);
                const triggerElement = document.querySelector(`.${triggerClass}`);
                if (dropdown && triggerElement && !dropdown.matches(':hover') && !triggerElement.matches(':hover')) {
                    dropdown.classList.remove('show');
                }
            }, 200);
        }
    
        // Adding mouseleave for the entire dropdowns
        const mainDropdown = document.getElementById('a-dropdown');
        if (mainDropdown) {
            mainDropdown.addEventListener('mouseleave', function(event) {
                hideDropdownWithDelay('seoul-dropdown', 'a-seoul');
                hideDropdownWithDelay('gyeonggi-dropdown', 'a-gyeonggi');
            });
        }
    
        // Update hidden inputs based on selected items
        function updateHiddenInputs() {
            document.getElementById('region').value = getSelectedText('a-item');
            document.getElementById('city').value = getSelectedText('seoul-item') || getSelectedText('gyeonggi-item');
            document.getElementById('gender').value = getSelectedText('b-item');
            document.getElementById('amount').value = getSelectedText('c-item');
            document.getElementById('field').value = getSelectedText('d-item');
            document.getElementById('age').value = getSelectedText('e-item');
            document.getElementById('day').value = getSelectedText('f-item');
            document.getElementById('time').value = getSelectedText('g-item');
        }
    
        function getSelectedText(className) {
            const selectedItem = document.querySelector(`.${className}.nav-selected`);
            return selectedItem ? selectedItem.textContent.trim() : '';
        }
    
        // Add event listener to search button
        document.getElementById('searchButton').addEventListener('click', function() {
            updateHiddenInputs();
            document.getElementById('filterForm').submit();
        });
    });
    