const getPopupHTML = ({ title, id }) => {
    return `<div class="marker-popup">
        <p>${title}</p>
        <button class="btn" data-site-action-id="${id}">Filter</button>
    </div>`
}

export {
    getPopupHTML
}