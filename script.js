document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuIcon = document.querySelector('.menu-icon');
  const navLinks = document.querySelector('.nav-links');

  menuIcon.addEventListener('click', function() {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    menuIcon.textContent = isOpen ? '☰' : '✕';
  });

  // Sample Property Data (simulating a backend)
  const properties = [
    {
      id: 1,
      title: 'Phakalane Luxury Villa',
      location: 'Gaborone',
      price: 3500000,
      type: 'Residential',
      bedrooms: 4,
      image: 'images/phakalane-villa.jpg',
      features: ['4 Beds', '3 Baths', '500 sqm', 'Pool']
    },
    {
      id: 2,
      title: 'Okavango Safari Lodge',
      location: 'Maun',
      price: 6000000,
      type: 'Safari Lodge',
      bedrooms: 6,
      image: 'images/okavango-lodge.jpg',
      features: ['6 Beds', '5 Baths', '800 sqm', 'River View']
    },
    {
      id: 3,
      title: 'Gaborone Commercial Plot',
      location: 'Gaborone',
      price: 1800000,
      type: 'Commercial',
      bedrooms: 0,
      image: 'images/gaborone-commercial.jpg',
      features: ['1000 sqm', 'Central Location', 'Office Ready']
    },
    {
      id: 4,
      title: 'Kasane Riverside Home',
      location: 'Kasane',
      price: 2200000,
      type: 'Residential',
      bedrooms: 3,
      image: 'images/kasane-home.jpg',
      features: ['3 Beds', '2 Baths', '400 sqm', 'Chobe View']
    },
    {
      id: 5,
      title: 'Francistown Family House',
      location: 'Francistown',
      price: 900000,
      type: 'Residential',
      bedrooms: 2,
      image: 'images/francistown-house.jpg',
      features: ['2 Beds', '1 Bath', '300 sqm', 'Garden']
    }
  ];

  // Render Listings
  function renderListings(listings, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    listings.forEach(property => {
      const card = document.createElement('div');
      card.className = 'listing-card';
      card.innerHTML = `
        <img src="${property.image}" alt="${property.title}">
        <h3>${property.title}</h3>
        <p>${property.location}</p>
        <p>P${property.price.toLocaleString()}</p>
        <div class="features">${property.features.join(' | ')}</div>
        <a href="#" class="view-details">View Details</a>
      `;
      grid.appendChild(card);
    });
  }

  // Filter Properties
  function filterProperties(formId, gridId, loadingId, noResultsId) {
    const form = document.getElementById(formId);
    const grid = document.getElementById(gridId);
    const loading = document.getElementById(loadingId);
    const noResults = document.getElementById(noResultsId);

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      loading.style.display = 'block';
      grid.style.display = 'none';
      noResults.style.display = 'none';

      setTimeout(() => {
        const formData = new FormData(form);
        const filters = {
          location: formData.get('location'),
          price: formData.get('price'),
          type: formData.get('type'),
          bedrooms: formData.get('bedrooms')
        };

        const filtered = properties.filter(property => {
          let match = true;
          if (filters.location && property.location !== filters.location) match = false;
          if (filters.type && property.type !== filters.type) match = false;
          if (filters.bedrooms) {
            if (filters.bedrooms === '4+' && property.bedrooms < 4) match = false;
            else if (filters.bedrooms !== '4+' && property.bedrooms != filters.bedrooms) match = false;
          }
          if (filters.price) {
            const [min, max] = filters.price.split('-').map(v => v === '+' ? Infinity : Number(v));
            if (property.price < min || (max && property.price > max)) match = false;
          }
          return match;
        });

        loading.style.display = 'none';
        grid.style.display = 'block';
        if (filtered.length === 0) {
          noResults.style.display = 'block';
        } else {
          renderListings(filtered, gridId);
        }
      }, 500); // Simulate async fetch
    });
  }

  // Initialize Filters
  if (document.getElementById('search-form-index')) {
    renderListings(properties, 'listing-grid-index');
    filterProperties('search-form-index', 'listing-grid-index', 'loading-index', 'no-results-index');
  }
  if (document.getElementById('search-form-listings')) {
    renderListings(properties, 'listing-grid-listings');
    filterProperties('search-form-listings', 'listing-grid-listings', 'loading-listings', 'no-results-listings');
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      formMessage.style.display = 'none';

      // Client-side validation
      const formData = new FormData(contactForm);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const message = formData.get('message').trim();

      if (!name || !email || !message) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Please fill in all required fields.';
        formMessage.style.display = 'block';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.style.display = 'block';
        return;
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formMessage.className = 'form-message success';
          formMessage.textContent = 'Message sent successfully!';
          formMessage.style.display = 'block';
          contactForm.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Failed to send message. Please try again.';
        formMessage.style.display = 'block';
      }
    });
  }
});