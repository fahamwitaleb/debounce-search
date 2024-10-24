"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchLocations(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.log('Error:', error);
            return [];
        }
    });
}
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        return new Promise((resolve) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield func.apply(this, args);
                resolve();
            }), delay);
        });
    };
}
class LocationSearch extends HTMLElement {
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
        this.shadowRoot.append(style, this.inputElement, this.resultsList);
        this.debouncedSearch = debounce(this.handleSearch.bind(this), 1000);
    }
    connectedCallback() {
        this.inputElement.addEventListener('input', () => {
            const query = this.inputElement.value.trim();
            if (query) {
                this.debouncedSearch(query);
            }
            else {
                this.clearResults();
            }
        });
    }
    handleSearch(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const locations = yield fetchLocations(query);
            this.renderResults(locations);
        });
    }
    renderResults(locations) {
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
