const getPopupHTML = ({ title, site_id, location_id }) => {
    return `<div class="marker-popup">
        <p>${title}</p>
        <button class="btn filter-btn" data-site-action-id="${site_id}" data-location-id="${location_id}">Filter</button>
    </div>`
}

export {
    getPopupHTML
}