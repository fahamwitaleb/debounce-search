
async function fetchLocations(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data; 
    } catch (error) {
      console.log('Error:', error);
      return [];
    }
  }
  
  function debounce<T extends (...args: any[]) => Promise<void>>(func: T, delay: number) {
    let timeoutId: number | undefined;
  
    return function (this: any, ...args: Parameters<T>): Promise<void> {
      return new Promise((resolve) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(async () => {
          await func.apply(this, args); 
          resolve(); 
        }, delay);
      });
    };
  }
  
  class LocationSearch extends HTMLElement {
    private inputElement: HTMLInputElement;
    private resultsList: HTMLUListElement;
    private debouncedSearch: (query: string) => Promise<void>; 
  
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            .input-style {
                padding: 10px !important;
                margin-bottom: 10px !important;
                width: 460px !important;
                border-radius: 8px !important;
                height: 24px !important;
                border: none !important;
            }
        `;

        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.placeholder = 'Search location';
        this.inputElement.classList.add('input-style');

        this.resultsList = document.createElement('ul');
        this.shadowRoot!.append(style, this.inputElement, this.resultsList);
        this.debouncedSearch = debounce(this.handleSearch.bind(this), 1000);
    }
  
    connectedCallback() {
      this.inputElement.addEventListener('input', () => {
        const query = this.inputElement.value.trim();
        if (query) {
          this.debouncedSearch(query);
        } else {
          this.clearResults();
        }
      });
    }

    async handleSearch(query: string) {
      const locations = await fetchLocations(query);
      this.renderResults(locations);
    }

    renderResults(locations: any[]) {
      this.clearResults();
      locations.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location.display_name;
        this.resultsList.appendChild(li);
      });
    }

    clearResults() {
      this.resultsList.innerHTML = '';
    }
  }
  
  customElements.define('location-search', LocationSearch);
  